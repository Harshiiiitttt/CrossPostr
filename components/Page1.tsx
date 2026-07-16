import { useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import type { Platform, ProcessPage1Response } from "@/lib/types";

const ALL_PLATFORMS: Platform[] = ["Pinterest", "Instagram", "X", "YouTube"];
const STAGE_LABELS = ["Downloading", "Watermarking", "Posting"];

interface Page1Props {
  onNext: () => void;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(new Error("Could not read the watermark image."));
    reader.readAsDataURL(file);
  });
}

export default function Page1({ onNext }: Page1Props) {
  const [reelUrls, setReelUrls] = useState(["", "", ""]);
  const [textWatermark, setTextWatermark] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [running, setRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [response, setResponse] = useState<ProcessPage1Response | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateUrl = (i: number, value: string) => {
    const next = [...reelUrls];
    next[i] = value;
    setReelUrls(next);
  };

  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const runAutomation = async () => {
    setRunning(true);
    setError(null);
    setResponse(null);
    setStageIndex(0);

    try {
      const imageWatermarkBase64 = imageFile ? await fileToBase64(imageFile) : null;

      // Fluid stage indicator: advance through the labels while the request is in flight.
      const tick = setInterval(() => {
        setStageIndex((i) => Math.min(i + 1, STAGE_LABELS.length - 1));
      }, 900);

      const res = await fetch("/api/process-page1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reelUrls, textWatermark, platforms, imageWatermarkBase64 }),
      });

      clearInterval(tick);
      setStageIndex(STAGE_LABELS.length - 1);

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setResponse(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const percent = running ? ((stageIndex + 1) / STAGE_LABELS.length) * 100 : 0;

  return (
    <div>
      <span className="badge">Step 1 of 3</span>
      <h1 className="page-title">Extract, watermark &amp; publish</h1>
      <p className="page-sub">
        Works with Reels published to your own authorized Instagram account. Leave any field
        blank to skip - nothing here is required.
      </p>

      <div className="card">
        <label>Reel URLs (up to 3, from your own account)</label>
        {reelUrls.map((url, i) => (
          <input
            key={i}
            type="url"
            placeholder={`Reel URL ${i + 1} (optional)`}
            value={url}
            onChange={(e) => updateUrl(i, e.target.value)}
          />
        ))}
      </div>

      <div className="card">
        <label>Image watermark (top-left, 80% opacity)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />

        <label>Text watermark (bottom-left, bold 14px Arial, 80% opacity)</label>
        <input
          type="text"
          placeholder="e.g. @cuddlytails"
          value={textWatermark}
          onChange={(e) => setTextWatermark(e.target.value)}
        />
      </div>

      <div className="card">
        <label>Publish to</label>
        <div className="checkbox-row">
          {ALL_PLATFORMS.map((p) => (
            <label key={p}>
              <input
                type="checkbox"
                checked={platforms.includes(p)}
                onChange={() => togglePlatform(p)}
              />
              {p}
            </label>
          ))}
        </div>

        <button
          className="primary"
          onClick={runAutomation}
          disabled={running || reelUrls.every((u) => !u.trim())}
        >
          {running ? "Running..." : "Run automation"}
        </button>

        {running && (
          <div style={{ marginTop: 14 }}>
            <ProgressBar percent={percent} label={STAGE_LABELS[stageIndex]} />
          </div>
        )}

        {error && <div className="result-item error">{error}</div>}

        {response && (
          <div>
            {response.skipped > 0 && (
              <div className="result-item">{response.skipped} slot(s) were left blank and skipped.</div>
            )}
            {response.results.map((r) => (
              <div className="result-item" key={r.sourceUrl}>
                <strong>@{r.ownerUsername}</strong> - {r.caption.slice(0, 60) || "(no caption)"}
                <ul>
                  {r.publishResults.map((pr) => (
                    <li key={pr.platform}>
                      {pr.platform}: {pr.success ? `posted (${pr.postUrl})` : `failed - ${pr.error}`}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nav-row">
        <span />
        <button className="primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}
