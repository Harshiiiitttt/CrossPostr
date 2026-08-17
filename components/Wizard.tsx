import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";
import Page3 from "@/components/Page3";
import PawTrail from "@/components/PawTrail";
import HeroApiPage from "@/components/HeroApiPage";
import ApiSettingsModal from "@/components/ApiSettingsModal";

import HistoryDrawer from "@/components/HistoryDrawer";
import CrossPostrIcon from "@/components/CrossPostrIcon";

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

function SettingsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function Step1Icon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function Step2Icon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function Step3Icon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function BackArrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

// ── Transparent Background Sidebar Dog Image ────────────────────────────────
function SidebarDogArt() {
  return (
    <div className="sidebar-dog-art" aria-hidden="true">
      <div className="sidebar-dog-paws">
        <span className="dog-paw-bubble p1"><PawIcon /></span>
        <span className="dog-paw-bubble p2"><PawIcon /></span>
        <span className="dog-paw-bubble p3"><PawIcon /></span>
      </div>
      <img src="/sidebar-dog-transparent.png" alt="CuddlyTails dog illustration" className="sidebar-dog-img" />
    </div>
  );
}

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [hasConnectedApi, setHasConnectedApi] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("cuddlytails_user_authenticated");
    const saved = localStorage.getItem("cuddlytails_api_credentials");
    if (isAuth === "true" || saved) {
      setHasConnectedApi(true);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    const mainContent = document.querySelector(".app-main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [step, hasConnectedApi]);

  const goNext = () => {
    setDirection("next");
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };
  const goBack = () => {
    setDirection("back");
    setStep((s) => Math.max(s - 1, 1));
  };
  const goToStep = (targetStep: number) => {
    if (targetStep === step) return;
    setDirection(targetStep > step ? "next" : "back");
    setStep(targetStep);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasConnectedApi) return;
      const target = e.target as HTMLElement | null;
      const isInput = target && (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      );

      if (e.key === "Enter" && !e.shiftKey) {
        if (!isInput && step < TOTAL_STEPS) {
          e.preventDefault();
          goNext();
        }
      } else if ((e.key === "Enter" && e.shiftKey) || (e.key === "ArrowLeft" && !isInput)) {
        if (step > 1) {
          e.preventDefault();
          goBack();
        }
      } else if (e.key === "ArrowRight" && !isInput) {
        if (step < TOTAL_STEPS) {
          e.preventDefault();
          goNext();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, hasConnectedApi]);

  const handleSignOut = () => {
    setStep(1);
    setHasConnectedApi(false);
  };

  const handleConnected = () => {
    setStep(1);
    setHasConnectedApi(true);
  };

  if (!hasConnectedApi) {
    return <HeroApiPage onConnected={handleConnected} />;
  }

  return (
    <div className="app-shell">
      <PawTrail />
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSignOut={handleSignOut}
      />
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        initialMode={step === 2 ? "reviews" : "blogs"}
      />

      {/* ── Mobile Header Top Bar (<768px) ── */}
      <header className="mobile-top-bar" aria-label="Mobile Navigation Bar">
        {/* Extreme Left: Settings Button */}
        <button
          type="button"
          className="mobile-settings-icon-only-btn"
          onClick={() => setIsSettingsOpen(true)}
          title="API Settings"
        >
          <SettingsIcon />
        </button>

        {/* Middle: 3 Step Navigation Buttons */}
        <nav className="mobile-top-steps" aria-label="Step Navigation">
          {STEPS.map((s, idx) => {
            const n = idx + 1;
            const isActive = step === n;
            return (
              <button
                key={s.title}
                type="button"
                className={`mobile-step-btn ${isActive ? "active" : ""}`}
                onClick={() => goToStep(n)}
                title={s.title}
              >
                <span className="mobile-step-icon">
                  {n === 1 && <Step1Icon />}
                  {n === 2 && <Step2Icon />}
                  {n === 3 && <Step3Icon />}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Extreme Right: History Button */}
        <button
          type="button"
          className="mobile-history-icon-only-btn"
          onClick={() => setIsHistoryOpen(true)}
          title="View History"
        >
          <HistoryIcon />
        </button>
      </header>

      {/* ── Ambient Aurora Background Mesh ────────────────── */}
      <div className="aurora-container" aria-hidden="true">
        <div className="aurora-blob blob-amber" />
        <div className="aurora-blob blob-emerald" />
        <div className="aurora-blob blob-purple" />
      </div>

      {/* ── Fixed left sidebar ────────────────────────── */}
      <aside className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""}`}>
        {/* Brand Mark ("Cross Postr 🐾") placed right above control buttons */}
        {!isCollapsed && (
          <div className="brand-mark-wrapper" style={{ marginBottom: "14px" }}>
            <div className="brand-mark" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Cross Postr</span>
              <span className="brand-paw" style={{ opacity: 0.7 }}><PawIcon /></span>
            </div>
          </div>
        )}

        {/* Controls Bar: Sidebar Toggle (Left) + Nav Arrows & Settings (Right) */}
        <div className="sidebar-top-controls">
          <button
            type="button"
            className="sidebar-toggle-btn"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#68B77A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>

          {!isCollapsed ? (
            <div className="sidebar-nav-arrows">
              <button
                type="button"
                className="sidebar-nav-arrow-btn"
                onClick={goBack}
                disabled={step === 1}
                title="Previous Step (Back)"
              >
                <BackArrow />
              </button>
              <button
                type="button"
                className="sidebar-settings-btn"
                onClick={() => setIsSettingsOpen(true)}
                title="API Settings"
              >
                <SettingsIcon />
              </button>
              <button
                type="button"
                className="sidebar-nav-arrow-btn"
                onClick={goNext}
                disabled={step === TOTAL_STEPS}
                title="Next Step"
              >
                <ArrowRightIcon />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="sidebar-settings-btn"
              onClick={() => setIsSettingsOpen(true)}
              title="API Settings"
            >
              <SettingsIcon />
            </button>
          )}
        </div>

        <div className="sidebar-top" style={{ marginTop: isCollapsed ? "16px" : "8px" }}>

          {/* Vertical step rail */}
          <nav className="step-rail" aria-label="Progress">
            {STEPS.map((s, idx) => {
              const n = idx + 1;
              const state = n < step ? "complete" : n === step ? "active" : "upcoming";
              return (
                <div
                  key={s.title}
                  className={`step-item ${state}`}
                  onClick={() => goToStep(n)}
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
                  {!isCollapsed && (
                    <span className="step-text">
                      <span className="step-title">{s.title}</span>
                      {(state === "active" || state === "upcoming") && (
                        <span className="step-subtitle">{s.subtitle}</span>
                      )}
                    </span>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Transparent Green Dog Image */}
        <SidebarDogArt />

      </aside>

      {/* ── Main content area with fixed navigation bar & Keep-Alive steps ─────────────────────────── */}
      <main className="main-content">
        <div className="main-scroll-area">
          <div className="step-content-anim">
            <div className={`step-pane ${step === 1 ? `active step-slide-${direction}` : "inactive"}`}>
              <Page1 onNext={goNext} />
            </div>
            <div className={`step-pane ${step === 2 ? `active step-slide-${direction}` : "inactive"}`}>
              <Page2 onNext={goNext} onBack={goBack} />
            </div>
            <div className={`step-pane ${step === 3 ? `active step-slide-${direction}` : "inactive"}`}>
              <Page3 onBack={goBack} isActive={step === 3} />
            </div>
          </div>
        </div>

        {/* ── Dedicated Fixed Navigation Bar ─────────────────────────── */}
        <footer className="wizard-nav-footer">
          <div className="wizard-nav-container">
            <div className="wizard-nav-left">
              {step > 1 ? (
                <motion.button
                  id="p2-back-btn"
                  className="wizard-btn wizard-btn-back"
                  onClick={goBack}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <motion.div
                    variants={{
                      rest: { y: "0%", opacity: 1 },
                      hover: { y: "-120%", opacity: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    <BackArrow /> Back
                  </motion.div>
                  <motion.div
                    variants={{
                      rest: { y: "120%", opacity: 0 },
                      hover: { y: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    <BackArrow /> Back
                  </motion.div>
                </motion.button>
              ) : (
                <div className="wizard-btn-placeholder" aria-hidden="true" />
              )}
            </div>

            <div key={step} className="wizard-nav-step-indicator">
              Step {step} of {TOTAL_STEPS}
            </div>

            <div className="wizard-nav-right">
              {step < TOTAL_STEPS ? (
                <motion.button
                  id={step === 2 ? "p2-next-btn" : "wizard-next-btn"}
                  className="wizard-btn wizard-btn-next"
                  onClick={goNext}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.95 }}
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <motion.div
                    variants={{
                      rest: { y: "0%", opacity: 1 },
                      hover: { y: "-120%", opacity: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    Next <ArrowRightIcon />
                  </motion.div>
                  <motion.div
                    variants={{
                      rest: { y: "120%", opacity: 0 },
                      hover: { y: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    Next <ArrowRightIcon />
                  </motion.div>
                </motion.button>
              ) : (
                <button
                  className="wizard-btn wizard-btn-next wizard-btn-done"
                  disabled
                >
                  Completed
                </button>
              )}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}