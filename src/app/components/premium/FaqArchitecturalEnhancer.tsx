import { useEffect } from "react";

export default function FaqArchitecturalEnhancer() {
  useEffect(() => {
    let cleanup: (() => void) | null = null;

    const mount = () => {
      const section = document.querySelector<HTMLElement>(".premium-site .faq-section");
      if (!section || section.dataset.sbreFaqArchitectural === "true") return false;

      section.dataset.sbreFaqArchitectural = "true";
      section.classList.add("faq-architectural");

      const title = document.createElement("div");
      title.className = "faq-architectural-title";
      title.setAttribute("aria-hidden", "true");
      title.innerHTML = `
        <span>SBRE / NOTE TECHNIQUE</span>
        <span>FAQ — 07</span>
      `;
      section.prepend(title);

      const grid = document.createElement("div");
      grid.className = "faq-blueprint-grid";
      grid.setAttribute("aria-hidden", "true");
      grid.innerHTML = `
        <span class="faq-grid-line faq-grid-line-a"></span>
        <span class="faq-grid-line faq-grid-line-b"></span>
        <span class="faq-grid-line faq-grid-line-c"></span>
        <span class="faq-grid-node faq-grid-node-a"></span>
        <span class="faq-grid-node faq-grid-node-b"></span>
        <span class="faq-grid-node faq-grid-node-c"></span>
      `;
      section.prepend(grid);

      const details = Array.from(section.querySelectorAll<HTMLDetailsElement>("details"));
      const listeners: Array<() => void> = [];

      details.forEach((item, index) => {
        item.classList.add("faq-architectural-item");
        item.style.setProperty("--faq-index", String(index));

        const summary = item.querySelector<HTMLElement>("summary");
        const answer = item.querySelector<HTMLElement>(":scope > p");
        if (!summary || !answer) return;

        const number = document.createElement("span");
        number.className = "faq-architectural-number";
        number.textContent = `0${index + 1}`;
        summary.prepend(number);

        const rail = document.createElement("span");
        rail.className = "faq-architectural-rail";
        rail.setAttribute("aria-hidden", "true");
        item.appendChild(rail);

        const trace = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        trace.setAttribute("class", "faq-answer-trace");
        trace.setAttribute("viewBox", "0 0 520 44");
        trace.setAttribute("preserveAspectRatio", "none");
        trace.setAttribute("aria-hidden", "true");
        trace.innerHTML = '<path d="M0 22 H145 L176 6 H330 L360 22 H520" pathLength="1" />';
        answer.prepend(trace);

        const updateState = () => {
          item.classList.toggle("is-open", item.open);
        };
        updateState();
        item.addEventListener("toggle", updateState);
        listeners.push(() => item.removeEventListener("toggle", updateState));

        if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        const move = (event: PointerEvent) => {
          const rect = item.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          item.style.setProperty("--faq-ry", `${px * 3.8}deg`);
          item.style.setProperty("--faq-rx", `${py * -2.6}deg`);
          item.style.setProperty("--faq-glow-x", `${(px + 0.5) * 100}%`);
          item.style.setProperty("--faq-glow-y", `${(py + 0.5) * 100}%`);
        };
        const leave = () => {
          item.style.setProperty("--faq-ry", "0deg");
          item.style.setProperty("--faq-rx", "0deg");
        };
        item.addEventListener("pointermove", move);
        item.addEventListener("pointerleave", leave);
        listeners.push(() => item.removeEventListener("pointermove", move));
        listeners.push(() => item.removeEventListener("pointerleave", leave));
      });

      cleanup = () => {
        listeners.forEach((fn) => fn());
        details.forEach((item) => {
          item.classList.remove("faq-architectural-item", "is-open");
          item.style.removeProperty("--faq-index");
          item.style.removeProperty("--faq-ry");
          item.style.removeProperty("--faq-rx");
          item.style.removeProperty("--faq-glow-x");
          item.style.removeProperty("--faq-glow-y");
          item.querySelector(".faq-architectural-number")?.remove();
          item.querySelector(".faq-architectural-rail")?.remove();
          item.querySelector(".faq-answer-trace")?.remove();
        });
        title.remove();
        grid.remove();
        section.classList.remove("faq-architectural");
        delete section.dataset.sbreFaqArchitectural;
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
