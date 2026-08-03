import { useState } from "react";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";
import Page3 from "@/components/Page3";
import PawTrail from "@/components/PawTrail";

const TOTAL_STEPS = 3;

const STEPS = [
  { title: "Extract & Publish", subtitle: "Reels, watermark, cross-post" },
  { title: "Reviews", subtitle: "Narrative customer stories" },
  { title: "SEO Blog", subtitle: "Long-form article +\nLinkedIn posts" },
];

function PawIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
      <ellipse cx="5.2" cy="8.8" rx="2.1" ry="2.7" />
      <ellipse cx="10.1" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="14.7" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="19" cy="8.8" rx="2.1" ry="2.7" />
    </svg>
  );
}

function Step1Icon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function Step2Icon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Step3Icon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="15,18 9,12 15,6" />
    </svg>
  );
}

// ── Transparent Background Sidebar Dog Image ────────────────────────────────
function SidebarDogArt() {
  return (
    <div className="sidebar-dog-art" aria-hidden="true">
      <img src="/sidebar-dog-transparent.png" alt="CuddlyTails dog illustration" className="sidebar-dog-img" />
    </div>
  );
}

export default function Wizard() {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="app-shell">
      <PawTrail />
      {/* ── Fixed left sidebar ────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-top">
          {/* Brand with Slackey font + Green Paw */}
          <div className="brand-mark">
            <span>CuddlyTails</span>
            <span className="brand-paw"><PawIcon /></span>
          </div>

          {/* Vertical step rail */}
          <nav className="step-rail" aria-label="Progress">
            {STEPS.map((s, idx) => {
              const n = idx + 1;
              const state = n < step ? "complete" : n === step ? "active" : "upcoming";
              return (
                <div
                  key={s.title}
                  className={`step-item ${state}`}
                  onClick={() => setStep(n)}
                  role="button"
                  tabIndex={0}
                >
                  {/* Icon + dashed connector column */}
                  <div className="step-track">
                    <span className="step-marker">
                      {n === 1 && <Step1Icon />}
                      {n === 2 && <Step2Icon />}
                      {n === 3 && <Step3Icon />}
                    </span>
                    {idx < STEPS.length - 1 && (
                      <span className="step-connector" aria-hidden="true" />
                    )}
                  </div>

                  {/* Text */}
                  <span className="step-text">
                    <span className="step-title">{s.title}</span>
                    {(state === "active" || state === "upcoming") && (
                      <span className="step-subtitle">{s.subtitle}</span>
                    )}
                  </span>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Transparent Green Dog Image */}
        <SidebarDogArt />

        {/* Back button pinned to bottom */}
        {step > 1 && (
          <button className="sidebar-back" onClick={goBack}>
            <BackArrow />
            Back to Home
          </button>
        )}
      </aside>

      {/* ── Main content area with slide & fade step transitions ─────────────────────────── */}
      <main className="main-content">
        <div key={step} className="step-content-anim">
          {step === 1 && <Page1 onNext={goNext} />}
          {step === 2 && <Page2 onNext={goNext} onBack={goBack} />}
          {step === 3 && <Page3 onBack={goBack} />}
        </div>
      </main>
    </div>
  );
}