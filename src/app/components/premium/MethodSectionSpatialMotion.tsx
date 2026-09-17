import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function MethodSectionSpatialMotion() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let section: HTMLElement | null = null;
    let raf = 0;
    const cleanups: Array<() => void> = [];

    const bind = () => {
      if (cancelled || section) return;
      const next = document.querySelector<HTMLElement>(".method-section");
      if (!next) return;
      section = next;

      const list = next.querySelector<HTMLElement>(".method-list");
      const intro = next.querySelector<HTMLElement>(".method-intro");
      const cards = Array.from(next.querySelectorAll<HTMLDetailsElement>(".method-list details"));
      if (!list || !intro || !cards.length) return;

      next.classList.add("method-spatial-ready");
      cards.forEach((card, index) => card.style.setProperty("--method-index", String(index)));

      const revealObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) next.classList.add("method-spatial-visible");
        },
        { threshold: 0.2 },
      );
      revealObserver.observe(next);
      cleanups.push(() => revealObserver.disconnect());

      const syncOpenState = () => {
        cards.forEach((card) => card.classList.toggle("method-card-active", card.open));
      };
      cards.forEach((card) => {
        card.addEventListener("toggle", syncOpenState);
        cleanups.push(() => card.removeEventListener("toggle", syncOpenState));
      });
      syncOpenState();

      const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

      const onMove = (event: PointerEvent) => {
        if (!finePointer.matches || reduced.matches) return;
        const rect = next.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          next.style.setProperty("--method-x", `${(x * 100).toFixed(2)}%`);
          next.style.setProperty("--method-y", `${(y * 100).toFixed(2)}%`);
          next.style.setProperty("--method-ry", `${((x - 0.5) * 4.2).toFixed(2)}deg`);
          next.style.setProperty("--method-rx", `${((0.5 - y) * 2.8).toFixed(2)}deg`);
        });
      };

      const onLeave = () => {
        cancelAnimationFrame(raf);
        next.style.setProperty("--method-x", "50%");
        next.style.setProperty("--method-y", "45%");
        next.style.setProperty("--method-rx", "0deg");
        next.style.setProperty("--method-ry", "0deg");
      };

      next.addEventListener("pointermove", onMove, { passive: true });
      next.addEventListener("pointerleave", onLeave, { passive: true });
      cleanups.push(() => {
        next.removeEventListener("pointermove", onMove);
        next.removeEventListener("pointerleave", onLeave);
      });
    };

    bind();
    const domObserver = new MutationObserver(bind);
    domObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      domObserver.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      section?.classList.remove("method-spatial-ready", "method-spatial-visible");
      section?.removeAttribute("style");
    };
  }, [pathname]);

  return null;
}
