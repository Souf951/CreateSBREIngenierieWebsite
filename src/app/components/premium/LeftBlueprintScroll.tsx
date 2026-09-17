import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Point = [number, number];
type Stroke = {
  points: Point[];
  width?: number;
  delay?: number;
  color?: "main" | "soft";
};

const blueprint: Stroke[] = [
  // Long exterior / circulation lines inspired by the supplied floor plan.
  { points: [[18, 10], [84, 10], [84, 24], [112, 24], [112, 74], [92, 74], [92, 96]], width: 1.4 },
  { points: [[18, 10], [18, 46], [34, 46], [34, 72], [62, 72], [62, 98]], width: 1.4, delay: 0.03 },
  { points: [[112, 24], [146, 24], [146, 52], [132, 52], [132, 96]], width: 1.25, delay: 0.08 },

  // Rooms / partitions.
  { points: [[18, 28], [54, 28], [54, 46]], delay: 0.10 },
  { points: [[54, 10], [54, 28]], delay: 0.12 },
  { points: [[62, 24], [62, 54], [84, 54]], delay: 0.14 },
  { points: [[84, 24], [84, 54]], delay: 0.16 },
  { points: [[92, 42], [112, 42]], delay: 0.18 },
  { points: [[112, 42], [112, 74]], delay: 0.20 },
  { points: [[34, 72], [34, 96]], delay: 0.23 },
  { points: [[62, 72], [92, 72]], delay: 0.26 },
  { points: [[92, 72], [92, 96]], delay: 0.29 },
  { points: [[112, 74], [132, 74]], delay: 0.31 },

  // Stair core.
  { points: [[96, 50], [108, 50], [108, 66], [96, 66], [96, 50]], color: "soft", delay: 0.34 },
  { points: [[98, 52], [106, 52]], color: "soft", delay: 0.35 },
  { points: [[98, 55], [106, 55]], color: "soft", delay: 0.36 },
  { points: [[98, 58], [106, 58]], color: "soft", delay: 0.37 },
  { points: [[98, 61], [106, 61]], color: "soft", delay: 0.38 },
  { points: [[98, 64], [106, 64]], color: "soft", delay: 0.39 },

  // Small wet-room / technical blocks.
  { points: [[36, 14], [48, 14], [48, 24], [36, 24], [36, 14]], color: "soft", delay: 0.42 },
  { points: [[66, 42], [78, 42], [78, 52], [66, 52], [66, 42]], color: "soft", delay: 0.45 },
  { points: [[116, 28], [128, 28], [128, 40], [116, 40], [116, 28]], color: "soft", delay: 0.47 },
  { points: [[42, 78], [54, 78], [54, 90], [42, 90], [42, 78]], color: "soft", delay: 0.50 },
  { points: [[98, 78], [110, 78], [110, 90], [98, 90], [98, 78]], color: "soft", delay: 0.52 },

  // Door swings / short architectural marks represented as segmented lines.
  { points: [[54, 36], [60, 30], [66, 36]], color: "soft", delay: 0.56 },
  { points: [[78, 54], [84, 48], [90, 54]], color: "soft", delay: 0.58 },
  { points: [[92, 64], [98, 58], [104, 64]], color: "soft", delay: 0.60 },
  { points: [[62, 82], [68, 76], [74, 82]], color: "soft", delay: 0.63 },
  { points: [[110, 82], [116, 76], [122, 82]], color: "soft", delay: 0.65 },

  // Dimension / datum-like strokes.
  { points: [[14, 102], [136, 102]], color: "soft", delay: 0.68 },
  { points: [[22, 99], [22, 105]], color: "soft", delay: 0.70 },
  { points: [[52, 99], [52, 105]], color: "soft", delay: 0.72 },
  { points: [[82, 99], [82, 105]], color: "soft", delay: 0.74 },
  { points: [[112, 99], [112, 105]], color: "soft", delay: 0.76 },
  { points: [[136, 99], [136, 105]], color: "soft", delay: 0.78 },
];

function strokeLength(points: Point[]) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return total;
}

