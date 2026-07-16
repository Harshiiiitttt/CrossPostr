import type { SeoBlog, LinkedInPosts } from "./types";

const LINK_EMOJI = "🔗";

const SYSTEM_PROMPT = `You are a social media copywriter for a pet-care brand called CuddlyTails,
repurposing a blog article into LinkedIn posts. Return ONLY valid JSON matching the requested
schema. No markdown fences, no preamble, no asterisks or markdown formatting inside the posts.`;

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
  return `Using this blog as source material, write 3 distinct LinkedIn post variations that
repurpose it for the CuddlyTails company LinkedIn page. Each must be a complete, ready-to-post
LinkedIn update in its own right - not a summary of the blog and not meta-commentary about it.

Blog source material:
"""
${context}
"""

Write these three distinct angles:
1. "safeBet": A straightforward, professional, brand-safe post - a clear value statement in a
   credible tone with minimal risk. 3-5 sentences.
2. "cleanLabel": A transparency-forward post that reads like plain-spoken, honest pet care
   advice - no jargon, no hype, straight talk from a trusted source. 3-5 sentences.
3. "microStory": A short narrative-style post that opens with a relatable dog-owner moment or
   scenario, then ties it back to the blog's core insight. 3-5 sentences.

Requirements for all three:
- Use natural line breaks like a real LinkedIn post - short paragraphs, not one dense block.
- No hashtags unless they add real value - keep it sparse if used at all.
- No markdown formatting, no asterisks, no headers.
- Each post must end, on its own at the very end, with this exact link emoji: ${LINK_EMOJI}

Return JSON: {"safeBet": string, "cleanLabel": string, "microStory": string}`;
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

async function callGemini(prompt: string): Promise<LinkedInPosts> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set - see init.md.");

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
    throw new Error(`Gemini API error: ${res.status} - ${errBody}`);
  }

  const data = await res.json();
  const candidate = data.candidates?.[0];

  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new Error("Gemini truncated the LinkedIn post response before finishing the JSON.");
  }

  const raw: string = candidate?.content?.parts?.[0]?.text ?? "{}";
  return JSON.parse(raw) as LinkedInPosts;
}

/** Generates 3 LinkedIn post variations (Safe Bet, Clean-Label, Micro-Story) from a
 *  completed blog, each guaranteed to end with the link emoji. */
export async function generateLinkedInPosts(blog: SeoBlog): Promise<LinkedInPosts> {
  const result = await callGemini(buildPrompt(blog));
  return {
    safeBet: ensureLinkEmoji(result.safeBet),
    cleanLabel: ensureLinkEmoji(result.cleanLabel),
    microStory: ensureLinkEmoji(result.microStory),
  };
}