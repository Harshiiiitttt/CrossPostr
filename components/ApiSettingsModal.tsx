import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ApiCredentials } from "./HeroApiPage";
import SetupGuideModal, { PlatformId } from "./SetupGuideModal";
import ContactModal from "./ContactModal";



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

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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

function MailHeaderIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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
  const [isContactOpen, setIsContactOpen] = useState(false);

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


  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(12px)", padding: "20px" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{ width: "100%", maxWidth: "520px", background: "var(--panel)", border: "1.5px solid var(--panel-border)", borderRadius: "18px", padding: "24px", color: "var(--heading-white)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)" }}
          >
            {/* Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "#68B77A", display: "flex" }}>
                  <SettingsIcon />
                </span>
                <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>API Credentials Settings</h2>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  onClick={() => setIsContactOpen(true)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#68B77A",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    opacity: 0.9,
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                  }}
                  title="Contact Me"
                >
                  <MailHeaderIcon />
                </button>

                <a
                  href="https://github.com/Harshiiiitttt/CrossPostr"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#0F172A",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px",
                    opacity: 0.9,
                    textDecoration: "none",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                  }}
                  title="GitHub Profile"
                >
                  <GitHubIcon />
                </a>
              </div>
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
                    style={{ width: "100%", height: "36px", lineHeight: "36px", margin: 0, boxSizing: "border-box", background: "var(--input-bg)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "0 34px 0 12px", color: "var(--heading-white)", fontSize: "0.8rem", outline: "none" }}
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
                    style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "8px 34px 8px 12px", color: "var(--heading-white)", fontSize: "0.8rem", outline: "none" }}
                  />
                  {creds.pinterestToken && (
                    <button
                      type="button"
                      onClick={() => setCreds({ ...creds, pinterestToken: "" })}
                      title="Clear Pinterest API token"
                      style={{
                        position: "absolute",
                        right: "8px",
                        background: "var(--chip-bg)",
                        border: "1px solid var(--panel-border)",
                        borderRadius: "50%",
                        width: "18px",
                        minWidth: "18px",
                        height: "18px",
                        minHeight: "18px",
                        color: "var(--secondary-text)",
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
                    style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "8px 34px 8px 12px", color: "var(--heading-white)", fontSize: "0.8rem", outline: "none" }}
                  />
                  {creds.xApiKey && (
                    <button
                      type="button"
                      onClick={() => setCreds({ ...creds, xApiKey: "" })}
                      title="Clear Twitter API key"
                      style={{
                        position: "absolute",
                        right: "8px",
                        background: "var(--chip-bg)",
                        border: "1px solid var(--panel-border)",
                        borderRadius: "50%",
                        width: "18px",
                        minWidth: "18px",
                        height: "18px",
                        minHeight: "18px",
                        color: "var(--secondary-text)",
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
                    style={{ width: "100%", background: "var(--input-bg)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "8px 34px 8px 12px", color: "var(--heading-white)", fontSize: "0.8rem", outline: "none" }}
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
                onClick={() => {
                  onSignOut();
                  onClose();
                }}
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
                title="Sign Out APIs"
              >
                <LogOutIcon /> <span className="modal-btn-label">Sign Out APIs</span>
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
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  title="Cancel"
                >
                  <CloseIcon /> <span className="modal-btn-label">Cancel</span>
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
                  title="Save Changes"
                >
                  <CheckIcon /> <span className="modal-btn-label">{savedSuccess ? "Saved!" : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </motion.div>

          <SetupGuideModal
            platform={guidePlatform}
            onClose={() => setGuidePlatform(null)}
            onSelectPlatform={(p) => setGuidePlatform(p)}
          />

          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
