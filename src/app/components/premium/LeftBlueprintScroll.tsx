import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gsap?: {
      timeline: (options?: Record<string, unknown>) => {
        to: (targets: Element[] | Element, vars: Record<string, unknown>, position?: string | number) => unknown;
      };
    };
  }
}

const LEFT_SVG = `
<svg viewBox="0 0 140 1000" preserveAspectRatio="none" aria-hidden="true">
  <g class="bp-serpentine">
    <path d="M28 10 H104 V92 H62 V166 H116 V244 H46 V330 H96 V408 H34 V500 H108 V588 H58 V674 H118 V760 H42 V848 H94 V930 H30 V992" />
  </g>
  <g class="bp-structure">
    <path d="M62 92 V132 H96 V166" />
    <path d="M46 244 H22 V286 H64" />
    <path d="M96 330 H122 V372 H76" />
    <path d="M34 408 H16 V458 H64" />
    <path d="M108 500 H126 V548 H82" />
    <path d="M58 588 H24 V630 H72" />
    <path d="M118 674 H92 V716 H54" />
    <path d="M42 760 H18 V810 H70" />
    <path d="M94 848 H122 V892 H66" />
  </g>
  <g class="bp-detail">
    <path d="M36 54 H72 V78 H100" />
    <path d="M28 274 H52 V304" />
    <path d="M76 352 H104 V388" />
    <path d="M26 442 H56 V474" />
    <path d="M78 522 H108 V558" />
    <path d="M34 612 H62 V646" />
    <path d="M78 694 H104 V732" />
    <path d="M28 792 H58 V824" />
    <path d="M68 872 H100 V910" />
  </g>
  <g class="bp-dimensions">
    <path d="M14 120 H120 M18 114 V126 M116 114 V126" />
    <path d="M14 390 H126 M18 384 V396 M122 384 V396" />
    <path d="M14 650 H124 M18 644 V656 M120 644 V656" />
    <path d="M16 944 H120 M20 938 V950 M116 938 V950" />
  </g>
  <g class="bp-labels">
    <text x="18" y="108">4.20</text>
    <text x="18" y="378">6.80</text>
    <text x="18" y="638">5.40</text>
    <text x="20" y="932">3.60</text>
  </g>
</svg>`;

const RIGHT_SVG = `
<svg viewBox="0 0 140 1000" preserveAspectRatio="none" aria-hidden="true">
  <g class="bp-serpentine">
    <path data-direction="reverse" d="M108 12 V86 H54 V162 H118 V242 H72 V318 H24 V402 H88 V480 H40 V566 H112 V650 H66 V736 H20 V824 H84 V906 H44 V990" />
  </g>
  <g class="bp-structure">
    <path data-direction="reverse" d="M54 86 H24 V128 H76" />
    <path data-direction="reverse" d="M118 162 H92 V204 H58" />
    <path data-direction="reverse" d="M72 242 H104 V282 H52" />
    <path data-direction="reverse" d="M24 318 H50 V360 H94" />
    <path data-direction="reverse" d="M88 402 H120 V444 H68" />
    <path data-direction="reverse" d="M40 480 H18 V524 H70" />
    <path data-direction="reverse" d="M112 566 H86 V610 H54" />
    <path data-direction="reverse" d="M66 650 H98 V692 H48" />
    <path data-direction="reverse" d="M20 736 H48 V780 H92" />
    <path data-direction="reverse" d="M84 824 H116 V866 H60" />
  </g>
  <g class="bp-detail">
    <path d="M78 48 H108 V72" />
    <path d="M34 190 H64 V222 H94" />
    <path d="M82 268 H112 V300" />
    <path d="M30 344 H58 V378" />
    <path d="M76 430 H106 V462" />
    <path d="M26 506 H56 V542" />
    <path d="M82 594 H110 V626" />
    <path d="M34 680 H62 V714" />
    <path d="M72 766 H104 V804" />
    <path d="M34 852 H64 V888" />
  </g>
  <g class="bp-dimensions">
    <path d="M18 144 H126 M22 138 V150 M122 138 V150" />
    <path d="M16 370 H124 M20 364 V376 M120 364 V376" />
    <path d="M18 620 H126 M22 614 V626 M122 614 V626" />
    <path d="M18 882 H124 M22 876 V888 M120 876 V888" />
  </g>
  <g class="bp-labels">
    <text x="84" y="132">5.75</text>
    <text x="80" y="358">4.90</text>
    <text x="84" y="608">7.10</text>
    <text x="80" y="870">3.25</text>
  </g>
</svg>`;

function loadGsap(): Promise<void> {
  if (window.gsap) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-sbre-gsap="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("GSAP failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js";
    script.async = true;
    script.dataset.sbreGsap = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("GSAP failed to load"));
    document.head.appendChild(script);
  });
}

