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
  { points: [[18, 10], [84, 10], [84, 24], [112, 24], [112, 74], [92, 74], [92, 96]], width: 2.3 },
  { points: [[18, 10], [18, 46], [34, 46], [34, 72], [62, 72], [62, 98]], width: 2.3, delay: 0.03 },
  { points: [[112, 24], [146, 24], [146, 52], [132, 52], [132, 96]], width: 2.15, delay: 0.08 },
  { points: [[18, 28], [54, 28], [54, 46]], width: 1.8, delay: 0.10 },
  { points: [[54, 10], [54, 28]], width: 1.8, delay: 0.12 },
  { points: [[62, 24], [62, 54], [84, 54]], width: 1.8, delay: 0.14 },
  { points: [[84, 24], [84, 54]], width: 1.8, delay: 0.16 },
  { points: [[92, 42], [112, 42]], width: 1.8, delay: 0.18 },
  { points: [[112, 42], [112, 74]], width: 1.8, delay: 0.20 },
  { points: [[34, 72], [34, 96]], width: 1.8, delay: 0.23 },
  { points: [[62, 72], [92, 72]], width: 1.8, delay: 0.26 },
  { points: [[92, 72], [92, 96]], width: 1.8, delay: 0.29 },
  { points: [[112, 74], [132, 74]], width: 1.8, delay: 0.31 },
  { points: [[96, 50], [108, 50], [108, 66], [96, 66], [96, 50]], width: 1.45, color: "soft", delay: 0.34 },
  { points: [[98, 52], [106, 52]], width: 1.25, color: "soft", delay: 0.35 },
  { points: [[98, 55], [106, 55]], width: 1.25, color: "soft", delay: 0.36 },
  { points: [[98, 58], [106, 58]], width: 1.25, color: "soft", delay: 0.37 },
  { points: [[98, 61], [106, 61]], width: 1.25, color: "soft", delay: 0.38 },
  { points: [[98, 64], [106, 64]], width: 1.25, color: "soft", delay: 0.39 },
  { points: [[36, 14], [48, 14], [48, 24], [36, 24], [36, 14]], width: 1.4, color: "soft", delay: 0.42 },
  { points: [[66, 42], [78, 42], [78, 52], [66, 52], [66, 42]], width: 1.4, color: "soft", delay: 0.45 },
  { points: [[116, 28], [128, 28], [128, 40], [116, 40], [116, 28]], width: 1.4, color: "soft", delay: 0.47 },
  { points: [[42, 78], [54, 78], [54, 90], [42, 90], [42, 78]], width: 1.4, color: "soft", delay: 0.50 },
  { points: [[98, 78], [110, 78], [110, 90], [98, 90], [98, 78]], width: 1.4, color: "soft", delay: 0.52 },
  { points: [[54, 36], [60, 30], [66, 36]], width: 1.3, color: "soft", delay: 0.56 },
  { points: [[78, 54], [84, 48], [90, 54]], width: 1.3, color: "soft", delay: 0.58 },
  { points: [[92, 64], [98, 58], [104, 64]], width: 1.3, color: "soft", delay: 0.60 },
  { points: [[62, 82], [68, 76], [74, 82]], width: 1.3, color: "soft", delay: 0.63 },
  { points: [[110, 82], [116, 76], [122, 82]], width: 1.3, color: "soft", delay: 0.65 },
  { points: [[14, 102], [136, 102]], width: 1.2, color: "soft", delay: 0.68 },
  { points: [[22, 99], [22, 105]], width: 1.2, color: "soft", delay: 0.70 },
  { points: [[52, 99], [52, 105]], width: 1.2, color: "soft", delay: 0.72 },
  { points: [[82, 99], [82, 105]], width: 1.2, color: "soft", delay: 0.74 },
  { points: [[112, 99], [112, 105]], width: 1.2, color: "soft", delay: 0.76 },
  { points: [[136, 99], [136, 105]], width: 1.2, color: "soft", delay: 0.78 },
];

function strokeLength(points: Point[]) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return total;
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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
  alpha: number,
  mirror = false,
) {
  if (progress <= 0 || alpha <= 0) return;

  const points = stroke.points;
  const total = strokeLength(points);
  const target = total * Math.min(1, progress);
  let travelled = 0;

  // Rotate the original floor plan 90° so it reads vertically inside the side gutter.
  const tx = (x: number, y: number) => offsetX + (mirror ? y : 112 - y) * scale;
  const ty = (x: number) => offsetY + x * scale;

  ctx.beginPath();
  ctx.moveTo(tx(points[0][0], points[0][1]), ty(points[0][0]));

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const segment = Math.hypot(b[0] - a[0], b[1] - a[1]);

    if (travelled + segment <= target) {
      ctx.lineTo(tx(b[0], b[1]), ty(b[0]));
      travelled += segment;
      continue;
    }

    const remaining = Math.max(0, target - travelled);
    const t = segment ? remaining / segment : 0;
    const px = a[0] + (b[0] - a[0]) * t;
    const py = a[1] + (b[1] - a[1]) * t;
    ctx.lineTo(tx(px, py), ty(px));
    break;
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = (stroke.width ?? 1.8) * Math.max(1.15, scale * 1.05);
  ctx.strokeStyle = stroke.color === "soft" ? softColor : mainColor;
  ctx.stroke();
  ctx.restore();
}

