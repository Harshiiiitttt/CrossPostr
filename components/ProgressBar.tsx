interface ProgressBarProps {
  percent: number; // 0-100
  label: string;
}

export default function ProgressBar({ percent, label }: ProgressBarProps) {
  return (
    <div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="progress-label">{label}</div>
    </div>
  );
}
