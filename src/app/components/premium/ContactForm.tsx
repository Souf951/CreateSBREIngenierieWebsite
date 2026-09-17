import { useState, type FormEvent } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL?.trim();

export default function ContactForm() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    if (!CONTACT_API_URL) {
      setState("error");
      setErrorMessage(
        "Le formulaire n’est pas encore relié au service d’envoi. Contactez-nous à info@sbre-ingenierie.ch.",
      );
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot anti-spam : un visiteur normal ne remplit jamais ce champ.
    if (formData.get("companyWebsite")) return;

    setState("sending");

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          service: formData.get("service"),
          message: formData.get("message"),
          companyWebsite: formData.get("companyWebsite"),
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "L’envoi a échoué.");
      }

      form.reset();
      setState("success");
    } catch (error) {
      setState("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Impossible d’envoyer la demande pour le moment.",
      );
    }
  }

  return (
    <form className="contact-form" onSubmit={submit}>
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
        <select name="service" required defaultValue="Direction de travaux">
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

      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}
      >
        <label>
          Site internet de l’entreprise
          <input name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button
        className="button button-green"
        type="submit"
        disabled={state === "sending"}
        aria-busy={state === "sending"}
      >
        {state === "sending" ? "Envoi en cours…" : "Envoyer ma demande"} <span>↗</span>
      </button>

      <p className="form-note">
        Votre demande est transmise directement et de façon sécurisée à SBRE Ingénierie.
      </p>

      {state === "success" && (
        <div className="draft-ready" role="status" aria-live="polite">
          <p>✓ Votre demande a bien été envoyée.</p>
          <small>Nous reviendrons vers vous dans les meilleurs délais.</small>
        </div>
      )}

      {state === "error" && (
        <div className="draft-ready" role="alert">
          <p>Impossible d’envoyer la demande.</p>
          <small>{errorMessage}</small>
        </div>
      )}
    </form>
  );
}
