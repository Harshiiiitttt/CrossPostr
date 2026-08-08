import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import PawLoader from "@/components/PawLoader";
import type { Platform, ProcessPage1Response } from "@/lib/types";

const ALL_PLATFORMS: Platform[] = ["Pinterest", "Instagram", "X", "YouTube"];
const STAGE_LABELS = ["Downloading", "Watermarking", "Posting"];

export type WatermarkPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const POSITION_LABELS: Record<WatermarkPosition, string> = {
  "top-left": "Top-Left",
  "top-right": "Top-Right",
  "bottom-left": "Bottom-Left",
  "bottom-right": "Bottom-Right",
};

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

function UploadCloudIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
      <path d="M12 12v9" />
      <path d="m16 16-4-4-4 4" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function UserIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function PawIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
      <ellipse cx="5.2" cy="8.8" rx="2.1" ry="2.7" />
      <ellipse cx="10.1" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="14.7" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="19" cy="8.8" rx="2.1" ry="2.7" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  Instagram: {
    label: "Instagram",
    color: "#E1306C",
    bg: "rgba(225, 48, 108, 0.15)",
    icon: <InstagramIcon />,
  },
  Pinterest: {
    label: "Pinterest",
    color: "#E60023",
    bg: "rgba(230, 0, 35, 0.15)",
    icon: <PinterestIcon />,
  },
  X: {
    label: "X (Twitter)",
    color: "#1DA1F2",
    bg: "rgba(29, 161, 242, 0.15)",
    icon: <XIcon />,
  },
  YouTube: {
    label: "YouTube Shorts",
    color: "#FF0000",
    bg: "rgba(255, 0, 0, 0.15)",
    icon: <YouTubeIcon />,
  },
};

function parseReelId(url: string): string {
  const match = url.trim().match(/\/(?:reel|reels|p)\/([A-Za-z0-9_-]+)/i);
  if (match) return match[1];
  return url.trim();
}

