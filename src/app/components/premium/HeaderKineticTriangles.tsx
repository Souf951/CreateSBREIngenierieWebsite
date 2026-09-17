import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const COLS = 40;
const ROWS = 5;

function seededShuffle(length: number, seed: number) {
  const values = Array.from({ length }, (_, index) => index);
  let state = seed >>> 0;
  const random = () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };

  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

export default function HeaderKineticTriangles() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cycleTimer: number | undefined;
    const timers: number[] = [];

    const mount = () => {
      if (cancelled) return;
      const header = document.querySelector<HTMLElement>(".premium-site .site-header");
      if (!header) {
        timers.push(window.setTimeout(mount, 60));
        return;
      }

      header.querySelector(".sbre-kinetic-triangles")?.remove();

      const layer = document.createElement("div");
      layer.className = "sbre-kinetic-triangles";
      layer.setAttribute("aria-hidden", "true");

      const total = COLS * ROWS;
      const triangles: HTMLSpanElement[] = [];

      for (let row = 0; row < ROWS; row += 1) {
        for (let col = 0; col < COLS; col += 1) {
          const index = row * COLS + col;
          const triangle = document.createElement("span");
          triangle.className = "sbre-kinetic-triangle";
          triangle.style.setProperty("--x", `${(col / COLS) * 100}%`);
          triangle.style.setProperty("--y", `${(row / ROWS) * 100}%`);
          triangle.style.setProperty("--flip", `${(row + col) % 2}`);
          triangle.style.setProperty("--tone", `${index % 4}`);
          triangle.style.setProperty("--row", `${row}`);
          layer.appendChild(triangle);
          triangles.push(triangle);
        }
      }

      header.prepend(layer);

      let cycle = 0;
      const runCycle = () => {
        if (cancelled || !layer.isConnected) return;
        cycle += 1;

        triangles.forEach((triangle) => triangle.classList.remove("is-green"));

        const onOrder = seededShuffle(total, 1709 + cycle * 97);
        const offOrder = seededShuffle(total, 8611 + cycle * 131);
        const onStep = 19;
        const offStep = 15;
        const startDelay = 520;

        onOrder.forEach((triangleIndex, orderIndex) => {
          timers.push(
            window.setTimeout(() => {
              triangles[triangleIndex]?.classList.add("is-green");
            }, startDelay + orderIndex * onStep),
          );
        });

        const allGreenAt = startDelay + total * onStep;
        const holdGreen = 1050;

        offOrder.forEach((triangleIndex, orderIndex) => {
          timers.push(
            window.setTimeout(() => {
              triangles[triangleIndex]?.classList.remove("is-green");
            }, allGreenAt + holdGreen + orderIndex * offStep),
          );
        });

        const cycleDuration = allGreenAt + holdGreen + total * offStep + 1500;
        cycleTimer = window.setTimeout(runCycle, cycleDuration);
      };

      runCycle();
    };

    mount();

    return () => {
      cancelled = true;
      if (cycleTimer) window.clearTimeout(cycleTimer);
      timers.forEach((timer) => window.clearTimeout(timer));
      document.querySelector(".premium-site .site-header .sbre-kinetic-triangles")?.remove();
    };
  }, [pathname]);

  return null;
}