function drawPartial(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  progress: number,
  scale: number,
  offsetX: number,
  offsetY: number,
  mainColor: string,
  softColor: string,
) {
  if (progress <= 0) return;
  const points = stroke.points;
  const total = strokeLength(points);
  const target = total * Math.min(1, progress);
  let travelled = 0;

  ctx.beginPath();
  ctx.moveTo(offsetX + points[0][0] * scale, offsetY + points[0][1] * scale);

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const segment = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (travelled + segment <= target) {
      ctx.lineTo(offsetX + b[0] * scale, offsetY + b[1] * scale);
      travelled += segment;
      continue;
    }

    const remaining = Math.max(0, target - travelled);
    const t = segment ? remaining / segment : 0;
    ctx.lineTo(
      offsetX + (a[0] + (b[0] - a[0]) * t) * scale,
      offsetY + (a[1] + (b[1] - a[1]) * t) * scale,
    );
    break;
  }

  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.lineWidth = (stroke.width ?? 0.9) * Math.max(0.8, scale * 0.9);
  ctx.strokeStyle = stroke.color === "soft" ? softColor : mainColor;
  ctx.stroke();
}

export default function LeftBlueprintScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    const canvas = document.createElement("canvas");
    canvas.className = "sbre-left-blueprint";
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      left: "0",
      top: "0",
      height: "100%",
      pointerEvents: "none",
      zIndex: "2",
      opacity: "1",
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => canvas.remove();

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let gutter = 0;
    let targetProgress = 0;
    let displayProgress = 0;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      const site = document.querySelector<HTMLElement>(".premium-site");
      const siteRect = site?.getBoundingClientRect();
      gutter = siteRect ? Math.max(0, siteRect.left) : 0;

      width = Math.max(0, gutter);
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.style.width = `${width}px`;
      canvas.style.display = width >= 110 ? "block" : "none";
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetProgress = Math.min(1, Math.max(0, window.scrollY / max));
    };

    const render = () => {
      if (canvas.style.display === "none") {
        raf = requestAnimationFrame(render);
        return;
      }

      displayProgress += (targetProgress - displayProgress) * 0.055;
      if (reduced) displayProgress = targetProgress;

      ctx.clearRect(0, 0, width, height);

      const dark = document.querySelector(".sbre-theme")?.classList.contains("theme-dark") ?? false;
      const mainColor = dark ? "rgba(255,255,255,.56)" : "rgba(10,92,61,.42)";
      const softColor = dark ? "rgba(255,255,255,.25)" : "rgba(10,92,61,.20)";

      // Use the available side strip, rotated into a vertical blueprint ribbon.
      const usableWidth = Math.max(80, width - 22);
      const scale = Math.min(1.05, usableWidth / 164);
      const planHeight = 112 * scale;
      const blockGap = Math.max(72, height * 0.10);
      const blockHeight = Math.max(planHeight + blockGap, height * 0.42);
      const scrollTravel = displayProgress * (blockHeight * 2.25);

      // Three successive blueprint fragments create the feeling of the plan
      // continuing to be drawn as the visitor scrolls down the site.
      for (let block = -1; block < 4; block += 1) {
        const y = block * blockHeight - (scrollTravel % blockHeight) + 52;
        if (y > height + planHeight || y + planHeight < -60) continue;

        const blockPhase = ((displayProgress * 3.0 + block * 0.19) % 1 + 1) % 1;
        const wave = Math.min(1, Math.max(0, blockPhase * 1.38));
        const offsetX = Math.max(8, (width - 154 * scale) / 2);

        blueprint.forEach((stroke, index) => {
          const delay = stroke.delay ?? index / blueprint.length;
          const local = (wave - delay) / 0.30;
          const progress = Math.min(1, Math.max(0, local));
          drawPartial(ctx, stroke, progress, scale, offsetX, y, mainColor, softColor);
        });

        // Three drawing heads, matching the idea of several lines tracing the plan.
        const heads = [0.23, 0.49, 0.76];
        heads.forEach((head, i) => {
          const p = Math.min(1, Math.max(0, (wave - head + 0.13) / 0.18));
          if (p <= 0 || p >= 1) return;
          const hx = offsetX + (24 + i * 47 + p * 18) * scale;
          const hy = y + (22 + i * 28 + p * 18) * scale;
          ctx.beginPath();
          ctx.arc(hx, hy, dark ? 1.7 : 1.5, 0, Math.PI * 2);
          ctx.fillStyle = dark ? "rgba(255,255,255,.78)" : "rgba(10,92,61,.62)";
          ctx.fill();
        });
      }

      raf = requestAnimationFrame(render);
    };

    measure();
    onScroll();
    const resizeObserver = new ResizeObserver(measure);
    const site = document.querySelector<HTMLElement>(".premium-site");
    if (site) resizeObserver.observe(site);
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", onScroll);
      canvas.remove();
    };
  }, [pathname]);

  return null;
}
