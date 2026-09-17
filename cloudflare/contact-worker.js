const RESEND_ENDPOINT = "https://api.resend.com/emails";

const json = (body, status = 200, origin = "*") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
    },
  });

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://sbre-ingenierie.ch";
    const corsOrigin = requestOrigin === allowedOrigin ? allowedOrigin : allowedOrigin;

    if (request.method === "OPTIONS") {
      if (requestOrigin && requestOrigin !== allowedOrigin) {
        return json({ ok: false }, 403, allowedOrigin);
      }
      return json({ ok: true }, 204, allowedOrigin);
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Méthode non autorisée." }, 405, corsOrigin);
    }

    if (requestOrigin && requestOrigin !== allowedOrigin) {
      return json({ ok: false, error: "Origine non autorisée." }, 403, allowedOrigin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: "Requête invalide." }, 400, corsOrigin);
    }

    const name = String(payload?.name || "").trim();
    const email = String(payload?.email || "").trim().toLowerCase();
    const service = String(payload?.service || "").trim();
    const message = String(payload?.message || "").trim();
    const companyWebsite = String(payload?.companyWebsite || "").trim();

    // Honeypot : les robots remplissent souvent les champs invisibles.
    if (companyWebsite) return json({ ok: true }, 200, corsOrigin);

    if (!name || name.length > 120) {
      return json({ ok: false, error: "Nom invalide." }, 400, corsOrigin);
    }
    if (!isValidEmail(email) || email.length > 180) {
      return json({ ok: false, error: "Adresse e-mail invalide." }, 400, corsOrigin);
    }
    if (!service || service.length > 160) {
      return json({ ok: false, error: "Mission invalide." }, 400, corsOrigin);
    }
    if (!message || message.length > 1600) {
      return json({ ok: false, error: "Message invalide." }, 400, corsOrigin);
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
      console.error("Configuration Resend incomplète.");
      return json(
        { ok: false, error: "Le service d’envoi est momentanément indisponible." },
        503,
        corsOrigin,
      );
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeService = escapeHtml(service);
    const safeMessage = escapeHtml(message).replaceAll("\n", "<br>");

    const resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Nouvelle demande SBRE — ${service}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#173b31">
            <div style="padding:24px;border:1px solid #dbe6e1;border-radius:14px">
              <p style="margin:0 0 8px;font-size:12px;letter-spacing:1.5px;color:#0a5c3d;font-weight:700">SBRE INGÉNIERIE · NOUVELLE DEMANDE</p>
              <h1 style="font-size:24px;margin:0 0 24px">${safeService}</h1>
              <p><strong>Nom :</strong> ${safeName}</p>
              <p><strong>E-mail :</strong> ${safeEmail}</p>
              <p><strong>Besoin :</strong> ${safeService}</p>
              <hr style="border:0;border-top:1px solid #e5ece9;margin:24px 0">
              <p style="line-height:1.6">${safeMessage}</p>
            </div>
            <p style="font-size:12px;color:#6f827c;margin-top:12px">Envoyé depuis le formulaire de contact sbre-ingenierie.ch</p>
          </div>
        `,
        text: `Nouvelle demande SBRE\n\nNom : ${name}\nE-mail : ${email}\nBesoin : ${service}\n\n${message}`,
      }),
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      console.error("Erreur Resend:", resendResponse.status, details);
      return json(
        { ok: false, error: "L’envoi n’a pas abouti. Réessayez dans quelques instants." },
        502,
        corsOrigin,
      );
    }

    return json({ ok: true }, 200, corsOrigin);
  },
};
