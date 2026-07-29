import { useState } from "react";
import type { PetCareReview } from "@/lib/types";

interface Page2Props {
  onNext: () => void;
  onBack: () => void;
}

function Stars({ rating }: { rating: number }) {
  return <span>{"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}</span>;
}

export default function Page2({ onNext, onBack }: Page2Props) {
  const [reviews, setReviews] = useState<PetCareReview[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

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
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div>
      <span className="badge">Step 2 of 3</span>
      <h1 className="page-title">Cuddlytails review generator</h1>
      <p className="page-sub">
        Generates 3 realistic, narrative-style customer reviews. Skip this page if you don't
        need reviews right now.
      </p>

      <div className="card">
        <button className="primary" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate reviews"}
        </button>

        {error && <div className="result-item error">{error}</div>}

        {reviews && (
          <div>
            {reviews.map((r, i) => (
              <div className="result-item" key={i}>
                <strong>{r.reviewerName}</strong>
                <span style={{ marginLeft: 8, color: "var(--accent)" }}>
                  <Stars rating={r.rating} />
                </span>
                <div style={{ color: "var(--muted)", fontSize: "0.8rem", margin: "4px 0" }}>
                  Dog: {r.dogName} - Provider: {r.providerName}
                </div>
                <div className="review-block">{r.reviewText}</div>
                <button onClick={() => copy(r.reviewText, i)} style={{ marginTop: 8 }}>
                  {copiedIndex === i ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nav-row">
        <button onClick={onBack}>Back</button>
        <button className="primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
}