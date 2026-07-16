import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { extractReel } from "@/lib/extractor";
import { applyWatermarks } from "@/lib/watermark";
import { publishToPlatforms, cleanupTempFiles } from "@/lib/publisher";
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

  let imageWatermarkPath: string | null = null;
  if (body.imageWatermarkBase64) {
    imageWatermarkPath = path.join(os.tmpdir(), `watermark-logo-${Date.now()}.png`);
    await fs.writeFile(imageWatermarkPath, Buffer.from(body.imageWatermarkBase64, "base64"));
  }

  const tempFiles: string[] = [];
  const results: ProcessPage1Response["results"] = [];

  try {
    for (const i of nonBlankIndexes) {
      const url = urls[i];
      const extracted = await extractReel(url);
      tempFiles.push(extracted.localPath);

      const watermarked = await applyWatermarks(extracted, {
        imageWatermarkPath,
        textWatermark: body.textWatermark,
      });
      tempFiles.push(watermarked.watermarkedPath);

      const publishResults = await publishToPlatforms(watermarked, body.platforms);

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
    if (imageWatermarkPath) await fs.unlink(imageWatermarkPath).catch(() => undefined);
  }
}
