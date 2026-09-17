import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

type ArchitecturalLine = {
  x: number;
  y: number;
  length: number;
  angle: number;
  delay: number;
  duration: number;
  hold: number;
  opacity: number;
  width: number;
  accent: boolean;
};

export default function HeaderKineticTriangles() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    let cancelled = false;
    let raf = 0;
    let retryTimer: number | undefined;
    let resizeObserver: ResizeObserver | undefined;

    const mount = () => {
      if (cancelled) return;

      const header = document.querySelector<HTMLElement>(".premium-site .site-header");
      if (!header) {
        retryTimer = window.setTimeout(mount, 60);
        return;
      }

      header.querySelector(".sbre-kinetic-triangles")?.remove();
      header.querySelector(".sbre-point-cloud")?.remove();
      header.querySelector(".sbre-architectural-lines")?.remove();

      const layer = document.createElement("div");
      layer.className = "sbre-architectural-lines";
      layer.setAttribute("aria-hidden", "true");
      Object.assign(layer.style, {
        position: "absolute",
        inset: "0",
        zIndex: "1",
        pointerEvents: "none",
        overflow: "hidden",
      });

      const canvas = document.createElement("canvas");
      Object.assign(canvas.style, {
        width: "100%",
        height: "100%",
        display: "block",
      });
      layer.appendChild(canvas);
      header.prepend(layer);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const random = seededRandom(9512026);
      const anglePool = [0, 0, 0, 0, 30, -30, 45, -45, 60, -60, 90, 90];
      let width = 1;
      let height = 1;
      let dpr = 1;
      let lines: ArchitecturalLine[] = [];
      const startedAt = performance.now();
      const cycleDuration = 9.2;

      const rebuild = () => {
        const rect = header.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = width < 900 ? 28 : 58;
        lines = Array.from({ length: count }, (_, index) => {
          const angle = anglePool[Math.floor(random() * anglePool.length)];
          const accent = index % 6 === 0;
          return {
            x: random() * width,
            y: 7 + random() * Math.max(16, height - 14),
            length: width < 900 ? 44 + random() * 96 : 72 + random() * 190,
            angle,
            delay: (index / count) * cycleDuration + random() * 0.75,
            duration: 1.45 + random() * 1.8,
            hold: 1.0 + random() * 1.7,
            opacity: accent ? 0.3 + random() * 0.12 : 0.14 + random() * 0.15,
            width: accent ? 1.4 : 0.9 + random() * 0.5,
            accent,
          };
        });
      };

      const isDarkMode = () =>
        document.querySelector(".sbre-theme")?.classList.contains("theme-dark") ?? false;

      const drawLine = (line: ArchitecturalLine, progress: number, alpha: number) => {
        const angle = (line.angle * Math.PI) / 180;
        const fullX = Math.cos(angle) * line.length;
        const fullY = Math.sin(angle) * line.length;
        const endX = line.x + fullX * progress;
        const endY = line.y + fullY * progress;
        const dark = isDarkMode();
        const stroke = dark ? `rgba(255, 255, 255, ${alpha})` : `rgba(18, 92, 68, ${alpha})`;
        const tickStroke = dark
          ? `rgba(255, 255, 255, ${alpha * 0.78})`
          : `rgba(18, 92, 68, ${alpha * 0.72})`;

        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(endX, endY);
        ctx.lineWidth = line.width;
        ctx.lineCap = "square";
        ctx.strokeStyle = stroke;
        ctx.stroke();

        if (progress > 0.96 && line.accent) {
          const tickLength = 10;
          const perp = angle + Math.PI / 2;
          ctx.beginPath();
          ctx.moveTo(
            endX - Math.cos(perp) * tickLength * 0.5,
            endY - Math.sin(perp) * tickLength * 0.5,
          );
          ctx.lineTo(
            endX + Math.cos(perp) * tickLength * 0.5,
            endY + Math.sin(perp) * tickLength * 0.5,
          );
          ctx.lineWidth = 0.9;
          ctx.strokeStyle = tickStroke;
          ctx.stroke();
        }
      };

      const draw = (now: number) => {
        if (cancelled || !layer.isConnected) return;
        ctx.clearRect(0, 0, width, height);

        const elapsed = (now - startedAt) / 1000;

        lines.forEach((line) => {
          if (reducedMotion) {
            drawLine(line, 1, line.opacity * 0.55);
            return;
          }

          const local = ((elapsed - line.delay) % cycleDuration + cycleDuration) % cycleDuration;
          const fadeDuration = 1.25;
          const total = line.duration + line.hold + fadeDuration;
          if (local > total) return;

          let progress = 1;
          let alpha = line.opacity;

          if (local < line.duration) {
            const t = local / line.duration;
            progress = 1 - Math.pow(1 - t, 3);
            alpha = line.opacity * Math.min(1, t * 2.8);
          } else if (local > line.duration + line.hold) {
            const fade = (local - line.duration - line.hold) / fadeDuration;
            alpha = line.opacity * Math.max(0, 1 - fade);
          }

          drawLine(line, progress, alpha);
        });

        if (!reducedMotion) raf = requestAnimationFrame(draw);
      };

      rebuild();
      resizeObserver = new ResizeObserver(() => {
        rebuild();
        if (reducedMotion) draw(performance.now());
      });
      resizeObserver.observe(header);

      draw(performance.now());
    };

    mount();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (retryTimer) window.clearTimeout(retryTimer);
      resizeObserver?.disconnect();
      document.querySelector(".premium-site .site-header .sbre-architectural-lines")?.remove();
      document.querySelector(".premium-site .site-header .sbre-point-cloud")?.remove();
    };
  }, [pathname]);

  return null;
}
