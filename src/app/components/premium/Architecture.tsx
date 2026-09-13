import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import fallback from "../../../media/1746172642405.webp";
import logo from "../../../media/Pr_sentation1_page-0001.webp";
import "../../../styles/architecture-switch.css";

const VillaScene = lazy(() => import("./BuildingScene"));
const OvalScene = lazy(() => import("./OvalBuildingScene"));

export const phases = ["Fondations", "Structure", "Enveloppe", "Finitions"];
export type ArchitectureKind = "villa" | "immeuble";

export default function Architecture({
  phase = 3,
  compact = false,
}: {
  phase?: number;
  compact?: boolean;
}) {
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [kind, setKind] = useState<ArchitectureKind>("immeuble");
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

  useEffect(() => {
    setFailed(false);
  }, [kind]);

  const Scene = kind === "immeuble" ? OvalScene : VillaScene;
  const sceneLabel = kind === "immeuble" ? "IMMEUBLE COURBE · SBRE" : "VILLA CONTEMPORAINE · SBRE";

  return (
    <div className={`architecture ${compact ? "architecture-compact" : ""}`}>
      <div className="architecture-grid" aria-hidden="true" />

      {!compact && (
        <div className="architecture-kind-switch" aria-label="Choisir le type de projet">
          <button
            type="button"
            aria-pressed={kind === "immeuble"}
            onClick={() => setKind("immeuble")}
          >
            <span>01</span> Immeuble
          </button>
          <button
            type="button"
            aria-pressed={kind === "villa"}
            onClick={() => setKind("villa")}
          >
            <span>02</span> Villa
          </button>
        </div>
      )}

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

      <div className="architecture-watermark" aria-hidden="true">
        <img src={logo} alt="" />
        <span>SBRE INGÉNIERIE</span>
      </div>
      <div className="architecture-watermark-center" aria-hidden="true">
        SBRE INGÉNIERIE
      </div>

      <span className="architecture-note">
        {enabled && !failed ? sceneLabel : "LE SENS DU DÉTAIL · SBRE"}
      </span>
      <span className="architecture-scale" aria-hidden="true">
        {String(phase + 1).padStart(2, "0")} / 04
      </span>
    </div>
  );
}
