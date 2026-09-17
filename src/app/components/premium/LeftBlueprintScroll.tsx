import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type Pt = [number, number];
type Segment = {
  points: Pt[];
  start: number;
  weight?: number;
  soft?: boolean;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const ease = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

function pathLength(points: Pt[]) {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
  }
  return total;
}

function drawPartial(
  ctx: CanvasRenderingContext2D,
  points: Pt[],
  progress: number,
  mapX: (x: number) => number,
  mapY: (y: number) => number,
) {
  if (progress <= 0) return;
  const total = pathLength(points);
  const target = total * clamp01(progress);
  let travelled = 0;

  ctx.beginPath();
  ctx.moveTo(mapX(points[0][0]), mapY(points[0][1]));

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);

    if (travelled + len <= target) {
      ctx.lineTo(mapX(b[0]), mapY(b[1]));
      travelled += len;
      continue;
    }

    const remaining = target - travelled;
    const t = len > 0 ? clamp01(remaining / len) : 0;
    ctx.lineTo(
      mapX(a[0] + (b[0] - a[0]) * t),
      mapY(a[1] + (b[1] - a[1]) * t),
    );
    break;
  }
}

function buildVerticalPlan(): Segment[] {
  return [
    // Main vertical architectural spine.
    { points: [[50, 0], [50, 8], [38, 8], [38, 18], [58, 18], [58, 30], [44, 30], [44, 42], [62, 42], [62, 55], [40, 55], [40, 68], [56, 68], [56, 80], [46, 80], [46, 92], [54, 92], [54, 100]], start: 0.00, weight: 2.8 },

    // Left/right wall returns that appear as the drawing head descends.
    { points: [[38, 8], [18, 8], [18, 15], [30, 15]], start: 0.06, weight: 2.2 },
    { points: [[58, 18], [80, 18], [80, 25], [68, 25]], start: 0.15, weight: 2.2 },
    { points: [[44, 30], [22, 30], [22, 38], [34, 38]], start: 0.25, weight: 2.2 },
    { points: [[62, 42], [84, 42], [84, 49], [70, 49]], start: 0.36, weight: 2.2 },
    { points: [[40, 55], [16, 55], [16, 63], [30, 63]], start: 0.49, weight: 2.2 },
    { points: [[56, 68], [82, 68], [82, 76], [68, 76]], start: 0.62, weight: 2.2 },
    { points: [[46, 80], [24, 80], [24, 88], [36, 88]], start: 0.75, weight: 2.2 },
    { points: [[54, 92], [78, 92], [78, 98], [66, 98]], start: 0.88, weight: 2.2 },

    // Secondary technical lines / room subdivisions.
    { points: [[24, 11], [24, 20], [34, 20]], start: 0.10, weight: 1.5, soft: true },
    { points: [[66, 21], [66, 31], [56, 31]], start: 0.20, weight: 1.5, soft: true },
    { points: [[28, 34], [28, 45], [40, 45]], start: 0.31, weight: 1.5, soft: true },
    { points: [[72, 45], [72, 57], [60, 57]], start: 0.43, weight: 1.5, soft: true },
    { points: [[24, 59], [24, 71], [38, 71]], start: 0.56, weight: 1.5, soft: true },
    { points: [[70, 71], [70, 83], [58, 83]], start: 0.69, weight: 1.5, soft: true },
    { points: [[30, 83], [30, 95], [44, 95]], start: 0.82, weight: 1.5, soft: true },

    // Small construction marks, like door / axis / detail strokes.
    { points: [[12, 26], [30, 26]], start: 0.22, weight: 1.25, soft: true },
    { points: [[70, 36], [88, 36]], start: 0.32, weight: 1.25, soft: true },
    { points: [[10, 51], [28, 51]], start: 0.46, weight: 1.25, soft: true },
    { points: [[72, 64], [90, 64]], start: 0.59, weight: 1.25, soft: true },
    { points: [[12, 77], [30, 77]], start: 0.72, weight: 1.25, soft: true },
    { points: [[70, 89], [88, 89]], start: 0.85, weight: 1.25, soft: true },
  ];
}

