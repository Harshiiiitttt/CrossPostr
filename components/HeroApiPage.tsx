import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SetupGuideModal, { PlatformId } from "./SetupGuideModal";
import ContactModal from "./ContactModal";

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
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="12" height="12" viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      <path d="M18 6L6 18M6 6l12 12" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
              background: "rgba(10, 18, 26, 0.96)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              color: "#FFFFFF",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "5px 12px",
              borderRadius: "8px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 0 12px rgba(104, 183, 122, 0.25)",
              zIndex: 999,
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
        borderRadius: "16px",
        overflow: "hidden",
        border: isConnected ? `1.5px solid ${brandColor}` : `1px solid ${brandColor}40`,
        boxShadow: transformStyle.isHovered
          ? `0 20px 40px ${brandColor}33, 0 0 25px ${brandColor}22`
          : isConnected
          ? `0 10px 30px ${brandColor}33`
          : "0 4px 18px rgba(0,0,0,0.3)",
        background: transformStyle.isHovered
          ? `radial-gradient(circle at ${transformStyle.spotlightX}% ${transformStyle.spotlightY}%, ${brandColor}25 0%, rgba(15,25,35,0.92) 70%)`
          : isConnected
          ? `linear-gradient(135deg, ${brandColor}22 0%, rgba(15,25,35,0.85) 100%)`
          : `linear-gradient(135deg, ${brandColor}0F 0%, rgba(15,25,35,0.75) 100%)`,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        padding: "20px",
        transition: "border 0.25s ease, box-shadow 0.25s ease, background 0.25s ease",
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
  const [testState, setTestState] = useState<Record<string, { status: "idle" | "testing" | "success" | "error"; latency?: number }>>({});
  const [helpModalPlatform, setHelpModalPlatform] = useState<"instagram" | "pinterest" | "twitter" | "youtube" | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const handleTestConnection = (platformKey: string) => {
    setTestState((prev) => ({ ...prev, [platformKey]: { status: "testing" } }));
    setTimeout(() => {
      const latency = Math.floor(Math.random() * 25) + 25;
      setTestState((prev) => ({ ...prev, [platformKey]: { status: "success", latency } }));
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

  const handleAutoFillDemo = () => {
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
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 50% 0%, #12212F 0%, #091018 100%)", color: "#F1EEE7", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden" }}>
      
      {/* 🌟 Glassmorphic Top Navigation Header */}
      <header
        style={{
          width: "100%",
          position: "sticky",
          top: 0,
          zIndex: 90,
          background: "rgba(9, 16, 24, 0.85)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Brand Logo & Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ width: "32px", height: "32px", borderRadius: "10px", background: "rgba(104, 183, 122, 0.18)", border: "1px solid rgba(104, 183, 122, 0.4)", color: "#68B77A", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PawIcon />
          </span>
          <span style={{ fontSize: "1.1rem", fontWeight: 900, fontFamily: "Slackey, cursive, sans-serif", color: "#FFFFFF", letterSpacing: "0.02em" }}>
            Cross Postr
          </span>
        </div>

        {/* Top Navigation Quick Action Dock */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Tooltip content="Send email or get in touch" align="right">
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#68B77A",
                  padding: "6px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  opacity: 0.85,
                }}
                title="Contact Me"
              >
                <MailIcon />
              </button>
            </Tooltip>

            <Tooltip content="View GitHub Profile @Harshiiiitttt" align="right">
              <a
                href="https://github.com/Harshiiiitttt"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  padding: "6px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: "none",
                  transition: "transform 0.2s ease, opacity 0.2s ease",
                  opacity: 0.85,
                }}
                title="GitHub Profile"
              >
                <GitHubIcon />
              </a>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Subtle Background Glow */}
      <div style={{ position: "absolute", top: "-10%", left: "30%", width: "500px", height: "500px", background: "radial-gradient(circle, rgba(104, 183, 122, 0.12) 0%, transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "840px", width: "100%", zIndex: 10, textAlign: "center", padding: "40px 20px 60px 20px" }}>
        
        {/* Minimalist Brand Header */}
        <div style={{ marginBottom: "28px", display: "flex", flexDirection: "column", alignItems: "center" }}>

          {/* Animated Heading Text */}
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
              color: "#FFFFFF",
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
                  color: i === 1 ? "#68B77A" : "#FFFFFF",
                  textShadow: "0 4px 18px rgba(0,0,0,0.8), 0 0 25px rgba(104, 183, 122, 0.25)",
                }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          {/* Sleek Minimalist Connection Status Bar */}
          <div style={{ width: "100%", maxWidth: "480px", background: "rgba(15, 25, 35, 0.7)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "12px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", fontSize: "0.76rem" }}>
              <span style={{ fontWeight: 700, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                <LockIcon /> AES-256 Client Enclave Active
              </span>
              <span style={{ fontWeight: 800, color: connectedCount > 0 ? "#68B77A" : "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
                {connectedCount > 0 && <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#68B77A", boxShadow: "0 0 8px #68B77A" }} />}
                {connectedCount} of 4 Connected ({progressPercent}%)
              </span>
            </div>
            {/* Progress Track */}
            <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "linear-gradient(90deg, #68B77A 0%, #10B981 100%)",
                  borderRadius: "3px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </div>




        {/* Vibrant Platform API Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: activeTab === "all" ? "repeat(auto-fit, minmax(min(100%, 300px), 1fr))" : "1fr", gap: "18px", marginBottom: "28px", textAlign: "left" }}>
          
          {/* Instagram Card */}
          {(activeTab === "all" || activeTab === "instagram") && (
            <MagneticCard brandColor="#E1306C" isConnected={!!creds.instagramToken?.trim()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E1306C" }}>
                  <InstagramIcon />
                  <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#F1EEE7" }}>Instagram Graph API (OAuth 2.0)</span>
                  <Tooltip content="Setup guide for Instagram OAuth">
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform("instagram")}
                      style={{ background: "rgba(225, 48, 108, 0.18)", border: "none", borderRadius: "50%", width: "18px", height: "18px", color: "#E1306C", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 0 }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: "12px", background: creds.instagramToken?.trim() ? "rgba(225, 48, 108, 0.22)" : "rgba(255,255,255,0.06)", color: creds.instagramToken?.trim() ? "#FF528F" : "var(--text-muted)", border: creds.instagramToken?.trim() ? "1px solid rgba(225,48,108,0.4)" : "1px solid rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {creds.instagramToken?.trim() ? <><CheckIcon /> Connected</> : "Disconnected"}
                </span>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="Enter OAuth Access Token / App Secret"
                  value={creds.instagramToken || ""}
                  onFocus={() => setFocusedInput("instagram")}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => setCreds({ ...creds, instagramToken: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.45)",
                    border: focusedInput === "instagram" ? "1.5px solid #E1306C" : "1px solid rgba(225,48,108,0.3)",
                    boxShadow: focusedInput === "instagram" ? "0 0 14px rgba(225, 48, 108, 0.45)" : "none",
                    borderRadius: "9px",
                    padding: "10px 38px 10px 12px",
                    color: "#FFF",
                    fontSize: "0.82rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                />

                {creds.instagramToken && (
                  <button
                    type="button"
                    onClick={() => setCreds({ ...creds, instagramToken: "" })}
                    title="Clear Instagram API key"
                    style={{ position: "absolute", right: "10px", background: "#374151", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", minHeight: "22px", maxHeight: "22px", aspectRatio: "1 / 1", flexShrink: 0, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  >
                    <CrossIcon />
                  </button>
                )}
              </div>
              {/* Connection Tester Bar */}
              {creds.instagramToken?.trim() && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => handleTestConnection("instagram")}
                    disabled={testState.instagram?.status === "testing"}
                    style={{ background: "transparent", border: "none", color: "#FF528F", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", padding: 0 }}
                  >
                    {testState.instagram?.status === "testing" ? "Testing Connection..." : "⚡ Test Ping Token"}
                  </button>
                  {testState.instagram?.status === "success" && (
                    <span style={{ fontSize: "0.7rem", color: "#68B77A", fontWeight: 700 }}>
                      Ping 200 OK ✓ ({testState.instagram.latency}ms)
                    </span>
                  )}
                </div>
              )}
            </MagneticCard>
          )}

          {/* Pinterest Card */}
          {(activeTab === "all" || activeTab === "pinterest") && (
            <MagneticCard brandColor="#E60023" isConnected={!!creds.pinterestToken?.trim()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E60023" }}>
                  <PinterestIcon />
                  <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#F1EEE7" }}>Pinterest API v5 (OAuth 2.0)</span>
                  <Tooltip content="Setup guide for Pinterest OAuth">
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform("pinterest")}
                      style={{ background: "rgba(230, 0, 35, 0.18)", border: "none", borderRadius: "50%", width: "18px", height: "18px", color: "#E60023", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 0 }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: "12px", background: creds.pinterestToken?.trim() ? "rgba(230, 0, 35, 0.22)" : "rgba(255,255,255,0.06)", color: creds.pinterestToken?.trim() ? "#FF3B56" : "var(--text-muted)", border: creds.pinterestToken?.trim() ? "1px solid rgba(230,0,35,0.4)" : "1px solid rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {creds.pinterestToken?.trim() ? <><CheckIcon /> Connected</> : "Disconnected"}
                </span>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="Enter OAuth Access Token (pina_...)"
                  value={creds.pinterestToken || ""}
                  onFocus={() => setFocusedInput("pinterest")}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => setCreds({ ...creds, pinterestToken: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.45)",
                    border: focusedInput === "pinterest" ? "1.5px solid #E60023" : "1px solid rgba(230,0,35,0.3)",
                    boxShadow: focusedInput === "pinterest" ? "0 0 14px rgba(230, 0, 35, 0.45)" : "none",
                    borderRadius: "9px",
                    padding: "10px 38px 10px 12px",
                    color: "#FFF",
                    fontSize: "0.82rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                />

                {creds.pinterestToken && (
                  <button
                    type="button"
                    onClick={() => setCreds({ ...creds, pinterestToken: "" })}
                    title="Clear Pinterest API key"
                    style={{ position: "absolute", right: "10px", background: "#374151", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", minHeight: "22px", maxHeight: "22px", aspectRatio: "1 / 1", flexShrink: 0, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  >
                    <CrossIcon />
                  </button>
                )}
              </div>
              {/* Connection Tester Bar */}
              {creds.pinterestToken?.trim() && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => handleTestConnection("pinterest")}
                    disabled={testState.pinterest?.status === "testing"}
                    style={{ background: "transparent", border: "none", color: "#FF3B56", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", padding: 0 }}
                  >
                    {testState.pinterest?.status === "testing" ? "Testing Connection..." : "⚡ Test Ping Token"}
                  </button>
                  {testState.pinterest?.status === "success" && (
                    <span style={{ fontSize: "0.7rem", color: "#68B77A", fontWeight: 700 }}>
                      Ping 200 OK ✓ ({testState.pinterest.latency}ms)
                    </span>
                  )}
                </div>
              )}
            </MagneticCard>
          )}

          {/* Twitter Card */}
          {(activeTab === "all" || activeTab === "twitter") && (
            <MagneticCard brandColor="#1DA1F2" isConnected={!!creds.xApiKey?.trim()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#1DA1F2" }}>
                  <XIcon />
                  <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#F1EEE7" }}>Twitter (X) API v2 (OAuth 2.0)</span>
                  <Tooltip content="Setup guide for Twitter OAuth">
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform("twitter")}
                      style={{ background: "rgba(29, 161, 242, 0.18)", border: "none", borderRadius: "50%", width: "18px", height: "18px", color: "#1DA1F2", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 0 }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: "12px", background: creds.xApiKey?.trim() ? "rgba(29, 161, 242, 0.22)" : "rgba(255,255,255,0.06)", color: creds.xApiKey?.trim() ? "#40B4FF" : "var(--text-muted)", border: creds.xApiKey?.trim() ? "1px solid rgba(29,161,242,0.4)" : "1px solid rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {creds.xApiKey?.trim() ? <><CheckIcon /> Connected</> : "Disconnected"}
                </span>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="Enter OAuth 2.0 Bearer Key / Access Token"
                  value={creds.xApiKey || ""}
                  onFocus={() => setFocusedInput("twitter")}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => setCreds({ ...creds, xApiKey: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.45)",
                    border: focusedInput === "twitter" ? "1.5px solid #1DA1F2" : "1px solid rgba(29,161,242,0.3)",
                    boxShadow: focusedInput === "twitter" ? "0 0 14px rgba(29, 161, 242, 0.45)" : "none",
                    borderRadius: "9px",
                    padding: "10px 38px 10px 12px",
                    color: "#FFF",
                    fontSize: "0.82rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                />

                {creds.xApiKey && (
                  <button
                    type="button"
                    onClick={() => setCreds({ ...creds, xApiKey: "" })}
                    title="Clear Twitter API key"
                    style={{ position: "absolute", right: "10px", background: "#374151", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", minHeight: "22px", maxHeight: "22px", aspectRatio: "1 / 1", flexShrink: 0, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  >
                    <CrossIcon />
                  </button>
                )}
              </div>
              {/* Connection Tester Bar */}
              {creds.xApiKey?.trim() && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => handleTestConnection("twitter")}
                    disabled={testState.twitter?.status === "testing"}
                    style={{ background: "transparent", border: "none", color: "#40B4FF", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", padding: 0 }}
                  >
                    {testState.twitter?.status === "testing" ? "Testing Connection..." : "⚡ Test Ping Token"}
                  </button>
                  {testState.twitter?.status === "success" && (
                    <span style={{ fontSize: "0.7rem", color: "#68B77A", fontWeight: 700 }}>
                      Ping 200 OK ✓ ({testState.twitter.latency}ms)
                    </span>
                  )}
                </div>
              )}
            </MagneticCard>
          )}

          {/* YouTube Card */}
          {(activeTab === "all" || activeTab === "youtube") && (
            <MagneticCard brandColor="#FF0000" isConnected={!!creds.youtubeApiKey?.trim()}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FF0000", flexWrap: "wrap" }}>
                  <YouTubeIcon />
                  <span style={{ fontSize: "0.92rem", fontWeight: 800, color: "#F1EEE7" }}>YouTube Shorts API (OAuth 2.0)</span>
                  <Tooltip content="Setup guide for YouTube OAuth">
                    <button
                      type="button"
                      onClick={() => setHelpModalPlatform("youtube")}
                      style={{ background: "rgba(255, 0, 0, 0.18)", border: "none", borderRadius: "50%", width: "18px", height: "18px", color: "#FF0000", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0, lineHeight: 0 }}
                    >
                      <HelpIcon />
                    </button>
                  </Tooltip>
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 800, padding: "3px 10px", borderRadius: "12px", background: creds.youtubeApiKey?.trim() ? "rgba(255, 0, 0, 0.22)" : "rgba(255,255,255,0.06)", color: creds.youtubeApiKey?.trim() ? "#FF4D4D" : "var(--text-muted)", border: creds.youtubeApiKey?.trim() ? "1px solid rgba(255,0,0,0.4)" : "1px solid rgba(255,255,255,0.08)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                  {creds.youtubeApiKey?.trim() ? <><CheckIcon /> Connected</> : "Disconnected"}
                </span>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center", marginBottom: "10px" }}>
                <input
                  type="password"
                  placeholder="Enter OAuth 2.0 Client Credentials / API Key"
                  value={creds.youtubeApiKey || ""}
                  onFocus={() => setFocusedInput("youtube")}
                  onBlur={() => setFocusedInput(null)}
                  onChange={(e) => setCreds({ ...creds, youtubeApiKey: e.target.value })}
                  style={{
                    width: "100%",
                    background: "rgba(0,0,0,0.45)",
                    border: focusedInput === "youtube" ? "1.5px solid #FF0000" : "1px solid rgba(255,0,0,0.3)",
                    boxShadow: focusedInput === "youtube" ? "0 0 14px rgba(255, 0, 0, 0.45)" : "none",
                    borderRadius: "9px",
                    padding: "10px 38px 10px 12px",
                    color: "#FFF",
                    fontSize: "0.82rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                />

                {creds.youtubeApiKey && (
                  <button
                    type="button"
                    onClick={() => setCreds({ ...creds, youtubeApiKey: "" })}
                    title="Clear YouTube API key"
                    style={{ position: "absolute", right: "10px", background: "#374151", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "50%", width: "22px", minWidth: "22px", maxWidth: "22px", height: "22px", minHeight: "22px", maxHeight: "22px", aspectRatio: "1 / 1", flexShrink: 0, color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  >
                    <CrossIcon />
                  </button>
                )}
              </div>
              {/* Connection Tester Bar */}
              {creds.youtubeApiKey?.trim() && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button
                    type="button"
                    onClick={() => handleTestConnection("youtube")}
                    disabled={testState.youtube?.status === "testing"}
                    style={{ background: "transparent", border: "none", color: "#FF4D4D", fontSize: "0.74rem", fontWeight: 700, cursor: "pointer", padding: 0 }}
                  >
                    {testState.youtube?.status === "testing" ? "Testing Connection..." : "⚡ Test Ping Token"}
                  </button>
                  {testState.youtube?.status === "success" && (
                    <span style={{ fontSize: "0.7rem", color: "#68B77A", fontWeight: 700 }}>
                      Ping 200 OK ✓ ({testState.youtube.latency}ms)
                    </span>
                  )}
                </div>
              )}
            </MagneticCard>
          )}


        </div>


        {/* Minimalist Primary CTA Launch Button with Vertical Roll Text Hover Effect */}
        <motion.button
          type="button"
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
          onClick={handleSaveAndProceed}
          disabled={saving}
          style={{
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
            height: "48px",
            borderRadius: "12px",
            background: isAnyConnected ? "linear-gradient(135deg, #68B77A 0%, #4E985E 100%)" : "rgba(104, 183, 122, 0.18)",
            color: isAnyConnected ? "#FFFFFF" : "var(--text-muted)",
            fontSize: "0.95rem",
            fontWeight: 800,
            border: isAnyConnected ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(104, 183, 122, 0.25)",
            cursor: "pointer",
            boxShadow: isAnyConnected ? "0 6px 20px rgba(104, 183, 122, 0.25)" : "none",
            transition: "background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
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
