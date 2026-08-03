import type { SeoBlog } from "./types";

const VET_CTA = "Get help from a CuddlyTails AI vet here.";

const SYSTEM_PROMPT = `You are an expert, empathetic SEO content writer for a pet-care brand called CuddlyTails.
You write for everyday dog owners with little to no medical knowledge.
Return ONLY valid JSON matching the requested schema. No markdown fences, no preamble, no HTML tags.`;

const STRUCTURE_GUIDE = `Section Structure & Writing Style Guidelines:

WRITING STYLE & TONE (CRITICAL):
- Target Audience: Everyday dog owners who have little to no medical knowledge and may be worried about their pet.
- Language: Simple, conversational English (approximately Grade 6–8 reading level).
- Friendly, informative, and reassuring—never sound like a dense medical textbook or clinical manual.
- Avoid complex veterinary jargon and unnecessarily long explanations.
- Explain medical terms in plain language immediately whenever they are introduced.
- Maintain medical accuracy while simplifying the language.
- Avoid repeating the same information across different sections.

EXAMPLES OF CONTRAST TO FOLLOW:
- Instead of: "Canine pancreatitis is characterized by inflammation of the pancreas resulting in digestive enzyme dysregulation."
  Write: "Pancreatitis happens when your dog's pancreas becomes swollen and irritated. This makes it difficult for your dog to digest food properly and can make them feel very sick."
- Instead of: "Clinical manifestations include gastrointestinal disturbances."
  Write: "Your dog may vomit, stop eating, seem tired, or have stomach pain."

BLOG STRUCTURE (Exactly 6-7 H2 sections in top-level "sections" array):
1. Introduction: Briefly explain what the condition is and why dog owners should care.
2. What Is It?: Explain the condition in simple, everyday language without textbook-style definitions.
3. How Does It Affect Your Dog?: Explain what the condition does inside the dog's body simply, how the dog feels, and how it impacts daily life.
4. Signs to Watch For: List common symptoms owners will notice at home using clear, compact bullet points.
5. Causes: Explain common causes and risk factors simply.
6. Treatment & Prevention: Provide a brief overview of treatment options and practical prevention tips.
7. When Should You See a Vet?: Explain when to seek veterinary care, encouraging timely treatment without creating unnecessary fear.
Followed by:
- Final Thoughts (Conclusion): A short, reassuring summary with practical advice.
- 5 simple, SEO-friendly FAQs related to the topic.

RHYTHM & SCHEMA RULES:
- H1 Title: SEO-friendly (50-60 characters, ~6-9 words), catchy, natural question or statement a worried owner would search online.
- Causes / What Is It section can use H3 "subtopics" to break down distinct causes or types in plain English.
- Sections with lists (Signs, Treatment, Prevention, When to See a Vet) follow this three-part rhythm: (1) short setup sentence, (2) 4-6 specific bullet points in simple words, (3) short closing sentence.
- The mandatory vet CTA string immediately follows before the conclusion.`;

function buildPrompt(topic: string): string {
  return `Write a simple, reader-friendly, SEO-optimized blog post for everyday dog owners about: "${topic}".

${STRUCTURE_GUIDE}

Blog Length & Budget Requirements:
- Generate a blog that is approximately 1,200 words long in total (across intro + all sections + conclusion). Aim specifically for 1,150–1,250 words.
- Maintain high-quality, informative, and engaging content. Do not artificially increase the word count with repetitive information or unnecessary filler—every section should provide value to the reader.
- Word budget guide:
  - Intro: ~100-120 words.
  - What Is It?: ~150-180 words.
  - How Does It Affect Your Dog?: ~150-180 words.
  - Signs to Watch For: ~150-180 words.
  - Causes (subtopics): ~250-300 words.
  - Treatment & Prevention: ~200-240 words.
  - When Should You See a Vet?: ~120-150 words.
  - Final Thoughts (Conclusion): ~100-120 words.

SEO Requirements:
- Catchy, SEO-friendly title (50-60 characters, no generic "A Comprehensive Guide" or "Ultimate Guide").
- Clear H2 and H3 headings matching the structure.
- Natural keyword placement.
- Featured-snippet-friendly explanations.
- 5 FAQs included separately via FAQ prompt.

Additional requirements:
- No HTML tags anywhere. Plain text only.
- The "vetCta" field must be exactly this string, verbatim, no changes: "${VET_CTA}"`;
}

