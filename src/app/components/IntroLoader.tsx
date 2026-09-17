import { useEffect, useRef, useState } from "react";
import Architecture, { phases } from "./premium/Architecture";
export default function IntroLoader({
  onComplete,
  onReveal,
}: {
  onComplete: () => void;
  onReveal?: () => void;
}) {
  const [phase, setPhase] = useState(0);
  const finishRef = useRef(onComplete);
  finishRef.current = onComplete;
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;
  const skip = () => {
    revealRef.current?.();
    finishRef.current();
  };
  useEffect(() => {
    if (
      matchMedia("(prefers-reduced-motion: reduce), (max-width: 767px)").matches
    ) {
      revealRef.current?.();
      finishRef.current();
      return;
    }
    const timers = [650, 1250, 1850].map((ms, i) =>
      setTimeout(() => setPhase(i + 1), ms),
    );
    timers.push(
      setTimeout(() => {
        revealRef.current?.();
        finishRef.current();
      }, 2700),
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  return (
    <div
      className="premium-intro"
      role="dialog"
      aria-modal="true"
      aria-label="Introduction architecturale"
    >
      <div className="intro-brand">
        SBRE<span>INGÉNIERIE</span>
      </div>
      <Architecture phase={phase} compact />
      <div className="intro-caption">
        <span>
          {String(phase + 1).padStart(2, "0")} — {phases[phase]}
        </span>
        <p>La maîtrise se construit.</p>
      </div>
      <button
        autoFocus
        className="intro-skip"
        onClick={skip}
        onKeyDown={(e) => {
          if (e.key === "Escape") skip();
        }}
      >
        Passer l’introduction ↗
      </button>
    </div>
  );
}
