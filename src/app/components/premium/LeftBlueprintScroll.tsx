import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Tile = {
  el: HTMLElement;
  cx: number;
  cy: number;
};

export default function LeftBlueprintScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    const root = document.createElement("div");
    root.className = "sbre-square-margins";
    root.setAttribute("aria-hidden", "true");
    root.innerHTML = `
      <style>
        .sbre-square-margins{position:fixed;inset:0;z-index:1;pointer-events:none;overflow:hidden}
        .sbre-square-side{position:absolute;top:0;height:100vh;overflow:hidden;perspective:1000px}
        .sbre-square-side.left{left:0}
        .sbre-square-side.right{right:0}
        .sbre-square-grid{position:absolute;inset:-18px;transform-style:preserve-3d}
        .sbre-square-tile{position:absolute;width:var(--tile-size);height:var(--tile-size);border:1px solid rgba(7,108,70,.16);background:linear-gradient(145deg,rgba(8,84,58,.035),rgba(8,84,58,.01));box-shadow:inset 0 0 16px rgba(10,104,71,.02);transform:translate3d(0,var(--liftY,0px),var(--liftZ,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--scale,1));opacity:var(--alpha,.32);filter:drop-shadow(0 0 calc(var(--glow,0) * 16px) rgba(0,180,108,calc(var(--glow,0) * .46)));transition:transform .16s cubic-bezier(.2,.7,.2,1),filter .16s ease,opacity .16s ease,border-color .16s ease,background .2s ease;will-change:transform}
        .sbre-square-tile::after{content:"";position:absolute;inset:7px;border:1px solid rgba(74,210,150,.05);background:radial-gradient(circle at 50% 45%,rgba(31,184,118,calc(var(--glow,0) * .08)),transparent 70%)}
        .sbre-square-margins.is-dark .sbre-square-tile{border-color:rgba(102,255,186,.16);background:linear-gradient(145deg,rgba(255,255,255,.014),rgba(15,54,41,.03));box-shadow:inset 0 0 16px rgba(70,255,184,.018)}
        .sbre-square-margins.is-dark .sbre-square-tile::after{border-color:rgba(132,255,203,.07)}
        @media(max-width:900px){.sbre-square-margins{display:none!important}}
        @media(prefers-reduced-motion:reduce){.sbre-square-tile{transition:none!important}}
      </style>
      <div class="sbre-square-side left"><div class="sbre-square-grid"></div></div>
      <div class="sbre-square-side right"><div class="sbre-square-grid"></div></div>
    `;

    document.body.appendChild(root);

    const leftSide = root.querySelector<HTMLElement>(".sbre-square-side.left");
    const rightSide = root.querySelector<HTMLElement>(".sbre-square-side.right");
    const leftGrid = leftSide?.querySelector<HTMLElement>(".sbre-square-grid") ?? null;
    const rightGrid = rightSide?.querySelector<HTMLElement>(".sbre-square-grid") ?? null;
    const themeHost = document.querySelector<HTMLElement>(".sbre-theme");

    let themeObserver: MutationObserver | null = null;
    let tiles: Tile[] = [];
    let activeTiles = new Set<HTMLElement>();
    let leftWidth = 0;
    let rightWidth = 0;
    let resizeTimer = 0;
    let raf = 0;
    let pointerX = -9999;
    let pointerY = -9999;

    const syncTheme = () => {
      root.classList.toggle("is-dark", themeHost?.classList.contains("theme-dark") ?? false);
    };

    const resetTile = (el: HTMLElement) => {
      el.style.setProperty("--liftZ", "0px");
      el.style.setProperty("--liftY", "0px");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
      el.style.setProperty("--scale", "1");
      el.style.setProperty("--glow", "0");
      el.style.setProperty("--alpha", ".32");
      el.style.borderColor = "";
    };

    const clearInteraction = () => {
      for (const el of activeTiles) resetTile(el);
      activeTiles.clear();
    };

    const buildGrid = (grid: HTMLElement, sideWidth: number, isRight: boolean) => {
      grid.innerHTML = "";

      const size = Math.round(Math.max(66, Math.min(86, window.innerWidth * .038)));
      const gap = 8;
      const step = size + gap;
      const cols = Math.max(2, Math.ceil(sideWidth / step) + 2);
      const rows = Math.ceil(window.innerHeight / step) + 2;
      const next: Tile[] = [];

      grid.style.setProperty("--tile-size", `${size}px`);

      for (let row = -1; row < rows; row += 1) {
        for (let col = -1; col < cols; col += 1) {
          const tile = document.createElement("div");
          tile.className = "sbre-square-tile";

          const x = col * step;
          const y = row * step;
          tile.style.left = `${x}px`;
          tile.style.top = `${y}px`;
          grid.appendChild(tile);

          const absoluteX = isRight
            ? window.innerWidth - sideWidth + x + size / 2 - 18
            : x + size / 2 - 18;
          const absoluteY = y + size / 2 - 18;

          next.push({ el: tile, cx: absoluteX, cy: absoluteY });
        }
      }

      return next;
    };

    const sizeSides = () => {
      const hero = document.querySelector<HTMLElement>(".premium-site .hero");
      const rect = hero?.getBoundingClientRect();
      const vw = window.innerWidth;
      leftWidth = rect ? Math.max(0, rect.left) : Math.max(0, (vw - 1180) / 2);
      rightWidth = rect ? Math.max(0, vw - rect.right) : leftWidth;
      const next: Tile[] = [];

      if (leftSide && leftGrid) {
        leftSide.style.width = `${leftWidth}px`;
        leftSide.style.display = leftWidth >= 72 ? "block" : "none";
        if (leftWidth >= 72) next.push(...buildGrid(leftGrid, leftWidth, false));
      }

      if (rightSide && rightGrid) {
        rightSide.style.width = `${rightWidth}px`;
        rightSide.style.display = rightWidth >= 72 ? "block" : "none";
        if (rightWidth >= 72) next.push(...buildGrid(rightGrid, rightWidth, true));
      }

      clearInteraction();
      tiles = next;
    };

    const renderInteraction = () => {
      raf = 0;
      const vw = window.innerWidth;
      const overLeft = leftWidth >= 72 && pointerX <= leftWidth;
      const overRight = rightWidth >= 72 && pointerX >= vw - rightWidth;

      if (!overLeft && !overRight) {
        clearInteraction();
        return;
      }

      const radius = Math.max(150, Math.min(220, vw * .10));
      const radiusSq = radius * radius;
      const nextActive = new Set<HTMLElement>();

      for (const tile of tiles) {
        const dx = pointerX - tile.cx;
        const dy = pointerY - tile.cy;
        const distSq = dx * dx + dy * dy;
        if (distSq > radiusSq) continue;

        const dist = Math.sqrt(distSq);
        const base = Math.max(0, 1 - dist / radius);
        const influence = base * base * (3 - 2 * base);
        const liftZ = influence * 32;
        const liftY = -influence * 5;
        const rx = (-dy / radius) * influence * 6;
        const ry = (dx / radius) * influence * 7;
        const scale = 1 + influence * .04;

        tile.el.style.setProperty("--liftZ", `${liftZ.toFixed(2)}px`);
        tile.el.style.setProperty("--liftY", `${liftY.toFixed(2)}px`);
        tile.el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        tile.el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        tile.el.style.setProperty("--scale", scale.toFixed(3));
        tile.el.style.setProperty("--glow", influence.toFixed(3));
        tile.el.style.setProperty("--alpha", (0.30 + influence * .58).toFixed(3));
        tile.el.style.borderColor = `rgba(31,184,118,${0.14 + influence * .46})`;
        nextActive.add(tile.el);
      }

      for (const el of activeTiles) {
        if (!nextActive.has(el)) resetTile(el);
      }
      activeTiles = nextActive;
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!raf) raf = requestAnimationFrame(renderInteraction);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(sizeSides, 120);
    };

    syncTheme();
    if (themeHost) {
      themeObserver = new MutationObserver(syncTheme);
      themeObserver.observe(themeHost, { attributes: true, attributeFilter: ["class"] });
    }

    sizeSides();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", clearInteraction);
    document.addEventListener("mouseleave", clearInteraction);

    return () => {
      themeObserver?.disconnect();
      window.clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", clearInteraction);
      document.removeEventListener("mouseleave", clearInteraction);
      root.remove();
    };
  }, [pathname]);

  return null;
}