function buildFaqPrompt(topic: string, title: string): string {
  return `Write exactly 5 simple, SEO-friendly FAQs for a blog titled "${title}" about "${topic}".
Requirements:
- Phrased in simple, everyday language as a worried dog owner would actually search or ask online.
- Answers must be 1-2 clear, reassuring sentences in plain English (Grade 6-8 reading level).
- Cover 5 distinct, non-overlapping questions (e.g., cause, symptoms, treatment, prevention, when to see a vet).
Return JSON matching the schema exactly.`;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    intro: { type: "ARRAY", items: { type: "STRING" } },
    sections: {
      type: "ARRAY",
      minItems: 6,
      maxItems: 7,
      items: {
        type: "OBJECT",
        properties: {
          heading: { type: "STRING" },
          paragraphs: { type: "ARRAY", items: { type: "STRING" } },
          bullets: {
            type: "ARRAY",
            minItems: 4,
            maxItems: 6,
            items: { type: "STRING" },
          },
          subtopics: {
            type: "ARRAY",
            minItems: 2,
            items: {
              type: "OBJECT",
              properties: {
                subheading: { type: "STRING" },
                paragraphs: {
                  type: "ARRAY",
                  minItems: 2,
                  maxItems: 2,
                  items: { type: "STRING" },
                },
              },
              required: ["subheading", "paragraphs"],
            },
          },
        },
        required: ["heading"],
      },
    },
    vetCta: { type: "STRING" },
    conclusion: {
      type: "ARRAY",
      minItems: 2,
      maxItems: 2,
      items: { type: "STRING" },
    },
  },
  required: ["title", "intro", "sections", "vetCta", "conclusion"],
};

const FAQ_SCHEMA = {
  type: "OBJECT",
  properties: {
    faqs: {
      type: "ARRAY",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "OBJECT",
        properties: {
          question: { type: "STRING" },
          answer: { type: "STRING" },
        },
        required: ["question", "answer"],
      },
    },
  },
  required: ["faqs"],
};

function isTransientStatus(status: number): boolean {
  return status === 429 || status === 503;
}

async function callGemini<T>(prompt: string, schema: object, maxOutputTokens: number): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set - see init.md.");

  const models = ["gemini-flash-latest", "gemini-3.6-flash", "gemini-3.5-flash"];
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
              responseSchema: schema,
              maxOutputTokens,
              temperature: 0.8,
            },
          }),
        }
      );

      if (!res.ok) {
        lastErr = await res.text();
        if (isTransientStatus(res.status)) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        break;
      }

      const data = await res.json();
      const candidate = data.candidates?.[0];

      if (candidate?.finishReason === "MAX_TOKENS") {
        throw new Error(
          "Gemini truncated the response before finishing the JSON. Try a narrower topic."
        );
      }

      let raw: string = candidate?.content?.parts?.[0]?.text ?? "{}";
      raw = raw.replace(/<b>(.*?)<\/b>/gi, "$1").replace(/<strong>(.*?)<\/strong>/gi, "$1");
      return JSON.parse(raw) as T;
    }
  }

  throw new Error(`Gemini API busy: ${lastErr || "Please try again in a moment."}`);
}

async function generateFaqs(
  topic: string,
  title: string
): Promise<Array<{ question: string; answer: string }>> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const result = await callGemini<{ faqs: Array<{ question: string; answer: string }> }>(
      buildFaqPrompt(topic, title),
      FAQ_SCHEMA,
      2048
    );
    if (result.faqs?.length === 5) return result.faqs;
  }
  throw new Error("Could not generate exactly 5 FAQs after two attempts - try again.");
}

function bodyWordCount(body: Omit<SeoBlog, "approxWordCount" | "faqs">): number {
  return countWords({ ...body, faqs: [] });
}

