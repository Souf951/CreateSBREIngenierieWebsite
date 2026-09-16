import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  DraftingCompass,
  HardHat,
  Network,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import SEOHead from "./SEOHead";
import logo from "../../media/Pr_sentation1_page-0001.webp";

type PartnerKind = "architecte" | "specialiste" | "entreprise-generale" | "entreprise";

type PartnerProfile = {
  id: PartnerKind;
  index: string;
  title: string;
  short: string;
  icon: typeof DraftingCompass;
  collaboration: string[];
};

const profiles: PartnerProfile[] = [
  {
    id: "architecte",
    index: "01",
    title: "Architectes & mandataires",
    short: "Un relais terrain structuré pour transformer les intentions du projet en décisions exécutables.",
    icon: DraftingCompass,
    collaboration: [
      "Direction et suivi des travaux",
      "Consultation et analyse des offres",
      "Coordination des CFC",
      "Contrôle des coûts et avenants",
      "Planning et suivi des décisions",
      "Réceptions et levée des réserves",
    ],
  },
  {
    id: "specialiste",
    index: "02",
    title: "Bureaux d’études & spécialistes",
    short: "Une coordination claire entre études, décisions techniques et contraintes d’exécution.",
    icon: Network,
    collaboration: [
      "Coordination interdisciplinaire",
      "Interfaces techniques et réservations",
      "Planification des interventions",
      "Suivi des validations chantier",
      "Contrôles avant fermeture des ouvrages",
      "Reporting et traçabilité des décisions",
    ],
  },
  {
    id: "entreprise-generale",
    index: "03",
    title: "Entreprises générales",
    short: "Un appui opérationnel pour renforcer le pilotage, la coordination et la maîtrise du terrain.",
    icon: Building2,
    collaboration: [
      "Renfort en direction de travaux",
      "Pilotage de lots et sous-traitants",
      "Suivi coûts, délais et qualité",
      "Coordination des interfaces",
      "Séances et reporting chantier",
      "Pré-réceptions et clôture des travaux",
    ],
  },
  {
    id: "entreprise",
    index: "04",
    title: "Entreprises & sous-traitants",
    short: "Des consultations ciblées et une organisation de chantier lisible pour travailler dans de bonnes conditions.",
    icon: HardHat,
    collaboration: [
      "Participation aux consultations",
      "Appels d’offres ciblés par CFC",
      "Clarifications avant adjudication",
      "Coordination des interventions",
      "Suivi des prestations et interfaces",
      "Collaborations sur de futures opérations",
    ],
  },
];

const values = [
  ["01", "Fiabilité", "Tenir les engagements annoncés et alerter suffisamment tôt."],
  ["02", "Qualité", "Livrer un travail maîtrisé, contrôlable et conforme aux attentes du projet."],
  ["03", "Communication", "Partager les bonnes informations au bon moment, sans zones grises."],
  ["04", "Délais", "Anticiper les interfaces et protéger le chemin critique du chantier."],
  ["05", "Transparence", "Documenter les décisions, les écarts et les conséquences."],
  ["06", "Engagement", "Chercher la solution collective plutôt que déplacer le problème."],
];

