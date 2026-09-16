import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
    label: "DE NOTRE RÔLE À REPRENDRE LA MAÎTRISE",
  },
  {
    target: "#réalisations",
    from: "02",
    to: "03",
    label: "DE REPRENDRE LA MAÎTRISE AUX EXPÉRIENCES PROJET",
  },
  {
    target: ".method-section",
    from: "03",
    to: "04",
    label: "DES EXPÉRIENCES PROJET À NOTRE MÉTHODE",
  },
  {
    target: ".team-section",
    from: "04",
    to: "05",
    label: "DE NOTRE MÉTHODE AU PLUS PRÈS DU TERRAIN",
  },
  {
    target: "#contact",
    from: "05",
    to: "06",
    label: "DU TERRAIN À VOTRE PROJET",
  },
];

export default function ProjectsMethodTransition() {
  const { pathname } = useLocation();

  useEffect(() => {
    const removeTransitions = () => {
      document
        .querySelectorAll<HTMLElement>(".projects-method-transition")
        .forEach((node) => node.remove());
    };

    // These numbered separators belong only to the main SBRE homepage.
    if (pathname !== "/") {
      removeTransitions();
      return;
    }

    let cancelled = false;
    const timers: number[] = [];

    const ensureTransitions = () => {
      if (cancelled) return true;
      let complete = true;

      transitions.forEach(({ target, from, to, label }) => {
        const section = document.querySelector<HTMLElement>(target);
        if (!section) {
          complete = false;
          return;
        }

        const existing = document.querySelector<HTMLElement>(
          `.projects-method-transition[data-transition-to="${to}"]`,
        );

        if (existing) {
          existing.setAttribute("data-transition-from", from);
          const currentLabel = existing.querySelector<HTMLElement>(
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

      return complete;
    };

    removeTransitions();

    if (!ensureTransitions()) {
      [80, 180, 360, 700, 1200].forEach((delay) => {
        timers.push(window.setTimeout(ensureTransitions, delay));
      });
    }

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      removeTransitions();
    };
  }, [pathname]);

  return null;
}
