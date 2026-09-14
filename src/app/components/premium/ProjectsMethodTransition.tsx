import { useEffect } from "react";

export default function ProjectsMethodTransition() {
  useEffect(() => {
    const ensureTransition = () => {
      const method = document.querySelector<HTMLElement>(".method-section");
      if (!method || method.previousElementSibling?.classList.contains("projects-method-transition")) return;

      const transition = document.createElement("div");
      transition.className = "projects-method-transition";
      transition.setAttribute("aria-hidden", "true");
      transition.innerHTML = `
        <div class="projects-method-transition__line"></div>
        <div class="projects-method-transition__badge">
          <span>03</span>
          <i></i>
          <span>04</span>
        </div>
        <div class="projects-method-transition__label">DU RÉSULTAT À LA MÉTHODE</div>
      `;

      method.parentElement?.insertBefore(transition, method);
    };

    ensureTransition();
    const observer = new MutationObserver(ensureTransition);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
