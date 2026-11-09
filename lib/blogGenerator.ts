import type { SeoBlog } from "./types";
import { fetchGeminiWithCascade } from "./geminiCascade";

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

BLOG STRUCTURE (Exactly 6-7 H2 sections in top-level "sections" array):
1. Introduction: Briefly explain what the requested topic is and why dog owners should care.
2. What Is It?: Explain the requested topic in simple, everyday language without textbook-style definitions.
3. How Does It Affect Your Dog?: Explain what the requested topic does inside the dog's body simply, how the dog feels, and how it impacts daily life.
4. Signs to Watch For: List common symptoms owners will notice at home using clear, compact bullet points.
5. Causes & Risk Factors: Explain common causes and risk factors simply.
6. Treatment & Prevention: Provide a brief overview of treatment options and practical management tips.
7. When Should You See a Vet?: Explain when to seek veterinary care, encouraging timely treatment without creating unnecessary fear.
Followed by:
- Final Thoughts (Conclusion): A short, reassuring summary with practical advice directly about the requested topic.
- 5 simple, SEO-friendly FAQs strictly related to the requested topic.

RHYTHM & SCHEMA RULES:
- H1 Title: SEO-friendly (50-60 characters, ~6-9 words), catchy, natural question or statement a worried owner would search online about the requested topic.
- Causes / What Is It section can use H3 "subtopics" to break down distinct causes or types in plain English.
- Sections with lists (Signs, Treatment, Prevention, When to See a Vet) follow this three-part rhythm: (1) short setup sentence, (2) 4-6 specific bullet points in simple words, (3) short closing sentence.
- The mandatory vet CTA string immediately follows before the conclusion.`;

function parseQuestionTopic(rawTopic: string): {
  rawTopic: string;
  coreSubject: string;
  isQuestion: boolean;
} {
  const trimmed = rawTopic.trim();
  const isQuestion =
    /\?$/.test(trimmed) ||
    /^(what|why|how|when|where|which|who|can|could|should|would|is|are|does|do|will|may|might)\b/i.test(trimmed);

  const withoutQ = trimmed.replace(/[?.!]+$/, "").trim();

  let core = withoutQ
    .replace(
      /^(what\s+causes|what\s+are\s+the\s+causes\s+of|what\s+is\s+causing|what\s+is\s+the\s+cause\s+of|what\s+to\s+do\s+if|what\s+to\s+do\s+when|what\s+happens\s+if|what\s+happens\s+when|what\s+does\s+it\s+mean\s+when|what\s+are|what\s+is)\s+/i,
      ""
    )
    .replace(
      /^(why\s+is\s+my|why\s+are\s+my|why\s+does\s+my|why\s+do\s+my|why\s+is\s+a|why\s+does\s+a|why\s+do|why\s+are|why\s+is)\s+/i,
      ""
    )
    .replace(
      /^(how\s+to\s+stop|how\s+to\s+prevent|how\s+to\s+treat|how\s+to\s+fix|how\s+to\s+manage|how\s+to\s+deal\s+with|how\s+to\s+help|how\s+do\s+i\s+stop|how\s+do\s+i\s+treat|how\s+do\s+i\s+fix|how\s+can\s+i|how\s+often\s+should\s+i|how\s+long\s+does|how\s+to|how\s+do|how\s+does|how\s+is|how\s+are)\s+/i,
      ""
    )
    .replace(
      /^(can\s+i\s+give\s+my|can\s+my|can\s+a|can|should\s+i|should\s+my|is\s+it\s+safe\s+for|is\s+it\s+normal\s+for|is\s+my|are\s+my|does\s+my|do\s+my)\s+/i,
      ""
    )
    .replace(
      /^(managing|understanding|dealing\s+with|preventing|curing|fixing|caring\s+for|handling)\s+/i,
      ""
    )
    .trim();

  if (!core || core.length < 3) {
    core = withoutQ;
  } else {
    core = core.charAt(0).toUpperCase() + core.slice(1);
  }

  return { rawTopic: trimmed, coreSubject: core, isQuestion };
}

function buildPrompt(topic: string): string {
  const { rawTopic, coreSubject, isQuestion } = parseQuestionTopic(topic);

  const questionDirective = isQuestion
    ? `\n### QUESTION-BASED TOPIC HANDLING (CRITICAL)
