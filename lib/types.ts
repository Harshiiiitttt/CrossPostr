export type Platform = "Pinterest" | "Instagram" | "X" | "YouTube";

export interface ExtractedMedia {
  sourceUrl: string;
  localPath: string;
  caption: string;
  ownerUsername: string;
  resolution: "720p" | "1080p";
}

export interface WatermarkConfig {
  imageWatermarkPath: string | null;
  textWatermark: string;
}

export interface WatermarkedMedia extends ExtractedMedia {
  watermarkedPath: string;
  /** Public HTTPS URL of the watermarked video, set after the upload-to-storage
   *  step. Required before any platform publish call, since Instagram/Pinterest/X
   *  all need the media to already be reachable at a public URL - none of them
   *  accept a direct file upload for video posts. */
  publicUrl?: string;
}

export interface PublishResult {
  platform: Platform;
  success: boolean;
  postUrl?: string;
  error?: string;
}

export interface ProcessStageUpdate {
  stage: "downloading" | "watermarking" | "posting" | "done" | "error";
  index: number;
  message: string;
}

export interface ProcessPage1Request {
  reelUrls: string[];
  textWatermark: string;
  platforms: Platform[];
  imageWatermarkBase64: string | null;
  customCaption?: string;
}

export interface ProcessPage1Response {
  results: Array<{
    sourceUrl: string;
    caption: string;
    ownerUsername: string;
    publishResults: PublishResult[];
  }>;
  skipped: number;
}

export interface CuddlytailsReview {
  service: "Pet Sitter" | "Dog Walker" | "AI Vet" | "AI Pet Nutrition";
  reviewerName: string;
  dogName: string;
  servicePersonName: string;
  wordCount: number;
  text: string;
}

export interface BlogFaq {
  question: string;
  answer: string;
}

/** H3-level breakdown used inside a section - e.g. one subtopic per
 *  named cause under a "Common Causes" H2. */
export interface BlogSubtopic {
  subheading: string;
  paragraphs: string[];
}

/** A single H2 section. Can carry plain paragraphs, a bulleted list,
 *  nested H3 subtopics, or a mix - matching whichever the topic calls for. */
export interface BlogSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  subtopics?: BlogSubtopic[];
}

export interface SeoBlog {
  title: string; // H1
  intro: string[]; // 1-2 intro paragraphs right under the H1
  sections: BlogSection[]; // H2 blocks, each shaped per its content
  vetCta: string; // mandatory "Get help from a CuddlyTails AI vet here." line
  conclusion: string[]; // 1-2 wrap-up paragraphs
  faqs: BlogFaq[]; // exactly 5
  approxWordCount: number;
}

/** Three LinkedIn post variations repurposed from a generated blog, each
 *  ending with the link emoji (🔗) as the placeholder for the real URL. */
export interface LinkedInPosts {
  safeBet: string;
  cleanLabel: string;
  microStory: string;
}
/** A single narrative, Rover-style customer review generated for CuddlyTails,
 *  mentioning the brand name exactly once. */
export interface PetCareReview {
  reviewerName: string;
  providerName: string;
  dogName: string;
  dogBreed?: string;
  reviewText: string;
  rating: number;
}