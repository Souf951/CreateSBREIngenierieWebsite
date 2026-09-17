import { useMemo, useState, type FormEvent } from "react";

type SubmitState = "idle" | "sending" | "success" | "error";

type EncodedFile = {
  filename: string;
  content: string;
  contentType: string;
};

const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL?.trim();
const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TOTAL_SIZE = 10 * 1024 * 1024;

const allowedExtensions = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error(`Impossible de lire ${file.name}.`));
    reader.onload = () => {
      const result = String(reader.result ?? "");
      resolve(result.includes(",") ? result.split(",")[1] : result);
    };
    reader.readAsDataURL(file);
  });
}

export default function ContactForm() {
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const totalSize = useMemo(
    () => files.reduce((total, file) => total + file.size, 0),
    [files],
  );

  function selectFiles(list: FileList | null) {
    const selected = Array.from(list ?? []);
    setErrorMessage("");
    setState("idle");

    if (selected.length > MAX_FILES) {
      setState("error");
      setErrorMessage(`Maximum ${MAX_FILES} fichiers par demande.`);
      return;
    }

    const invalidFile = selected.find((file) => {
      const lower = file.name.toLowerCase();
      return !allowedExtensions.some((extension) => lower.endsWith(extension));
    });
    if (invalidFile) {
      setState("error");
      setErrorMessage(`Format non accepté : ${invalidFile.name}.`);
      return;
    }

    const oversized = selected.find((file) => file.size > MAX_FILE_SIZE);
    if (oversized) {
      setState("error");
      setErrorMessage(`${oversized.name} dépasse la limite de 5 Mo.`);
      return;
    }

    const selectedTotal = selected.reduce((sum, file) => sum + file.size, 0);
    if (selectedTotal > MAX_TOTAL_SIZE) {
      setState("error");
      setErrorMessage("La taille totale des pièces jointes doit rester sous 10 Mo.");
      return;
    }

    setFiles(selected);
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");

    if (!CONTACT_API_URL) {
      setState("error");
      setErrorMessage(
        "Le formulaire est prêt mais l’envoi sécurisé n’est pas encore activé. Vous pouvez nous écrire à info@sbre-ingenierie.ch.",
      );
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Honeypot anti-spam : invisible pour un visiteur normal.
    if (formData.get("companyWebsite")) return;

    setState("sending");

    try {
      const attachments: EncodedFile[] = await Promise.all(
        files.map(async (file) => ({
          filename: file.name,
          content: await fileToBase64(file),
          contentType: file.type || "application/octet-stream",
        })),
      );

      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          service: formData.get("service"),
          message: formData.get("message"),
          companyWebsite: formData.get("companyWebsite"),
          attachments,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "L’envoi a échoué.");
      }

      form.reset();
      setFiles([]);
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
        style={{
          position: "absolute",
          left: "-10000px",
          width: 1,
          height: 1,
          overflow: "hidden",
        }}
      >
        <label>
          Site internet de l’entreprise
          <input name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label
        className="contact-file-upload"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: "14px 22px",
          border: "1px dashed rgba(10,92,61,.38)",
          borderRadius: 14,
          padding: "18px 20px",
          background: "rgba(255,255,255,.16)",
          cursor: "pointer",
          marginBottom: 18,
        }}
      >
        <span style={{ fontWeight: 600, color: "#173d31" }}>Pièces utiles au projet</span>
        <span
          style={{
            gridRow: "1 / span 2",
            gridColumn: 2,
            background: "#0a5c3d",
            color: "white",
            borderRadius: 999,
            padding: "10px 16px",
            fontSize: 11,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          {files.length ? "Modifier" : "Sélectionner"}
        </span>
        <input
          name="files"
          type="file"
          multiple
          accept={allowedExtensions.join(",")}
          onChange={(event) => selectFiles(event.currentTarget.files)}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0 }}
        />
        <strong style={{ fontSize: 10, fontWeight: 500, color: "#65736c" }}>
          {files.length
            ? `${files.length} fichier${files.length > 1 ? "s" : ""} · ${(totalSize / 1024 / 1024).toFixed(1)} Mo`
            : "PDF, plans, photos ou devis · 5 fichiers max · 10 Mo au total"}
        </strong>
      </label>

      {files.length > 0 && (
        <div
          aria-label="Fichiers sélectionnés"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            margin: "-6px 0 18px",
          }}
        >
          {files.map((file) => (
            <span
              key={`${file.name}-${file.size}`}
              style={{
                border: "1px solid rgba(23,61,49,.14)",
                borderRadius: 999,
                padding: "6px 10px",
                background: "rgba(255,255,255,.35)",
                fontSize: 9,
                color: "#52665c",
              }}
            >
              {file.name}
            </span>
          ))}
        </div>
      )}

      <button
        className="button button-green"
        type="submit"
        disabled={state === "sending"}
        aria-busy={state === "sending"}
        style={{
          minHeight: 56,
          boxShadow: "0 12px 30px rgba(10,92,61,.18)",
          opacity: state === "sending" ? 0.72 : 1,
        }}
      >
        <span>{state === "sending" ? "Transmission en cours…" : "Envoyer ma demande"}</span>
        <span aria-hidden="true">↗</span>
      </button>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          marginTop: 14,
          color: "#65736c",
          fontSize: 10,
          lineHeight: 1.7,
        }}
      >
        <span aria-hidden="true" style={{ color: "#0a5c3d" }}>●</span>
        <p className="form-note" style={{ margin: 0 }}>
          Envoi direct et sécurisé à SBRE Ingénierie. Votre adresse sert uniquement à vous répondre.
        </p>
      </div>

      {state === "success" && (
        <div
          className="draft-ready"
          role="status"
          aria-live="polite"
          style={{
            marginTop: 18,
            padding: "16px 18px",
            border: "1px solid rgba(10,92,61,.25)",
            borderRadius: 12,
            background: "rgba(214,230,176,.28)",
          }}
        >
          <p style={{ fontWeight: 650, marginBottom: 4 }}>✓ Demande transmise à SBRE Ingénierie.</p>
          <small>Nous revenons vers vous dès que votre projet a été pris en charge.</small>
        </div>
      )}

      {state === "error" && (
        <div
          className="draft-ready"
          role="alert"
          style={{
            marginTop: 18,
            padding: "16px 18px",
            border: "1px solid rgba(139,62,47,.22)",
            borderRadius: 12,
            background: "rgba(255,255,255,.35)",
          }}
        >
          <p style={{ fontWeight: 650, marginBottom: 4 }}>L’envoi n’a pas abouti.</p>
          <small>{errorMessage}</small>
        </div>
      )}
    </form>
  );
}
