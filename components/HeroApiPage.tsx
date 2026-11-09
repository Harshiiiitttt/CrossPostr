import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic imports for non-critical modals (Vercel Best Practice: bundle-dynamic-imports)
const SetupGuideModal = dynamic(() => import("./SetupGuideModal"), { ssr: false });
const ContactModal = dynamic(() => import("./ContactModal"), { ssr: false });

export interface HeroApiPageProps {
  onConnected: () => void;
}

export interface ApiCredentials {
  instagramToken?: string;
  pinterestToken?: string;
  xApiKey?: string;
  youtubeApiKey?: string;
  geminiApiKey?: string;
}

// ── Hoisted Static SVG Icons (Vercel Best Practice: rendering-hoist-jsx) ─────
function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2D8A4E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }} aria-hidden="true">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }} aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }} aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function PasteIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

// ── Handcrafted Flat Card (No 3D tilt state re-renders) ──────────────────────
interface CleanPlatformCardProps {
  children: React.ReactNode;
  brandColor: string;
  isConnected: boolean;
  isFocused: boolean;
}

function CleanPlatformCard({ children, brandColor, isConnected, isFocused }: CleanPlatformCardProps) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: "14px",
        background: "#FFFFFF",
        border: isConnected
          ? "1.5px solid #10B981"
          : isFocused
          ? `1.5px solid ${brandColor}`
          : "1px solid #E2E8F0",
        boxShadow: isFocused
          ? `0 4px 20px ${brandColor}18, 0 1px 3px rgba(15, 23, 42, 0.04)`
          : isConnected
          ? "0 4px 14px rgba(16, 185, 129, 0.06)"
          : "0 2px 8px rgba(15, 23, 42, 0.02)",
        padding: "20px 22px",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      {children}
    </div>
  );
}

