import { FormEvent, MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import SEOHead from "./SEOHead";
import PartnerArchitecture from "./premium/PartnerArchitecture";
import PartnerScrollStory from "./premium/PartnerScrollStory";
import logo from "../../media/Pr_sentation1_page-0001.webp";
import "../../styles/partners-page.css";

const profiles = [
  {
    title: "Architectes",
    subtitle: "De l’intention au terrain.",
    text: "Un relais opérationnel pour préserver la cohérence du projet, suivre les validations et rendre les détails exécutables.",
    services: "Direction de travaux · Consultations · Réceptions",
  },
  {
    title: "Entreprises",
    subtitle: "Les bonnes conditions pour réaliser.",
    text: "Des consultations ciblées, des séquences claires et des interfaces anticipées pour organiser les interventions sur le chantier.",
    services: "Appels d’offres · Planning · Coordination des CFC",
  },
  {
    title: "Maîtres d’ouvrage",
    subtitle: "Une lecture claire pour décider.",
    text: "Des informations structurées sur les coûts, les délais et les risques, pour arbitrer avec une vision concrète de l’avancement.",
    services: "Suivi des coûts · Décisions · Reporting",
  },
  {
    title: "Directions de travaux",
    subtitle: "Un renfort au plus près du projet.",
    text: "Une extension de votre équipe sur les phases qui demandent davantage de présence, de contrôle et de suivi des interfaces.",
    services: "Renfort terrain · Contrôle qualité · Suivi des réserves",
  },
];
const values = [
  [
    "Des responsabilités claires",
    "Chaque sujet trouve son interlocuteur. Les rôles et les engagements sont définis.",
  ],
  [
    "Une information structurée",
    "Les bonnes informations circulent entre études, décisions et exécution.",
  ],
  [
    "Des décisions tracées",
    "Les validations, les écarts et leurs conséquences restent documentés.",
  ],
  [
    "Des interfaces maîtrisées",
    "Les interventions s’articulent. Les points de rencontre sont anticipés.",
  ],
  [
    "Une présence terrain",
    "Le suivi se nourrit de la réalité du chantier, des contrôles et du dialogue.",
  ],
  [
    "Coûts, délais, qualité",
    "Trois dimensions suivies ensemble, à chaque phase du projet.",
  ],
];

// HashRouter owns the URL fragment. Native #anchors would otherwise leave the route.
function jump(event: MouseEvent<HTMLAnchorElement>, id: string) {
  event.preventDefault();
  document
    .getElementById(id)
    ?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  document.getElementById(id)?.focus({ preventScroll: true });
}

export default function PartnersPage() {
  const [selected, setSelected] = useState("Architectes");
  const [draftHref, setDraftHref] = useState<string | null>(null);

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = [
      "Bonjour SBRE Ingénierie,",
      "",
      "Je souhaite vous proposer une collaboration.",
      "",
      `Profil : ${selected}`,
      ...[
        ["Nom / prénom", "name"],
        ["Société", "company"],
        ["E-mail", "email"],
        ["Téléphone", "phone"],
        ["Métier / spécialité / CFC", "speciality"],
        ["Zone d’intervention", "area"],
        ["Site internet", "website"],
        ["Références", "references"],
        ["Message", "message"],
      ].map(([label, key]) => `${label} : ${data.get(key) ?? ""}`),
      "",
      "Cordialement,",
      String(data.get("name") ?? ""),
    ].join("\n");
    setDraftHref(
      `mailto:info@sbre-ingenierie.ch?subject=${encodeURIComponent(`Proposition de collaboration SBRE — ${selected}`)}&body=${encodeURIComponent(body)}`,
    );
  }

  return (
    <div className="pr-page">
      <SEOHead
        title="Partenaires | SBRE Ingénierie — Une même direction"
        description="Architectes, entreprises, maîtres d’ouvrage et directions de travaux : construisons une collaboration claire et maîtrisée en Suisse romande."
        canonical="/partenaires"
      />
      <a
        className="pr-skip"
        href="#pr-main"
        onClick={(event) => jump(event, "pr-main")}
      >
        Aller au contenu
      </a>
      <header className="pr-header">
        <Link
          to="/"
          className="pr-brand"
          aria-label="SBRE Ingénierie — Accueil"
        >
          <img src={logo} alt="SBRE Ingénierie" />
        </Link>
        <nav aria-label="Navigation partenaires">
          <Link to="/">Accueil</Link>
          <a
            href="#coordination"
            onClick={(event) => jump(event, "coordination")}
          >
            Notre approche
          </a>
          <a href="#profils" onClick={(event) => jump(event, "profils")}>
            Collaborations
          </a>
        </nav>
        <a
          className="pr-header-contact"
          href="#partner-form"
          onClick={(event) => jump(event, "partner-form")}
        >
          Entrons en contact <ArrowUpRight size={17} />
        </a>
      </header>
      <main id="pr-main" tabIndex={-1}>
        <section className="pr-hero" aria-labelledby="pr-hero-title">
          <div className="pr-hero-top">
            <p className="pr-eyebrow">SBRE Ingénierie / Le réseau</p>
            <span>Direction de travaux · Suisse romande</span>
          </div>
          <div className="pr-hero-body">
            <div className="pr-hero-copy">
              <p className="pr-eyebrow pr-hero-overline">
                <span /> Ensemble, du plan au terrain.
              </p>
              <h1 id="pr-hero-title">
                Rejoignez
                <br />
                le réseau <em>SBRE.</em>
              </h1>
              <p className="pr-lead">
                Nous collaborons avec celles et ceux qui conçoivent, décident,
                réalisent et pilotent les projets.
              </p>
              <div className="pr-actions">
                <a
                  className="pr-button"
                  href="#partner-form"
                  onClick={(event) => jump(event, "partner-form")}
                >
                  Devenir partenaire <ArrowUpRight size={18} />
                </a>
                <a className="pr-link" href="tel:+41783076029">
                  Demander un entretien <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
            <figure className="pr-hero-visual">
              <span className="pr-drawing-note">
                ÉTUDE DE COORDINATION
                <br />
                VOLUMES / INTERFACES / LIENS
              </span>
              <PartnerArchitecture />
              <figcaption>
                <span>Des expertises qui se rencontrent.</span>
                <span>Une vision qui prend forme.</span>
              </figcaption>
            </figure>
          </div>
          <div className="pr-hero-bottom">
            <a
              href="#coordination"
              onClick={(event) => jump(event, "coordination")}
            >
              <ArrowDown size={16} /> Explorer notre approche
            </a>
            <p>Concevoir. Exécuter. Décider. Coordonner.</p>
            <span>01 — 05</span>
          </div>
        </section>
        <PartnerScrollStory />
        <section
          className="pr-collaboration pr-section"
          id="profils"
          tabIndex={-1}
          aria-labelledby="pr-profiles-title"
        >
          <div className="pr-section-heading">
            <p className="pr-eyebrow">02 — Les collaborations</p>
            <h2 id="pr-profiles-title">
              Votre expertise.
              <br />
              <em>Notre point de rencontre.</em>
            </h2>
            <p>
              Comment nous collaborons : un rôle précis pour chacun, une
              exigence commune pour le projet.
            </p>
          </div>
          <div className="pr-profile-list">
            {profiles.map((profile, i) => (
              <article className="pr-profile" key={profile.title}>
                <span className="pr-profile-index">0{i + 1}</span>
                <div className="pr-profile-title">
                  <h3>{profile.title}</h3>
                  <p>{profile.subtitle}</p>
                </div>
                <svg
                  className="pr-profile-drawing"
                  viewBox="0 0 130 100"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d={
                      [
                        "M15 72L57 18L116 47L74 86ZM38 64L63 32L95 48L70 73ZM57 18V53L74 86",
                        "M20 77V32L62 12L112 38V82M20 32L67 57L112 38M67 57V94M20 48L67 73L112 54M20 64L67 89L112 70",
                        "M20 70L63 92L112 65L70 44ZM20 47L63 69L112 42L70 21ZM20 47V70M112 42V65M63 69V92",
                        "M12 50H47L67 24L115 50L68 77L47 50M67 24V5M115 50H130M68 77V98",
                      ][i]
                    }
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <circle cx="67" cy="50" r="3" fill="currentColor" />
                </svg>
                <div className="pr-profile-copy">
                  <p>{profile.text}</p>
                  <span>{profile.services}</span>
                  <a
                    href="#partner-form"
                    className="pr-link"
                    onClick={(event) => {
                      setSelected(profile.title);
                      setDraftHref(null);
                      jump(event, "partner-form");
                    }}
                  >
                    Échanger sur une collaboration <ArrowUpRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="pr-value pr-section"
          aria-labelledby="pr-value-title"
        >
          <div className="pr-value-intro">
            <p className="pr-eyebrow">03 — L’exigence SBRE</p>
            <h2 id="pr-value-title">
              La coordination
              <br />
              se mesure à<br />
              <em>la clarté du terrain.</em>
            </h2>
            <p>
              Ce que SBRE apporte au projet : une méthode lisible, un suivi
              concret et une attention constante aux détails d’exécution.
            </p>
            <span className="pr-value-signature">
              Structurer · Budgéter · Réaliser · Exiger
            </span>
          </div>
          <div className="pr-values">
            {values.map(([title, text], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section
          className="pr-form-section pr-section"
          id="partner-form"
          tabIndex={-1}
          aria-labelledby="pr-form-title"
        >
          <div className="pr-form-intro">
            <p className="pr-eyebrow">04 — Faisons connaissance</p>
            <h2 id="pr-form-title">
              Une collaboration
              <br />
              commence par
              <br />
              <em>une conversation.</em>
            </h2>
            <p>
              Présentez-nous votre activité, votre projet ou le renfort dont
              vous avez besoin.
            </p>
            <a className="pr-link" href="mailto:info@sbre-ingenierie.ch">
              info@sbre-ingenierie.ch <ArrowUpRight size={16} />
            </a>
            <p className="pr-form-aside">
              Toute demande est étudiée avant intégration au réseau SBRE.
            </p>
          </div>
          <form
            className="pr-form"
            onSubmit={prepareEmail}
            onChange={() => setDraftHref(null)}
          >
            <label>
              Vous êtes
              <select
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
                name="profile"
              >
                {[
                  ...profiles.map((p) => p.title),
                  "Bureaux d’études & spécialistes",
                  "Autre profil",
                ].map((title) => (
                  <option key={title}>{title}</option>
                ))}
              </select>
            </label>
            <div className="pr-field-row">
              <label>
                Nom / prénom *<input name="name" required autoComplete="name" />
              </label>
              <label>
                Société *
                <input name="company" required autoComplete="organization" />
              </label>
            </div>
            <div className="pr-field-row">
              <label>
                E-mail *
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                Téléphone
                <input name="phone" type="tel" autoComplete="tel" />
              </label>
            </div>
            <div className="pr-field-row">
              <label>
                Métier / spécialité / CFC *<input name="speciality" required />
              </label>
              <label>
                Zone d’intervention *
                <input
                  name="area"
                  required
                  placeholder="Vaud, Genève, Suisse romande…"
                />
              </label>
            </div>
            <label>
              Site internet
              <input name="website" type="url" placeholder="https://" />
            </label>
            <label>
              Références éventuelles
              <textarea name="references" rows={2} />
            </label>
            <label>
              Votre message *
              <textarea
                name="message"
                rows={3}
                required
                placeholder="Votre activité, votre projet, vos attentes…"
              />
            </label>
            <p className="pr-form-note">
              * Champs requis. Ce formulaire prépare un e-mail à envoyer depuis
              votre messagerie. Aucune donnée n’est stockée sur ce site.
            </p>
            {draftHref ? (
              <div role="status">
                <p className="pr-draft-status">
                  Votre e-mail est prêt. Ouvrez votre messagerie pour l’envoyer.
                </p>
                <a className="pr-button" href={draftHref}>
                  Ouvrir mon e-mail préparé <ArrowUpRight size={17} />
                </a>
              </div>
            ) : (
              <button type="submit" className="pr-button">
                Préparer ma demande <ArrowRight size={17} />
              </button>
            )}
          </form>
        </section>
        <section className="pr-final" aria-labelledby="pr-final-title">
          <p className="pr-eyebrow">Le prochain projet commence ici.</p>
          <h2 id="pr-final-title">
            Un projet
            <br />à <em>structurer ?</em>
          </h2>
          <div className="pr-actions">
            <a className="pr-button pr-button-light" href="tel:+41783076029">
              Parler à SBRE <ArrowUpRight size={18} />
            </a>
            <a
              className="pr-link"
              href="#partner-form"
              onClick={(event) => jump(event, "partner-form")}
            >
              Devenir partenaire <ArrowUpRight size={18} />
            </a>
          </div>
          <span className="pr-final-mark" aria-hidden="true">
            SBRE.
          </span>
        </section>
      </main>
      <footer className="pr-footer">
        <Link to="/" className="pr-footer-brand">
          SBRE<span>INGÉNIERIE</span>
        </Link>
        <p>
          Direction de travaux
          <br />
          Suisse romande
        </p>
        <div>
          <a href="mailto:info@sbre-ingenierie.ch">info@sbre-ingenierie.ch</a>
          <a href="tel:+41783076029">+41 78 307 60 29</a>
        </div>
        <Link to="/">
          Retour à l’accueil <ArrowUpRight size={15} />
        </Link>
      </footer>
    </div>
  );
}
