import { lazy, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import logo from "../../../media/Pr_sentation1_page-0001.webp";
import "../../../styles/architecture-switch.css";
import "../../../styles/hero-interaction-pass.css";

const VillaScene = lazy(() => import("./BuildingScene"));
const OvalScene = lazy(() => import("./OvalBuildingScene"));
const PublicWorksScene = lazy(() => import("./PublicWorksScene"));

export const phases = ["Fondations", "Structure", "Enveloppe", "Finitions"];
export type ArchitectureKind = "villa" | "immeuble" | "travaux-publics";

const VILLA_PROJECT_HERO =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

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
    src: VILLA_PROJECT_HERO,
    alt: "Villa contemporaine haut de gamme avec piscine",
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
    const media = matchMedia("(prefers-reduced-motion: no-preference)");
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
          <Suspense fallback={<div className="architecture-static-placeholder" aria-hidden="true" />}>
            <Scene phase={phase} onFailure={failure} />
          </Suspense>
        ) : (
          <div className="architecture-static-placeholder" aria-hidden="true" />
        )}

        {!compact && enabled && !failed && (
          <div className="architecture-interaction-hint" aria-hidden="true">
            <span className="interaction-hand">↔</span>
            <span>
              <strong>3D INTERACTIVE</strong>
              Glissez pour faire tourner
            </span>
          </div>
        )}

        <div className="architecture-watermark" aria-hidden="true">
          <img src={logo} alt="" />
          <span>SBRE INGÉNIERIE</span>
        </div>
        <div className="architecture-watermark-center" aria-hidden="true">
          SBRE INGÉNIERIE
        </div>

        <span className="architecture-note">
          {enabled && !failed ? sceneLabel : "MODÈLE ARCHITECTURAL · SBRE"}
        </span>
        <span className="architecture-scale" aria-hidden="true">
          {String(phase + 1).padStart(2, "0")} / 04
        </span>
      </div>
    </>
  );
}
