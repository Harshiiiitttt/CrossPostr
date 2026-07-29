import { useState } from "react";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";
import Page3 from "@/components/Page3";

const TOTAL_STEPS = 3;

const STEPS = [
  { title: "Extract & Publish", subtitle: "Reels, watermark, cross-post" },
  { title: "Reviews", subtitle: "Narrative customer stories" },
  { title: "SEO Blog", subtitle: "Long-form article + LinkedIn posts" },
];

function PawIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
      <ellipse cx="5.2" cy="8.8" rx="2.1" ry="2.7" />
      <ellipse cx="10.1" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="14.7" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="19" cy="8.8" rx="2.1" ry="2.7" />
    </svg>
  );
}

export default function Wizard() {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="app-shell">
      <div>
        <p className="brand-mark">
          Cuddly<span>Tails</span>
        </p>
        <nav className="step-rail" aria-label="Progress">
          {STEPS.map((s, idx) => {
            const n = idx + 1;
            const state = n < step ? "complete" : n === step ? "active" : "upcoming";
            return (
              <div key={s.title} className={`step-item ${state}`}>
                <span className="step-marker">
                  <PawIcon filled={state !== "upcoming"} />
                </span>
                <span className="step-text">
                  <span className="step-title">{s.title}</span>
                  {state === "active" && <span className="step-subtitle">{s.subtitle}</span>}
                </span>
              </div>
            );
          })}
        </nav>
      </div>

      <div>
        {step === 1 && <Page1 onNext={goNext} />}
        {step === 2 && <Page2 onNext={goNext} onBack={goBack} />}
        {step === 3 && <Page3 onBack={goBack} />}
      </div>
    </div>
  );
}