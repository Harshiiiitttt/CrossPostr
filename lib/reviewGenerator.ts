import type { CuddlytailsReview } from "./types";

const SERVICES: CuddlytailsReview["service"][] = [
  "Pet Sitter",
  "Dog Walker",
  "AI Vet",
  "AI Pet Nutrition",
];

const SYSTEM_PROMPT = `You write short customer reviews for cuddlytails.com as if you were a real
dog owner who used the service. Return ONLY valid JSON, no markdown fences, no preamble.`;

function buildUserPrompt(service: string): string {
  return `Write one highly humanized customer review for the "${service}" service on
cuddlytails.com. Requirements:
- The review TEXT itself must be 70 to 90 words, exactly in that range.
- Mention a specific dog by name (invent one) as the reviewer's own dog.
- Mention a specific service person by name (invent a realistic first + last name).
- Sound like a real, slightly imperfect person wrote it - casual, specific, no marketing language.
- Naturally weave in 2-4 relevant emojis inside the review text itself (dog/paw/heart/sparkle
  style emojis), placed like a real person texting, not clustered all at once.
- Separately (not counted in the 70-90 word count), provide 5-7 short hashtags relevant to the
  service and the dog-care topic, written without the "#" symbol (it gets added later). Always
  include "CuddlyTails" as one of them.
Return JSON: {
  "reviewerName": string,
  "dogName": string,
  "servicePersonName": string,
  "text": string,
  "hashtags": string[]
}`;
}

async function callGemini(prompt: string): Promise<{
  reviewerName: string;
  dogName: string;
  servicePersonName: string;
  text: string;
  hashtags: string[];
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set - see init.md.");

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${errorData}`);
  }

  const data = await res.json();
  const raw = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";

  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

export async function generateReviews(): Promise<CuddlytailsReview[]> {
  const reviews: CuddlytailsReview[] = [];
  for (const service of SERVICES) {
    const result = await callGemini(buildUserPrompt(service));

    const hashtagLine = result.hashtags
      .map((h) => `#${h.replace(/^#/, "")}`)
      .join(" ");
    const fullText = `${result.text}\n\n🔗 [link]\n${hashtagLine}`;

    reviews.push({
      service,
      reviewerName: result.reviewerName,
      dogName: result.dogName,
      servicePersonName: result.servicePersonName,
      text: fullText,
      wordCount: result.text.trim().split(/\s+/).length,
    });
  }
  return reviews;
}