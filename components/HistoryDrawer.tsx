import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { useBlogGeneration } from "@/lib/BlogGenerationContext";
import { computeSeoScore } from "@/lib/seoCalculator";

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

function AlertTriangleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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

const cascadeContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const cascadeItemVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};

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
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleModeChange = (newMode: "blogs" | "reviews") => {
    setMode(newMode);
    setShowClearConfirm(false);
    setDeletingItemId(null);
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
              className={`history-tab ${mode === "reviews" ? "active" : ""}`}
              onClick={() => handleModeChange("reviews")}
            >
              <StarIcon /> Customer Reviews ({reviewHistory.length})
            </button>
            <button
              className={`history-tab ${mode === "blogs" ? "active" : ""}`}
              onClick={() => handleModeChange("blogs")}
            >
              <FileTextIcon /> SEO Blogs ({blogHistory.length})
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
                <motion.div
                  className="history-list"
                  variants={cascadeContainerVariants}
                  initial="hidden"
                  animate="show"
                >
                  {filteredBlogHistory.map((item) => {
                    const seoMetrics = computeSeoScore(item);
                    const seo = { score: seoMetrics.total, grade: seoMetrics.grade, color: seoMetrics.color };
                    const personaName = item.persona?.name || "Pet Parent";
                    const personaStyle = getPersonaStyle(personaName);
                    return (
                      <motion.div key={item.id} className="history-card" variants={cascadeItemVariants}>
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

                        <AnimatePresence mode="wait">
                          {deletingItemId === item.id ? (
                            <motion.div
                              key="confirm-delete-blog"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, ease: "easeOut" }}
                              style={{
                                marginTop: "12px",
                                padding: "14px 16px",
                                background: "linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)",
                                border: "1.5px solid #FECDD3",
                                borderRadius: "12px",
                                boxShadow: "0 4px 14px rgba(239, 68, 68, 0.08)",
                                overflow: "hidden",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                                <AlertTriangleIcon />
                                <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "#991B1B" }}>
                                  Delete from history?
                                </span>
                              </div>

                              <p style={{ fontSize: "0.78rem", color: "#7F1D1D", margin: "0 0 12px 0", lineHeight: "1.45" }}>
                                Are you sure you want to delete this article? This action cannot be undone.
                              </p>

                              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                                <button
                                  type="button"
                                  onClick={() => setDeletingItemId(null)}
                                  style={{
                                    background: "#FFFFFF",
                                    border: "1px solid #CBD5E1",
                                    color: "#475569",
                                    padding: "6px 14px",
                                    borderRadius: "8px",
                                    fontSize: "0.76rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                  }}
                                >
                                  Cancel
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteBlogHistoryItem(item.id);
                                    setDeletingItemId(null);
                                  }}
                                  style={{
                                    background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                                    border: "none",
                                    color: "#FFFFFF",
                                    padding: "6px 14px",
                                    borderRadius: "8px",
                                    fontSize: "0.76rem",
                                    fontWeight: 800,
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "5px",
                                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                                  }}
                                >
                                  <TrashIcon /> Confirm Delete
                                </button>
                              </div>
                            </motion.div>
                          ) : (
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
                                onClick={() => setDeletingItemId(item.id)}
                                title="Delete from history"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )
            ) : filteredReviewHistory.length === 0 ? (
              <div className="history-empty">
                <span className="empty-icon"><StarIcon /></span>
                <h4>No review history found</h4>
                <p>{search ? "No reviews match your search query." : "Generated customer reviews will appear here."}</p>
              </div>
            ) : (
              <motion.div
                className="history-list"
                variants={cascadeContainerVariants}
                initial="hidden"
                animate="show"
              >
                {filteredReviewHistory.map((item) => (
                  <motion.div key={item.id} className="history-card" variants={cascadeItemVariants}>
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

                    <AnimatePresence mode="wait">
                      {deletingItemId === item.id ? (
                        <motion.div
                          key="confirm-delete-review"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          style={{
                            marginTop: "12px",
                            padding: "14px 16px",
                            background: "linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)",
                            border: "1.5px solid #FECDD3",
                            borderRadius: "12px",
                            boxShadow: "0 4px 14px rgba(239, 68, 68, 0.08)",
                            overflow: "hidden",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                            <AlertTriangleIcon />
                            <span style={{ fontSize: "0.84rem", fontWeight: 800, color: "#991B1B" }}>
                              Delete from history?
                            </span>
                          </div>

                          <p style={{ fontSize: "0.78rem", color: "#7F1D1D", margin: "0 0 12px 0", lineHeight: "1.45" }}>
                            Are you sure you want to delete these reviews? This action cannot be undone.
                          </p>

                          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                            <button
                              type="button"
                              onClick={() => setDeletingItemId(null)}
                              style={{
                                background: "#FFFFFF",
                                border: "1px solid #CBD5E1",
                                color: "#475569",
                                padding: "6px 14px",
                                borderRadius: "8px",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                deleteReviewHistoryItem(item.id);
                                setDeletingItemId(null);
                              }}
                              style={{
                                background: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
                                border: "none",
                                color: "#FFFFFF",
                                padding: "6px 14px",
                                borderRadius: "8px",
                                fontSize: "0.76rem",
                                fontWeight: 800,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
                              }}
                            >
                              <TrashIcon /> Confirm Delete
                            </button>
                          </div>
                        </motion.div>
                      ) : (
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
                            onClick={() => setDeletingItemId(item.id)}
                            title="Delete from history"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
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
                    <span className="history-confirm-icon"><AlertTriangleIcon /></span>
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
