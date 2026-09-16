import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { ArrowRight, Gauge, Layers3, ShieldCheck } from "lucide-react";
import "../../../styles/partner-impact-story.css";

function useAnimatedValue(active: boolean, target: number, duration = 1200) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setValue(target);
      return;
    }

    let frame = 0;
    let startedAt = 0;
    const tick = (now: number) => {
      if (!startedAt) startedAt = now;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration]);

  return value;
}

function ImpactStory() {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const basePeak = useAnimatedValue(visible, 100, 1200);
  const reinforcedPeak = useAnimatedValue(visible, 64, 1500);
  const relief = useAnimatedValue(visible, 36, 1700);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.28 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`partner-impact-story ${visible ? "is-visible" : ""}`} aria-labelledby="impact-title">
      <div className="impact-heading impact-reveal">
        <p className="impact-kicker">01 / RENFORT OPÉRATIONNEL</p>
        <h2 id="impact-title">Renforcer l’équipe au moment où<br /><em>le projet en a besoin.</em></h2>
        <p>
          Une direction de travaux externe peut intervenir comme extension de l’équipe projet pour absorber
          les phases de forte intensité, structurer les interfaces et maintenir le pilotage terrain.
        </p>
      </div>

      <div className="impact-console impact-reveal" aria-label="Illustration de la charge projet avec et sans renfort opérationnel">
        <div className="impact-console-top">
          <div>
            <span className="impact-live"><i /> SCÉNARIO DE CHARGE PROJET</span>
            <strong>Capacité interne & renfort SBRE</strong>
          </div>
          <span className="impact-badge">INDICE ILLUSTRATIF · BASE 100</span>
        </div>

        <div className="impact-chart-wrap">
          <div className="impact-y-label">INTENSITÉ DE PILOTAGE</div>
          <svg className="impact-chart" viewBox="0 0 980 410" role="img" aria-label="Courbes illustratives de charge interne et de charge avec renfort SBRE">
            <defs>
              <linearGradient id="impactArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.24" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g className="impact-grid">
              {[65, 130, 195, 260, 325].map((y) => <line key={y} x1="60" x2="950" y1={y} y2={y} />)}
              {[60, 238, 416, 594, 772, 950].map((x) => <line key={x} x1={x} x2={x} y1="45" y2="335" />)}
            </g>
            <path className="impact-area" d="M60 280 C145 270 165 245 238 225 S350 145 416 130 S520 72 594 92 S700 150 772 174 S875 220 950 246 L950 335 L60 335 Z" />
            <path className="impact-line impact-line-base" pathLength="1" d="M60 280 C145 270 165 245 238 225 S350 145 416 130 S520 72 594 92 S700 150 772 174 S875 220 950 246" />
            <path className="impact-line impact-line-reinforced" pathLength="1" d="M60 286 C145 278 170 258 238 244 S350 190 416 180 S520 150 594 158 S700 180 772 194 S875 228 950 250" />
            <circle className="impact-point impact-point-a" cx="594" cy="92" r="7" />
            <circle className="impact-point impact-point-b" cx="594" cy="158" r="7" />
          </svg>

          <div className="impact-tooltip impact-tooltip-a">
            <span className="impact-tooltip-icon"><Gauge size={15} /></span>
            <div><strong>Pic de charge</strong><p>Les phases d’exécution concentrent coordination, arbitrages, contrôles et décisions.</p></div>
          </div>
          <div className="impact-tooltip impact-tooltip-b">
            <span className="impact-tooltip-icon"><Layers3 size={15} /></span>
            <div><strong>Capacité additionnelle</strong><p>Le renfort absorbe une partie du pilotage sans créer une structure permanente supplémentaire.</p></div>
          </div>
        </div>

        <div className="impact-phases" aria-hidden="true">
          <span>APPEL D’OFFRES</span><span>ADJUDICATION</span><span>EXÉCUTION</span><span>RÉCEPTION</span>
        </div>

        <div className="impact-legend">
          <span><i className="legend-base" /> Équipe interne seule</span>
          <span><i className="legend-reinforced" /> Équipe + renfort SBRE</span>
        </div>

        <div className="impact-metrics">
          <article><small>PIC INTERNE</small><strong>{basePeak}</strong><span>indice de charge illustratif</span></article>
          <article><small>AVEC RENFORT</small><strong>{reinforcedPeak}</strong><span>répartition illustrée de la charge</span></article>
          <article className="impact-metric-accent"><small>CAPACITÉ DÉPORTÉE</small><strong>{relief}%</strong><span>dans ce scénario pédagogique</span></article>
        </div>
        <p className="impact-disclaimer">Schéma pédagogique destiné à illustrer un principe de renfort opérationnel. Les valeurs ne constituent ni une mesure de performance réelle ni une garantie de résultat.</p>
      </div>

      <div className="impact-benefits">
        <article className="impact-reveal"><ShieldCheck size={22} /><span>01</span><h3>Continuité du pilotage</h3><p>Les sujets terrain continuent d’être suivis même lorsque la charge du projet augmente.</p></article>
        <article className="impact-reveal"><Layers3 size={22} /><span>02</span><h3>Interfaces structurées</h3><p>Entreprises, mandataires et décisions sont reliés dans une même logique de coordination.</p></article>
        <article className="impact-reveal"><Gauge size={22} /><span>03</span><h3>Renfort ciblé</h3><p>La capacité est mobilisée sur les phases qui demandent réellement plus de présence et de contrôle.</p></article>
      </div>

      <a className="impact-link impact-reveal" href="#profils">Voir les formes de collaboration <ArrowRight size={16} /></a>
    </section>
  );
}

export default function PartnerImpactStory() {
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
      const hero = document.querySelector<HTMLElement>(".partners-page .partners-hero");
      if (!hero) return false;
      let mount = document.querySelector<HTMLElement>("[data-sbre-partner-impact]");
      if (!mount) {
        mount = document.createElement("div");
        mount.dataset.sbrePartnerImpact = "true";
        hero.insertAdjacentElement("afterend", mount);
      }
      if (!disposed) setHost(mount);
      return true;
    };

    if (attach()) return () => { disposed = true; };
    const observer = new MutationObserver(() => {
      if (attach()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      disposed = true;
      observer.disconnect();
      document.querySelector("[data-sbre-partner-impact]")?.remove();
    };
  }, [isPartners]);

  useEffect(() => {
    if (!isPartners) return;
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".partners-page .partners-section, .partners-page .partners-final-cta, .partners-page .partner-profile-card"));
    nodes.forEach((node) => node.classList.add("partners-scroll-reveal"));
    if (reduceMotion) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [isPartners, host]);

  return host ? createPortal(<ImpactStory />, host) : null;
}
