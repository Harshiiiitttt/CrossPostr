import React, { useEffect } from "react";

export type ToastType = "success" | "markdown" | "html" | "word" | "pdf";

interface ToastProps {
  message: string;
  onClose: () => void;
  type?: ToastType;
  duration?: number;
}

const TOAST_COLOR_MAP: Record<ToastType, { color: string; bg: string; border: string; shadow: string }> = {
  success: { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0", shadow: "rgba(16, 185, 129, 0.15)" },
  markdown: { color: "#0284C7", bg: "#F0F9FF", border: "#BAE6FD", shadow: "rgba(2, 132, 199, 0.15)" },
  html: { color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC", shadow: "rgba(8, 145, 178, 0.15)" },
  word: { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", shadow: "rgba(37, 99, 235, 0.15)" },
  pdf: { color: "#DC2626", bg: "#FEF2F2", border: "#FCA5A5", shadow: "rgba(220, 38, 38, 0.15)" },
};

export default function Toast({ message, onClose, type = "success", duration = 2500 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styleTheme = TOAST_COLOR_MAP[type] || TOAST_COLOR_MAP.success;

  return (
    <div className="toast-container" role="alert">
      <div
        className="toast-card"
        style={{
          border: `1.5px solid ${styleTheme.border}`,
          boxShadow: `0 12px 32px rgba(15, 23, 42, 0.1), 0 0 20px ${styleTheme.shadow}`,
        }}
      >
        <span
          className="toast-icon"
          aria-hidden="true"
          style={{ background: styleTheme.bg, borderColor: styleTheme.border }}
        >
          <svg
            className="toast-checkmark-svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={styleTheme.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" className="toast-checkmark-path" />
          </svg>
        </span>
        <span className="toast-message" style={{ color: "#0F172A", fontWeight: 600 }}>{message}</span>
        <span className="toast-paw-burst" aria-hidden="true">🐾</span>
      </div>
    </div>
  );
}
