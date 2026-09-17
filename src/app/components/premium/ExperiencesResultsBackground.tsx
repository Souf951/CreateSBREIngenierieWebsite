import { useEffect } from "react";
import tertiaire from "../../../media/1721891231854__1_.webp";
import logements from "../../../media/1741613187041.webp";
import villa from "../../../media/3df6b3d580c913fd1f20bbd13b327fd4.webp";

const backgrounds = [tertiaire, logements, villa];

export default function ExperiencesResultsBackground() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>(".projects-section");
    if (!section || section.dataset.sbreProjectBackgrounds === "true") return;

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
    const activate = (index: number) => {
      layers.forEach((layer, i) => layer.classList.toggle("is-active", i === index));
      section.style.setProperty("--project-bg-index", String(index));
    };

    cards.forEach((card, index) => {
      const enter = () => activate(index);
      card.addEventListener("mouseenter", enter);
      card.addEventListener("focusin", enter);
      card.addEventListener("pointerdown", enter);
      card.dataset.sbreProjectIndex = String(index);
    });

    const leave = () => activate(0);
    section.addEventListener("mouseleave", leave);

    return () => {
      cards.forEach((card) => {
        const clone = card.cloneNode(true);
        card.parentNode?.replaceChild(clone, card);
      });
      section.removeEventListener("mouseleave", leave);
      backdrop.remove();
      section.classList.remove("projects-bg-enhanced");
      delete section.dataset.sbreProjectBackgrounds;
      section.style.removeProperty("--project-bg-index");
    };
  }, []);

  return null;
}
