import React, { useState } from "react";
import type { LinkedInPosts } from "@/lib/types";

interface LinkedInFeedPreviewProps {
  posts: LinkedInPosts;
  activeTab: keyof LinkedInPosts;
  onCopyActive: () => void;
  onCopyAll: () => void;
  copied: boolean;
  allCopied: boolean;
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}

export default function LinkedInFeedPreview({
  posts,
  activeTab,
  onCopyActive,
  onCopyAll,
  copied,
  allCopied,
}: LinkedInFeedPreviewProps) {
  const [platform, setPlatform] = useState<"linkedin" | "instagram" | "twitter">("linkedin");
  const [isExpanded, setIsExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(48);

  const rawPostText = posts[activeTab] || "";

  const handleLikeToggle = () => {
    if (liked) {
      setLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  // Format hashtags and emojis in text
  const renderFormattedContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      // Highlight hashtags
      const parts = line.split(/(#\w+)/g);
      return (
        <React.Fragment key={idx}>
          {parts.map((part, pIdx) => {
            if (part.startsWith("#")) {
              return (
                <span key={pIdx} className="social-hashtag">
                  {part}
                </span>
              );
            }
            return part;
          })}
          {idx < lines.length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  const isLong = rawPostText.length > 280;
  const displayText =
    !isExpanded && isLong ? rawPostText.slice(0, 240) + "..." : rawPostText;

  return (
    <div className="social-feed-container">
      {/* Platform Preview Selector Bar */}
      <div className="social-platform-selector">
        <button
          type="button"
          className={`social-platform-btn ${platform === "linkedin" ? "active" : ""}`}
          onClick={() => setPlatform("linkedin")}
        >
          <span className="social-icon-btn">💼</span> LinkedIn
        </button>
        <button
          type="button"
          className={`social-platform-btn ${platform === "instagram" ? "active" : ""}`}
          onClick={() => setPlatform("instagram")}
        >
          <span className="social-icon-btn">📸</span> Instagram
        </button>
        <button
          type="button"
          className={`social-platform-btn ${platform === "twitter" ? "active" : ""}`}
          onClick={() => setPlatform("twitter")}
        >
          <span className="social-icon-btn">🐦</span> Twitter
        </button>
      </div>

      {/* Realistic Social Feed Card */}
      <div className={`social-card social-card--${platform}`}>
        {/* Card Header */}
        <div className="social-card-header">
          <div className="social-avatar-wrap">
            <div className="social-avatar">
              <span>🐾</span>
            </div>
          </div>
          <div className="social-author-info">
            <div className="social-author-name-row">
              <span className="social-author-name">CuddlyTails Pet Care</span>
              <span className="social-verified-badge" title="Verified Brand">✓</span>
              {platform === "linkedin" && <span className="social-degree">• 1st</span>}
            </div>
            <span className="social-author-bio">
              {platform === "linkedin"
                ? "Premium Canine Wellness & Pet Sitter Network"
                : "@cuddlytails • Official Account"}
            </span>
            <span className="social-post-time">
              2h • <span className="social-globe">🌐</span>
            </span>
          </div>
          <button type="button" className="social-follow-btn">
            + Follow
          </button>
        </div>

        {/* Card Body */}
        <div className="social-card-body">
          <p className="social-post-text">{renderFormattedContent(displayText)}</p>
          {isLong && !isExpanded && (
            <button
              type="button"
              className="social-see-more-btn"
              onClick={() => setIsExpanded(true)}
            >
              ...see more
            </button>
          )}
        </div>

        {/* Card Reactions & Counters */}
        <div className="social-reactions-bar">
          <div className="social-reaction-icons">
            <span className="social-react-badge social-react--like">👍</span>
            <span className="social-react-badge social-react--paw">🐾</span>
            <span className="social-react-badge social-react--heart">❤️</span>
            <span className="social-reaction-count">{likesCount}</span>
          </div>
          <div className="social-stats-counts">
            <span>14 comments</span>
            <span>•</span>
            <span>6 reposts</span>
          </div>
        </div>

        {/* Card Interactive Action Footer */}
        <div className="social-card-actions">
          <button
            type="button"
            className={`social-act-btn ${liked ? "social-act-btn--active" : ""}`}
            onClick={handleLikeToggle}
          >
            <span>{liked ? "❤️ Liked" : "👍 Like"}</span>
          </button>
          <button type="button" className="social-act-btn">
            <span>💬 Comment</span>
          </button>
          <button type="button" className="social-act-btn">
            <span>🔁 Repost</span>
          </button>
          <button type="button" className="social-act-btn">
            <span>🚀 Send</span>
          </button>
        </div>
      </div>

      {/* Copy Actions */}
      <div className="social-copy-bar">
        <button
          type="button"
          className={`p3-btn p3-btn--ghost ${copied ? "copied-pop" : ""}`}
          onClick={onCopyActive}
          style={{ flex: 1 }}
        >
          {copied ? "✓ Copied!" : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <CopyIcon /> Copy Post Text
            </span>
          )}
        </button>
        <button
          type="button"
          className={`p3-btn p3-btn--teal ${allCopied ? "copied-pop" : ""}`}
          onClick={onCopyAll}
          style={{ flex: 1 }}
        >
          {allCopied ? "✓ All 3 Copied!" : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <SparklesIcon /> Copy All 3 Variations
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
