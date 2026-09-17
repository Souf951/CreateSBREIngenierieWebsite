import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type HexCell = {
  cell: HTMLElement;
  face: HTMLElement;
};

const HEX_FACE = `
  <div class="sbre-hex-face">
    <svg class="sbre-hex-svg" viewBox="0 0 100 86.602" aria-hidden="true">
      <polygon class="sbre-hex-depth" points="25,1 75,1 99,43.301 75,85.602 25,85.602 1,43.301" />
      <polygon class="sbre-hex-outline" points="25,1.4 75,1.4 98.4,43.301 75,85.202 25,85.202 1.6,43.301" />
      <polygon class="sbre-hex-inner" points="28,6.2 72,6.2 92.6,43.301 72,80.402 28,80.402 7.4,43.301" />
    </svg>
  </div>
`;

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
        .sbre-hex-side{position:absolute;top:0;height:100vh;overflow:hidden;perspective:1200px;transition:width .22s ease}
        .sbre-hex-side.left{left:0}
        .sbre-hex-side.right{right:0}
        .sbre-hex-grid{position:absolute;inset:-7vh -22px;transform-style:preserve-3d}
        .sbre-hex-cell{position:absolute;width:var(--hex-size);height:calc(var(--hex-size) * .8660254);transform-style:preserve-3d}
        .sbre-hex-face{position:absolute;inset:0;transform-style:preserve-3d;transform:translate3d(0,var(--liftY,0px),var(--liftZ,0px)) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) scale(var(--scale,1));filter:drop-shadow(0 0 calc(var(--glow,0) * 18px) rgba(0,190,112,calc(var(--glow,0) * .58)));transition:transform .18s cubic-bezier(.2,.7,.2,1),filter .18s ease}
        .sbre-hex-svg{display:block;width:100%;height:100%;overflow:visible}
        .sbre-hex-depth{fill:rgba(5,61,42,calc(var(--depth,0) * .22));transform:translateY(calc(var(--depth,0) * 4px));transition:fill .18s ease,transform .18s ease}
        .sbre-hex-outline{fill:rgba(9,91,61,.028);stroke:rgba(7,108,70,calc(.18 + var(--glow,0) * .52));stroke-width:1.15;vector-effect:non-scaling-stroke;transition:fill .18s ease,stroke .18s ease}
        .sbre-hex-inner{fill:rgba(16,123,82,calc(.012 + var(--glow,0) * .07));stroke:rgba(62,196,137,calc(.045 + var(--glow,0) * .20));stroke-width:.65;vector-effect:non-scaling-stroke;transition:fill .18s ease,stroke .18s ease}
        .sbre-hex-margins.is-dark .sbre-hex-depth{fill:rgba(0,0,0,calc(var(--depth,0) * .28))}
        .sbre-hex-margins.is-dark .sbre-hex-outline{fill:rgba(255,255,255,.012);stroke:rgba(97,255,184,calc(.16 + var(--glow,0) * .58))}
        .sbre-hex-margins.is-dark .sbre-hex-inner{fill:rgba(44,209,135,calc(.01 + var(--glow,0) * .075));stroke:rgba(134,255,204,calc(.05 + var(--glow,0) * .22))}
        @media(max-width:900px){.sbre-hex-margins{display:none!important}}
        @media(prefers-reduced-motion:reduce){.sbre-hex-face,.sbre-hex-depth,.sbre-hex-outline,.sbre-hex-inner{transition:none!important}}
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
    let resizeTimer = 0;
    let leftWidth = 0;
    let rightWidth = 0;

    const syncTheme = () => {
      root.classList.toggle("is-dark", themeHost?.classList.contains("theme-dark") ?? false);
    };

    const buildGrid = (grid: HTMLElement, sideWidth: number, isRight: boolean) => {
      grid.innerHTML = "";

      const viewportScale = Math.min(1.18, Math.max(.9, window.innerWidth / 1920));
      const size = Math.round(62 * viewportScale);
      const hexH = size * 0.8660254;
      const xStep = size * 0.75;
      const yStep = hexH;
      const cols = Math.max(3, Math.ceil(sideWidth / xStep) + 3);
      const rows = Math.ceil(window.innerHeight / yStep) + 4;
      const next: HexCell[] = [];

      grid.style.setProperty("--hex-size", `${size}px`);

      for (let row = -2; row < rows; row += 1) {
        for (let col = -2; col < cols; col += 1) {
          const cell = document.createElement("div");
          cell.className = "sbre-hex-cell";

          const stagger = row % 2 === 0 ? 0 : xStep / 2;
          const x = col * xStep + stagger - (isRight ? xStep * .34 : xStep * .18);
          const y = row * yStep;

          cell.style.left = `${x}px`;
          cell.style.top = `${y}px`;
          cell.innerHTML = HEX_FACE;
          grid.appendChild(cell);

          const face = cell.querySelector<HTMLElement>(".sbre-hex-face");
          if (face) next.push({ cell, face });
        }
      }

      return next;
    };

    const clearInteraction = () => {
      for (const item of allCells) {
        item.face.style.setProperty("--liftZ", "0px");
        item.face.style.setProperty("--liftY", "0px");
        item.face.style.setProperty("--rx", "0deg");
        item.face.style.setProperty("--ry", "0deg");
        item.face.style.setProperty("--scale", "1");
        item.face.style.setProperty("--glow", "0");
        item.face.style.setProperty("--depth", "0");
      }
    };

    const sizeSides = () => {
      const hero = document.querySelector<HTMLElement>(".premium-site .hero");
      const rect = hero?.getBoundingClientRect();
      const vw = window.innerWidth;
      leftWidth = rect ? Math.max(0, rect.left) : Math.max(0, (vw - 1180) / 2);
      rightWidth = rect ? Math.max(0, vw - rect.right) : leftWidth;
      const next: HexCell[] = [];

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

      allCells = next;
      clearInteraction();
    };

    const applyInteraction = (pointerX: number, pointerY: number) => {
      const viewportWidth = window.innerWidth;
      const overLeft = leftWidth >= 72 && pointerX <= leftWidth;
      const overRight = rightWidth >= 72 && pointerX >= viewportWidth - rightWidth;
      const active = overLeft || overRight;
      const radius = Math.max(150, Math.min(230, window.innerWidth * .11));

      if (!active) {
        clearInteraction();
        return;
      }

      for (const item of allCells) {
        const rect = item.cell.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointerX - cx;
        const dy = pointerY - cy;
        const dist = Math.hypot(dx, dy);
        const base = Math.max(0, 1 - dist / radius);
        const influence = base * base * (3 - 2 * base);
        const liftZ = influence * 38;
        const liftY = -influence * 7;
        const rx = (-dy / radius) * influence * 7;
        const ry = (dx / radius) * influence * 9;
        const scale = 1 + influence * .055;

        item.face.style.setProperty("--liftZ", `${liftZ.toFixed(2)}px`);
        item.face.style.setProperty("--liftY", `${liftY.toFixed(2)}px`);
        item.face.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        item.face.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
        item.face.style.setProperty("--scale", scale.toFixed(3));
        item.face.style.setProperty("--glow", influence.toFixed(3));
        item.face.style.setProperty("--depth", influence.toFixed(3));
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      applyInteraction(event.clientX, event.clientY);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(sizeSides, 90);
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
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", clearInteraction);
      document.removeEventListener("mouseleave", clearInteraction);
      root.remove();
    };
  }, [pathname]);

  return null;
}
