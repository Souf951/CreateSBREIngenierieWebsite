import { useEffect } from "react";

type TransitionConfig = {
  target: string;
  from: string;
  to: string;
  label: string;
};

const transitions: TransitionConfig[] = [
  {
    target: "#situations",
    from: "01",
    to: "02",
    label: "DU PILOTAGE AUX SITUATIONS CONCRÈTES",
  },
  {
    target: "#réalisations",
    from: "02",
    to: "03",
    label: "DU TERRAIN AU RÉSULTAT",
  },
  {
    target: ".method-section",
    from: "03",
    to: "04",
    label: "DU RÉSULTAT À LA MÉTHODE",
  },
  {
    target: ".team-section",
    from: "04",
    to: "05",
    label: "DE LA MÉTHODE À L’ÉQUIPE",
  },
  {
    target: "#contact",
    from: "05",
    to: "06",
    label: "DE L’ÉQUIPE À VOTRE PROJET",
  },
];

export default function ProjectsMethodTransition() {
  useEffect(() => {
    const ensureTransitions = () => {
      transitions.forEach(({ target, from, to, label }) => {
        const section = document.querySelector<HTMLElement>(target);
        if (!section) return;

        const previous = section.previousElementSibling;
        if (
          previous?.classList.contains("projects-method-transition") &&
          previous.getAttribute("data-transition-to") === to
        ) {
          const currentLabel = previous.querySelector<HTMLElement>(
            ".projects-method-transition__label",
          );
          if (currentLabel && currentLabel.textContent !== label) {
            currentLabel.textContent = label;
          }
          return;
        }

        const transition = document.createElement("div");
        transition.className = "projects-method-transition";
        transition.setAttribute("data-transition-from", from);
        transition.setAttribute("data-transition-to", to);
        transition.setAttribute("aria-hidden", "true");
        transition.innerHTML = `
          <div class="projects-method-transition__edge projects-method-transition__edge--left"></div>
          <div class="projects-method-transition__line"></div>
          <div class="projects-method-transition__badge">
            <span>${from}</span>
            <i></i>
            <span>${to}</span>
          </div>
          <div class="projects-method-transition__label">${label}</div>
          <div class="projects-method-transition__line projects-method-transition__line--right"></div>
          <div class="projects-method-transition__edge projects-method-transition__edge--right"></div>
        `;

        section.parentElement?.insertBefore(transition, section);
      });
    };

    ensureTransitions();
    const observer = new MutationObserver(ensureTransitions);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
