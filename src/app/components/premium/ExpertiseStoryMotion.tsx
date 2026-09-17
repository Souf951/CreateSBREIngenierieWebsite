import { useEffect } from "react";

/** Scroll-driven storytelling for the homepage "Notre rôle" section. */
export default function ExpertiseStoryMotion() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>("#expertises");
    if (!section) return;

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
      const travel = Math.max(rect.height - viewport * 0.38, viewport * 0.9);
      const entered = viewport * 0.78 - rect.top;
      const progress = Math.max(0, Math.min(1, entered / travel));

      let stage = 0;
      if (progress >= 0.08) stage = 1; // heading
      if (progress >= 0.30) stage = 2; // card 1
      if (progress >= 0.55) stage = 3; // card 2
      if (progress >= 0.78) stage = 4; // card 3

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

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener?.("change", schedule);
      delete section.dataset.storyStage;
      section.style.removeProperty("--expertise-progress");
    };
  }, []);

  return null;
}
