/**
 * Ranked Gemini Model Waterfall (Highest reliable full-size Flash -> High-quota fallbacks).
 * When a top-tier model hits its API limit (429), experiences high server demand (503),
 * or times out, it is placed on a global cooldown and the request immediately cascades
 * to the next top-rated model.
 */
export const GEMINI_MODEL_CASCADE: readonly string[] = [
  "gemini-3.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash",
  "gemini-3-flash-preview",
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-flash-latest",
];

interface CooldownEntry {
  until: number;
  reason: string;
}

const globalForCooldowns = globalThis as unknown as {
  __geminiCooldowns?: Map<string, CooldownEntry>;
};

const modelCooldowns: Map<string, CooldownEntry> =
  globalForCooldowns.__geminiCooldowns ??
  (globalForCooldowns.__geminiCooldowns = new Map<string, CooldownEntry>());

const COOLDOWN_DAILY_QUOTA_MS = 15 * 60 * 1000; // 15 min when limit: 0 or daily quota exhausted
const COOLDOWN_RATE_LIMIT_MS = 90 * 1000;       // 90s when per-minute RPM/TPM hit
const COOLDOWN_OVERLOADED_MS = 10 * 60 * 1000;  // 10 min when 503 high demand or timeout
const COOLDOWN_NOT_FOUND_MS = 24 * 60 * 60 * 1000; // 24h when model is 404/deprecated

function markModelCooldown(model: string, status: number | "TIMEOUT", errBody: string): void {
  const now = Date.now();
  if (status === 404) {
    modelCooldowns.set(model, { until: now + COOLDOWN_NOT_FOUND_MS, reason: "404 Not Found" });
    return;
  }
  if (status === 429) {
    const isDailyOrZero =
      errBody.includes("limit: 0") ||
      errBody.includes("PerDay") ||
      errBody.includes("per day");
    const duration = isDailyOrZero ? COOLDOWN_DAILY_QUOTA_MS : COOLDOWN_RATE_LIMIT_MS;
    modelCooldowns.set(model, {
      until: now + duration,
      reason: isDailyOrZero ? "Daily/Tier Quota Exhausted (429)" : "Rate Limit Reached (429)",
    });
    return;
  }
  if (status === 503 || status === "TIMEOUT" || status === 500) {
    modelCooldowns.set(model, {
      until: now + COOLDOWN_OVERLOADED_MS,
      reason: status === "TIMEOUT" ? "Request Timeout" : `Server Busy (${status})`,
    });
  }
}

export function getOrderedAvailableModels(customList?: readonly string[]): string[] {
  const list = customList ?? GEMINI_MODEL_CASCADE;
  const now = Date.now();
  const available: string[] = [];
  const coolingDown: Array<{ model: string; until: number }> = [];

  for (const model of list) {
    const entry = modelCooldowns.get(model);
    if (!entry || now >= entry.until) {
      if (entry) modelCooldowns.delete(model);
      available.push(model);
    } else if (entry.until - now < COOLDOWN_NOT_FOUND_MS / 2) {
      coolingDown.push({ model, until: entry.until });
    }
  }

  if (available.length === 0 && coolingDown.length > 0) {
    coolingDown.sort((a, b) => a.until - b.until);
    return coolingDown.map((c) => c.model);
  }

  return available;
}

export function formatGeminiError(lastErr: string): string {
  if (lastErr.includes("429") || lastErr.includes("RESOURCE_EXHAUSTED") || lastErr.includes("quota")) {
    return "Gemini API rate limit reached across all fallback models. Please wait 30 seconds before retrying, or update your GEMINI_API_KEY in .env.";
  }
  try {
    const parsed = JSON.parse(lastErr);
    if (parsed.error?.message) {
      return `Gemini API Error: ${parsed.error.message}`;
    }
  } catch {
    // ignore parse error
  }
  return `Gemini API busy: ${lastErr || "Please try again in a moment."}`;
}

export interface GeminiCascadeOptions {
  apiKey: string;
  body: Record<string, unknown>;
  models?: readonly string[];
  timeoutMs?: number;
}

export interface GeminiCascadeResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
  modelUsed: string;
}

/**
 * Calls the Gemini generateContent endpoint using the tiered model cascade.
 * Automatically skips models on cooldown and immediately falls back to the next
 * top-rated model when quota (429), overload (503), or timeout occurs.
 */
export async function fetchGeminiWithCascade(
  options: GeminiCascadeOptions
): Promise<GeminiCascadeResult> {
  const { apiKey, body, models, timeoutMs = 15000 } = options;
  const candidateModels = getOrderedAvailableModels(models);
  let lastErr = "";

  for (const model of candidateModels) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        }
      );
      clearTimeout(timer);

      if (!res.ok) {
        lastErr = await res.text();
        markModelCooldown(model, res.status, lastErr);
        console.warn(
          `[GeminiCascade] Model "${model}" returned HTTP ${res.status} — cascading to next top-rated model.`
        );
        continue;
      }

      const data = await res.json();
      return { data, modelUsed: model };
    } catch (err) {
      clearTimeout(timer);
      const isAbort = (err as Error)?.name === "AbortError";
      lastErr = isAbort ? `Model ${model} timed out after ${timeoutMs}ms` : (err as Error)?.message || String(err);
      markModelCooldown(model, isAbort ? "TIMEOUT" : 503, lastErr);
      console.warn(
        `[GeminiCascade] Model "${model}" failed (${lastErr}) — cascading to next top-rated model.`
      );
      continue;
    }
  }

  throw new Error(formatGeminiError(lastErr));
}