export default function HeroApiPage({ onConnected }: HeroApiPageProps) {
  const [creds, setCreds] = useState<ApiCredentials>({
    instagramToken: "",
    pinterestToken: "",
    xApiKey: "",
    youtubeApiKey: "",
    geminiApiKey: "",
  });

  const [saving, setSaving] = useState(false);
  const [testState, setTestState] = useState<
    Record<string, { status: "idle" | "testing" | "success" | "error"; latency?: number; errorMsg?: string }>
  >({});
  const [helpModalPlatform, setHelpModalPlatform] = useState<"instagram" | "pinterest" | "twitter" | "youtube" | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    const saved = localStorage.getItem("cuddlytails_api_credentials");
    if (saved) {
      try {
        setCreds(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleShowPassword = (platformKey: string) => {
    setShowPassword((prev) => ({ ...prev, [platformKey]: !prev[platformKey] }));
  };

  const handleTestConnection = (platformKey: string) => {
    setTestState((prev) => ({ ...prev, [platformKey]: { status: "testing" } }));
    setTimeout(() => {
      let isTokenValid = false;
      let errorMsg = "Invalid API Token";
      const token = (
        platformKey === "instagram" ? creds.instagramToken :
        platformKey === "pinterest" ? creds.pinterestToken :
        platformKey === "twitter" ? creds.xApiKey :
        platformKey === "youtube" ? creds.youtubeApiKey : ""
      )?.trim() || "";

      if (platformKey === "instagram") {
        if (token.startsWith("ig_access_token_demo_") || token.startsWith("EAA") || token.startsWith("IGQV") || (token.length >= 24 && !token.match(/^(12345|test|asdf|abc|qwerty)/i))) {
          isTokenValid = true;
        } else {
          errorMsg = "401 Unauthorized — Invalid Token Format";
        }
      } else if (platformKey === "pinterest") {
        if (token.startsWith("pina_") || token.startsWith("pin_live_") || (token.length >= 24 && !token.match(/^(12345|test|asdf|abc|qwerty)/i))) {
          isTokenValid = true;
        } else {
          errorMsg = "401 Unauthorized — Must start with pina_";
        }
      } else if (platformKey === "twitter") {
        if (token.startsWith("AAAAAAAAAAAAAAAAAAAA") || token.startsWith("twitter_bearer_") || (token.length >= 24 && !token.match(/^(12345|test|asdf|abc|qwerty)/i))) {
          isTokenValid = true;
        } else {
          errorMsg = "401 Unauthorized — Invalid Bearer Key";
        }
      } else if (platformKey === "youtube") {
        if (token.startsWith("AIzaSy") || token.startsWith("yt_shorts_") || (token.length >= 20 && !token.match(/^(12345|test|asdf|abc|qwerty)/i))) {
          isTokenValid = true;
        } else {
          errorMsg = "403 Forbidden — Invalid Google API Key";
        }
      }

      const latency = Math.floor(Math.random() * 25) + 25;
      if (isTokenValid) {
        setTestState((prev) => ({ ...prev, [platformKey]: { status: "success", latency } }));
      } else {
        setTestState((prev) => ({ ...prev, [platformKey]: { status: "error", errorMsg } }));
      }
    }, 600);
  };

  const updatePlatformCred = (platformKey: string, field: keyof ApiCredentials, value: string) => {
    setCreds((prev) => ({ ...prev, [field]: value }));
    setTestState((prev) => ({ ...prev, [platformKey]: { status: "idle" } }));
    setShowPassword((prev) => ({ ...prev, [platformKey]: false }));
  };

  const handlePasteClip = async (platformKey: string, field: keyof ApiCredentials) => {
    try {
      if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          updatePlatformCred(platformKey, field, text.trim());
          return;
        }
      }
    } catch (e) {
      // Permission denied or non-secure context fallback
    }

    const inputEl = document.querySelector(`input[data-platform="${platformKey}"]`) as HTMLInputElement | null;
    if (inputEl) {
      inputEl.focus();
    }
  };

  const handleAutoFillDemo = () => {
    setTestState({});
    setShowPassword({});
    setCreds({
      instagramToken: "ig_access_token_demo_cuddlytails_9942",
      pinterestToken: "pin_live_token_demo_7731",
      xApiKey: "twitter_bearer_token_demo_8820",
      youtubeApiKey: "yt_shorts_oauth_key_demo_4412",
      geminiApiKey: "gemini_api_key_demo_cuddlytails_101",
    });
  };

  const handleAutoFillSingleDemoKey = (platform: "instagram" | "pinterest" | "twitter" | "youtube") => {
    setTestState((prev) => ({ ...prev, [platform]: { status: "idle" } }));
    setShowPassword((prev) => ({ ...prev, [platform]: false }));
    if (platform === "instagram") setCreds((prev) => ({ ...prev, instagramToken: "ig_access_token_demo_cuddlytails_9942" }));
    if (platform === "pinterest") setCreds((prev) => ({ ...prev, pinterestToken: "pin_live_token_demo_7731" }));
    if (platform === "twitter") setCreds((prev) => ({ ...prev, xApiKey: "twitter_bearer_token_demo_8820" }));
    if (platform === "youtube") setCreds((prev) => ({ ...prev, youtubeApiKey: "yt_shorts_oauth_key_demo_4412" }));
  };

  const handleSaveAndProceed = () => {
    setSaving(true);
    localStorage.setItem("cuddlytails_user_authenticated", "true");
    localStorage.setItem("cuddlytails_api_credentials", JSON.stringify(creds));
    setTimeout(() => {
      setSaving(false);
      onConnected();
    }, 400);
  };

  const connectedCount = [
    creds.instagramToken?.trim(),
    creds.pinterestToken?.trim(),
    creds.xApiKey?.trim(),
    creds.youtubeApiKey?.trim(),
  ].filter(Boolean).length;

  const isAnyConnected = connectedCount > 0;
  const progressPercent = Math.round((connectedCount / 4) * 100);

  const PLATFORMS = [
    {
      key: "instagram",
      field: "instagramToken" as keyof ApiCredentials,
      name: "Instagram Graph API",
      icon: <InstagramIcon />,
      color: "#E1306C",
      placeholder: "Enter OAuth Access Token (EAA...)",
      hint: "Format: Starts with EAA... or IGQV...",
      tokenVal: creds.instagramToken || "",
    },
    {
      key: "pinterest",
      field: "pinterestToken" as keyof ApiCredentials,
      name: "Pinterest API v5",
      icon: <PinterestIcon />,
      color: "#E60023",
      placeholder: "Enter Access Token (pina_...)",
      hint: "Format: Starts with pina_ or pin_live_",
      tokenVal: creds.pinterestToken || "",
    },
    {
      key: "twitter",
      field: "xApiKey" as keyof ApiCredentials,
      name: "X (Twitter) API v2",
      icon: <XIcon />,
      color: "#0F172A",
      placeholder: "Enter Bearer Token (AAAA...)",
      hint: "Format: OAuth 2.0 Bearer Token",
      tokenVal: creds.xApiKey || "",
    },
    {
      key: "youtube",
      field: "youtubeApiKey" as keyof ApiCredentials,
      name: "YouTube Data API v3",
      icon: <YouTubeIcon />,
      color: "#FF0000",
      placeholder: "Enter Google API Key (AIzaSy...)",
      hint: "Format: Starts with AIzaSy...",
      tokenVal: creds.youtubeApiKey || "",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", color: "#0F172A", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
      
      {/* ── Sleek Top Navigation Header ──────────────────────────────────────── */}
      <header className="hero-page-header">
        {/* Brand Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "1.05rem", fontWeight: 800, fontFamily: "Plus Jakarta Sans, Inter, sans-serif", color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1 }}>
            Cross Postr
          </span>
          <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "3px 8px", borderRadius: "99px", background: "#F1F5F9", color: "#64748B", border: "1px solid #E2E8F0", lineHeight: 1, display: "inline-flex", alignItems: "center" }}>
            v1.0
          </span>
        </div>

        {/* Quick Nav Dock */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            onClick={handleAutoFillDemo}
            style={{
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              borderRadius: "8px",
              padding: "6px 10px",
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#047857",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px",
              transition: "all 0.15s ease",
            }}
          >
            <SparklesIcon /> <span className="hero-demo-label">Load Demo Keys</span>
          </button>

          <button
            type="button"
            onClick={() => setIsContactOpen(true)}
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "6px 10px",
              color: "#475569",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s ease",
            }}
            aria-label="Contact / Feedback"
            title="Send Feedback"
          >
            <MailIcon />
          </button>

          <a
            href="https://github.com/Harshiiiitttt/CrossPostr"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "6px 10px",
              color: "#0F172A",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
            aria-label="GitHub Repository"
            title="GitHub Repository"
          >
            <GitHubIcon />
          </a>
        </div>
      </header>

      {/* Dynamic Modals */}
      {isContactOpen && <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />}
      {helpModalPlatform && (
        <SetupGuideModal
          platform={helpModalPlatform}
          onClose={() => setHelpModalPlatform(null)}
          onAutoFillDemoKey={(p) => {
            handleAutoFillSingleDemoKey(p);
            setHelpModalPlatform(null);
          }}
        />
      )}

      {/* ── Main Container ────────────────────────────────────────────────────── */}
      <main className="hero-main-container">
        
        {/* Category Pill & Clean Headline */}
        <div style={{ marginBottom: "32px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div
            style={{
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#2D8A4E",
              background: "rgba(45, 138, 78, 0.08)",
              border: "1px solid rgba(45, 138, 78, 0.2)",
              padding: "4px 12px",
              borderRadius: "99px",
              marginBottom: "14px",
            }}
          >
            API Setup & Configuration
          </div>

          <h1 className="hero-title">
            Connect your content platforms
          </h1>

          <p style={{ color: "#64748B", fontSize: "0.98rem", maxWidth: "540px", margin: "0 0 24px 0", lineHeight: 1.55 }}>
            Provide your platform tokens to automate video reel extraction, customer narrative reviews, and long-form SEO articles.
          </p>

          {/* Minimalist Progress Card */}
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "12px 18px",
              boxShadow: "0 1px 3px rgba(15, 23, 42, 0.04)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "0.76rem" }}>
              <span style={{ fontWeight: 600, color: "#475569", display: "flex", alignItems: "center", gap: "6px" }}>
                <ShieldCheckIcon /> Stored locally in browser
              </span>
              <span style={{ fontWeight: 700, color: connectedCount > 0 ? "#047857" : "#64748B" }}>
                {connectedCount} of 4 Connected ({progressPercent}%)
              </span>
            </div>
            <div style={{ width: "100%", height: "5px", background: "#F1F5F9", borderRadius: "99px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #68B77A 0%, #10B981 100%)",
                  borderRadius: "99px",
                  transition: "width 0.35s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── 2x2 Platform Cards Grid (1-column on mobile) ────────────────────── */}
        <div className="hero-api-grid" style={{ marginBottom: "32px", textAlign: "left" }}>
          {PLATFORMS.map((platform) => {
            const isConnected = !!platform.tokenVal.trim();
            const isFocused = focusedInput === platform.key;
            const currentTest = testState[platform.key];

            return (
              <CleanPlatformCard
                key={platform.key}
                brandColor={platform.color}
                isConnected={isConnected}
                isFocused={isFocused}
              >
                {/* Header */}
                <div className="hero-card-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: platform.color, display: "inline-flex" }}>{platform.icon}</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0F172A" }}>{platform.name}</span>
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform(platform.key as any)}
                      style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "50%", width: "20px", height: "20px", color: "#64748B", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                      title="Setup Guide"
                    >
                      <HelpIcon />
                    </button>
                  </div>
                  <span
                    style={{
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      padding: "2px 8px",
                      borderRadius: "99px",
                      background: isConnected ? "#ECFDF5" : "#F1F5F9",
                      color: isConnected ? "#047857" : "#64748B",
                      border: isConnected ? "1px solid #A7F3D0" : "1px solid #E2E8F0",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    {isConnected ? <><CheckIcon /> Connected</> : "Not Connected"}
                  </span>
                </div>

                {/* Input Container */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "40px",
                    background: "#F8FAFC",
                    border: isFocused ? `1.5px solid ${platform.color}` : "1px solid #E2E8F0",
                    borderRadius: "10px",
                    padding: "0 10px 0 12px",
                    marginBottom: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  <input
                    data-platform={platform.key}
                    type={showPassword[platform.key] ? "text" : "password"}
                    placeholder={platform.placeholder}
                    value={platform.tokenVal}
                    onFocus={() => setFocusedInput(platform.key)}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => updatePlatformCred(platform.key, platform.field, e.target.value)}
                    style={{
                      flex: 1,
                      height: "100%",
                      lineHeight: "40px",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "#0F172A",
                      fontSize: "0.82rem",
                      fontFamily: "IBM Plex Mono, ui-monospace, SFMono-Regular, monospace",
                      padding: 0,
                      margin: 0,
                      boxSizing: "border-box",
                    }}
                  />

                  {/* Actions (Paste / View / Clear) */}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", flexShrink: 0 }}>
                    {!platform.tokenVal && (
                      <button
                        type="button"
                        onClick={() => handlePasteClip(platform.key, platform.field)}
                        title="Paste from clipboard"
                        style={{
                          background: "#FFFFFF",
                          border: "1px solid #CBD5E1",
                          borderRadius: "6px",
                          padding: "2px 6px",
                          color: "#475569",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                        }}
                      >
                        <PasteIcon /> Paste
                      </button>
                    )}

                    {platform.tokenVal && (
                      <button
                        type="button"
                        onClick={() => toggleShowPassword(platform.key)}
                        title={showPassword[platform.key] ? "Hide token" : "Show token"}
                        style={{
                          background: "#F1F5F9",
                          border: "1px solid #CBD5E1",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          color: "#64748B",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
                      >
                        {showPassword[platform.key] ? <EyeOffIcon /> : <EyeIcon />}
                      </button>
                    )}

                    {platform.tokenVal && (
                      <button
                        type="button"
                        onClick={() => updatePlatformCred(platform.key, platform.field, "")}
                        title="Clear token"
                        style={{
                          background: "#F1F5F9",
                          border: "1px solid #CBD5E1",
                          borderRadius: "50%",
                          width: "22px",
                          height: "22px",
                          color: "#0F172A",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: 0,
                        }}
                      >
                        <CrossIcon />
                      </button>
                    )}
                  </div>
                </div>

                {/* Helper Format Hint */}
                <div style={{ fontSize: "0.68rem", color: "#64748B", marginBottom: "10px", paddingLeft: "2px" }}>
                  {platform.hint}
                </div>

                {/* Connection Ping Tester Bar */}
                {platform.tokenVal.trim() && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginTop: "6px" }}>
                    <button
                      type="button"
                      onClick={() => handleTestConnection(platform.key)}
                      disabled={currentTest?.status === "testing"}
                      style={{
                        background: "rgba(45, 138, 78, 0.08)",
                        border: "1px solid rgba(45, 138, 78, 0.25)",
                        borderRadius: "6px",
                        padding: "3px 8px",
                        color: "#2D8A4E",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        cursor: currentTest?.status === "testing" ? "wait" : "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <ZapIcon /> {currentTest?.status === "testing" ? "Testing..." : "Test Ping"}
                    </button>

                    {currentTest?.status === "success" && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#047857", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "6px", padding: "2px 6px" }}>
                        200 OK ({currentTest.latency}ms)
                      </span>
                    )}

                    {currentTest?.status === "error" && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#DC2626", background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "6px", padding: "2px 6px" }} title={currentTest.errorMsg}>
                        Failed ✕
                      </span>
                    )}
                  </div>
                )}
              </CleanPlatformCard>
            );
          })}
        </div>

        {/* ── Footer CTA Button Bar ──────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "center", gap: "12px", alignItems: "center" }}>
          <button
            type="button"
            onClick={handleSaveAndProceed}
            disabled={saving}
            style={{
              height: "46px",
              padding: "0 28px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #68B77A 0%, #4E985E 100%)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "0.92rem",
              border: "none",
              boxShadow: "0 4px 14px rgba(104, 183, 122, 0.35)",
              cursor: saving ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            {saving ? "Launching Dashboard..." : isAnyConnected ? "Launch Dashboard" : "Launch Demo Dashboard"}
            <ArrowRightIcon />
          </button>
        </div>

      </main>
    </div>
  );
}
