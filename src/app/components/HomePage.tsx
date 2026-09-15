import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import SEOHead from "./SEOHead";
import Architecture, { phases } from "./premium/Architecture";
import ContactForm from "./premium/ContactForm";
import { useReveal } from "./premium/useReveal";
import { cases, projects } from "./premium/content";
import logo from "../../media/Pr_sentation1_page-0001.webp";
import soufiane from "../../media/84866ccc-3981-49bb-9de4-bd675f0f41e1.webp";
import chef from "../../media/chef-projet-provisoire.webp";
import conducteur from "../../media/conducteur-provisoire.webp";
import chantier from "../../media/1748964038069-1.webp";
const nav = [
  ["expertises", "Expertises"],
  ["réalisations", "Réalisations"],
  ["methode", "Méthode"],
  ["equipe", "Équipe"],
];
export default function HomePage() {
  useReveal();
  const [menu, setMenu] = useState(false),
    [phase, setPhase] = useState(3),
    [activeCase, setCase] = useState(0);
  const item = cases[activeCase];
  const location = useLocation();
  useEffect(() => {
    const target = location.hash.slice(1);
    if (target)
      requestAnimationFrame(() =>
        document.getElementById(decodeURIComponent(target))?.scrollIntoView(),
      );
  }, [location]);
  const section = (id: string) => {
    setMenu(false);
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  };
  return (
    <div className="premium-site">
      <SEOHead title="SBRE Ingénierie | Direction de travaux en Suisse romande" />
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Aller au contenu
      </a>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="SBRE Ingénierie — accueil">
          <img src={logo} alt="SBRE Ingénierie" width="180" height="66" />
        </Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          {nav.map(([id, label]) => (
            <button key={id} onClick={() => section(id)}>
              {label}
            </button>
          ))}
        </nav>
        <button className="header-contact" onClick={() => section("contact")}>
          Parlons de votre projet <span>↗</span>
        </button>
        <button
          className="menu-toggle"
          aria-expanded={menu}
          aria-controls="mobile-nav"
          onClick={() => setMenu(!menu)}
        >
          {menu ? "Fermer ✕" : "Menu ☰"}
        </button>
      </header>
      {menu && (
        <nav
          id="mobile-nav"
          className="mobile-nav"
          aria-label="Navigation mobile"
          onKeyDown={(e) => {
            if (e.key === "Escape") setMenu(false);
          }}
        >
          {[...nav, ["contact", "Contact"]].map(([id, label]) => (
            <button key={id} onClick={() => section(id)}>
              {label} ↗
            </button>
          ))}
        </nav>
      )}
      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="accueil">
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="status-dot" /> DIRECTION DE TRAVAUX · SUISSE
              ROMANDE
            </p>
            <h1>
              Chaque détail.
              <br />
              Sous <em>contrôle.</em>
            </h1>
            <p className="hero-description">
              Du premier arbitrage à la remise des clés. Nous pilotons les
              coûts, les délais et les entreprises pour conduire votre projet
              jusqu’à sa livraison.
            </p>
            <div className="hero-actions">
              <button
                className="button button-green"
                onClick={() => section("contact")}
              >
                Parlons de votre chantier <span>↗</span>
              </button>
              <button
                className="text-link"
                onClick={() => section("réalisations")}
              >
                Voir les réalisations <span>↗</span>
              </button>
            </div>
            <div className="hero-location">
              <span>LAUSANNE / GENÈVE</span>
              <span>Direction · Coordination · Livraison</span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-heading">
              <span>DE L’INTENTION À LA LIVRAISON</span>
              <span>CH — 01</span>
            </div>
            <Architecture phase={phase} />
            <div className="architecture-interaction-hint" aria-label="Mode d’emploi du modèle 3D">
              <span className="interaction-hand" aria-hidden="true">↔</span>
              <span><strong>Explorez le modèle</strong> — faites glisser pour le faire pivoter</span>
            </div>
            <div className="phase-controls" aria-label="Phases de construction">
              {phases.map((p, i) => (
                <button
                  key={p}
                  aria-pressed={phase === i}
                  onClick={() => setPhase(i)}
                >
                  <span>0{i + 1}</span>
                  {p}
                </button>
              ))}
            </div>
            <p className="model-caption">
              Cliquez sur une étape pour suivre la construction du projet.
            </p>
          </div>
        </section>
        <div className="principles">
          <span>Un interlocuteur engagé.</span>
          <span>Des décisions documentées.</span>
          <span>Une vision complète du chantier.</span>
          <button
            onClick={() => section("expertises")}
            aria-label="Découvrir les expertises"
          >
            ↓
          </button>
        </div>
        <section className="section expertise" id="expertises">
          <div className="section-heading">
            <p className="eyebrow">01 / NOTRE RÔLE</p>
            <h2>
              Votre projet mérite
              <br />
              une <em>direction claire.</em>
            </h2>
            <p>
              Architectes, maîtres d’ouvrage, propriétaires : vous gardez la
              vision. Nous organisons les décisions et leur exécution sur le
              terrain.
            </p>
          </div>
          <div className="expertise-grid">
            {[
              [
                "01",
                "Direction de travaux",
                "Faire avancer. Et vérifier.",
                "Coordination des CFC, séances de chantier, suivi des entreprises, contrôle de l’exécution et préparation de la réception.",
                "Planning · Qualité · Coordination",
              ],
              [
                "02",
                "Assistance au maître d’ouvrage",
                "Décider en connaissance de cause.",
                "Clarifier les besoins, comparer les offres, anticiper les risques et disposer d’une lecture claire des coûts et des arbitrages.",
                "Analyse · Budget · Décisions",
              ],
              [
                "03",
                "Pilotage global",
                "Relier toutes les étapes.",
                "De la consultation des entreprises à la remise finale. Montage en entreprise générale avec partenaires selon le périmètre du mandat.",
                "Consultation · Exécution · Livraison",
              ],
            ].map(([n, title, tag, body, foot]) => (
              <article className="expertise-card" key={n}>
                <div className="card-number">
                  {n}
                  <span>↗</span>
                </div>
                <h3>{title}</h3>
                <strong>{tag}</strong>
                <p>{body}</p>
                <div className="card-footer">{foot}</div>
              </article>
            ))}
          </div>
        </section>
        <section className="control-banner">
          <img
            src={chantier}
            loading="lazy"
            alt="Chantier suivi par SBRE Ingénierie"
          />
          <div className="control-banner-content">
            <p className="eyebrow">LE TERRAIN NE LAISSE RIEN AU HASARD</p>
            <h2>
              Anticiper aujourd’hui.
              <br />
              <em>Éviter les reprises demain.</em>
            </h2>
            <button className="text-link" onClick={() => section("methode")}>
              Notre manière d’intervenir <span>↗</span>
            </button>
          </div>
          <span className="control-banner-side">
            COORDINATION / AVANT FERMETURE DES OUVRAGES
          </span>
        </section>
        <section className="section case-section" id="situations">
          <div className="section-heading case-heading">
            <p className="eyebrow">02 / REPRENDRE LA MAÎTRISE</p>
            <h2>
              Des situations concrètes.
              <br />
              Des réponses <em>structurées.</em>
            </h2>
            <p>
              Exemples de méthode appliqués aux enjeux courants d’un chantier.
              Ces scénarios illustratifs ne constituent pas des résultats
              clients attestés.
            </p>
          </div>
          <div className="case-tabs" role="tablist" aria-label="Situations de chantier">
            {cases.map((entry, i) => (
              <button
                key={entry.tab}
                role="tab"
                aria-selected={activeCase === i}
                aria-pressed={activeCase === i}
                onClick={() => setCase(i)}
              >
                <span>0{i + 1}</span>
                {entry.tab}
                <b>↗</b>
              </button>
            ))}
          </div>
          <div className="case-content">
            <div className="case-image">
              <img src={item.image} alt="" loading="lazy" />
              <div>
                <small>SITUATION / 0{activeCase + 1}</small>
                <h3>{item.title}</h3>
              </div>
            </div>
            <div className="case-copy">
              {item.steps.map(([n, title, text]) => (
                <div className="case-step" key={n}>
                  <span>{n}</span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
              <div className="case-deliverable">{item.deliverable}</div>
            </div>
          </div>
        </section>
        <section className="section projects-section" id="réalisations">
          <div className="section-heading">
            <p className="eyebrow">03 / EXPÉRIENCES PROJET</p>
            <h2>
              La maîtrise se voit
              <br />
              dans le <em>résultat.</em>
            </h2>
            <p>
              Une sélection d’expériences de direction et de suivi de travaux.
              Les collaborations et contextes sont précisés dans chaque fiche projet.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <Link to={project.href} className="project-card" key={project.href}>
                <div className="project-image">
                  <img src={project.image} alt="" loading="lazy" />
                  <span>↗</span>
                </div>
                <small>0{i + 1} / {project.meta}</small>
                <h3>{project.title}</h3>
              </Link>
            ))}
          </div>
        </section>
        <section className="section method-section" id="methode">
          <div className="section-heading">
            <p className="eyebrow">04 / LA MÉTHODE SBRE</p>
            <h2>
              Structurer. Budgéter.
              <br />
              Réaliser. <em>Exiger.</em>
            </h2>
            <p>
              Une méthode de direction de travaux organisée autour des décisions,
              des coûts, de l’exécution et de la qualité finale.
            </p>
          </div>
          <div className="method-grid">
            {["Cadrer", "Préparer", "Piloter", "Livrer"].map((title, i) => (
              <details className="method-item" key={title} open={i === 0}>
                <summary>
                  <span>0{i + 1}</span>
                  <strong>{title}</strong>
                  <b>+</b>
                </summary>
                <p>
                  {i === 0 && "Objectifs, responsabilités, contraintes et organisation du projet."}
                  {i === 1 && "Consultations, comparatifs, arbitrages et préparation de l’exécution."}
                  {i === 2 && "Coordination des entreprises, suivi terrain, qualité, délais et coûts."}
                  {i === 3 && "Réceptions, réserves, contrôles des reprises et clôture du chantier."}
                </p>
              </details>
            ))}
          </div>
        </section>
        <section className="section team-section" id="equipe">
          <div className="section-heading">
            <p className="eyebrow">05 / L’ÉQUIPE</p>
            <h2>
              Une présence terrain.
              <br />
              Des décisions <em>assumées.</em>
            </h2>
            <p>
              Une équipe resserrée autour du suivi opérationnel, de la coordination
              et de la maîtrise des enjeux du projet.
            </p>
          </div>
          <div className="team-grid">
            {[
              [soufiane, "Soufiane SBRE", "Directeur"],
              [chef, "Chef de projet", "Coordination"],
              [conducteur, "Conducteur de travaux", "Suivi terrain"],
            ].map(([image, name, role]) => (
              <article className="team-card" key={name}>
                <img src={image} alt="" loading="lazy" />
                <div>
                  <h3>{name}</h3>
                  <p>{role}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="contact-section" id="contact">
          <div className="contact-copy">
            <p className="eyebrow">06 / PARLONS CONCRÈTEMENT</p>
            <h2>
              Où en est
              <br />
              votre <em>projet ?</em>
            </h2>
            <p>
              Un dossier à reprendre, une consultation à lancer, un chantier à
              sécuriser ou une réception à préparer : échangeons sur votre besoin.
            </p>
          </div>
          <ContactForm />
        </section>
      </main>
    </div>
  );
}
