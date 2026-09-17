import { useState, type FormEvent } from "react";

export default function ContactForm() {
  const [files, setFiles] = useState<string[]>([]);
  const [draft, setDraft] = useState("");

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const selectedFiles = files.length
      ? `\nPièces sélectionnées : ${files.join(", ")}\n`
      : "";
    const body = `Bonjour Soufiane,\n\nJe souhaite échanger sur mon projet.\n\nNom : ${f.get("name")}\nE-mail : ${f.get("email")}\nMission : ${f.get("service")}\n\n${f.get("message")}\n${selectedFiles}\nMerci.`;
    const mailto = `mailto:info@sbre-ingenierie.ch?subject=${encodeURIComponent("Parlons de mon projet — SBRE")}&body=${encodeURIComponent(body)}`;

    setDraft(mailto);

    // En navigation réelle, on ouvre immédiatement la messagerie.
    // En environnement de test (jsdom), on garde uniquement le lien généré.
    if (typeof navigator !== "undefined" && !navigator.userAgent.toLowerCase().includes("jsdom")) {
      window.location.href = mailto;
    }
  }

  function resetDraft() {
    if (draft) setDraft("");
  }

  return (
    <form className="contact-form" onSubmit={submit} onChange={resetDraft}>
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

      <label className="contact-file-upload">
        <span>Ajouter des fichiers</span>
        <input
          name="files"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
          onChange={(event) =>
            setFiles(
              Array.from(event.currentTarget.files ?? []).map((file) => file.name),
            )
          }
        />
        <strong>
          {files.length
            ? `${files.length} fichier${files.length > 1 ? "s" : ""} sélectionné${files.length > 1 ? "s" : ""}`
            : "PDF, plans, photos, devis…"}
        </strong>
      </label>

      <button className="button button-green" type="submit">
        Préparer mon e-mail <span>↗</span>
      </button>

      <p className="form-note">
        Votre messagerie s’ouvre avec le message prérempli. Les fichiers choisis
        devront être joints dans votre messagerie avant l’envoi.
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
