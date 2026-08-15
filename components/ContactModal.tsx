import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function MailIcon({ color = "#68B77A", size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

interface TooltipProps {
  content: string;
  position?: "top" | "bottom";
  align?: "left" | "center" | "right";
  children: React.ReactNode;
}

function Tooltip({ content, position = "bottom", align = "center", children }: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const isTop = position === "top";

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
              left: align === "left" ? "0px" : align === "right" ? "auto" : "50%",
              right: align === "right" ? "0px" : "auto",
              transform: align === "center" ? "translateX(-50%)" : undefined,
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
              zIndex: 9999,
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);
  const contactEmail = "harshitkudaliya99@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(5, 10, 16, 0.8)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "460px",
              background: "linear-gradient(145deg, rgba(20, 32, 45, 0.95) 0%, rgba(12, 20, 30, 0.98) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "20px",
              padding: "26px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(104, 183, 122, 0.15)",
              color: "#F1EEE7",
              zIndex: 10,
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ width: "36px", height: "36px", borderRadius: "12px", background: "rgba(104, 183, 122, 0.2)", border: "1px solid rgba(104, 183, 122, 0.4)", color: "#68B77A", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MailIcon />
                </span>
                <div>
                  <h2 style={{ fontSize: "1.2rem", fontWeight: 800, margin: 0, color: "#FFFFFF", fontFamily: "Slackey, cursive, sans-serif" }}>
                    Get in Touch
                  </h2>
                  <p style={{ fontSize: "0.78rem", margin: "2px 0 0 0", color: "var(--text-muted)" }}>
                    Feel free to reach out directly via email or GitHub.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
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
                  transition: "all 0.15s ease",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                }}
              >
                <CloseIcon />
              </button>
            </div>

            {/* Direct Email Card with ONLY Copy Button */}
            <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", overflow: "hidden" }}>
                <span style={{ color: "#68B77A", display: "flex" }}><MailIcon /></span>
                <div style={{ overflow: "hidden" }}>
                  <div style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", fontWeight: 700 }}>Direct Email</div>
                  <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contactEmail}</div>
                </div>
              </div>

              <Tooltip content={copied ? "Copied to clipboard!" : "Copy email address"}>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  style={{
                    background: copied ? "rgba(104, 183, 122, 0.25)" : "linear-gradient(135deg, #68B77A 0%, #4E985E 100%)",
                    border: copied ? "1px solid rgba(104, 183, 122, 0.5)" : "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#FFFFFF",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: copied ? "none" : "0 4px 14px rgba(104, 183, 122, 0.25)",
                    transition: "all 0.15s ease",
                    flexShrink: 0,
                  }}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </Tooltip>
            </div>

            {/* Footer with GitHub Link and Say Hello Button */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", paddingTop: "4px" }}>
              <Tooltip content="Open GitHub Profile in new tab">
                <a
                  href="https://github.com/Harshiiiitttt"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                    fontWeight: 700,
                    transition: "color 0.15s ease",
                  }}
                >
                  <GitHubIcon /> GitHub Profile
                </a>
              </Tooltip>

              <Tooltip content="Open Gmail Compose with pre-filled greeting">
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=Saying%20Hello!%20%F0%9F%91%8B&body=Hi%20Harshit,%0A%0A`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "rgba(104, 183, 122, 0.15)",
                    border: "1px solid rgba(104, 183, 122, 0.35)",
                    color: "#68B77A",
                    padding: "7px 15px",
                    borderRadius: "10px",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <SendIcon /> Say Hello
                </a>
              </Tooltip>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
