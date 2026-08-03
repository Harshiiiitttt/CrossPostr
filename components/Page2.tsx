import { useState } from "react";
import type { PetCareReview } from "@/lib/types";
import PawLoader from "@/components/PawLoader";
import Toast from "@/components/Toast";

interface Page2Props {
  onNext: () => void;
  onBack: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="9,18 15,12 9,6" />
    </svg>
  );
}

// ── Stars component (logic unchanged) ────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="p2-stars" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Page2({ onNext, onBack }: Page2Props) {
  const [reviews, setReviews] = useState<PetCareReview[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ── All logic unchanged ────────────────────────────────────────────────────

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-reviews", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setReviews(data.reviews);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const copy = async (text: string, i: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setToastMsg("Review copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="p2-root">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}

      {/* ── Header ──────────────────────────────────────── */}
      <div className="p2-header">
        <span className="p2-step-chip">STEP 2 OF 3</span>
        <h1 className="p2-heading">Cuddlytails review generator</h1>
        <p className="p2-subheading">
          Generates 3 realistic, narrative-style customer reviews.<br />
          Skip this page if you don&apos;t need reviews right now.
        </p>
      </div>

      {/* ── Generate section ────────────────────────────── */}
      <div className="p2-generate-wrap">
        <button
          id="p2-generate-btn"
          className="p2-btn-generate"
          onClick={generate}
          disabled={loading}
        >
          {loading ? <span className="p2-spinner" /> : <SparkIcon />}
          {loading ? "Generating…" : "Generate reviews"}
        </button>
      </div>

      {/* ── Error ───────────────────────────────────────── */}
      {error && <p className="p2-error">{error}</p>}

      {/* ── Loading Card ──────────────────────────────── */}
      {loading && (
        <div className="p2-reviews-card ai-active-glow" style={{ marginTop: 24 }}>
          <PawLoader
            label="Crafting narrative customer reviews..."
            sublabel="Prompts AI to write 3 authentic CuddlyTails dog care stories"
          />
        </div>
      )}

      {/* ── Reviews card ────────────────────────────────── */}
      {!loading && reviews && (
        <div className="p2-reviews-card text-reveal-entry">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={`p2-review-row${i < reviews.length - 1 ? " p2-review-row--divided" : ""}`}
            >
              {/* Avatar with initials */}
              <div className="p2-avatar" aria-hidden="true">
                {getInitials(r.reviewerName)}
              </div>

              {/* Review content */}
              <div className="p2-review-body">
                <div className="p2-review-top">
                  <span className="p2-reviewer-name">{r.reviewerName}</span>
                  <Stars rating={r.rating} />
                </div>
                <p className="p2-review-info">
                  Dog: {r.dogName}&nbsp;&bull;&nbsp;Provider: {r.providerName}
                </p>
                <p className="p2-review-text">{r.reviewText}</p>
              </div>

              {/* Copy button */}
              <button
                id={`p2-copy-btn-${i}`}
                className="p2-copy-btn"
                onClick={() => copy(r.reviewText, i)}
              >
                <CopyIcon />
                {copiedIndex === i ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── Bottom navigation ───────────────────────────── */}
      <div className="p2-nav">
        <button id="p2-back-btn" className="p2-nav-back" onClick={onBack}>
          Back
        </button>
        <button id="p2-next-btn" className="p2-nav-next" onClick={onNext}>
          Next <ArrowRightIcon />
        </button>
      </div>

    </div>
  );
}