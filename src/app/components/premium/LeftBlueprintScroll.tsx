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
  <g class="bp-plan-fragments">
    <path d="M18 42 H82 V98" />
    <path d="M112 92 V168 H54" />
    <path d="M28 205 H74 V252 H120" />
    <path d="M96 294 V354 H42" />
    <path d="M18 424 H68 V388" />
    <path d="M114 468 H76 V536 H34" />
    <path d="M24 604 H88 V650" />
    <path d="M118 690 H70 V742" />
    <path d="M30 792 H78 V836 H110" />
    <path d="M96 914 H46 V972" />
  </g>
  <g class="bp-detail">
    <path d="M38 132 H68 V158" />
    <path d="M86 236 H112" />
    <path d="M24 326 H54 V366" />
    <path d="M82 414 H112 V442" />
    <path d="M44 560 H76 V588" />
    <path d="M82 676 H108" />
    <path d="M28 756 H58 V782" />
    <path d="M76 872 H112 V898" />
  </g>
  <g class="bp-dimensions">
    <path d="M14 120 H102 M18 114 V126 M98 114 V126" />
    <path d="M32 378 H124 M36 372 V384 M120 372 V384" />
    <path d="M16 646 H112 M20 640 V652 M108 640 V652" />
    <path d="M28 936 H122 M32 930 V942 M118 930 V942" />
  </g>
  <g class="bp-labels">
    <text x="18" y="108">4.20 m</text>
    <text x="36" y="366">6.80 m</text>
    <text x="20" y="634">5.40 m</text>
    <text x="32" y="924">3.60 m</text>
  </g>
