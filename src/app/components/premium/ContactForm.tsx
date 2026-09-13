import { useState, type FormEvent } from "react";
export default function ContactForm() {
  const [draft, setDraft] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Bonjour Soufiane,\n\nJe souhaite échanger sur mon projet.\n\nNom : ${f.get("name")}\nE-mail : ${f.get("email")}\nMission : ${f.get("service")}\n\n${f.get("message")}\n`;
    setDraft(
      `mailto:info@sbre-ingenierie.ch?subject=${encodeURIComponent("Parlons de mon projet — SBRE")}&body=${encodeURIComponent(body)}`,
    );
  }
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      onChange={() => setDraft("")}
    >
      <div className="form-pair">
        <label>
          Votre nom
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={120}
            placeholder="Nom et prénom"
          />
        </label>
        <label>
          Votre e-mail
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={180}
            placeholder="vous@entreprise.ch"
          />
        </label>
      </div>
      <label>
        Votre besoin
        <select name="service">
          <option>Direction de travaux</option>
          <option>Assistance au maître d’ouvrage</option>
          <option>Pilotage global / entreprise générale</option>
          <option>Reprise d’un chantier en cours</option>
        </select>
      </label>
      <label>
        Votre projet
        <textarea
          name="message"
          required
          maxLength={1600}
          rows={4}
          placeholder="Lieu, nature des travaux, stade du projet, difficultés rencontrées…"
        />
      </label>
      <button className="button button-green" type="submit">
        Préparer mon e-mail <span>↗</span>
      </button>
      <p className="form-note">
        Vos informations sont reprises dans un brouillon à envoyer depuis votre
        messagerie. Aucun envoi automatique.
      </p>
      {draft && (
        <div className="draft-ready" role="status">
          <p>Votre message est prêt.</p>
          <a className="text-link" href={draft}>
            Ouvrir mon brouillon dans la messagerie ↗
          </a>
        </div>
      )}
    </form>
  );
}
