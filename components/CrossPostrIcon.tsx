import React from "react";

interface CrossPostrIconProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function CrossPostrIcon({ size = 28, className = "", style }: CrossPostrIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crossPostrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <filter id="crossPostrShadow" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2.5" floodColor="#1E3A8A" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Rounded Blue Square Container */}
      <rect
        x="1.5"
        y="1.5"
        width="29"
        height="29"
        rx="8"
        fill="url(#crossPostrGrad)"
        stroke="rgba(255, 255, 255, 0.35)"
        strokeWidth="1"
        filter="url(#crossPostrShadow)"
      />

      {/* Subtle Top Glass Highlight */}
      <rect x="2.5" y="2.5" width="27" height="13" rx="6.5" fill="rgba(255, 255, 255, 0.18)" />

      {/* Intertwined Cross-Posting Arrows Vector */}
      {/* Top-Left to Bottom-Right Line & Arrow */}
      <path
        d="M8.5 10.5H12L19.5 21.5H23.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 18.5L23.5 21.5L20.5 24.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bottom-Left to Top-Right Line & Arrow (Intertwined Gap) */}
      <path
        d="M8.5 21.5H12L14.2 18.3"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3 13.7L19.5 10.5H23.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 7.5L23.5 10.5L20.5 13.5"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
