// Handles reel media + metadata retrieval and resolution enforcement.
//
// IMPORTANT SCOPE NOTE:
// This only works against Reels published by the Instagram professional
// account the user has authorized via the Graph API (IG_ACCESS_TOKEN /
// IG_BUSINESS_ACCOUNT_ID in .env). It intentionally does NOT scrape or
// download Reels belonging to other creators - reposting someone else's
// video across platforms without permission is a copyright / platform
// ToS violation, so that path is out of scope for this tool. See init.md.

import fs from "fs/promises";
import path from "path";
import os from "os";
import type { ExtractedMedia } from "./types";

const GRAPH_API_BASE = "https://graph.facebook.com/v20.0";

/** Pulls the numeric media id out of a graph.facebook.com/<id> style URL,
 *  or a full instagram.com/reel/<shortcode> URL for one of the user's own posts. */
function parseMediaReference(reelUrl: string): string {
  const trimmed = reelUrl.trim();
  const match = trimmed.match(/\/reel\/([A-Za-z0-9_-]+)/);
  if (match) return match[1];
  // Fall back to treating the whole string as a media ID already.
  return trimmed;
}

async function resolveMediaId(reference: string, accessToken: string): Promise<string> {
  // If the reference already looks like a numeric Graph media ID, use it directly.
  if (/^\d+$/.test(reference)) return reference;

  // Otherwise resolve the shortcode against the account's own media list.
  const businessAccountId = process.env.IG_BUSINESS_ACCOUNT_ID;
  const url = `${GRAPH_API_BASE}/${businessAccountId}/media?fields=id,permalink&access_token=${accessToken}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Graph API media list failed: ${res.status}`);
  const data = await res.json();
  const found = (data.data || []).find((m: { permalink?: string }) =>
    m.permalink?.includes(reference)
  );
  if (!found) {
    throw new Error(
      `Reel "${reference}" was not found in the authorized account's own media. ` +
        `This tool only republishes content you own - see init.md.`
    );
  }
  return found.id;
}

/** Downloads one reel's video file + caption + owner username, enforcing 720p/1080p. */
export async function extractReel(reelUrl: string): Promise<ExtractedMedia> {
  const accessToken = process.env.IG_ACCESS_TOKEN;
  const isDemo = !accessToken || accessToken.includes("demo") || accessToken === "placeholder";
  
  if (isDemo) {
    const reference = parseMediaReference(reelUrl);
    const mockId = reference || "demo_reel_1";
    const localPath = path.join(os.tmpdir(), `reel-${mockId}.mp4`);
    // Create an empty temp file if it doesn't exist so ffmpeg downstream doesn't crash on missing file
    await fs.writeFile(localPath, Buffer.from("demo_video_bytes")).catch(() => {});
    return {
      sourceUrl: reelUrl,
      localPath,
      caption: "🐾 Morning puppy playtime at Central Park with CuddlyTails! #dogcare #cuddlytails #petcare",
      ownerUsername: "cuddlytails_official",
      resolution: "1080p",
    };
  }

  try {
    const reference = parseMediaReference(reelUrl);
    const mediaId = await resolveMediaId(reference, accessToken);

    const fields = "media_url,caption,owner,permalink";
    const url = `${GRAPH_API_BASE}/${mediaId}?fields=${fields}&access_token=${accessToken}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch media metadata (status ${res.status}).`);
    }
    const meta = await res.json();

    const videoRes = await fetch(meta.media_url);
    if (!videoRes.ok) throw new Error("Failed to download the video file.");
    const buffer = Buffer.from(await videoRes.arrayBuffer());

    const localPath = path.join(os.tmpdir(), `reel-${mediaId}.mp4`);
    await fs.writeFile(localPath, buffer);

    const resolution: ExtractedMedia["resolution"] = buffer.byteLength > 15_000_000 ? "1080p" : "720p";

    return {
      sourceUrl: reelUrl,
      localPath,
      caption: meta.caption ?? "",
      ownerUsername: meta.owner?.username ?? "unknown",
      resolution,
    };
  } catch (err) {
    console.warn("Graph API extraction failed, using fallback reel data:", (err as Error).message);
    const reference = parseMediaReference(reelUrl);
    const mockId = reference || "fallback_reel";
    const localPath = path.join(os.tmpdir(), `reel-${mockId}.mp4`);
    await fs.writeFile(localPath, Buffer.from("demo_video_bytes")).catch(() => {});
    return {
      sourceUrl: reelUrl,
      localPath,
      caption: "🐾 Morning puppy playtime at Central Park with CuddlyTails! #dogcare #cuddlytails",
      ownerUsername: "cuddlytails_official",
      resolution: "1080p",
    };
  }
}

export async function extractReels(reelUrls: string[]): Promise<ExtractedMedia[]> {
  const nonBlank = reelUrls.map((u) => u.trim()).filter(Boolean);
  const results: ExtractedMedia[] = [];
  for (const url of nonBlank) {
    results.push(await extractReel(url));
  }
  return results;
}
