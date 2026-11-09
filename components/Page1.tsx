import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProgressBar from "@/components/ProgressBar";
import PawLoader from "@/components/PawLoader";
import type { Platform, ProcessPage1Response } from "@/lib/types";

const ALL_PLATFORMS: Platform[] = ["Pinterest", "Instagram", "X", "YouTube"];
const STAGE_LABELS = ["Downloading", "Watermarking", "Posting"];

export type WatermarkPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type WatermarkStyle = "glass" | "neon" | "dark" | "gold";
export type WatermarkScale = "small" | "medium" | "large";
export type CaptionTab = "Instagram" | "Pinterest" | "Twitter" | "YouTube";

const POSITION_LABELS: Record<WatermarkPosition, string> = {
  "top-left": "Top-Left",
  "top-right": "Top-Right",
  "bottom-left": "Bottom-Left",
  "bottom-right": "Bottom-Right",
};

function ImageIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function TypeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

const STYLE_LABELS: Record<WatermarkStyle, { label: string; icon: React.ReactNode }> = {
  glass: { label: "Glassmorphism", icon: <ZapIcon /> },
  neon: { label: "Bold Neon", icon: <FlameIcon /> },
  dark: { label: "Sleek Dark", icon: <MoonIcon /> },
  gold: { label: "Gold Elegant", icon: <SparklesIcon /> },
};

