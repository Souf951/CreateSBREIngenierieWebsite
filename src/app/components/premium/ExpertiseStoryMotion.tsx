import { useEffect } from "react";

/** Scroll-driven storytelling for the homepage "Notre rôle" section. */
export default function ExpertiseStoryMotion() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let observer: MutationObserver | undefined;

    const mountStory = (section: HTMLElement) => {
      if (section.dataset.storyReady === "true") return;

      section.dataset.storyReady = "true";
      const reduced = matchMedia("(prefers-reduced-motion: reduce)");
      let raf = 0;

      const render = () => {
        raf = 0;

        if (reduced.matches) {
          section.dataset.storyStage = "4";
          section.style.setProperty("--expertise-progress", "1");
          return;
        }

        const rect = section.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const travel = Math.max(rect.height * 0.72, viewport * 0.78);
        const entered = viewport * 0.88 - rect.top;
        const progress = Math.max(0, Math.min(1, entered / travel));

        let stage = 0;
        if (progress >= 0.02) stage = 1;
        if (progress >= 0.26) stage = 2;
        if (progress >= 0.50) stage = 3;
        if (progress >= 0.74) stage = 4;

        section.dataset.storyStage = String(stage);
        section.style.setProperty("--expertise-progress", progress.toFixed(3));
      };

      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(render);
      };

      render();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule, { passive: true });
      reduced.addEventListener?.("change", schedule);

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        reduced.removeEventListener?.("change", schedule);
        delete section.dataset.storyStage;
        delete section.dataset.storyReady;
        section.style.removeProperty("--expertise-progress");
      };
    };

    const tryMount = () => {
      const section = document.querySelector<HTMLElement>("#expertises");
      if (!section) return false;
      mountStory(section);
      return true;
    };

    if (!tryMount()) {
      observer = new MutationObserver(() => {
        if (tryMount()) {
          observer?.disconnect();
          observer = undefined;
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      cleanup?.();
    };
  }, []);

  return null;
}
