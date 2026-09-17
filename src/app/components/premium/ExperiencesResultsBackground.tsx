import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Real delivered-project photos already used by the three project pages.
// Tertiaire — Genève
import tertiaire1 from "../../../media/1721891230963.webp";
import tertiaire2 from "../../../media/1721891231094.webp";
import tertiaire3 from "../../../media/1721891230808.webp";
import tertiaire4 from "../../../media/IMG_2957.webp";

// Micro-logements — Lancy
import lancy1 from "../../../media/1746172633498-2.webp";
import lancy2 from "../../../media/1746172634781-2.webp";
import lancy3 from "../../../media/1746172642405-2.webp";
import lancy4 from "../../../media/cabbfb516d4a0a7b2efdcd36ad672d45.webp";

// Villa — Prangins
import prangins1 from "../../../media/3df6b3d580c913fd1f20bbd13b327fd4.webp";
import prangins2 from "../../../media/35854ac3a0ce421ef049bcb9d3957c41.webp";
import prangins3 from "../../../media/7e3be6433a7e5d0459af5cf69e48117e.webp";
import prangins4 from "../../../media/d8af3db0023b39dd112975781ef26207.webp";

const results = [
  tertiaire1,
  tertiaire2,
  tertiaire3,
  tertiaire4,
  lancy1,
  lancy2,
  lancy3,
  lancy4,
  prangins1,
  prangins2,
  prangins3,
  prangins4,
];

const HOLD_MS = 3800;
const FADE_MS = 1250;

export default function ExperiencesResultsBackground() {
  const { pathname } = useLocation();

  useEffect(() => {
    let cleanupSection: (() => void) | null = null;

    const mountBackground = () => {
      const section = document.querySelector<HTMLElement>(".projects-section");
      if (!section || section.dataset.sbreProjectBackgrounds === "true") return false;

      section.dataset.sbreProjectBackgrounds = "true";
      section.classList.add("projects-bg-enhanced");

      const previousSection = {
        position: section.style.position,
        overflow: section.style.overflow,
        backgroundImage: section.style.backgroundImage,
        backgroundColor: section.style.backgroundColor,
      };

      section.style.position = "relative";
      section.style.overflow = "hidden";
      section.style.backgroundImage = "none";
      section.style.backgroundColor = "#082d23";

      const makeLayer = (className: string) => {
        const layer = document.createElement("div");
        layer.className = className;
        Object.assign(layer.style, {
          position: "absolute",
          inset: "0",
          zIndex: "0",
          pointerEvents: "none",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          opacity: "0",
          transform: "scale(1.035)",
          transition: `opacity ${FADE_MS}ms cubic-bezier(.22,.61,.36,1), transform 6200ms linear`,
          willChange: "opacity, transform",
        });
        return layer;
      };

      const layerA = makeLayer("sbre-results-slide sbre-results-slide-a");
      const layerB = makeLayer("sbre-results-slide sbre-results-slide-b");

      const veil = document.createElement("div");
      veil.className = "sbre-results-veil";
      Object.assign(veil.style, {
        position: "absolute",
        inset: "0",
        zIndex: "1",
        pointerEvents: "none",
        background:
          "linear-gradient(110deg, rgba(3,35,26,.68) 0%, rgba(3,39,29,.57) 48%, rgba(2,29,22,.66) 100%)",
      });

      section.prepend(veil);
      section.prepend(layerB);
      section.prepend(layerA);

      const touchedChildren: Array<{
        node: HTMLElement;
        position: string;
        zIndex: string;
      }> = [];

      Array.from(section.children).forEach((child) => {
        if (!(child instanceof HTMLElement)) return;
        if (
          child.classList.contains("sbre-results-slide") ||
          child.classList.contains("sbre-results-veil")
        ) return;

        touchedChildren.push({
          node: child,
          position: child.style.position,
          zIndex: child.style.zIndex,
        });
        child.style.position = "relative";
        child.style.zIndex = "2";
      });

      let currentIndex = 0;
      let activeLayer = layerA;
      let idleLayer = layerB;
      let timer: number | undefined;
      let stopped = false;

      const preload = results.map((src) => {
        const image = new Image();
        image.decoding = "async";
        image.src = src;
        return image;
      });

      const show = (index: number, immediate = false) => {
        const src = results[index % results.length];
        idleLayer.style.backgroundImage = `url("${src}")`;
        idleLayer.style.transition = immediate
          ? "none"
          : `opacity ${FADE_MS}ms cubic-bezier(.22,.61,.36,1), transform 6200ms linear`;
        idleLayer.style.opacity = "1";
        idleLayer.style.transform = "scale(1.0)";

        activeLayer.style.transition = immediate
          ? "none"
          : `opacity ${FADE_MS}ms cubic-bezier(.22,.61,.36,1), transform 6200ms linear`;
        activeLayer.style.opacity = "0";
        activeLayer.style.transform = "scale(1.035)";

        const oldActive = activeLayer;
        activeLayer = idleLayer;
        idleLayer = oldActive;

        if (immediate) {
          requestAnimationFrame(() => {
            activeLayer.style.transition = `opacity ${FADE_MS}ms cubic-bezier(.22,.61,.36,1), transform 6200ms linear`;
            idleLayer.style.transition = `opacity ${FADE_MS}ms cubic-bezier(.22,.61,.36,1), transform 6200ms linear`;
          });
        }
      };

      // First image is visible immediately.
      layerA.style.backgroundImage = `url("${results[0]}")`;
      layerA.style.opacity = "1";
      layerA.style.transform = "scale(1.0)";
      activeLayer = layerA;
      idleLayer = layerB;

      const scheduleNext = () => {
        timer = window.setTimeout(() => {
          if (stopped) return;
          currentIndex = (currentIndex + 1) % results.length;
          show(currentIndex);
          scheduleNext();
        }, HOLD_MS);
      };

      // Pause the slideshow when this section is not visible, so it does not
      // waste work in the background.
      let visible = true;
      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          if (visible && !timer && !stopped) scheduleNext();
          if (!visible && timer) {
            window.clearTimeout(timer);
            timer = undefined;
          }
        },
        { threshold: 0.08 },
      );
      intersectionObserver.observe(section);

      if (visible) scheduleNext();

      cleanupSection = () => {
        stopped = true;
        if (timer) window.clearTimeout(timer);
        intersectionObserver.disconnect();
        preload.forEach((image) => {
          image.src = "";
        });
        layerA.remove();
        layerB.remove();
        veil.remove();
        touchedChildren.forEach(({ node, position, zIndex }) => {
          node.style.position = position;
          node.style.zIndex = zIndex;
        });
        section.style.position = previousSection.position;
        section.style.overflow = previousSection.overflow;
        section.style.backgroundImage = previousSection.backgroundImage;
        section.style.backgroundColor = previousSection.backgroundColor;
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
  }, [pathname]);

  return null;
}
