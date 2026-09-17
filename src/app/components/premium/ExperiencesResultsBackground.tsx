import { useEffect } from "react";
import tertiaire from "../../../media/1721891231854__1_.webp";
import logements from "../../../media/1741613187041.webp";
import villa from "../../../media/3df6b3d580c913fd1f20bbd13b327fd4.webp";
import "../../../styles/projects-dynamic-background.css";

const backgrounds = [tertiaire, logements, villa];

export default function ExperiencesResultsBackground() {
  useEffect(() => {
    let cleanupSection: (() => void) | null = null;

    const mountBackground = () => {
      const section = document.querySelector<HTMLElement>(".projects-section");
      if (!section || section.dataset.sbreProjectBackgrounds === "true") return false;

      section.dataset.sbreProjectBackgrounds = "true";
      section.classList.add("projects-bg-enhanced");

      const backdrop = document.createElement("div");
      backdrop.className = "projects-dynamic-backdrop";
      backdrop.setAttribute("aria-hidden", "true");

      const layers = backgrounds.map((src, index) => {
        const layer = document.createElement("div");
        layer.className = `projects-dynamic-layer${index === 0 ? " is-active" : ""}`;
        layer.style.backgroundImage = `url(${src})`;
        backdrop.appendChild(layer);
        return layer;
      });

      const veil = document.createElement("div");
      veil.className = "projects-dynamic-veil";
      backdrop.appendChild(veil);
      section.prepend(backdrop);

      const cards = Array.from(section.querySelectorAll<HTMLElement>(".project-card"));
      const handlers: Array<{ node: HTMLElement; type: string; fn: EventListener }> = [];

      const activate = (index: number) => {
        layers.forEach((layer, i) => layer.classList.toggle("is-active", i === index));
      };

      cards.forEach((card, index) => {
        card.dataset.sbreProjectIndex = String(index);
        ["mouseenter", "focusin", "pointerdown"].forEach((type) => {
          const fn: EventListener = () => activate(index);
          card.addEventListener(type, fn);
          handlers.push({ node: card, type, fn });
        });
      });

      const leave: EventListener = () => activate(0);
      section.addEventListener("mouseleave", leave);

      cleanupSection = () => {
        handlers.forEach(({ node, type, fn }) => node.removeEventListener(type, fn));
        section.removeEventListener("mouseleave", leave);
        cards.forEach((card) => delete card.dataset.sbreProjectIndex);
        backdrop.remove();
        section.classList.remove("projects-bg-enhanced");
        delete section.dataset.sbreProjectBackgrounds;
      };

      return true;
    };

    if (mountBackground()) {
      return () => cleanupSection?.();
    }

    const observer = new MutationObserver(() => {
      if (mountBackground()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanupSection?.();
    };
  }, []);

  return null;
}
