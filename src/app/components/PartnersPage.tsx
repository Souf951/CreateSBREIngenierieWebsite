import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import SEOHead from "./SEOHead";
import PartnerArchitecture from "./premium/PartnerArchitecture";
import logo from "../../media/Pr_sentation1_page-0001.webp";
import "../../styles/partners-premium.css";

const profiles = [
  ["01", "Architectes", "De l’intention au terrain.", "Un relais opérationnel pour préserver la cohérence du projet, suivre les validations et rendre les détails exécutables.", "Direction de travaux · Consultations · Réceptions"],
  ["02", "Entreprises", "Les bonnes conditions pour réaliser.", "Des consultations ciblées, des séquences claires et des interfaces anticipées pour organiser les interventions sur le chantier.", "Appels d’offres · Planning · Coordination des CFC"],
  ["03", "Maîtres d’ouvrage", "Une lecture claire pour décider.", "Des informations structurées sur les coûts, les délais et les risques pour arbitrer avec une vision concrète de l’avancement.", "Suivi des coûts · Décisions · Reporting"],
  ["04", "Directions de travaux", "Un renfort au plus près du projet.", "Une extension de votre équipe sur les phases qui demandent davantage de présence, de contrôle et de suivi des interfaces.", "Renfort terrain · Qualité · Réserves"],
];

const values = [
  ["01", "Responsabilités claires", "Chaque sujet trouve son interlocuteur. Les rôles et les engagements sont définis."],
  ["02", "Information structurée", "Les bonnes informations circulent entre études, décisions et exécution."],
  ["03", "Décisions tracées", "Les validations, les écarts et leurs conséquences restent documentés."],
  ["04", "Interfaces maîtrisées", "Les interventions s’articulent et les points de rencontre sont anticipés."],
];

