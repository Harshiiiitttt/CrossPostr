import { useState } from "react";
import type { CuddlytailsReview } from "@/lib/types";

interface Page2Props {
  onNext: () => void;
  onBack: () => void;
}

export default function Page2({ onNext, onBack }: Page2Props) {
  const [reviews, setReviews] = useState<CuddlytailsReview[] | null>(null);
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
        Generates 4 humanized client reviews - Pet Sitter, Dog Walker, AI Vet, AI Pet Nutrition.
        Skip this page if you don't need reviews right now.
      </p>

      <div className="card">
        <button className="primary" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate reviews"}
        </button>

        {error && <div className="result-item error">{error}</div>}

        {reviews && (
          <div>
            {reviews.map((r, i) => (
              <div className="result-item" key={r.service}>
                <strong>{r.service}</strong> - {r.wordCount} words
                <div className="review-block">{r.text}</div>
                <button onClick={() => copy(r.text, i)} style={{ marginTop: 8 }}>
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
