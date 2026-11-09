import type { PetCareReview } from "./types";
import { fetchGeminiWithCascade } from "./geminiCascade";

const BRAND = "CuddlyTails";

const SYSTEM_PROMPT = `You are an expert copywriter specializing in authentic, user-generated
pet-care testimonials. Return ONLY valid JSON matching the requested schema. Do not include markdown
fences or preamble text.`;

export interface ReviewGenOptions {
  serviceType?: string;
  location?: string;
  persona?: string;
  reviewLength?: "detailed" | "short";
}

const REVIEWER_POOL = [
  "Hannah R.", "Carlos V.", "Priya K.", "Nathan W.", "Olivia S.", "Ethan P.",
  "Chloe B.", "Julian M.", "Maya T.", "Liam D.", "Sophia G.", "Noah F.",
  "Claire H.", "Mateo J.", "Rachel N.", "lucas C.", "Amara L.", "Daniel K.",
  "Megan S.", "Trevor B.", "Elena R.", "twyla W.", "Owen H.", "Vanessa P.",
  "abigail T.", "zoe M.", "Brandon Y.", "Sienna C.", "gavin R.", "Tessa L.",
].map((n) => n.charAt(0).toUpperCase() + n.slice(1));

const PROVIDER_POOL = [
  "Liam", "Maya", "Noah", "Zoe", "Caleb", "Sienna", "Julian", "Aria",
  "Owen", "Tessa", "Mateo", "Clara", "Isaac", "Nora", "Leo", "camila",
  "Miles", "stella", "Ezra", "Hazel", "Asher", "Ruby", "Cole", "Sadie",
  "jonah", "eva", "Devon", "Paige", "Micah", "Brooke",
].map((n) => n.charAt(0).toUpperCase() + n.slice(1));

const DOG_POOL: Array<{ name: string; breed: string }> = [
  { name: "Cooper", breed: "Australian Shepherd" },
  { name: "Milo", breed: "Cavalier King Charles Spaniel" },
  { name: "Daisy", breed: "Mini Bernedoodle" },
  { name: "Loki", breed: "Siberian Husky" },
  { name: "Waffles", breed: "Pembroke Welsh Corgi" },
  { name: "Rosie", breed: "Beagle" },
  { name: "Ziggy", breed: "Miniature Schnauzer" },
  { name: "Koda", breed: "Shiba Inu" },
  { name: "Penny", breed: "Dachshund" },
  { name: "Theo", breed: "Boxer" },
  { name: "Willow", breed: "Border Collie" },
  { name: "Otis", breed: "Pug" },
  { name: "Nala", breed: "Vizsla" },
  { name: "Finn", breed: "Irish Setter" },
  { name: "Pippa", breed: "Cocker Spaniel" },
  { name: "Archie", breed: "Goldendoodle" },
  { name: "Bruno", breed: "Bernese Mountain Dog" },
  { name: "pepper", breed: "Boston Terrier" },
  { name: "Monty", breed: "Basset Hound" },
  { name: "Hazel", breed: "Havanese" },
  { name: "Jasper", breed: "Whippet" },
  { name: "Olive", breed: "Cavapoo" },
  { name: "Remy", breed: "Samoyed" },
  { name: "Scout", breed: "Dalmatian" },
].map((d) => ({ name: d.name.charAt(0).toUpperCase() + d.name.slice(1), breed: d.breed }));

const SERVICE_SCENARIOS: Record<string, string[]> = {
  "In-Home Boarding & Sitting": [
    "a 4-day out-of-state family wedding where the dog stayed comfortably in the sitter's quiet home",
    "a week-long anniversary trip where the sitter kept the dog's exact bedtime and mealtime routine",
    "a weekend conference where the sitter welcomed the dog into a cozy, fenced-yard home environment",
    "a holiday family visit where the sitter provided constant companionship and playtime indoors",
    "a 5-day business trip where the dog bonded immediately with the sitter and felt right at home",
  ],
  "Dog Walking & Exercise": [
    "a midday energetic 45-minute park walk with GPS route tracking and water breaks during a busy workday",
    "structured leash walking and sniff-time along quiet neighborhood trails to burn off high puppy energy",
    "consistent weekday afternoon walks that transformed a restless dog's daily routine",
    "a brisk morning trail walk with real-time photo check-ins while the owner was stuck on back-to-back calls",
    "a customized pace walk avoiding crowded sidewalks for a shy dog who loves outdoor exploration",
  ],
  "Pet Grooming & Spa": [
    "a full de-shedding bath, gentle blow-dry, ear cleaning, and nail trim that left the coat silky soft",
    "a stress-free puppy spa session with hypoallergenicoat shampoo and patient paw trimming",
    "a thorough coat detangling and sanitary trim for a fluffy dog who is usually nervous around clippers",
    "a soothing oatmeal skin-relief bath and blueberry facial that left the dog smelling fresh for weeks",
    "a summer coat tidy-up, paw pad balm treatment, and gentle brushing handled with zero stress",
  ],
  "Overnight Care & House Sitting": [
    "staying overnight in the owner's home to keep a routine-loving dog comfortable in their own bed",
    "a 3-night house-sitting stay keeping up with evening walks, mail collection, and morning cuddles",
    "overnight pet sitting where the sitter followed a detailed feeding and evening wind-down checklist",
    "a long weekend house-sit where the dog didn't experience a single moment of kennel stress",
    "multi-night in-home care with late-night potty breaks and morning photo updates from the living room",
  ],
  "Last-Minute Emergency Care": [
    "an unexpected hospital visit where a vetted sitter stepped in within two hours of booking",
    "a sudden cancelled flight at the airport that required an urgent evening walk and dinner feeding",
    "a last-minute family emergency out of town when the original sitter cancelled the night before",
    "an urgent late-evening work crisis where a reliable caregiver arrived right on time to save the day",
    "a surprise same-day travel delay where immediate pet care was arranged seamlessly in minutes",
  ],
};

