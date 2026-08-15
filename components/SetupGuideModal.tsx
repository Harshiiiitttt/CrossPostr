import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PlatformId = "instagram" | "pinterest" | "twitter" | "youtube";

interface SetupGuideModalProps {
  platform: PlatformId | null;
  onClose: () => void;
  onSelectPlatform?: (platform: PlatformId) => void;
  onAutoFillDemoKey?: (platform: PlatformId) => void;
}

interface GuideStep {
  title: string;
  subtitle: string;
  detail: string;
  linkText?: string;
  linkUrl?: string;
  copyableText?: string;
  copyLabel?: string;
  tip?: string;
}

interface PlatformGuide {
  id: PlatformId;
  name: string;
  brandColor: string;
  gradientBg: string;
  iconSvg: JSX.Element;
  devPortalUrl: string;
  summary: string;
  steps: GuideStep[];
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

function ExternalLinkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckMarkIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}>
      <path d="M18 6L6 18M6 6l12 12" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function LightbulbIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.55.6 2.9 1.5 3.9.76.76 1.23 1.52 1.41 2.5" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

const PLATFORM_GUIDES: Record<PlatformId, PlatformGuide> = {
  instagram: {
    id: "instagram",
    name: "Instagram Graph API",
    brandColor: "#E1306C",
    gradientBg: "linear-gradient(135deg, rgba(225,48,108,0.2) 0%, rgba(131,58,180,0.15) 50%, rgba(252,176,69,0.1) 100%)",
    iconSvg: <InstagramIcon />,
    devPortalUrl: "https://developers.facebook.com/apps/",
    summary: "Connect your Instagram Business or Creator account to extract Reels, auto-fetch metrics, and publish automated pet content.",
    steps: [
      {
        title: "Facebook Developers Portal",
        subtitle: "Create or Select a Meta Developer App",
        detail: "Sign in to Meta for Developers with your Facebook Account and click 'Create App'. Select 'Business' or 'Other' as your app type.",
        linkText: "Meta Developer Console",
        linkUrl: "https://developers.facebook.com/apps/",
        tip: "Ensure your Instagram profile is converted to a Business or Creator account linked to a Facebook Page.",
      },
      {
        title: "Add Instagram Graph API",
        subtitle: "Configure App Products & Permissions",
        detail: "From your app dashboard under 'Add Products to Your App', select 'Instagram Graph API' and click Set Up.",
        linkText: "Instagram Graph Docs",
        linkUrl: "https://developers.facebook.com/docs/instagram-api/",
      },
      {
        title: "Copy App Credentials",
        subtitle: "Retrieve your App ID & App Secret",
        detail: "Go to App Settings ➔ Basic. Locate your App ID and click 'Show' to copy your App Secret into the field.",
        tip: "Keep your App Secret strictly confidential. Cross Postr encrypts client tokens locally using AES-256.",
      },
      {
        title: "Generate Access Token & Scopes",
        subtitle: "Obtain Long-Lived User Access Token",
        detail: "In Meta Graph API Explorer, select your App and request the required permissions below. Generate a 60-day long-lived access token.",
        copyableText: "instagram_basic, instagram_content_publish, instagram_manage_insights, pages_show_list",
        copyLabel: "Copy Required OAuth Scopes",
        tip: "Use Cross Postr Demo Mode anytime to test reel processing instantly without live API keys!",
      },
    ],
  },
  pinterest: {
    id: "pinterest",
    name: "Pinterest API v5",
    brandColor: "#E60023",
    gradientBg: "linear-gradient(135deg, rgba(230,0,35,0.22) 0%, rgba(189,8,28,0.12) 100%)",
    iconSvg: <PinterestIcon />,
    devPortalUrl: "https://developers.pinterest.com/",
    summary: "Automate pet pin creation, fetch trending pet boards, and sync visual pet assets effortlessly.",
    steps: [
      {
        title: "Pinterest Developer Portal",
        subtitle: "Log in with your Pinterest Business Account",
        detail: "Access developers.pinterest.com and click 'My Apps' to register your application.",
        linkText: "Pinterest Dev Portal",
        linkUrl: "https://developers.pinterest.com/apps/",
        tip: "If you have a personal account, convert it for free to a Pinterest Business Account first.",
      },
      {
        title: "Create App & Define OAuth Scopes",
        subtitle: "Select Board & Pin Permissions",
        detail: "Name your app 'Cross Postr Suite'. Under OAuth Scopes, check Read and Write permissions for Boards & Pins.",
        copyableText: "boards:read, boards:write, pins:read, pins:write, user_accounts:read",
        copyLabel: "Copy Pinterest Scopes",
      },
      {
        title: "Generate Access Token",
        subtitle: "Copy OAuth 2.0 Bearer Token",
        detail: "Under App Credentials ➔ Access Token, click 'Generate Token'. Copy the full string beginning with 'pina_'.",
        copyableText: "pina_live_token_sample",
        copyLabel: "Sample Token Format",
        tip: "Trial tokens last 30 days. For production, request App Review in the Pinterest portal.",
      },
    ],
  },
  twitter: {
    id: "twitter",
    name: "X (Twitter) API v2",
    brandColor: "#1DA1F2",
    gradientBg: "linear-gradient(135deg, rgba(29,161,242,0.2) 0%, rgba(0,0,0,0.3) 100%)",
    iconSvg: <XIcon />,
    devPortalUrl: "https://developer.twitter.com/en/portal/dashboard",
    summary: "Auto-tweet viral pet clips, thread creation, and automated engagement with your pet audience.",
    steps: [
      {
        title: "X Developer Portal",
        subtitle: "Create a Developer Project",
        detail: "Log into developer.twitter.com and navigate to the Developer Portal Dashboard. Create a new Project under 'Free' or 'Basic' access.",
        linkText: "X Developer Portal",
        linkUrl: "https://developer.twitter.com/en/portal/dashboard",
        tip: "The Free tier supports posting tweets and reading user profiles perfectly.",
      },
      {
        title: "Configure App Permissions",
        subtitle: "Enable Read and Write Access",
        detail: "In App Settings ➔ User authentication settings, enable OAuth 2.0 and select 'Read and Write' under permissions.",
      },
      {
        title: "Generate Bearer Token",
        subtitle: "Copy OAuth 2.0 Bearer Key",
        detail: "Under 'Keys and Tokens', scroll to 'Bearer Token' and click 'Generate'. Copy the token string immediately.",
        copyableText: "AAAAAAAAAAAAAAAAAAAAA...",
        copyLabel: "Copy Token Pattern",
        tip: "Bearer Tokens do not expire unless revoked manually in the portal.",
      },
    ],
  },
  youtube: {
    id: "youtube",
    name: "YouTube Shorts Data API",
    brandColor: "#FF0000",
    gradientBg: "linear-gradient(135deg, rgba(255,0,0,0.22) 0%, rgba(150,0,0,0.12) 100%)",
    iconSvg: <YouTubeIcon />,
    devPortalUrl: "https://console.cloud.google.com/",
    summary: "Search trending pet Shorts, analyze view analytics, and publish automated pet video content.",
    steps: [
      {
        title: "Google Cloud Console",
        subtitle: "Create a Project in GCP",
        detail: "Visit console.cloud.google.com, select or create a new project named 'Cross Postr Suite'.",
        linkText: "Google Cloud Console",
        linkUrl: "https://console.cloud.google.com/apis/dashboard",
      },
      {
        title: "Enable YouTube Data API v3",
        subtitle: "Add API to API Library",
        detail: "Go to 'APIs & Services' ➔ 'Library'. Search for 'YouTube Data API v3' and click 'Enable'.",
        linkText: "YouTube API Library",
        linkUrl: "https://console.cloud.google.com/apis/library/youtube.googleapis.com",
      },
      {
        title: "Create API Key Credentials",
        subtitle: "Generate and Restrict API Key",
        detail: "Go to Credentials ➔ '+ Create Credentials' ➔ 'API key'. Copy the generated key. Optionally restrict key usage to YouTube Data API v3.",
        copyableText: "AIzaSy...",
        copyLabel: "Copy API Key Prefix",
        tip: "Free quota permits 10,000 units/day, ample for hundreds of pet Shorts extractions daily.",
      },
    ],
  },
};

