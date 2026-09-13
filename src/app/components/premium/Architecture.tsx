import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import fallback from "../../../media/1746172642405.webp";
const Scene = lazy(() => import("./BuildingScene"));
export const phases = ["Fondations", "Structure", "Enveloppe", "Finitions"];
export default function Architecture({
  phase = 3,
  compact = false,
}: {
  phase?: number;
  compact?: boolean;
}) {
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const failure = useCallback(() => setFailed(true), []);
  useEffect(() => {
    const media = matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () =>
      setEnabled(
        media.matches &&
          !(navigator as Navigator & { connection?: { saveData?: boolean } })
            .connection?.saveData,
      );
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return (
    <div className={`architecture ${compact ? "architecture-compact" : ""}`}>
      <div className="architecture-grid" aria-hidden="true" />
      {enabled && !failed ? (
        <Suspense
          fallback={
            <img
              className="architecture-photo"
              src={fallback}
              alt="Intérieur résidentiel, finitions bois et minérales"
            />
          }
        >
          <Scene phase={phase} onFailure={failure} />
        </Suspense>
      ) : (
        <img
          className="architecture-photo"
          src={fallback}
          alt="Intérieur résidentiel, finitions bois et minérales"
        />
      )}
      <span className="architecture-note">
        {enabled && !failed
          ? "ÉTUDE DE VOLUMÉTRIE · SBRE"
          : "LE SENS DU DÉTAIL · SBRE"}
      </span>
      <span className="architecture-scale" aria-hidden="true">
        {String(phase + 1).padStart(2, "0")} / 04
      </span>
    </div>
  );
}