export default function PartnersPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [selected, setSelected] = useState<PartnerKind>("architecte");
  const [draftHref, setDraftHref] = useState<string | null>(null);

  const active = useMemo(
    () => profiles.find((profile) => profile.id === selected) ?? profiles[0],
    [selected],
  );

  useEffect(() => {
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setShowIntro(false);
      return;
    }
    const timer = window.setTimeout(() => setShowIntro(false), 1550);
    return () => window.clearTimeout(timer);
  }, []);

  const scrollToForm = () =>
    document.getElementById("partner-form")?.scrollIntoView({ behavior: "smooth" });

  const prepareEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `Proposition de collaboration SBRE — ${active.title}`;
    const body = [
      "Bonjour SBRE Ingénierie,",
      "",
      "Je souhaite vous proposer une collaboration.",
      "",
      `Profil : ${active.title}`,
      `Nom / prénom : ${data.get("name") ?? ""}`,
      `Société : ${data.get("company") ?? ""}`,
      `E-mail : ${data.get("email") ?? ""}`,
      `Téléphone : ${data.get("phone") ?? ""}`,
      `Métier / spécialité / CFC : ${data.get("speciality") ?? ""}`,
      `Zone d’intervention : ${data.get("area") ?? ""}`,
      `Site internet : ${data.get("website") ?? ""}`,
      `Références : ${data.get("references") ?? ""}`,
      "",
      "Message :",
      String(data.get("message") ?? ""),
      "",
      "Cordialement,",
      String(data.get("name") ?? ""),
    ].join("\n");
    setDraftHref(
      `mailto:info@sbre-ingenierie.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  return (
    <div className="partners-page">
      <SEOHead
        title="Devenir partenaire | SBRE Ingénierie Suisse romande"
        description="Architectes, mandataires, bureaux d’études et entreprises : découvrez comment collaborer avec SBRE Ingénierie sur des opérations en Suisse romande."
        canonical="/partenaires"
      />

      {showIntro && (
        <div className="partners-intro" role="status" aria-live="polite">
          <div className="partners-intro-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <p>Les belles opérations se construisent avec les bons partenaires.</p>
          <small>SBRE INGÉNIERIE · RÉSEAU PROFESSIONNEL</small>
        </div>
      )}

      <header className="partners-header">
        <Link to="/" className="partners-brand" aria-label="Retour à l’accueil SBRE Ingénierie">
          <img src={logo} alt="SBRE Ingénierie" />
        </Link>
        <nav aria-label="Navigation partenaires">
          <Link to="/">Accueil</Link>
          <a href="#profils">Profils</a>
          <a href="#collaboration">Collaborer</a>
        </nav>
        <div className="partners-header-actions">
          <a className="partners-button partners-button-ghost" href="tel:+41783076029">
            Demander un entretien
          </a>
          <button className="partners-button partners-button-solid" onClick={scrollToForm}>
            Devenir partenaire <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <main>
        <section className="partners-hero">
          <div className="partners-blueprint" aria-hidden="true">
            <span className="bp-line bp-line-a" />
            <span className="bp-line bp-line-b" />
            <span className="bp-node bp-node-a" />
            <span className="bp-node bp-node-b" />
          </div>
          <div className="partners-hero-copy">
            <p className="partners-kicker"><span /> COLLABORATIONS · SUISSE ROMANDE</p>
            <h1>Rejoignez le<br /><em>réseau SBRE.</em></h1>
            <p className="partners-lead">
              Nous développons des collaborations durables avec les professionnels qui conçoivent,
              étudient et réalisent les projets. L’objectif : des responsabilités claires, de bonnes
              interfaces et une exécution maîtrisée sur le terrain.
            </p>
            <div className="partners-hero-actions">
              <button className="partners-button partners-button-solid" onClick={scrollToForm}>
                Devenir partenaire <ArrowRight size={17} />
              </button>
              <a className="partners-button partners-button-ghost" href="tel:+41783076029">
                Demander un entretien
              </a>
            </div>
          </div>
          <div className="partners-hero-visual" aria-label="Principe du réseau SBRE">
            <div className="network-core">
              <img src={logo} alt="" />
              <strong>SBRE</strong>
              <span>PILOTAGE</span>
            </div>
            {["ARCHI", "ÉTUDES", "ENTREPRISE", "TERRAIN"].map((label, index) => (
              <div className={`network-satellite satellite-${index + 1}`} key={label}>
                <span>0{index + 1}</span>{label}
              </div>
            ))}
            <svg viewBox="0 0 600 440" aria-hidden="true">
              <path d="M300 220 L112 88 M300 220 L490 92 M300 220 L495 348 M300 220 L110 350" />
              <circle cx="300" cy="220" r="145" />
            </svg>
          </div>
          <div className="partners-hero-foot">
            <span>LAUSANNE · GENÈVE · VAUD</span>
            <span>Architecture · Ingénierie · Entreprises · Direction de travaux</span>
          </div>
        </section>

        <section className="partners-section partners-profiles" id="profils">
          <div className="partners-section-heading">
            <p className="partners-kicker">01 / VOTRE PROFIL</p>
            <h2>Une collaboration différente<br /><em>selon votre rôle.</em></h2>
            <p>Sélectionnez votre profil. Les possibilités de collaboration s’adaptent immédiatement.</p>
          </div>
          <div className="partner-profile-grid">
            {profiles.map((profile) => {
              const Icon = profile.icon;
              const current = profile.id === selected;
              return (
                <button
                  type="button"
                  key={profile.id}
                  className={current ? "partner-profile-card is-active" : "partner-profile-card"}
                  aria-pressed={current}
                  onClick={() => setSelected(profile.id)}
                >
                  <div className="profile-card-top"><span>{profile.index}</span><Icon size={27} strokeWidth={1.35} /></div>
                  <h3>{profile.title}</h3>
                  <p>{profile.short}</p>
                  <span className="profile-card-link">Voir les possibilités <ArrowRight size={15} /></span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="partners-section partners-collaboration" id="collaboration">
          <div className="collaboration-aside">
            <p className="partners-kicker">02 / COLLABORER</p>
            <span className="collaboration-index">{active.index}</span>
            <h2>{active.title}</h2>
            <p>{active.short}</p>
            <button className="partners-text-link" onClick={scrollToForm}>Présenter votre société <ArrowRight size={16} /></button>
          </div>
          <div className="collaboration-list">
            {active.collaboration.map((item, index) => (
              <div key={item}><span>0{index + 1}</span><p>{item}</p><ArrowRight size={17} /></div>
            ))}
          </div>
        </section>

        <section className="partners-section partners-values">
          <div className="partners-section-heading">
            <p className="partners-kicker">03 / NOS REPÈRES COMMUNS</p>
            <h2>Une bonne coordination commence<br /><em>par des engagements simples.</em></h2>
          </div>
          <div className="partners-values-grid">
            {values.map(([index, title, description]) => (
              <article key={title}><span>{index}</span><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>

        <section className="partners-section partners-form-section" id="partner-form">
          <div className="partners-form-copy">
            <p className="partners-kicker">04 / PRÉSENTEZ-VOUS</p>
            <h2>Commençons par<br /><em>les bonnes informations.</em></h2>
            <p>
              Décrivez votre activité et la manière dont vous souhaitez collaborer. Cette première
              prise de contact nous permet de comprendre rapidement votre positionnement.
            </p>
            <div className="partners-trust"><ShieldCheck size={21} /><span>Toute demande de collaboration est étudiée avant intégration au réseau SBRE.</span></div>
            <div className="partners-selected-profile"><small>PROFIL SÉLECTIONNÉ</small><strong>{active.title}</strong></div>
          </div>
          <form className="partners-form" onSubmit={prepareEmail} onChange={() => setDraftHref(null)}>
            <div className="partners-field-row">
              <label>Nom / prénom<input required name="name" autoComplete="name" /></label>
              <label>Société<input required name="company" autoComplete="organization" /></label>
            </div>
            <div className="partners-field-row">
              <label>E-mail<input required type="email" name="email" autoComplete="email" /></label>
              <label>Téléphone<input type="tel" name="phone" autoComplete="tel" /></label>
            </div>
            <div className="partners-field-row">
              <label>Métier / spécialité / CFC<input required name="speciality" /></label>
              <label>Zone d’intervention<input required name="area" placeholder="Vaud, Genève, Suisse romande…" /></label>
            </div>
            <label>Site internet<input type="url" name="website" placeholder="https://" /></label>
            <label>Références éventuelles<textarea name="references" rows={3} placeholder="Projets, clients, typologies d’intervention…" /></label>
            <label>Votre message<textarea required name="message" rows={5} placeholder="Présentez-nous votre activité et le type de collaboration recherché." /></label>
            {!draftHref ? (
              <button className="partners-button partners-button-solid partners-submit" type="submit">
                Proposer une collaboration <ArrowRight size={17} />
              </button>
            ) : (
              <a className="partners-button partners-button-solid partners-submit" href={draftHref}>
                Ouvrir mon e-mail préparé <ArrowRight size={17} />
              </a>
            )}
            <small className="partners-form-note">Aucune donnée n’est stockée sur le site dans cette première version.</small>
          </form>
        </section>

        <section className="partners-final-cta">
          <UsersRound size={34} strokeWidth={1.25} />
          <p className="partners-kicker">UN PROJET COMMUN COMMENCE PAR UNE CONVERSATION</p>
          <h2>Construisons de belles<br /><em>opérations ensemble.</em></h2>
          <div>
            <button className="partners-button partners-button-light" onClick={scrollToForm}>Présenter votre société</button>
            <a className="partners-button partners-button-outline-light" href="tel:+41783076029">Parler avec SBRE</a>
          </div>
        </section>
      </main>

      <footer className="partners-footer">
        <img src={logo} alt="SBRE Ingénierie" />
        <div><strong>Structurer · Budgéter · Réaliser · Exiger</strong><span>Direction de travaux · Suisse romande</span></div>
        <div><a href="mailto:info@sbre-ingenierie.ch">info@sbre-ingenierie.ch</a><a href="tel:+41783076029">+41 78 307 60 29</a></div>
      </footer>
    </div>
  );
}
