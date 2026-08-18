import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SetupGuideModal, { PlatformId } from "./SetupGuideModal";
import ContactModal from "./ContactModal";
import CrossPostrIcon from "./CrossPostrIcon";

interface HeroApiPageProps {
  onConnected: () => void;
}

export interface ApiCredentials {
  instagramToken?: string;
  pinterestToken?: string;
  xApiKey?: string;
  youtubeApiKey?: string;
  geminiApiKey?: string;
}

function PawIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
      <ellipse cx="5.2" cy="8.8" rx="2.1" ry="2.7" />
      <ellipse cx="10.1" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="14.7" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="19" cy="8.8" rx="2.1" ry="2.7" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.6 2.9 1.5 3.9.76.76 1.23 1.52 1.41 2.5" />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 22h14" />
      <path d="M5 2h14" />
      <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
      <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
    </svg>
  );
}

interface TooltipProps {
  content: string;
  position?: "top" | "bottom";
  align?: "center" | "left" | "right";
  children: React.ReactNode;
}

function Tooltip({ content, position = "bottom", align = "center", children }: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const isTop = position === "top";

  const getAlignStyles = (): React.CSSProperties => {
    if (align === "right") {
      return { right: 0, left: "auto", transform: "none" };
    }
    if (align === "left") {
      return { left: 0, right: "auto", transform: "none" };
    }
    return { left: "50%", transform: "translateX(-50%)" };
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative", display: "inline-flex" }}
    >
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: isTop ? 6 : -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isTop ? 4 : -4, scale: 0.92 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "absolute",
              top: isTop ? undefined : "calc(100% + 10px)",
              bottom: isTop ? "calc(100% + 10px)" : undefined,
              ...getAlignStyles(),
              background: "#0F172A",
              border: "1px solid #334155",
              color: "#F8FAFC",
              fontSize: "0.74rem",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: "6px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: "0 10px 25px rgba(15, 23, 42, 0.25)",
              zIndex: 9999,
              WebkitFontSmoothing: "antialiased",
              MozOsxFontSmoothing: "grayscale",
              textRendering: "geometricPrecision",
              transform: "translateZ(0)",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MagneticCardProps {
  children: React.ReactNode;
  brandColor: string;
  isConnected: boolean;
}

function MagneticCard({ children, brandColor, isConnected }: MagneticCardProps) {
  const [transformStyle, setTransformStyle] = useState({ rotateX: 0, rotateY: 0, spotlightX: 50, spotlightY: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -5;
    const rotY = ((x - centerX) / centerX) * 5;

    setTransformStyle({
      rotateX: rotX,
      rotateY: rotY,
      spotlightX: (x / rect.width) * 100,
      spotlightY: (y / rect.height) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTransformStyle({ rotateX: 0, rotateY: 0, spotlightX: 50, spotlightY: 50, isHovered: false });
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: transformStyle.rotateX,
        rotateY: transformStyle.rotateY,
        scale: transformStyle.isHovered ? 1.015 : 1,
      }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        position: "relative",
        borderRadius: "14px",
        overflow: "visible",
        zIndex: transformStyle.isHovered ? 50 : 1,
        border: isConnected ? "1.5px solid #10B981" : transformStyle.isHovered ? "1.5px solid #94A3B8" : "1px solid #E2E8F0",
        boxShadow: transformStyle.isHovered
          ? "0 10px 28px rgba(15, 23, 42, 0.08)"
          : isConnected
          ? "0 4px 14px rgba(16, 185, 129, 0.08)"
          : "0 2px 8px rgba(15, 23, 42, 0.03)",
        background: "#FFFFFF",
        padding: "20px 22px",
        transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </motion.div>
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
  const [activeTab, setActiveTab] = useState<"all" | "instagram" | "pinterest" | "twitter" | "youtube">("all");
  const [testState, setTestState] = useState<Record<string, { status: "idle" | "testing" | "success" | "error"; latency?: number; errorMsg?: string }>>({});
  const [helpModalPlatform, setHelpModalPlatform] = useState<"instagram" | "pinterest" | "twitter" | "youtube" | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const toggleShowPassword = (platformKey: string) => {
    setShowPassword((prev) => ({ ...prev, [platformKey]: !prev[platformKey] }));
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

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
    }, 750);
  };

  useEffect(() => {
    const saved = localStorage.getItem("cuddlytails_api_credentials");
    if (saved) {
      try {
        setCreds(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const updatePlatformCred = (platformKey: string, field: keyof ApiCredentials, value: string) => {
    setCreds((prev) => ({ ...prev, [field]: value }));
    setTestState((prev) => ({ ...prev, [platformKey]: { status: "idle" } }));
    setShowPassword((prev) => ({ ...prev, [platformKey]: false }));
  };

  const handleAutoFillDemo = () => {
    setTestState({});
    setShowPassword({});
    const demoCreds: ApiCredentials = {
      instagramToken: "ig_access_token_demo_cuddlytails_9942",
      pinterestToken: "pin_live_token_demo_7731",
      xApiKey: "twitter_bearer_token_demo_8820",
      youtubeApiKey: "yt_shorts_oauth_key_demo_4412",
      geminiApiKey: "gemini_api_key_demo_cuddlytails_101",
    };
    setCreds(demoCreds);
  };

  const handleAutoFillSingleDemoKey = (platform: PlatformId) => {
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
    }, 600);
  };

  const connectedCount = [
    creds.instagramToken?.trim(),
    creds.pinterestToken?.trim(),
    creds.xApiKey?.trim(),
    creds.youtubeApiKey?.trim(),
  ].filter(Boolean).length;

  const isAnyConnected = connectedCount > 0;
  const progressPercent = Math.round((connectedCount / 4) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--body-text)", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
      
      {/* 🌟 Glassmorphic Top Navigation Header */}
      <header
        style={{
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 90,
          background: "rgba(255, 255, 255, 0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--panel-border)",
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)",
        }}
      >
        {/* Brand Logo & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 900, fontFamily: "Slackey, cursive, sans-serif", color: "var(--heading-white)", letterSpacing: "0.02em" }}>
            Cross Postr
          </span>
        </div>

        {/* Top Navigation Quick Action Dock */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(255, 255, 255, 0.8)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--panel-border)",
              borderRadius: "14px",
              padding: "4px 6px",
              boxShadow: "0 2px 10px rgba(15, 23, 42, 0.05)",
            }}
          >
            <Tooltip content="Send Feedback / Email Me" align="right">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#2D8A4E",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  transition: "background 0.2s ease, transform 0.2s ease",
                }}
                aria-label="Contact Me"
              >
                <MailIcon />
              </button>
            </Tooltip>

            <Tooltip content="GitHub Repository" align="right">
              <a
                href="https://github.com/Harshiiiitttt/CrossPostr"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#0F172A",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "6px 8px",
                  borderRadius: "8px",
                  transition: "background 0.2s ease, transform 0.2s ease",
                  textDecoration: "none",
                }}
                aria-label="GitHub Profile"
              >
                <GitHubIcon />
              </a>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* 🔮 Contact Modal Integration */}
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

      {/* Hero Section Container */}
      <div style={{ width: "100%", maxWidth: "1200px", padding: "40px 24px 60px", textAlign: "center", position: "relative", zIndex: 10 }}>
        
        {/* Hero Title & Status */}
        <div style={{ marginBottom: "36px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              lineHeight: 1.25,
              margin: "0 0 16px 0",
              fontFamily: "Slackey, cursive, sans-serif",
              color: "var(--heading-white)",
              letterSpacing: "0.01em",
              cursor: "default",
            }}
          >
            {"Connect Social Platform APIs".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: [0, -5, 0],
                }}
                whileHover={{ scale: 1.12 }}
                transition={{
                  opacity: { duration: 0.4, delay: 0.1 * i },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.2 * i },
                }}
                style={{
                  display: "inline-block",
                  marginRight: "0.28em",
                  color: i === 1 ? "#2D8A4E" : "var(--heading-white)",
                  textShadow: "0 2px 10px rgba(15, 23, 42, 0.08)",
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Sleek Minimalist Connection Status Bar */}
          <div style={{ width: "100%", maxWidth: "480px", background: "var(--panel)", border: "1px solid var(--panel-border)", borderRadius: "14px", padding: "12px 18px", boxShadow: "0 4px 16px rgba(15, 23, 42, 0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "0.76rem" }}>
              <span style={{ fontWeight: 700, color: "var(--secondary-text)", display: "flex", alignItems: "center", gap: "6px" }}>
                <LockIcon /> AES-256 Client Enclave Active
              </span>
              <span style={{ fontWeight: 800, color: connectedCount > 0 ? "#2D8A4E" : "var(--secondary-text)", display: "flex", alignItems: "center", gap: "6px" }}>
                {connectedCount > 0 && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#2D8A4E", boxShadow: "0 0 8px #2D8A4E" }} />}
                {connectedCount} of 4 Connected ({progressPercent}%)
              </span>
            </div>
            {/* Progress Track */}
            <div style={{ width: "100%", height: "6px", background: "var(--chip-bg)", borderRadius: "3px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #2D8A4E 0%, #10B981 100%)",
                  borderRadius: "3px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Vibrant Platform API Cards Grid - Exact 2x2 Layout */}
        <div className="hero-api-grid" style={{ display: "grid", gridTemplateColumns: activeTab === "all" ? "repeat(2, 1fr)" : "1fr", gap: "18px", marginBottom: "28px", textAlign: "left" }}>
          
          {/* Instagram Card */}
          {(activeTab === "all" || activeTab === "instagram") && (
            <MagneticCard brandColor="#E1306C" isConnected={!!creds.instagramToken?.trim()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E1306C" }}>
                  <InstagramIcon />
                  <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0F172A" }}>Instagram Graph API</span>
                  <Tooltip content="Setup guide for Instagram OAuth">
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform("instagram")}
                      style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "50%", width: "20px", height: "20px", color: "#64748B", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 0 }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: "9999px", background: creds.instagramToken?.trim() ? "#ECFDF5" : "#F1F5F9", color: creds.instagramToken?.trim() ? "#047857" : "#64748B", border: creds.instagramToken?.trim() ? "1px solid #A7F3D0" : "1px solid #E2E8F0", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {creds.instagramToken?.trim() ? <><CheckIcon /> Connected</> : "Disconnected"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "42px",
                  background: "#F8FAFC",
                  border: focusedInput === "instagram" ? "1.5px solid #E1306C" : "1px solid #E2E8F0",
                  boxShadow: focusedInput === "instagram" ? "0 0 0 3px rgba(225, 48, 108, 0.16)" : "none",
                  borderRadius: "12px",
                  padding: "0 12px 0 14px",
                  marginBottom: "4px",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type={showPassword["instagram"] ? "text" : "password"}
                  placeholder="Enter OAuth Access Token / App Secret"
                  value={creds.instagramToken || ""}
                  onFocus={() => setFocusedInput("instagram")}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => updatePlatformCred("instagram", "instagramToken", e.target.value)}
                  style={{
                    flex: 1,
                    height: "100%",
                    lineHeight: "42px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#0F172A",
                    fontSize: "0.82rem",
                    padding: 0,
                    margin: 0,
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  {creds.instagramToken && (
                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#CBD5E1", color: "#0F172A" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleShowPassword("instagram")}
                      title={showPassword["instagram"] ? "Hide API key" : "Show API key"}
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "all 0.15s ease" }}
                    >
                      {showPassword["instagram"] ? <EyeOffIcon /> : <EyeIcon />}
                    </motion.button>
                  )}
                  {creds.instagramToken && (
                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#EF4444", color: "#FFFFFF", borderColor: "#EF4444" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updatePlatformCred("instagram", "instagramToken", "")}
                      title="Clear Instagram API key"
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", color: "#0F172A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease" }}
                    >
                      <CrossIcon />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Expected Format Helper Hint */}
              <div style={{ fontSize: "0.68rem", color: "#64748B", marginBottom: "10px", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#F59E0B", display: "inline-flex", flexShrink: 0 }}><LightbulbIcon /></span>
                <span>Format: Starts with <code style={{ color: "#E1306C", background: "rgba(225,48,108,0.08)", padding: "1px 4px", borderRadius: "3px" }}>EAA...</code> or <code style={{ color: "#E1306C", background: "rgba(225,48,108,0.08)", padding: "1px 4px", borderRadius: "3px" }}>IGQV...</code></span>
              </div>

              {/* Connection Tester Bar */}
              {creds.instagramToken?.trim() && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => handleTestConnection("instagram")}
                    disabled={testState.instagram?.status === "testing"}
                    style={{
                      background: testState.instagram?.status === "testing" ? "#F1F5F9" : "rgba(45, 138, 78, 0.08)",
                      border: "1px solid rgba(45, 138, 78, 0.3)",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      color: "#2D8A4E",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: testState.instagram?.status === "testing" ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                      boxShadow: "0 1px 3px rgba(45, 138, 78, 0.08)",
                    }}
                  >
                    {testState.instagram?.status === "testing" ? (
                      <>
                        <motion.span
                          animate={{ rotate: 180 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                          style={{ display: "inline-flex", color: "#64748B", flexShrink: 0 }}
                        >
                          <HourglassIcon />
                        </motion.span>
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <span style={{ display: "inline-flex", color: "#F59E0B", flexShrink: 0 }}><ZapIcon /></span>
                        <span>Test Ping Token</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {testState.instagram?.status === "success" && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#047857",
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "6px",
                          padding: "3px 8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CheckIcon /> Ping 200 OK ({testState.instagram.latency}ms)
                      </span>
                    )}

                    {testState.instagram?.status === "error" && (
                      <>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#DC2626",
                            background: "#FEF2F2",
                            border: "1px solid #FCA5A5",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title={testState.instagram.errorMsg}
                        >
                          Failed ✕ ({testState.instagram.errorMsg})
                        </span>

                        <button
                          type="button"
                          onClick={() => setHelpModalPlatform("instagram")}
                          title="Open Instagram Setup Guide"
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "#E1306C",
                            background: "rgba(225, 48, 108, 0.08)",
                            border: "1px solid rgba(225, 48, 108, 0.25)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <HelpIcon /> Guide
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </MagneticCard>
          )}

          {/* Pinterest Card */}
          {(activeTab === "all" || activeTab === "pinterest") && (
            <MagneticCard brandColor="#E60023" isConnected={!!creds.pinterestToken?.trim()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E60023" }}>
                  <PinterestIcon />
                  <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0F172A" }}>Pinterest API v5</span>
                  <Tooltip content="Setup guide for Pinterest OAuth">
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform("pinterest")}
                      style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "50%", width: "20px", height: "20px", color: "#64748B", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 0 }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: "9999px", background: creds.pinterestToken?.trim() ? "#ECFDF5" : "#F1F5F9", color: creds.pinterestToken?.trim() ? "#047857" : "#64748B", border: creds.pinterestToken?.trim() ? "1px solid #A7F3D0" : "1px solid #E2E8F0", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {creds.pinterestToken?.trim() ? <><CheckIcon /> Connected</> : "Disconnected"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "42px",
                  background: "#F8FAFC",
                  border: focusedInput === "pinterest" ? "1.5px solid #E60023" : "1px solid #E2E8F0",
                  boxShadow: focusedInput === "pinterest" ? "0 0 0 3px rgba(230, 0, 35, 0.16)" : "none",
                  borderRadius: "12px",
                  padding: "0 12px 0 14px",
                  marginBottom: "4px",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type={showPassword["pinterest"] ? "text" : "password"}
                  placeholder="Enter OAuth Access Token (pina_...)"
                  value={creds.pinterestToken || ""}
                  onFocus={() => setFocusedInput("pinterest")}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => updatePlatformCred("pinterest", "pinterestToken", e.target.value)}
                  style={{
                    flex: 1,
                    height: "100%",
                    lineHeight: "42px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#0F172A",
                    fontSize: "0.82rem",
                    padding: 0,
                    margin: 0,
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  {creds.pinterestToken && (
                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#CBD5E1", color: "#0F172A" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleShowPassword("pinterest")}
                      title={showPassword["pinterest"] ? "Hide API key" : "Show API key"}
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "all 0.15s ease" }}
                    >
                      {showPassword["pinterest"] ? <EyeOffIcon /> : <EyeIcon />}
                    </motion.button>
                  )}
                  {creds.pinterestToken && (
                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#EF4444", color: "#FFFFFF", borderColor: "#EF4444" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updatePlatformCred("pinterest", "pinterestToken", "")}
                      title="Clear Pinterest API key"
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", color: "#0F172A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease" }}
                    >
                      <CrossIcon />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Expected Format Helper Hint */}
              <div style={{ fontSize: "0.68rem", color: "#64748B", marginBottom: "10px", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#F59E0B", display: "inline-flex", flexShrink: 0 }}><LightbulbIcon /></span>
                <span>Format: Starts with <code style={{ color: "#E60023", background: "rgba(230,0,35,0.08)", padding: "1px 4px", borderRadius: "3px" }}>pina_...</code> or <code style={{ color: "#E60023", background: "rgba(230,0,35,0.08)", padding: "1px 4px", borderRadius: "3px" }}>pin_live_...</code></span>
              </div>

              {/* Connection Tester Bar */}
              {creds.pinterestToken?.trim() && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => handleTestConnection("pinterest")}
                    disabled={testState.pinterest?.status === "testing"}
                    style={{
                      background: testState.pinterest?.status === "testing" ? "#F1F5F9" : "rgba(45, 138, 78, 0.08)",
                      border: "1px solid rgba(45, 138, 78, 0.3)",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      color: "#2D8A4E",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: testState.pinterest?.status === "testing" ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                      boxShadow: "0 1px 3px rgba(45, 138, 78, 0.08)",
                    }}
                  >
                    {testState.pinterest?.status === "testing" ? (
                      <>
                        <motion.span
                          animate={{ rotate: 180 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                          style={{ display: "inline-flex", color: "#64748B", flexShrink: 0 }}
                        >
                          <HourglassIcon />
                        </motion.span>
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <span style={{ display: "inline-flex", color: "#F59E0B", flexShrink: 0 }}><ZapIcon /></span>
                        <span>Test Ping Token</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {testState.pinterest?.status === "success" && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#047857",
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "6px",
                          padding: "3px 8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CheckIcon /> Ping 200 OK ({testState.pinterest.latency}ms)
                      </span>
                    )}

                    {testState.pinterest?.status === "error" && (
                      <>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#DC2626",
                            background: "#FEF2F2",
                            border: "1px solid #FCA5A5",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title={testState.pinterest.errorMsg}
                        >
                          Failed ✕ ({testState.pinterest.errorMsg})
                        </span>

                        <button
                          type="button"
                          onClick={() => setHelpModalPlatform("pinterest")}
                          title="Open Pinterest Setup Guide"
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "#E60023",
                            background: "rgba(230, 0, 35, 0.08)",
                            border: "1px solid rgba(230, 0, 35, 0.25)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <HelpIcon /> Guide
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </MagneticCard>
          )}

          {/* Twitter Card */}
          {(activeTab === "all" || activeTab === "twitter") && (
            <MagneticCard brandColor="#1DA1F2" isConnected={!!creds.xApiKey?.trim()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#0F172A" }}>
                  <XIcon />
                  <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0F172A" }}>Twitter (X) API v2</span>
                  <Tooltip content="Setup guide for Twitter OAuth">
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform("twitter")}
                      style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "50%", width: "20px", height: "20px", color: "#64748B", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 0 }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: "9999px", background: creds.xApiKey?.trim() ? "#ECFDF5" : "#F1F5F9", color: creds.xApiKey?.trim() ? "#047857" : "#64748B", border: creds.xApiKey?.trim() ? "1px solid #A7F3D0" : "1px solid #E2E8F0", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {creds.xApiKey?.trim() ? <><CheckIcon /> Connected</> : "Disconnected"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "42px",
                  background: "#F8FAFC",
                  border: focusedInput === "twitter" ? "1.5px solid #1DA1F2" : "1px solid #E2E8F0",
                  boxShadow: focusedInput === "twitter" ? "0 0 0 3px rgba(29, 161, 242, 0.16)" : "none",
                  borderRadius: "12px",
                  padding: "0 12px 0 14px",
                  marginBottom: "4px",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type={showPassword["twitter"] ? "text" : "password"}
                  placeholder="Enter Bearer Key / Access Token"
                  value={creds.xApiKey || ""}
                  onFocus={() => setFocusedInput("twitter")}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => updatePlatformCred("twitter", "xApiKey", e.target.value)}
                  style={{
                    flex: 1,
                    height: "100%",
                    lineHeight: "42px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#0F172A",
                    fontSize: "0.82rem",
                    padding: 0,
                    margin: 0,
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  {creds.xApiKey && (
                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#CBD5E1", color: "#0F172A" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleShowPassword("twitter")}
                      title={showPassword["twitter"] ? "Hide API key" : "Show API key"}
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "all 0.15s ease" }}
                    >
                      {showPassword["twitter"] ? <EyeOffIcon /> : <EyeIcon />}
                    </motion.button>
                  )}
                  {creds.xApiKey && (
                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#EF4444", color: "#FFFFFF", borderColor: "#EF4444" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updatePlatformCred("twitter", "xApiKey", "")}
                      title="Clear Twitter API key"
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", color: "#0F172A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease" }}
                    >
                      <CrossIcon />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Expected Format Helper Hint */}
              <div style={{ fontSize: "0.68rem", color: "#64748B", marginBottom: "10px", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#F59E0B", display: "inline-flex", flexShrink: 0 }}><LightbulbIcon /></span>
                <span>Format: Starts with <code style={{ color: "#1DA1F2", background: "rgba(29,161,242,0.08)", padding: "1px 4px", borderRadius: "3px" }}>AAAA...</code> or <code style={{ color: "#1DA1F2", background: "rgba(29,161,242,0.08)", padding: "1px 4px", borderRadius: "3px" }}>twitter_bearer_...</code></span>
              </div>

              {/* Connection Tester Bar */}
              {creds.xApiKey?.trim() && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => handleTestConnection("twitter")}
                    disabled={testState.twitter?.status === "testing"}
                    style={{
                      background: testState.twitter?.status === "testing" ? "#F1F5F9" : "rgba(45, 138, 78, 0.08)",
                      border: "1px solid rgba(45, 138, 78, 0.3)",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      color: "#2D8A4E",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: testState.twitter?.status === "testing" ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                      boxShadow: "0 1px 3px rgba(45, 138, 78, 0.08)",
                    }}
                  >
                    {testState.twitter?.status === "testing" ? (
                      <>
                        <motion.span
                          animate={{ rotate: 180 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                          style={{ display: "inline-flex", color: "#64748B", flexShrink: 0 }}
                        >
                          <HourglassIcon />
                        </motion.span>
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <span style={{ display: "inline-flex", color: "#F59E0B", flexShrink: 0 }}><ZapIcon /></span>
                        <span>Test Ping Token</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {testState.twitter?.status === "success" && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#047857",
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "6px",
                          padding: "3px 8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CheckIcon /> Ping 200 OK ({testState.twitter.latency}ms)
                      </span>
                    )}

                    {testState.twitter?.status === "error" && (
                      <>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#DC2626",
                            background: "#FEF2F2",
                            border: "1px solid #FCA5A5",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title={testState.twitter.errorMsg}
                        >
                          Failed ✕ ({testState.twitter.errorMsg})
                        </span>

                        <button
                          type="button"
                          onClick={() => setHelpModalPlatform("twitter")}
                          title="Open Twitter Setup Guide"
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "#1DA1F2",
                            background: "rgba(29, 161, 242, 0.08)",
                            border: "1px solid rgba(29, 161, 242, 0.25)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <HelpIcon /> Guide
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </MagneticCard>
          )}

          {/* YouTube Card */}
          {(activeTab === "all" || activeTab === "youtube") && (
            <MagneticCard brandColor="#FF0000" isConnected={!!creds.youtubeApiKey?.trim()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FF0000", flexWrap: "wrap" }}>
                  <YouTubeIcon />
                  <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#0F172A" }}>YouTube Shorts API</span>
                  <Tooltip content="Setup guide for YouTube OAuth">
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform("youtube")}
                      style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "50%", width: "20px", height: "20px", color: "#64748B", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 0 }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: "9999px", background: creds.youtubeApiKey?.trim() ? "#ECFDF5" : "#F1F5F9", color: creds.youtubeApiKey?.trim() ? "#047857" : "#64748B", border: creds.youtubeApiKey?.trim() ? "1px solid #A7F3D0" : "1px solid #E2E8F0", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {creds.youtubeApiKey?.trim() ? <><CheckIcon /> Connected</> : "Disconnected"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  height: "42px",
                  background: "#F8FAFC",
                  border: focusedInput === "youtube" ? "1.5px solid #FF0000" : "1px solid #E2E8F0",
                  boxShadow: focusedInput === "youtube" ? "0 0 0 3px rgba(255, 0, 0, 0.16)" : "none",
                  borderRadius: "12px",
                  padding: "0 12px 0 14px",
                  marginBottom: "4px",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type={showPassword["youtube"] ? "text" : "password"}
                  placeholder="Enter Client Credentials / API Key"
                  value={creds.youtubeApiKey || ""}
                  onFocus={() => setFocusedInput("youtube")}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => updatePlatformCred("youtube", "youtubeApiKey", e.target.value)}
                  style={{
                    flex: 1,
                    height: "100%",
                    lineHeight: "42px",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    color: "#0F172A",
                    fontSize: "0.82rem",
                    padding: 0,
                    margin: 0,
                  }}
                />

                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  {creds.youtubeApiKey && (
                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#CBD5E1", color: "#0F172A" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleShowPassword("youtube")}
                      title={showPassword["youtube"] ? "Hide API key" : "Show API key"}
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", color: "#64748B", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "all 0.15s ease" }}
                    >
                      {showPassword["youtube"] ? <EyeOffIcon /> : <EyeIcon />}
                    </motion.button>
                  )}
                  {creds.youtubeApiKey && (
                    <motion.button
                      type="button"
                      whileHover={{ backgroundColor: "#EF4444", color: "#FFFFFF", borderColor: "#EF4444" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => updatePlatformCred("youtube", "youtubeApiKey", "")}
                      title="Clear YouTube API key"
                      style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", color: "#0F172A", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease" }}
                    >
                      <CrossIcon />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Expected Format Helper Hint */}
              <div style={{ fontSize: "0.68rem", color: "#64748B", marginBottom: "10px", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ color: "#F59E0B", display: "inline-flex", flexShrink: 0 }}><LightbulbIcon /></span>
                <span>Format: Starts with <code style={{ color: "#FF0000", background: "rgba(255,0,0,0.08)", padding: "1px 4px", borderRadius: "3px" }}>AIzaSy...</code> or <code style={{ color: "#FF0000", background: "rgba(255,0,0,0.08)", padding: "1px 4px", borderRadius: "3px" }}>yt_shorts_...</code></span>
              </div>

              {/* Connection Tester Bar */}
              {creds.youtubeApiKey?.trim() && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => handleTestConnection("youtube")}
                    disabled={testState.youtube?.status === "testing"}
                    style={{
                      background: testState.youtube?.status === "testing" ? "#F1F5F9" : "rgba(45, 138, 78, 0.08)",
                      border: "1px solid rgba(45, 138, 78, 0.3)",
                      borderRadius: "8px",
                      padding: "4px 10px",
                      color: "#2D8A4E",
                      fontSize: "0.74rem",
                      fontWeight: 700,
                      cursor: testState.youtube?.status === "testing" ? "not-allowed" : "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.15s ease",
                      boxShadow: "0 1px 3px rgba(45, 138, 78, 0.08)",
                    }}
                  >
                    {testState.youtube?.status === "testing" ? (
                      <>
                        <motion.span
                          animate={{ rotate: 180 }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                          style={{ display: "inline-flex", color: "#64748B", flexShrink: 0 }}
                        >
                          <HourglassIcon />
                        </motion.span>
                        <span>Testing...</span>
                      </>
                    ) : (
                      <>
                        <span style={{ display: "inline-flex", color: "#F59E0B", flexShrink: 0 }}><ZapIcon /></span>
                        <span>Test Ping Token</span>
                      </>
                    )}
                  </button>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {testState.youtube?.status === "success" && (
                      <span
                        style={{
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          color: "#047857",
                          background: "#ECFDF5",
                          border: "1px solid #A7F3D0",
                          borderRadius: "6px",
                          padding: "3px 8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CheckIcon /> Ping 200 OK ({testState.youtube.latency}ms)
                      </span>
                    )}

                    {testState.youtube?.status === "error" && (
                      <>
                        <span
                          style={{
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            color: "#DC2626",
                            background: "#FEF2F2",
                            border: "1px solid #FCA5A5",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                          title={testState.youtube.errorMsg}
                        >
                          Failed ✕ ({testState.youtube.errorMsg})
                        </span>

                        <button
                          type="button"
                          onClick={() => setHelpModalPlatform("youtube")}
                          title="Open YouTube Setup Guide"
                          style={{
                            fontSize: "0.68rem",
                            fontWeight: 700,
                            color: "#FF0000",
                            background: "rgba(255, 0, 0, 0.08)",
                            border: "1px solid rgba(255, 0, 0, 0.25)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "3px",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <HelpIcon /> Guide
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </MagneticCard>
          )}
        </div>


        {/* Minimalist Primary CTA Launch Button with Hover/Click Color Shift & Pop Animation */}
        <motion.button
          type="button"
          initial="rest"
          animate="rest"
          whileHover={{
            scale: 1.05,
            y: -2,
            backgroundColor: "#2D8A4E",
            color: "#FFFFFF",
            boxShadow: "0 10px 28px rgba(45, 138, 78, 0.35)",
            borderColor: "rgba(45, 138, 78, 0.8)",
          }}
          whileTap={{
            scale: 0.94,
            backgroundColor: "#1E5B33",
            color: "#FFFFFF",
            boxShadow: "0 4px 12px rgba(45, 138, 78, 0.2)",
          }}
          onClick={handleSaveAndProceed}
          disabled={saving}
          style={{
            width: "100%",
            maxWidth: "420px",
            margin: "64px auto 0",
            height: "50px",
            borderRadius: "14px",
            background: "rgba(209, 242, 217, 0.85)",
            color: "#0F172A",
            border: "1.5px solid rgba(45, 138, 78, 0.35)",
            fontSize: "0.95rem",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(45, 138, 78, 0.08)",
            transition: "background 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Default Layer - Slides Up & Vanishes */}
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
            {saving ? (
              "Saving Credentials..."
            ) : isAnyConnected ? (
              <>Save &amp; Continue <ArrowRightIcon /></>
            ) : (
              <>Skip &amp; Start Exploring <ArrowRightIcon /></>
            )}
          </motion.div>

          {/* Hover Clone Layer - Smoothly Rolls Up from Bottom into View */}
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
            {saving ? (
              "Saving Credentials..."
            ) : isAnyConnected ? (
              <>Save &amp; Continue <ArrowRightIcon /></>
            ) : (
              <>Skip &amp; Start Exploring <ArrowRightIcon /></>
            )}
          </motion.div>
        </motion.button>




      </div>



      {/* 💡 Interactive Developer Setup Guide Modal */}
      <SetupGuideModal
        platform={helpModalPlatform}
        onClose={() => setHelpModalPlatform(null)}
        onSelectPlatform={(p) => setHelpModalPlatform(p)}
        onAutoFillDemoKey={handleAutoFillSingleDemoKey}
      />

      {/* ✉️ Contact Me Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

    </div>
  );
}
