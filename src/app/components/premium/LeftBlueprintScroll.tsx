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

function buildLeftPlan(): Segment[] {
  return [
    // Main vertical wall running from top to bottom.
    { points: [[46, 0], [46, 100]], start: 0.0, weight: 2.1 },

    // Strong horizontal slabs / room limits.
    { points: [[46, 8], [16, 8]], start: 0.05, weight: 1.85 },
    { points: [[46, 19], [78, 19]], start: 0.14, weight: 1.85 },
    { points: [[46, 31], [12, 31]], start: 0.24, weight: 1.85 },
    { points: [[46, 43], [84, 43]], start: 0.35, weight: 1.85 },
    { points: [[46, 56], [18, 56]], start: 0.47, weight: 1.85 },
    { points: [[46, 69], [80, 69]], start: 0.60, weight: 1.85 },
    { points: [[46, 82], [14, 82]], start: 0.73, weight: 1.85 },
    { points: [[46, 94], [76, 94]], start: 0.86, weight: 1.85 },

    // Secondary vertical walls create real room-like modules.
    { points: [[16, 8], [16, 17]], start: 0.08, weight: 1.35, soft: true },
    { points: [[78, 19], [78, 28]], start: 0.18, weight: 1.35, soft: true },
    { points: [[12, 31], [12, 40]], start: 0.28, weight: 1.35, soft: true },
    { points: [[84, 43], [84, 52]], start: 0.39, weight: 1.35, soft: true },
    { points: [[18, 56], [18, 65]], start: 0.51, weight: 1.35, soft: true },
    { points: [[80, 69], [80, 78]], start: 0.64, weight: 1.35, soft: true },
    { points: [[14, 82], [14, 91]], start: 0.77, weight: 1.35, soft: true },
    { points: [[76, 94], [76, 100]], start: 0.90, weight: 1.35, soft: true },

    // Quiet internal partitions.
    { points: [[28, 8], [28, 14], [40, 14]], start: 0.10, weight: 1.0, soft: true },
    { points: [[62, 19], [62, 25], [50, 25]], start: 0.20, weight: 1.0, soft: true },
    { points: [[24, 31], [24, 37], [38, 37]], start: 0.30, weight: 1.0, soft: true },
    { points: [[68, 43], [68, 49], [54, 49]], start: 0.41, weight: 1.0, soft: true },
    { points: [[28, 56], [28, 62], [40, 62]], start: 0.53, weight: 1.0, soft: true },
    { points: [[64, 69], [64, 75], [52, 75]], start: 0.66, weight: 1.0, soft: true },
    { points: [[26, 82], [26, 88], [40, 88]], start: 0.79, weight: 1.0, soft: true },
  ];
}

function buildRightPlan(): Segment[] {
  return [
    // Different composition: two vertical axes linked by horizontal bands.
    { points: [[34, 0], [34, 100]], start: 0.0, weight: 2.0 },
    { points: [[68, 6], [68, 100]], start: 0.07, weight: 1.7 },

    { points: [[34, 10], [68, 10]], start: 0.10, weight: 1.75 },
    { points: [[34, 24], [84, 24]], start: 0.20, weight: 1.75 },
    { points: [[18, 38], [68, 38]], start: 0.31, weight: 1.75 },
    { points: [[34, 52], [88, 52]], start: 0.43, weight: 1.75 },
    { points: [[12, 66], [68, 66]], start: 0.56, weight: 1.75 },
    { points: [[34, 80], [82, 80]], start: 0.69, weight: 1.75 },
    { points: [[20, 93], [68, 93]], start: 0.82, weight: 1.75 },

    { points: [[84, 24], [84, 32]], start: 0.24, weight: 1.3, soft: true },
    { points: [[18, 38], [18, 46]], start: 0.35, weight: 1.3, soft: true },
    { points: [[88, 52], [88, 60]], start: 0.47, weight: 1.3, soft: true },
    { points: [[12, 66], [12, 74]], start: 0.60, weight: 1.3, soft: true },
    { points: [[82, 80], [82, 88]], start: 0.73, weight: 1.3, soft: true },
    { points: [[20, 93], [20, 100]], start: 0.86, weight: 1.3, soft: true },

    { points: [[48, 10], [48, 17]], start: 0.14, weight: 0.95, soft: true },
    { points: [[54, 38], [54, 45]], start: 0.39, weight: 0.95, soft: true },
    { points: [[48, 66], [48, 73]], start: 0.64, weight: 0.95, soft: true },
    { points: [[54, 80], [54, 87]], start: 0.76, weight: 0.95, soft: true },
  ];
}

const LEFT_PLAN = buildLeftPlan();
const RIGHT_PLAN = buildRightPlan();

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

    const drawDuration = 36;
    const holdDuration = 7;
    const fadeDuration = 4;
    const cycle = drawDuration + holdDuration + fadeDuration + 2;

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
      plan: Segment[],
      master: number,
      alpha: number,
      mainColor: string,
      softColor: string,
      headColor: string,
      headX: number,
    ) => {
      if (width < 120) return;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, width, vh);
      ctx.clip();

      const inset = Math.max(16, width * 0.08);
      const usable = Math.max(86, width - inset * 2);
      const mapX = (n: number) => x + inset + (n / 100) * usable;
      const mapY = (n: number) => 8 + (n / 100) * (vh - 16);

      plan.forEach((segment) => {
        const local = clamp01((master - segment.start) / 0.18);
        if (local <= 0) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.lineCap = "butt";
        ctx.lineJoin = "miter";
        ctx.lineWidth = segment.weight ?? 1.6;
        ctx.strokeStyle = segment.soft ? softColor : mainColor;
        drawPartial(ctx, segment.points, ease(local), mapX, mapY);
        ctx.stroke();
        ctx.restore();
      });

      if (master > 0 && master < 1 && alpha > 0.08) {
        ctx.save();
        ctx.globalAlpha = 0.38 * alpha;
        ctx.beginPath();
        ctx.arc(mapX(headX), mapY(master * 100), 1.8, 0, Math.PI * 2);
        ctx.fillStyle = headColor;
        ctx.shadowBlur = 5;
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
      const mainColor = dark ? "rgba(255,255,255,.34)" : "rgba(10,92,61,.27)";
      const softColor = dark ? "rgba(255,255,255,.16)" : "rgba(10,92,61,.12)";
      const headColor = dark ? "rgba(255,255,255,.58)" : "rgba(16,112,78,.44)";

      const elapsed = reduced ? drawDuration + 1 : ((now - started) / 1000) % cycle;
      let master = 1;
      let alpha = 1;

      if (elapsed < drawDuration) {
        master = elapsed / drawDuration;
      } else if (elapsed < drawDuration + holdDuration) {
        master = 1;
      } else if (elapsed < drawDuration + holdDuration + fadeDuration) {
        alpha = 1 - (elapsed - drawDuration - holdDuration) / fadeDuration;
      } else {
        master = 0;
        alpha = 0;
      }

      drawStrip(0, left, LEFT_PLAN, master, alpha, mainColor, softColor, headColor, 46);

      const rightMaster = reduced ? 1 : clamp01(master - 0.08);
      drawStrip(contentRight, right, RIGHT_PLAN, rightMaster, alpha, mainColor, softColor, headColor, 34);

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
