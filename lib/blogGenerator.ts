import type { SeoBlog } from "./types";

const VET_CTA = "Get help from a CuddlyTails AI vet here.";

const SYSTEM_PROMPT = `You are an expert SEO content writer for a pet-care brand called CuddlyTails.
Return ONLY valid JSON matching the requested schema. No markdown fences, no preamble, no HTML tags.`;

const STRUCTURE_GUIDE = `Structural pattern to follow (adapt everything to the new topic - do not
reuse any example wording below, it is illustrative only):
- H1 title framed as a direct question or statement about the topic.
- 1 intro paragraph establishing why this matters to a dog owner.
- Exactly 6-7 H2 sections total, no more - pick only the most important angles for this topic
  and skip minor ones. This is a hard cap on the top-level "sections" array: count your planned
  headings before writing, and if you have more than 7, either cut the least important ones or
  fold them into "subtopics" nested inside an existing section. Never add a phase-by-phase or
  emergency-scenario breakdown as separate top-level H2s - those belong as bullets or subtopics
  inside ONE section, not as their own headings.
- One early H2 should explain the basics in 2 short paragraphs, no list.
- One H2 should cover causes/types using H3 "subtopics" - one subtopic per distinct
  cause/type, each exactly 2 short paragraphs (a definition sentence or two, then a clinical
  detail like risk factors, whether it's painful, or whether it's an emergency). This section
  carries most of the article's depth - if you need more length to hit the word target, add
  1-2 more subtopics here or make subtopic paragraphs slightly richer, not the intro.
- Every OTHER H2 covering signs/symptoms, step-by-step actions, treatment options, prevention
  tips, or emergency red flags MUST follow this exact three-part rhythm and nothing else:
  (1) one short setup sentence introducing the list, (2) 4-6 bullet points that are compact,
  specific, and named (e.g. "Cataracts may require surgical removal" - not vague filler like
  "consider treatment options"), (3) one short closing sentence saying why the list matters or
  what to do next. Do not add extra paragraphs before or after this rhythm.
- A final "when to seek immediate/emergency care" H2 follows the same three-part rhythm above.
- Immediately after that section's closing sentence (before the conclusion), the mandatory
  CTA line on its own.
- A conclusion H2 with 2 paragraphs.`;

function buildPrompt(topic: string): string {
  return `Write a highly structured, informative, SEO-friendly blog post about this topic: "${topic}".

${STRUCTURE_GUIDE}

Title requirements:
- Make it genuinely catchy - lead with the real concern or a direct question, use natural
  urgency or curiosity where it fits the topic.
- Avoid generic, overused phrasing like "A Comprehensive Guide," "Everything You Need to
  Know," or "The Ultimate Guide."
- Keep it SEO-friendly: 50-60 characters total (roughly 6-9 words), short enough that it
  won't get truncated in search results. Do not pad it with a subtitle or colon-separated
  second half just to sound fuller - shorter and punchier is correct here.

Length requirements (hard limits, not suggestions):
- Total length across intro + all sections + conclusion (excluding FAQs) must be between
  1300 and 1400 words.
- Word budget by section type - follow this precisely:
  - Intro: ~80-100 words.
  - Basics section (no list): ~150-180 words across its 2 paragraphs.
  - Causes/types section (subtopics): this is where most of the length budget goes - aim for
    ~400-500 words total here. Use enough subtopics, at 2 short paragraphs each, to reach that
    naturally. Do not pad other sections instead of this one.
  - Each list-rhythm section (signs, steps, treatment, prevention, emergency): ~120-150 words
    total for its setup sentence + bullets + closing sentence combined. Do not add prose beyond
    the three-part rhythm to hit length here - if you're short on words, add one more bullet
    instead, up to the 6-bullet max.
  - Conclusion: ~100-120 words across its 2 paragraphs.
- If you are behind on the word target after writing every section per its rhythm, add depth to
  the causes/types subtopics first. Never pad list-based sections with extra sentences.

Additional requirements:
- Tone: informative, veterinary-grade but accessible, direct - never salesy.
- No HTML tags anywhere. Plain text only.
- The "vetCta" field must be exactly this string, verbatim, no changes: "${VET_CTA}"`;
}

function buildFaqPrompt(topic: string, title: string): string {
  return `Write exactly 5 unique FAQs for a blog titled "${title}" about the topic "${topic}".
Requirements:
- Each question should be a single line, phrased the way a dog owner would actually search or ask.
- Each answer should be 1-2 sentences, concise and accurate.
- No overlap between questions - cover distinct angles (e.g. cause, urgency, treatment, prevention, outlook).
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
            responseSchema: schema,
            maxOutputTokens,
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
        const delayMs = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
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
      throw new Error(
        "Gemini truncated the response before finishing the JSON. Try a narrower topic, " +
          "or raise maxOutputTokens further."
      );
    }

    let raw: string = candidate?.content?.parts?.[0]?.text ?? "{}";
    raw = raw.replace(/<b>(.*?)<\/b>/gi, "$1").replace(/<strong>(.*?)<\/strong>/gi, "$1");

    return JSON.parse(raw) as T;
  }

  // Unreachable - the loop above always returns or throws - but keeps TS happy.
  throw new Error("Gemini request failed after retries.");
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
          `top-level sections and roughly ${bodyWordCount(lastBody!)} words, which breaks the ` +
          `6-7 section cap, the 1300-1400 word limit, or left a paragraph cut off mid-sentence. ` +
          `Fix this: merge any extra headings into subtopics or bullets inside an existing ` +
          `section, trim length from the causes/types section first if you're over on words, ` +
          `and make sure every paragraph is a complete, finished sentence. Do not simply ` +
          `shorten every section equally.`;

    const attemptBody = await callGemini<Omit<SeoBlog, "approxWordCount" | "faqs">>(promptText, RESPONSE_SCHEMA, 16384);
    lastBody = attemptBody;

    const words = bodyWordCount(attemptBody);
    const sectionsOk = attemptBody.sections.length >= 6 && attemptBody.sections.length <= 7;
    const wordsOk = words >= 1200 && words <= 1500; // small buffer around the 1300-1400 target
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