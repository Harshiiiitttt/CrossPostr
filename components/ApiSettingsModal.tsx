import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ApiCredentials } from "./HeroApiPage";
import SetupGuideModal, { PlatformId } from "./SetupGuideModal";

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
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

export default function ApiSettingsModal({ isOpen, onClose, onSignOut }: ApiSettingsModalProps) {
  const [creds, setCreds] = useState<ApiCredentials>({
    instagramToken: "",
    pinterestToken: "",
    xApiKey: "",
    youtubeApiKey: "",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [guidePlatform, setGuidePlatform] = useState<PlatformId | null>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("cuddlytails_api_credentials");
      if (saved) {
        try {
          setCreds(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("cuddlytails_api_credentials", JSON.stringify(creds));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClearAndSignOut = () => {
    localStorage.removeItem("cuddlytails_api_credentials");
    localStorage.removeItem("cuddlytails_user_authenticated");
    onSignOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0, 0, 0, 0.75)", backdropFilter: "blur(8px)", padding: "20px" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          style={{ width: "100%", maxWidth: "520px", background: "#0F1A24", border: "1.5px solid var(--panel-border)", borderRadius: "18px", padding: "24px", color: "#F1EEE7", boxShadow: "0 20px 50px rgba(0,0,0,0.6)" }}
        >
          {/* Modal Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ color: "#68B77A", display: "flex" }}>
                <SettingsIcon />
              </span>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>API Credentials Settings</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{ border: "none", color: "#FFFFFF", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: "28px", minWidth: "28px", maxWidth: "28px", height: "28px", minHeight: "28px", maxHeight: "28px", aspectRatio: "1 / 1", flexShrink: 0, padding: 0, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" style={{ display: "block", flexShrink: 0 }}><path d="M18 6L6 18M6 6l12 12" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
            </button>
          </div>

          {/* Credentials Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "#E1306C", textTransform: "uppercase" }}>
                  Instagram Graph API Token
                </label>
                <button
                  type="button"
                  onClick={() => setGuidePlatform("instagram")}
                  style={{ background: "rgba(225, 48, 108, 0.15)", border: "none", borderRadius: "50%", width: "16px", height: "16px", color: "#E1306C", cursor: "pointer", fontSize: "0.7rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  title="Instagram Setup Guide"
                >
                  ?
                </button>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="password"
                  placeholder="ig_access_token_..."
                  value={creds.instagramToken || ""}
                  onChange={(e) => setCreds({ ...creds, instagramToken: e.target.value })}
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "8px 34px 8px 12px", color: "#FFF", fontSize: "0.8rem", outline: "none" }}
                />
                {creds.instagramToken && (
                  <button
                    type="button"
                    onClick={() => setCreds({ ...creds, instagramToken: "" })}
                    title="Clear Instagram API token"
                    style={{
                      position: "absolute",
                      right: "8px",
                      background: "rgba(255, 255, 255, 0.14)",
                      border: "none",
                      borderRadius: "50%",
                      width: "18px",
                      minWidth: "18px",
                      height: "18px",
                      minHeight: "18px",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "#E60023", textTransform: "uppercase" }}>
                  Pinterest API Token
                </label>
                <button
                  type="button"
                  onClick={() => setGuidePlatform("pinterest")}
                  style={{ background: "rgba(230, 0, 35, 0.15)", border: "none", borderRadius: "50%", width: "16px", height: "16px", color: "#E60023", cursor: "pointer", fontSize: "0.7rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  title="Pinterest Setup Guide"
                >
                  ?
                </button>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="password"
                  placeholder="pin_live_token_..."
                  value={creds.pinterestToken || ""}
                  onChange={(e) => setCreds({ ...creds, pinterestToken: e.target.value })}
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "8px 34px 8px 12px", color: "#FFF", fontSize: "0.8rem", outline: "none" }}
                />
                {creds.pinterestToken && (
                  <button
                    type="button"
                    onClick={() => setCreds({ ...creds, pinterestToken: "" })}
                    title="Clear Pinterest API token"
                    style={{
                      position: "absolute",
                      right: "8px",
                      background: "rgba(255, 255, 255, 0.14)",
                      border: "none",
                      borderRadius: "50%",
                      width: "18px",
                      minWidth: "18px",
                      height: "18px",
                      minHeight: "18px",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "#1DA1F2", textTransform: "uppercase" }}>
                  Twitter (X) Bearer Key
                </label>
                <button
                  type="button"
                  onClick={() => setGuidePlatform("twitter")}
                  style={{ background: "rgba(29, 161, 242, 0.15)", border: "none", borderRadius: "50%", width: "16px", height: "16px", color: "#1DA1F2", cursor: "pointer", fontSize: "0.7rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  title="Twitter Setup Guide"
                >
                  ?
                </button>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="password"
                  placeholder="twitter_bearer_token_..."
                  value={creds.xApiKey || ""}
                  onChange={(e) => setCreds({ ...creds, xApiKey: e.target.value })}
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "8px 34px 8px 12px", color: "#FFF", fontSize: "0.8rem", outline: "none" }}
                />
                {creds.xApiKey && (
                  <button
                    type="button"
                    onClick={() => setCreds({ ...creds, xApiKey: "" })}
                    title="Clear Twitter API key"
                    style={{
                      position: "absolute",
                      right: "8px",
                      background: "rgba(255, 255, 255, 0.14)",
                      border: "none",
                      borderRadius: "50%",
                      width: "18px",
                      minWidth: "18px",
                      height: "18px",
                      minHeight: "18px",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                <label style={{ fontSize: "0.76rem", fontWeight: 700, color: "#FF0000", textTransform: "uppercase" }}>
                  YouTube Shorts Data API Key
                </label>
                <button
                  type="button"
                  onClick={() => setGuidePlatform("youtube")}
                  style={{ background: "rgba(255, 0, 0, 0.15)", border: "none", borderRadius: "50%", width: "16px", height: "16px", color: "#FF0000", cursor: "pointer", fontSize: "0.7rem", fontWeight: 800, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  title="YouTube Setup Guide"
                >
                  ?
                </button>
              </div>
              <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                <input
                  type="password"
                  placeholder="yt_shorts_oauth_key_..."
                  value={creds.youtubeApiKey || ""}
                  onChange={(e) => setCreds({ ...creds, youtubeApiKey: e.target.value })}
                  style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "8px 34px 8px 12px", color: "#FFF", fontSize: "0.8rem", outline: "none" }}
                />
                {creds.youtubeApiKey && (
                  <button
                    type="button"
                    onClick={() => setCreds({ ...creds, youtubeApiKey: "" })}
                    title="Clear YouTube API key"
                    style={{
                      position: "absolute",
                      right: "8px",
                      background: "rgba(255, 255, 255, 0.14)",
                      border: "none",
                      borderRadius: "50%",
                      width: "18px",
                      minWidth: "18px",
                      height: "18px",
                      minHeight: "18px",
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      lineHeight: 1,
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Action Footer Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button
              type="button"
              onClick={handleClearAndSignOut}
              style={{
                padding: "8px 14px",
                borderRadius: "8px",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                background: "rgba(239, 68, 68, 0.12)",
                color: "#EF4444",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.15s ease",
              }}
            >
              <LogOutIcon /> Sign Out APIs
            </button>

            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--panel-border)",
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  border: "none",
                  background: savedSuccess ? "#10B981" : "#68B77A",
                  color: "#FFFFFF",
                  fontSize: "0.78rem",
                  fontWeight: 800,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 12px rgba(104, 183, 122, 0.3)",
                }}
              >
                {savedSuccess ? <><CheckIcon /> Saved!</> : "Save Changes"}
              </button>
            </div>
          </div>
        </motion.div>

        <SetupGuideModal
          platform={guidePlatform}
          onClose={() => setGuidePlatform(null)}
          onSelectPlatform={(p) => setGuidePlatform(p)}
        />
      </div>
    </AnimatePresence>
  );
}