The user entered their topic as a question: "${rawTopic}" (Core subject: "${coreSubject}").
1. **Direct Answer First:** In the very first paragraph of the introduction, directly and clearly answer the question "${rawTopic}" in plain, reassuring language (ideal for a Google Featured Snippet).
2. **Natural Section Headings:** Do NOT awkwardly paste the full question "${rawTopic}" into every H2 heading. Instead, structure the 6-7 H2 headings naturally around "${coreSubject}" and the intent of the question (for example: what "${coreSubject}" looks like, the main causes/triggers behind it, symptoms to watch for, treatment & home care, and when to see a vet).
3. ** Title:** You may keep the title as a polished, compelling version of the question (50-65 characters) or an answer-driven title directly addressing "${coreSubject}".\n`
    : "";

  return `### CRITICAL: TOPIC ACCURACY & SINGLE SOURCE OF TRUTH
The user's requested input topic is:
"${rawTopic}" (Core Subject: "${coreSubject}")
${questionDirective}
This topic is the SINGLE SOURCE OF TRUTH for the entire article.
Every single part of the article—title, intro, headings, subtopics, paragraphs, bullet points, conclusion, and FAQs—MUST be directly related to "${rawTopic}" and "${coreSubject}".

### STRICT ANTI-TOPIC-DRIFT RULE
Do NOT replace or drift the requested topic with:
* A different dog-health condition
* A loosely related dog-care subject
* A travel, training, nutrition, grooming, or safety topic UNLESS it is directly relevant to "${coreSubject}".

### NO FORCED KEYWORD STUFFING
* Use the primary topic and "${coreSubject}" naturally throughout the article.
* Never force a full question sentence verbatim into the middle of a sentence where a noun phrase belongs.
* Prioritize semantic relevance and natural readability.

${STRUCTURE_GUIDE}

Blog Length & Depth Requirements (CRITICAL FOR 96+ A+ SEO SCORE):
- Target body word count: 1,080 to 1,250 words across intro + all sections + conclusion (so that together with the ~200 words of FAQs, the complete article totals 1,280 to 1,480 words).
- ABSOLUTE MAXIMUM CEILING: DO NOT EXCEED 1,480 TOTAL WORDS (strictly under 1,500 words max).
- Every section MUST include 2 to 3 detailed, informative paragraphs (3–4 full sentences per paragraph, ~55–65 words per paragraph).
- Include 3 detailed H3 "subtopics" (each with 2 paragraphs) in the Causes / Breakdown section.
- Include 5 descriptive bullet points (15–20 words per bullet) in the Signs, Treatment/Prevention, and Vet Care sections.
- Word budget guide:
  - Intro (2 paragraphs): ~120–140 words.
  - Section 1 (What Is It / Overview): ~150–170 words.
  - Section 2 (How It Affects Your Dog): ~150–170 words.
  - Section 3 (Signs & Symptoms to Watch For + 5 bullets): ~170–190 words.
  - Section 4 (Primary Causes & Risk Factors + 3 H3 subtopics): ~240–270 words.
  - Section 5 (Treatment, Home Care & Prevention + 5 bullets): ~180–210 words.
  - Section 6 (When Should You See a Vet? + bullets): ~130–150 words.
  - Final Thoughts (Conclusion, 2 full paragraphs): ~100–120 words.

SEO Requirements:
- Catchy, SEO-friendly title (50-65 characters, no generic "A Comprehensive Guide" or "Ultimate Guide").
- Clear H2 and H3 headings matching the structure.
- Natural keyword placement (aim for ~1.5%–2.5% natural keyword density) without topic drift.
- Featured-snippet-friendly explanations.

Additional requirements:
- No HTML tags anywhere. Plain text only.
- The "vetCta" field must be exactly this string, verbatim, no changes: "${VET_CTA}"`;
}

function buildFaqPrompt(topic: string, title: string): string {
  return `Write exactly 5 comprehensive, SEO-friendly FAQs for a blog titled "${title}" strictly about "${topic}".
