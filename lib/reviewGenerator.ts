import type { PetCareReview } from "./types";

const BRAND = "CuddlyTails";

const SYSTEM_PROMPT = `You are an expert copywriter specializing in authentic, user-generated
content. Return ONLY valid JSON matching the requested schema. Do not include markdown fences
or preamble text.`;

const REFERENCE_EXAMPLE = `"We found Jake through CuddlyTails when we needed someone to watch
our Labrador, Max, for a weekend. He kept us updated with photos and messages, which made it so
much easier to enjoy our trip. Max looked happy the entire time and came home relaxed. We'll
definitely be booking with Jake again!"`;

function buildPrompt(): string {
  return `Your task is to generate exactly THREE highly realistic pet-care reviews. Analyze the
typical style of detailed, story-driven reviews on platforms like Rover.com and replicate that
genuine, personal tone.

Here is a baseline reference example of the tone you must match, but YOU MUST ADD SLIGHTLY MORE STORY/NARRATIVE DEPTH than this example:
${REFERENCE_EXAMPLE}

CRUCIAL REQUIREMENTS FOR EVERY REVIEW:
1. Narrative/Story: Tell a detailed, 3-4 sentence story about a specific situation. Add narrative depth by including a specific slice-of-life detail—such as the dog's unique quirk, a minor complication (like a last-minute flight change or a picky eater), or the owner's initial hesitation before booking. 
2. Character Names: You must explicitly include a realistic name for the Dog and a realistic
   name for the Service Provider (the sitter/walker).
3. The Brand Rule: You must mention the brand name "${BRAND}" EXACTLY ONCE in the text of each
   review. Do not mention it more than once per review so it sounds organic, not like an ad.
4. Tone: Authentic, relieved, and grateful. Use natural phrasing and everyday language.
5. Rating: All three reviews are 5-star testimonials, so "rating" must be 5 for all three.
6. Make the three reviews distinct from each other - different situations, different dogs,
   different providers - do not reuse the reference example's names or scenario.

Return ONLY valid JSON matching this exact schema. Do not include markdown fences (\`\`\`json)
or preamble text.
{
  "reviews": [
    {
      "reviewerName": "string",
      "providerName": "string",
      "dogName": "string",
      "reviewText": "string",
      "rating": 5
    },
    {
      "reviewerName": "string",
      "providerName": "string",
      "dogName": "string",
      "reviewText": "string",
      "rating": 5
    },
    {
      "reviewerName": "string",
      "providerName": "string",
      "dogName": "string",
      "reviewText": "string",
      "rating": 5
    }
  ]
}`;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    reviews: {
      type: "ARRAY",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "OBJECT",
        properties: {
          reviewerName: { type: "STRING" },
          providerName: { type: "STRING" },
          dogName: { type: "STRING" },
          reviewText: { type: "STRING" },
          rating: { type: "INTEGER" },
        },
        required: ["reviewerName", "providerName", "dogName", "reviewText", "rating"],
      },
    },
  },
  required: ["reviews"],
};

function isTransientStatus(status: number): boolean {
  return status === 429 || status === 503;
}

async function callGemini(prompt: string): Promise<{ reviews: PetCareReview[] }> {
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
            temperature: 0.9,
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
      throw new Error("Gemini truncated the review response before finishing the JSON.");
    }

    const raw: string = candidate?.content?.parts?.[0]?.text ?? "{}";
    return JSON.parse(raw) as { reviews: PetCareReview[] };
  }

  throw new Error("Gemini request failed after retries.");
}

function countBrandMentions(text: string): number {
  return (text.match(new RegExp(BRAND, "gi")) ?? []).length;
}

/** Every review must mention the brand exactly once - validate and retry rather than
 *  trusting the prompt alone, since the model can drift (0 mentions or 2+). */
async function generateValidatedReviews(): Promise<PetCareReview[]> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await callGemini(buildPrompt());
    const reviews = result.reviews;

    const shapeOk = Array.isArray(reviews) && reviews.length === 3;
    const brandOk = shapeOk && reviews.every((r) => countBrandMentions(r.reviewText) === 1);

    if (shapeOk && brandOk) return reviews;
  }
  throw new Error(
    "Could not generate 3 reviews each mentioning CuddlyTails exactly once after two attempts."
  );
}

export async function generateReviews(): Promise<PetCareReview[]> {
  return generateValidatedReviews();
}