const PLAN = buildVerticalPlan();

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
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => canvas.remove();

    let raf = 0;
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let dpr = 1;
    let left = 0;
    let right = 0;
    let contentRight = vw;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();

    // Very slow top-to-bottom drawing.
    const drawDuration = 21;
    const holdDuration = 5;
    const fadeDuration = 3;
    const cycle = drawDuration + holdDuration + fadeDuration + 1;

    const measure = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const hero = document.querySelector<HTMLElement>(".premium-site .hero");
      const rect = hero?.getBoundingClientRect();

      if (rect) {
        left = Math.max(0, rect.left);
        contentRight = Math.min(vw, rect.right);
        right = Math.max(0, vw - contentRight);
      } else {
        const contentWidth = Math.min(1180, vw * 0.72);
        left = (vw - contentWidth) / 2;
        contentRight = left + contentWidth;
        right = vw - contentRight;
      }

      canvas.style.display = Math.max(left, right) >= 120 ? "block" : "none";
      canvas.width = Math.max(1, Math.round(vw * dpr));
      canvas.height = Math.max(1, Math.round(vh * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawStrip = (
      x: number,
      width: number,
      mirror: boolean,
      master: number,
      alpha: number,
      mainColor: string,
      softColor: string,
      headColor: string,
    ) => {
      if (width < 120) return;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, width, vh);
      ctx.clip();

      const inset = Math.max(14, width * 0.09);
      const usable = Math.max(80, width - inset * 2);
      const mapX = (n: number) => {
        const px = inset + (n / 100) * usable;
        return mirror ? x + width - px : x + px;
      };
      const mapY = (n: number) => 10 + (n / 100) * (vh - 20);

      PLAN.forEach((segment) => {
        const local = clamp01((master - segment.start) / 0.16);
        if (local <= 0) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = segment.weight ?? 2;
        ctx.strokeStyle = segment.soft ? softColor : mainColor;
        drawPartial(ctx, segment.points, ease(local), mapX, mapY);
        ctx.stroke();
        ctx.restore();
      });

      // Bright drawing head travels literally from top to bottom.
      if (master > 0 && master < 1 && alpha > 0.1) {
        const hy = mapY(master * 100);
        const hx = mapX(50 + Math.sin(master * Math.PI * 8) * 4);
        ctx.save();
        ctx.globalAlpha = 0.9 * alpha;
        ctx.beginPath();
        ctx.arc(hx, hy, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = headColor;
        ctx.shadowBlur = 13;
        ctx.shadowColor = headColor;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    const render = (now: number) => {
      if (canvas.style.display === "none") {
        raf = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, vw, vh);

      const dark = document.querySelector(".sbre-theme")?.classList.contains("theme-dark") ?? false;
      const mainColor = dark ? "rgba(255,255,255,.76)" : "rgba(10,92,61,.58)";
      const softColor = dark ? "rgba(255,255,255,.40)" : "rgba(10,92,61,.30)";
      const headColor = dark ? "rgba(255,255,255,.98)" : "rgba(16,112,78,.92)";

      const elapsed = reduced ? drawDuration + 1 : ((now - started) / 1000) % cycle;
      let master = 1;
      let alpha = 1;

      if (elapsed < drawDuration) {
        master = elapsed / drawDuration;
      } else if (elapsed < drawDuration + holdDuration) {
        master = 1;
      } else if (elapsed < drawDuration + holdDuration + fadeDuration) {
        const f = (elapsed - drawDuration - holdDuration) / fadeDuration;
        alpha = 1 - f;
      } else {
        master = 0;
        alpha = 0;
      }

      // Left starts immediately. Right follows slightly later for a more natural composition.
      drawStrip(0, left, false, master, alpha, mainColor, softColor, headColor);

      const delayed = reduced ? 1 : clamp01(master - 0.055);
      drawStrip(contentRight, right, true, delayed, alpha, mainColor, softColor, headColor);

      if (!reduced) raf = requestAnimationFrame(render);
    };

    measure();
    const ro = new ResizeObserver(measure);
    const hero = document.querySelector<HTMLElement>(".premium-site .hero");
    if (hero) ro.observe(hero);
    window.addEventListener("resize", measure, { passive: true });

    if (reduced) render(started + (drawDuration + 1) * 1000);
    else raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      canvas.remove();
    };
  }, [pathname]);

  return null;
}
