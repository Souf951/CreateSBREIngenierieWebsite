import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const POINTS = 170;

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

export default function HeaderKineticTriangles() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let raf = 0;
    let retryTimer: number | undefined;

    const mount = () => {
      if (cancelled) return;

      const header = document.querySelector<HTMLElement>(".premium-site .site-header");
      if (!header) {
        retryTimer = window.setTimeout(mount, 60);
        return;
      }

      header.querySelector(".sbre-kinetic-triangles")?.remove();
      header.querySelector(".sbre-point-cloud")?.remove();

      const layer = document.createElement("div");
      layer.className = "sbre-point-cloud";
      layer.setAttribute("aria-hidden", "true");

      const random = seededRandom(9512026);
      const points: Array<{
        el: HTMLSpanElement;
        x: number;
        y: number;
        base: number;
        phase: number;
      }> = [];

      for (let index = 0; index < POINTS; index += 1) {
        const point = document.createElement("span");
        point.className = "sbre-point";

        const x = random() * 100;
        const y = 7 + random() * 86;
        const size = 1.4 + random() * 3.7;
        const base = 0.12 + random() * 0.22;
        const phase = random() * Math.PI * 2;

        point.style.left = `${x}%`;
        point.style.top = `${y}%`;
        point.style.width = `${size}px`;
        point.style.height = `${size}px`;
        point.style.opacity = `${base}`;
        point.style.setProperty("--base-opacity", `${base}`);

        layer.appendChild(point);
        points.push({ el: point, x, y, base, phase });
      }

      header.prepend(layer);

      const travel = 8600;
      const pause = 900;
      const total = travel + pause;
      const start = performance.now();

      const animate = (now: number) => {
        if (cancelled || !layer.isConnected) return;

        const elapsed = (now - start) % total;
        const moving = elapsed < travel;
        const progress = Math.min(1, elapsed / travel);
        const beamX = moving ? -14 + progress * 128 : 114;
        const time = now * 0.001;

        points.forEach(({ el, x, y, base, phase }) => {
          const verticalDrift = Math.sin(time * 0.65 + phase + y * 0.025) * 2.3;
          const dx = x - beamX;
          const distance = Math.abs(dx);
          const energy = moving ? Math.exp(-(distance * distance) / (2 * 10.5 * 10.5)) : 0;
          const sparkle = 0.88 + Math.sin(time * 2.1 + phase) * 0.12;
          const intensity = Math.max(0, Math.min(1, energy * sparkle));

          el.style.opacity = `${Math.min(0.96, base + intensity * 0.72)}`;
          el.style.transform = `translate3d(0, ${verticalDrift}px, 0) scale(${1 + intensity * 1.45})`;
          el.style.filter = `brightness(${1 + intensity * 0.34})`;
          el.style.boxShadow = intensity > 0.04
            ? `0 0 ${3 + intensity * 13}px rgba(19, 102, 75, ${0.12 + intensity * 0.56}), 0 0 ${1 + intensity * 4}px rgba(255,255,255,${intensity * 0.42})`
            : "none";
        });

        raf = requestAnimationFrame(animate);
      };

      raf = requestAnimationFrame(animate);
    };

    mount();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (retryTimer) window.clearTimeout(retryTimer);
      document.querySelector(".premium-site .site-header .sbre-point-cloud")?.remove();
    };
  }, [pathname]);

  return null;
}
