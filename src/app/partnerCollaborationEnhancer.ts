type Point = readonly [number, number];

type Cleanup = () => void;

const mounted = new WeakMap<HTMLElement, Cleanup>();

const blueprintPaths: readonly (readonly Point[])[] = [
  [
    [0.04, 0.22],
    [0.20, 0.15],
    [0.34, 0.23],
    [0.48, 0.16],
    [0.61, 0.24],
    [0.78, 0.16],
    [0.95, 0.23],
  ],
  [
    [0.08, 0.39],
    [0.18, 0.32],
    [0.31, 0.39],
    [0.43, 0.31],
    [0.56, 0.40],
    [0.71, 0.33],
    [0.90, 0.41],
  ],
  [
    [0.02, 0.58],
    [0.14, 0.49],
    [0.29, 0.57],
    [0.44, 0.50],
    [0.58, 0.59],
    [0.73, 0.50],
    [0.98, 0.61],
  ],
  [
    [0.06, 0.79],
    [0.23, 0.69],
    [0.36, 0.77],
    [0.49, 0.70],
    [0.66, 0.80],
    [0.82, 0.70],
    [0.96, 0.76],
  ],
  [
    [0.15, 0.06],
    [0.15, 0.94],
  ],
  [
    [0.86, 0.04],
    [0.86, 0.96],
  ],
];

function drawPartialPolyline(
  ctx: CanvasRenderingContext2D,
  points: readonly Point[],
  width: number,
  height: number,
  progress: number,
  shiftX: number,
  shiftY: number,
) {
  if (points.length < 2 || progress <= 0) return;

  const mapped = points.map(([x, y]) => [x * width + shiftX, y * height + shiftY] as const);
  const lengths: number[] = [];
  let total = 0;

  for (let index = 1; index < mapped.length; index += 1) {
    const previous = mapped[index - 1];
    const current = mapped[index];
    const segment = Math.hypot(current[0] - previous[0], current[1] - previous[1]);
    lengths.push(segment);
    total += segment;
  }

  let remaining = total * Math.min(1, progress);
  ctx.beginPath();
  ctx.moveTo(mapped[0][0], mapped[0][1]);

  for (let index = 1; index < mapped.length && remaining > 0; index += 1) {
    const previous = mapped[index - 1];
    const current = mapped[index];
    const segment = lengths[index - 1];

    if (remaining >= segment) {
      ctx.lineTo(current[0], current[1]);
      remaining -= segment;
      continue;
    }

    const ratio = segment === 0 ? 0 : remaining / segment;
    ctx.lineTo(
      previous[0] + (current[0] - previous[0]) * ratio,
      previous[1] + (current[1] - previous[1]) * ratio,
    );
    remaining = 0;
  }

  ctx.stroke();
}

