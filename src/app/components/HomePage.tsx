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
              Explorez les étapes d’une construction. Modèle architectural
              d’illustration.
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
            decoding="async"
            alt="Chantier intérieur en cours, réseaux et structure apparents"
          />
          <div>
            <p className="eyebrow">LE TERRAIN NE LAISSE RIEN AU HASARD</p>
            <h2>
              Anticiper aujourd’hui.
              <br />
              <em>Éviter les reprises demain.</em>
            </h2>
            <button className="text-link" onClick={() => section("situations")}>
              Notre manière d’intervenir ↗
            </button>
          </div>
          <span className="image-caption">
            COORDINATION / AVANT FERMETURE DES OUVRAGES
          </span>
        </section>
        <section className="section case-section" id="situations">
          <div className="section-heading">
            <p className="eyebrow">02 / REPRENDRE LA MAÎTRISE</p>
            <h2>
              Des situations concrètes.
              <br />
              <em>Des réponses structurées.</em>
            </h2>
            <p>
              Exemples de méthode appliqués aux enjeux courants d’un chantier.
              Ces scénarios illustratifs ne constituent pas des résultats
              clients attestés.
            </p>
          </div>
          <div className="case-tabs" aria-label="Choisir une situation">
            {cases.map((c, i) => (
              <button
                key={c.label}
                aria-pressed={activeCase === i}
                onClick={() => setCase(i)}
              >
                <span>0{i + 1}</span>
                {c.label}
                <span>↗</span>
              </button>
            ))}
          </div>
          <article className="case-study">
            <div className="case-image">
              <img
                src={item.image}
                alt={
                  item.label === "Coordination des CFC"
                    ? "Réseaux et structure sur un chantier de rénovation"
                    : item.label === "Délais & anticipation"
                      ? "Bâtiment résidentiel à Lancy"
                      : "Salle d’eau et détails de finition"
                }
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="eyebrow">SITUATION / 0{activeCase + 1}</p>
                <h3>{item.title}</h3>
              </div>
            </div>
            <div className="case-steps">
              {[
                ["Problème", item.problem],
                ["Analyse", item.analysis],
                ["Action", item.action],
                ["Résultat visé", item.result],
              ].map(([label, text], i) => (
                <div key={label}>
                  <span className="step-index">0{i + 1}</span>
                  <div>
                    <h4>{label}</h4>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
              <p className="case-deliverable">LIVRABLE / {item.deliverable}</p>
            </div>
          </article>
        </section>
        <section className="section projects-section" id="réalisations">
          <div className="section-heading">
            <p className="eyebrow">03 / EXPÉRIENCES PROJET</p>
            <h2>
              La maîtrise se voit
              <br />
              <em>dans le résultat.</em>
            </h2>
            <p>
              Une sélection d’expériences de direction et de suivi de travaux.
              Les collaborations et contextes sont précisés dans chaque fiche
              projet.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((p, i) => (
              <Link className="project-card" key={p.link} to={p.link}>
                <div>
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="project-arrow">↗</span>
                </div>
                <p className="eyebrow">
                  0{i + 1} / {p.type}
                </p>
                <h3>{p.title}</h3>
              </Link>
            ))}
          </div>
        </section>
        <section className="section method-section" id="methode">
          <div className="method-intro">
            <p className="eyebrow">04 / UNE MÉTHODE, DU DÉBUT À LA FIN</p>
            <h2>
              Rien d’implicite.
              <br />
              <em>Tout se pilote.</em>
            </h2>
            <p>
              Un chantier maîtrisé repose sur des points de contrôle réguliers
              et des responsabilités claires.
            </p>
            <button
              className="button button-light"
              onClick={() => section("contact")}
            >
              Cadrons votre opération ↗
            </button>
          </div>
          <div className="method-list">
            {[
              [
                "Cadrer",
                "Analyser le dossier, clarifier les objectifs, identifier les risques et définir le périmètre du mandat.",
                "Diagnostic · Budget · Priorités",
              ],
              [
                "Préparer",
                "Métrer, consulter, comparer les offres et préparer les adjudications avec un planning cohérent.",
                "Soumissions · Comparatifs · Planning",
              ],
              [
                "Piloter",
                "Coordonner les CFC, contrôler les coûts, traiter les modifications et suivre les décisions sur le terrain.",
                "Séances · Contrôles · Reporting",
              ],
              [
                "Livrer",
                "Organiser les réceptions, suivre la levée des réserves et réunir les pièces de clôture.",
                "Réception · Réserves · Dossier final",
              ],
            ].map(([title, body, foot], i) => (
              <details key={title} open={i === 0}>
                <summary>
                  <span>0{i + 1}</span>
                  {title}
                  <b>+</b>
                </summary>
                <div>
                  <p>{body}</p>
                  <small>{foot}</small>
                </div>
              </details>
            ))}
          </div>
        </section>
        <section className="section team-section" id="equipe">
          <div className="section-heading">
            <p className="eyebrow">05 / AU PLUS PRÈS DU TERRAIN</p>
            <h2>
              Une direction présente.
              <br />
              <em>Des rôles identifiés.</em>
            </h2>
            <p>
              Soufiane est votre interlocuteur pour cadrer le mandat et
              organiser le pilotage de votre opération.
            </p>
          </div>
          <div className="team-grid">
            {[
              [
                soufiane,
                "Soufiane",
                "Directeur",
                "Cadrage du mandat, arbitrages et direction des opérations.",
              ],
              [
                chef,
                "Chef de projet",
                "Profil provisoire · illustration IA",
                "Organisation, planification et coordination des intervenants.",
              ],
              [
                conducteur,
                "Conducteur de travaux",
                "Profil provisoire · illustration IA",
                "Suivi terrain, contrôle de l’exécution et préparation des réceptions.",
              ],
            ].map(([src, name, role, description], i) => (
              <article className="team-card" key={name}>
                <div>
                  <img
                    src={src}
                    alt={
                      i === 0
                        ? "Soufiane, directeur de SBRE Ingénierie"
                        : `Portrait fictif de ${name.toLowerCase()}`
                    }
                    loading="lazy"
                    decoding="async"
                  />
                  {i > 0 && (
                    <span className="provisional">PORTRAIT DE MAQUETTE</span>
                  )}
                </div>
                <h3>{name}</h3>
                <p className="team-role">{role}</p>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <p className="team-note">
            Les deux profils provisoires illustrent l’organisation envisagée.
            Ils ne représentent pas des collaborateurs actuellement confirmés.
          </p>
        </section>
        <section className="section contact-section" id="contact">
          <div>
            <p className="eyebrow">06 / PARLONS CONCRÈTEMENT</p>
            <h2>
              Où en est
              <br />
              <em>votre projet ?</em>
            </h2>
            <p>
              Une opération à préparer, un chantier à coordonner ou une
              situation à reprendre en main. Commençons par les faits.
            </p>
            <a className="contact-phone" href="tel:+41783076029">
              +41 78 307 60 29 ↗
            </a>
            <a href="mailto:info@sbre-ingenierie.ch">info@sbre-ingenierie.ch</a>
            <div className="contact-area">
              LAUSANNE · GENÈVE · VAUD
              <br />
              Interventions en Suisse romande
            </div>
          </div>
          <ContactForm />
        </section>
        <section className="section faq-section">
          <p className="eyebrow">LES QUESTIONS ESSENTIELLES</p>
          {[
            [
              "À quel moment faire intervenir SBRE ?",
              "Dès la préparation du projet pour organiser les consultations et le planning, ou en cours de travaux pour clarifier une situation et redéfinir les priorités. Le périmètre est fixé au début du mandat.",
            ],
            [
              "Travaillez-vous avec mon architecte ?",
              "Oui. La direction de travaux se coordonne avec l’architecte et les mandataires techniques, dans le respect des responsabilités de chacun.",
            ],
            [
              "Comment sont définis vos honoraires ?",
              "Sur la base du périmètre, de la durée, de la complexité et de la présence terrain nécessaire. Une offre précise les prestations, les livrables et les conditions du mandat.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
      <footer className="site-footer">
        <div>
          <span className="footer-brand">
            SBRE<span>INGÉNIERIE</span>
          </span>
          <p>Structurer. Budgéter. Réaliser. Exiger.</p>
        </div>
        <div>
          <p>Direction de travaux en Suisse romande</p>
          <a href="mailto:info@sbre-ingenierie.ch">
            info@sbre-ingenierie.ch ↗
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SBRE Ingénierie</span>
          <span>Les décisions justes. Au bon moment.</span>
          <button onClick={() => section("accueil")}>Retour en haut ↑</button>
        </div>
      </footer>
    </div>
  );
}
