import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  DraftingCompass,
  HardHat,
  Landmark,
  Network,
} from "lucide-react";
import "../../../styles/partner-network-hero.css";

type HeroRole = {
  key: "architecte" | "entreprise" | "client" | "dt" | "together";
  eyebrow: string;
  title: string;
  copy: string;
  signal: string;
  icon: typeof DraftingCompass;
  accent: string;
  nodeLabel: string;
};

const roles: HeroRole[] = [
  {
    key: "architecte",
    eyebrow: "VOUS ÊTES ARCHITECTE ?",
    title: "Votre vision reste au centre.",
    copy: "SBRE transforme les intentions du projet en décisions de chantier lisibles, suivies et exécutables.",
    signal: "CONCEPTION · VALIDATIONS · DÉTAILS",
    icon: DraftingCompass,
    accent: "CONCEPTION",
    nodeLabel: "Architecte",
  },
  {
    key: "entreprise",
    eyebrow: "VOUS ÊTES UNE ENTREPRISE ?",
    title: "Les interfaces deviennent claires.",
    copy: "Nous structurons les séquences, les accès, les validations et les priorités pour fluidifier l’exécution.",
    signal: "PLANNING · INTERFACES · EXÉCUTION",
    icon: HardHat,
    accent: "TERRAIN",
    nodeLabel: "Entreprise",
  },
  {
    key: "client",
    eyebrow: "VOUS ÊTES CLIENT OU MAÎTRE D’OUVRAGE ?",
    title: "Vous gardez la lecture du projet.",
    copy: "Coûts, délais, décisions et risques sont consolidés pour garder une vision claire de l’avancement.",
    signal: "COÛTS · DÉLAIS · DÉCISIONS",
    icon: Landmark,
    accent: "PILOTAGE",
    nodeLabel: "Client / MO",
  },
  {
    key: "dt",
    eyebrow: "VOUS ÊTES DIRECTION DE TRAVAUX ?",
    title: "Nous renforçons votre capacité.",
    copy: "SBRE intervient comme extension opérationnelle sur les phases qui exigent plus de présence et de coordination.",
    signal: "RENFORT · CONTRÔLE · COORDINATION",
    icon: Network,
    accent: "RENFORT",
    nodeLabel: "Direction de travaux",
  },
  {
    key: "together",
    eyebrow: "UN MÊME PROJET. DES RÔLES DIFFÉRENTS.",
    title: "Collaborons ensemble.",
    copy: "Chaque acteur conserve son rôle. SBRE crée le lien pour rendre le chantier plus lisible, fluide et maîtrisé.",
    signal: "UN PROJET · UNE COORDINATION",
    icon: Building2,
    accent: "COLLABORATION",
    nodeLabel: "Tous les acteurs",
  },
];

