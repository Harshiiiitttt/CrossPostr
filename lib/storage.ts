// Public video hosting step.
//
// WHY THIS EXISTS: Instagram's Content Publishing API, Pinterest's Pins API, and
// X's video-post flow all require the media to already be sitting at a public
// HTTPS URL before you can create a post - none of them accept a direct video
// file upload in the "create post" call itself. Since extractor.ts downloads a
// Reel to a local temp file and watermark.ts writes the watermarked result to
// another local temp file, neither is reachable by any of those APIs on its own.
// This module bridges that gap: upload the local watermarked file to public
// blob storage, hand the resulting URL to publisher.ts, then delete it once
// every platform has finished (successfully or not) so nothing lingers in
// storage indefinitely.
//
// Uses Vercel Blob (@vercel/blob) - a simple public-object store that works
// the same whether the app is deployed on Vercel or run locally, as long as
// BLOB_READ_WRITE_TOKEN is set. See init.md for how to get that token.

import { put, del } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

function requireBlobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set - see init.md for how to create a Vercel Blob store " +
        "and get this token."
    );
  }
  return token;
}

/** Uploads a local video file to public storage and returns its public HTTPS URL. */
export async function uploadToPublicStorage(localPath: string): Promise<string> {
  const token = requireBlobToken();
  const buffer = await fs.readFile(localPath);

  // Prefix with a timestamp so repeated runs on the same source filename never collide.
  const filename = `reels/${Date.now()}-${path.basename(localPath)}`;

  const result = await put(filename, buffer, {
    access: "public",
    contentType: "video/mp4",
    token,
  });

  return result.url;
}

/** Deletes previously uploaded public blobs. Call this once every platform's
 *  publish attempt has finished (success or failure) for a given video - the
 *  URL only needs to stay public long enough for each platform to fetch it. */
export async function cleanupPublicStorage(urls: string[]): Promise<void> {
  const token = requireBlobToken();
  await Promise.all(urls.map((url) => del(url, { token }).catch(() => undefined)));
}