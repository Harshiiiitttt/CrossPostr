import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useBlogGeneration } from "@/lib/BlogGenerationContext";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "blogs" | "reviews";
}

// ── SVG Icon Helpers ─────────────────────────────────────────────────────────

function HistoryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LocationPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

function EmptyDocIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function computeSeoScore(blogItem: any): { score: number; grade: string; color: string } {
  if (!blogItem) return { score: 92, grade: "A", color: "#68B77A" };
  const blog = blogItem.blog || blogItem;
  const metaDescription = blogItem.metaDescription || blog.metaDescription || "";
  
  const parts: string[] = [blog.title || "", ...(blog.intro || [])];
  (blog.sections || []).forEach((sec: any) => {
    parts.push(sec.heading || "");
    if (sec.paragraphs) parts.push(...sec.paragraphs);
    if (sec.bullets) parts.push(...sec.bullets);
    if (sec.subtopics) {
      sec.subtopics.forEach((st: any) => {
        parts.push(st.subheading || "", ...(st.paragraphs || []));
      });
    }
  });
  parts.push(blog.vetCta || "", ...(blog.conclusion || []));
  (blog.faqs || []).forEach((faq: any) => parts.push(faq.question || "", faq.answer || ""));
  
  const fullText = parts.join(" ");
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

  // 1. Word Count Score (max 25)
  let wordScore = 0;
  if (wordCount >= 1200 && wordCount <= 2200) wordScore = 25;
  else if (wordCount >= 800) wordScore = 20;
  else if (wordCount >= 500) wordScore = 14;
  else wordScore = 8;

  // 2. Meta Description Precision (max 20)
  let metaScore = 0;
  const metaLen = metaDescription.trim().length;
  if (metaLen >= 150 && metaLen <= 160) metaScore = 20;
  else if (metaLen >= 140 && metaLen <= 165) metaScore = 17;
  else if (metaLen >= 100 && metaLen <= 180) metaScore = 12;
  else if (metaLen > 0) metaScore = 6;
  else metaScore = 14; // default baseline

  // 3. Keyword Density Balance (max 25)
  let kwScore = 20;
  const words = fullText.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
  const stopWords = new Set([
    "the", "and", "a", "to", "of", "in", "is", "for", "that", "you", "it", "on", "with",
    "your", "this", "can", "are", "be", "as", "or", "an", "have", "from", "at", "by"
  ]);
  const freqMap: Record<string, number> = {};
  words.forEach((w) => {
    if (w.length > 3 && !stopWords.has(w)) {
      freqMap[w] = (freqMap[w] || 0) + 1;
    }
  });
  const topCount = Object.values(freqMap).sort((a, b) => b - a)[0] || 0;
  const topDensity = (topCount / (words.length || 1)) * 100;
  if (topDensity >= 1.2 && topDensity <= 2.8) kwScore = 25;
  else if (topDensity >= 0.8 && topDensity <= 3.5) kwScore = 20;
  else kwScore = 14;

  // 4. Structure & FAQs Rich Snippets (max 30)
  let structScore = 0;
  const h2Count = (blog.sections || []).length;
  if (h2Count >= 4) structScore += 12;
  else if (h2Count >= 2) structScore += 8;

  if ((blog.faqs || []).length >= 5) structScore += 10;
  else if ((blog.faqs || []).length >= 3) structScore += 6;

  if ((blog.vetCta || "").toLowerCase().includes("cuddlytails") || (blog.vetCta || "").length > 20) structScore += 8;

  const total = Math.min(100, Math.max(45, wordScore + metaScore + kwScore + structScore));

  let grade = "A+";
  let color = "#059669"; // Emerald Teal
  if (total < 75) {
    grade = "B";
    color = "#D97706"; // Sunset Amber
  } else if (total < 88) {
    grade = "B+";
    color = "#2563EB"; // Ocean Blue
  } else if (total < 96) {
    grade = "A";
    color = "#059669"; // Emerald
  } else {
    grade = "A+";
    color = "#7C3AED"; // Royal Violet
  }

  return { score: total, grade, color };
}

