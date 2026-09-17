import { useEffect } from "react";

const metrics = [
  { value: 20, prefix: "", suffix: "%", label: "d’économie moyenne", note: "par rapport à une entreprise générale" },
  { value: 8, prefix: "+ ", suffix: " ans", label: "d’expérience", note: "en direction de travaux" },
  { value: 30, prefix: "+ ", suffix: "", label: "partenaires", note: "en Suisse romande" },
];

export default function MethodSectionSpatialMotion() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const mount = () => {
      const section = document.querySelector<HTMLElement>(".method-section");
      if (!section || section.dataset.sbreSpatialMotion === "true") return false;

      const list = section.querySelector<HTMLElement>(".method-list");
      const intro = section.querySelector<HTMLElement>(".method-intro");
      const items = Array.from(section.querySelectorAll<HTMLDetailsElement>(".method-list details"));
      if (!list || !intro || !items.length) return false;

      section.dataset.sbreSpatialMotion = "true";
      section.classList.add("method-spatial-ready", "method-metrics-ready");
      items.forEach((item, index) => {
        item.style.setProperty("--method-index", String(index));
        item.classList.toggle("method-card-active", item.open);
      });

      const metricsRow = document.createElement("div");
      metricsRow.className = "method-metrics";
      metricsRow.setAttribute("aria-label", "Chiffres clés SBRE Ingénierie");
      metricsRow.innerHTML = metrics
        .map(
          (metric, index) => `
            <article class="method-metric" style="--metric-index:${index}">
              <div class="method-metric-value" aria-label="${metric.prefix}${metric.value}${metric.suffix}">
                ${metric.prefix ? `<span class="method-metric-prefix">${metric.prefix}</span>` : ""}<span class="method-counter" data-target="${metric.value}">0</span>${metric.suffix ? `<span class="method-metric-suffix">${metric.suffix}</span>` : ""}
              </div>
              <strong>${metric.label}</strong>
              <p>${metric.note}</p>
            </article>`,
        )
        .join("");
      section.insertBefore(metricsRow, intro);

      const counters = Array.from(metricsRow.querySelectorAll<HTMLElement>(".method-counter"));
      let metricsAnimated = false;

      const animateCounters = () => {
        if (metricsAnimated) return;
        metricsAnimated = true;
        section.classList.add("method-metrics-visible");

        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          counters.forEach((counter) => {
            counter.textContent = counter.dataset.target ?? "0";
          });
          return;
        }

        counters.forEach((counter, index) => {
          const target = Number(counter.dataset.target || 0);
          const duration = 1850 + index * 220;
          const delay = index * 160;
          const startedAt = performance.now() + delay;

          const tick = (now: number) => {
            if (now < startedAt) {
              requestAnimationFrame(tick);
              return;
            }
            const progress = Math.min(1, (now - startedAt) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = String(Math.round(target * eased));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        });
      };

      const revealObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            section.classList.add("method-spatial-visible");
            animateCounters();
          }
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
        metricsRow.remove();
        section.classList.remove("method-spatial-ready", "method-spatial-visible", "method-metrics-ready", "method-metrics-visible");
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
