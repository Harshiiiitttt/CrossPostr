import type { SeoBlog, LinkedInPosts } from "./types";

const LINK_EMOJI = "🔗";

const SYSTEM_PROMPT = `You are an expert social media copywriter for a pet-care brand called
CuddlyTails. Return ONLY valid JSON matching the requested schema. Do not include markdown
fences or preamble text.`;

function blogToContext(blog: SeoBlog): string {
  const sectionSummaries = blog.sections
    .map((s) => {
      const paraPreview = (s.paragraphs ?? [])[0] ?? "";
      const bulletPreview = (s.bullets ?? []).slice(0, 3).join("; ");
      const subtopicPreview = (s.subtopics ?? [])
        .map((st) => `${st.subheading}: ${st.paragraphs[0] ?? ""}`)
        .join(" | ");
      return `${s.heading}: ${[paraPreview, bulletPreview, subtopicPreview]
        .filter(Boolean)
        .join(" ")}`.trim();
    })
    .join("\n");

  return `Title: ${blog.title}\nIntro: ${blog.intro.join(" ")}\nKey sections:\n${sectionSummaries}`;
}

function buildPrompt(blog: SeoBlog): string {
  const context = blogToContext(blog);
  return `I will provide you with the content of an SEO blog post below. Your task is to
generate exactly THREE different LinkedIn posts to promote this blog, offering three distinct
aesthetic approaches.

Blog content:
"""
${context}
"""

CRUCIAL EMOJI RULE:
Do NOT strip emojis from the output. You must use emojis strategically in ALL THREE variations
to break up the text, add visual interest, and set the tone. Every post must also end with the
link emoji (${LINK_EMOJI}) and relevant hashtags.

Generate the following three styles:

1. The "Safe Bet" (Standard Marketing)
- Tone: Friendly, accessible, and community-focused.
- Emojis: Go heavy on warm, friendly, and expressive emojis throughout (e.g., 🐶, 💙, 🐾, ⚡, ✨)
  to match standard pet-care marketing.
- Hook: Start with a relatable question based on the topic (e.g., "Has your dog been unusually
  tired lately?").
- Body: Briefly mention the underlying issues without getting too technical.
- CTA: "Learn the common causes and when it's time to visit the vet."

2. The "Clean-Label" Teardown (High-End & Minimalist)
- Tone: Radical transparency, authoritative, contrarian, and zero-fluff.
- Emojis: Use sleek, minimalist, or tech-oriented emojis to act as sharp visual anchors or
  bullet points (e.g., ⚡, 🧠, 🔬, 🩺, ▪️). Avoid overly cartoonish faces.
- Hook: Start with a stark, controversial truth or hard fact from the blog that disrupts
  standard assumptions.
- Body: Break down the reality of the situation using short, punchy sentences.
- CTA: "We broke down the exact clinical signs. Stop guessing and read the full guide."

3. The "Micro-Story" (Narrative Case Study)
- Tone: Empathetic, narrative-driven, and highly realistic.
- Emojis: Use emotional or sequential emojis to help pace the story (e.g., 🥺, 🏥, 💡, 🐕).
- Hook: Introduce a specific, realistic scenario with an invented dog (e.g., "Meet Luna. She's
  7 years old, and yesterday, her owner noticed a milky haze...").
- Body: Walk through the initial signs and the realization of the medical issue based on the
  blog's content.
- CTA: "Find out what to do if you notice these early warning signs in your own dog."

Return ONLY valid JSON matching this exact schema. Do not include markdown fences (\`\`\`json)
or preamble text.
{
  "safeBet": "string",
  "cleanLabel": "string",
  "microStory": "string"
}`;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    safeBet: { type: "STRING" },
    cleanLabel: { type: "STRING" },
    microStory: { type: "STRING" },
  },
  required: ["safeBet", "cleanLabel", "microStory"],
};

function ensureLinkEmoji(text: string): string {
  const trimmed = text.trim();
  return trimmed.endsWith(LINK_EMOJI) ? trimmed : `${trimmed}\n\n${LINK_EMOJI}`;
}

function isTransientStatus(status: number): boolean {
  return status === 429 || status === 503;
}

async function callGemini(prompt: string): Promise<LinkedInPosts> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set - see init.md.");

  const maxRetries = 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: RESPONSE_SCHEMA,
            maxOutputTokens: 2048,
            temperature: 0.8,
            thinkingConfig: {
              thinkingBudget: 0,
            },
          },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      if (isTransientStatus(res.status) && attempt < maxRetries) {
        const delayMs = 1000 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }
      throw new Error(
        isTransientStatus(res.status)
          ? "Gemini is currently overloaded (high demand) and didn't recover after retries. Try again in a minute."
          : `Gemini API error: ${res.status} - ${errBody}`
      );
    }

    const data = await res.json();
    const candidate = data.candidates?.[0];

    if (candidate?.finishReason === "MAX_TOKENS") {
      throw new Error("Gemini truncated the LinkedIn post response before finishing the JSON.");
    }

    const raw: string = candidate?.content?.parts?.[0]?.text ?? "{}";
    return JSON.parse(raw) as LinkedInPosts;
  }

  throw new Error("Gemini request failed after retries.");
}

/** Generates 3 LinkedIn post variations (Safe Bet, Clean-Label Teardown, Micro-Story) from a
 *  completed blog, each guaranteed to end with the link emoji. */
export async function generateLinkedInPosts(blog: SeoBlog): Promise<LinkedInPosts> {
  const result = await callGemini(buildPrompt(blog));
  return {
    safeBet: ensureLinkEmoji(result.safeBet),
    cleanLabel: ensureLinkEmoji(result.cleanLabel),
    microStory: ensureLinkEmoji(result.microStory),
  };
}