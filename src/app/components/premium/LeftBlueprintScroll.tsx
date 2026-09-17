import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function LeftBlueprintScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    const root = document.createElement("div");
    root.className = "sbre-hex-margins";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
      <style>
        .sbre-hex-margins{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}
        .sbre-hex-side{position:absolute;top:0;height:100vh;overflow:hidden;perspective:900px;transition:width .25s ease,opacity .25s ease}
        .sbre-hex-side.left{left:0}
        .sbre-hex-side.right{right:0}
        .sbre-hex-grid{position:absolute;inset:-5vh -10px;transform-style:preserve-3d}
        .sbre-hex-cell{position:absolute;width:var(--hex-size);height:calc(var(--hex-size) * .866);transform-style:preserve-3d;will-change:transform,filter,opacity}
        .sbre-hex-face{position:absolute;inset:0;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);background:linear-gradient(145deg,rgba(6,93,61,.035),rgba(6,93,61,.01));border:1px solid rgba(6,93,61,.22);box-shadow:inset 0 0 18px rgba(6,93,61,.025);transform:translateZ(var(--lift,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg));opacity:var(--alpha,.42);filter:drop-shadow(0 0 calc(var(--glow,0) * 14px) rgba(0,151,96,calc(var(--glow,0) * .45)));transition:transform .18s ease-out,opacity .18s ease-out,border-color .18s ease-out,background .25s ease}
        .sbre-hex-face::after{content:"";position:absolute;inset:2px;clip-path:inherit;border:1px solid rgba(69,214,151,.07);background:radial-gradient(circle at 50% 46%,rgba(49,199,132,calc(var(--glow,0) * .13)),transparent 68%)}
        .sbre-hex-margins.is-dark .sbre-hex-face{background:linear-gradient(145deg,rgba(255,255,255,.018),rgba(11,44,33,.02));border-color:rgba(103,255,185,.20);box-shadow:inset 0 0 18px rgba(38,255,166,.025)}
        .sbre-hex-margins.is-dark .sbre-hex-face::after{border-color:rgba(122,255,196,.10)}
        @media(max-width:900px){.sbre-hex-margins{display:none!important}}
        @media(prefers-reduced-motion:reduce){.sbre-hex-face{transition:none!important}}
      </style>
      <div class="sbre-hex-side left"><div class="sbre-hex-grid"></div></div>
      <div class="sbre-hex-side right"><div class="sbre-hex-grid"></div></div>
    `;

    document.body.appendChild(root);

    const leftSide = root.querySelector<HTMLElement>(".sbre-hex-side.left");
    const rightSide = root.querySelector<HTMLElement>(".sbre-hex-side.right");
    const leftGrid = leftSide?.querySelector<HTMLElement>(".sbre-hex-grid") ?? null;
    const rightGrid = rightSide?.querySelector<HTMLElement>(".sbre-hex-grid") ?? null;
    const themeHost = document.querySelector<HTMLElement>(".sbre-theme");
    let themeObserver: MutationObserver | null = null;
    let cells: HTMLElement[] = [];
    let raf = 0;
    let pointerX = -9999;
    let pointerY = -9999;

    const syncTheme = () => {
      const dark = themeHost?.classList.contains("theme-dark") ?? false;
      root.classList.toggle("is-dark", dark);
    };

    const buildGrid = (grid: HTMLElement, sideWidth: number, isRight: boolean) => {
      grid.innerHTML = "";
      const size = Math.max(48, Math.min(78, sideWidth * .34));
      const cellH = size * .866;
      const xStep = size * .76;
      const yStep = cellH * .86;
      const cols = Math.max(2, Math.ceil(sideWidth / xStep) + 1);
      const rows = Math.ceil(window.innerHeight / yStep) + 3;

      grid.style.setProperty("--hex-size", `${size}px`);

      for (let row = -1; row < rows; row += 1) {
        for (let col = -1; col < cols; col += 1) {
          const cell = document.createElement("div");
          cell.className = "sbre-hex-cell";
          const stagger = row % 2 === 0 ? 0 : xStep / 2;
          const x = col * xStep + stagger - (isRight ? xStep * .18 : xStep * .08);
          const y = row * yStep;
          cell.style.left = `${x}px`;
          cell.style.top = `${y}px`;
          cell.innerHTML = `<div class="sbre-hex-face"></div>`;
          grid.appendChild(cell);
        }
      }
    };

    const sizeSides = () => {
      const hero = document.querySelector<HTMLElement>(".premium-site .hero");
      const rect = hero?.getBoundingClientRect();
      const vw = window.innerWidth;
      const leftGap = rect ? Math.max(0, rect.left) : Math.max(0, (vw - 1180) / 2);
      const rightGap = rect ? Math.max(0, vw - rect.right) : leftGap;

      if (leftSide && leftGrid) {
        leftSide.style.width = `${leftGap}px`;
        leftSide.style.display = leftGap >= 72 ? "block" : "none";
        if (leftGap >= 72) buildGrid(leftGrid, leftGap, false);
      }
      if (rightSide && rightGrid) {
        rightSide.style.width = `${rightGap}px`;
        rightSide.style.display = rightGap >= 72 ? "block" : "none";
        if (rightGap >= 72) buildGrid(rightGrid, rightGap, true);
      }
      cells = Array.from(root.querySelectorAll<HTMLElement>(".sbre-hex-cell"));
    };

    const renderInteraction = () => {
      raf = 0;
      const radius = 190;

      cells.forEach((cell) => {
        const face = cell.firstElementChild as HTMLElement | null;
        if (!face) return;
        const rect = cell.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const dist = Math.hypot(dx, dy);
        const influence = Math.max(0, 1 - dist / radius);
        const eased = influence * influence * (3 - 2 * influence);

        face.style.setProperty("--lift", `${eased * 30}px`);
        face.style.setProperty("--rx", `${(-dy / radius) * eased * 11}deg`);
        face.style.setProperty("--ry", `${(dx / radius) * eased * 11}deg`);
        face.style.setProperty("--glow", `${eased}`);
        face.style.setProperty("--alpha", `${0.28 + eased * 0.58}`);
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!raf) raf = requestAnimationFrame(renderInteraction);
    };

    const resetInteraction = () => {
      pointerX = -9999;
      pointerY = -9999;
      if (!raf) raf = requestAnimationFrame(renderInteraction);
    };

    syncTheme();
    if (themeHost) {
      themeObserver = new MutationObserver(syncTheme);
      themeObserver.observe(themeHost, { attributes: true, attributeFilter: ["class"] });
    }

    sizeSides();
    window.addEventListener("resize", sizeSides, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", resetInteraction);
    document.addEventListener("mouseleave", resetInteraction);

    return () => {
      themeObserver?.disconnect();
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", sizeSides);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", resetInteraction);
      document.removeEventListener("mouseleave", resetInteraction);
      root.remove();
    };
  }, [pathname]);

  return null;
}