function hasSuspiciouslyShortFragment(body: Omit<SeoBlog, "approxWordCount" | "faqs">): boolean {
  const isFragment = (line: string) => line.trim().split(/\s+/).length < 5;
  const introBad = body.intro.some(isFragment);
  const conclusionBad = body.conclusion.some(isFragment);
  const sectionsBad = body.sections.some((s) => {
    const paragraphsBad = (s.paragraphs ?? []).some(isFragment);
    const subtopicsBad = (s.subtopics ?? []).some((st) => st.paragraphs.some(isFragment));
    return paragraphsBad || subtopicsBad;
  });
  return introBad || conclusionBad || sectionsBad;
}

/** The schema's minItems/maxItems on "sections" is a hint, not a hard guarantee from the
 *  model - so validate the actual shape after generation and retry with a sharper warning
 *  if it over-generated (extra top-level headings), badly overshot the word target, or
 *  self-closed the JSON mid-sentence leaving a truncated fragment. */
async function generateBody(topic: string): Promise<Omit<SeoBlog, "approxWordCount" | "faqs">> {
  let lastBody: Omit<SeoBlog, "approxWordCount" | "faqs"> | null = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    const promptText: string =
      attempt === 0
        ? buildPrompt(topic)
        : `${buildPrompt(topic)}\n\nYour previous attempt produced ${lastBody!.sections.length} ` +
          `top-level sections and roughly ${bodyWordCount(lastBody!)} words. ` +
          `Fix this: ensure exactly 6-7 H2 sections, target approximately 1,200 words total (aiming for 1,150–1,250 words) in simple Grade 6-8 English, ` +
          `keep content informative and engaging without artificial filler or repetition, keep every paragraph complete, ` +
          `explain any medical terms immediately in plain language, and avoid repeating information across sections.`;

    const attemptBody = await callGemini<Omit<SeoBlog, "approxWordCount" | "faqs">>(promptText, RESPONSE_SCHEMA, 16384);
    lastBody = attemptBody;

    const words = bodyWordCount(attemptBody);
    const sectionsOk = attemptBody.sections.length >= 6 && attemptBody.sections.length <= 7;
    const wordsOk = words >= 1050 && words <= 1350; // buffer around ~1,200 words target (aiming for 1,150–1,250)
    const notTruncated = !hasSuspiciouslyShortFragment(attemptBody);

    if (sectionsOk && wordsOk && notTruncated) return attemptBody;
  }

  // Last resort: return whatever the final attempt produced rather than fail outright.
  return lastBody!;
}

function countWords(blog: Omit<SeoBlog, "approxWordCount">): number {
  const introText = blog.intro.join(" ");
  const conclusionText = blog.conclusion.join(" ");

  const sectionText = blog.sections
    .flatMap((s) => {
      const paragraphs = s.paragraphs ?? [];
      const bullets = s.bullets ?? [];
      const subtopics = (s.subtopics ?? []).flatMap((st) => [st.subheading, ...st.paragraphs]);
      return [s.heading, ...paragraphs, ...bullets, ...subtopics];
    })
    .join(" ");

  const full = `${blog.title} ${introText} ${sectionText} ${blog.vetCta} ${conclusionText}`;
  return full.trim().split(/\s+/).length;
}

function stripInlineCtaDuplicates(
  body: Omit<SeoBlog, "approxWordCount" | "faqs">
): Omit<SeoBlog, "approxWordCount" | "faqs"> {
  const isCtaLine = (line: string) => line.trim() === VET_CTA.trim();
  return {
    ...body,
    sections: body.sections.map((s) => ({
      ...s,
      paragraphs: s.paragraphs?.filter((p) => !isCtaLine(p)),
      bullets: s.bullets?.filter((b) => !isCtaLine(b)),
    })),
  };
}

/** Generates one SEO blog post for a single user-provided topic. */
export async function generateBlog(topic: string): Promise<SeoBlog> {
  if (!topic.trim()) throw new Error("Please provide a blog topic.");

  let body = await generateBody(topic);
  body = stripInlineCtaDuplicates(body);

  if (!body.vetCta || !body.vetCta.includes(VET_CTA)) {
    body.vetCta = VET_CTA;
  }

  const faqs = await generateFaqs(topic, body.title);

  const result: Omit<SeoBlog, "approxWordCount"> = { ...body, faqs };
  return { ...result, approxWordCount: countWords(result) };
}