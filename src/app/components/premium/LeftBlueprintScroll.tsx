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
  { points: [[18, 10], [84, 10], [84, 24], [112, 24], [112, 74], [92, 74], [92, 96]], width: 1.45 },
  { points: [[18, 10], [18, 46], [34, 46], [34, 72], [62, 72], [62, 98]], width: 1.45, delay: 0.03 },
  { points: [[112, 24], [146, 24], [146, 52], [132, 52], [132, 96]], width: 1.3, delay: 0.08 },
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
  { points: [[96, 50], [108, 50], [108, 66], [96, 66], [96, 50]], color: "soft", delay: 0.34 },
  { points: [[98, 52], [106, 52]], color: "soft", delay: 0.35 },
  { points: [[98, 55], [106, 55]], color: "soft", delay: 0.36 },
  { points: [[98, 58], [106, 58]], color: "soft", delay: 0.37 },
  { points: [[98, 61], [106, 61]], color: "soft", delay: 0.38 },
  { points: [[98, 64], [106, 64]], color: "soft", delay: 0.39 },
  { points: [[36, 14], [48, 14], [48, 24], [36, 24], [36, 14]], color: "soft", delay: 0.42 },
  { points: [[66, 42], [78, 42], [78, 52], [66, 52], [66, 42]], color: "soft", delay: 0.45 },
  { points: [[116, 28], [128, 28], [128, 40], [116, 40], [116, 28]], color: "soft", delay: 0.47 },
  { points: [[42, 78], [54, 78], [54, 90], [42, 90], [42, 78]], color: "soft", delay: 0.50 },
  { points: [[98, 78], [110, 78], [110, 90], [98, 90], [98, 78]], color: "soft", delay: 0.52 },
  { points: [[54, 36], [60, 30], [66, 36]], color: "soft", delay: 0.56 },
  { points: [[78, 54], [84, 48], [90, 54]], color: "soft", delay: 0.58 },
  { points: [[92, 64], [98, 58], [104, 64]], color: "soft", delay: 0.60 },
  { points: [[62, 82], [68, 76], [74, 82]], color: "soft", delay: 0.63 },
  { points: [[110, 82], [116, 76], [122, 82]], color: "soft", delay: 0.65 },
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
  mirror = false,
) {
  if (progress <= 0) return;
  const points = stroke.points;
  const total = strokeLength(points);
  const target = total * Math.min(1, progress);
  let travelled = 0;
  const tx = (x: number) => offsetX + (mirror ? 154 - x : x) * scale;
  const ty = (y: number) => offsetY + y * scale;

  ctx.beginPath();
  ctx.moveTo(tx(points[0][0]), ty(points[0][1]));

  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    const segment = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (travelled + segment <= target) {
      ctx.lineTo(tx(b[0]), ty(b[1]));
      travelled += segment;
      continue;
    }

    const remaining = Math.max(0, target - travelled);
    const t = segment ? remaining / segment : 0;
    ctx.lineTo(
      tx(a[0] + (b[0] - a[0]) * t),
      ty(a[1] + (b[1] - a[1]) * t),
    );
    break;
  }

  ctx.lineCap = "square";
  ctx.lineJoin = "miter";
  ctx.lineWidth = (stroke.width ?? 0.9) * Math.max(0.9, scale * 0.92);
  ctx.strokeStyle = stroke.color === "soft" ? softColor : mainColor;
  ctx.stroke();
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
    let contentLeft = 0;
    let contentRight = viewportWidth;
    let targetProgress = 0.16;
    let displayProgress = 0.16;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const measure = () => {
      viewportWidth = window.innerWidth;
      viewportHeight = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      const hero = document.querySelector<HTMLElement>(".premium-site .hero");
      const projects = document.querySelector<HTMLElement>(".premium-site .projects-section");
      const reference = hero ?? projects;
      const rect = reference?.getBoundingClientRect();

      if (rect) {
        contentLeft = Math.max(0, rect.left);
        contentRight = Math.min(viewportWidth, rect.right);
      } else {
        const maxContent = Math.min(1180, viewportWidth * 0.72);
        contentLeft = (viewportWidth - maxContent) / 2;
        contentRight = contentLeft + maxContent;
      }

      leftGutter = Math.max(0, contentLeft);
      rightGutter = Math.max(0, viewportWidth - contentRight);

      canvas.style.display = Math.max(leftGutter, rightGutter) >= 135 ? "block" : "none";
      canvas.width = Math.max(1, Math.round(viewportWidth * dpr));
      canvas.height = Math.max(1, Math.round(viewportHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollRatio = Math.min(1, Math.max(0, window.scrollY / max));
      targetProgress = 0.16 + scrollRatio * 0.84;
    };

    const drawStrip = (
      x: number,
      stripWidth: number,
      mirror: boolean,
      mainColor: string,
      softColor: string,
      phaseOffset: number,
    ) => {
      if (stripWidth < 135) return;

      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, stripWidth, viewportHeight);
      ctx.clip();

      const usableWidth = Math.max(110, stripWidth - 44);
      const scale = Math.min(1.52, usableWidth / 164);
      const planHeight = 112 * scale;
      const blockGap = Math.max(95, viewportHeight * 0.11);
      const blockHeight = Math.max(planHeight + blockGap, viewportHeight * 0.34);
      const scrollTravel = displayProgress * blockHeight * 5.0;

      for (let block = -2; block < 6; block += 1) {
        const y = block * blockHeight - (scrollTravel % blockHeight) + 18;
        if (y > viewportHeight + planHeight || y + planHeight < -80) continue;

        const sequence = Math.min(1, Math.max(0, displayProgress * 1.16 - block * 0.055 + phaseOffset));
        const offsetX = x + Math.max(16, (stripWidth - 154 * scale) / 2);

        blueprint.forEach((stroke, index) => {
          const delay = stroke.delay ?? index / blueprint.length;
          const local = (sequence - delay) / 0.26;
          const progress = Math.min(1, Math.max(0, local));
          drawPartial(ctx, stroke, progress, scale, offsetX, y, mainColor, softColor, mirror);
        });

        const heads = [0.22, 0.50, 0.77];
        heads.forEach((head, i) => {
          const p = Math.min(1, Math.max(0, (sequence - head + 0.11) / 0.16));
          if (p <= 0 || p >= 1) return;
          const localX = 26 + i * 45 + p * 20;
          const hx = offsetX + (mirror ? 154 - localX : localX) * scale;
          const hy = y + (20 + i * 28 + p * 16) * scale;
          ctx.beginPath();
          ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = mainColor;
          ctx.fill();
        });
      }

      ctx.restore();
    };

    const render = () => {
      if (canvas.style.display === "none") {
        raf = requestAnimationFrame(render);
        return;
      }

      displayProgress += (targetProgress - displayProgress) * 0.07;
      if (reduced) displayProgress = targetProgress;

      ctx.clearRect(0, 0, viewportWidth, viewportHeight);

      const dark = document.querySelector(".sbre-theme")?.classList.contains("theme-dark") ?? false;
      const mainColor = dark ? "rgba(255,255,255,.48)" : "rgba(10,92,61,.34)";
      const softColor = dark ? "rgba(255,255,255,.22)" : "rgba(10,92,61,.15)";

      drawStrip(0, leftGutter, false, mainColor, softColor, 0);
      drawStrip(contentRight, rightGutter, true, mainColor, softColor, -0.08);

      raf = requestAnimationFrame(render);
    };

    measure();
    onScroll();

    const resizeObserver = new ResizeObserver(measure);
    const hero = document.querySelector<HTMLElement>(".premium-site .hero");
    if (hero) resizeObserver.observe(hero);
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
