import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";
import Page3 from "@/components/Page3";
import PawTrail from "@/components/PawTrail";
import HeroApiPage from "@/components/HeroApiPage";
import ApiSettingsModal from "@/components/ApiSettingsModal";

import HistoryDrawer from "@/components/HistoryDrawer";
import CrossPostrIcon from "@/components/CrossPostrIcon";
import { useBlogGeneration } from "@/lib/BlogGenerationContext";

const TOTAL_STEPS = 3;

const STEPS = [
  { title: "Extract & Publish", shortTitle: "Reels", subtitle: "Reels, watermark, cross-post" },
  { title: "Reviews", shortTitle: "Reviews", subtitle: "Narrative customer stories" },
  { title: "SEO Blog", shortTitle: "SEO Blog", subtitle: "Long-form article +\nLinkedIn posts" },
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
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14,2 14,8 20,8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function PlusDocIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

function SearchCmdIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function BoltSmallIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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
    <div
      className="sidebar-dog-art"
      aria-hidden="true"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div className="sidebar-dog-paws">
        <span className="dog-paw-bubble p1"><PawIcon /></span>
        <span className="dog-paw-bubble p2"><PawIcon /></span>
        <span className="dog-paw-bubble p3"><PawIcon /></span>
      </div>
      <img
        src="/sidebar-dog-transparent.png"
        alt="CuddlyTails dog illustration"
        className="sidebar-dog-img"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          WebkitTouchCallout: "none",
        }}
      />
    </div>
  );
}