export default function Page1({ onNext }: Page1Props) {
  const [reelUrl, setReelUrl] = useState("");
  const [textWatermark, setTextWatermark] = useState("");
  const [customCaption, setCustomCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [watermarkPos, setWatermarkPos] = useState<WatermarkPosition>("top-left");
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(80);
  const [platforms, setPlatforms] = useState<Platform[]>(["Instagram", "Pinterest"]);
  const [showAdvancedWatermark, setShowAdvancedWatermark] = useState<boolean>(false);
  const [running, setRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [response, setResponse] = useState<ProcessPage1Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [inspectedMeta, setInspectedMeta] = useState<{ reelId: string; ownerUsername: string; imageUrl?: string; rawCaption?: string; resolution: string } | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyCaption = () => {
    if (!customCaption.trim()) return;
    navigator.clipboard.writeText(customCaption);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isInvalidInstagramUrl = useMemo(() => {
    const trimmed = reelUrl.trim();
    if (!trimmed) return false;
    const isIgPattern = /^https?:\/\/(?:www\.)?instagram\.com\/(?:reel|reels|p|tv)\/[A-Za-z0-9_-]+/i.test(trimmed) ||
                        (trimmed.includes("instagram.com/") && (trimmed.includes("/reel/") || trimmed.includes("/p/") || trimmed.includes("/tv/")));
    return !isIgPattern;
  }, [reelUrl]);

  useEffect(() => {
    if (!reelUrl.trim() || !reelUrl.includes("instagram.com")) {
      setInspectedMeta(null);
      return;
    }

    let isMounted = true;
    setIsInspecting(true);
    
    const timer = setTimeout(() => {
      fetch("/api/inspect-reel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: reelUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (isMounted && data.reelId) {
            const username = data.ownerUsername || "cuddlytails";
            setInspectedMeta({ reelId: data.reelId, ownerUsername: username, imageUrl: data.imageUrl, rawCaption: data.caption, resolution: data.resolution || "1080x1920 HD" });
            
            // Generate visually accurate caption analyzing actual video cover frame with Gemini Vision
            if (isMounted) setIsGeneratingCaption(true);
            fetch("/api/generate-caption", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ originalCaption: data.caption, ownerUsername: username, imageUrl: data.imageUrl }),
            })
              .then((cRes) => cRes.json())
              .then((cData) => {
                if (isMounted && cData.caption) {
                  setCustomCaption(cData.caption);
                }
              })
              .catch(() => {})
              .finally(() => {
                if (isMounted) setIsGeneratingCaption(false);
              });
          }
        })
        .catch(() => {})
        .finally(() => {
          if (isMounted) setIsInspecting(false);
        });
    }, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [reelUrl]);

  const loadDemoUrl = () => {
    const targetUrl = "https://www.instagram.com/reel/C3x9K2pP1oL/";
    setReelUrl("");
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      setReelUrl(targetUrl.slice(0, idx));
      if (idx >= targetUrl.length) {
        clearInterval(interval);
      }
    }, 18);
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

      const tick = setInterval(() => {
        setStageIndex((i) => Math.min(i + 1, STAGE_LABELS.length - 1));
      }, 900);

      const res = await fetch("/api/process-page1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reelUrls: [reelUrl],
          textWatermark,
          platforms,
          imageWatermarkBase64,
          watermarkPos,
          watermarkOpacity,
          customCaption,
        }),
      });

      clearInterval(tick);
      setStageIndex(STAGE_LABELS.length - 1);

      const isJson = res.headers.get("content-type")?.includes("application/json");
      const data = isJson ? await res.json() : null;
      if (!res.ok) {
        throw new Error(data?.error || `Server error (${res.status}). Please try again.`);
      }
      setResponse(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setRunning(false);
    }
  };

  const percent = running ? ((stageIndex + 1) / STAGE_LABELS.length) * 100 : 0;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImageFile(file);
      }
    }
  };

  const getPositionStyles = (pos: WatermarkPosition): { top: string; bottom: string; left: string; right: string } => {
    switch (pos) {
      case "top-left":
        return { top: "14px", bottom: "auto", left: "14px", right: "auto" };
      case "top-right":
        return { top: "14px", bottom: "auto", left: "auto", right: "14px" };
      case "bottom-left":
        return { top: "auto", bottom: "24px", left: "14px", right: "auto" };
      case "bottom-right":
        return { top: "auto", bottom: "24px", left: "auto", right: "14px" };
    }
  };

  return (
    <div>
      <span className="badge">Step 1 of 3</span>
      <h1 className="page-title">Extract, Watermark &amp; Publish</h1>
      <p className="page-sub">
        Automate Instagram Reel downloading, custom logo branding, and cross-platform publishing.
      </p>

      {/* 60 / 40 Split Screen Layout */}
      <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* Left Column: 60% Form Controls */}
        <div style={{ flex: "1 1 520px", minWidth: 0 }}>
          
          {/* Card 1: Source Reel URL */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#68B77A", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800 }}>
                  1
                </span>
                <label style={{ margin: 0, fontSize: "0.84rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Instagram Reel Source URL
                </label>
              </div>

              {/* Load Demo Reel Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadDemoUrl}
                className="demo-btn-shimmer"
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  border: "1px solid rgba(104, 183, 122, 0.4)",
                  background: "rgba(104, 183, 122, 0.14)",
                  color: "#68B77A",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.15s ease",
                  boxShadow: "0 2px 8px rgba(104, 183, 122, 0.15)",
                }}
              >
                <ZapIcon /> Load Demo Reel
              </motion.button>
            </div>

            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <span style={{ position: "absolute", left: "14px", pointerEvents: "none", color: isInvalidInstagramUrl ? "#EF4444" : "var(--text-muted)", display: "flex", alignItems: "center" }}>
                <LinkIcon />
              </span>
              <input
                type="url"
                placeholder="Paste Instagram Reel link e.g. https://www.instagram.com/reel/..."
                value={reelUrl}
                onChange={(e) => setReelUrl(e.target.value)}
                style={{
                  width: "100%",
                  height: "42px",
                  margin: 0,
                  padding: reelUrl.trim() ? "0 42px 0 38px" : "0 14px 0 38px",
                  borderRadius: "10px",
                  border: isInvalidInstagramUrl ? "1.5px solid #EF4444" : "1.5px solid var(--panel-border)",
                  background: isInvalidInstagramUrl ? "rgba(239, 68, 68, 0.05)" : "var(--surface)",
                  color: "var(--text-main)",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "all 0.2s ease",
                  boxShadow: isInvalidInstagramUrl ? "0 0 0 3px rgba(239, 68, 68, 0.15)" : "none"
                }}
              />
              <AnimatePresence>
                {reelUrl.trim() && (
                  <motion.button
                    type="button"
                    title="Clear input"
                    onClick={() => {
                      setReelUrl("");
                      setInspectedMeta(null);
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    style={{
                      position: "absolute",
                      right: "10px",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      background: "#EF4444",
                      color: "#FFFFFF",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      pointerEvents: "auto",
                      boxShadow: "0 0 10px rgba(239, 68, 68, 0.4)",
                      padding: 0,
                      zIndex: 5,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Reel Video Inspector Badge */}
            <AnimatePresence>
              {reelUrl.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  style={{ marginTop: "12px", display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(104, 183, 122, 0.12)", border: "1px solid rgba(104, 183, 122, 0.3)", borderRadius: "8px", padding: "6px 14px", fontSize: "0.78rem", color: "#68B77A" }}
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <UserIcon /> <strong>@{isInspecting ? "inspecting..." : (inspectedMeta?.ownerUsername || "cuddlytails")}</strong>
                  </span>
                  <span>&bull;</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <VideoIcon /> <strong>{inspectedMeta?.resolution || "1080x1920 HD"}</strong>
                  </span>
                  <span>&bull;</span>
                  <span>✓ <strong>Account Authorized</strong></span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card 2: Image & Text Watermark */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#68B77A", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800 }}>
                2
              </span>
              <label style={{ margin: 0, fontSize: "0.84rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Watermark Branding &amp; Overlay
              </label>
            </div>

            {/* Dropzone for Logo */}
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
              Image Watermark Logo (Top-Left Overlay)
            </label>
            <div
              className={`dropzone-container ${isDragging ? "dropzone--dragging" : ""} ${imageFile ? "dropzone--has-file" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              style={{ borderRadius: "10px", padding: "14px" }}
            >
              <input
                type="file"
                id="watermark-file-input"
                className="dropzone-input"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              />

              {!imageFile ? (
                <label htmlFor="watermark-file-input" className="dropzone-label" style={{ gap: "4px" }}>
                  <span className="glass-icon-badge" style={{ marginBottom: 4 }}>
                    <UploadCloudIcon />
                  </span>
                  <span className="dropzone-title" style={{ fontSize: "0.8rem" }}>Drag & drop watermark logo</span>
                  <span className="dropzone-subtitle" style={{ fontSize: "0.72rem" }}>PNG, SVG, or JPG logo files</span>
                </label>
              ) : (
                <div className="dropzone-preview">
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Watermark preview"
                    className="dropzone-thumb"
                  />
                  <div className="dropzone-file-info">
                    <span className="dropzone-filename">{imageFile.name}</span>
                    <span className="dropzone-filesize">
                      {(imageFile.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <button
                    type="button"
                    className="dropzone-remove-btn"
                    onClick={() => setImageFile(null)}
                    title="Remove watermark image"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            {/* Text Watermark Input */}
            <label style={{ marginTop: 14, display: "block", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px" }}>
              Text Watermark
            </label>
            <input
              type="text"
              placeholder="e.g. @cuddlytails"
              value={textWatermark}
              onChange={(e) => setTextWatermark(e.target.value)}
              style={{ borderRadius: "10px", margin: 0 }}
            />

            {/* Advanced Watermark Settings Toggle */}
            <div style={{ marginTop: "14px" }}>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowAdvancedWatermark((prev) => !prev)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: showAdvancedWatermark ? "1.5px solid #68B77A" : "1px solid rgba(104, 183, 122, 0.35)",
                  background: showAdvancedWatermark ? "rgba(104, 183, 122, 0.2)" : "rgba(104, 183, 122, 0.08)",
                  color: "#68B77A",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.15s ease",
                  boxShadow: "0 2px 8px rgba(104, 183, 122, 0.12)",
                }}
              >
                <SlidersIcon /> {showAdvancedWatermark ? "Hide Corner Settings" : "Corner & Transparency Settings"}
              </motion.button>

              <AnimatePresence>
                {showAdvancedWatermark && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ padding: "14px", background: "var(--surface)", borderRadius: "10px", border: "1px solid var(--panel-border)" }}>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase" }}>
                        Text Watermark Position
                      </label>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "14px" }}>
                        {(["top-left", "top-right", "bottom-left", "bottom-right"] as WatermarkPosition[]).map((pos) => (
                          <motion.button
                            key={pos}
                            type="button"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setWatermarkPos(pos)}
                            style={{
                              height: "30px",
                              padding: "0 10px",
                              borderRadius: "6px",
                              fontSize: "0.76rem",
                              fontWeight: 600,
                              border: watermarkPos === pos ? "1.5px solid #68B77A" : "1px solid var(--panel-border)",
                              background: watermarkPos === pos ? "rgba(104, 183, 122, 0.18)" : "var(--panel)",
                              color: watermarkPos === pos ? "#68B77A" : "var(--text-main)",
                              cursor: "pointer",
                              transition: "background 0.15s ease, border-color 0.15s ease",
                            }}
                          >
                            {watermarkPos === pos && "✓ "}
                            {POSITION_LABELS[pos]}
                          </motion.button>
                        ))}
                      </div>

                      {/* Transparency Slider */}
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                        <label style={{ margin: 0, fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                          Watermark Transparency
                        </label>
                        <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#68B77A" }}>
                          {watermarkOpacity}% Opacity
                        </span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                        style={{ width: "100%", accentColor: "#68B77A", cursor: "pointer", margin: 0 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Card 3: Target Platforms & Execute */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#68B77A", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800 }}>
                  3
                </span>
                <label style={{ margin: 0, fontSize: "0.84rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Select Target Platforms
                </label>
              </div>

              {/* Platform Counter Badge */}
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "12px", background: "rgba(104, 183, 122, 0.15)", color: "#68B77A", border: "1px solid rgba(104, 183, 122, 0.3)" }}>
                {platforms.length} of {ALL_PLATFORMS.length} Selected
              </span>
            </div>

            {/* Platform Buttons */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
              {ALL_PLATFORMS.map((p) => {
                const config = PLATFORM_CONFIG[p];
                const isSelected = platforms.includes(p);
                return (
                  <motion.button
                    key={p}
                    type="button"
                    whileHover={{ scale: 1.04, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => togglePlatform(p)}
                    style={{
                      height: "38px",
                      padding: "0 16px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      borderRadius: "10px",
                      fontSize: "0.83rem",
                      fontWeight: 600,
                      border: isSelected ? `1.5px solid ${config.color}` : "1px solid var(--panel-border)",
                      background: isSelected ? config.bg : "var(--surface)",
                      color: isSelected ? config.color : "var(--text-main)",
                      boxShadow: isSelected ? `0 4px 14px ${config.bg}` : "none",
                      cursor: "pointer",
                      transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
                      userSelect: "none",
                    }}
                  >
                    {config.icon}
                    {config.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Action Button */}
            <motion.button
              type="button"
              whileHover={(!running && reelUrl.trim()) ? { scale: 1.015 } : {}}
              whileTap={(!running && reelUrl.trim()) ? { scale: 0.985 } : {}}
              onClick={runAutomation}
              disabled={running || !reelUrl.trim()}
              className={(!running && reelUrl.trim()) ? "shimmer-btn-bg" : ""}
              style={{
                width: "100%",
                height: "44px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #68B77A 0%, #4D9A5E 100%)",
                color: "#FFFFFF",
                border: "none",
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: (running || !reelUrl.trim()) ? "not-allowed" : "pointer",
                boxShadow: "0 4px 16px rgba(104, 183, 122, 0.35)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: (running || !reelUrl.trim()) ? 0.6 : 1,
              }}
            >
              {running && <span className="p2-spinner" style={{ width: "16px", height: "16px", color: "#FFFFFF" }} />}
              {running ? "Running Automation..." : "Run Automation"}
            </motion.button>

            {running && (
              <div className="ai-active-glow" style={{ marginTop: 20, borderRadius: 12, background: "var(--panel)" }}>
                <PawLoader
                  label={`Processing Instagram Reels (${STAGE_LABELS[stageIndex]}...)`}
                  sublabel="Downloading video stream, layering watermarks, and publishing cross-platform"
                />
                <div style={{ padding: "0 24px 24px" }}>
                  <ProgressBar percent={percent} label={STAGE_LABELS[stageIndex]} />
                </div>
              </div>
            )}

            {error && <div className="result-item error" style={{ marginTop: "16px" }}>{error}</div>}

            {response && (
              <div style={{ marginTop: "16px" }}>
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
        </div>

        {/* Right Column: 40% Sticky Live Video Phone Mockup */}
        <div style={{ flex: "0 0 350px", position: "sticky", top: "24px" }}>
          <div className="card" style={{ padding: "26px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>
              Live Watermark Video Preview
            </span>
            
            {/* Large HD Phone Frame */}
            <div
              style={{
                position: "relative",
                width: "260px",
                height: "380px",
                borderRadius: "22px",
                border: "3px solid var(--panel-border)",
                background: "linear-gradient(180deg, #111E28 0%, #0A131B 100%)",
                overflow: "hidden",
                boxShadow: "0 14px 36px rgba(0, 0, 0, 0.55)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              {/* Dynamic Light Sheen Overlay (Only active while running/fetching) */}
              {running && <div className="phone-screen-sheen" />}

              {/* Top Bar with Brand & Animated Equalizer Bars */}
              <div style={{ padding: "12px 14px", background: "linear-gradient(180deg, rgba(0,0,0,0.65) 0%, transparent 100%)", display: "flex", alignItems: "center", gap: "8px", zIndex: 10 }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#68B77A", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
                  <PawIcon />
                </div>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#F1EEE7" }}>
                  {inspectedMeta?.ownerUsername || "cuddlytails"}
                </span>
                
                {/* Audio / Video Stream Bars (Animated only while running) */}
                <div style={{ display: "inline-flex", gap: "3px", alignItems: "flex-end", height: "12px", marginLeft: "auto" }}>
                  <span className={running ? "eq-bar eq-bar-1" : "eq-bar"} style={{ height: running ? undefined : "4px" }} />
                  <span className={running ? "eq-bar eq-bar-2" : "eq-bar"} style={{ height: running ? undefined : "7px" }} />
                  <span className={running ? "eq-bar eq-bar-3" : "eq-bar"} style={{ height: running ? undefined : "4px" }} />
                </div>
              </div>

              {/* Play Center Button (Ripple animation only active while running/fetching) */}
              <div className={running ? "phone-play-ripple" : ""} style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "48px", height: "48px", borderRadius: "50%", background: "rgba(104, 183, 122, 0.25)", border: "1.5px solid rgba(104, 183, 122, 0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 12, transition: "all 0.3s ease" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#68B77A" style={{ marginLeft: "2px" }}>
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>

              {/* Image Logo Watermark Overlay */}
              <div style={{ position: "absolute", top: "14px", left: "14px", zIndex: 20, opacity: watermarkOpacity / 100, pointerEvents: "none", transition: "opacity 0.2s ease" }}>
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Watermark Overlay"
                    style={{ maxWidth: "60px", maxHeight: "36px", objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.6))", borderRadius: "4px" }}
                  />
                ) : (
                  <div style={{ background: "rgba(104, 183, 122, 0.25)", border: "1px dashed #68B77A", padding: "3px 8px", borderRadius: "4px", fontSize: "0.68rem", fontWeight: 700, color: "#68B77A" }}>
                    LOGO
                  </div>
                )}
              </div>

              {/* Text Watermark (Smooth Spring Gliding Corner Animation) */}
              <motion.div
                layout
                animate={getPositionStyles(watermarkPos)}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                style={{
                  position: "absolute",
                  zIndex: 20,
                  opacity: watermarkOpacity / 100,
                  pointerEvents: "none",
                }}
              >
                <div style={{ background: "rgba(0,0,0,0.75)", padding: "4px 9px", borderRadius: "5px", fontSize: "0.76rem", fontWeight: 700, color: "#FFFFFF", backdropFilter: "blur(4px)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
                  {textWatermark.trim() || `@${inspectedMeta?.ownerUsername || "cuddlytails"}`}
                </div>
              </motion.div>

              <div style={{ padding: "12px 14px", background: "linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 100%)", zIndex: 10 }}>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "rgba(241, 238, 231, 0.9)", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {customCaption.trim() || "Loved watching Max! #cuddlytails"}
                </p>
              </div>
            </div>

            {/* Custom Caption Input Below Phone Frame */}
            <div style={{ marginTop: "20px", width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Publishing Caption &amp; Message
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopyCaption}
                    disabled={!customCaption.trim() || isGeneratingCaption}
                    style={{
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: isCopied ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(255, 255, 255, 0.15)",
                      background: isCopied ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.06)",
                      color: isCopied ? "#10B981" : "var(--text-main)",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: customCaption.trim() ? "pointer" : "not-allowed",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      opacity: customCaption.trim() ? 1 : 0.5,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </motion.button>
                </div>
              </div>

              {/* Textarea with Blur effect and Spinning Loading Circle */}
              <div style={{ position: "relative", width: "100%" }}>
                <textarea
                  rows={5}
                  disabled={isGeneratingCaption}
                  placeholder="Leave blank for Gemini AI auto-captions per platform, or type a custom caption e.g. Loved watching Max! 🐾 Book trusted pet sitters at cuddlytails.com..."
                  value={customCaption}
                  onChange={(e) => setCustomCaption(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: "110px",
                    background: "var(--surface)",
                    border: "1.5px solid var(--panel-border)",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    color: "var(--text-main)",
                    fontSize: "0.84rem",
                    fontFamily: "var(--font-body)",
                    lineHeight: "1.45",
                    resize: "vertical",
                    outline: "none",
                    boxSizing: "border-box",
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.3)",
                    filter: isGeneratingCaption ? "blur(4px)" : "blur(0px)",
                    opacity: isGeneratingCaption ? 0.6 : 1,
                    transition: "filter 0.3s ease, opacity 0.3s ease",
                  }}
                />

                <AnimatePresence>
                  {isGeneratingCaption && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "rgba(0, 0, 0, 0.35)",
                        backdropFilter: "blur(3px)",
                        borderRadius: "12px",
                        zIndex: 20,
                        pointerEvents: "none",
                      }}
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          border: "3px solid rgba(104, 183, 122, 0.2)",
                          borderTopColor: "#68B77A",
                          boxShadow: "0 0 12px rgba(104, 183, 122, 0.4)",
                        }}
                      />
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#68B77A", letterSpacing: "0.02em" }}>
                        Generating AI Caption...
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Invalid Instagram Link Floating Center-Bottom Notification Card */}
      <AnimatePresence>
        {isInvalidInstagramUrl && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 25, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            style={{
              position: "fixed",
              bottom: "68px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 99999,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 22px",
              borderRadius: "16px",
              background: "rgba(24, 10, 14, 0.94)",
              backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(239, 68, 68, 0.45)",
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(239, 68, 68, 0.2)",
              color: "#FFFFFF",
              maxWidth: "90vw",
              whiteSpace: "nowrap",
              pointerEvents: "none"
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(239, 68, 68, 0.2)",
                border: "1.5px solid #EF4444",
                color: "#EF4444",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.3)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#F87171", letterSpacing: "0.01em" }}>
                Not an Instagram Link
              </span>
              <span style={{ fontSize: "0.78rem", fontWeight: 500, color: "rgba(255, 255, 255, 0.75)" }}>
                Please paste a valid Instagram link (e.g. instagram.com/reel/...)
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
