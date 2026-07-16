import { useState } from "react";
import Page1 from "@/components/Page1";
import Page2 from "@/components/Page2";
import Page3 from "@/components/Page3";

const TOTAL_STEPS = 3;

export default function Wizard() {
  const [step, setStep] = useState(1);

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="shell">
      <div className="stepper">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className={`dot ${n === step ? "active" : n < step ? "complete" : ""}`}
          />
        ))}
      </div>

      {step === 1 && <Page1 onNext={goNext} />}
      {step === 2 && <Page2 onNext={goNext} onBack={goBack} />}
      {step === 3 && <Page3 onBack={goBack} />}
    </div>
  );
}
