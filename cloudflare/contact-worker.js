const json = (data, status = 200, origin = "*") =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "Content-Type",
      vary: "Origin",
    },
  });

const clean = (value, max) => String(value ?? "").trim().slice(0, max);

export default {
  async fetch(request, env) {
    const requestOrigin = request.headers.get("Origin") || "";
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://sbre-ingenierie.ch";
    const origin = requestOrigin === allowedOrigin ? requestOrigin : allowedOrigin;

    if (request.method === "OPTIONS") {
      if (requestOrigin && requestOrigin !== allowedOrigin) {
        return json({ ok: false, error: "Origin non autorisée." }, 403, origin);
      }
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "POST, OPTIONS",
          "access-control-allow-headers": "Content-Type",
          vary: "Origin",
        },
      });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Méthode non autorisée." }, 405, origin);
    }

    if (requestOrigin && requestOrigin !== allowedOrigin) {
      return json({ ok: false, error: "Origin non autorisée." }, 403, origin);
    }

    if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
      return json({ ok: false, error: "Service d’envoi non configuré." }, 500, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ ok: false, error: "Requête invalide." }, 400, origin);
    }

    if (payload.companyWebsite) {
      return json({ ok: true }, 200, origin);
    }

    const name = clean(payload.name, 120);
    const email = clean(payload.email, 180);
    const service = clean(payload.service, 160);
    const message = clean(payload.message, 1600);
    const attachments = Array.isArray(payload.attachments) ? payload.attachments.slice(0, 5) : [];

    if (!name || !email || !message || !/^\S+@\S+\.\S+$/.test(email)) {
      return json({ ok: false, error: "Merci de vérifier les champs du formulaire." }, 400, origin);
    }

    const safeAttachments = attachments
      .map((item) => ({
        filename: clean(item?.filename, 180),
        content: String(item?.content ?? ""),
      }))
      .filter((item) => item.filename && item.content);

    const text = [
      "Nouvelle demande depuis sbre-ingenierie.ch",
      "",
      `Nom : ${name}`,
      `E-mail : ${email}`,
      `Mission : ${service || "Non précisée"}`,
      "",
      "Projet :",
      message,
      "",
      safeAttachments.length
        ? `Pièces jointes : ${safeAttachments.map((item) => item.filename).join(", ")}`
        : "Pièces jointes : aucune",
    ].join("\n");

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `Nouvelle demande SBRE — ${service || "Projet"} — ${name}`,
        text,
        attachments: safeAttachments,
      }),
    });

    const resendData = await resendResponse.json().catch(() => null);

    if (!resendResponse.ok) {
      console.error("Resend error", resendData);
      return json(
        { ok: false, error: "Impossible de transmettre votre demande pour le moment." },
        502,
        origin,
      );
    }

    return json({ ok: true, id: resendData?.id }, 200, origin);
  },
};
