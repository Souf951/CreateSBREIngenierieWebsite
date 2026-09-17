import { useEffect } from "react";

const faqCopy = [
  [
    "Sur quels types d’opérations l’équipe SBRE Ingenierie peut intervenir ?",
    "Nous accompagnons des rénovations, transformations, projets résidentiels et opérations tertiaires, depuis la préparation du dossier jusqu’au suivi d’exécution et à la livraison.",
  ],
  [
    "À quel stade du projet est-il pertinent de vous solliciter ?",
    "Le plus tôt possible pour cadrer les consultations, le budget et le planning. Nous pouvons aussi reprendre un chantier déjà lancé lorsqu’il faut clarifier les priorités ou renforcer le pilotage.",
  ],
  [
    "Comment vous intégrez-vous à une équipe de mandataires existante ?",
    "Nous travaillons avec l’architecte, les ingénieurs et les spécialistes déjà en place. Les rôles restent clairement définis afin que chacun garde son périmètre de responsabilité.",
  ],
  [
    "Pouvez-vous prendre en charge la consultation des entreprises ?",
    "Oui. Selon le mandat, nous préparons les soumissions, lançons les consultations, comparons les offres, menons les clarifications et préparons les adjudications.",
  ],
  [
    "Comment sécurisez-vous le budget avant et pendant les travaux ?",
    "Nous construisons des estimatifs, comparons les offres reçues et suivons les écarts au fil des décisions. L’objectif est de rendre les coûts lisibles avant qu’ils ne deviennent des problèmes de chantier.",
  ],
  [
    "Quelle présence assurez-vous réellement sur le terrain ?",
    "Elle est adaptée au besoin du projet : séances de chantier, contrôles ciblés, coordination des entreprises, suivi des points sensibles, réceptions et levée des réserves.",
  ],
  [
    "Sur quelle base établissez-vous votre proposition d’honoraires ?",
    "Elle dépend du périmètre confié, de la durée de l’opération, de sa complexité et du niveau de présence nécessaire. Chaque offre précise les prestations, les livrables et les conditions du mandat.",
  ],
] as const;

export default function FaqArchitecturalEnhancer() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const mount = () => {
      const section = document.querySelector<HTMLElement>(".premium-site .faq-section");
      if (!section || section.dataset.sbreFaqArchitectural === "true") return false;

      section.dataset.sbreFaqArchitectural = "true";
      section.classList.add("faq-architectural");

      const title = document.createElement("div");
      title.className = "faq-architectural-title";
      title.setAttribute("aria-hidden", "true");
      title.innerHTML = `
        <span>SBRE / QUESTIONS FRÉQUENTES</span>
        <span>07 POINTS CLÉS</span>
      `;
      section.prepend(title);

      const grid = document.createElement("div");
      grid.className = "faq-blueprint-grid";
      grid.setAttribute("aria-hidden", "true");
      grid.innerHTML = `
        <span class="faq-grid-line faq-grid-line-a"></span>
        <span class="faq-grid-line faq-grid-line-b"></span>
        <span class="faq-grid-line faq-grid-line-c"></span>
        <span class="faq-grid-node faq-grid-node-a"></span>
        <span class="faq-grid-node faq-grid-node-b"></span>
        <span class="faq-grid-node faq-grid-node-c"></span>
      `;
      section.prepend(grid);

      const details = Array.from(section.querySelectorAll<HTMLDetailsElement>("details"));
      const listeners: Array<() => void> = [];

      details.forEach((item, index) => {
        item.classList.add("faq-architectural-item");
        item.style.setProperty("--faq-index", String(index));

        const summary = item.querySelector<HTMLElement>("summary");
        const answer = item.querySelector<HTMLElement>(":scope > p");
        if (!summary || !answer) return;

        const plus = summary.querySelector<HTMLElement>("span:last-child");
        const copy = faqCopy[index];
        if (copy) {
          Array.from(summary.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) node.remove();
          });
          summary.insertBefore(document.createTextNode(copy[0]), plus ?? null);
          answer.textContent = copy[1];
        }

        const number = document.createElement("span");
        number.className = "faq-architectural-number";
        number.textContent = `0${index + 1}`;
        summary.prepend(number);

        const rail = document.createElement("span");
        rail.className = "faq-architectural-rail";
        rail.setAttribute("aria-hidden", "true");
        item.appendChild(rail);

        const updateState = () => {
          item.classList.toggle("is-open", item.open);
          if (item.open) {
            details.forEach((other) => {
              if (other !== item && other.open) other.open = false;
            });
          }
        };
        updateState();
        item.addEventListener("toggle", updateState);
        listeners.push(() => item.removeEventListener("toggle", updateState));
      });

      cleanup = () => {
        listeners.forEach((fn) => fn());
        details.forEach((item) => {
          item.classList.remove("faq-architectural-item", "is-open");
          item.style.removeProperty("--faq-index");
          item.querySelector(".faq-architectural-number")?.remove();
          item.querySelector(".faq-architectural-rail")?.remove();
        });
        title.remove();
        grid.remove();
        section.classList.remove("faq-architectural");
        delete section.dataset.sbreFaqArchitectural;
      };

      return true;
    };

    if (mount()) return () => cleanup?.();

    const observer = new MutationObserver(() => {
      if (mount()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, []);

  return null;
}
