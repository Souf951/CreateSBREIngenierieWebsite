const enhancedPartnerForms = new WeakSet<HTMLElement>();

function setTextNode(element: HTMLElement, text: string) {
  const node = Array.from(element.childNodes).find((item) => item.nodeType === Node.TEXT_NODE);
  if (node) node.textContent = `${text} `;
}

function enhancePartnerForm(section: HTMLElement) {
  if (enhancedPartnerForms.has(section)) return;
  enhancedPartnerForms.add(section);
  section.classList.add("pr-form-premium");

  const intro = section.querySelector<HTMLElement>(".pr-form-intro");
  const form = section.querySelector<HTMLFormElement>(".pr-form");
  if (!intro || !form) return;

  intro.querySelector(".pr-form-aside")?.remove();

  if (!intro.querySelector(".pr-partner-benefits")) {
    intro.insertAdjacentHTML(
      "beforeend",
      `<div class="pr-partner-benefits" aria-label="Avantages du réseau SBRE">
        <p class="pr-partner-benefits-label">Pourquoi rejoindre le réseau</p>
        <div class="pr-partner-benefit">
          <span>01</span>
          <div><strong>Opportunités qualifiées</strong><p>Des projets cohérents avec votre métier, votre zone et votre capacité d’intervention.</p></div>
        </div>
        <div class="pr-partner-benefit">
          <span>02</span>
          <div><strong>Cadre de travail clair</strong><p>Un interlocuteur identifié, des interfaces maîtrisées et des décisions documentées.</p></div>
        </div>
        <div class="pr-partner-benefit">
          <span>03</span>
          <div><strong>Relations durables</strong><p>Nous privilégions les partenaires fiables avec lesquels construire plusieurs opérations.</p></div>
        </div>
        <div class="pr-partner-path" aria-hidden="true">
          <span>Votre profil</span><i></i><span>Étude SBRE</span><i></i><span>Mise en relation</span>
        </div>
      </div>`,
    );
  }

  if (!form.querySelector(".pr-form-premium-head")) {
    form.insertAdjacentHTML(
      "afterbegin",
      `<div class="pr-form-premium-head">
        <div>
          <span class="pr-form-kicker">Candidature partenaire</span>
          <h3>Présentez votre entreprise.</h3>
          <p>Quelques informations suffisent pour comprendre votre activité et préparer un premier échange.</p>
        </div>
        <div class="pr-form-completion" aria-live="polite">
          <span class="pr-form-completion-value">0%</span>
          <small>profil complété</small>
        </div>
        <div class="pr-form-progress" aria-hidden="true"><span></span></div>
      </div>`,
    );
  }

  const placeholders: Record<string, string> = {
    name: "Jean Dupont",
    company: "Entreprise SA",
    email: "jean@entreprise.ch",
    phone: "+41 79 000 00 00",
    speciality: "Ex. CFC 271 — Plâtrerie / peinture",
    area: "Vaud, Genève, Suisse romande…",
    website: "https://entreprise.ch",
    references: "2–3 références significatives, typologie de projets…",
    message: "Présentez votre activité, vos forces et le type de collaboration recherché…",
  };

  Object.entries(placeholders).forEach(([name, placeholder]) => {
    const field = form.elements.namedItem(name);
    if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) {
      field.placeholder = placeholder;
    }
  });

  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  if (submit) setTextNode(submit, "Préparer ma candidature");

  const note = form.querySelector<HTMLElement>(".pr-form-note");
  if (note) {
    note.textContent = "* Champs requis. Votre profil est préparé pour transmission à SBRE Ingénierie. Aucune donnée n’est publiée sur le site.";
  }

  if (!form.querySelector(".pr-form-trust")) {
    note?.insertAdjacentHTML(
      "afterend",
      `<div class="pr-form-trust">
        <span><i></i> Profil étudié individuellement</span>
        <span><i></i> Suisse romande</span>
        <span><i></i> Échange direct avec SBRE</span>
      </div>`,
    );
  }

  const requiredFields = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[required]"));
  const completionValue = form.querySelector<HTMLElement>(".pr-form-completion-value");

  const updateCompletion = () => {
    const completed = requiredFields.filter((field) => field.value.trim().length > 0 && field.checkValidity()).length;
    const percent = requiredFields.length ? Math.round((completed / requiredFields.length) * 100) : 0;
    form.style.setProperty("--profile-progress", `${percent}%`);
    if (completionValue) completionValue.textContent = `${percent}%`;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const rect = form.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    form.style.setProperty("--form-x", `${(x * 100).toFixed(1)}%`);
    form.style.setProperty("--form-y", `${(y * 100).toFixed(1)}%`);
    form.style.setProperty("--form-rx", `${((0.5 - y) * 1.7).toFixed(2)}deg`);
    form.style.setProperty("--form-ry", `${((x - 0.5) * 2.1).toFixed(2)}deg`);
  };

  const onPointerLeave = () => {
    form.style.setProperty("--form-x", "50%");
    form.style.setProperty("--form-y", "45%");
    form.style.setProperty("--form-rx", "0deg");
    form.style.setProperty("--form-ry", "0deg");
  };

  form.addEventListener("input", updateCompletion, { passive: true });
  form.addEventListener("change", updateCompletion, { passive: true });
  form.addEventListener("pointermove", onPointerMove, { passive: true });
  form.addEventListener("pointerleave", onPointerLeave, { passive: true });
  updateCompletion();
}

function scanPartnerForms() {
  document.querySelectorAll<HTMLElement>(".pr-form-section").forEach(enhancePartnerForm);
}

const partnerFormObserver = new MutationObserver(scanPartnerForms);

function startPartnerFormEnhancer() {
  scanPartnerForms();
  partnerFormObserver.observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startPartnerFormEnhancer, { once: true });
} else {
  startPartnerFormEnhancer();
}