function enhance(section: HTMLElement) {
  if (mounted.has(section) || section.dataset.collabPremium === "true") return;

  section.dataset.collabPremium = "true";
  section.classList.add("pr-collab-premium");

  const canvas = document.createElement("canvas");
  canvas.className = "pr-collab-canvas";
  canvas.setAttribute("aria-hidden", "true");
  section.prepend(canvas);

  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let cssWidth = 1;
  let cssHeight = 1;
  let dpr = 1;
  let pointerX = 0.5;
  let pointerY = 0.5;
  let frame = 0;
  let visible = true;
  let destroyed = false;

  const cards = Array.from(section.querySelectorAll<HTMLElement>(".pr-profile"));
  const removeCardListeners: Array<() => void> = [];

  cards.forEach((card, index) => {
    card.dataset.collabIndex = String(index + 1).padStart(2, "0");

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reduceMotion.matches) return;
      const rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const localX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
      const localY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
      const rotateX = (0.5 - localY) * 5.5;
      const rotateY = (localX - 0.5) * 7.5;

      card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
      card.style.setProperty("--mx", `${(localX * 100).toFixed(1)}%`);
      card.style.setProperty("--my", `${(localY * 100).toFixed(1)}%`);
    };

    const onLeave = () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--mx", "50%");
      card.style.setProperty("--my", "50%");
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    removeCardListeners.push(() => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    });
  });

  const resize = () => {
    const rect = section.getBoundingClientRect();
    cssWidth = Math.max(1, Math.round(rect.width));
    cssHeight = Math.max(1, Math.round(section.scrollHeight || rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.max(1, Math.round(cssWidth * dpr));
    canvas.height = Math.max(1, Math.round(cssHeight * dpr));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduceMotion.matches) draw(0);
  };

  const draw = (time: number) => {
    if (destroyed) return;

    const isDark = Boolean(section.closest(".theme-dark"));
    const subtle = isDark ? "rgba(191, 218, 193, 0.065)" : "rgba(22, 101, 67, 0.062)";
    const medium = isDark ? "rgba(191, 218, 193, 0.16)" : "rgba(16, 96, 63, 0.15)";
    const bright = isDark ? "rgba(200, 230, 201, 0.34)" : "rgba(10, 101, 64, 0.30)";

    context.clearRect(0, 0, cssWidth, cssHeight);
    context.save();

    const parallaxX = (pointerX - 0.5) * 18;
    const parallaxY = (pointerY - 0.5) * 14;
    context.translate(parallaxX, parallaxY);

    context.lineWidth = 1;
    context.strokeStyle = subtle;

    const grid = 72;
    for (let x = -grid; x < cssWidth + grid; x += grid) {
      context.beginPath();
      context.moveTo(x, -grid);
      context.lineTo(x, cssHeight + grid);
      context.stroke();
    }
    for (let y = -grid; y < cssHeight + grid; y += grid) {
      context.beginPath();
      context.moveTo(-grid, y);
      context.lineTo(cssWidth + grid, y);
      context.stroke();
    }

    context.strokeStyle = subtle;
    for (let offset = -cssHeight; offset < cssWidth; offset += 180) {
      context.beginPath();
      context.moveTo(offset, cssHeight * 0.08);
      context.lineTo(offset + cssHeight * 0.72, cssHeight * 0.80);
      context.stroke();
    }

    const cycle = reduceMotion.matches ? 1 : ((time * 0.00016) % 1.65);

    blueprintPaths.forEach((path, index) => {
      const delayed = cycle - index * 0.12;
      const progress = reduceMotion.matches ? 1 : Math.max(0, Math.min(1, delayed));
      const fade = reduceMotion.matches
        ? 0.75
        : delayed > 1
          ? Math.max(0.18, 1 - (delayed - 1) * 1.25)
          : 1;

      context.strokeStyle = index < 4 ? bright : medium;
      context.globalAlpha = fade;
      context.lineWidth = index < 4 ? 1.15 : 0.8;
      drawPartialPolyline(context, path, cssWidth, cssHeight, progress, 0, 0);
    });

    context.globalAlpha = 1;

    const nodePulse = reduceMotion.matches ? 0.65 : 0.52 + Math.sin(time * 0.0022) * 0.13;
    context.fillStyle = isDark
      ? `rgba(202, 231, 203, ${nodePulse})`
      : `rgba(10, 101, 64, ${nodePulse})`;

    const nodes: readonly Point[] = [
      [0.20, 0.15],
      [0.48, 0.16],
      [0.78, 0.16],
      [0.31, 0.39],
      [0.71, 0.33],
      [0.29, 0.57],
      [0.58, 0.59],
      [0.82, 0.70],
    ];

    nodes.forEach(([x, y], index) => {
      const radius = index % 3 === 0 ? 2.6 : 1.8;
      context.beginPath();
      context.arc(x * cssWidth, y * cssHeight, radius, 0, Math.PI * 2);
      context.fill();
    });

    context.restore();
  };

  const render = (time: number) => {
    if (destroyed) return;
    if (!section.isConnected) {
      cleanup();
      return;
    }
    if (visible) draw(time);
    frame = requestAnimationFrame(render);
  };

  const onSectionMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const rect = section.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    pointerX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    pointerY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
  };

  section.addEventListener("pointermove", onSectionMove, { passive: true });

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(section);

  const intersectionObserver = new IntersectionObserver(
    ([entry]) => {
      visible = entry?.isIntersecting ?? true;
    },
    { rootMargin: "220px 0px 220px 0px" },
  );
  intersectionObserver.observe(section);

  const onMotionChange = () => {
    cards.forEach((card) => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
    draw(performance.now());
  };
  reduceMotion.addEventListener("change", onMotionChange);

  const cleanup = () => {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    reduceMotion.removeEventListener("change", onMotionChange);
    section.removeEventListener("pointermove", onSectionMove);
    removeCardListeners.forEach((remove) => remove());
    canvas.remove();
    section.classList.remove("pr-collab-premium");
    delete section.dataset.collabPremium;
    mounted.delete(section);
  };

  mounted.set(section, cleanup);
  resize();
  frame = requestAnimationFrame(render);
}

function scan() {
  document.querySelectorAll<HTMLElement>(".pr-collaboration").forEach(enhance);
}

const observer = new MutationObserver(scan);

function start() {
  scan();
  observer.observe(document.documentElement, { childList: true, subtree: true });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
  start();
}
