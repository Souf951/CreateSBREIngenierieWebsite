import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import fallback from "../../../media/1746172642405.webp";
import logo from "../../../media/Pr_sentation1_page-0001.webp";
import "../../../styles/architecture-switch.css";

const VillaScene = lazy(() => import("./BuildingScene"));
const OvalScene = lazy(() => import("./OvalBuildingScene"));
const PublicWorksScene = lazy(() => import("./PublicWorksScene"));

export const phases = ["Fondations", "Structure", "Enveloppe", "Finitions"];
export type ArchitectureKind = "villa" | "immeuble" | "travaux-publics";

export const projectBackgrounds: Array<{
  kind: ArchitectureKind;
  src: string;
  alt: string;
}> = [
  {
    kind: "immeuble",
    src: `${import.meta.env.BASE_URL}sbre-bg-immeuble.webp`,
    alt: "Immeuble résidentiel contemporain aux balcons courbes",
  },
  {
    kind: "villa",
    src: `${import.meta.env.BASE_URL}sbre-bg-villa.webp`,
    alt: "Villa contemporaine en béton et verre",
  },
  {
    kind: "travaux-publics",
    src: `${import.meta.env.BASE_URL}sbre-bg-infrastructure.webp`,
    alt: "Infrastructure routière urbaine à Genève",
  },
];

export default function Architecture({
  phase = 3,
  compact = false,
  onKindChange,
}: {
  phase?: number;
  compact?: boolean;
  onKindChange?: (kind: ArchitectureKind) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [heroHost, setHeroHost] = useState<HTMLElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [failed, setFailed] = useState(false);
  const [kind, setKind] = useState<ArchitectureKind>("immeuble");
  const failure = useCallback(() => setFailed(true), []);

  useEffect(() => {
    setHeroHost(rootRef.current?.closest(".hero") as HTMLElement | null);
  }, []);

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

  const selectKind = (next: ArchitectureKind) => {
    setKind(next);
    onKindChange?.(next);
  };

  const Scene =
    kind === "immeuble"
      ? OvalScene
      : kind === "villa"
        ? VillaScene
        : PublicWorksScene;

  const sceneLabel =
    kind === "immeuble"
      ? "IMMEUBLE COURBE · SBRE"
      : kind === "villa"
        ? "VILLA CONTEMPORAINE · SBRE"
        : "INFRASTRUCTURES PUBLIQUES · SBRE";

  return (
    <>
      {heroHost &&
        createPortal(
          <div className="hero-project-backgrounds" aria-hidden="true">
            {projectBackgrounds.map((background) => (
              <img
                key={background.kind}
                src={background.src}
                alt=""
                className={background.kind === kind ? "is-active" : ""}
                loading={background.kind === "immeuble" ? "eager" : "lazy"}
                decoding="async"
              />
            ))}
            <div className="hero-project-background-shade" />
          </div>,
          heroHost,
        )}

      <div ref={rootRef} className={`architecture ${compact ? "architecture-compact" : ""}`}>
        <div className="architecture-grid" aria-hidden="true" />

        {!compact && (
          <div className="architecture-kind-switch" aria-label="Choisir le type de projet">
            <button
              type="button"
              aria-pressed={kind === "immeuble"}
              onClick={() => selectKind("immeuble")}
            >
              <span>01</span> Immeuble
            </button>
            <button
              type="button"
              aria-pressed={kind === "villa"}
              onClick={() => selectKind("villa")}
            >
              <span>02</span> Villa
            </button>
            <button
              type="button"
              aria-pressed={kind === "travaux-publics"}
              onClick={() => selectKind("travaux-publics")}
            >
              <span>03</span> Infrastructures publiques
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
    </>
  );
}
