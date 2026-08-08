import { motion, AnimatePresence } from "framer-motion";

interface ProgressBarProps {
  percent: number; // 0-100
  label: string;
}

function PawPrintIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="16.2" rx="5.4" ry="4.6" />
      <ellipse cx="5.2" cy="8.8" rx="2.1" ry="2.7" />
      <ellipse cx="10.1" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="14.7" cy="5.4" rx="2" ry="2.6" />
      <ellipse cx="19" cy="8.8" rx="2.1" ry="2.7" />
    </svg>
  );
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <div style={{ position: "relative" }}>
      <div className="progress-track" style={{ position: "relative", overflow: "visible" }}>
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${safePercent}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ position: "relative" }}
        >
          {safePercent > 2 && (
            <motion.div
              initial={{ scale: 0.6, rotate: -15 }}
              animate={{ scale: [1, 1.25, 1], rotate: [-15, 15, -15] }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              style={{
                position: "absolute",
                right: "-8px",
                top: "-12px",
                color: "#68B77A",
                filter: "drop-shadow(0 0 6px rgba(104, 183, 122, 0.85))",
                zIndex: 10,
              }}
            >
              <PawPrintIcon />
            </motion.div>
          )}
        </motion.div>
      </div>

      <div className="progress-label" style={{ marginTop: "10px" }}>
        <AnimatePresence mode="wait">
          <motion.span
            key={label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            style={{ display: "inline-block" }}
          >
            {label}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

