import { useEffect } from "react";

const methodSteps = [
  {
    title: "Structurer",
    body:
      "Analyser le dossier, clarifier les objectifs, répartir les responsabilités, identifier les risques et construire une organisation de projet lisible avant le démarrage.",
    foot: "Diagnostic · Organisation · Planning · Responsabilités",
  },
  {
    title: "Budgéter",
    body:
      "Établir les métrés, préparer les soumissions, consulter les entreprises, comparer les offres, clarifier les variantes et sécuriser les adjudications pour garder la maîtrise des coûts.",
    foot: "Métrés · Soumissions · Comparatifs · Adjudications",
  },
  {
    title: "Réaliser",
    body:
      "Coordonner les CFC, piloter les interventions sur le terrain, contrôler la qualité, les délais et les modifications, puis documenter les décisions jusqu’à l’achèvement des travaux.",
    foot: "Coordination · Qualité · Délais · Reporting",
  },
  {
    title: "Exiger",
    body:
      "Préparer les pré-réceptions et réceptions, exiger une finition conforme, suivre la levée complète des réserves et organiser la clôture du chantier jusqu’à la remise des clés.",
    foot: "Finitions · Réceptions · Réserves · Remise des clés",
  },
];

export default function MethodAccordionGuard() {
  useEffect(() => {
    const wireMethodSection = (section: HTMLElement) => {
      if (section.dataset.sbreMethodEnhanced === "true") return;
      section.dataset.sbreMethodEnhanced = "true";

      const eyebrow = section.querySelector<HTMLElement>(".method-intro .eyebrow");
      const heading = section.querySelector<HTMLElement>(".method-intro h2");
      const intro = section.querySelector<HTMLElement>(".method-intro > p:not(.eyebrow)");
      const button = section.querySelector<HTMLButtonElement>(".method-intro .button");

      if (eyebrow) eyebrow.textContent = "03 / LA MÉTHODE SBRE";
      if (heading) heading.innerHTML = "Structurer. Budgéter.<br><em>Réaliser. Exiger.</em>";
      if (intro) {
        intro.textContent =
          "Une méthode simple à lire et exigeante à exécuter : organiser, maîtriser les coûts, conduire les travaux et livrer sans compromis sur la qualité.";
      }
      if (button) button.textContent = "Parlons de votre opération ↗";

      const details = Array.from(section.querySelectorAll<HTMLDetailsElement>(".method-list details"));

      details.forEach((item, index) => {
        const step = methodSteps[index];
        if (!step) return;

        const summary = item.querySelector<HTMLElement>("summary");
        const number = summary?.querySelector<HTMLElement>("span");
        const plus = summary?.querySelector<HTMLElement>("b");
        const body = item.querySelector<HTMLElement>("div > p");
        const foot = item.querySelector<HTMLElement>("div > small");

        if (summary) {
          Array.from(summary.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
              node.remove();
            }
          });

          summary.querySelector(".method-step-initial")?.remove();
          summary.querySelector(".method-step-rest")?.remove();

          const initial = document.createElement("strong");
          initial.className = "method-step-initial";
          initial.textContent = step.title.charAt(0);

          const rest = document.createElement("span");
          rest.className = "method-step-rest";
          rest.textContent = step.title.slice(1);

          if (plus) {
            summary.insertBefore(initial, plus);
            summary.insertBefore(rest, plus);
          } else {
            summary.append(initial, rest);
          }
        }
        if (number) number.textContent = `0${index + 1}`;
        if (body) body.textContent = step.body;
        if (foot) foot.textContent = step.foot;
        if (plus) plus.setAttribute("aria-hidden", "true");

        item.addEventListener("toggle", () => {
          if (!item.open) return;
          details.forEach((other) => {
            if (other !== item && other.open) other.open = false;
          });
        });
      });

      details.forEach((item, index) => {
        item.open = index === 0;
      });
    };

    const wireFaqSection = (section: HTMLElement) => {
      if (section.dataset.sbreFaqEnhanced === "true") return;
      section.dataset.sbreFaqEnhanced = "true";

      const details = Array.from(section.querySelectorAll<HTMLDetailsElement>("details"));
      details.forEach((item) => {
        item.addEventListener("toggle", () => {
          if (!item.open) return;
          details.forEach((other) => {
            if (other !== item && other.open) other.open = false;
          });
        });
      });
    };

    const apply = () => {
      const method = document.querySelector<HTMLElement>(".method-section");
      const faq = document.querySelector<HTMLElement>(".faq-section");
      if (method) wireMethodSection(method);
      if (faq) wireFaqSection(faq);
    };

    apply();

    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
