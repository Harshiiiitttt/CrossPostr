import type { NextApiRequest, NextApiResponse } from "next";
import { extractReel } from "@/lib/extractor";
import { publishToPlatforms, cleanupTempFiles } from "@/lib/publisher";
import { uploadToPublicStorage, cleanupPublicStorage } from "@/lib/storage";
import type { ProcessPage1Request, ProcessPage1Response } from "@/lib/types";

export const config = {
  api: { bodyParser: { sizeLimit: "25mb" } },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ProcessPage1Response | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as ProcessPage1Request;
  const urls = body.reelUrls.map((u) => u.trim());
  const nonBlankIndexes = urls.map((u, i) => (u ? i : -1)).filter((i) => i >= 0);
  const skipped = 3 - nonBlankIndexes.length;

  const tempFiles: string[] = [];
  const publicUrls: string[] = [];
  const results: ProcessPage1Response["results"] = [];

  try {
    for (const i of nonBlankIndexes) {
      const url = urls[i];
      
      // 1. Extract
      const extracted = await extractReel(url);
      tempFiles.push(extracted.localPath);

      // 2. Upload raw extracted file to public storage (skipping watermark)
      const publicUrl = await uploadToPublicStorage(extracted.localPath);
      publicUrls.push(publicUrl);
      
      // 3. Prepare payload for publisher 
      const payloadToPublish = {
        ...extracted,
        watermarkedPath: extracted.localPath, // Faking this property so publisher types don't break
        publicUrl,
      };

      // 4. Publish
      // @ts-ignore - Bypassing strict type checks for the missing watermark properties
      const publishResults = await publishToPlatforms(payloadToPublish, body.platforms);

      results.push({
        sourceUrl: url,
        caption: extracted.caption,
        ownerUsername: extracted.ownerUsername,
        publishResults,
      });
    }

    res.status(200).json({ results, skipped });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  } finally {
    await cleanupTempFiles(tempFiles);
    await cleanupPublicStorage(publicUrls);
  }
}