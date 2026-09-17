import { useEffect } from "react";

export default function ExpertiseSpatialCards() {
  useEffect(() => {
    let disposed = false;
    let cleanup: (() => void) | undefined;

    const boot = () => {
      if (disposed) return;
      const section = document.querySelector<HTMLElement>("#expertises");
      if (!section) {
        requestAnimationFrame(boot);
        return;
      }

      const grid = section.querySelector<HTMLElement>(".expertise-grid");
      const cards = Array.from(
        section.querySelectorAll<HTMLElement>(".expertise-card"),
      );
      if (!grid || cards.length === 0) return;

      section.classList.add("expertise-spatial-ready");
      cards.forEach((card, index) => {
        card.dataset.spatialIndex = String(index);
        card.style.setProperty("--card-index", String(index));
      });

      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer = matchMedia("(pointer: fine)").matches;

      let revealObserver: IntersectionObserver | undefined;
      if (reduced) {
        cards.forEach((card) => card.classList.add("is-spatial-visible"));
      } else {
        revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const card = entry.target as HTMLElement;
              const index = Number(card.dataset.spatialIndex || 0);
              window.setTimeout(() => {
                if (!disposed) card.classList.add("is-spatial-visible");
              }, index * 145);
              revealObserver?.unobserve(card);
            });
          },
          { threshold: 0.24, rootMargin: "0px 0px -7% 0px" },
        );
        cards.forEach((card) => revealObserver?.observe(card));
      }

      let raf = 0;
      const updateProgress = () => {
        raf = 0;
        const rect = section.getBoundingClientRect();
        const viewport = window.innerHeight || 1;
        const total = rect.height + viewport;
        const progress = Math.max(0, Math.min(1, (viewport - rect.top) / total));
        section.style.setProperty("--expertise-progress", progress.toFixed(4));
      };
      const onScroll = () => {
        if (!raf) raf = requestAnimationFrame(updateProgress);
      };
      updateProgress();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });

      const pointerCleanups: Array<() => void> = [];
      if (finePointer && !reduced) {
        cards.forEach((card) => {
          const move = (event: PointerEvent) => {
            const rect = card.getBoundingClientRect();
            const px = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
            const py = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
            const ry = (px - 0.5) * 8;
            const rx = (0.5 - py) * 6;
            card.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
            card.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
            card.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
            card.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
            card.classList.add("is-spatial-hover");
          };
          const leave = () => {
            card.style.setProperty("--rx", "0deg");
            card.style.setProperty("--ry", "0deg");
            card.style.setProperty("--mx", "50%");
            card.style.setProperty("--my", "50%");
            card.classList.remove("is-spatial-hover");
          };
          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          pointerCleanups.push(() => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          });
        });
      }

      cleanup = () => {
        cancelAnimationFrame(raf);
        revealObserver?.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        pointerCleanups.forEach((fn) => fn());
        section.classList.remove("expertise-spatial-ready");
        cards.forEach((card) => {
          card.classList.remove("is-spatial-visible", "is-spatial-hover");
          card.removeAttribute("data-spatial-index");
          card.style.removeProperty("--card-index");
          card.style.removeProperty("--rx");
          card.style.removeProperty("--ry");
          card.style.removeProperty("--mx");
          card.style.removeProperty("--my");
        });
      };
    };

    requestAnimationFrame(boot);
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return null;
}
