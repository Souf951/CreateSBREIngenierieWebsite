import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type HexCell = {
  cell: HTMLElement;
  face: HTMLElement;
  phase: number;
};

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
        .sbre-hex-side{position:absolute;top:0;height:100vh;overflow:hidden;perspective:1100px;transition:width .25s ease,opacity .25s ease}
        .sbre-hex-side.left{left:0}
        .sbre-hex-side.right{right:0}
        .sbre-hex-grid{position:absolute;inset:-7vh -18px;transform-style:preserve-3d}
        .sbre-hex-cell{position:absolute;width:var(--hex-size);height:calc(var(--hex-size) * .866);transform-style:preserve-3d;will-change:transform}
        .sbre-hex-face{position:absolute;inset:0;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);background:linear-gradient(145deg,rgba(8,84,58,.05),rgba(8,84,58,.012));border:1px solid rgba(6,93,61,.18);box-shadow:inset 0 0 20px rgba(6,93,61,.028);transform:translate3d(0,var(--liftY,0px),var(--liftZ,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--scale,1));opacity:var(--alpha,.30);filter:drop-shadow(0 0 calc(var(--glow,0) * 18px) rgba(0,170,103,calc(var(--glow,0) * .45)));transition:transform .14s ease-out,opacity .16s ease-out,border-color .18s ease-out,background .25s ease,filter .18s ease-out}
        .sbre-hex-face::before{content:"";position:absolute;inset:3px;clip-path:inherit;border:1px solid rgba(79,220,159,.055);background:linear-gradient(180deg,rgba(255,255,255,.025),rgba(0,0,0,0))}
        .sbre-hex-face::after{content:"";position:absolute;left:12%;right:12%;bottom:-6px;height:8px;clip-path:polygon(9% 0,91% 0,100% 100%,0 100%);background:linear-gradient(180deg,rgba(1,62,40,calc(var(--depth,0) * .20)),rgba(1,62,40,0));filter:blur(1.5px);opacity:var(--depth,0)}
        .sbre-hex-margins.is-dark .sbre-hex-face{background:linear-gradient(145deg,rgba(255,255,255,.018),rgba(14,50,39,.035));border-color:rgba(107,255,187,.17);box-shadow:inset 0 0 20px rgba(65,255,181,.02)}
        .sbre-hex-margins.is-dark .sbre-hex-face::before{border-color:rgba(129,255,199,.075)}
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
    let allCells: HexCell[] = [];
    let raf = 0;
    let pointerX = -9999;
    let pointerY = -9999;
    let lastPointerTime = performance.now();
    let resizeTimer = 0;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const syncTheme = () => {
      const dark = themeHost?.classList.contains("theme-dark") ?? false;
      root.classList.toggle("is-dark", dark);
    };

    const buildGrid = (grid: HTMLElement, sideWidth: number, isRight: boolean) => {
      grid.innerHTML = "";

      const viewportFactor = Math.min(1.16, Math.max(.88, window.innerWidth / 1920));
      const size = Math.max(46, Math.min(72, 58 * viewportFactor));
      const cellH = size * .866;
      const xStep = size * .76;
      const yStep = cellH * .86;
      const cols = Math.max(3, Math.ceil(sideWidth / xStep) + 2);
      const rows = Math.ceil(window.innerHeight / yStep) + 4;
      const nextCells: HexCell[] = [];

      grid.style.setProperty("--hex-size", `${size}px`);

      for (let row = -2; row < rows; row += 1) {
        for (let col = -2; col < cols; col += 1) {
          const cell = document.createElement("div");
          cell.className = "sbre-hex-cell";

          const stagger = row % 2 === 0 ? 0 : xStep / 2;
          const x = col * xStep + stagger - (isRight ? xStep * .30 : xStep * .12);
          const y = row * yStep;
          const phase = ((row * 13 + col * 7) % 19) / 19;

          cell.style.left = `${x}px`;
          cell.style.top = `${y}px`;
          cell.innerHTML = `<div class="sbre-hex-face"></div>`;
          grid.appendChild(cell);

          const face = cell.firstElementChild as HTMLElement | null;
          if (face) nextCells.push({ cell, face, phase });
        }
      }

      return nextCells;
    };

    const sizeSides = () => {
      const hero = document.querySelector<HTMLElement>(".premium-site .hero");
      const rect = hero?.getBoundingClientRect();
      const vw = window.innerWidth;
      const leftGap = rect ? Math.max(0, rect.left) : Math.max(0, (vw - 1180) / 2);
      const rightGap = rect ? Math.max(0, vw - rect.right) : leftGap;
      const next: HexCell[] = [];

      if (leftSide && leftGrid) {
        leftSide.style.width = `${leftGap}px`;
        leftSide.style.display = leftGap >= 72 ? "block" : "none";
        if (leftGap >= 72) next.push(...buildGrid(leftGrid, leftGap, false));
      }

      if (rightSide && rightGrid) {
        rightSide.style.width = `${rightGap}px`;
        rightSide.style.display = rightGap >= 72 ? "block" : "none";
        if (rightGap >= 72) next.push(...buildGrid(rightGrid, rightGap, true));
      }

      allCells = next;
    };

    const renderInteraction = (now: number) => {
      raf = 0;
      const active = now - lastPointerTime < 1200;
      const radius = Math.max(150, Math.min(230, window.innerWidth * .11));

      for (const item of allCells) {
        const rect = item.cell.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const dist = Math.hypot(dx, dy);
        const base = active ? Math.max(0, 1 - dist / radius) : 0;
        const eased = base * base * (3 - 2 * base);

        let wave = 0;
        if (!reducedMotion && active && dist < radius * 1.35) {
          const ripple = Math.sin((radius - dist) * .052 - now * .0042 + item.phase * 2.8);
          wave = Math.max(0, ripple) * Math.max(0, 1 - dist / (radius * 1.35)) * .36;
        }

        const influence = Math.min(1, eased + wave);
        const liftZ = influence * 34;
        const liftY = -influence * 6;
        const rx = (-dy / radius) * influence * 8;
        const ry = (dx / radius) * influence * 10;
        const scale = 1 + influence * .045;

        item.face.style.setProperty("--liftZ", `${liftZ.toFixed(2)}px`);
        item.face.style.setProperty("--liftY", `${liftY.toFixed(2)}px`);
        item.face.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        item.face.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        item.face.style.setProperty("--scale", scale.toFixed(3));
        item.face.style.setProperty("--glow", influence.toFixed(3));
        item.face.style.setProperty("--depth", influence.toFixed(3));
        item.face.style.setProperty("--alpha", (0.24 + influence * 0.62).toFixed(3));
        item.face.style.borderColor = `rgba(31, 184, 118, ${0.14 + influence * 0.48})`;
      }

      if (active && !reducedMotion) raf = requestAnimationFrame(renderInteraction);
    };

    const scheduleRender = () => {
      if (!raf) raf = requestAnimationFrame(renderInteraction);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      lastPointerTime = performance.now();
      scheduleRender();
    };

    const resetInteraction = () => {
      pointerX = -9999;
      pointerY = -9999;
      lastPointerTime = 0;
      scheduleRender();
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        sizeSides();
        scheduleRender();
      }, 90);
    };

    syncTheme();
    if (themeHost) {
      themeObserver = new MutationObserver(syncTheme);
      themeObserver.observe(themeHost, { attributes: true, attributeFilter: ["class"] });
    }

    sizeSides();
    scheduleRender();

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", resetInteraction);
    document.addEventListener("mouseleave", resetInteraction);

    return () => {
      themeObserver?.disconnect();
      window.clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", resetInteraction);
      document.removeEventListener("mouseleave", resetInteraction);
      root.remove();
    };
  }, [pathname]);

  return null;
}