export default function SetupGuideModal({
  platform,
  onClose,
  onSelectPlatform,
  onAutoFillDemoKey,
}: SetupGuideModalProps) {
  const activePlatformId: PlatformId = platform || "instagram";
  const guide = PLATFORM_GUIDES[activePlatformId];

  const [platformSteps, setPlatformSteps] = useState<Record<PlatformId, number>>({
    instagram: 0,
    pinterest: 0,
    twitter: 0,
    youtube: 0,
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!platform) return null;

  const activeStepIndex = platformSteps[activePlatformId] || 0;
  const currentStep = guide.steps[activeStepIndex] || guide.steps[0];
  const isFirstStep = activeStepIndex === 0;
  const isLastStep = activeStepIndex === guide.steps.length - 1;

  const setActiveStepIndex = (stepVal: number | ((prev: number) => number)) => {
    setPlatformSteps((prevMap) => {
      const current = prevMap[activePlatformId] || 0;
      const nextVal = typeof stepVal === "function" ? stepVal(current) : stepVal;
      return { ...prevMap, [activePlatformId]: nextVal };
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSwitchPlatform = (pId: PlatformId) => {
    if (onSelectPlatform) {
      onSelectPlatform(pId);
    }
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 150,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px",
          background: "rgba(3, 7, 12, 0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Backdrop Dismiss Click */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "absolute", inset: 0 }}
        />

        {/* Modal Container with Fixed Uniform Height */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "relative",
            zIndex: 160,
            maxWidth: "640px",
            width: "100%",
            height: "560px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            background: "#0D1620",
            border: `1.5px solid ${guide.brandColor}55`,
            borderRadius: "22px",
            boxShadow: `0 30px 80px rgba(0,0,0,0.85), 0 0 40px ${guide.brandColor}22`,
            overflow: "hidden",
            color: "#F1EEE7",
          }}
        >
          {/* Top Platform Switcher Header */}
          <div
            style={{
              background: guide.gradientBg,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              padding: "18px 24px 14px 24px",
            }}
          >
            {/* Header Title & Close */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: guide.brandColor,
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 14px ${guide.brandColor}66`,
                  }}
                >
                  {guide.iconSvg}
                </span>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "0.01em" }}>
                    {guide.name} API Setup Guide
                  </h2>
                </div>
              </div>

              <motion.button
                type="button"
                whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                title="Close Guide (Esc)"
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "50%",
                  width: "32px",
                  minWidth: "32px",
                  maxWidth: "32px",
                  height: "32px",
                  minHeight: "32px",
                  maxHeight: "32px",
                  aspectRatio: "1 / 1",
                  flexShrink: 0,
                  padding: 0,
                  color: "#FFFFFF",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  transition: "all 0.15s ease",
                }}
              >
                <CloseIcon />
              </motion.button>
            </div>

            {/* Platform Selection Tabs (Logo Only - Max Distant Space-Between Layout) */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "8px 36px", background: "rgba(0,0,0,0.35)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)" }}>
              {(["instagram", "pinterest", "twitter", "youtube"] as PlatformId[]).map((pKey) => {
                const item = PLATFORM_GUIDES[pKey];
                const isActive = pKey === activePlatformId;
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => handleSwitchPlatform(pKey)}
                    title={item.name}
                    aria-label={item.name}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "8px",
                      border: "none",
                      background: isActive ? item.brandColor : "transparent",
                      color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s ease",
                      boxShadow: isActive ? `0 2px 10px ${item.brandColor}55` : "none",
                    }}
                  >
                    <span style={{ display: "flex", opacity: isActive ? 1 : 0.7 }}>{item.iconSvg}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div style={{ padding: "16px 24px 0 24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "0.76rem", fontWeight: 700, color: guide.brandColor }}>
                STEP {activeStepIndex + 1} OF {guide.steps.length}
              </span>
              <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", fontWeight: 600 }}>
                {Math.round(((activeStepIndex + 1) / guide.steps.length) * 100)}% Complete
              </span>
            </div>

            {/* Stepper Pill Chips */}
            <div style={{ display: "flex", gap: "8px" }}>
              {guide.steps.map((st, idx) => {
                const isCurrent = idx === activeStepIndex;
                const isPassed = idx < activeStepIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveStepIndex(idx)}
                    style={{
                      flex: 1,
                      height: "7px",
                      borderRadius: "4px",
                      border: "none",
                      background: isCurrent
                        ? guide.brandColor
                        : isPassed
                        ? "rgba(104, 183, 122, 0.7)"
                        : "rgba(255,255,255,0.1)",
                      cursor: "pointer",
                      transition: "all 0.25s ease",
                      boxShadow: isCurrent ? `0 0 10px ${guide.brandColor}` : "none",
                    }}
                    title={`Step ${idx + 1}: ${st.title}`}
                  />
                );
              })}
            </div>
          </div>

          {/* Active Step Content Card (Fixed Flex Height) */}
          <div style={{ flex: 1, padding: "20px 24px", overflowY: "auto" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activePlatformId}-${activeStepIndex}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step Headline & Subtitle */}
                <div style={{ marginBottom: "12px" }}>
                  <h3 style={{ margin: "0 0 4px 0", fontSize: "1.05rem", fontWeight: 800, color: "#FFFFFF" }}>
                    {currentStep.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.84rem", color: "#68B77A", fontWeight: 700 }}>
                    {currentStep.subtitle}
                  </p>
                </div>

                {/* Detailed Instruction Text */}
                <p style={{ fontSize: "0.86rem", lineHeight: 1.6, color: "rgba(241, 238, 231, 0.85)", margin: "0 0 16px 0" }}>
                  {currentStep.detail}
                </p>

                {/* Action Button Link (if available) */}
                {currentStep.linkUrl && (
                  <div style={{ marginBottom: "14px" }}>
                    <a
                      href={currentStep.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        background: "rgba(255, 255, 255, 0.07)",
                        border: "1px solid rgba(255, 255, 255, 0.15)",
                        color: "#FFFFFF",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <span>{currentStep.linkText || "Open External Portal"}</span>
                      <ExternalLinkIcon />
                    </a>
                  </div>
                )}

                {/* Copyable Code Snippet / Scopes */}
                {currentStep.copyableText && (
                  <div style={{ marginBottom: "14px" }}>
                    <div
                      style={{
                        background: "rgba(0, 0, 0, 0.45)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "10px",
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <code style={{ fontSize: "0.78rem", color: "#68B77A", fontFamily: "monospace", overflowX: "auto" }}>
                        {currentStep.copyableText}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopy(currentStep.copyableText!)}
                        style={{
                          padding: "5px 10px",
                          borderRadius: "6px",
                          border: "none",
                          background: copiedKey === currentStep.copyableText ? "#10B981" : "rgba(255,255,255,0.12)",
                          color: "#FFF",
                          fontSize: "0.74rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          whiteSpace: "nowrap",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {copiedKey === currentStep.copyableText ? (
                          <><CheckMarkIcon /> Copied!</>
                        ) : (
                          <><CopyIcon /> {currentStep.copyLabel || "Copy"}</>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Pro Tip Callout Box */}
                {currentStep.tip && (
                  <div
                    style={{
                      background: "rgba(104, 183, 122, 0.1)",
                      border: "1px solid rgba(104, 183, 122, 0.25)",
                      borderRadius: "10px",
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                      fontSize: "0.8rem",
                      color: "#9FE0B0",
                      lineHeight: 1.45,
                    }}
                  >
                    <span style={{ color: "#68B77A", display: "flex", marginTop: "2px" }}>
                      <LightbulbIcon />
                    </span>
                    <span>{currentStep.tip}</span>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation Stepper Controls */}
          <div
            style={{
              padding: "16px 24px",
              background: "rgba(0, 0, 0, 0.25)",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              marginTop: "auto",
              flexShrink: 0,
            }}
          >

            {/* Stepper Buttons (Icons Only for Back / Next) */}
            <div style={{ display: "flex", gap: "8px" }}>
              {!isFirstStep && (
                <button
                  type="button"
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  title="Previous Step"
                  aria-label="Previous Step"
                  style={{
                    width: "36px",
                    height: "36px",
                    padding: 0,
                    borderRadius: "9px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    background: "transparent",
                    color: "rgba(255, 255, 255, 0.85)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronLeftIcon />
                </button>
              )}

              {isLastStep ? (
                <button
                  type="button"
                  onClick={onClose}
                  title="Done & Close Guide"
                  aria-label="Done & Close Guide"
                  style={{
                    width: "36px",
                    height: "36px",
                    padding: 0,
                    borderRadius: "9px",
                    border: "none",
                    background: guide.brandColor,
                    color: "#FFFFFF",
                    cursor: "pointer",
                    boxShadow: `0 4px 14px ${guide.brandColor}55`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CheckMarkIcon />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveStepIndex((prev) => Math.min(guide.steps.length - 1, prev + 1))}
                  title="Next Step"
                  aria-label="Next Step"
                  style={{
                    width: "36px",
                    height: "36px",
                    padding: 0,
                    borderRadius: "9px",
                    border: "none",
                    background: guide.brandColor,
                    color: "#FFFFFF",
                    cursor: "pointer",
                    boxShadow: `0 4px 14px ${guide.brandColor}44`,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ChevronRightIcon />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