</svg>`;

const RIGHT_SVG = `
<svg viewBox="0 0 140 1000" preserveAspectRatio="none" aria-hidden="true">
  <g class="bp-plan-fragments">
    <path data-direction="reverse" d="M120 36 H62 V86" />
    <path data-direction="reverse" d="M28 118 V188 H92" />
    <path data-direction="reverse" d="M116 230 H72 V280 H34" />
    <path data-direction="reverse" d="M42 326 H104 V370" />
    <path data-direction="reverse" d="M122 438 H76 V408" />
    <path data-direction="reverse" d="M24 486 H62 V548 H108" />
    <path data-direction="reverse" d="M118 614 H56 V658" />
    <path data-direction="reverse" d="M34 708 H84 V752" />
    <path data-direction="reverse" d="M116 808 H72 V850 H28" />
    <path data-direction="reverse" d="M44 928 H98 V974" />
  </g>
  <g class="bp-detail">
    <path d="M70 140 H106 V166" />
    <path d="M28 252 H54" />
    <path d="M82 344 H116" />
    <path d="M30 418 H58 V448" />
    <path d="M76 574 H108 V598" />
    <path d="M36 674 H62" />
    <path d="M78 774 H110 V800" />
    <path d="M34 886 H66 V912" />
  </g>
  <g class="bp-dimensions">
    <path d="M28 146 H124 M32 140 V152 M120 140 V152" />
    <path d="M16 362 H106 M20 356 V368 M102 356 V368" />
    <path d="M30 628 H124 M34 622 V634 M120 622 V634" />
    <path d="M18 896 H110 M22 890 V902 M106 890 V902" />
  </g>
  <g class="bp-labels">
    <text x="82" y="134">5.75 m</text>
    <text x="22" y="350">4.90 m</text>
    <text x="82" y="616">7.10 m</text>
    <text x="24" y="884">3.25 m</text>
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
        .sbre-blueprint-side{position:absolute;top:0;height:100vh;overflow:hidden;opacity:.62}
        .sbre-blueprint-side.left{left:0}
        .sbre-blueprint-side.right{right:0}
        .sbre-blueprint-side svg{display:block;width:100%;height:100%}
        .sbre-blueprint-side path{fill:none;stroke:#0a5c3d;vector-effect:non-scaling-stroke;stroke-linecap:square;stroke-linejoin:miter}
        .sbre-blueprint-side .bp-plan-fragments path{stroke-width:.9;opacity:.28;stroke-dasharray:5 7;animation:bp-plan-flow 6.2s linear 4.2s infinite}
        .sbre-blueprint-side .bp-plan-fragments path:nth-child(even){animation-direction:reverse;animation-duration:7.1s}
        .sbre-blueprint-side .bp-detail path{stroke-width:.72;opacity:.20;stroke-dasharray:2 6;animation:bp-detail-flow 8.4s linear 4.4s infinite}
        .sbre-blueprint-side .bp-detail path:nth-child(3n+2){animation-direction:reverse;animation-duration:9.2s}
        .sbre-blueprint-side .bp-dimensions path{stroke-width:.68;opacity:.22;stroke-dasharray:3 5;animation:bp-dimension-flow 10.4s linear 4.6s infinite}
        .sbre-blueprint-side.right .bp-plan-fragments path{animation-delay:4.5s}
        .sbre-blueprint-side.right .bp-detail path{animation-delay:4.7s}
        .sbre-blueprint-side.right .bp-dimensions path{animation-delay:4.9s}
        .sbre-blueprint-side text{fill:#0a5c3d;font:500 7.5px/1 Inter,Arial,sans-serif;letter-spacing:.05em;opacity:.24}
        .sbre-architectural-margins.theme-dark .sbre-blueprint-side{opacity:.80}
        .sbre-architectural-margins.theme-dark .sbre-blueprint-side path{stroke:#fff!important}
        .sbre-architectural-margins.theme-dark .sbre-blueprint-side .bp-plan-fragments path{opacity:.46}
        .sbre-architectural-margins.theme-dark .sbre-blueprint-side .bp-detail path{opacity:.34}
        .sbre-architectural-margins.theme-dark .sbre-blueprint-side .bp-dimensions path{opacity:.40}
        .sbre-architectural-margins.theme-dark .sbre-blueprint-side text{fill:#fff!important;opacity:.42}
        @keyframes bp-plan-flow{from{stroke-dashoffset:0}to{stroke-dashoffset:-24}}
        @keyframes bp-detail-flow{from{stroke-dashoffset:0}to{stroke-dashoffset:16}}
        @keyframes bp-dimension-flow{from{stroke-dashoffset:0}to{stroke-dashoffset:-18}}
        @media(max-width:767px){.sbre-architectural-margins{display:none!important}}
        @media(prefers-reduced-motion:reduce){.sbre-blueprint-side path{animation:none!important}}
      </style>
      <div class="sbre-blueprint-side left">${LEFT_SVG}</div>
      <div class="sbre-blueprint-side right">${RIGHT_SVG}</div>
    `;

    document.body.appendChild(root);

    const themeHost = document.querySelector<HTMLElement>(".sbre-theme");
    const syncTheme = () => {
      root.classList.toggle("theme-dark", Boolean(themeHost?.classList.contains("theme-dark")));
    };
    syncTheme();

    const themeObserver = themeHost ? new MutationObserver(syncTheme) : null;
    themeObserver?.observe(themeHost, { attributes: true, attributeFilter: ["class"] });

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
      if (typeof path.getTotalLength !== "function") {
        path.style.strokeDashoffset = "0";
        return;
      }

      const length = path.getTotalLength();
      const reverse = path.dataset.direction === "reverse";
      path.dataset.planDash = path.closest(".bp-detail") ? "2 6" : path.closest(".bp-dimensions") ? "3 5" : "5 7";
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = reduced ? "0" : `${reverse ? -length : length}`;
    });

    if (reduced) {
      paths.forEach((path) => {
        path.style.strokeDasharray = path.dataset.planDash || "5 7";
      });
      labels.forEach((label) => (label.style.opacity = "0.24"));
      return () => {
        themeObserver?.disconnect();
        window.removeEventListener("resize", sizeSides);
        root.remove();
      };
    }

    let disposed = false;

    loadGsap()
      .then(() => {
        if (disposed || !window.gsap) return;

        const leftFragments = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-plan-fragments path"));
        const leftDetail = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-detail path"));
        const leftDims = Array.from(root.querySelectorAll<SVGPathElement>(".left .bp-dimensions path"));
        const leftLabels = Array.from(root.querySelectorAll<SVGTextElement>(".left text"));

        const rightFragments = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-plan-fragments path"));
        const rightDetail = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-detail path"));
        const rightDims = Array.from(root.querySelectorAll<SVGPathElement>(".right .bp-dimensions path"));
        const rightLabels = Array.from(root.querySelectorAll<SVGTextElement>(".right text"));

        const leftTl = window.gsap.timeline({ defaults: { ease: "power1.inOut" } });
        leftTl.to(leftFragments, { strokeDashoffset: 0, duration: 1.0, stagger: 0.18 }, 0.35);
        leftTl.to(leftDetail, { strokeDashoffset: 0, duration: 0.75, stagger: 0.16 }, 1.4);
        leftTl.to(leftDims, { strokeDashoffset: 0, duration: 0.65, stagger: 0.20 }, 2.4);
        leftTl.to(leftLabels, { opacity: 0.24, duration: 0.45, stagger: 0.12 }, 3.0);
        leftTl.to(paths.filter((path) => path.closest(".left")), {
          strokeDasharray: (_index: number, target: SVGPathElement) => target.dataset.planDash || "5 7",
          duration: 0.45,
        }, 3.25);

        const rightTl = window.gsap.timeline({ defaults: { ease: "power1.inOut" } });
        rightTl.to(rightFragments, { strokeDashoffset: 0, duration: 1.05, stagger: 0.19 }, 0.55);
        rightTl.to(rightDetail, { strokeDashoffset: 0, duration: 0.78, stagger: 0.17 }, 1.6);
        rightTl.to(rightDims, { strokeDashoffset: 0, duration: 0.68, stagger: 0.20 }, 2.65);
        rightTl.to(rightLabels, { opacity: 0.24, duration: 0.45, stagger: 0.12 }, 3.2);
        rightTl.to(paths.filter((path) => path.closest(".right")), {
          strokeDasharray: (_index: number, target: SVGPathElement) => target.dataset.planDash || "5 7",
          duration: 0.45,
        }, 3.45);
      })
      .catch(() => {
        if (disposed) return;
        paths.forEach((path) => {
          path.style.strokeDashoffset = "0";
          path.style.strokeDasharray = path.dataset.planDash || "5 7";
        });
        labels.forEach((label) => (label.style.opacity = "0.24"));
      });

    return () => {
      disposed = true;
      themeObserver?.disconnect();
      window.removeEventListener("resize", sizeSides);
      root.remove();
    };
  }, [pathname]);

  return null;
}
