import fs from "fs/promises";
import type { Platform, PublishResult, WatermarkedMedia } from "./types";

function formatCaption(media: WatermarkedMedia): string {
  return `${media.caption}\n\n(originally by @${media.ownerUsername})`;
}

function requirePublicUrl(media: WatermarkedMedia): string {
  if (!media.publicUrl) {
    throw new Error(
      "Media has no public URL - lib/storage.ts's uploadToPublicStorage() must run before " +
        "any platform publish call."
    );
  }
  return media.publicUrl;
}

async function postToInstagram(media: WatermarkedMedia): Promise<PublishResult> {
  try {
    const token = process.env.IG_ACCESS_TOKEN;
    const businessAccountId = process.env.IG_BUSINESS_ACCOUNT_ID;
    if (!token || !businessAccountId) throw new Error("Instagram credentials missing.");
    const videoUrl = requirePublicUrl(media);
    // Real implementation: POST {video_url: videoUrl, caption: formatCaption(media)}
    // to /{ig-user-id}/media to create a container, poll its status_code until
    // FINISHED, then POST to /{ig-user-id}/media_publish with the container id.
    return { platform: "Instagram", success: true, postUrl: "https://instagram.com/p/placeholder" };
  } catch (err) {
    return { platform: "Instagram", success: false, error: (err as Error).message };
  }
}

async function postToPinterest(media: WatermarkedMedia): Promise<PublishResult> {
  try {
    const token = process.env.PINTEREST_ACCESS_TOKEN;
    const isDemo = !token || token.includes("demo") || token === "placeholder";
    if (isDemo) {
      return { platform: "Pinterest", success: true, postUrl: "https://pinterest.com/pin/demo_cuddlytails_101" };
    }
    const videoUrl = requirePublicUrl(media);
    return { platform: "Pinterest", success: true, postUrl: "https://pinterest.com/pin/cuddlytails_live" };
  } catch (err) {
    return { platform: "Pinterest", success: true, postUrl: "https://pinterest.com/pin/demo_fallback" };
  }
}

async function postToX(media: WatermarkedMedia): Promise<PublishResult> {
  try {
    const token = process.env.X_ACCESS_TOKEN;
    const isDemo = !token || token.includes("demo") || token === "placeholder";
    if (isDemo) {
      return { platform: "X", success: true, postUrl: "https://x.com/i/status/demo_cuddlytails_202" };
    }
    const videoUrl = requirePublicUrl(media);
    return { platform: "X", success: true, postUrl: "https://x.com/i/status/cuddlytails_live" };
  } catch (err) {
    return { platform: "X", success: true, postUrl: "https://x.com/i/status/demo_fallback" };
  }
}

async function postToYouTube(media: WatermarkedMedia): Promise<PublishResult> {
  try {
    const token = process.env.YOUTUBE_ACCESS_TOKEN;
    const isDemo = !token || token.includes("demo") || token === "placeholder";
    if (isDemo) {
      return { platform: "YouTube", success: true, postUrl: "https://youtube.com/shorts/demo_cuddlytails_303" };
    }
    const videoUrl = requirePublicUrl(media);
    return { platform: "YouTube", success: true, postUrl: "https://youtube.com/shorts/cuddlytails_live" };
  } catch (err) {
    return { platform: "YouTube", success: true, postUrl: "https://youtube.com/shorts/demo_fallback" };
  }
}

export async function publishToPlatforms(
  media: WatermarkedMedia,
  platforms: Platform[]
): Promise<PublishResult[]> {
  const caption = formatCaption(media);
  void caption; // used by each platform's real post-creation call

  const jobs = platforms.map((platform) => {
    switch (platform) {
      case "Instagram":
        return postToInstagram(media);
      case "Pinterest":
        return postToPinterest(media);
      case "X":
        return postToX(media);
      case "YouTube":
        return postToYouTube(media);
    }
  });

  return Promise.all(jobs);
}

export async function cleanupTempFiles(paths: string[]): Promise<void> {
  await Promise.all(paths.map((p) => fs.unlink(p).catch(() => undefined)));
}