import { useEffect } from "react";

export default function MethodSectionSpatialMotion() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const mount = () => {
      const section = document.querySelector<HTMLElement>(".method-section");
      if (!section || section.dataset.sbreSpatialMotion === "true") return false;

      const list = section.querySelector<HTMLElement>(".method-list");
      const items = Array.from(section.querySelectorAll<HTMLDetailsElement>(".method-list details"));
      if (!list || !items.length) return false;

      section.dataset.sbreSpatialMotion = "true";
      section.classList.add("method-spatial-ready");
      items.forEach((item, index) => {
        item.style.setProperty("--method-index", String(index));
        item.classList.toggle("method-card-active", item.open);
      });

      const revealObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) section.classList.add("method-spatial-visible");
        },
        { threshold: 0.22 },
      );
      revealObserver.observe(section);

      const onPointerMove = (event: PointerEvent) => {
        if (window.matchMedia("(max-width: 980px)").matches) return;
        const rect = section.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        section.style.setProperty("--method-x", `${(x * 100).toFixed(1)}%`);
        section.style.setProperty("--method-y", `${(y * 100).toFixed(1)}%`);
        section.style.setProperty("--method-ry", `${((x - 0.5) * 4).toFixed(2)}deg`);
        section.style.setProperty("--method-rx", `${((0.5 - y) * 2.4).toFixed(2)}deg`);
      };

      const onPointerLeave = () => {
        section.style.setProperty("--method-rx", "0deg");
        section.style.setProperty("--method-ry", "0deg");
      };

      const onToggle = (event: Event) => {
        const item = event.currentTarget as HTMLDetailsElement;
        requestAnimationFrame(() => {
          items.forEach((entry) => entry.classList.toggle("method-card-active", entry.open));
          if (item.open) item.classList.add("method-card-active");
        });
      };

      section.addEventListener("pointermove", onPointerMove);
      section.addEventListener("pointerleave", onPointerLeave);
      items.forEach((item) => item.addEventListener("toggle", onToggle));

      cleanup = () => {
        revealObserver.disconnect();
        section.removeEventListener("pointermove", onPointerMove);
        section.removeEventListener("pointerleave", onPointerLeave);
        items.forEach((item) => item.removeEventListener("toggle", onToggle));
        section.classList.remove("method-spatial-ready", "method-spatial-visible");
        section.style.removeProperty("--method-x");
        section.style.removeProperty("--method-y");
        section.style.removeProperty("--method-rx");
        section.style.removeProperty("--method-ry");
        delete section.dataset.sbreSpatialMotion;
      };

      return true;
    };

    if (mount()) return () => cleanup?.();

    const observer = new MutationObserver(() => {
      if (mount()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup?.();
    };
  }, []);

  return null;
}
