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
  key: string;
  eyebrow: string;
  title: string;
  copy: string;
  signal: string;
  icon: typeof DraftingCompass;
  accent: string;
};

const roles: HeroRole[] = [
  {
    key: "architecte",
    eyebrow: "VOUS ÊTES ARCHITECTE ?",
    title: "Votre vision reste au centre.",
    copy: "SBRE transforme les intentions du projet en décisions de chantier lisibles, suivies et exécutables.",
    signal: "INTENTIONS · DÉTAILS · VALIDATIONS",
    icon: DraftingCompass,
    accent: "CONCEPTION",
  },
  {
    key: "entreprise",
    eyebrow: "VOUS ÊTES UNE ENTREPRISE ?",
    title: "Les interfaces deviennent claires.",
    copy: "Nous structurons les séquences, les accès, les validations et les priorités pour fluidifier l’exécution.",
    signal: "PLANNING · INTERFACES · EXÉCUTION",
    icon: HardHat,
    accent: "TERRAIN",
  },
  {
    key: "client",
    eyebrow: "VOUS ÊTES CLIENT OU MAÎTRE D’OUVRAGE ?",
    title: "Vous gardez la lecture du projet.",
    copy: "Coûts, délais, décisions et risques sont consolidés pour que l’avancement reste compréhensible et pilotable.",
    signal: "COÛTS · DÉLAIS · DÉCISIONS",
    icon: Landmark,
    accent: "PILOTAGE",
  },
  {
    key: "dt",
    eyebrow: "VOUS ÊTES DIRECTION DE TRAVAUX ?",
    title: "Nous renforçons votre capacité.",
    copy: "SBRE intervient comme extension opérationnelle sur les phases qui exigent plus de présence, de contrôle et de coordination.",
    signal: "RENFORT · CONTRÔLE · COORDINATION",
    icon: Network,
    accent: "RENFORT",
  },
  {
    key: "together",
    eyebrow: "UN MÊME PROJET. DES RÔLES DIFFÉRENTS.",
    title: "Collaborons ensemble.",
    copy: "Un seul objectif : créer un chantier mieux coordonné, plus lisible et plus maîtrisé pour tous les acteurs.",
    signal: "SBRE · RÉSEAU DE PROJET",
    icon: Building2,
    accent: "COLLABORATION",
  },
];

function NetworkScene() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const active = roles[activeIndex];
  const ActiveIcon = active.icon;

  useEffect(() => {
    if (paused) return;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % roles.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <div
      className={`partner-network-scene stage-${active.key}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Animation illustrant la collaboration entre les acteurs d’un projet et SBRE Ingénierie"
    >
      <div className="pn-grid" aria-hidden="true" />
      <div className="pn-glow pn-glow-a" aria-hidden="true" />
      <div className="pn-glow pn-glow-b" aria-hidden="true" />

      <div className="pn-copy" aria-live="polite">
        <span className="pn-step">0{activeIndex + 1} / 05</span>
        <p className="pn-eyebrow" key={`${active.key}-eyebrow`}>{active.eyebrow}</p>
        <h2 key={`${active.key}-title`}>{active.title}</h2>
        <p className="pn-description" key={`${active.key}-copy`}>{active.copy}</p>
        <div className="pn-signal"><i />{active.signal}</div>
      </div>

      <div className="pn-network" aria-hidden="true">
        <svg className="pn-links" viewBox="0 0 760 560" preserveAspectRatio="xMidYMid meet">
          <path className="pn-link pn-link-architecte" d="M378 282 C285 215 213 150 110 104" />
          <path className="pn-link pn-link-entreprise" d="M390 275 C488 214 555 154 655 110" />
          <path className="pn-link pn-link-client" d="M398 305 C505 348 566 405 658 460" />
          <path className="pn-link pn-link-dt" d="M362 310 C267 361 207 411 103 466" />
        </svg>

        <div className="pn-building-wrap">
          <div className="pn-orbit orbit-one" />
          <div className="pn-orbit orbit-two" />
          <div className="pn-building">
            <span className="pn-roof" />
            <span className="pn-face pn-face-front">
              {Array.from({ length: 18 }).map((_, index) => <i key={index} />)}
            </span>
            <span className="pn-face pn-face-side" />
            <span className="pn-base" />
          </div>
          <div className="pn-core-label"><Building2 size={15} /><strong>SBRE</strong><span>COORDINATION</span></div>
        </div>

        {roles.slice(0, 4).map((role, index) => {
          const Icon = role.icon;
          const isActive = active.key === role.key || active.key === "together";
          return (
            <div className={`pn-node pn-node-${role.key} ${isActive ? "is-active" : ""}`} key={role.key}>
              <span className="pn-node-index">0{index + 1}</span>
              <span className="pn-node-icon"><Icon size={18} strokeWidth={1.5} /></span>
              <div><small>{role.accent}</small><strong>{role.eyebrow.replace("VOUS ÊTES ", "").replace(" ?", "")}</strong></div>
            </div>
          );
        })}

        <div className="pn-packet packet-a" />
        <div className="pn-packet packet-b" />
        <div className="pn-packet packet-c" />
        <div className="pn-packet packet-d" />

        <div className="pn-status status-top">PLANS VALIDÉS <span>✓</span></div>
        <div className="pn-status status-right">INTERFACES <span>OK</span></div>
        <div className="pn-status status-bottom">DÉCISIONS <span>TRACÉES</span></div>
      </div>

      <div className="pn-stage-badge" key={`${active.key}-badge`}>
        <span className="pn-stage-icon"><ActiveIcon size={18} strokeWidth={1.5} /></span>
        <div><small>CONNEXION ACTIVE</small><strong>{active.accent}</strong></div>
      </div>

      <div className="pn-progress" aria-label="Séquence de collaboration">
        {roles.map((role, index) => (
          <button
            key={role.key}
            type="button"
            aria-label={`Afficher l’étape ${index + 1}`}
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