export default function PartnersPage() {
  const [selected, setSelected] = useState("Architectes");
  const [draftHref, setDraftHref] = useState<string | null>(null);

  function jump(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  function prepareEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Bonjour SBRE Ingénierie,\n\nJe souhaite vous proposer une collaboration.\n\nProfil : ${selected}\nNom : ${data.get("name")}\nSociété : ${data.get("company")}\nE-mail : ${data.get("email")}\nTéléphone : ${data.get("phone")}\nSpécialité / CFC : ${data.get("speciality")}\nZone : ${data.get("area")}\n\n${data.get("message")}`;
    setDraftHref(`mailto:info@sbre-ingenierie.ch?subject=${encodeURIComponent(`Proposition de collaboration SBRE — ${selected}`)}&body=${encodeURIComponent(body)}`);
  }

  return (
    <div className="partner-premium premium-site">
      <SEOHead title="Partenaires | SBRE Ingénierie" description="Le réseau de partenaires SBRE Ingénierie en Suisse romande." canonical="/partenaires" />

      <header className="site-header partner-header">
        <Link to="/" className="brand" aria-label="SBRE Ingénierie — accueil"><img src={logo} alt="SBRE Ingénierie" /></Link>
        <nav className="desktop-nav" aria-label="Navigation principale">
          <Link to="/#expertises">Expertises</Link>
          <Link to="/#réalisations">Réalisations</Link>
          <Link to="/#methode">Méthode</Link>
          <Link to="/#equipe">Équipe</Link>
          <span className="partner-current">Partenaires</span>
        </nav>
        <button className="header-contact" onClick={() => jump("partner-form")}>Demander un entretien <span>↗</span></button>
      </header>

      <main className="partner-shell">
        <section className="partner-hero" id="accueil">
          <div className="partner-rail partner-rail-left">
            <span>SBRE / RÉSEAU</span><span>01 — 05</span>
          </div>
          <div className="partner-hero-copy">
            <p className="eyebrow"><span className="status-dot" /> ENSEMBLE, DU PLAN AU TERRAIN</p>
            <h1>Rejoignez<br />le réseau <em>SBRE.</em></h1>
            <p className="partner-lead">Nous collaborons avec celles et ceux qui conçoivent, décident, réalisent et pilotent les projets en Suisse romande.</p>
            <div className="hero-actions">
              <button className="button button-green" onClick={() => jump("partner-form")}>Devenir partenaire <span>↗</span></button>
              <button className="text-link" onClick={() => jump("profils")}>Découvrir les collaborations <span>↗</span></button>
            </div>
            <div className="hero-location"><span>LAUSANNE / GENÈVE / VAUD</span><span>Architectes · Entreprises · MO · DT</span></div>
          </div>
          <div className="partner-hero-visual">
            <div className="visual-heading"><span>RÉSEAU / COORDINATION</span><span>CH — 02</span></div>
            <div className="partner-model"><PartnerArchitecture /></div>
            <div className="partner-model-meta"><span>Des expertises qui se rencontrent.</span><span>Une vision qui prend forme.</span></div>
          </div>
          <div className="partner-rail partner-rail-right">
            <span>DIRECTION DE TRAVAUX</span><span>SUISSE ROMANDE</span>
          </div>
        </section>

        <div className="principles partner-principles">
          <span>Des responsabilités claires.</span><span>Des décisions documentées.</span><span>Des interfaces maîtrisées.</span><button onClick={() => jump("profils")}>↓</button>
        </div>

        <section className="section partner-section" id="profils">
          <div className="section-heading">
            <p className="eyebrow">02 / LES COLLABORATIONS</p>
            <h2>Des expertises distinctes.<br /><em>Une même direction.</em></h2>
            <p>Une structure lisible, les bons interlocuteurs et un cadre de travail commun pour faire avancer le projet sans perdre l’intention.</p>
          </div>
          <div className="partner-profile-grid">
            {profiles.map(([n,title,tag,body,foot]) => (
              <article className="partner-card" key={n}>
                <div className="card-number">{n}<span>↗</span></div>
                <h3>{title}</h3><strong>{tag}</strong><p>{body}</p><div className="card-footer">{foot}</div>
                <button className="partner-card-link" onClick={() => { setSelected(title); jump("partner-form"); }}>Échanger sur une collaboration ↗</button>
              </article>
            ))}
          </div>
        </section>

        <section className="partner-control">
          <div className="partner-control-copy">
            <p className="eyebrow">03 / L’EXIGENCE SBRE</p>
            <h2>Un réseau utile uniquement<br /><em>s’il rend le chantier plus clair.</em></h2>
            <p>Notre rôle n’est pas d’accumuler des contacts. Nous cherchons des partenaires capables de travailler avec méthode, transparence et exigence d’exécution.</p>
          </div>
          <div className="partner-value-list">
            {values.map(([n,title,text]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}
          </div>
        </section>

        <section className="section partner-form-section" id="partner-form">
          <div className="partner-form-intro">
            <p className="eyebrow">04 / FAISONS CONNAISSANCE</p>
            <h2>Une collaboration commence<br /><em>par une conversation.</em></h2>
            <p>Présentez-nous votre activité, votre spécialité et votre zone d’intervention. Nous revenons vers vous si les besoins et les méthodes sont compatibles.</p>
            <div className="partner-contact-meta"><span>+41 78 307 60 29</span><span>info@sbre-ingenierie.ch</span><span>Lausanne · Genève · Vaud</span></div>
          </div>
          <form className="partner-form" onSubmit={prepareEmail} onChange={() => setDraftHref(null)}>
            <label>Vous êtes<select value={selected} onChange={(e)=>setSelected(e.target.value)}>{profiles.map(([,title])=><option key={title}>{title}</option>)}</select></label>
            <div className="partner-fields"><label>Nom / prénom *<input name="name" required /></label><label>Société *<input name="company" required /></label></div>
            <div className="partner-fields"><label>E-mail *<input name="email" type="email" required /></label><label>Téléphone<input name="phone" /></label></div>
            <div className="partner-fields"><label>Spécialité / CFC *<input name="speciality" required /></label><label>Zone d’intervention *<input name="area" required /></label></div>
            <label>Votre message *<textarea name="message" rows={4} required /></label>
            <button className="button button-green" type="submit">Préparer ma prise de contact <span>↗</span></button>
            {draftHref && <a className="partner-draft" href={draftHref}>Votre message est prêt — ouvrir la messagerie ↗</a>}
          </form>
        </section>
      </main>
    </div>
  );
}
