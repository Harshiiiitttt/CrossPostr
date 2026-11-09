import type { SeoBlog, LinkedInPosts } from "./types";
import { fetchGeminiWithCascade } from "./geminiCascade";

const LINK_EMOJI = "🔗";

const SYSTEM_PROMPT = `You are a world-class LinkedIn content strategist and copywriter for CuddlyTails, a premier pet-care brand.
Your goal is to write short, punchy, highly scannable, and engaging LinkedIn posts for mobile readers and pet parents.
You NEVER write long blog summaries. Every post must follow a crisp, 6-part layout with generous whitespace.
Return ONLY valid JSON matching the requested schema. Do not include markdown fences or preamble text.`;

function blogToContext(blog: SeoBlog): string {
  const sectionSummaries = blog.sections
    .map((s) => {
      const paraText = (s.paragraphs ?? []).join(" ");
      const bulletText = (s.bullets ?? []).map((b) => `• ${b}`).join("\n");
      const subtopicText = (s.subtopics ?? [])
        .map((st) => `${st.subheading}: ${st.paragraphs.join(" ")}`)
        .join("\n");
      return `## ${s.heading}\n${[paraText, bulletText, subtopicText].filter(Boolean).join("\n")}`;
    })
    .join("\n\n");

  return `Title: ${blog.title}\n\nIntro: ${blog.intro.join(" ")}\n\nBlog Body:\n${sectionSummaries}\n\nConclusion: ${blog.conclusion.join(" ")}`;
}

function buildPrompt(blog: SeoBlog): string {
  const context = blogToContext(blog);
  return `Below is the content of an SEO blog post about pet care.
Your task is to generate THREE distinct, short, highly engaging LinkedIn posts based on this topic.

Blog Content:
"""
${context}
"""

EXACT 6-PART POST LAYOUT (MUST FOLLOW THIS STRUCTURE FOR ALL 3 POSTS):

1. ENGAGING HOOK: 1-2 lines with a relevant emoji (e.g. 🐶, ⚠️, 💡, 🦴, 🐾).
2. BRIEF EXPLANATION: 1-2 short sentences explaining why this topic matters to dog owners.
3. KEY TAKEAWAYS: 3–5 concise, punchy bullet points (1 line per bullet) highlighting key signs, causes, or advice.
4. SHORT CLOSING STATEMENT: 1 short sentence encouraging readers to learn more or take proactive care of their pets.
5. LINK PLACEHOLDER: Exactly this line: "${LINK_EMOJI} Read the full blog:" (placed IMMEDIATELY ABOVE the hashtags).
6. HASHTAGS: 4–6 relevant hashtags at the very bottom (e.g. #DogHealth #PetCare #DogOwners #VeterinaryCare #DogLovers).

CONCISENESS & EMOJI GUIDELINES:
- LENGTH: Keep posts concise and scannable (target roughly 120–200 words total).
- MOBILE SCANNABILITY: Use short 1-2 line paragraphs and generous line breaks. Avoid text walls.
- TASTEFUL EMOJIS: Incorporate relevant emojis (e.g. 🐶, ❤️, 🩺, ⚠️, ✅, 💡, 🦴, 🐾) naturally and purposefully—use them sparingly to anchor bullet points and key headers without overusing them.

REQUIRED CONTENT STYLES:

1. "safeBet" (Educational, Professional & Accessible)
- Hook: Relatable question or insightful observation with a warm emoji.
- Body: Accessible educational advice, 3-5 checkmark/bullet points (e.g. ✅, 🐾, 🩺), encouraging closing, "${LINK_EMOJI} Read the full blog:", and hashtags.

2. "cleanLabel" (Clean-Label Teardown — High-Impact & Fact-Focused)
- Hook: A stark, surprising clinical truth or counter-intuitive fact with a sharp emoji (e.g. ⚠️, 🔬, ⚡).
- Body: Zero-fluff explanation, 3-5 punchy bullet points using sleek anchors (e.g. ▪️, ⚡, 🧠), authoritative closing, "${LINK_EMOJI} Read the full blog:", and hashtags.

3. "microStory" (Narrative Case Study & Relatable Scenario)
- Hook: Short, 1-2 sentence real-life scenario or pet story (e.g., "Meet Max 🐶. Yesterday, his owner noticed...").
- Body: Quick transition into 3-5 takeaway bullets, reassuring closing, "${LINK_EMOJI} Read the full blog:", and hashtags.

Return ONLY valid JSON matching this exact schema:
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
  if (!trimmed.includes(LINK_EMOJI)) {
    const hashtagMatch = trimmed.match(/(#[\w\d]+(?:\s+#[\w\d]+)*)$/);
    if (hashtagMatch) {
      const hashtagStr = hashtagMatch[1];
      const mainBody = trimmed.slice(0, trimmed.lastIndexOf(hashtagStr)).trim();
      return `${mainBody}\n\n${LINK_EMOJI} Read the full blog:\n\n${hashtagStr}`;
    }
    return `${trimmed}\n\n${LINK_EMOJI} Read the full blog:`;
  }
  return trimmed;
}

async function callGemini(prompt: string): Promise<LinkedInPosts> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set - see init.md.");

  const { data } = await fetchGeminiWithCascade({
    apiKey,
    body: {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        maxOutputTokens: 8192,
        temperature: 0.8,
      },
    },
  });

  const candidate = data.candidates?.[0];

  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new Error("Gemini truncated the LinkedIn response before finishing the JSON.");
  }

  let raw: string = candidate?.content?.parts?.[0]?.text ?? "{}";
  raw = raw.replace(/<b>(.*?)<\/b>/gi, "$1").replace(/<strong>(.*?)<\/strong>/gi, "$1");
  return JSON.parse(raw) as LinkedInPosts;
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