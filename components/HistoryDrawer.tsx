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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <button className="history-drawer-close" onClick={onClose} title="Close history">
              ✕
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="history-drawer-tabs">
            <button
              className={`history-tab ${mode === "blogs" ? "active" : ""}`}
              onClick={() => setMode("blogs")}
            >
              <FileTextIcon /> SEO Blogs ({blogHistory.length})
            </button>
            <button
              className={`history-tab ${mode === "reviews" ? "active" : ""}`}
              onClick={() => setMode("reviews")}
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
              <button className="history-search-clear" onClick={() => setSearch("")}>
                ✕
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
                  {filteredBlogHistory.map((item) => (
                    <div key={item.id} className="history-card">
                      <div className="history-card-header">
                        <span className="history-card-badge">
                          {item.persona?.name || "Pet Parent"}
                        </span>
                        <span className="history-card-time">{formatRelativeTime(item.timestamp)}</span>
                      </div>
                      <h4 className="history-card-title">{item.blog.title}</h4>
                      <p className="history-card-topic">Topic: &quot;{item.topic}&quot;</p>

                      <div className="history-card-meta">
                        <span>~{item.blog.approxWordCount || 1200} words</span>
                        {item.posts && <span className="posts-badge">✓ 3 Social Posts</span>}
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
                  ))}
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
            {mode === "blogs" ? (
              blogHistory.length > 0 && (
                <button className="history-clear-all" onClick={clearBlogHistory}>
                  Clear All Blog History
                </button>
              )
            ) : (
              reviewHistory.length > 0 && (
                <button className="history-clear-all" onClick={clearReviewHistory}>
                  Clear All Review History
                </button>
              )
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(drawerElement, document.body);
}