const globalRecentMemory = globalThis as unknown as {
  __recentDogNames?: string[];
  __recentProviderNames?: string[];
};

function pickFreshCast() {
  const recentDogs = globalRecentMemory.__recentDogNames ?? (globalRecentMemory.__recentDogNames = []);
  const recentProviders = globalRecentMemory.__recentProviderNames ?? (globalRecentMemory.__recentProviderNames = []);

  const availableDogs = DOG_POOL.filter((d) => !recentDogs.includes(d.name));
  const dogSource = availableDogs.length >= 3 ? availableDogs : DOG_POOL;
  const shuffledDogs = [...dogSource].sort(() => Math.random() - 0.5).slice(0, 3);

  const availableProviders = PROVIDER_POOL.filter((p) => !recentProviders.includes(p));
  const providerSource = availableProviders.length >= 3 ? availableProviders : PROVIDER_POOL;
  const shuffledProviders = [...providerSource].sort(() => Math.random() - 0.5).slice(0, 3);

  const shuffledReviewers = [...REVIEWER_POOL].sort(() => Math.random() - 0.5).slice(0, 3);

  shuffledDogs.forEach((d) => recentDogs.push(d.name));
  if (recentDogs.length > 15) recentDogs.splice(0, recentDogs.length - 15);

  shuffledProviders.forEach((p) => recentProviders.push(p));
  if (recentProviders.length > 15) recentProviders.splice(0, recentProviders.length - 15);

  return [0, 1, 2].map((i) => ({
    reviewerName: shuffledReviewers[i],
    providerName: shuffledProviders[i],
    dogName: shuffledDogs[i].name,
    dogBreed: shuffledDogs[i].breed,
  }));
}

function pickScenarios(serviceType: string): string[] {
  const pool =
    SERVICE_SCENARIOS[serviceType] ||
    Object.values(SERVICE_SCENARIOS).flat();
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
}

function buildPrompt(
  options: ReviewGenOptions | undefined,
  cast: ReturnType<typeof pickFreshCast>,
  scenarios: string[]
): string {
  const serviceType = options?.serviceType || "In-Home Boarding & Sitting";
  const location = options?.location ? ` in ${options.location}` : "";
  const persona = options?.persona || "Enthusiastic Pet Parent";
  const reviewLength = options?.reviewLength || "detailed";

  const lengthInstruction =
    reviewLength === "short"
      ? "Short Testimonial format: Each review MUST be punchy and concise (1–2 sentences, ~25–40 words), focusing on immediate relief and satisfaction."
      : "Detailed Story format: Each review MUST be a rich 3–4 sentence story (~55–80 words) with specific slice-of-life details matching the assigned scenario, service type, and persona.";

  return `Generate exactly THREE realistic, distinct 5-star pet-care reviews tailored to these exact filter settings:

FILTER PARAMETERS:
- Service Type: "${serviceType}"${location}
- Customer Persona / Voice: "${persona}"
- Review Length Format: ${lengthInstruction}

MANDATORY CHARACTER & SCENARIO ASSIGNMENTS (Use these exact names, breeds, and distinct storylines):
- Review 1:
  • Reviewer Name: "${cast[0].reviewerName}"
  • Sitter/Walker/Groomer Name: "${cast[0].providerName}"
  • Dog Name & Breed: "${cast[0].dogName}" (${cast[0].dogBreed})
  • Specific Story Scenario: ${scenarios[0]}${location}
- Review 2:
  • Reviewer Name: "${cast[1].reviewerName}"
  • Sitter/Walker/Groomer Name: "${cast[1].providerName}"
  • Dog Name & Breed: "${cast[1].dogName}" (${cast[1].dogBreed})
  • Specific Story Scenario: ${scenarios[1]}${location}
- Review 3:
  • Reviewer Name: "${cast[2].reviewerName}"
  • Sitter/Walker/Groomer Name: "${cast[2].providerName}"
  • Dog Name & Breed: "${cast[2].dogName}" (${cast[2].dogBreed})
  • Specific Story Scenario: ${scenarios[2]}${location}

CRUCIAL RULES:
1. Every review MUST unmistakably reflect the selected Service Type ("${serviceType}") and Customer Persona ("${persona}")${location ? ` and naturally reference ${options!.location}` : ""}.
2. Mention the brand name "${BRAND}" EXACTLY ONCE in each review's text.
3. Never reuse generic filler across the 3 reviews—each review must sound written by a different person with a distinct voice and storyline.
4. All three ratings must be 5.

Return ONLY valid JSON matching the schema.`;
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

function ensureSingleBrandMention(review: PetCareReview): PetCareReview {
  let text = (review.reviewText || "").trim();
  const regex = new RegExp(BRAND, "gi");
  const matches = text.match(regex) ?? [];

  if (matches.length === 0) {
    // Insert CuddlyTails naturally after providerName or in first sentence
    if (review.providerName && text.includes(review.providerName)) {
      text = text.replace(review.providerName, `${review.providerName} on ${BRAND}`);
    } else {
      text = `Booking through ${BRAND} was the best decision—${text.charAt(0).toLowerCase()}${text.slice(1)}`;
    }
  } else if (matches.length > 1) {
    let seen = 0;
    text = text.replace(regex, (m) => {
      seen++;
      return seen === 1 ? m : "the app";
    });
  }

  return {
    ...review,
    rating: 5,
    reviewText: text,
  };
}

async function callGemini(prompt: string): Promise<PetCareReview[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set - see init.md.");

  const { data } = await fetchGeminiWithCascade({
    apiKey,
    timeoutMs: 14000,
    body: {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        maxOutputTokens: 4096,
        temperature: 0.95,
      },
    },
  });

  const candidate = data.candidates?.[0];

  if (candidate?.finishReason === "MAX_TOKENS") {
    throw new Error("Gemini truncated the review response before finishing the JSON.");
  }

  const raw: string = candidate?.content?.parts?.[0]?.text ?? "{}";
  const parsed = JSON.parse(raw) as { reviews: PetCareReview[] };
  return (parsed.reviews || []).map(ensureSingleBrandMention);
}

