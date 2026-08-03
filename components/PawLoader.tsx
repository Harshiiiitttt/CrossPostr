import React from "react";

interface PawLoaderProps {
  label?: string;
  sublabel?: string;
}

export default function PawLoader({
  label = "Generating content with AI...",
  sublabel = "This will take just a few seconds",
}: PawLoaderProps) {
  return (
    <div className="paw-loader-wrapper">
      <div className="paw-loader-ring">
        <div className="paw-loader-icon">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#68B77A" aria-hidden="true">
            <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
            <ellipse cx="5.2" cy="8.8" rx="2.1" ry="2.7" />
            <ellipse cx="10.1" cy="5.4" rx="2" ry="2.6" />
            <ellipse cx="14.7" cy="5.4" rx="2" ry="2.6" />
            <ellipse cx="19" cy="8.8" rx="2.1" ry="2.7" />
          </svg>
        </div>
      </div>
      <div className="paw-loader-text">
        <p className="paw-loader-label">{label}</p>
        {sublabel && <p className="paw-loader-sublabel">{sublabel}</p>}
      </div>
    </div>
  );
}
