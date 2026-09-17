import { useEffect } from "react";
import tertiaire from "../../../media/1721891231854__1_.webp";
import logements from "../../../media/1741613187041.webp";
import villa from "../../../media/3df6b3d580c913fd1f20bbd13b327fd4.webp";

const backgrounds = [tertiaire, logements, villa];

export default function ExperiencesResultsBackground() {
  useEffect(() => {
    let cleanupSection: (() => void) | null = null;

    const mountBackground = () => {
      const section = document.querySelector<HTMLElement>(".projects-section");
      if (!section || section.dataset.sbreProjectBackgrounds === "true") return false;

      section.dataset.sbreProjectBackgrounds = "true";
      section.classList.add("projects-bg-enhanced");

      const previous = {
        backgroundImage: section.style.backgroundImage,
        backgroundSize: section.style.backgroundSize,
        backgroundPosition: section.style.backgroundPosition,
        backgroundRepeat: section.style.backgroundRepeat,
        backgroundColor: section.style.backgroundColor,
      };

      const cards = Array.from(section.querySelectorAll<HTMLElement>(".project-card"));
      const handlers: Array<{ node: HTMLElement; type: string; fn: EventListener }> = [];

      const applyBackground = (index: number) => {
        const src = backgrounds[index] ?? backgrounds[0];
        section.style.backgroundImage =
          `linear-gradient(115deg, rgba(5, 38, 29, 0.68) 0%, rgba(6, 43, 32, 0.56) 48%, rgba(4, 31, 24, 0.64) 100%), url("${src}")`;
        section.style.backgroundSize = "cover";
        section.style.backgroundPosition = "center center";
        section.style.backgroundRepeat = "no-repeat";
        section.style.backgroundColor = "#082d23";
      };

      applyBackground(0);

      cards.forEach((card, index) => {
        card.dataset.sbreProjectIndex = String(index);
        ["mouseenter", "focusin", "pointerdown"].forEach((type) => {
          const fn: EventListener = () => applyBackground(index);
          card.addEventListener(type, fn);
          handlers.push({ node: card, type, fn });
        });
      });

      const leave: EventListener = () => applyBackground(0);
      section.addEventListener("mouseleave", leave);

      cleanupSection = () => {
        handlers.forEach(({ node, type, fn }) => node.removeEventListener(type, fn));
        section.removeEventListener("mouseleave", leave);
        cards.forEach((card) => delete card.dataset.sbreProjectIndex);
        section.style.backgroundImage = previous.backgroundImage;
        section.style.backgroundSize = previous.backgroundSize;
        section.style.backgroundPosition = previous.backgroundPosition;
        section.style.backgroundRepeat = previous.backgroundRepeat;
        section.style.backgroundColor = previous.backgroundColor;
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
