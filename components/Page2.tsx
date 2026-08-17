import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { PetCareReview } from "@/lib/types";
import PawLoader from "@/components/PawLoader";
import Toast from "@/components/Toast";
import HistoryDrawer from "@/components/HistoryDrawer";
import { useBlogGeneration } from "@/lib/BlogGenerationContext";

interface Page2Props {
  onNext: () => void;
  onBack: () => void;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
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

function DownloadIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 13c-2.8 0-5 2.2-5 5 0 .6.4 1 1 1h8c.6 0 1-.4 1-1 0-2.8-2.2-5-5-5zm-5-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm10 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-8.5-4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function ThreeDotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#68B77A" aria-hidden="true" style={{ display: "block" }}>
      <circle cx="4.5" cy="12" r="2.4" fill="#68B77A" />
      <circle cx="12" cy="12" r="2.4" fill="#68B77A" />
      <circle cx="19.5" cy="12" r="2.4" fill="#68B77A" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="1" y1="14" x2="7" y2="14" />
      <line x1="9" y1="8" x2="15" y2="8" />
      <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

// ── Service & Persona Options ──────────────────────────────────────────────────

const SERVICE_TYPES = [
  "In-Home Boarding & Sitting",
  "Dog Walking & Exercise",
  "Pet Grooming & Spa",
  "Overnight Care & House Sitting",
  "Last-Minute Emergency Care",
];

const SERVICE_TYPE_COLOR_MAP: Record<string, { color: string; bg: string; border: string; activeBg: string; activeBorder: string }> = {
  "In-Home Boarding & Sitting": {
    color: "#E85D75", // Warm Rose
    bg: "rgba(232, 93, 117, 0.05)",
    border: "rgba(232, 93, 117, 0.25)",
    activeBg: "rgba(232, 93, 117, 0.14)",
    activeBorder: "#E85D75",
  },
  "Dog Walking & Exercise": {
    color: "#35A866", // Fresh Green
    bg: "rgba(53, 168, 102, 0.05)",
    border: "rgba(53, 168, 102, 0.25)",
    activeBg: "rgba(53, 168, 102, 0.14)",
    activeBorder: "#35A866",
  },
  "Pet Grooming & Spa": {
    color: "#7C4DFF", // Vibrant Purple
    bg: "rgba(124, 77, 255, 0.05)",
    border: "rgba(124, 77, 255, 0.25)",
    activeBg: "rgba(124, 77, 255, 0.14)",
    activeBorder: "#7C4DFF",
  },
  "Overnight Care & House Sitting": {
    color: "#3B82F6", // Trustworthy Blue
    bg: "rgba(59, 130, 246, 0.05)",
    border: "rgba(59, 130, 246, 0.25)",
    activeBg: "rgba(59, 130, 246, 0.14)",
    activeBorder: "#3B82F6",
  },
  "Last-Minute Emergency Care": {
    color: "#F28C28", // Attention-Grabbing Orange
    bg: "rgba(242, 140, 40, 0.05)",
    border: "rgba(242, 140, 40, 0.25)",
    activeBg: "rgba(242, 140, 40, 0.14)",
    activeBorder: "#F28C28",
  },
};

const PERSONA_TONES = [
  { key: "Enthusiastic Pet Parent", label: "Enthusiastic Parent", icon: <HeartIcon />, desc: "Warm, detailed & deeply appreciative" },
  { key: "Anxious First-Time Owner", label: "Anxious First-Timer", icon: <ShieldCheckIcon />, desc: "Hesitant initially, relieved by photo updates" },
  { key: "Busy Working Professional", label: "Busy Professional", icon: <ClockIcon />, desc: "Focuses on reliability, punctuality & ease" },
  { key: "Senior Dog Care Specialist", label: "Senior Dog Care", icon: <PawIcon />, desc: "Emphasizes gentle care & medical attentiveness" },
  { key: "Custom Persona", label: "Custom Persona", icon: <SparkIcon />, desc: "Write your own customer persona of choice" },
];

const PERSONA_COLOR_MAP: Record<string, { color: string; bg: string; border: string; activeBg: string; activeBorder: string; shadow: string }> = {
  "Enthusiastic Pet Parent": {
    color: "#0D9488", // Teal
    bg: "rgba(13, 148, 136, 0.05)",
    border: "rgba(13, 148, 136, 0.25)",
    activeBg: "rgba(13, 148, 136, 0.14)",
    activeBorder: "#0D9488",
    shadow: "rgba(13, 148, 136, 0.25)",
  },
  "Anxious First-Time Owner": {
    color: "#D97706", // Yellow / Warm Amber
    bg: "rgba(217, 119, 6, 0.05)",
    border: "rgba(217, 119, 6, 0.25)",
    activeBg: "rgba(217, 119, 6, 0.14)",
    activeBorder: "#D97706",
    shadow: "rgba(217, 119, 6, 0.25)",
  },
  "Busy Working Professional": {
    color: "#E11D48", // Red / Rose
    bg: "rgba(225, 29, 72, 0.05)",
    border: "rgba(225, 29, 72, 0.25)",
    activeBg: "rgba(225, 29, 72, 0.14)",
    activeBorder: "#E11D48",
    shadow: "rgba(225, 29, 72, 0.25)",
  },
  "Senior Dog Care Specialist": {
    color: "#8B5CF6", // Lavender / Soft Purple
    bg: "rgba(139, 92, 246, 0.05)",
    border: "rgba(139, 92, 246, 0.25)",
    activeBg: "rgba(139, 92, 246, 0.14)",
    activeBorder: "#8B5CF6",
    shadow: "rgba(139, 92, 246, 0.25)",
  },
  "Custom Persona": {
    color: "#64748B", // Slate Gray
    bg: "rgba(100, 116, 139, 0.05)",
    border: "rgba(100, 116, 139, 0.25)",
    activeBg: "rgba(100, 116, 139, 0.14)",
    activeBorder: "#64748B",
    shadow: "rgba(100, 116, 139, 0.25)",
  },
};

const POPULAR_LOCATIONS = [
  "New Jersey",
  "New York",
  "Miami",
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

// ── Stars component ──────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="p2-stars" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}{"☆".repeat(Math.max(0, 5 - rating))}
    </span>
  );
}

function HistoryIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Page2({ onNext, onBack }: Page2Props) {
  const { reviews, reviewsLoading, reviewsError, generateReviews, reviewHistory } = useBlogGeneration();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [showReviewsHeaderMenu, setShowReviewsHeaderMenu] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const menuRefHeader = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRefHeader.current && !menuRefHeader.current.contains(event.target as Node)) {
        setShowReviewsHeaderMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Custom Parameters State
  const [serviceType, setServiceType] = useState<string>("In-Home Boarding & Sitting");
  const [location, setLocation] = useState<string>("");
  const [persona, setPersona] = useState<string>("Enthusiastic Pet Parent");
  const [isCustomPersona, setIsCustomPersona] = useState<boolean>(false);
  const [customPersonaText, setCustomPersonaText] = useState<string>("");
  const [reviewLength, setReviewLength] = useState<"detailed" | "short">("detailed");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleGenerate = () => {
    const activePersona = isCustomPersona ? (customPersonaText.trim() || "Custom Persona") : persona;
    setIsCollapsed(true);
    generateReviews({
      serviceType,
      location: location.trim() || undefined,
      persona: activePersona,
      reviewLength,
    });
  };

  const copySingleReview = async (text: string, i: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setToastMsg("Review copied to clipboard!");
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAllReviews = async () => {
    if (!reviews || reviews.length === 0) return;
    const formatted = reviews
      .map(
        (r, i) =>
          `=== REVIEW ${i + 1} (${r.reviewerName}) ===\nDog: ${r.dogName}${r.dogBreed ? ` (${r.dogBreed})` : ""} | Sitter: ${r.providerName}\nRating: 5/5 Stars\n\n"${r.reviewText}"`
      )
      .join("\n\n");

    await navigator.clipboard.writeText(formatted);
    setAllCopied(true);
    setToastMsg("All 3 reviews copied to clipboard!");
    setTimeout(() => setAllCopied(false), 2000);
  };

  const exportAsJson = () => {
    if (!reviews) return;
    const blob = new Blob([JSON.stringify(reviews, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cuddlytails-reviews.json";
    a.click();
    URL.revokeObjectURL(url);
    setToastMsg("Downloaded reviews as JSON!");
  };

  const exportAsMarkdown = () => {
    if (!reviews) return;
    let md = `# CuddlyTails Customer Reviews\n\n`;
    reviews.forEach((r, i) => {
      md += `## Review ${i + 1} - ${r.reviewerName}\n`;
      md += `**Dog:** ${r.dogName}${r.dogBreed ? ` (${r.dogBreed})` : ""} | **Sitter/Walker:** ${r.providerName} | **Rating:** 5/5 Stars ⭐⭐⭐⭐⭐\n\n`;
      md += `> "${r.reviewText}"\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cuddlytails-reviews.md";
    a.click();
    URL.revokeObjectURL(url);
    setToastMsg("Downloaded reviews as Markdown (.md)!");
  };

  const exportAsText = () => {
    if (!reviews) return;
    const txt = reviews
      .map(
        (r, i) =>
          `REVIEW ${i + 1}: ${r.reviewerName}\nDog: ${r.dogName}${r.dogBreed ? ` (${r.dogBreed})` : ""}\nProvider: ${r.providerName}\nText: "${r.reviewText}"`
      )
      .join("\n\n----------------------------------------\n\n");

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cuddlytails-reviews.txt";
    a.click();
    URL.revokeObjectURL(url);
    setToastMsg("Downloaded reviews as Text (.txt)!");
  };

  return (
    <div className="p2-root">
      {toastMsg && <Toast message={toastMsg} onClose={() => setToastMsg(null)} />}
      <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} initialMode="reviews" />

      {/* ── Header ──────────────────────────────────────── */}
      <div className="p2-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
        <div>
          <div className="p3-step-chip-wrapper">
            <span className="p3-step-chip">
              <span className="p3-step-chip-dot" />
              <span className="p3-step-chip-text">STEP 2 OF 3</span>
              <span className="p3-step-chip-divider">•</span>
              <span className="p3-step-chip-tag">CUSTOMER REVIEWS</span>
            </span>
          </div>
          <h1 className="p2-heading">Cuddlytails review generator</h1>
          <p className="p2-subheading">
            Generates 3 realistic, narrative-style customer reviews with custom service types, locations &amp; persona angles.<br />
            Skip this page if you don&apos;t need reviews right now.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsHistoryOpen(true)}
          style={{
            background: "rgba(104, 183, 122, 0.12)",
            border: "1px solid rgba(104, 183, 122, 0.3)",
            color: "#68B77A",
            padding: "8px 14px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: "pointer",
            whiteSpace: "nowrap",
            marginTop: "8px",
          }}
        >
          <HistoryIcon /> History ({reviewHistory.length})
        </button>
      </div>

      {/* ── Collapsed Parameters Summary Ribbon ──────────── */}
      {isCollapsed ? (
        <div
          className="glass-panel"
          style={{
            background: "var(--panel)",
            border: "1px solid var(--panel-border)",
            borderRadius: "14px",
            padding: "12px 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
              Active Options:
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(104, 183, 122, 0.12)", border: "1px solid rgba(104, 183, 122, 0.3)", color: "#68B77A", padding: "4px 12px", borderRadius: "16px", fontSize: "0.8rem", fontWeight: 600 }}>
              <CheckIcon /> {serviceType}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(104, 183, 122, 0.12)", border: "1px solid rgba(104, 183, 122, 0.3)", color: "#68B77A", padding: "4px 12px", borderRadius: "16px", fontSize: "0.8rem", fontWeight: 600 }}>
              <HeartIcon /> {isCustomPersona ? (customPersonaText.trim() || "Custom Persona") : persona}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(104, 183, 122, 0.12)", border: "1px solid rgba(104, 183, 122, 0.3)", color: "#68B77A", padding: "4px 12px", borderRadius: "16px", fontSize: "0.8rem", fontWeight: 600 }}>
              {reviewLength === "detailed" ? <><BookOpenIcon /> Detailed Story</> : <><ZapIcon /> Short Testimonial</>}
            </span>
            {location && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(104, 183, 122, 0.12)", border: "1px solid rgba(104, 183, 122, 0.3)", color: "#68B77A", padding: "4px 12px", borderRadius: "16px", fontSize: "0.8rem", fontWeight: 600 }}>
                <LocationPinIcon /> {location}
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            {/* Edit options button with settings emoji */}
            <button
              type="button"
              onClick={() => setIsCollapsed(false)}
              style={{
                height: "36px",
                padding: "0 14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "8px",
                border: "1px solid var(--panel-border)",
                background: "var(--surface)",
                color: "var(--text-main)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <SlidersIcon /> Edit options
            </button>

            {/* Generate / Regenerate button as Green Circle UP Arrow with smooth dual-layer roll-up animation */}
            <motion.button
              id="p2-generate-btn-ribbon"
              type="button"
              onClick={handleGenerate}
              disabled={reviewsLoading}
              title={reviewsLoading ? "Generating..." : (reviews && reviews.length > 0 ? "Regenerate" : "Generate")}
              initial="rest"
              whileHover={reviewsLoading ? undefined : "hover"}
              whileTap={reviewsLoading ? undefined : { scale: 0.90 }}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #68B77A 0%, #4E985E 100%)",
                color: "#FFFFFF",
                border: "none",
                position: "relative",
                overflow: "hidden",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: reviewsLoading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(104, 183, 122, 0.4)",
                transition: "box-shadow 0.2s ease",
                flexShrink: 0,
              }}
            >
              {reviewsLoading ? (
                <span className="p2-spinner" style={{ width: "16px", height: "16px", color: "#FFFFFF" }} />
              ) : (
                <>
                  {/* Default Arrow - Slides Up & Out on Hover */}
                  <motion.div
                    variants={{
                      rest: { y: "0%", opacity: 1 },
                      hover: { y: "-130%", opacity: 0 },
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    <ArrowUpIcon />
                  </motion.div>

                  {/* Hover Arrow Clone - Smoothly Rolls Up from Bottom */}
                  <motion.div
                    variants={{
                      rest: { y: "130%", opacity: 0 },
                      hover: { y: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    <ArrowUpIcon />
                  </motion.div>
                </>
              )}
            </motion.button>
          </div>
        </div>
      ) : (
        /* ── Expanded Parameters Card ───────────────────────── */
        <div className="p2-controls-card glass-panel" style={{ background: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: "14px", padding: "20px 24px", marginBottom: "20px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              Customize Review Generator Parameters
            </span>
            <button
              type="button"
              onClick={() => setIsCollapsed(true)}
              style={{
                height: "32px",
                padding: "0 12px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "8px",
                border: "1px solid rgba(104, 183, 122, 0.35)",
                background: "rgba(104, 183, 122, 0.12)",
                color: "#68B77A",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <SlidersIcon /> Minimize options
            </button>
          </div>

          {/* Service Type Selection */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
              1. Select Care Service Type
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              {SERVICE_TYPES.map((st) => {
                const isSelected = serviceType === st;
                const theme = SERVICE_TYPE_COLOR_MAP[st] || {
                  color: "#2D8A4E",
                  bg: "rgba(45, 138, 78, 0.05)",
                  border: "rgba(45, 138, 78, 0.25)",
                  activeBg: "rgba(45, 138, 78, 0.14)",
                  activeBorder: "#2D8A4E",
                };
                return (
                  <button
                    key={st}
                    type="button"
                    className={`p2-chip ${isSelected ? "p2-chip--active" : ""}`}
                    onClick={() => setServiceType(st)}
                    style={{
                      height: "34px",
                      padding: "0 14px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "20px",
                      fontSize: "0.83rem",
                      fontWeight: 600,
                      border: isSelected ? `1.5px solid ${theme.activeBorder}` : `1px solid ${theme.border}`,
                      background: isSelected ? theme.activeBg : theme.bg,
                      color: theme.color,
                      cursor: "pointer",
                      boxShadow: isSelected ? `0 2px 8px ${theme.border}` : "none",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    {isSelected && <CheckIcon />}
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Persona & Tone Angle */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
              2. Customer Persona & Tone Angle
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", alignItems: "stretch" }}>
              {PERSONA_TONES.map((pt) => {
                const isSelected = isCustomPersona ? pt.key === "Custom Persona" : persona === pt.key;
                const theme = PERSONA_COLOR_MAP[pt.key] || {
                  color: "#2D8A4E",
                  bg: "rgba(45, 138, 78, 0.05)",
                  border: "rgba(45, 138, 78, 0.25)",
                  activeBg: "rgba(45, 138, 78, 0.14)",
                  activeBorder: "#2D8A4E",
                  shadow: "rgba(45, 138, 78, 0.2)",
                };
                return (
                  <button
                    key={pt.key}
                    type="button"
                    onClick={() => {
                      if (pt.key === "Custom Persona") {
                        setIsCustomPersona(true);
                        setPersona(customPersonaText.trim() || "Custom Persona");
                      } else {
                        setIsCustomPersona(false);
                        setPersona(pt.key);
                      }
                    }}
                    style={{
                      padding: "12px 14px",
                      borderRadius: "10px",
                      textAlign: "left",
                      fontSize: "0.82rem",
                      border: isSelected ? `1.5px solid ${theme.activeBorder}` : `1px solid ${theme.border}`,
                      background: isSelected ? theme.activeBg : theme.bg,
                      color: "var(--text-main)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      boxShadow: isSelected ? `0 4px 14px ${theme.shadow}` : "0 2px 6px rgba(15, 23, 42, 0.02)",
                      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                  >
                    <div style={{ fontWeight: 700, color: theme.color, display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ color: theme.color, display: "inline-flex" }}>{pt.icon}</span>
                      {pt.label}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "var(--body-text, #334155)", opacity: 0.85, marginTop: "3px", lineHeight: "1.35" }}>
                      {pt.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Persona Text Box */}
            {isCustomPersona && (
              <div style={{ marginTop: "10px" }}>
                <input
                  type="text"
                  value={customPersonaText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomPersonaText(val);
                    setPersona(val.trim() || "Custom Persona");
                  }}
                  placeholder="Write your custom customer persona (e.g. Frequent business traveler with 2 energetic Rescue Shepherds)..."
                  style={{
                    width: "100%",
                    height: "38px",
                    margin: 0,
                    marginBottom: 0,
                    padding: "0 12px",
                    borderRadius: "8px",
                    border: "1.5px solid #68B77A",
                    background: "var(--surface)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>

          {/* Location (Optional) */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
              3. Target City / Region <span style={{ opacity: 0.6, fontWeight: 400 }}>(Optional)</span>
            </label>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "220px", display: "flex", alignItems: "center" }}>
                <span style={{ position: "absolute", left: "12px", pointerEvents: "none", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LocationPinIcon />
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. New Jersey, New York, or Miami..."
                  style={{
                    width: "100%",
                    height: "38px",
                    margin: 0,
                    marginBottom: 0,
                    padding: "0 12px 0 34px",
                    borderRadius: "8px",
                    border: "1.5px solid #68B77A",
                    background: "var(--surface)",
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                {POPULAR_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setLocation(loc)}
                    style={{
                      height: "38px",
                      padding: "0 12px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      borderRadius: "8px",
                      border: location === loc ? "1.5px solid #68B77A" : "1px solid var(--panel-border)",
                      background: location === loc ? "rgba(104, 183, 122, 0.15)" : "var(--surface)",
                      color: location === loc ? "#68B77A" : "var(--text-main)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxSizing: "border-box",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <LocationPinIcon />
                    {loc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Review Format & Length Selection */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "8px" }}>
              4. Review Length & Depth
            </label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => setReviewLength("detailed")}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  border: reviewLength === "detailed" ? "1.5px solid #68B77A" : "1px solid var(--panel-border)",
                  background: reviewLength === "detailed" ? "rgba(104, 183, 122, 0.15)" : "var(--surface)",
                  color: reviewLength === "detailed" ? "#68B77A" : "var(--text-main)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {reviewLength === "detailed" ? <CheckIcon /> : <BookOpenIcon />}
                Detailed Story (3–4 Sentences)
              </button>

              <button
                type="button"
                onClick={() => setReviewLength("short")}
                style={{
                  height: "36px",
                  padding: "0 16px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  border: reviewLength === "short" ? "1.5px solid #68B77A" : "1px solid var(--panel-border)",
                  background: reviewLength === "short" ? "rgba(104, 183, 122, 0.15)" : "var(--surface)",
                  color: reviewLength === "short" ? "#68B77A" : "var(--text-main)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {reviewLength === "short" ? <CheckIcon /> : <ZapIcon />}
                Short Testimonial (1–2 Sentences)
              </button>
            </div>
          </div>

          {/* Action Row Inside Card when Expanded */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", paddingTop: "14px", borderTop: "1px solid var(--panel-border)" }}>
            <motion.button
              id="p2-generate-btn"
              type="button"
              onClick={handleGenerate}
              disabled={reviewsLoading}
              title={reviewsLoading ? "Generating..." : (reviews && reviews.length > 0 ? "Regenerate Reviews" : "Generate Reviews")}
              initial="rest"
              whileHover={reviewsLoading ? undefined : "hover"}
              whileTap={reviewsLoading ? undefined : { scale: 0.90 }}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #68B77A 0%, #4E985E 100%)",
                color: "#FFFFFF",
                border: "none",
                position: "relative",
                overflow: "hidden",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: reviewsLoading ? "not-allowed" : "pointer",
                boxShadow: "0 4px 14px rgba(104, 183, 122, 0.4)",
                transition: "box-shadow 0.2s ease",
                flexShrink: 0,
              }}
            >
              {reviewsLoading ? (
                <span className="p2-spinner" style={{ width: "18px", height: "18px", color: "#FFFFFF" }} />
              ) : (
                <>
                  <motion.div
                    variants={{
                      rest: { y: "0%", opacity: 1 },
                      hover: { y: "-130%", opacity: 0 },
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    <ArrowUpIcon />
                  </motion.div>
                  <motion.div
                    variants={{
                      rest: { y: "130%", opacity: 0 },
                      hover: { y: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    <ArrowUpIcon />
                  </motion.div>
                </>
              )}
            </motion.button>
          </div>

        </div>
      )}

      {/* ── Error ───────────────────────────────────────── */}
      {reviewsError && <p className="p2-error" style={{ marginTop: "16px" }}>{reviewsError}</p>}

      {/* ── Loading Card (Skeleton Shimmer & Live Status Header) ───────────────── */}
      {reviewsLoading && (
        <div className="p2-skeleton-card ai-active-glow" style={{ marginTop: 24 }}>
          {/* Shimmer sweep */}
          <div className="p2-skeleton-shimmer" />

          {/* Loader Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--panel-border)", background: "rgba(104, 183, 122, 0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span className="p2-spinner" style={{ width: "16px", height: "16px", color: "#68B77A" }} />
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#68B77A" }}>
                  Crafting 3 Authentic Reviews...
                </div>
                <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  Service: <strong>{serviceType}</strong> &bull; Tone: <strong>{persona}</strong>{location ? ` &bull; City: ${location}` : ""}
                </div>
              </div>
            </div>
          </div>

          {/* 3 Skeleton Review Rows */}
          {[0, 1, 2].map((idx) => (
            <div
              key={idx}
              className={`p2-review-row${idx < 2 ? " p2-review-row--divided" : ""}`}
              style={{ padding: "20px", opacity: 0.8 }}
            >
              {/* Skeleton Avatar */}
              <div
                className="p2-avatar p2-skeleton-block"
                style={{ width: "42px", height: "42px", borderRadius: "50%", flexShrink: 0 }}
              />

              {/* Skeleton Review Body */}
              <div className="p2-review-body" style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div className="p2-skeleton-block" style={{ width: "120px", height: "14px" }} />
                  <div className="p2-skeleton-block" style={{ width: "70px", height: "12px" }} />
                </div>
                <div className="p2-skeleton-block" style={{ width: "180px", height: "11px", marginBottom: "10px" }} />
                <div className="p2-skeleton-block" style={{ width: "92%", height: "12px", marginBottom: "6px" }} />
                <div className="p2-skeleton-block" style={{ width: "80%", height: "12px" }} />
              </div>

              {/* Skeleton Copy Button */}
              <div
                className="p2-skeleton-block"
                style={{ width: "70px", height: "32px", borderRadius: "8px" }}
              />
            </div>
          ))}
        </div>
      )}

      {/* ── Reviews card ────────────────────────────────── */}
      {!reviewsLoading && reviews && (
        <div className="p2-reviews-card text-reveal-entry" style={{ marginTop: 24 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--panel-border)", background: "rgba(104, 183, 122, 0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.05em", color: "#68B77A", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <PawIcon /> Generated Reviews &bull; {serviceType} {location ? `(${location})` : ""}
            </span>
            {/* Tone label + Three Dots Action Menu */}
            <div ref={menuRefHeader} style={{ display: "flex", alignItems: "center", gap: "10px", position: "relative" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                Tone: <strong>{persona}</strong>
              </span>

              <button
                type="button"
                onClick={() => setShowReviewsHeaderMenu((prev) => !prev)}
                title="Export & Copy Options"
                style={{
                  padding: "4px 6px",
                  border: "none",
                  background: "transparent",
                  color: "#68B77A",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  opacity: showReviewsHeaderMenu ? 1 : 0.75,
                  borderRadius: "4px",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = showReviewsHeaderMenu ? "1" : "0.75")}
              >
                <ThreeDotsIcon />
              </button>

              {/* Dropdown Menu */}
              {showReviewsHeaderMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "36px",
                    right: "0",
                    zIndex: 100,
                    background: "var(--panel)",
                    border: "1px solid var(--panel-border)",
                    borderRadius: "10px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                    padding: "6px",
                    minWidth: "190px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      copyAllReviews();
                      setShowReviewsHeaderMenu(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "6px",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-main)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(104, 183, 122, 0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <CopyIcon /> Copy All Reviews
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportAsMarkdown();
                      setShowReviewsHeaderMenu(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "6px",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-main)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(104, 183, 122, 0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <DownloadIcon /> Export as .MD
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportAsJson();
                      setShowReviewsHeaderMenu(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "6px",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-main)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(104, 183, 122, 0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <DownloadIcon /> Export as .JSON
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      exportAsText();
                      setShowReviewsHeaderMenu(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "6px",
                      background: "transparent",
                      border: "none",
                      color: "var(--text-main)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(104, 183, 122, 0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <DownloadIcon /> Export as .TXT
                  </button>
                </div>
              )}
            </div>
          </div>

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
                  Dog: <strong>{r.dogName}</strong>{r.dogBreed ? ` (${r.dogBreed})` : ""}&nbsp;&bull;&nbsp;Provider: <strong>{r.providerName}</strong>
                </p>
                <p className="p2-review-text">{r.reviewText}</p>
              </div>

              {/* Copy button */}
              <button
                id={`p2-copy-btn-${i}`}
                className={`p2-copy-btn ${copiedIndex === i ? "copied-pop" : ""}`}
                onClick={() => copySingleReview(r.reviewText, i)}
              >
                {copiedIndex === i ? <CheckIcon /> : <CopyIcon />}
                {copiedIndex === i ? "Copied!" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}