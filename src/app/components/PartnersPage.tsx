import { FormEvent, MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ArrowRight } from "lucide-react";
import SEOHead from "./SEOHead";
import PartnerArchitecture from "./premium/PartnerArchitecture";
import PartnerScrollStory from "./premium/PartnerScrollStory";
import PartnerProfileCards from "./premium/PartnerProfileCards";
import logo from "../../media/Pr_sentation1_page-0001.webp";
import "../../styles/partners-page.css";
import "../../styles/partners-page-polish.css";

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
            <span>01 — 03</span>
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
              Comment nous collaborons : choisissez un profil, puis cliquez sur
              la carte pour découvrir notre manière de travailler ensemble.
            </p>
          </div>

          <PartnerProfileCards
            profiles={profiles}
            onSelect={(profile, event) => {
              setSelected(profile.title);
              setDraftHref(null);
              jump(event, "partner-form");
            }}
          />
        </section>

        <section
          className="pr-form-section pr-section"
          id="partner-form"
          tabIndex={-1}
          aria-labelledby="pr-form-title"
        >
          <div className="pr-form-intro">
            <p className="pr-eyebrow">03 — Faisons connaissance</p>
            <h2 id="pr-form-title">
              Une collaboration
              <br />
              commence par
              <br />
              <em>une conversation.</em>
            </h2>
            <p>
              Présentez-nous votre activité, votre savoir-faire et le type de
              collaboration que vous recherchez avec SBRE.
            </p>
            <a className="pr-link" href="mailto:info@sbre-ingenierie.ch">
              info@sbre-ingenierie.ch <ArrowUpRight size={16} />
            </a>
            <p className="pr-form-aside">
              Chaque profil est étudié individuellement avant une première mise
              en relation sur nos opérations.
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
                Nom / prénom *
                <input
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Jean Dupont"
                />
              </label>
              <label>
                Société *
                <input
                  name="company"
                  required
                  autoComplete="organization"
                  placeholder="Entreprise SA"
                />
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
                  placeholder="jean@entreprise.ch"
                />
              </label>
              <label>
                Téléphone
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="+41 79 000 00 00"
                />
              </label>
            </div>

            <div className="pr-field-row">
              <label>
                Métier / spécialité / CFC *
                <input
                  name="speciality"
                  required
                  placeholder="Ex. CFC 271 — Plâtrerie / peinture"
                />
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
              <input
                name="website"
                type="url"
                placeholder="https://entreprise.ch"
              />
            </label>

            <label>
              Références éventuelles
              <textarea
                name="references"
                rows={2}
                placeholder="2–3 références significatives, typologie de projets…"
              />
            </label>

            <label>
              Votre message *
              <textarea
                name="message"
                rows={3}
                required
                placeholder="Présentez votre activité, vos forces et le type de collaboration recherché…"
              />
            </label>

            <p className="pr-form-note">
              * Champs requis. Votre candidature est préparée pour transmission
              à SBRE Ingénierie. Aucune donnée n’est publiée sur le site.
            </p>

            {draftHref ? (
              <div role="status">
                <p className="pr-draft-status">
                  Votre candidature est prête. Ouvrez votre messagerie pour
                  l’envoyer.
                </p>
                <a className="pr-button" href={draftHref}>
                  Ouvrir ma candidature <ArrowUpRight size={17} />
                </a>
              </div>
            ) : (
              <button type="submit" className="pr-button">
                Préparer ma candidature <ArrowRight size={17} />
              </button>
            )}
          </form>
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