Requirements:
- Every single FAQ question and answer MUST be 100% directly relevant to "${topic}".
- Do NOT introduce unrelated topics (e.g. car travel, harnesses, grooming, or unrelated health conditions) unless "${topic}" is explicitly about that.
- Phrased in simple, everyday language as a worried dog owner searching for "${topic}" would actually ask online.
- Answers must be 2–3 thorough, reassuring sentences in plain English (roughly 40–55 words per answer, Grade 6-8 reading level).
- Cover 5 distinct, non-overlapping questions specific to "${topic}".
Return JSON matching the schema exactly.`;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    title: { type: "STRING" },
    intro: {
      type: "ARRAY",
      minItems: 2,
      maxItems: 3,
      items: { type: "STRING" },
    },
    sections: {
      type: "ARRAY",
      minItems: 6,
      maxItems: 7,
      items: {
        type: "OBJECT",
        properties: {
          heading: { type: "STRING" },
          paragraphs: {
            type: "ARRAY",
            minItems: 2,
            maxItems: 3,
            items: { type: "STRING" },
          },
          bullets: {
            type: "ARRAY",
            minItems: 5,
            maxItems: 6,
            items: { type: "STRING" },
          },
          subtopics: {
            type: "ARRAY",
            minItems: 3,
            maxItems: 4,
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
        required: ["heading", "paragraphs"],
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

async function callGemini<T>(prompt: string, schema: object, maxOutputTokens: number): Promise<T> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set - see init.md.");

  const { data } = await fetchGeminiWithCascade({
    apiKey,
    timeoutMs: 18000,
    body: {
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: schema,
        maxOutputTokens: Math.max(maxOutputTokens, 8192),
        temperature: 0.7,
      },
    },
  });

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
  const isFragment = (line: string) => line.trim().split(/\s+/).length < 3;
  const introBad = body.intro.some(isFragment);
  const conclusionBad = body.conclusion.some(isFragment);
  const sectionsBad = body.sections.some((s) => {
    const paragraphsBad = (s.paragraphs ?? []).some(isFragment);
    const subtopicsBad = (s.subtopics ?? []).some((st) => st.paragraphs.some(isFragment));
    return paragraphsBad || subtopicsBad;
  });
  return introBad || conclusionBad || sectionsBad;
}

function trimBodyToMaxWords(
  body: Omit<SeoBlog, "approxWordCount" | "faqs">,
  maxWords: number = 1260
): Omit<SeoBlog, "approxWordCount" | "faqs"> {
  let currentWords = bodyWordCount(body);
  if (currentWords <= maxWords) return body;

  const trimmed = JSON.parse(JSON.stringify(body)) as Omit<SeoBlog, "approxWordCount" | "faqs">;

  // Pass 1: Remove 3rd paragraphs in sections that have > 2 paragraphs
  for (let s = trimmed.sections.length - 1; s >= 0; s--) {
    const sec = trimmed.sections[s];
    if (sec.paragraphs && sec.paragraphs.length > 2) {
      while (sec.paragraphs.length > 2 && currentWords > maxWords) {
        const wordsInP = sec.paragraphs[sec.paragraphs.length - 1].trim().split(/\s+/).length;
        if (currentWords - wordsInP >= 1000) {
          sec.paragraphs.pop();
          currentWords = bodyWordCount(trimmed);
        } else {
          break;
        }
      }
      if (currentWords <= maxWords) return trimmed;
    }
  }

  // Pass 2: Remove 2nd paragraphs in sections that also have bullets or subtopics
  for (let s = trimmed.sections.length - 1; s >= 0; s--) {
    const sec = trimmed.sections[s];
    const hasExtras = (sec.bullets && sec.bullets.length > 0) || (sec.subtopics && sec.subtopics.length > 0);
    if (hasExtras && sec.paragraphs && sec.paragraphs.length > 1) {
      const wordsInP = sec.paragraphs[sec.paragraphs.length - 1].trim().split(/\s+/).length;
      if (currentWords - wordsInP >= 1000) {
        sec.paragraphs.pop();
        currentWords = bodyWordCount(trimmed);
        if (currentWords <= maxWords) return trimmed;
      }
    }
  }

  // Pass 3: Trim extra bullets beyond 4 or extra paragraphs down to 1
  for (let s = trimmed.sections.length - 1; s >= 0; s--) {
    const sec = trimmed.sections[s];
    if (sec.bullets && sec.bullets.length > 4) {
      while (sec.bullets.length > 4 && currentWords > maxWords) {
        sec.bullets.pop();
        currentWords = bodyWordCount(trimmed);
      }
      if (currentWords <= maxWords) return trimmed;
    }
    if (sec.paragraphs && sec.paragraphs.length > 1) {
      for (let p = sec.paragraphs.length - 1; p >= 1; p--) {
        const wordsInP = sec.paragraphs[p].trim().split(/\s+/).length;
        if (currentWords - wordsInP >= 1000) {
          sec.paragraphs.splice(p, 1);
          currentWords = bodyWordCount(trimmed);
          if (currentWords <= maxWords) return trimmed;
        }
      }
    }
  }

  return trimmed;
}

/** Validates the generated blog structure without forcing unnecessary multi-pass retries on
 *  concise, direct answers to question-based topics. */
async function generateBody(topic: string): Promise<Omit<SeoBlog, "approxWordCount" | "faqs">> {
  let lastBody: Omit<SeoBlog, "approxWordCount" | "faqs"> | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const promptText: string =
      attempt === 0
        ? buildPrompt(topic)
        : `${buildPrompt(topic)}\n\nIMPORTANT: Your previous draft was only ${bodyWordCount(lastBody!)} words across ${lastBody!.sections.length} sections, which is too short. ` +
          `Expand the depth significantly to reach 1,100–1,250 words in the body: write 2–3 full paragraphs per section (3–4 detailed sentences each), include 3 H3 subtopics in the Causes section (each with 2 detailed paragraphs), and provide 5 thorough bullet points in the Signs and Treatment sections.`;

    const attemptBody = await callGemini<Omit<SeoBlog, "approxWordCount" | "faqs">>(promptText, RESPONSE_SCHEMA, 8192);
    lastBody = attemptBody;

    const words = bodyWordCount(attemptBody);
    const sectionsOk = attemptBody.sections.length >= 6 && attemptBody.sections.length <= 7;
    const wordsOk = words >= 980;
    const notTruncated = !hasSuspiciouslyShortFragment(attemptBody);

    if (sectionsOk && wordsOk && notTruncated) {
      return words > 1260 ? trimBodyToMaxWords(attemptBody, 1260) : attemptBody;
    }
  }

  return trimBodyToMaxWords(lastBody!, 1260);
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

  const faqText = (blog.faqs ?? [])
    .flatMap((f) => [f.question, f.answer])
    .join(" ");

  const full = `${blog.title} ${introText} ${sectionText} ${blog.vetCta} ${conclusionText} ${faqText}`;
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

function sanitizeTopic(topic: string): { nounPhrase: string; displayTopic: string } {
  const { coreSubject } = parseQuestionTopic(topic);

  let clean = coreSubject
    .replace(/\b(gaining weight|gain weight)\b/i, "Weight Gain")
    .replace(/\b(losing weight|lose weight)\b/i, "Weight Loss")
    .replace(/\b(vomiting|throwing up)\b/i, "Vomiting")
    .replace(/\b(diarrhea)\b/i, "Diarrhea")
    .replace(/\b(barking|barks)\b/i, "Excessive Barking")
    .replace(/\b(itching|scratching)\b/i, "Skin Itching");

  clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  if (!clean) clean = "Dog Health & Care";

  return { nounPhrase: clean, displayTopic: clean };
}

function getMockBlog(topic: string): SeoBlog {
  const { nounPhrase, displayTopic } = sanitizeTopic(topic || "Dog Care & Health Tips");
  const topicLower = displayTopic.toLowerCase();

  const isSafetyTopic = /\b(car safety|car seatbelt|travel harness|vehicle restraint|car travel|seatbelt harness|dog car seat)\b/i.test(topicLower);
  const isGroomingTopic = /\b(shedding|deshedding|dog brushing|coat grooming|fur coat care|grooming brush)\b/i.test(topicLower);

  const rawBlog: Omit<SeoBlog, "approxWordCount"> = isGroomingTopic
    ? {
        title: `${displayTopic}: A Complete Guide for Dog Owners`,
        intro: [
          `As a dedicated pet parent, seeing extra fur around your home—especially during seasonal shifts—is a very common experience. Understanding ${topicLower} helps you keep your pup comfortable, healthy, and looking their best.`,
          `In this guide, we break down why dogs shed excessively during spring and fall, effective de-shedding techniques, and daily grooming habits to keep shedding under control.`
        ],
        sections: [
          {
            heading: `1. Understanding ${displayTopic}`,
            paragraphs: [
              `Seasonal shedding, often referred to as "blowing coat," is a natural biological process where dogs transition between their dense winter undercoat and lighter summer coat. As daylight and ambient temperatures shift in spring and fall, hair follicles release old fur to make room for new growth.`,
              `While regular shedding is completely natural, establishing a proactive grooming routine prevents matted fur, reduces loose hair around your home, and supports healthy skin.`
            ]
          },
          {
            heading: "2. Why Do Dogs Shed More in Spring & Fall?",
            paragraphs: [
              "Several environmental and biological factors influence how heavily your dog sheds during seasonal transitions:"
            ],
            bullets: [
              "Photoperiod changes: Shifts in daily sunlight trigger hormonal signals that prompt hair follicle renewal",
              "Temperature transitions: Preparing the coat for warmer summer weather or insulating for cold winter months",
              "Coat type: Double-coated breeds (like Huskies, Retrievers, and Shepherds) release large tufts of dense undercoat",
              "Indoor living: Artificial lighting and heating can cause year-round light shedding with peak seasonal spikes",
              "Nutritional factors: Diets lacking essential omega-3 fatty acids can lead to dry, brittle hair that sheds more easily"
            ]
          },
          {
            heading: "3. Essential De-Shedding & Home Grooming Tools",
            paragraphs: [
              "Using the right grooming tools for your dog's specific coat type makes a huge difference in managing loose fur:"
            ],
            subtopics: [
              {
                subheading: "Undercoat Rakes & De-Shedding Blades",
                paragraphs: [
                  "Undercoat rakes reach deep beneath the topcoat to gently remove trapped dead fur before it mats.",
                  "Use gentle, even strokes along the direction of hair growth without applying excessive pressure."
                ]
              },
              {
                subheading: "Slicker Brushes & Rubber Curry Brushes",
                paragraphs: [
                  "Slicker brushes work wonders for long or medium-haired breeds to untangle minor knots.",
                  "Rubber curry brushes are ideal for short-haired breeds to loosen dead hair while massaging the skin."
                ]
              },
              {
                subheading: "Bathing & De-Shedding Shampoos",
                paragraphs: [
                  "A warm bath with a moisturizing de-shedding shampoo helps loosen stubborn undercoat fur.",
                  "Blow-drying with a high-velocity dryer after a bath blows out remaining loose fur efficiently."
                ]
              }
            ]
          },
          {
            heading: "4. Daily Home Care & Preventative Tips",
            paragraphs: [
              "Consistent daily care is the best way to keep your home clean and your dog's coat healthy during peak shedding months.",
              "Incorporate daily 5-minute brushing sessions, add fish oil or omega-3 supplements to their meals, and keep your dog well-hydrated to nourish hair follicles from within."
            ]
          },
          {
            heading: "5. When Should You Consult a Vet?",
            paragraphs: [
              "While seasonal shedding is normal, consult your veterinarian if you notice red or irritated skin, bald patches, intense scratching, or foul odors.",
              "Excessive hair loss accompanied by skin lesions can indicate allergies, flea dermatitis, fungal infections, or thyroid imbalances that require medical treatment."
            ]
          }
        ],
        vetCta: VET_CTA,
        conclusion: [
          `Managing your dog's seasonal shedding requires patience, regular brushing, and good nutrition. By staying consistent with grooming, you'll keep your dog comfortable and your home fur-free.`
        ],
        faqs: [
          {
            question: "How long does seasonal shedding last in spring and fall?",
            answer: "Peak seasonal shedding typically lasts between 2 to 4 weeks as your dog transitions between summer and winter coats."
          },
          {
            question: "How often should I brush my dog during shedding season?",
            answer: "Brushing daily or 3-4 times a week during peak shedding season prevents matted fur and dramatically reduces loose hair in your home."
          },
          {
            question: "Do omega-3 supplements help reduce excessive shedding?",
            answer: "Yes. Omega-3 fatty acids nourish the skin barrier and hair follicles, reducing dry skin, brittle fur, and excessive non-seasonal shedding."
          },
          {
            question: "Can I shave my double-coated dog to stop shedding?",
            answer: "No. Shaving a double-coated dog damages the protective topcoat, disrupts natural temperature regulation, and does not stop shedding."
          },
          {
            question: "When is shedding considered abnormal?",
            answer: "If shedding leaves visible bald patches, red skin, scabs, or is accompanied by constant scratching, consult your vet to rule out allergies or infections."
          }
        ]
      }
    : isSafetyTopic
    ? {
        title: `Understanding ${displayTopic}: A Complete Guide for Dog Owners`,
        intro: [
          `As a dedicated pet parent, keeping your dog safe during road trips and daily drives is a top priority. Understanding ${topicLower} helps ensure your furry companion stays secure, comfortable, and protected on every journey.`,
          `In this guide, we break down everything you need to know about proper travel restraints, harness fitting, and car safety in simple, everyday language so you can travel with complete peace of mind.`
        ],
        sections: [
          {
            heading: `1. Why ${displayTopic} Matters for Every Journey`,
            paragraphs: [
              `Unrestrained dogs in moving vehicles can become severe distractions for drivers or suffer injuries during sudden stops. Proper travel harnesses and seatbelt restraints act like seatbelts for human passengers, absorbing kinetic energy and preventing dangerous falls.`,
              `Investing in crash-tested gear and establishing safe car habits keeps both your pet and human passengers secure on short trips and long highway drives.`
            ]
          },
          {
            heading: "2. Key Benefits of Using Proper Harness Restraints",
            paragraphs: [
              "Using a dedicated car harness or seatbelt restraint provides multiple safety and comfort advantages for your pup:"
            ],
            bullets: [
              "Reduces driver distraction by preventing your dog from jumping into the front seat or driver's lap",
              "Prevents sudden impact injuries during abrupt braking or unexpected stops",
              "Keeps your pet securely inside the vehicle if doors or windows are accidentally opened",
              "Provides physical support and comfort for anxious or motion-sensitive dogs",
              "Distributes force across the chest rather than putting pressure on the delicate neck area"
            ]
          },
          {
            heading: "3. How to Choose and Fit the Right Restraint",
            paragraphs: [
              "Selecting effective safety gear requires paying attention to fit, materials, and attachment points:"
            ],
            subtopics: [
              {
                subheading: "Look for Crash-Tested Certification",
                paragraphs: [
                  "Choose harnesses that have undergone independent crash testing or meet recognized pet safety standards.",
                  "Ensure metal hardware, heavy-duty webbing, and reinforced stitching are used throughout the harness."
                ]
              },
              {
                subheading: "Ensure Proper Fit & Comfort",
                paragraphs: [
                  "Measure your dog's neck and chest girth accurately before purchasing a restraint harness.",
                  "You should be able to comfortably slide two fingers between the harness straps and your dog's body."
                ]
              },
              {
                subheading: "Secure Attachment to the Vehicle",
                paragraphs: [
                  "Attach seatbelt tethers directly to the vehicle's seatbelt buckle or ISOFIX anchor points rather than a collar.",
                  "Never connect a vehicle seatbelt tether to a regular neck collar, as sudden stops can cause cervical injury."
                ]
              }
            ]
          },
          {
            heading: "4. Practical Tips for Smooth & Stress-Free Rides",
            paragraphs: [
              "Help your dog build positive associations with car rides by starting slowly with short trips around the block.",
              "Bring along familiar blankets, maintain comfortable car temperatures, and schedule regular bathroom and water breaks on longer road trips."
            ]
          },
          {
            heading: "5. When to Consult a Professional or Vet",
            paragraphs: [
              "If your dog experiences severe car sickness, anxiety, or reluctance to travel, consult your veterinarian for behavioral or motion-sickness recommendations.",
              "A professional vet evaluation can offer safe medication options or behavioral strategies to make traveling pleasant for your dog."
            ]
          }
        ],
        vetCta: VET_CTA,
        conclusion: [
          `Prioritizing ${topicLower} is one of the best ways to care for your dog on the go. With the right gear and consistent habits, every adventure together can be safe, comfortable, and fun.`
        ],
        faqs: [
          {
            question: "Is a car harness required by law for dogs?",
            answer: "While laws vary by location, many states and countries require pets to be properly restrained while driving to prevent driver distraction."
          },
          {
            question: "Can I use a regular neck collar with a car seatbelt?",
            answer: "No. You should never attach a car seatbelt tether to a neck collar, as sudden stops can cause serious neck or airway injury. Always use a dedicated padded harness."
          },
          {
            question: "How do I acclimate an anxious dog to a car harness?",
            answer: "Let your dog wear the harness indoors first, reward them with treats, and start with brief, positive car rides to build confidence."
          },
          {
            question: "What is the safest place for a dog in a vehicle?",
            answer: "The back seat is the safest location for dogs. Never place dogs in the front passenger seat where active airbags can cause injury."
          },
          {
            question: "How often should I replace my dog's travel harness?",
            answer: "Inspect the harness regularly for fraying or hardware wear, and replace it immediately if your dog outgrows it or after any vehicle collision."
          }
        ]
      }
    : {
        title: `Understanding ${displayTopic}: A Complete Guide for Dog Owners`,
        intro: [
          `As a dedicated pet parent, noticing changes in your dog—such as ${topicLower}—can feel concerning and overwhelming. Whether you are encountering this for the first time or looking for proactive wellness advice, having clear, reliable information brings peace of mind.`,
          `In this guide, we break down everything you need to know about ${nounPhrase.toLowerCase()} in simple, everyday language so you can make informed decisions for your pup's health and happiness.`
        ],
        sections: [
          {
            heading: `1. What Is ${nounPhrase}?`,
            paragraphs: [
              `${nounPhrase} in dogs can stem from routine shifts, metabolic changes, dietary factors, or underlying health conditions. Rather than wading through dense veterinary jargon, think of it as your dog's physical response to internal or external changes.`,
              `Recognizing these signals early empowers you to adjust your dog's daily care, diet, or routine before minor concerns turn into larger health issues.`
            ]
          },
          {
            heading: "2. How Does It Affect Your Dog?",
            paragraphs: [
              `When your dog undergoes this change, it can impact their overall energy levels, mobility, mood, and daily comfort. You might notice them acting slightly more sluggish, seeking extra comfort, or altering their usual routine.`,
              `Internally, their body is adapting to changes in metabolism, digestion, or stress. With attentive care, proper monitoring, and timely guidance, most dogs navigate these changes comfortably.`
            ]
          },
          {
            heading: "3. Common Signs to Watch For at Home",
            paragraphs: ["Here are key signs every dog owner should monitor closely:"],
            bullets: [
              "Noticeable shifts in daily appetite, food enthusiasm, or water intake",
              "Changes in activity level, reluctance to run, or tiring quickly during walks",
              "Physical changes in body shape, coat condition, or abdominal firmness",
              "Changes in sleeping habits, restlessness, or seeking extra reassurance",
              "Mild digestive changes or occasional stomach sensitivity"
            ]
          },
          {
            heading: "4. Primary Causes & Risk Factors",
            paragraphs: [
              `Understanding the underlying triggers for ${nounPhrase.toLowerCase()} helps you address the root cause effectively. Common contributing factors include:`
            ],
            subtopics: [
              {
                subheading: "Dietary & Caloric Imbalance",
                paragraphs: [
                  "Consuming extra treats, table scraps, or food higher in calories than required for their daily exercise level is a leading cause.",
                  "Ensuring portion control and feeding age-appropriate nutrient-rich kibble helps maintain an optimal weight."
                ]
              },
              {
                subheading: "Activity Level & Schedule Shifts",
                paragraphs: [
                  "A reduction in daily exercise due to weather, busy schedules, or aging can lower daily energy expenditure.",
                  "Consistent daily walks, interactive play, and mental stimulation are essential for balanced energy."
                ]
              },
              {
                subheading: "Age & Hormonal Changes",
                paragraphs: [
                  "As dogs mature into senior years, their metabolic rate naturally slows down, requiring fewer daily calories.",
                  "Hormonal imbalances or spay/neuter status can also influence how efficiently their body processes food."
                ]
              }
            ]
          },
          {
            heading: "5. Practical Treatment & Home Prevention Tips",
            paragraphs: [
              "Supporting your dog starts with simple, consistent home care. Provide clean, fresh water at all times, maintain predictable feeding schedules, and measure daily food portions accurately.",
              "Preventative habits—including regular outdoor exercise, weight tracking, and engaging pet care services—keep your dog active, happy, and resilient."
            ]
          },
          {
            heading: "6. When Should You See a Vet?",
            paragraphs: [
              "While subtle changes can often be managed with diet and routine adjustments, consult your veterinarian if you notice rapid, unexplained changes, persistent lethargy, or discomfort.",
              "A professional health evaluation provides clear answers and a tailored plan to keep your companion thriving."
            ]
          }
        ],
        vetCta: VET_CTA,
        conclusion: [
          `Caring for your dog through ${topicLower} requires patience, love, and attentive daily care. By staying proactive and watching for subtle signs, you give your companion the highest quality of life.`
        ],
        faqs: [
          {
            question: `How common is ${nounPhrase.toLowerCase()} in dogs?`,
            answer: "It is very common across breeds and ages, often linked to changes in diet, routine, age, or activity level."
          },
          {
            question: "Can I manage this safely at home?",
            answer: "Mild changes can often be managed with balanced diet and regular exercise, but consult your vet for tailored medical advice."
          },
          {
            question: "What daily habits help prevent health issues?",
            answer: "A consistent feeding schedule, measured portions, daily interactive walks, and routine vet check-ups make a big difference."
          },
          {
            question: "Does my dog's breed affect susceptibility?",
            answer: "Certain breeds may be predisposed to weight gain or metabolic shifts, but diet and daily lifestyle habits play the primary role."
          },
          {
            question: "When is immediate vet attention recommended?",
            answer: "If your dog displays rapid unexplained weight changes, severe lethargy, or signs of pain, seek veterinary care right away."
          }
        ]
      };

  return {
    ...rawBlog,
    approxWordCount: countWords(rawBlog),
  };
}

/** Generates one SEO blog post for a single user-provided topic. */
export async function generateBlog(topic: string): Promise<SeoBlog> {
  if (!topic.trim()) throw new Error("Please provide a blog topic.");

  try {
    const { coreSubject } = parseQuestionTopic(topic);
    const [rawBody, faqs] = await Promise.all([
      generateBody(topic),
      generateFaqs(topic, coreSubject),
    ]);

    let body = stripInlineCtaDuplicates(rawBody);

    if (!body.vetCta || !body.vetCta.includes(VET_CTA)) {
      body.vetCta = VET_CTA;
    }

    const faqWords = faqs
      .flatMap((f) => [f.question, f.answer])
      .join(" ")
      .trim()
      .split(/\s+/).length;

    const maxBodyBudget = Math.max(1050, 1480 - faqWords);
    body = trimBodyToMaxWords(body, maxBodyBudget);

    const result: Omit<SeoBlog, "approxWordCount"> = { ...body, faqs };
    return { ...result, approxWordCount: countWords(result) };
  } catch (err) {
    console.warn("Gemini call failed for blog generation, using fallback mock generator:", (err as Error).message);
    return getMockBlog(topic);
  }
}