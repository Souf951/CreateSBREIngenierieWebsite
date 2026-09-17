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
  <g class="bp-structure">
    <path d="M24 18 H102 V122 H118 V238 H88 V346 H112 V486 H74 V612 H106 V760 H82 V910 H116" />
    <path d="M24 18 V184 H52 V304 H28 V438 H64 V574 H30 V706 H58 V846 H34 V982" />
    <path d="M52 184 H112" />
    <path d="M28 304 H88" />
    <path d="M64 438 H124" />
    <path d="M30 574 H90" />
    <path d="M58 706 H120" />
    <path d="M34 846 H94" />
  </g>
  <g class="bp-detail">
    <path d="M34 90 H70 V146 H98" />
    <path d="M38 250 H72 V282" />
    <path d="M78 384 H106 V420" />
    <path d="M42 520 H72 V550" />
    <path d="M70 650 H98 V684" />
    <path d="M44 790 H70 V820" />
  </g>
  <g class="bp-dimensions">
    <path d="M12 62 H120 M16 56 V68 M116 56 V68" />
    <path d="M16 334 H126 M20 328 V340 M122 328 V340" />
    <path d="M12 690 H126 M16 684 V696 M122 684 V696" />
    <path d="M18 948 H122 M22 942 V954 M118 942 V954" />
  </g>
  <g class="bp-labels">
    <text x="18" y="52">4.20</text>
    <text x="18" y="324">6.80</text>
    <text x="18" y="680">5.40</text>
    <text x="20" y="938">3.60</text>
  </g>
</svg>`;

const RIGHT_SVG = `
<svg viewBox="0 0 140 1000" preserveAspectRatio="none" aria-hidden="true">
  <g class="bp-structure">
    <path d="M112 20 H46 V148 H22 V274 H54 V402 H28 V528 H66 V650 H40 V782 H72 V916 H30" />
    <path d="M112 20 V104 H86 V216 H118 V336 H80 V470 H114 V596 H84 V728 H116 V864 H92 V982" />
    <path d="M46 148 H106" />
    <path d="M54 274 H122" />
    <path d="M28 402 H92" />
    <path d="M66 528 H126" />
    <path d="M40 650 H102" />
    <path d="M72 782 H126" />
    <path d="M30 916 H94" />
  </g>
  <g class="bp-detail">
    <path d="M72 82 H100 V126" />
    <path d="M38 210 H68 V248 H94" />
    <path d="M74 344 H104 V378" />
    <path d="M42 470 H72 V506" />
    <path d="M76 600 H104 V632" />
    <path d="M50 736 H80 V768" />
    <path d="M64 864 H94 V900" />
  </g>
  <g class="bp-dimensions">
    <path d="M18 178 H126 M22 172 V184 M122 172 V184" />
    <path d="M14 452 H124 M18 446 V458 M120 446 V458" />
    <path d="M18 716 H128 M22 710 V722 M124 710 V722" />
    <path d="M18 966 H120 M22 960 V972 M116 960 V972" />
  </g>
  <g class="bp-labels">
    <text x="82" y="168">5.75</text>
    <text x="80" y="442">4.90</text>
    <text x="82" y="706">7.10</text>
    <text x="76" y="956">3.25</text>
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
        .sbre-blueprint-side{position:absolute;top:0;height:100vh;overflow:hidden;opacity:.82}
        .sbre-blueprint-side.left{left:0}
        .sbre-blueprint-side.right{right:0}
        .sbre-blueprint-side svg{display:block;width:100%;height:100%}
        .sbre-blueprint-side path{fill:none;stroke:#0a5c3d;stroke-width:1.12;vector-effect:non-scaling-stroke;stroke-linecap:square;stroke-linejoin:miter;opacity:.44}
        .sbre-blueprint-side .bp-detail path{stroke-width:.9;opacity:.28}
        .sbre-blueprint-side .bp-dimensions path{stroke-width:.75;opacity:.22}
        .sbre-blueprint-side text{fill:#0a5c3d;font:500 8px/1 Inter,Arial,sans-serif;letter-spacing:.08em;opacity:0}
        .theme-dark .sbre-blueprint-side path{stroke:#fff;opacity:.34}
        .theme-dark .sbre-blueprint-side .bp-detail path{opacity:.23}
        .theme-dark .sbre-blueprint-side .bp-dimensions path{opacity:.18}
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
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = reduced ? "0" : `${length}`;
    });

    if (reduced) {
      labels.forEach((label) => (label.style.opacity = "0.42"));
      return () => {
        window.removeEventListener("resize", sizeSides);
        root.remove();
      };
    }

    let disposed = false;

    loadGsap()
      .then(() => {
        if (disposed || !window.gsap) return;

        const leftStructure = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-structure path"));
        const leftDetail = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-detail path"));
        const leftDims = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-dimensions path"));
        const rightStructure = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-structure path"));
        const rightDetail = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-detail path"));
        const rightDims = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-dimensions path"));
        const leftLabels = Array.from(root.querySelectorAll<SVGTextElement>(".left text"));
        const rightLabels = Array.from(root.querySelectorAll<SVGTextElement>(".right text"));

        const tl = window.gsap.timeline({ defaults: { ease: "power1.inOut" } });
        tl.to(leftStructure, { strokeDashoffset: 0, duration: 1.15, stagger: 0.18 }, 0.18);
        tl.to(rightStructure, { strokeDashoffset: 0, duration: 1.25, stagger: 0.20 }, 0.55);
        tl.to(leftDetail, { strokeDashoffset: 0, duration: 0.9, stagger: 0.16 }, 2.1);
        tl.to(rightDetail, { strokeDashoffset: 0, duration: 0.95, stagger: 0.17 }, 2.45);
        tl.to(leftDims, { strokeDashoffset: 0, duration: 0.7, stagger: 0.18 }, 3.65);
        tl.to(rightDims, { strokeDashoffset: 0, duration: 0.72, stagger: 0.19 }, 3.9);
        tl.to(leftLabels, { opacity: 0.34, duration: 0.6, stagger: 0.12 }, 4.25);
        tl.to(rightLabels, { opacity: 0.34, duration: 0.6, stagger: 0.12 }, 4.45);
      })
      .catch(() => {
        if (disposed) return;
        paths.forEach((path) => {
          path.style.transition = "stroke-dashoffset 2.8s ease";
          path.style.strokeDashoffset = "0";
        });
        labels.forEach((label) => (label.style.opacity = "0.34"));
      });

    return () => {
      disposed = true;
      window.removeEventListener("resize", sizeSides);
      root.remove();
    };
  }, [pathname]);

  return null;
}
