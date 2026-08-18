import React, { useMemo, useState, useEffect, useRef } from "react";
import type { SeoBlog } from "@/lib/types";
import { computeSeoScore } from "@/lib/seoCalculator";

interface SeoMeterProps {
  blog: SeoBlog;
  metaDescription: string;
  isActive?: boolean;
  highlightedKeyword?: string | null;
  onSelectKeyword?: (word: string | null) => void;
}

function BarChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
    </svg>
  );
}

export default function SeoMeter({
  blog,
  metaDescription,
  isActive,
  highlightedKeyword,
  onSelectKeyword,
}: SeoMeterProps) {
  const [showKeywordDetails, setShowKeywordDetails] = useState(false);
  const [selectedKeyword, setSelectedKeyword] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Compute full text of blog
  const fullText = useMemo(() => {
    const parts: string[] = [blog.title, ...blog.intro];
    blog.sections.forEach((sec) => {
      parts.push(sec.heading);
      if (sec.paragraphs) parts.push(...sec.paragraphs);
      if (sec.bullets) parts.push(...sec.bullets);
      if (sec.subtopics) {
        sec.subtopics.forEach((st) => {
          parts.push(st.subheading, ...st.paragraphs);
        });
      }
    });
    parts.push(blog.vetCta, ...blog.conclusion);
    blog.faqs.forEach((faq) => parts.push(faq.question, faq.answer));
    return parts.join(" ");
  }, [blog]);

  const wordCount = useMemo(() => {
    return fullText.trim().split(/\s+/).filter(Boolean).length;
  }, [fullText]);

  // Single source of truth SEO calculation
  const seoMetrics = useMemo(() => {
    return computeSeoScore(blog, metaDescription);
  }, [blog, metaDescription]);

  // Extract Keyword Densities
  const keywordStats = useMemo(() => {
    const words = fullText.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter(Boolean);
    const stopWords = new Set([
      "the", "and", "a", "to", "of", "in", "is", "for", "that", "you", "it", "on", "with",
      "your", "this", "can", "are", "be", "as", "or", "an", "have", "from", "at", "by",
      "how", "what", "more", "help", "dog", "pet", "will", "when", "their", "so", "if", "not"
    ]);

    const freqMap: Record<string, number> = {};
    words.forEach((w) => {
      if (w.length > 3 && !stopWords.has(w)) {
        freqMap[w] = (freqMap[w] || 0) + 1;
      }
    });

    const sorted = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / (words.length || 1)) * 100).toFixed(1) + "%",
      }));

    return sorted;
  }, [fullText]);

  const circumference = 263.89; // 2 * Math.PI * 42
  const targetOffset = circumference - (circumference * seoMetrics.total) / 100;

  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedStrokeOffset, setAnimatedStrokeOffset] = useState(circumference);
  const [isSweeping, setIsSweeping] = useState(false);

  // Trigger Option 2 Elastic Pulse-Settle animation whenever isActive becomes true or score updates
  useEffect(() => {
    if (isActive === false) return;

    setIsSweeping(true);
    setAnimatedScore(0);
    setAnimatedStrokeOffset(circumference);

    let frameId: number;
    const startTime = performance.now() + 30; // slight offset for smooth layout paint
    const duration = 1600; // 1.6s smooth liquid silk sweep
    const targetScore = seoMetrics.total;

    // Smooth Quartic Ease-Out curve for velvet-soft deceleration into 100
    const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - startTime);
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutQuart(progress);

      // Frame-by-frame synchronized update of score & stroke offset
      setAnimatedScore(Math.round(eased * targetScore));
      setAnimatedStrokeOffset(circumference - (circumference - targetOffset) * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        // Sweep complete -> trigger smooth 800ms elastic scale-down settle
        setIsSweeping(false);
      }
    };

    const timer = setTimeout(() => {
      frameId = requestAnimationFrame(tick);
    }, 30);

    return () => {
      clearTimeout(timer);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isActive, seoMetrics.total, targetOffset, circumference]);

  // Render Live SEO Quality Index Gauge
  return (
    <div ref={containerRef} className={`seo-meter-card ${isSweeping ? "sweeping" : ""}`}>
      <div className="seo-meter-header">
        <div className="seo-meter-title-wrap">
          <span className="glass-icon-badge">
            <BarChartIcon />
          </span>
          <div>
            <h4 className="seo-meter-title">Live SEO Quality Index</h4>
            <p className="seo-meter-subtitle">Real-time content &amp; keyword density health</p>
          </div>
        </div>
        <button
          type="button"
          className="p3-btn p3-btn--ghost p3-btn--sm"
          onClick={() => setShowKeywordDetails(!showKeywordDetails)}
          style={{ color: "#334155", fontWeight: 700, borderColor: "#CBD5E1" }}
        >
          {showKeywordDetails ? "Hide Metrics" : "View Keyword Details"}
        </button>
      </div>

      <div className="seo-meter-body">
        {/* Radial Progress Gauge */}
        <div className="seo-radial-wrap">
          <div className={`seo-radial-svg-wrap ${isSweeping ? "sweeping" : ""}`}>
            <svg className="seo-radial-svg" width="110" height="110" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="seoMeterGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399" />
                  <stop offset="60%" stopColor={seoMetrics.color} />
                  <stop offset="100%" stopColor="#A7F3D0" />
                </linearGradient>
              </defs>
              <circle
                className="seo-radial-bg"
                cx="50"
                cy="50"
                r="42"
                strokeWidth="8"
              />
              <circle
                className="seo-radial-progress"
                cx="50"
                cy="50"
                r="42"
                strokeWidth="8"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: animatedStrokeOffset,
                  stroke: "url(#seoMeterGradient)",
                }}
              />
            </svg>
          </div>
          <div className="seo-radial-content">
            <span
              className={`seo-score-num ${isSweeping ? "sweeping-score" : ""}`}
              style={{ color: seoMetrics.color }}
            >
              {animatedScore}
            </span>
            <span className="seo-score-total">/100</span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="seo-stats-grid">
          <div className="seo-stat-item seo-stat-item--grade">
            <span className="seo-stat-label">Grade</span>
            <span className="seo-stat-value" style={{ color: seoMetrics.color }}>
              {seoMetrics.grade}
            </span>
          </div>
          <div className="seo-stat-item seo-stat-item--wordcount">
            <span className="seo-stat-label">Word Count</span>
            <span className="seo-stat-value">{wordCount.toLocaleString()} words</span>
          </div>
          <div className="seo-stat-item seo-stat-item--meta">
            <span className="seo-stat-label">Meta Snippet</span>
            <span
              className="seo-stat-value"
              style={{
                color:
                  metaDescription.length >= 150 && metaDescription.length <= 160
                    ? "#10B981"
                    : "#EAB308",
              }}
            >
              {metaDescription.length}/160
            </span>
          </div>
          <div className="seo-stat-item seo-stat-item--headings">
            <span className="seo-stat-label">Headings</span>
            <span className="seo-stat-value">{1 + blog.sections.length} Sections</span>
          </div>
        </div>
      </div>

      {/* Keyword Density Badges */}
      {showKeywordDetails && (
        <div className="seo-keywords-section">
          <p className="seo-keywords-title">
            <span className="glass-icon-badge glass-icon-badge--sm" style={{ marginRight: 8 }}>
              <KeyIcon />
            </span>
            Top Primary Keyword Densities
          </p>
          <div className="seo-keywords-list">
            {keywordStats.map((item) => {
              const isSelected = highlightedKeyword === item.word;
              return (
                <button
                  key={item.word}
                  type="button"
                  className={`seo-keyword-chip ${isSelected ? "active-kw" : ""}`}
                  onClick={() => {
                    const next = isSelected ? null : item.word;
                    if (onSelectKeyword) onSelectKeyword(next);
                  }}
                  title={isSelected ? "Click to clear highlight" : `Click to highlight "${item.word}" in article`}
                >
                  <span className="seo-kw-word">{item.word}</span>
                  <span className="seo-kw-count">{item.count}x</span>
                  <span className="seo-kw-density">({item.density})</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