export default function LeftBlueprintScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.createElement("div");
    root.className = "sbre-architectural-margins";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
      <style>
        .sbre-architectural-margins{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}
        .sbre-blueprint-side{position:absolute;top:0;height:100vh;overflow:hidden;opacity:.78}
        .sbre-blueprint-side.left{left:0}
        .sbre-blueprint-side.right{right:0}
        .sbre-blueprint-side svg{display:block;width:100%;height:100%}
        .sbre-blueprint-side path{fill:none;stroke:#0a5c3d;stroke-width:1.05;vector-effect:non-scaling-stroke;stroke-linecap:square;stroke-linejoin:miter;opacity:.37}
        .sbre-blueprint-side .bp-serpentine path{stroke-width:1.28;opacity:.46}
        .sbre-blueprint-side .bp-detail path{stroke-width:.88;opacity:.24}
        .sbre-blueprint-side .bp-dimensions path{stroke-width:.72;opacity:.19}
        .sbre-blueprint-side text{fill:#0a5c3d;font:500 8px/1 Inter,Arial,sans-serif;letter-spacing:.08em;opacity:0}
        .theme-dark .sbre-blueprint-side path{stroke:#fff;opacity:.29}
        .theme-dark .sbre-blueprint-side .bp-serpentine path{opacity:.38}
        .theme-dark .sbre-blueprint-side .bp-detail path{opacity:.20}
        .theme-dark .sbre-blueprint-side .bp-dimensions path{opacity:.16}
        .theme-dark .sbre-blueprint-side text{fill:#fff}
        @media(max-width:767px){.sbre-architectural-margins{display:none!important}}
      </style>
      <div class="sbre-blueprint-side left">${LEFT_SVG}</div>
      <div class="sbre-blueprint-side right">${RIGHT_SVG}</div>
    `;

    document.body.appendChild(root);

    const leftSide = root.querySelector<HTMLElement>(".sbre-blueprint-side.left");
    const rightSide = root.querySelector<HTMLElement>(".sbre-blueprint-side.right");

    const sizeSides = () => {
      const hero = document.querySelector<HTMLElement>(".premium-site .hero");
      const rect = hero?.getBoundingClientRect();
      const vw = window.innerWidth;

      const leftGap = rect ? Math.max(0, rect.left) : Math.max(0, (vw - 1180) / 2);
      const rightGap = rect ? Math.max(0, vw - rect.right) : leftGap;

      if (leftSide) {
        leftSide.style.width = `${Math.max(0, leftGap)}px`;
        leftSide.style.display = leftGap >= 90 ? "block" : "none";
      }
      if (rightSide) {
        rightSide.style.width = `${Math.max(0, rightGap)}px`;
        rightSide.style.display = rightGap >= 90 ? "block" : "none";
      }
    };

    sizeSides();
    window.addEventListener("resize", sizeSides, { passive: true });

    const paths = Array.from(root.querySelectorAll<SVGPathElement>("path"));
    const labels = Array.from(root.querySelectorAll<SVGTextElement>("text"));

    paths.forEach((path) => {
      const length = path.getTotalLength();
      const reverse = path.dataset.direction === "reverse";
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = reduced ? "0" : `${reverse ? -length : length}`;
    });

    if (reduced) {
      labels.forEach((label) => (label.style.opacity = "0.34"));
      return () => {
        window.removeEventListener("resize", sizeSides);
        root.remove();
      };
    }

    let disposed = false;

    loadGsap()
      .then(() => {
        if (disposed || !window.gsap) return;

        const leftSnake = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-serpentine path"));
        const leftStructure = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-structure path"));
        const leftDetail = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-detail path"));
        const leftDims = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-dimensions path"));
        const leftLabels = Array.from(root.querySelectorAll<SVGTextElement>(".left text"));

        const rightSnake = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-serpentine path"));
        const rightStructure = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-structure path"));
        const rightDetail = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-detail path"));
        const rightDims = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-dimensions path"));
        const rightLabels = Array.from(root.querySelectorAll<SVGTextElement>(".right text"));

        // LEFT: one continuous serpentine stroke leads the composition from top to bottom.
        const leftTl = window.gsap.timeline({ defaults: { ease: "power1.inOut" } });
        leftTl.to(leftSnake, { strokeDashoffset: 0, duration: 5.8 }, 0.15);
        leftTl.to(leftStructure, { strokeDashoffset: 0, duration: 1.15, stagger: 0.26 }, 1.4);
        leftTl.to(leftDetail, { strokeDashoffset: 0, duration: 0.95, stagger: 0.22 }, 3.8);
        leftTl.to(leftDims, { strokeDashoffset: 0, duration: 0.72, stagger: 0.24 }, 6.0);
        leftTl.to(leftLabels, { opacity: 0.30, duration: 0.55, stagger: 0.16 }, 6.75);

        // RIGHT: deliberately different — it starts from the bottom, builds structural modules,
        // then the reverse serpentine joins them into one technical drawing.
        const rightTl = window.gsap.timeline({ defaults: { ease: "power1.inOut" } });
        rightTl.to(rightStructure, { strokeDashoffset: 0, duration: 1.25, stagger: 0.30 }, 0.55);
        rightTl.to(rightDetail, { strokeDashoffset: 0, duration: 0.95, stagger: 0.24 }, 2.55);
        rightTl.to(rightSnake, { strokeDashoffset: 0, duration: 6.4 }, 3.0);
        rightTl.to(rightDims, { strokeDashoffset: 0, duration: 0.76, stagger: 0.26 }, 7.65);
        rightTl.to(rightLabels, { opacity: 0.30, duration: 0.55, stagger: 0.16 }, 8.5);
      })
      .catch(() => {
        if (disposed) return;
        paths.forEach((path) => {
          path.style.transition = "stroke-dashoffset 6s ease";
          path.style.strokeDashoffset = "0";
        });
        labels.forEach((label) => (label.style.opacity = "0.30"));
      });

    return () => {
      disposed = true;
      window.removeEventListener("resize", sizeSides);
      root.remove();
    };
  }, [pathname]);

  return null;
}