const SCALE_LABELS: Record<WatermarkScale, string> = {
  small: "Small (80%)",
  medium: "Medium (100%)",
  large: "Large (120%)",
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
    label: "Twitter",
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
  const [watermarkPos, setWatermarkPos] = useState<WatermarkPosition>("bottom-right");
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(80);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "16:9">("9:16");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [showAdvancedWatermark, setShowAdvancedWatermark] = useState<boolean>(false);
  const [running, setRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [response, setResponse] = useState<ProcessPage1Response | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [watermarkStyle, setWatermarkStyle] = useState<WatermarkStyle>("glass");
  const [watermarkScale, setWatermarkScale] = useState<WatermarkScale>("small");
  const [activeCaptionTab, setActiveCaptionTab] = useState<CaptionTab>("Instagram");
  const [captionObj, setCaptionObj] = useState<{
    instagramCaption: string;
    pinterestTitle: string;
    pinterestDescription: string;
    xCaption: string;
    youtubeCaption: string;
  }>({
    instagramCaption: "",
    pinterestTitle: "",
    pinterestDescription: "",
    xCaption: "",
    youtubeCaption: "",
  });

  const handleTabSwitch = (tab: CaptionTab, overrideData?: any) => {
    setActiveCaptionTab(tab);
    const data = overrideData || captionObj;
    if (tab === "Instagram") {
      setCustomCaption(data.instagramCaption || data.caption || "");
    } else if (tab === "Pinterest") {
      if (data.pinterestTitle || data.pinterestDescription) {
        setCustomCaption(`Title:\n${data.pinterestTitle}\n\nDescription:\n${data.pinterestDescription}`);
      } else if (data.instagramCaption) {
        setCustomCaption(data.instagramCaption);
      }
    } else if (tab === "Twitter") {
      setCustomCaption(data.xCaption || data.instagramCaption || "");
    } else if (tab === "YouTube") {
      setCustomCaption(data.youtubeCaption || data.instagramCaption || "");
    }
  };

  const [inspectedMeta, setInspectedMeta] = useState<{ reelId: string; ownerUsername: string; imageUrl?: string; videoUrl?: string; rawCaption?: string; resolution: string } | null>(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [isGeneratingCaption, setIsGeneratingCaption] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setVideoError(false);
  }, [inspectedMeta]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying, inspectedMeta, videoError]);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.muted = isMuted;
  }, [isMuted]);

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
    setIsPlayingVideo(false);
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
            setInspectedMeta({
              reelId: data.reelId,
              ownerUsername: username,
              imageUrl: data.imageUrl,
              videoUrl: data.videoUrl || "https://assets.mixkit.co/videos/preview/mixkit-playful-dog-in-the-grass-42795-large.mp4",
              rawCaption: data.caption,
              resolution: data.resolution || "1080x1920 HD"
            });
            
            // Generate visually accurate caption analyzing actual video cover frame with Gemini Vision
            if (isMounted) setIsGeneratingCaption(true);
            fetch("/api/generate-caption", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ originalCaption: data.caption, ownerUsername: username, imageUrl: data.imageUrl }),
            })
              .then((cRes) => cRes.json())
              .then((cData) => {
                if (isMounted && cData) {
                  const newObj = {
                    instagramCaption: cData.instagramCaption || cData.caption || "",
                    pinterestTitle: cData.pinterestTitle || "",
                    pinterestDescription: cData.pinterestDescription || "",
                    xCaption: cData.xCaption || "",
                    youtubeCaption: cData.youtubeCaption || "",
                  };
                  setCaptionObj(newObj);
                  handleTabSwitch(activeCaptionTab, newObj);
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
      <div className="p3-step-chip-wrapper">
        <span className="p3-step-chip">
          <span className="p3-step-chip-dot" />
          <span className="p3-step-chip-text">STEP 1 OF 3</span>
          <span className="p3-step-chip-divider">•</span>
          <span className="p3-step-chip-tag">REELS &amp; PUBLISHING</span>
        </span>
      </div>
      <h1 className="page-title" style={{ marginBottom: "14px" }}>Extract, Watermark &amp; Publish</h1>

      {/* 60 / 40 Split Screen Layout */}
      <div style={{ display: "flex", gap: "28px", alignItems: "flex-start", flexWrap: "wrap" }}>
        
        {/* Left Column: 60% Form Controls */}
        <div style={{ flex: "1 1 520px", minWidth: 0 }}>
          
          {/* Card 1: Source Reel URL */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "24px", minWidth: "24px", maxWidth: "24px", height: "24px", minHeight: "24px", maxHeight: "24px", flexShrink: 0, aspectRatio: "1 / 1", borderRadius: "50%", background: "linear-gradient(135deg, #15803D 0%, #166534 100%)", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, lineHeight: 1, boxShadow: "0 2px 8px rgba(21, 128, 61, 0.25)" }}>
                  1
                </span>
                <label style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#334155", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "4px 10px", display: "inline-flex", alignItems: "center" }}>
                  Instagram Reel Source URL
                </label>
              </div>

              {/* Load Demo Reel Button */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadDemoUrl}
                className="demo-btn-shimmer page1-demo-reel-btn"
                style={{
                  padding: "5px 14px",
                  borderRadius: "8px",
                  border: "1px solid #A7F3D0",
                  background: "#ECFDF5",
                  color: "#047857",
                  fontSize: "0.76rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.15s ease",
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.15)",
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

          {/* Card 2: Image & Text Watermark 2-Column Grid Layout */}
          <div className="card" style={{ padding: "20px 24px", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <span style={{ width: "24px", minWidth: "24px", maxWidth: "24px", height: "24px", minHeight: "24px", maxHeight: "24px", flexShrink: 0, aspectRatio: "1 / 1", borderRadius: "50%", background: "linear-gradient(135deg, #15803D 0%, #166534 100%)", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, lineHeight: 1, boxShadow: "0 2px 8px rgba(21, 128, 61, 0.25)" }}>
                2
              </span>
              <label style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#334155", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "4px 10px", display: "inline-flex", alignItems: "center" }}>
                Watermark Branding &amp; Overlay
              </label>
            </div>

            {/* 2-Column Grid Split */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", alignItems: "start" }}>
              
              {/* LEFT COLUMN: Logo Uploading Dropzone */}
              <div style={{ background: "var(--bg-deep)", padding: "16px", borderRadius: "12px", border: "1px solid var(--panel-border)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 700, color: "var(--heading-white)", marginBottom: "10px" }}>
                  <ImageIcon /> Image Watermark Logo
                </label>
                <div
                  className={`dropzone-container ${isDragging ? "dropzone--dragging" : ""} ${imageFile ? "dropzone--has-file" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ borderRadius: "10px", padding: "16px", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <input
                    type="file"
                    id="watermark-file-input"
                    className="dropzone-input"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />

                  {!imageFile ? (
                    <label htmlFor="watermark-file-input" className="dropzone-label" style={{ gap: "6px", textAlign: "center" }}>
                      <span className="glass-icon-badge" style={{ marginBottom: 4 }}>
                        <UploadCloudIcon />
                      </span>
                      <span className="dropzone-title" style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--heading-white)" }}>Drag &amp; drop watermark logo</span>
                      <span className="dropzone-subtitle" style={{ fontSize: "0.72rem", color: "var(--secondary-text)" }}>PNG, SVG, or JPG logo files</span>
                    </label>
                  ) : (
                    <div className="dropzone-preview" style={{ width: "100%" }}>
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
              </div>

              {/* RIGHT COLUMN: Text Watermark & Customization */}
              <div style={{ background: "var(--bg-deep)", padding: "16px", borderRadius: "12px", border: "1px solid var(--panel-border)" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", fontWeight: 700, color: "var(--heading-white)", marginBottom: "8px" }}>
                  <TypeIcon /> Text Watermark &amp; Branding
                </label>
                <input
                  type="text"
                  placeholder="e.g. @cuddlytails"
                  value={textWatermark}
                  onChange={(e) => setTextWatermark(e.target.value)}
                  style={{ borderRadius: "10px", margin: "0 0 14px 0", padding: "8px 12px", width: "100%", background: "var(--input-bg)", color: "var(--heading-white)", border: "1.5px solid var(--panel-border)", outline: "none", boxShadow: "none" }}
                />

                {/* Advanced Settings Toggle */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAdvancedWatermark((prev) => !prev)}
                  style={{
                    width: "100%",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    border: showAdvancedWatermark ? "1.5px solid var(--primary-green)" : "1px solid var(--panel-border)",
                    background: showAdvancedWatermark ? "rgba(45, 138, 78, 0.12)" : "var(--panel)",
                    color: "var(--primary-green)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <SlidersIcon /> {showAdvancedWatermark ? "Hide Advanced Settings" : "Advanced Settings"}
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
                      <div style={{ padding: "12px", background: "var(--surface)", borderRadius: "10px", border: "1px solid var(--panel-border)" }}>
                        
                        {/* Position Selector */}
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>
                          Watermark Position
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "12px" }}>
                          {(["top-left", "top-right", "bottom-left", "bottom-right"] as WatermarkPosition[]).map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => setWatermarkPos(pos)}
                              style={{
                                padding: "4px 8px",
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                border: watermarkPos === pos ? "1.5px solid #15803D" : "1px solid var(--panel-border)",
                                background: watermarkPos === pos ? "#F0FDF4" : "var(--panel)",
                                color: watermarkPos === pos ? "#15803D" : "var(--text-main)",
                                cursor: "pointer",
                              }}
                            >
                              {watermarkPos === pos && "✓ "}
                              {POSITION_LABELS[pos]}
                            </button>
                          ))}
                        </div>

                        {/* Aesthetic Style Pills */}
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>
                          Aesthetic Style
                        </label>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px", marginBottom: "12px" }}>
                          {(["glass", "neon", "dark", "gold"] as WatermarkStyle[]).map((st) => {
                            const isActive = watermarkStyle === st;
                            const aestheticStyles: Record<WatermarkStyle, { border: string; bg: string; color: string; shadow: string }> = {
                              glass: {
                                border: "1.5px solid #0284C7",
                                bg: "rgba(240, 249, 255, 0.95)",
                                color: "#0369A1",
                                shadow: "0 3px 10px rgba(2, 132, 199, 0.2)",
                              },
                              neon: {
                                border: "1.5px solid #10B981",
                                bg: "#ECFDF5",
                                color: "#047857",
                                shadow: "0 0 10px rgba(16, 185, 129, 0.35)",
                              },
                              dark: {
                                border: "1.5px solid #0F172A",
                                bg: "#1E293B",
                                color: "#FFFFFF",
                                shadow: "0 3px 10px rgba(15, 23, 42, 0.35)",
                              },
                              gold: {
                                border: "1.5px solid #D97706",
                                bg: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)",
                                color: "#B45309",
                                shadow: "0 3px 10px rgba(217, 119, 6, 0.25)",
                              },
                            };
                            const styleCfg = aestheticStyles[st];

                            return (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setWatermarkStyle(st)}
                                style={{
                                  padding: "5px 8px",
                                  borderRadius: "7px",
                                  fontSize: "0.72rem",
                                  fontWeight: isActive ? 700 : 600,
                                  border: isActive ? styleCfg.border : "1px solid var(--panel-border)",
                                  background: isActive ? styleCfg.bg : "var(--panel)",
                                  color: isActive ? styleCfg.color : "var(--text-main)",
                                  boxShadow: isActive ? styleCfg.shadow : "none",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "5px",
                                  transition: "all 0.2s ease-in-out",
                                }}
                              >
                                {STYLE_LABELS[st].icon}
                                <span>{STYLE_LABELS[st].label}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Size Scale Selector */}
                        <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>
                          Watermark Size
                        </label>
                        <div style={{ display: "flex", gap: "4px", marginBottom: "12px" }}>
                          {(["small", "medium", "large"] as WatermarkScale[]).map((sc) => (
                            <button
                              key={sc}
                              type="button"
                              onClick={() => setWatermarkScale(sc)}
                              style={{
                                flex: 1,
                                padding: "4px 6px",
                                borderRadius: "6px",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                                border: watermarkScale === sc ? "1.5px solid #15803D" : "1px solid var(--panel-border)",
                                background: watermarkScale === sc ? "#F0FDF4" : "var(--panel)",
                                color: watermarkScale === sc ? "#15803D" : "var(--text-main)",
                                cursor: "pointer",
                              }}
                            >
                              {SCALE_LABELS[sc]}
                            </button>
                          ))}
                        </div>

                        {/* Transparency Slider */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <label style={{ margin: 0, fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                            Transparency
                          </label>
                          <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#15803D" }}>
                            {watermarkOpacity}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="20"
                          max="100"
                          value={watermarkOpacity}
                          onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                          style={{ width: "100%", accentColor: "#15803D", cursor: "pointer", margin: 0 }}
                        />

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Card 3: Target Platforms & Execute */}
          <div className="card" style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "24px", minWidth: "24px", maxWidth: "24px", height: "24px", minHeight: "24px", maxHeight: "24px", flexShrink: 0, aspectRatio: "1 / 1", borderRadius: "50%", background: "linear-gradient(135deg, #15803D 0%, #166534 100%)", color: "#FFFFFF", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.78rem", fontWeight: 800, lineHeight: 1, boxShadow: "0 2px 8px rgba(21, 128, 61, 0.25)" }}>
                  3
                </span>
                <label style={{ margin: 0, fontSize: "0.78rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#334155", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "4px 10px", display: "inline-flex", alignItems: "center" }}>
                  Select Target Platforms
                </label>
              </div>

              {/* Platform Counter Badge */}
              <span style={{ fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px", borderRadius: "12px", background: "#ECFDF5", color: "#047857", border: "1px solid #A7F3D0" }}>
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

            {/* Action Button with Dynamic Green Glow & Smooth Roll-Up Hover Animation */}
            <motion.button
              type="button"
              initial="rest"
              whileHover={(!running && reelUrl.trim() && platforms.length > 0) ? "hover" : "rest"}
              whileTap={(!running && reelUrl.trim() && platforms.length > 0) ? { scale: 0.98 } : undefined}
              animate={(!running && platforms.length > 0) ? {
                boxShadow: [
                  "0 4px 14px rgba(5, 150, 105, 0.22), 0 0 6px rgba(2, 132, 199, 0.12)",
                  "0 5px 22px rgba(5, 150, 105, 0.42), 0 0 14px rgba(2, 132, 199, 0.25)",
                  "0 4px 14px rgba(5, 150, 105, 0.22), 0 0 6px rgba(2, 132, 199, 0.12)",
                ]
              } : {}}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              onClick={runAutomation}
              disabled={running || !reelUrl.trim() || platforms.length === 0}
              style={{
                width: "100%",
                height: "46px",
                borderRadius: "12px",
                background: (running || !reelUrl.trim() || platforms.length === 0)
                  ? "var(--chip-bg, #F1F5F9)"
                  : "linear-gradient(135deg, #15803D 0%, #166534 100%)",
                color: (running || !reelUrl.trim() || platforms.length === 0)
                  ? "var(--secondary-text, #64748B)"
                  : "#FFFFFF",
                border: (running || !reelUrl.trim() || platforms.length === 0)
                  ? "1px solid var(--panel-border, #E2E8F0)"
                  : "1px solid #166534",
                fontSize: "0.92rem",
                fontWeight: 700,
                cursor: (running || !reelUrl.trim() || platforms.length === 0) ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                opacity: (running || !reelUrl.trim() || platforms.length === 0) ? 0.75 : 1,
                boxShadow: (running || !reelUrl.trim() || platforms.length === 0) ? "none" : "0 2px 8px rgba(21, 128, 61, 0.25)",
                transition: "background 0.3s ease, color 0.3s ease, border 0.3s ease, opacity 0.3s ease, box-shadow 0.3s ease",
              }}
            >
              {running ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                  <span className="p2-spinner" style={{ width: "16px", height: "16px", color: "#FFFFFF" }} /> Running Automation...
                </span>
              ) : (
                <>
                  <motion.div
                    variants={{
                      rest: { y: "0%", opacity: 1 },
                      hover: { y: "-120%", opacity: 0 },
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    {platforms.length === 0 ? "Select At Least 1 Target Platform" : "Run Automation"}
                  </motion.div>
                  <motion.div
                    variants={{
                      rest: { y: "120%", opacity: 0 },
                      hover: { y: "0%", opacity: 1 },
                    }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: "absolute",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      height: "100%",
                      pointerEvents: "none",
                    }}
                  >
                    {platforms.length === 0 ? "Select At Least 1 Target Platform" : "Run Automation"}
                  </motion.div>
                </>
              )}
            </motion.button>



            {running && (
              <div className="ai-active-glow" style={{ marginTop: 20, padding: "20px", borderRadius: 16, background: "#FFFFFF", border: "1.5px solid #E2E8F0", boxShadow: "0 10px 30px rgba(15,23,42,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#059669", boxShadow: "0 0 10px #059669" }} />
                    <span style={{ fontSize: "0.86rem", fontWeight: 800, color: "#0F172A" }}>
                      Automated Content Extraction &amp; Watermarking
                    </span>
                  </div>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#059669", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "6px", padding: "2px 8px" }}>
                    {percent}%
                  </span>
                </div>

                {/* 3-Step Multi-Stage Indicator */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginBottom: 14 }}>
                  {[
                    { step: 1, title: "1. Downloading Reel" },
                    { step: 2, title: "2. Layering Watermark" },
                    { step: 3, title: "3. Publishing Posts" },
                  ].map((st, i) => {
                    const isActive = stageIndex === i;
                    const isDone = stageIndex > i;
                    return (
                      <div
                        key={st.step}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "10px",
                          background: isActive ? "#ECFDF5" : isDone ? "#F0F9FF" : "#F8FAFC",
                          border: isActive ? "1.5px solid #A7F3D0" : isDone ? "1.5px solid #BAE6FD" : "1px solid #E2E8F0",
                          color: isActive ? "#047857" : isDone ? "#0369A1" : "#64748B",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          transition: "all 0.25s ease",
                        }}
                      >
                        <span>{isDone ? "✓" : isActive ? "⚡" : i + 1}</span>
                        <span style={{ textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{st.title}</span>
                      </div>
                    );
                  })}
                </div>
                <ProgressBar percent={percent} label={STAGE_LABELS[stageIndex]} />
              </div>
            )}

            {error && <div className="result-item error" style={{ marginTop: "16px" }}>{error}</div>}

            {response && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{ marginTop: "20px" }}
              >
                {/* Celebratory Banner */}
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(104, 183, 122, 0.18) 0%, rgba(16, 185, 129, 0.1) 100%)",
                    border: "1px solid rgba(104, 183, 122, 0.35)",
                    borderRadius: "16px",
                    padding: "16px 20px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    boxShadow: "0 8px 24px rgba(104, 183, 122, 0.2)",
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>🎉</span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#68B77A" }}>
                      Automation Complete &amp; Content Cross-Posted!
                    </h4>
                    <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 500 }}>
                      Your watermarked reel was successfully distributed across target social platforms.
                    </span>
                  </div>
                </div>

                {/* Per-Platform Published Cards Grid */}
                {response.results.map((r) => (
                  <div key={r.sourceUrl} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {r.publishResults.map((pr) => {
                      const pConfig = PLATFORM_CONFIG[pr.platform as Platform] || { color: "#68B77A", bg: "rgba(104, 183, 122, 0.15)", icon: <PawIcon /> };
                      return (
                        <div
                          key={pr.platform}
                          style={{
                            background: "rgba(15, 25, 35, 0.75)",
                            backdropFilter: "blur(12px)",
                            border: pr.success ? `1.5px solid ${pConfig.color}` : "1px solid rgba(239, 68, 68, 0.4)",
                            borderRadius: "14px",
                            padding: "14px 18px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            boxShadow: pr.success ? `0 4px 16px ${pConfig.bg}` : "none",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ color: pConfig.color, display: "flex" }}>{pConfig.icon}</span>
                            <div>
                              <span style={{ fontSize: "0.86rem", fontWeight: 800, color: "#FFF" }}>
                                {pr.platform}
                              </span>
                              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>
                                @{r.ownerUsername} • {r.caption.slice(0, 35) || "Reel Content"}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {pr.success ? (
                              <a
                                href={pr.postUrl || "#"}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  background: pConfig.bg,
                                  color: pConfig.color,
                                  border: `1px solid ${pConfig.color}44`,
                                  padding: "5px 12px",
                                  borderRadius: "10px",
                                  fontSize: "0.74rem",
                                  fontWeight: 800,
                                  textDecoration: "none",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                View Post ↗
                              </a>
                            ) : (
                              <span style={{ fontSize: "0.72rem", color: "#EF4444", fontWeight: 700 }}>
                                Failed: {pr.error}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </motion.div>
            )}

          </div>
        </div>

        {/* Right Column: 40% Sticky Live Video Phone Mockup */}
        <div className="page1-preview-col" style={{ flex: "1 1 350px", maxWidth: "420px", width: "100%", margin: "0 auto", position: "sticky", top: "24px" }}>
          <div className="card page1-preview-card" style={{ padding: "24px 20px", display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: "14px" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", color: "#0F172A" }}>
                Live Canvas Preview
              </span>

              {/* Aspect Ratio Selector Pills */}
              <div style={{ display: "flex", gap: "4px", background: "#F1F5F9", padding: "3px", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
                {(["9:16", "1:1", "16:9"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAspectRatio(r)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: "6px",
                      border: "none",
                      background: aspectRatio === r ? "#0284C7" : "transparent",
                      color: aspectRatio === r ? "#FFFFFF" : "#64748B",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      boxShadow: aspectRatio === r ? "0 2px 6px rgba(2, 132, 199, 0.3)" : "none",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Dynamic Aspect Ratio Phone Frame (Interactive Drag & Snap Canvas) */}
            <div
              className="page1-phone-mockup"
              style={{
                position: "relative",
                margin: "0 auto",
                width: aspectRatio === "1:1" ? "260px" : aspectRatio === "16:9" ? "300px" : "240px",
                height: aspectRatio === "1:1" ? "260px" : aspectRatio === "16:9" ? "168px" : "426px",
                borderRadius: "22px",
                border: "3px solid #CBD5E1",
                background: "#0A131B",
                overflow: "hidden",
                boxShadow: "0 16px 40px rgba(15, 23, 42, 0.25)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Dynamic Canvas Reel Cover Frame */}
              {inspectedMeta?.imageUrl ? (
                <img
                  key={inspectedMeta.imageUrl}
                  src={inspectedMeta.imageUrl}
                  alt="Reel Cover Frame"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    background: "#0F172A",
                    zIndex: 1,
                  }}
                />
              ) : (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    color: "#94A3B8",
                    zIndex: 1,
                  }}
                >
                  <div style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "rgba(104, 183, 122, 0.15)",
                    border: "1px solid #68B77A",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#68B77A",
                    fontSize: "0.9rem",
                  }}>
                    ▶
                  </div>
                  <span style={{ fontSize: "0.76rem", fontWeight: 600 }}>Paste Reel Link to Preview</span>
                </div>
              )}

              {/* Inspecting Reel Video Fetching Loading Overlay */}
              <AnimatePresence>
                {isInspecting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(10, 19, 27, 0.75)",
                      backdropFilter: "blur(6px)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      zIndex: 30,
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "3px solid rgba(104, 183, 122, 0.2)",
                        borderTopColor: "#68B77A",
                        boxShadow: "0 0 12px rgba(104, 183, 122, 0.4)",
                      }}
                    />
                    <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#68B77A", letterSpacing: "0.02em" }}>
                      Analyzing Video Stream...
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dynamic Light Sheen Overlay (Only active while running/fetching) */}
              {running && <div className="phone-screen-sheen" />}

              {/* Media Controls Overlay (Play/Pause & Mute/Unmute) */}
              <div style={{ position: "absolute", bottom: "10px", left: "10px", zIndex: 50, display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: "30px",
                    minWidth: "30px",
                    maxWidth: "30px",
                    height: "30px",
                    minHeight: "30px",
                    maxHeight: "30px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    padding: 0,
                    lineHeight: 0,
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#FFFFFF",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    flexShrink: 0,
                  }}
                  title={isPlaying ? "Pause Preview" : "Play Preview"}
                >
                  {isPlaying ? "❚❚" : "▶"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  style={{
                    width: "30px",
                    minWidth: "30px",
                    maxWidth: "30px",
                    height: "30px",
                    minHeight: "30px",
                    maxHeight: "30px",
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    padding: 0,
                    lineHeight: 0,
                    background: "rgba(15, 23, 42, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    color: "#FFFFFF",
                    fontSize: "0.7rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    flexShrink: 0,
                  }}
                  title={isMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isMuted ? "🔇" : "🔊"}
                </button>
              </div>

              {/* Image Logo Watermark Overlay (Draggable Layered above video stream) */}
              <motion.div
                drag
                dragConstraints={{ left: 0, right: 150, top: 0, bottom: 250 }}
                whileDrag={{ scale: 1.1 }}
                style={{ position: "absolute", top: "14px", left: "14px", zIndex: 40, opacity: watermarkOpacity / 100, cursor: "grab" }}
              >
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
              </motion.div>

              {/* Text Watermark (Draggable & Gliding Corner Animation) */}
              <motion.div
                drag
                dragConstraints={{ left: -100, right: 100, top: -150, bottom: 150 }}
                whileDrag={{ scale: 1.08 }}
                layout
                animate={getPositionStyles(watermarkPos)}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                style={{
                  position: "absolute",
                  zIndex: 40,
                  opacity: watermarkOpacity / 100,
                  cursor: "grab",
                }}
              >
                <div
                  style={{
                    padding: "4px 9px",
                    borderRadius: "5px",
                    fontSize: "0.76rem",
                    fontWeight: 700,
                    transition: "all 0.2s ease",
                    ...(() => {
                      const scaleFactor = watermarkScale === "small" ? 0.8 : watermarkScale === "large" ? 1.2 : 1.0;
                      switch (watermarkStyle) {
                        case "neon":
                          return {
                            background: "rgba(104, 183, 122, 0.25)",
                            backdropFilter: "blur(6px)",
                            border: "1.5px solid #68B77A",
                            color: "#68B77A",
                            boxShadow: "0 0 12px rgba(104, 183, 122, 0.5)",
                            transform: `scale(${scaleFactor})`,
                          };
                        case "dark":
                          return {
                            background: "#0F172A",
                            border: "1px solid #334155",
                            color: "#F8FAFC",
                            transform: `scale(${scaleFactor})`,
                          };
                        case "gold":
                          return {
                            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)",
                            border: "1.5px solid #F59E0B",
                            color: "#FBBF24",
                            boxShadow: "0 0 12px rgba(245, 158, 11, 0.35)",
                            transform: `scale(${scaleFactor})`,
                          };
                        case "glass":
                        default:
                          return {
                            background: "rgba(0,0,0,0.75)",
                            backdropFilter: "blur(6px)",
                            border: "1px solid rgba(255,255,255,0.2)",
                            color: "#FFFFFF",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                            transform: `scale(${scaleFactor})`,
                          };
                      }
                    })()
                  }}
                >
                  {textWatermark.trim() || `@${inspectedMeta?.ownerUsername || "cuddlytails"}`}
                </div>
              </motion.div>


            </div>

            {/* Custom Caption Input Below Phone Frame */}
            <div style={{ marginTop: "20px", width: "100%" }}>
              {/* Multi-Platform Caption Tab Switcher */}
              <div style={{ display: "flex", gap: "6px", marginBottom: "12px", background: "var(--bg-deep)", padding: "5px", borderRadius: "14px", border: "1px solid var(--panel-border)", boxShadow: "inset 0 1px 3px rgba(15, 23, 42, 0.04)" }}>
                {[
                  { id: "Instagram", label: "Instagram", icon: <InstagramIcon />, color: "#E1306C", bg: "#E1306C", shadow: "rgba(225, 48, 108, 0.35)" },
                  { id: "Pinterest", label: "Pinterest", icon: <PinterestIcon />, color: "#E60023", bg: "#E60023", shadow: "rgba(230, 0, 35, 0.35)" },
                  { id: "Twitter", label: "Twitter (X)", icon: <XIcon />, color: "#1DA1F2", bg: "#1DA1F2", shadow: "rgba(29, 161, 242, 0.35)" },
                  { id: "YouTube", label: "YouTube Shorts", icon: <YouTubeIcon />, color: "#FF0000", bg: "#FF0000", shadow: "rgba(255, 0, 0, 0.35)" },
                ].map((t) => {
                  const isActive = activeCaptionTab === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      type="button"
                      title={t.label}
                      whileHover={{ scale: isActive ? 1.02 : 1.04, y: -1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleTabSwitch(t.id as CaptionTab)}
                      style={{
                        flex: 1,
                        padding: "9px 12px",
                        borderRadius: "10px",
                        border: isActive ? `1px solid ${t.bg}` : "1px solid transparent",
                        background: isActive ? t.bg : "transparent",
                        color: isActive ? "#FFFFFF" : "var(--secondary-text)",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: isActive ? `0 4px 14px ${t.shadow}` : "none",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", filter: isActive ? "brightness(0) invert(1)" : "none" }}>
                        {t.icon}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" }}>
                  Publishing Caption ({activeCaptionTab})
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
                  placeholder="Auto-generated by Gemini AI or customize per platform..."
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
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        background: "rgba(255, 255, 255, 0.88)",
                        backdropFilter: "blur(8px)",
                        borderRadius: "12px",
                        zIndex: 20,
                        pointerEvents: "none",
                        border: "1.5px solid #A7F3D0",
                        boxShadow: "inset 0 0 20px rgba(16, 185, 129, 0.06)",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
                          border: "1px solid #6EE7B7",
                          color: "#047857",
                          fontSize: "0.82rem",
                          fontWeight: 800,
                          padding: "8px 18px",
                          borderRadius: "999px",
                          boxShadow: "0 4px 14px rgba(5, 150, 105, 0.15)",
                        }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            border: "2px solid rgba(4, 120, 87, 0.2)",
                            borderTopColor: "#047857",
                            flexShrink: 0,
                          }}
                        />
                        <span>Crafting AI Caption...</span>
                      </div>
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
            initial={{ opacity: 0, y: 25, x: "-50%", scale: 0.95 }}
            animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
            exit={{ opacity: 0, y: 25, x: "-50%", scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 26 }}
            style={{
              position: "fixed",
              bottom: "28px",
              left: "50%",
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
              pointerEvents: "none",
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

      {/* 📱 Phone-Only Centering Styles for Live Canvas Preview Video Mockup (<640px) */}
      <style>{`
        @media (max-width: 640px) {
          .page1-preview-col {
            flex: 1 1 100% !important;
            width: 100% !important;
            max-width: 100% !important;
            position: static !important;
            margin: 0 auto !important;
          }
          .page1-preview-card {
            width: 100% !important;
            margin: 0 auto !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .page1-phone-mockup {
            margin: 0 auto !important;
          }
          .page1-demo-reel-btn {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