export default function Wizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<"next" | "back">("next");
  const [hasConnectedApi, setHasConnectedApi] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState("");
  const [selectedCmdIdx, setSelectedCmdIdx] = useState(0);
  const commandInputRef = useRef<HTMLInputElement | null>(null);
  const { loading: isBlogGenerating, resetBlogState } = useBlogGeneration();

  useEffect(() => {
    try {
      const isAuth = localStorage.getItem("cuddlytails_user_authenticated");
      const saved = localStorage.getItem("cuddlytails_api_credentials");
      if (isAuth === "true" || saved) {
        setHasConnectedApi(true);
      }
    } catch {
      // ignore SSR/storage errors
    } finally {
      setIsInitializing(false);
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

  const commandActions = [
    {
      id: "step-1",
      title: "Step 1: Extract & Publish Reels",
      subtitle: "Extract Instagram Reels, apply watermarks & cross-post",
      badge: "Step 1",
      icon: <Step1Icon />,
      action: () => {
        goToStep(1);
        setIsCommandOpen(false);
      },
    },
    {
      id: "step-2",
      title: "Step 2: Customer Reviews Generator",
      subtitle: "Generate unique dog, sitter & walker customer story reviews",
      badge: "Step 2",
      icon: <Step2Icon />,
      action: () => {
        goToStep(2);
        setIsCommandOpen(false);
      },
    },
    {
      id: "step-3",
      title: "Step 3: SEO Blog & LinkedIn Studio",
      subtitle: "Draft Grade A+ 1,450–1,500 word SEO articles & LinkedIn posts",
      badge: "Step 3",
      icon: <Step3Icon />,
      action: () => {
        goToStep(3);
        setIsCommandOpen(false);
      },
    },
    {
      id: "new-blog",
      title: "Start New SEO Blog Draft",
      subtitle: "Clear the current studio canvas and enter a new blog topic",
      badge: "Action",
      icon: <PlusDocIcon />,
      action: () => {
        resetBlogState();
        goToStep(3);
        setIsCommandOpen(false);
      },
    },
    {
      id: "open-history",
      title: "Open Generation History Drawer",
      subtitle: "Browse saved SEO articles and customer review batches",
      badge: "Drawer",
      icon: <HistoryIcon />,
      action: () => {
        setIsCommandOpen(false);
        setIsHistoryOpen(true);
      },
    },
    {
      id: "open-settings",
      title: "Open API & Platform Settings",
      subtitle: "Configure Gemini Flash Cascade & social publishing keys",
      badge: "Modal",
      icon: <SettingsIcon />,
      action: () => {
        setIsCommandOpen(false);
        setIsSettingsOpen(true);
      },
    },
  ];

  const filteredCommands = commandActions.filter((cmd) => {
    const q = commandQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.subtitle.toLowerCase().includes(q) ||
      cmd.badge.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setSelectedCmdIdx(0);
  }, [commandQuery, isCommandOpen]);

  useEffect(() => {
    if (isCommandOpen) {
      setTimeout(() => commandInputRef.current?.focus(), 40);
    } else {
      setCommandQuery("");
    }
  }, [isCommandOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasConnectedApi) return;

      // Global Command Palette toggle: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
        return;
      }

      if (isCommandOpen) {
        if (e.key === "Escape") {
          e.preventDefault();
          setIsCommandOpen(false);
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedCmdIdx((idx) => (filteredCommands.length ? (idx + 1) % filteredCommands.length : 0));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedCmdIdx((idx) =>
            filteredCommands.length ? (idx - 1 + filteredCommands.length) % filteredCommands.length : 0
          );
        } else if (e.key === "Enter" && filteredCommands[selectedCmdIdx]) {
          e.preventDefault();
          filteredCommands[selectedCmdIdx].action();
        }
        return;
      }

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
  }, [step, hasConnectedApi, isCommandOpen, filteredCommands, selectedCmdIdx]);

  const handleSignOut = () => {
    setStep(1);
    setHasConnectedApi(false);
  };

  const handleConnected = () => {
    setStep(1);
    setHasConnectedApi(true);
  };

  if (isInitializing) {
    return <div style={{ minHeight: "100vh", background: "var(--bg-main, #F8FAFC)" }} />;
  }

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

      {/* ── Quick-Switch Command Palette Modal (Ctrl+K / Cmd+K) ── */}
      {isCommandOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Quick Switch Command Palette"
          onClick={() => setIsCommandOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            padding: "11vh 16px 24px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "560px",
              background: "rgba(255, 255, 255, 0.97)",
              borderRadius: "20px",
              border: "1px solid rgba(104, 183, 122, 0.35)",
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255,255,255,0.8) inset",
              overflow: "hidden",
            }}
          >
            {/* Search Input Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "14px 18px",
                borderBottom: "1px solid #E2E8F0",
                background: "#F8FAFC",
              }}
            >
              <span style={{ color: "#15803D", display: "inline-flex", alignItems: "center" }}>
                <SearchCmdIcon />
              </span>
              <input
                ref={commandInputRef}
                type="text"
                value={commandQuery}
                onChange={(e) => setCommandQuery(e.target.value)}
                placeholder="Jump to any studio step, history drawer, or action..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.94rem",
                  fontWeight: 600,
                  color: "#0F172A",
                }}
              />
              <button
                type="button"
                onClick={() => setIsCommandOpen(false)}
                style={{
                  padding: "3px 8px",
                  borderRadius: "6px",
                  border: "1px solid #CBD5E1",
                  background: "#FFFFFF",
                  color: "#64748B",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ESC
              </button>
            </div>

            {/* Command Items List */}
            <div style={{ maxHeight: "340px", overflowY: "auto", padding: "8px" }}>
              {filteredCommands.length === 0 ? (
                <div style={{ padding: "28px 16px", textAlign: "center", color: "#64748B", fontSize: "0.88rem" }}>
                  No matching commands found for &ldquo;{commandQuery}&rdquo;.
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedCmdIdx;
                  return (
                    <button
                      key={cmd.id}
                      type="button"
                      onMouseEnter={() => setSelectedCmdIdx(idx)}
                      onClick={cmd.action}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        padding: "11px 14px",
                        borderRadius: "12px",
                        border: "none",
                        background: isSelected ? "#F0FDF4" : "transparent",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "background 0.14s ease",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: isSelected ? "#DCFCE7" : "#F1F5F9",
                            color: isSelected ? "#15803D" : "#475569",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            border: isSelected ? "1px solid #86EFAC" : "1px solid #E2E8F0",
                          }}
                        >
                          {cmd.icon}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: isSelected ? "#14532D" : "#0F172A" }}>
                            {cmd.title}
                          </div>
                          <div style={{ fontSize: "0.76rem", color: "#64748B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {cmd.subtitle}
                          </div>
                        </div>
                      </div>
                      <span
                        style={{
                          padding: "3px 9px",
                          borderRadius: "999px",
                          background: isSelected ? "#15803D" : "#F1F5F9",
                          color: isSelected ? "#FFFFFF" : "#64748B",
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {cmd.badge}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 18px",
                borderTop: "1px solid #E2E8F0",
                background: "#F8FAFC",
                fontSize: "0.72rem",
                color: "#64748B",
                fontWeight: 600,
              }}
            >
              <span>Use Arrow Keys to navigate, Enter to select</span>
              <span style={{ color: "#15803D", fontWeight: 700 }}>Cross Postr Studio Suite</span>
            </div>
          </div>
        </div>
      )}

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
        {/* Brand Mark ("Cross Postr") placed right above control buttons */}
        {!isCollapsed && (
          <div className="brand-mark-wrapper" style={{ marginBottom: "14px" }}>
            <div className="brand-mark" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Cross Postr</span>
              <span className="brand-paw" style={{ opacity: 0.7 }}><PawIcon /></span>
            </div>
          </div>
        )}

        {/* Controls Bar: Sidebar Toggle (Left) + Vertical Divider + Nav Arrows & Settings (Right) */}
        <div className="sidebar-top-controls">
          <div className="sidebar-top-left-controls">
            <button
              type="button"
              className="sidebar-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="4" ry="4" />
                <line x1="9" y1="3" x2="9" y2="21" />
              </svg>
            </button>
            {!isCollapsed && <span className="sidebar-controls-divider" />}
          </div>

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
                      <span className="step-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {s.title}
                        {n === 3 && isBlogGenerating && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", fontSize: "0.65rem", fontWeight: 800, padding: "1px 6px", borderRadius: "99px", background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", animation: "pulse 1.5s infinite" }}>
                            <BoltSmallIcon /> Generating...
                          </span>
                        )}
                      </span>
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

        {/* ── Glassmorphic Bottom Navigation Dock (Upgrade #5) ─────────────────────────── */}
        <footer className="wizard-nav-footer">
          <div className="wizard-nav-container">
            {/* Extreme Left: Back Button */}
            <div className="wizard-nav-left">
              {step > 1 ? (
                <motion.button
                  id="p2-back-btn"
                  className="wizard-btn wizard-btn-back"
                  onClick={goBack}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.94 }}
                  style={{ position: "relative", overflow: "hidden", height: "42px", padding: "0 14px", minWidth: "80px", borderRadius: "12px", fontSize: "0.86rem" }}
                >
                  <motion.div
                    variants={{
                      rest: { y: "0%", opacity: 1 },
                      hover: { y: "-130%", opacity: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
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
                      rest: { y: "130%", opacity: 0 },
                      hover: { y: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
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
                <div className="wizard-btn-placeholder" aria-hidden="true" style={{ width: "80px", height: "42px" }} />
              )}
            </div>

            {/* Centered Interactive Step Pills + Quick Command Trigger (Ctrl+K) */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 6px",
                borderRadius: "14px",
                background: "rgba(248, 250, 252, 0.92)",
                border: "1px solid rgba(203, 213, 225, 0.75)",
                boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
              }}
            >
              {STEPS.map((s, idx) => {
                const n = idx + 1;
                const isActive = step === n;
                return (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => goToStep(n)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "10px",
                      border: isActive ? "1px solid rgba(104, 183, 122, 0.45)" : "1px solid transparent",
                      background: isActive ? "#ECFDF5" : "transparent",
                      color: isActive ? "#15803D" : "#64748B",
                      fontSize: "0.76rem",
                      fontWeight: isActive ? 800 : 600,
                      cursor: "pointer",
                      transition: "all 0.16s ease",
                    }}
                    title={`Go to Step ${n}: ${s.title}`}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", transform: "scale(0.85)" }}>
                      {n === 1 && <Step1Icon />}
                      {n === 2 && <Step2Icon />}
                      {n === 3 && <Step3Icon />}
                    </span>
                    <span>{n}. {s.shortTitle}</span>
                  </button>
                );
              })}

              <span style={{ width: "1px", height: "18px", background: "#CBD5E1", margin: "0 2px" }} />

              <button
                type="button"
                onClick={() => setIsCommandOpen(true)}
                title="Open Quick-Switch Command Palette (Ctrl + K)"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 10px",
                  borderRadius: "9px",
                  border: "1px solid #E2E8F0",
                  background: "#FFFFFF",
                  color: "#475569",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <SearchCmdIcon />
                <span>Ctrl K</span>
              </button>
            </div>

            {/* Extreme Right: Animated Next Button (Page 2 Style) */}
            <div className="wizard-nav-right">
              {step < TOTAL_STEPS ? (
                <motion.button
                  id={step === 2 ? "p2-next-btn" : "wizard-next-btn"}
                  className="wizard-btn wizard-btn-next p2-animated-next-btn"
                  onClick={goNext}
                  initial="rest"
                  whileHover="hover"
                  whileTap={{ scale: 0.94 }}
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    height: "42px",
                    padding: "0 14px",
                    minWidth: "84px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #68B77A 0%, #4E985E 100%)",
                    color: "#FFFFFF",
                    border: "none",
                    boxShadow: "0 4px 16px rgba(104, 183, 122, 0.42)",
                    cursor: "pointer",
                  }}
                >
                  <motion.div
                    variants={{
                      rest: { y: "0%", opacity: 1 },
                      hover: { y: "-130%", opacity: 0 },
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      fontWeight: 700,
                      fontSize: "0.86rem",
                    }}
                  >
                    Next <ArrowRightIcon />
                  </motion.div>
                  <motion.div
                    variants={{
                      rest: { y: "130%", opacity: 0 },
                      hover: { y: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                      fontWeight: 700,
                      fontSize: "0.86rem",
                    }}
                  >
                    Next <ArrowRightIcon />
                  </motion.div>
                </motion.button>
              ) : (
                <button
                  className="wizard-btn wizard-btn-next wizard-btn-done"
                  disabled
                  style={{
                    height: "42px",
                    padding: "0 14px",
                    minWidth: "84px",
                    borderRadius: "12px",
                    fontSize: "0.86rem",
                  }}
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
