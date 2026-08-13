import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type PlatformTab = "instagram" | "pinterest" | "twitter" | "youtube";

interface MultiPlatformPostVisualizerProps {
  mediaUrl?: string | null;
  videoUrl?: string | null;
  caption?: string;
  hashtags?: string[];
  watermarkText?: string;
  watermarkPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  authorName?: string;
  authorHandle?: string;
  avatarUrl?: string;
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function PinterestIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#1DA1F2">
      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.79-4-4-4-.495 0-.965.084-1.4.238C14.55 2.475 13.18 1.6 11.6 1.6c-1.58 0-2.95.875-3.6 2.148-.435-.154-.905-.238-1.4-.238-2.21 0-4 1.79-4 4 0 .495.084.965.238 1.4C1.475 9.55.6 10.92.6 12.5c0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.79 4 4 4 .495 0 .965-.084 1.4-.238 1.05 1.273 2.42 2.148 4 2.148 1.58 0 2.95-.875 3.6-2.148.435.154.905.238 1.4.238 2.21 0 4-1.79 4-4 0-.495-.084-.965-.238-1.4 1.273-1.05 2.148-2.42 2.148-4zm-12.4 4.1l-3.7-3.7 1.4-1.4 2.3 2.3 5.3-5.3 1.4 1.4-6.7 6.7z"/>
    </svg>
  );
}

