import type { PetCareReview } from "./types";

const BRAND = "CuddlyTails";

const SYSTEM_PROMPT = `You are an expert copywriter specializing in authentic, user-generated
content. Return ONLY valid JSON matching the requested schema. Do not include markdown fences
or preamble text.`;

const REFERENCE_EXAMPLE = `"We found Jake through CuddlyTails when we needed someone to watch
our Labrador, Max, for a weekend. He kept us updated with photos and messages, which made it so
much easier to enjoy our trip. Max looked happy the entire time and came home relaxed. We'll
definitely be booking with Jake again!"`;

export interface ReviewGenOptions {
  serviceType?: string;
  location?: string;
  persona?: string;
  reviewLength?: "detailed" | "short";
}

function buildPrompt(options?: ReviewGenOptions): string {
  const serviceType = options?.serviceType || "Pet Sitting / Dog Care";
  const location = options?.location ? ` in ${options.location}` : "";
  const persona = options?.persona || "Authentic & Grateful Pet Parent";
  const reviewLength = options?.reviewLength || "detailed";

  const lengthInstruction = reviewLength === "short"
    ? "Length constraint: Short Testimonial format. Each review MUST be punchy and concise (1-2 sentences maximum), focusing on immediate relief and high satisfaction."
    : "Length constraint: Detailed Story format. Tell a 3-4 sentence story about a specific situation with slice-of-life details (quirks, last-minute flight, photo updates).";

  return `Your task is to generate exactly THREE highly realistic pet-care reviews. Analyze the
typical style of detailed, story-driven reviews on platforms like Rover.com and replicate that
genuine, personal tone.

TARGET PARAMETERS:
- Service Type: ${serviceType}${location}
- Persona / Tone Angle: ${persona}
- Format & Length: ${lengthInstruction}

Here is a baseline reference example of the tone you must match:
${REFERENCE_EXAMPLE}

CRUCIAL REQUIREMENTS FOR EVERY REVIEW:
1. Narrative/Format: ${lengthInstruction}
2. Character Names & Dog Breed: You must explicitly include a realistic name for the Dog, the Dog Breed (e.g. Golden Retriever, French Bulldog, German Shepherd, Rescue Mix, Labradoodle), and a realistic name for the Service Provider (the sitter/walker).
3. The Brand Rule: You must mention the brand name "${BRAND}" EXACTLY ONCE in the text of each
   review. Do not mention it more than once per review so it sounds organic, not like an ad.
4. Tone: Reflect the requested persona (${persona}). Authentic, relieved, and grateful. Use natural phrasing and everyday language.
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
      "dogBreed": "string",
      "reviewText": "string",
      "rating": 5
    },
    {
      "reviewerName": "string",
      "providerName": "string",
      "dogName": "string",
      "dogBreed": "string",
      "reviewText": "string",
      "rating": 5
    },
    {
      "reviewerName": "string",
      "providerName": "string",
      "dogName": "string",
      "dogBreed": "string",
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
          dogBreed: { type: "STRING" },
          reviewText: { type: "STRING" },
          rating: { type: "INTEGER" },
        },
        required: ["reviewerName", "providerName", "dogName", "dogBreed", "reviewText", "rating"],
      },
    },
  },
  required: ["reviews"],
};

function isTransientStatus(status: number): boolean {
  return status === 429 || status === 503;
}

function formatGeminiError(lastErr: string): string {
  if (lastErr.includes("429") || lastErr.includes("RESOURCE_EXHAUSTED") || lastErr.includes("quota")) {
    return "Gemini API rate limit reached (Quota Exceeded on Free Tier). Please wait 30 seconds before retrying, or update your GEMINI_API_KEY in .env.";
  }
  try {
    const parsed = JSON.parse(lastErr);
    if (parsed.error?.message) {
      return `Gemini API Error: ${parsed.error.message}`;
    }
  } catch {
    // ignore
  }
  return `Gemini API busy: ${lastErr || "Please try again in a moment."}`;
}

async function callGemini(prompt: string): Promise<PetCareReview[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set - see init.md.");

  const models = ["gemini-3.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-flash-lite-latest"];
  let lastErr = "";

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
            },
          }),
        }
      );

      if (!res.ok) {
        lastErr = await res.text();
        if (isTransientStatus(res.status)) {
          await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1)));
          continue;
        }
        break;
      }

      const data = await res.json();
      const candidate = data.candidates?.[0];

      if (candidate?.finishReason === "MAX_TOKENS") {
        throw new Error("Gemini truncated the review response before finishing the JSON.");
      }

      const raw: string = candidate?.content?.parts?.[0]?.text ?? "{}";
      const parsed = JSON.parse(raw) as { reviews: PetCareReview[] };
      return parsed.reviews;
    }
  }

  throw new Error(formatGeminiError(lastErr));
}

function countBrandMentions(text: string): number {
  return (text.match(new RegExp(BRAND, "gi")) ?? []).length;
}

/** Every review must mention the brand exactly once - validate and retry rather than
 *  trusting the prompt alone, since the model can drift (0 mentions or 2+). */
function getMockReviews(options?: ReviewGenOptions): PetCareReview[] {
  const service = options?.serviceType || "Dog Walking & Pet Care";
  const location = options?.location ? ` in ${options.location}` : "";
  return [
    {
      reviewerName: "Sarah M.",
      providerName: "Marcus",
      dogName: "Buster",
      dogBreed: "French Bulldog",
      reviewText: `When my last-minute flight got delayed, I was frantic about finding ${service.toLowerCase()}${location}. Luckily I found Marcus through CuddlyTails, and he handled Buster with so much love and care. Marcus sent me photo updates showing Buster happily trotting along, which instantly eased all my anxiety.`,
      rating: 5,
    },
    {
      reviewerName: "David L.",
      providerName: "Elena",
      dogName: "Bella",
      dogBreed: "Rescue Mix",
      reviewText: `I had an emergency work meeting and booked Elena on CuddlyTails for ${service.toLowerCase()}${location}. She saved the day by stepping in to take my reactive Rescue Mix, Bella, for a calm afternoon stroll. She sent detailed logs and pictures afterward—Elena is a total lifesaver!`,
      rating: 5,
    },
    {
      reviewerName: "Jessica T.",
      providerName: "Kevin",
      dogName: "Barnaby",
      dogBreed: "Golden Retriever",
      reviewText: `My Golden Retriever Barnaby gets separation anxiety, so finding Kevin on CuddlyTails was a complete miracle. Kevin showed up right on time, gave Barnaby belly rubs, and sent photos that brought tears of relief to my eyes. I'm so grateful for such incredible pet care.`,
      rating: 5,
    },
  ];
}

async function generateValidatedReviews(options?: ReviewGenOptions): Promise<PetCareReview[]> {
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const reviews = await callGemini(buildPrompt(options));

      const shapeOk = Array.isArray(reviews) && reviews.length === 3;
      const brandOk = shapeOk && reviews.every((r) => countBrandMentions(r.reviewText) === 1);

      if (shapeOk && brandOk) return reviews;
    }
  } catch (err) {
    console.warn("Gemini call failed, using fallback mock review generator:", (err as Error).message);
    return getMockReviews(options);
  }
  return getMockReviews(options);
}

export async function generateReviews(options?: ReviewGenOptions): Promise<PetCareReview[]> {
  return generateValidatedReviews(options);
}