import { useEffect } from "react";

const metrics = [
  { value: 20, suffix: "%", label: "d’économie moyenne", note: "par rapport à une entreprise générale" },
  { value: 8, suffix: "+ ans", label: "d’expérience", note: "en direction de travaux" },
  { value: 30, suffix: "+", label: "partenaires", note: "en Suisse romande" },
];

export default function MethodMetricsEnhancer() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const mount = () => {
      const section = document.querySelector<HTMLElement>(".method-section");
      const intro = section?.querySelector<HTMLElement>(".method-intro");
      if (!section || !intro || section.dataset.sbreMethodMetrics === "true") return false;

      section.dataset.sbreMethodMetrics = "true";
      section.classList.add("method-metrics-ready");

      const metricsRow = document.createElement("div");
      metricsRow.className = "method-metrics";
      metricsRow.setAttribute("aria-label", "Chiffres clés SBRE Ingénierie");
      metricsRow.innerHTML = metrics
        .map(
          (metric, index) => `
            <article class="method-metric" style="--metric-index:${index}">
              <div class="method-metric-value" aria-label="${metric.value}${metric.suffix}">
                <span class="method-counter" data-target="${metric.value}">0</span><span class="method-metric-suffix">${metric.suffix}</span>
              </div>
              <strong>${metric.label}</strong>
              <p>${metric.note}</p>
            </article>`,
        )
        .join("");

      section.insertBefore(metricsRow, intro);

      const counters = Array.from(metricsRow.querySelectorAll<HTMLElement>(".method-counter"));
      let hasAnimated = false;

      const renderFinal = () => {
        counters.forEach((counter) => {
          counter.textContent = counter.dataset.target ?? "0";
        });
      };

      const animateCounters = () => {
        if (hasAnimated) return;
        hasAnimated = true;
        section.classList.add("method-metrics-visible");

        if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
          renderFinal();
          return;
        }

        counters.forEach((counter, index) => {
          const target = Number(counter.dataset.target || 0);
          const duration = 1050 + index * 140;
          const delay = index * 100;
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

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        },
        { threshold: 0.28 },
      );
      observer.observe(section);

      cleanup = () => {
        observer.disconnect();
        metricsRow.remove();
        section.classList.remove("method-metrics-ready", "method-metrics-visible");
        delete section.dataset.sbreMethodMetrics;
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