export default function MultiPlatformPostVisualizer({
  mediaUrl,
  videoUrl,
  caption = "Check out this amazing reel! 🐾 Auto-published via Cross Postr #crosspostr #viral #content",
  hashtags = ["#crosspostr", "#viral", "#trending", "#contentcreator"],
  watermarkText = "Cross Postr",
  watermarkPosition = "bottom-right",
  authorName = "Cross Postr Studio",
  authorHandle = "crosspostr_official",
  avatarUrl = "/sidebar-dog-transparent.png",
}: MultiPlatformPostVisualizerProps) {
  const [activePlatform, setActivePlatform] = useState<PlatformTab>("instagram");

  const displayMedia = mediaUrl || videoUrl || "/preview-placeholder.jpg";
  const formattedHashtags = hashtags.join(" ");

  const watermarkPosStyle: Record<string, React.CSSProperties> = {
    "top-left": { top: "12px", left: "12px" },
    "top-right": { top: "12px", right: "12px" },
    "bottom-left": { bottom: "12px", left: "12px" },
    "bottom-right": { bottom: "12px", right: "12px" },
  };

  return (
    <div
      style={{
        width: "100%",
        background: "rgba(13, 22, 32, 0.75)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        padding: "24px",
        color: "#F1EEE7",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header & Tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📱</span> Live Multi-Platform Post Visualizer
          </h3>
          <span style={{ fontSize: "0.76rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Real-time preview across Instagram, Pinterest, X, and YouTube Shorts
          </span>
        </div>

        {/* Platform Selection Tabs */}
        <div style={{ display: "flex", gap: "4px", background: "rgba(0,0,0,0.35)", padding: "4px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { id: "instagram", label: "Instagram", icon: <InstagramIcon />, color: "#E1306C" },
            { id: "pinterest", label: "Pinterest", icon: <PinterestIcon />, color: "#E60023" },
            { id: "twitter", label: "X", icon: <XIcon />, color: "#1DA1F2" },
            { id: "youtube", label: "YouTube", icon: <YouTubeIcon />, color: "#FF0000" },
          ].map((t) => {
            const isActive = activePlatform === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActivePlatform(t.id as PlatformTab)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "8px",
                  border: "none",
                  background: isActive ? t.color : "transparent",
                  color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? 800 : 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "all 0.2s ease",
                  boxShadow: isActive ? `0 2px 10px ${t.color}55` : "none",
                }}
              >
                <span style={{ display: "flex", opacity: isActive ? 1 : 0.7 }}>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Visualizer Frame */}
      <div style={{ display: "flex", justifyContent: "center", minHeight: "440px" }}>
        <AnimatePresence mode="wait">
          
          {/* Instagram Post Mockup */}
          {activePlatform === "instagram" && (
            <motion.div
              key="instagram"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                maxWidth: "360px",
                width: "100%",
                background: "#000000",
                border: "1.5px solid rgba(225, 48, 108, 0.4)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(225, 48, 108, 0.2)",
              }}
            >
              {/* Instagram Card Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", padding: "2px" }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#111", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={avatarUrl} alt={authorName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#FFF", display: "block" }}>{authorHandle}</span>
                    <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.5)" }}>Original Audio</span>
                  </div>
                </div>
                <span style={{ color: "#E1306C", fontSize: "0.74rem", fontWeight: 800, background: "rgba(225, 48, 108, 0.15)", padding: "2px 8px", borderRadius: "10px" }}>REEL</span>
              </div>

              {/* Media Preview Box */}
              <div style={{ position: "relative", width: "100%", height: "260px", background: "#111823", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {videoUrl ? (
                  <video src={videoUrl} autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)" }}>
                    <span style={{ fontSize: "2rem" }}>🎬</span>
                    <span style={{ fontSize: "0.78rem" }}>Reel Media Preview</span>
                  </div>
                )}
                {/* Watermark Overlay Badge */}
                {watermarkText && (
                  <div
                    style={{
                      position: "absolute",
                      ...watermarkPosStyle[watermarkPosition],
                      background: "rgba(0, 0, 0, 0.65)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#68B77A",
                    }}
                  >
                    🐾 {watermarkText}
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", color: "#FFF" }}>
                  <div style={{ display: "flex", gap: "14px" }}>
                    <span style={{ color: "#E1306C", cursor: "pointer" }}><HeartIcon /></span>
                    <span style={{ cursor: "pointer" }}><CommentIcon /></span>
                    <span style={{ cursor: "pointer" }}><ShareIcon /></span>
                  </div>
                  <span style={{ cursor: "pointer" }}><BookmarkIcon /></span>
                </div>
                <div style={{ fontSize: "0.76rem", fontWeight: 800, color: "#FFF", marginBottom: "4px" }}>1,420 Likes</div>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.85)", margin: 0, lineHeight: 1.45 }}>
                  <strong>{authorHandle}</strong> {caption} <span style={{ color: "#E1306C" }}>{formattedHashtags}</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Pinterest Pin Mockup */}
          {activePlatform === "pinterest" && (
            <motion.div
              key="pinterest"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                maxWidth: "340px",
                width: "100%",
                background: "#121212",
                border: "1.5px solid rgba(230, 0, 35, 0.4)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(230, 0, 35, 0.2)",
              }}
            >
              {/* Media Preview Box */}
              <div style={{ position: "relative", width: "100%", height: "280px", background: "#1C1C1C", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {videoUrl ? (
                  <video src={videoUrl} autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)" }}>
                    <span style={{ fontSize: "2rem" }}>📌</span>
                    <span style={{ fontSize: "0.78rem" }}>Pinterest Video Pin</span>
                  </div>
                )}
                {/* Save Badge */}
                <button
                  type="button"
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    background: "#E60023",
                    color: "#FFF",
                    border: "none",
                    borderRadius: "20px",
                    padding: "6px 14px",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                  }}
                >
                  Save Pin
                </button>
                {/* Watermark Overlay */}
                {watermarkText && (
                  <div
                    style={{
                      position: "absolute",
                      ...watermarkPosStyle[watermarkPosition],
                      background: "rgba(0, 0, 0, 0.65)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.7rem",
                      fontWeight: 800,
                      color: "#68B77A",
                    }}
                  >
                    🐾 {watermarkText}
                  </div>
                )}
              </div>

              {/* Pin Details */}
              <div style={{ padding: "16px" }}>
                <h4 style={{ margin: "0 0 6px 0", fontSize: "0.92rem", fontWeight: 800, color: "#FFF" }}>
                  {authorName} • Viral Pet Clip
                </h4>
                <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.7)", margin: "0 0 12px 0", lineHeight: 1.45 }}>
                  {caption.substring(0, 80)}...
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <img src={avatarUrl} alt={authorName} style={{ width: "24px", height: "24px", borderRadius: "50%" }} />
                  <span style={{ fontSize: "0.75rem", color: "#E60023", fontWeight: 700 }}>crosspostr.app</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Twitter (X) Tweet Mockup */}
          {activePlatform === "twitter" && (
            <motion.div
              key="twitter"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                maxWidth: "380px",
                width: "100%",
                background: "#000000",
                border: "1.5px solid rgba(29, 161, 242, 0.4)",
                borderRadius: "20px",
                padding: "16px",
                boxShadow: "0 20px 50px rgba(29, 161, 242, 0.2)",
              }}
            >
              {/* User Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <img src={avatarUrl} alt={authorName} style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontSize: "0.86rem", fontWeight: 800, color: "#FFF" }}>{authorName}</span>
                    <VerifiedBadge />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}>@{authorHandle}</span>
                </div>
              </div>

              {/* Tweet Body */}
              <p style={{ fontSize: "0.82rem", color: "#FFF", lineHeight: 1.45, margin: "0 0 12px 0" }}>
                {caption} <span style={{ color: "#1DA1F2" }}>{formattedHashtags}</span>
              </p>

              {/* Tweet Video Embed Box */}
              <div style={{ position: "relative", width: "100%", height: "200px", background: "#15202B", borderRadius: "14px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                {videoUrl ? (
                  <video src={videoUrl} autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", color: "rgba(255,255,255,0.4)" }}>
                    <span style={{ fontSize: "1.8rem" }}>🐦</span>
                    <span style={{ fontSize: "0.76rem" }}>X Media Tweet</span>
                  </div>
                )}
                {watermarkText && (
                  <div
                    style={{
                      position: "absolute",
                      ...watermarkPosStyle[watermarkPosition],
                      background: "rgba(0, 0, 0, 0.65)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      color: "#68B77A",
                    }}
                  >
                    🐾 {watermarkText}
                  </div>
                )}
              </div>

              {/* Tweet Stats Bar */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.74rem", color: "rgba(255,255,255,0.5)", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "10px" }}>
                <span>💬 48</span>
                <span>🔄 124</span>
                <span style={{ color: "#E1306C" }}>❤️ 890</span>
                <span>📊 12.4K</span>
              </div>
            </motion.div>
          )}

          {/* YouTube Shorts Player Mockup */}
          {activePlatform === "youtube" && (
            <motion.div
              key="youtube"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              style={{
                maxWidth: "320px",
                width: "100%",
                height: "440px",
                background: "#000000",
                border: "1.5px solid rgba(255, 0, 0, 0.4)",
                borderRadius: "24px",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(255, 0, 0, 0.25)",
              }}
            >
              {/* Shorts Video Player */}
              <div style={{ width: "100%", height: "100%", background: "#181818", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {videoUrl ? (
                  <video src={videoUrl} autoPlay loop muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)" }}>
                    <span style={{ fontSize: "2.2rem" }}>🔴</span>
                    <span style={{ fontSize: "0.78rem" }}>YouTube Shorts Player</span>
                  </div>
                )}
              </div>

              {/* Watermark Badge */}
              {watermarkText && (
                <div
                  style={{
                    position: "absolute",
                    ...watermarkPosStyle[watermarkPosition],
                    background: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    padding: "4px 10px",
                    borderRadius: "12px",
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    color: "#68B77A",
                  }}
                >
                  🐾 {watermarkText}
                </div>
              )}

              {/* Shorts Right Action Bar */}
              <div style={{ position: "absolute", right: "12px", bottom: "80px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", color: "#FFF", fontSize: "0.72rem", fontWeight: 700 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem" }}>👍</span>
                  <span>4.8K</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem" }}>💬</span>
                  <span>312</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <span style={{ fontSize: "1.2rem" }}>➡️</span>
                  <span>Share</span>
                </div>
              </div>

              {/* Shorts Footer Author Overlay */}
              <div style={{ position: "absolute", bottom: "16px", left: "12px", right: "60px", color: "#FFF" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <img src={avatarUrl} alt={authorName} style={{ width: "28px", height: "28px", borderRadius: "50%" }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 800 }}>@{authorHandle}</span>
                  <button type="button" style={{ background: "#FF0000", color: "#FFF", border: "none", borderRadius: "14px", padding: "3px 10px", fontSize: "0.68rem", fontWeight: 800 }}>
                    Subscribe
                  </button>
                </div>
                <p style={{ fontSize: "0.74rem", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {caption}
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
