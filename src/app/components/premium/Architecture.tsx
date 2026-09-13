import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import fallback from "../../../media/1746172642405.webp";

const VillaScene = lazy(() => import("./BuildingScene"));
const OvalScene = lazy(() => import("./OvalBuildingScene"));

export const phases = ["Fondations", "Structure", "Enveloppe", "Finitions"];
export type ArchitectureKind = "villa" | "immeuble";

export default function Architecture({
  phase = 3,
  compact = false,
  kind = "villa",
}: {
  phase?: number;
  compact?: boolean;
  kind?: ArchitectureKind;
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

  const Scene = kind === "immeuble" ? OvalScene : VillaScene;
  const sceneLabel = kind === "immeuble" ? "IMMEUBLE COURBE · SBRE" : "ÉTUDE DE VOLUMÉTRIE · SBRE";

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
        {enabled && !failed ? sceneLabel : "LE SENS DU DÉTAIL · SBRE"}
      </span>
      <span className="architecture-scale" aria-hidden="true">
        {String(phase + 1).padStart(2, "0")} / 04
      </span>
    </div>
  );
}
