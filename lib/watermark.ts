// Layers the top-left image watermark and bottom-left 14px bold Arial text
// watermark onto a downloaded reel, via ffmpeg's overlay + drawtext filters.
// Requires the `ffmpeg` binary to be present on the host (see README.md).

import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";
import type { ExtractedMedia, WatermarkConfig, WatermarkedMedia } from "./types";

const execFileAsync = promisify(execFile);

export async function applyWatermarks(
  media: ExtractedMedia,
  config: WatermarkConfig
): Promise<WatermarkedMedia> {
  const outPath = path.join(os.tmpdir(), `watermarked-${path.basename(media.localPath)}`);

  const filters: string[] = [];
  const inputs = ["-i", media.localPath];

  if (config.imageWatermarkPath) {
    inputs.push("-i", config.imageWatermarkPath);
    // Scale the logo down small, keep it clearly visible, place top-left, 80% opacity.
    filters.push(
      "[1:v]scale=iw*0.12:-1,format=rgba,colorchannelmixer=aa=0.8[wm]",
      "[0:v][wm]overlay=x=16:y=16[withimg]"
    );
  }

  const textEscaped = config.textWatermark.replace(/:/g, "\\:").replace(/'/g, "\\'");
  const drawtext =
    `drawtext=text='${textEscaped}':fontfile=/usr/share/fonts/truetype/msttcorefonts/Arial_Bold.ttf` +
    `:fontsize=14:fontcolor=white@0.8:x=16:y=h-th-16`;

  if (filters.length > 0) {
    filters.push(`[withimg]${drawtext}[out]`);
  } else {
    filters.push(`[0:v]${drawtext}[out]`);
  }

  const args = [
    ...inputs,
    "-filter_complex",
    filters.join(";"),
    "-map",
    "[out]",
    "-map",
    "0:a?",
    "-c:a",
    "copy",
    "-y",
    outPath,
  ];

  await execFileAsync("ffmpeg", args);

  return { ...media, watermarkedPath: outPath };
}

export async function applyWatermarksToAll(
  mediaItems: ExtractedMedia[],
  config: WatermarkConfig
): Promise<WatermarkedMedia[]> {
  const out: WatermarkedMedia[] = [];
  for (const m of mediaItems) {
    out.push(await applyWatermarks(m, config));
  }
  return out;
}