export default function LeftBlueprintScroll() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname !== "/") return;

    const canvas = document.createElement("canvas");
    canvas.className = "sbre-side-blueprint";
    canvas.setAttribute("aria-hidden", "true");
    Object.assign(canvas.style, {
      position: "fixed",
      inset: "0",
      width: "100vw",
      height: "100vh",
      pointerEvents: "none",
      zIndex: "1",
      opacity: "1",
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => canvas.remove();

    let raf = 0;
    let viewportWidth = window.innerWidth;
    let viewportHeight = window.innerHeight;
    let dpr = 1;
    let leftGutter = 0;
    let rightGutter = 0;
    let contentRight = viewportWidth;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startedAt = performance.now();

    // Slow premium loop: ~15s drawing, 5s hold, 3s fade.
    const cycle = 24;

    const measure = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const hero = document.querySelector<HTMLElement>(".premium-site .hero");
      const rect = hero?.getBoundingClientRect();

      if (rect) {
        leftGutter = Math.max(0, rect.left);
        contentRight = Math.min(viewportWidth, rect.right);
        rightGutter = Math.max(0, viewportWidth - contentRight);
      } else {
        const maxContent = Math.min(1180, viewportWidth * 0.72);
        leftGutter = (viewportWidth - maxContent) / 2;
        contentRight = leftGutter + maxContent;
        rightGutter = viewportWidth - contentRight;
      }

      canvas.style.display = Math.max(leftGutter, rightGutter) >= 125 ? "block" : "none";
      canvas.width = Math.max(1, Math.round(viewportWidth * dpr));
      canvas.height = Math.max(1, Math.round(viewportHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawHead = (x: number, y: number, color: string, pulse: number) => {
      ctx.save();
      ctx.globalAlpha = 0.55 + pulse * 0.28;
      ctx.beginPath();
      ctx.arc(x, y, 2.2 + pulse * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowBlur = 8 + pulse * 5;
      ctx.shadowColor = color;
      ctx.fill();
      ctx.restore();
    };

    const drawStrip = (
      x: number,
      stripWidth: number,
      mirror: boolean,
      localTime: number,
      mainColor: string,
      softColor: string,
    ) => {
      if (stripWidth < 125) return;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, stripWidth, viewportHeight);
      ctx.clip();

      // Rotated plan dimensions are roughly 112 × 154.
      const usableWidth = Math.max(96, stripWidth - 30);
      const scaleByWidth = usableWidth / 112;
      const scaleByHeight = (viewportHeight * 0.72) / 154;
      const scale = Math.min(2.05, scaleByWidth, scaleByHeight);
      const planWidth = 112 * scale;
      const planHeight = 154 * scale;
      const offsetX = x + Math.max(10, (stripWidth - planWidth) / 2);
      const offsetY = Math.max(90, (viewportHeight - planHeight) * 0.46);

      const drawStart = 0.8;
      const drawEnd = 15.2;
      const holdEnd = 20.0;
      const fadeEnd = 23.2;

      let master = 0;
      let alpha = 1;

      if (localTime < drawStart) {
        master = 0;
      } else if (localTime < drawEnd) {
        master = (localTime - drawStart) / (drawEnd - drawStart);
      } else {
        master = 1;
      }

      if (localTime > holdEnd) {
        alpha = Math.max(0, 1 - (localTime - holdEnd) / (fadeEnd - holdEnd));
      }

      blueprint.forEach((stroke, index) => {
        const delay = stroke.delay ?? index / blueprint.length;
        const local = Math.min(1, Math.max(0, (master - delay) / 0.28));
        drawPartial(
          ctx,
          stroke,
          easeInOut(local),
          scale,
          offsetX,
          offsetY,
          mainColor,
          softColor,
          alpha,
          mirror,
        );
      });

      if (master > 0 && master < 1 && alpha > 0.08) {
        const heads = [
          { start: 0.06, x: 20, y: 20 },
          { start: 0.30, x: 62, y: 50 },
          { start: 0.55, x: 108, y: 80 },
        ];

        heads.forEach((head, index) => {
          const p = Math.min(1, Math.max(0, (master - head.start) / 0.26));
          if (p <= 0 || p >= 1) return;

          const originalX = head.x + p * 24;
          const originalY = head.y + Math.sin(p * Math.PI) * 8 + p * 12;
          const hx = offsetX + (mirror ? originalY : 112 - originalY) * scale;
          const hy = offsetY + originalX * scale;
          const pulse = 0.5 + 0.5 * Math.sin(localTime * 3.2 + index * 1.5);
          drawHead(hx, hy, mainColor, pulse);
        });
      }

      ctx.restore();
    };

    const render = (now: number) => {
      if (canvas.style.display === "none") {
        raf = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      const dark = document.querySelector(".sbre-theme")?.classList.contains("theme-dark") ?? false;
      const mainColor = dark ? "rgba(255,255,255,.72)" : "rgba(10,92,61,.50)";
      const softColor = dark ? "rgba(255,255,255,.34)" : "rgba(10,92,61,.24)";
      const elapsed = (now - startedAt) / 1000;

      const leftTime = reduced ? 17 : elapsed % cycle;
      const rightTime = reduced ? 17 : (elapsed + 2.4) % cycle;

      drawStrip(0, leftGutter, false, leftTime, mainColor, softColor);
      drawStrip(contentRight, rightGutter, true, rightTime, mainColor, softColor);

      if (!reduced) raf = requestAnimationFrame(render);
    };

    measure();

    const resizeObserver = new ResizeObserver(measure);
    const hero = document.querySelector<HTMLElement>(".premium-site .hero");
    if (hero) resizeObserver.observe(hero);
    window.addEventListener("resize", measure, { passive: true });

    if (reduced) {
      render(startedAt + 17000);
    } else {
      raf = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measure);
      canvas.remove();
    };
  }, [pathname]);

  return null;
}
