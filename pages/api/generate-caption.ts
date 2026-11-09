import type { NextApiRequest, NextApiResponse } from "next";
import { fetchGeminiWithCascade } from "../../lib/geminiCascade";

const STOP_WORDS = new Set([
  "the", "is", "a", "an", "and", "or", "in", "on", "at", "to", "for", "with", "by", "from", "of",
  "this", "that", "it", "was", "are", "be", "been", "being", "have", "has", "had", "do", "does",
  "did", "but", "if", "so", "as", "what", "which", "who", "whom", "whose", "when", "where", "why",
  "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
  "not", "only", "own", "same", "than", "too", "very", "can", "will", "just", "don", "should", "now"
]);

async function fetchImageBuffer(imageUrl: string): Promise<{ base64: string; mimeType: string } | null> {
  const userAgents = [
    "Twitterbot/1.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"
  ];

  for (const ua of userAgents) {
    try {
      const res = await fetch(imageUrl, {
        headers: { "User-Agent": ua, "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" }
      });
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        return {
          base64: Buffer.from(arrayBuffer).toString("base64"),
          mimeType: res.headers.get("content-type") || "image/jpeg"
        };
      }
    } catch (e) {}
  }
  return null;
}

export function buildPinterestFields(line1: string, hashtagsStr: string, username: string): {
  pinterestTitle: string;
  pinterestDescription: string;
} {
  const title = line1 || "Unbelievable moment captured on video 🎬✨";
  const creditLine = `📸: IG/${username || "creator"}`;

  const baseTags = (hashtagsStr || "")
    .split(/\s+/)
    .filter((t) => t.startsWith("#"))
    .map((t) => t.toLowerCase());

  const extraDogTags = [
    "#dogsofinstagram", "#cutedogs", "#doglovers", "#doglife", "#petmemes",
    "#funnydogs", "#dogmemes", "#petcare", "#petfails", "#dogworld", "#viralpets", "#pupstagram"
  ];

  const extraGeneralTags = [
    "#viral", "#trending", "#reels", "#explore", "#moments",
    "#shorts", "#viralvideo", "#trendingnow", "#mustwatch", "#bestclips", "#reelsinstagram", "#dailycontent"
  ];

  const isDog = (title + hashtagsStr + username).toLowerCase().match(/\b(dog|pup|pet|mutt|canine|retriever|frenchie|lab|poodle|husky|bark|paw|cuddlytails)\b/);
  const tagPool = isDog ? extraDogTags : extraGeneralTags;

  const tagSet = new Set(baseTags);
  for (const t of tagPool) {
    if (tagSet.size >= 12) break;
    tagSet.add(t);
  }

  const finalHashtags = Array.from(tagSet).slice(0, 12);

  const plainTagsList = finalHashtags
    .slice(0, 10)
    .map((t) => t.replace(/^#/, ""))
    .join(", ");

  const singleBracketTags = `[${plainTagsList}]`;

  const description = `${creditLine}\n\n${finalHashtags.join(" ")}\n\n${singleBracketTags}`;

  return {
    pinterestTitle: title,
    pinterestDescription: description,
  };
}

export async function generateContextCaptionDetails(
  originalCaption?: string,
  ownerUsername?: string,
  imageUrl?: string
): Promise<{ line1: string; hashtags: string; instagramCaption: string }> {
  const username = ownerUsername || "creator";
  const apiKey = process.env.GEMINI_API_KEY;

  let line1 = "";
  let hashtags = "";

  // 1. Try Gemini Vision Model with Thumbnail Frame Image
  if (apiKey && imageUrl) {
    const imgData = await fetchImageBuffer(imageUrl);
    if (imgData) {
      const prompt = `Look closely at this video cover frame image.
TASK:
1. Identify the EXACT visual subject and action in the image (e.g. dog playing, pet running, sports trick, child laughing).
2. Write a 100% RELEVANT opening caption of EXACTLY 5 to 6 words describing EXACTLY WHAT IS VISUALLY HAPPENING IN THIS SPECIFIC VIDEO. Include EXACTLY 2 fitting emojis.
3. Provide 10 to 12 highly relevant trending hashtags matching this specific topic.

DO NOT use generic phrases like "Wait till you see this" or "Did not expect this ending". Be specific to what is in the image!

Return ONLY valid JSON:
{
  "line1": "5 to 6 words describing exact video scene with 2 emojis",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10 #tag11 #tag12"
}`;

      try {
        const { data: vData } = await fetchGeminiWithCascade({
          apiKey,
          timeoutMs: 15000,
          body: {
            contents: [
              {
                parts: [
                  { inlineData: { mimeType: imgData.mimeType, data: imgData.base64 } },
                  { text: prompt }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              maxOutputTokens: 2048,
              temperature: 0.6
            }
          }
        });
        const rawText = vData.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          if (parsed.line1) line1 = parsed.line1.trim();
          if (parsed.hashtags) hashtags = parsed.hashtags.trim();
        }
      } catch (err) {}
    }
  }

  // 2. Try Text-Based Gemini Model if Vision unavailable
  if (!line1 && apiKey && originalCaption && originalCaption.trim()) {
    try {
      const prompt = `Reel description text: "${originalCaption.trim()}".
Task 1: Write an extremely catchy, 100% RELEVANT opening caption of EXACTLY 5 to 6 words describing what this video is about, with EXACTLY 2 fitting emojis.
Task 2: Provide 10 to 12 trending hashtags related to the topic.

JSON response:
{
  "line1": "5 to 6 words with 2 emojis",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5 #tag6 #tag7 #tag8 #tag9 #tag10 #tag11 #tag12"
}`;

      const { data } = await fetchGeminiWithCascade({
        apiKey,
        timeoutMs: 15000,
        body: {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
            maxOutputTokens: 2048,
            temperature: 0.7,
          },
        },
      });
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const match = rawText.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        if (parsed.line1) line1 = parsed.line1.trim();
        if (parsed.hashtags) hashtags = parsed.hashtags.trim();
      }
    } catch (err) {}
  }

  // 3. Fallback Topic NLP Engine (Always Specific to Keywords)
  if (!line1) {
    const rawText = `${originalCaption || ""} ${ownerUsername || ""}`.toLowerCase();
    const isDogVideo = /\b(dog|dogs|puppy|puppies|pup|mutt|canine|retriever|frenchie|labrador|poodle|husky|doodle|bark|paw|pet|pets|cuddlytails|milo_jackmutt|jackmutt|zuko|giggles|cute)\b/i.test(rawText);
    const isSports = /\b(football|soccer|basketball|gym|workout|skills|goals|training|match|game|athlete|fitness)\b/i.test(rawText);

    if (!hashtags) {
      hashtags = isDogVideo
        ? "#dogsofinstagram #cutedogs #doglovers #doglife #petmemes #funnydogs #dogmemes #petcare #petfails #dogworld #viralpets #pupstagram"
        : (isSports ? "#sports #skills #viral #trending #reels #football #workout #fitness #goals #athletes #action #highlights" : "#viral #trending #reels #explore #moments #shorts #viralvideo #trendingnow #mustwatch #bestclips #reelsinstagram #dailycontent");
    }

    let clean = (originalCaption || "")
      .split("\n")[0]
      .replace(/(?:📸|📷|credit|via)?\s*:\s*(?:IG\/|@)?[a-zA-Z0-9_\.]+/gi, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/#[^\s#]+/g, "")
      .replace(/&amp;/g, " ")
      .replace(/&quot;/g, "")
      .replace(/&#x[0-9a-f]+;/gi, "")
      .replace(/&[a-z0-9#]+;/gi, "")
      .replace(/100%/g, "Pure")
      .replace(/[^\w\s]/gi, " ")
      .replace(/\s+/g, " ")
      .trim();

    const ADJECTIVES = new Set(["high", "big", "super", "great", "good", "best", "sweet", "pure", "main", "top", "little", "small"]);

    const keywords = clean
      .split(" ")
      .map((w) => w.trim())
      .filter((w) => w.length > 2 && !STOP_WORDS.has(w.toLowerCase()) && !ADJECTIVES.has(w.toLowerCase()) && !/^\d+$/.test(w));

    const mainWord = keywords.length > 0 ? keywords[0].toLowerCase() : (isDogVideo ? "pup" : "clip");

    if (isDogVideo) {
      line1 = `Cutest ${mainWord} moment on camera 🐶🥰`;
    } else if (isSports) {
      line1 = `Incredible ${mainWord} action in motion ⚽🔥`;
    } else {
      line1 = `Amazing ${mainWord} moment on video 🎬✨`;
    }

    const wordsArr = line1.split(" ");
    if (wordsArr.length > 6) {
      const emojis = wordsArr.slice(-1)[0];
      line1 = `${wordsArr.slice(0, 5).join(" ")} ${emojis}`;
    }

    line1 = line1.replace(/[\s.,!?;:\-&]+$/, "").trim();
  }

  const creditLine = `📸: IG/${username}`;
  const instagramCaption = `${line1}\n\n${creditLine}\n\n${hashtags}`;

  return { line1, hashtags, instagramCaption };
}

export function buildXCaption(line1: string, username: string): string {
  const title = line1 || "Unbelievable moment captured on video 🎬✨";
  const creditLine = `📸: IG/${username || "creator"}`;
  return `${title}\n\n${creditLine}\n\n#dogsofX`;
}

export function buildYouTubeCaption(line1: string, hashtagsStr: string, username: string): string {
  const title = line1 || "Unbelievable moment captured on video 🎬✨";
  const creditLine = `📸: IG/${username || "creator"}`;
  const baseTags = (hashtagsStr || "").split(/\s+/).filter((t) => t.startsWith("#"));
  const ytTags = Array.from(new Set(["#shorts", "#YouTubeShorts", ...baseTags])).slice(0, 10).join(" ");
  return `${title}\n\n${creditLine}\n\n${ytTags}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { originalCaption, ownerUsername, imageUrl } = req.body ?? {};
    const meta = await generateContextCaptionDetails(originalCaption, ownerUsername, imageUrl);
    const pinterest = buildPinterestFields(meta.line1, meta.hashtags, ownerUsername || "creator");
    const xCaption = buildXCaption(meta.line1, ownerUsername || "creator");
    const youtubeCaption = buildYouTubeCaption(meta.line1, meta.hashtags, ownerUsername || "creator");

    res.status(200).json({
      caption: meta.instagramCaption,
      instagramCaption: meta.instagramCaption,
      pinterestTitle: pinterest.pinterestTitle,
      pinterestDescription: pinterest.pinterestDescription,
      xCaption: xCaption,
      youtubeCaption: youtubeCaption,
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