function getPersonaStyle(personaName: string = ""): { bg: string; border: string; color: string } {
  const name = personaName.toLowerCase();
  if (name.includes("playful") || name.includes("caring")) {
    return { bg: "#F3E8FF", border: "#E9D5FF", color: "#7C3AED" };
  }
  if (name.includes("informative") || name.includes("vet") || name.includes("expert") || name.includes("clinical")) {
    return { bg: "#E0F2FE", border: "#BAE6FD", color: "#0284C7" };
  }
  if (name.includes("casual") || name.includes("friendly") || name.includes("warm")) {
    return { bg: "#FEF3C7", border: "#FDE68A", color: "#D97706" };
  }
  return { bg: "#ECFDF5", border: "#A7F3D0", color: "#059669" };
}

export default function HistoryDrawer({ isOpen, onClose, initialMode = "blogs" }: HistoryDrawerProps) {
  const {
    blogHistory,
    reviewHistory,
    loadBlogFromHistory,
    deleteBlogHistoryItem,
    clearBlogHistory,
    loadReviewsFromHistory,
    deleteReviewHistoryItem,
    clearReviewHistory,
  } = useBlogGeneration();

  const [mode, setMode] = useState<"blogs" | "reviews">(initialMode);
  const [search, setSearch] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModeChange = (newMode: "blogs" | "reviews") => {
    setMode(newMode);
    setShowClearConfirm(false);
  };

  if (!isOpen || !mounted) return null;

  const filteredBlogHistory = blogHistory.filter((item) =>
    item.topic.toLowerCase().includes(search.toLowerCase()) ||
    item.blog.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredReviewHistory = reviewHistory.filter((item) =>
    item.serviceType.toLowerCase().includes(search.toLowerCase()) ||
    item.location.toLowerCase().includes(search.toLowerCase()) ||
    item.reviews.some((r) => r.dogName.toLowerCase().includes(search.toLowerCase()) || r.reviewerName.toLowerCase().includes(search.toLowerCase()))
  );

  const drawerElement = (
    <AnimatePresence>
      <div className="history-drawer-overlay" onClick={onClose}>
        <motion.div
          className="history-drawer-content"
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="history-drawer-header">
            <div className="history-drawer-title">
              <span className="history-drawer-icon"><HistoryIcon /></span>
              <div>
                <h3>Generation History</h3>
                <p>View and reload past blogs & reviews</p>
              </div>
            </div>
            <button className="history-drawer-close" onClick={onClose} title="Close history" aria-label="Close history">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="history-drawer-tabs">
            <button
              className={`history-tab ${mode === "blogs" ? "active" : ""}`}
              onClick={() => handleModeChange("blogs")}
            >
              <FileTextIcon /> SEO Blogs ({blogHistory.length})
            </button>
            <button
              className={`history-tab ${mode === "reviews" ? "active" : ""}`}
              onClick={() => handleModeChange("reviews")}
            >
              <StarIcon /> Customer Reviews ({reviewHistory.length})
            </button>
          </div>

          {/* Search bar */}
          <div className="history-drawer-search">
            <input
              type="text"
              placeholder={mode === "blogs" ? "Search by topic or title..." : "Search by service or location..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="history-search-clear" onClick={() => setSearch("")} aria-label="Clear search">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          {/* Content List */}
          <div className="history-drawer-body">
            {mode === "blogs" ? (
              filteredBlogHistory.length === 0 ? (
                <div className="history-empty">
                  <span className="empty-icon"><EmptyDocIcon /></span>
                  <h4>No blog history found</h4>
                  <p>{search ? "No blogs match your search query." : "Generated blogs will automatically appear here."}</p>
                </div>
              ) : (
                <div className="history-list">
                  {filteredBlogHistory.map((item) => {
                    const seo = computeSeoScore(item.blog);
                    const personaName = item.persona?.name || "Pet Parent";
                    const personaStyle = getPersonaStyle(personaName);
                    return (
                      <div key={item.id} className="history-card">
                        <div className="history-card-header">
                          <span
                            className="history-card-badge"
                            style={{
                              background: personaStyle.bg,
                              border: `1px solid ${personaStyle.border}`,
                              color: personaStyle.color,
                            }}
                          >
                            {personaName}
                          </span>
                          <span className="history-card-time">{formatRelativeTime(item.timestamp)}</span>
                        </div>
                        <h4 className="history-card-title">{item.blog.title}</h4>
                        <p className="history-card-topic">Topic: &quot;{item.topic}&quot;</p>

                        <div className="history-card-meta" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>~{item.blog.approxWordCount || 1200} words</span>
                            {item.posts && <span className="posts-badge">✓ 3 Social Posts</span>}
                          </div>

                          {/* Live SEO Score Gauge Chip */}
                          <div
                            title={`SEO Score: ${seo.score}% (${seo.grade})`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "3px 9px",
                              borderRadius: "12px",
                              background: `${seo.color}15`,
                              border: `1px solid ${seo.color}35`,
                              color: seo.color,
                              fontSize: "11px",
                              fontWeight: 700,
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            <span>SEO {seo.score}% ({seo.grade})</span>
                          </div>
                        </div>

                        {/* Mini SEO Meter Progress Bar */}
                        <div style={{ width: "100%", height: "4px", background: "var(--panel-border)", borderRadius: "2px", overflow: "hidden", marginBottom: "12px", marginTop: "8px" }}>
                          <div
                            style={{
                              width: `${seo.score}%`,
                              height: "100%",
                              background: seo.color,
                              borderRadius: "2px",
                              transition: "width 0.4s ease",
                            }}
                          />
                        </div>

                        <div className="history-card-actions">
                          <button
                            className="history-action-btn restore"
                            onClick={() => {
                              loadBlogFromHistory(item);
                              onClose();
                            }}
                          >
                            <RestoreIcon /> Restore Article
                          </button>
                          <button
                            className="history-action-btn delete"
                            onClick={() => deleteBlogHistoryItem(item.id)}
                            title="Delete from history"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : filteredReviewHistory.length === 0 ? (
              <div className="history-empty">
                <span className="empty-icon"><StarIcon /></span>
                <h4>No review history found</h4>
                <p>{search ? "No reviews match your search query." : "Generated customer reviews will appear here."}</p>
              </div>
            ) : (
              <div className="history-list">
                {filteredReviewHistory.map((item) => (
                  <div key={item.id} className="history-card">
                    <div className="history-card-header">
                      <span className="history-card-badge" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <LocationPinIcon /> {item.location} • {item.serviceType}
                      </span>
                      <span className="history-card-time">{formatRelativeTime(item.timestamp)}</span>
                    </div>
                    <div className="history-card-reviews-preview">
                      {item.reviews.slice(0, 2).map((rev, idx) => (
                        <p key={idx} className="review-preview-text">
                          &quot;{rev.reviewText.slice(0, 90)}...&quot;
                        </p>
                      ))}
                    </div>

                    <div className="history-card-actions">
                      <button
                        className="history-action-btn restore"
                        onClick={() => {
                          loadReviewsFromHistory(item);
                          onClose();
                        }}
                      >
                        <RestoreIcon /> Restore Reviews
                      </button>
                      <button
                        className="history-action-btn delete"
                        onClick={() => deleteReviewHistoryItem(item.id)}
                        title="Delete from history"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="history-drawer-footer">
            <AnimatePresence mode="wait">
              {showClearConfirm ? (
                <motion.div
                  key="confirm-card"
                  className="history-confirm-card"
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="history-confirm-header">
                    <span className="history-confirm-icon">⚠️</span>
                    <div>
                      <h5>Are you sure?</h5>
                      <p>
                        This will permanently delete all {mode === "blogs" ? "blog" : "review"} history. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="history-confirm-actions">
                    <button
                      type="button"
                      className="history-confirm-btn cancel"
                      onClick={() => setShowClearConfirm(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="history-confirm-btn danger"
                      onClick={() => {
                        if (mode === "blogs") {
                          clearBlogHistory();
                        } else {
                          clearReviewHistory();
                        }
                        setShowClearConfirm(false);
                      }}
                    >
                      Yes, Clear All
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="clear-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {mode === "blogs" ? (
                    blogHistory.length > 0 && (
                      <button
                        type="button"
                        className="history-clear-all"
                        onClick={() => setShowClearConfirm(true)}
                      >
                        Clear All Blog History
                      </button>
                    )
                  ) : (
                    reviewHistory.length > 0 && (
                      <button
                        type="button"
                        className="history-clear-all"
                        onClick={() => setShowClearConfirm(true)}
                      >
                        Clear All Review History
                      </button>
                    )
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(drawerElement, document.body);
}
