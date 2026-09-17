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
    { points: [[48, 0], [48, 9], [34, 9], [34, 21], [58, 21], [58, 34], [42, 34], [42, 47], [64, 47], [64, 60], [38, 60], [38, 73], [56, 73], [56, 86], [46, 86], [46, 100]], start: 0.00, weight: 2.25 },
    { points: [[34, 9], [15, 9], [15, 17], [28, 17]], start: 0.07, weight: 1.85 },
    { points: [[58, 21], [82, 21], [82, 29], [69, 29]], start: 0.16, weight: 1.85 },
    { points: [[42, 34], [20, 34], [20, 43], [33, 43]], start: 0.27, weight: 1.85 },
    { points: [[64, 47], [86, 47], [86, 55], [72, 55]], start: 0.38, weight: 1.85 },
    { points: [[38, 60], [14, 60], [14, 69], [29, 69]], start: 0.51, weight: 1.85 },
    { points: [[56, 73], [83, 73], [83, 82], [67, 82]], start: 0.64, weight: 1.85 },
    { points: [[46, 86], [22, 86], [22, 95], [35, 95]], start: 0.78, weight: 1.85 },
    { points: [[23, 13], [23, 24], [34, 24]], start: 0.11, weight: 1.2, soft: true },
    { points: [[68, 25], [68, 37], [57, 37]], start: 0.22, weight: 1.2, soft: true },
    { points: [[27, 39], [27, 51], [41, 51]], start: 0.33, weight: 1.2, soft: true },
    { points: [[73, 51], [73, 63], [61, 63]], start: 0.45, weight: 1.2, soft: true },
    { points: [[24, 64], [24, 77], [37, 77]], start: 0.57, weight: 1.2, soft: true },
    { points: [[70, 77], [70, 90], [57, 90]], start: 0.70, weight: 1.2, soft: true },
    { points: [[11, 29], [28, 29]], start: 0.24, weight: 1.0, soft: true },
    { points: [[70, 42], [90, 42]], start: 0.35, weight: 1.0, soft: true },
    { points: [[10, 56], [27, 56]], start: 0.48, weight: 1.0, soft: true },
    { points: [[73, 69], [91, 69]], start: 0.61, weight: 1.0, soft: true },
    { points: [[12, 82], [30, 82]], start: 0.74, weight: 1.0, soft: true },
  ];
}

function buildRightPlan(): Segment[] {
  return [
    { points: [[58, 0], [58, 11], [72, 11], [72, 23], [52, 23], [52, 36], [68, 36], [68, 49], [44, 49], [44, 63], [61, 63], [61, 76], [39, 76], [39, 89], [53, 89], [53, 100]], start: 0.00, weight: 2.15 },
    { points: [[72, 11], [91, 11], [91, 19], [79, 19]], start: 0.08, weight: 1.75 },
    { points: [[52, 23], [27, 23], [27, 32], [40, 32]], start: 0.18, weight: 1.75 },
    { points: [[68, 36], [88, 36], [88, 45], [76, 45]], start: 0.29, weight: 1.75 },
    { points: [[44, 49], [18, 49], [18, 58], [31, 58]], start: 0.41, weight: 1.75 },
    { points: [[61, 63], [86, 63], [86, 71], [73, 71]], start: 0.54, weight: 1.75 },
    { points: [[39, 76], [15, 76], [15, 85], [28, 85]], start: 0.68, weight: 1.75 },
    { points: [[53, 89], [80, 89], [80, 97], [66, 97]], start: 0.82, weight: 1.75 },
    { points: [[79, 15], [79, 28], [69, 28]], start: 0.13, weight: 1.15, soft: true },
    { points: [[34, 27], [34, 40], [50, 40]], start: 0.24, weight: 1.15, soft: true },
    { points: [[77, 41], [77, 54], [66, 54]], start: 0.36, weight: 1.15, soft: true },
    { points: [[29, 54], [29, 67], [43, 67]], start: 0.48, weight: 1.15, soft: true },
    { points: [[75, 67], [75, 80], [62, 80]], start: 0.61, weight: 1.15, soft: true },
    { points: [[31, 80], [31, 93], [40, 93]], start: 0.75, weight: 1.15, soft: true },
    { points: [[72, 31], [92, 31]], start: 0.27, weight: 0.95, soft: true },
    { points: [[9, 45], [28, 45]], start: 0.38, weight: 0.95, soft: true },
    { points: [[72, 59], [93, 59]], start: 0.52, weight: 0.95, soft: true },
    { points: [[8, 72], [27, 72]], start: 0.65, weight: 0.95, soft: true },
    { points: [[69, 86], [90, 86]], start: 0.79, weight: 0.95, soft: true },
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

    // Slower, calmer architectural drawing loop.
    const drawDuration = 32;
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
      headBias: number,
    ) => {
      if (width < 120) return;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, width, vh);
      ctx.clip();

      const inset = Math.max(14, width * 0.09);
      const usable = Math.max(80, width - inset * 2);
      const mapX = (n: number) => x + inset + (n / 100) * usable;
      const mapY = (n: number) => 10 + (n / 100) * (vh - 20);

      plan.forEach((segment) => {
        const local = clamp01((master - segment.start) / 0.19);
        if (local <= 0) return;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.lineWidth = segment.weight ?? 1.7;
        ctx.strokeStyle = segment.soft ? softColor : mainColor;
        drawPartial(ctx, segment.points, ease(local), mapX, mapY);
        ctx.stroke();
        ctx.restore();
      });

      if (master > 0 && master < 1 && alpha > 0.08) {
        const hy = mapY(master * 100);
        const hx = mapX(headBias + Math.sin(master * Math.PI * 6) * 3.2);
        ctx.save();
        ctx.globalAlpha = 0.52 * alpha;
        ctx.beginPath();
        ctx.arc(hx, hy, 2.1, 0, Math.PI * 2);
        ctx.fillStyle = headColor;
        ctx.shadowBlur = 7;
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
      const mainColor = dark ? "rgba(255,255,255,.42)" : "rgba(10,92,61,.34)";
      const softColor = dark ? "rgba(255,255,255,.20)" : "rgba(10,92,61,.16)";
      const headColor = dark ? "rgba(255,255,255,.70)" : "rgba(16,112,78,.58)";

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

      drawStrip(0, left, LEFT_PLAN, master, alpha, mainColor, softColor, headColor, 48);

      // Right side is deliberately different: another plan, another rhythm, another drawing head path.
      const rightMaster = reduced ? 1 : clamp01(master - 0.085);
      drawStrip(contentRight, right, RIGHT_PLAN, rightMaster, alpha, mainColor, softColor, headColor, 58);

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