function NetworkScene() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = roles[activeIndex];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % roles.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  const selectRole = (key: HeroRole["key"]) => {
    const index = roles.findIndex((role) => role.key === key);
    if (index >= 0) setActiveIndex(index);
  };

  return (
    <div className={`partner-network-scene stage-${active.key}`} aria-label="Réseau de coordination SBRE Ingénierie">
      <div className="pn-grid" aria-hidden="true" />
      <div className="pn-glow" aria-hidden="true" />

      <div className="pn-copy" aria-live="polite">
        <span className="pn-step">0{activeIndex + 1} / 05</span>
        <p className="pn-eyebrow" key={`${active.key}-eyebrow`}>{active.eyebrow}</p>
        <h2 key={`${active.key}-title`}>{active.title}</h2>
        <p className="pn-description" key={`${active.key}-copy`}>{active.copy}</p>
        <div className="pn-signal"><i />{active.signal}</div>
      </div>

      <div className="pn-stage-badge" key={`${active.key}-badge`}>
        <span><ActiveIcon size={17} strokeWidth={1.5} /></span>
        <div><small>CONNEXION ACTIVE</small><strong>{active.accent}</strong></div>
      </div>

      <div className="pn-network">
        <svg className="pn-links" viewBox="0 0 760 500" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          <path className="pn-link pn-link-architecte" d="M380 250 C300 190 240 145 128 96" />
          <path className="pn-link pn-link-entreprise" d="M388 246 C475 184 542 141 640 98" />
          <path className="pn-link pn-link-client" d="M392 272 C493 326 548 370 642 418" />
          <path className="pn-link pn-link-dt" d="M368 274 C278 329 224 373 121 421" />
        </svg>

        <div className="pn-center">
          <div className="pn-ring pn-ring-a" />
          <div className="pn-ring pn-ring-b" />
          <div className="pn-building-shell">
            <div className="pn-building-main">
              <span className="pn-building-roof" />
              <span className="pn-building-front">
                {Array.from({ length: 24 }).map((_, index) => <i key={index} />)}
              </span>
              <span className="pn-building-side" />
            </div>
            <div className="pn-building-wing">
              <span className="pn-wing-front">
                {Array.from({ length: 8 }).map((_, index) => <i key={index} />)}
              </span>
              <span className="pn-wing-side" />
            </div>
            <div className="pn-building-plinth" />
          </div>
          <div className="pn-core-label"><Building2 size={16} /><strong>SBRE</strong><span>COORDINATION DU PROJET</span></div>
        </div>

        {roles.slice(0, 4).map((role, index) => {
          const Icon = role.icon;
          const isActive = active.key === role.key || active.key === "together";
          return (
            <button
              type="button"
              key={role.key}
              className={`pn-node pn-node-${role.key} ${isActive ? "is-active" : ""}`}
              onClick={() => selectRole(role.key)}
              aria-pressed={active.key === role.key}
            >
              <span className="pn-node-index">0{index + 1}</span>
              <span className="pn-node-icon"><Icon size={18} strokeWidth={1.45} /></span>
              <span className="pn-node-copy"><small>{role.accent}</small><strong>{role.nodeLabel}</strong></span>
            </button>
          );
        })}

        <span className="pn-packet packet-a" aria-hidden="true" />
        <span className="pn-packet packet-b" aria-hidden="true" />
        <span className="pn-packet packet-c" aria-hidden="true" />
        <span className="pn-packet packet-d" aria-hidden="true" />
      </div>

      <div className="pn-progress" aria-label="Séquence de collaboration">
        {roles.map((role, index) => (
          <button
            key={role.key}
            type="button"
            aria-label={`Afficher ${role.nodeLabel}`}
            aria-pressed={index === activeIndex}
            className={index === activeIndex ? "is-active" : ""}
            onClick={() => setActiveIndex(index)}
          ><span /></button>
        ))}
      </div>

      <a className="pn-collab-link" href="#profils">
        Explorer les formes de collaboration <ArrowRight size={15} />
      </a>
    </div>
  );
}

export default function PartnerNetworkHero() {
  const location = useLocation();
  const [host, setHost] = useState<HTMLElement | null>(null);
  const isPartners = useMemo(() => location.pathname === "/partenaires", [location.pathname]);

  useEffect(() => {
    if (!isPartners) {
      setHost(null);
      return;
    }

    let disposed = false;
    const attach = () => {
      const visual = document.querySelector<HTMLElement>(".partners-page .partners-hero-visual");
      if (!visual) return false;
      visual.classList.add("partner-network-enhanced");
      let mount = visual.querySelector<HTMLElement>("[data-sbre-partner-network]");
      if (!mount) {
        mount = document.createElement("div");
        mount.dataset.sbrePartnerNetwork = "true";
        visual.appendChild(mount);
      }
      if (!disposed) setHost(mount);
      return true;
    };

    if (attach()) {
      return () => {
        disposed = true;
        document.querySelector("[data-sbre-partner-network]")?.remove();
        document.querySelector(".partners-hero-visual")?.classList.remove("partner-network-enhanced");
      };
    }

    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      observer.disconnect();
      document.querySelector("[data-sbre-partner-network]")?.remove();
      document.querySelector(".partners-hero-visual")?.classList.remove("partner-network-enhanced");
    };
  }, [isPartners]);

  return host ? createPortal(<NetworkScene />, host) : null;
}