function getDynamicFallbackReviews(
  options: ReviewGenOptions | undefined,
  cast: ReturnType<typeof pickFreshCast>,
  scenarios: string[]
): PetCareReview[] {
  const service = options?.serviceType || "In-Home Boarding & Sitting";
  const loc = options?.location ? ` in ${options.location}` : "";
  const persona = options?.persona || "Enthusiastic Pet Parent";
  const isShort = options?.reviewLength === "short";

  return cast.map((c, idx) => {
    const scenario = scenarios[idx] || "a weekend care session";
    if (isShort) {
      const shortTemplates = [
        `Found ${c.providerName} on ${BRAND} for ${service.toLowerCase()}${loc}, and ${c.dogName} (${c.dogBreed}) had the best time! Constant photo updates gave me total peace of mind.`,
        `As a ${persona.toLowerCase()}, booking ${c.providerName} through ${BRAND}${loc} for ${c.dogName} was effortless and reassuring. Truly five-star ${service.toLowerCase()}!`,
        `${c.providerName} on ${BRAND} took incredible care of my ${c.dogBreed}, ${c.dogName}${loc}. Punctual, gentle, and kept me updated the entire time!`,
      ];
      return {
        ...c,
        rating: 5,
        reviewText: shortTemplates[idx % shortTemplates.length],
      };
    }

    const detailedTemplates = [
      `We needed ${service.toLowerCase()}${loc} during ${scenario}, and connecting with ${c.providerName} on ${BRAND} was a blessing. My ${c.dogBreed}, ${c.dogName}, immediately warmed up to ${c.providerName}'s calm and attentive energy. Getting photo updates and detailed check-ins throughout the booking completely eased my mind, and ${c.dogName} came back happy and relaxed.`,
      `Speaking from the perspective of a ${persona.toLowerCase()}, I'm always selective about ${service.toLowerCase()}${loc}. Booking ${c.providerName} through ${BRAND} for ${scenario} exceeded every expectation for my ${c.dogBreed}, ${c.dogName}. ${c.providerName} followed every instruction to the letter and sent thoughtful updates that made all the difference.`,
      `During ${scenario}${loc}, ${c.providerName} on ${BRAND} provided phenomenal ${service.toLowerCase()} for our ${c.dogBreed}, ${c.dogName}. From arriving right on schedule to paying close attention to ${c.dogName}'s quirks, ${c.providerName} went above and beyond. We already have our next session queued up!`,
    ];

    return {
      ...c,
      rating: 5,
      reviewText: detailedTemplates[idx % detailedTemplates.length],
    };
  });
}

export async function generateReviews(options?: ReviewGenOptions): Promise<PetCareReview[]> {
  const cast = pickFreshCast();
  const scenarios = pickScenarios(options?.serviceType || "In-Home Boarding & Sitting");

  try {
    const reviews = await callGemini(buildPrompt(options, cast, scenarios));
    if (Array.isArray(reviews) && reviews.length === 3) {
      return reviews;
    }
  } catch (err) {
    console.warn("Gemini call failed, using dynamic filter-aware review generator:", (err as Error).message);
  }

  return getDynamicFallbackReviews(options, cast, scenarios);
}
