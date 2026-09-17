import { useEffect } from "react";

const profiles = [
  {
    name: "Soufiane SBRE",
    role: "Directeur",
    description: "Cadrage du mandat, arbitrages et direction des opérations.",
    image: null,
    alt: "Soufiane SBRE, directeur de SBRE Ingénierie",
  },
  {
    name: "Yannick Müller",
    role: "Chef de projet",
    description: "Organisation, planification et coordination des intervenants.",
    image: `${import.meta.env.BASE_URL}team-zayd-haidar.webp`,
    alt: "Yannick Müller, chef de projet chez SBRE Ingénierie",
  },
  {
    name: "Zayd Haidar",
    role: "Conducteur de travaux",
    description: "Suivi terrain, contrôle de l’exécution et préparation des réceptions.",
    image: `${import.meta.env.BASE_URL}team-yannick-muller.webp`,
    alt: "Zayd Haidar, conducteur de travaux chez SBRE Ingénierie",
  },
];

function createHexWave(section: HTMLElement) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.createElement("canvas");
  canvas.className = "team-hex-wave-canvas";
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.position = "absolute";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "0";
  canvas.style.opacity = "0.58";
  canvas.style.mixBlendMode = "screen";

  section.querySelector(".team-hex-wave-canvas")?.remove();
  section.prepend(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return () => canvas.remove();

  let width = 1;
  let height = 1;
  let dpr = 1;
  let raf = 0;
  let running = false;
  let startTime = performance.now();

  type Hex = {
    x: number;
    y: number;
    r: number;
    delay: number;
    phase: number;
  };

  let hexes: Hex[] = [];

  const rebuild = () => {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const mobile = width < 780;
    const radius = mobile ? 22 : 30;
    const horizontal = Math.sqrt(3) * radius;
    const vertical = radius * 1.5;
    const cols = Math.ceil(width / horizontal) + 4;
    const rows = Math.ceil(height / vertical) + 4;

    const maxDiagonal = Math.max(width + height, 1);
    const next: Hex[] = [];
    for (let row = -2; row < rows; row += 1) {
      for (let col = -2; col < cols; col += 1) {
        const x = col * horizontal + (row % 2 ? horizontal / 2 : 0);
        const y = row * vertical;

        // Vague diagonale : départ coin bas-gauche vers haut-droite.
        const diagonal = x + (height - y) * 0.92;
        const jitter = Math.sin(row * 0.9 + col * 0.72) * 0.045;

        next.push({
          x,
          y,
          r: radius,
          delay: diagonal / maxDiagonal + jitter,
          phase: ((row * 11 + col * 7) % 23) / 23,
        });
      }
    }
    hexes = next;
  };

  const drawHex = (hex: Hex, progress: number, alpha: number) => {
    if (progress <= 0 || alpha <= 0) return;

    const points: Array<[number, number]> = [];
    for (let i = 0; i < 6; i += 1) {
      const angle = Math.PI / 3 * i - Math.PI / 6;
      points.push([
        hex.x + Math.cos(angle) * hex.r,
        hex.y + Math.sin(angle) * hex.r,
      ]);
    }

    const perimeter = 6;
    const total = Math.min(perimeter, Math.max(0, progress * perimeter));

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);

    for (let edge = 0; edge < Math.floor(total); edge += 1) {
      const next = points[(edge + 1) % 6];
      ctx.lineTo(next[0], next[1]);
    }

    const partial = total - Math.floor(total);
    if (partial > 0 && total < perimeter) {
      const edge = Math.floor(total);
      const a = points[edge % 6];
      const b = points[(edge + 1) % 6];
      ctx.lineTo(
        a[0] + (b[0] - a[0]) * partial,
        a[1] + (b[1] - a[1]) * partial,
      );
    }

    ctx.lineWidth = width < 780 ? 0.8 : 1.05;
    ctx.strokeStyle = `rgba(232, 244, 236, ${alpha})`;
    ctx.shadowColor = `rgba(185, 229, 201, ${alpha * 0.35})`;
    ctx.shadowBlur = width < 780 ? 2 : 4;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const render = (now: number) => {
    ctx.clearRect(0, 0, width, height);

    const elapsed = (now - startTime) / 1000;
    const cycleDuration = 10.8;
    const cycle = (elapsed % cycleDuration) / cycleDuration;

    for (const hex of hexes) {
      // Front de vague court et doux, légèrement sinusoïdal.
      const ripple = Math.sin(hex.x * 0.012 + elapsed * 0.75) * 0.028;
      const wavePosition = cycle * 1.72 - 0.28;
      const local = wavePosition - hex.delay + ripple;

      let drawProgress = 0;
      let alpha = 0;

      if (prefersReducedMotion) {
        drawProgress = 1;
        alpha = 0.08 + hex.phase * 0.035;
      } else if (local >= 0 && local < 0.23) {
        drawProgress = Math.min(1, local / 0.12);
        const fadeIn = Math.min(1, local / 0.05);
        const fadeOut = Math.max(0, 1 - (local - 0.13) / 0.10);
        alpha = 0.08 + 0.24 * Math.min(fadeIn, fadeOut);
      } else if (local >= 0.23 && local < 0.40) {
        drawProgress = 1;
        alpha = Math.max(0, 0.08 * (1 - (local - 0.23) / 0.17));
      }

      const breathe = prefersReducedMotion ? 1 : 0.94 + Math.sin(elapsed * 0.8 + hex.phase * 5) * 0.06;
      drawHex(hex, drawProgress, alpha * breathe);
    }

    if (running && !prefersReducedMotion) {
      raf = requestAnimationFrame(render);
    }
  };

  rebuild();

  const resizeObserver = new ResizeObserver(() => {
    rebuild();
    if (!running || prefersReducedMotion) render(performance.now());
  });
  resizeObserver.observe(section);

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        if (!running) {
          running = true;
          startTime = performance.now();
          if (prefersReducedMotion) render(startTime);
          else raf = requestAnimationFrame(render);
        }
      } else {
        running = false;
        cancelAnimationFrame(raf);
      }
    },
    { threshold: 0.08 },
  );
  visibilityObserver.observe(section);

  return () => {
    running = false;
    cancelAnimationFrame(raf);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    canvas.remove();
  };
}

export default function TeamProfilesGuard() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    const apply = () => {
      const section = document.querySelector<HTMLElement>(".team-section");
      if (!section || section.dataset.sbreTeamEnhanced === "true") return;

      section.dataset.sbreTeamEnhanced = "true";

      if (!section.querySelector(".team-royal-backdrop")) {
        const backdrop = document.createElement("div");
        backdrop.className = "team-royal-backdrop";
        backdrop.setAttribute("aria-hidden", "true");
        backdrop.innerHTML = `
          <span class="team-royal-glow team-royal-glow-a"></span>
          <span class="team-royal-glow team-royal-glow-b"></span>
          <span class="team-royal-diamond team-royal-diamond-a"></span>
          <span class="team-royal-diamond team-royal-diamond-b"></span>
          <span class="team-royal-diamond team-royal-diamond-c"></span>
          <span class="team-royal-diamond team-royal-diamond-d"></span>
          <span class="team-royal-orbit team-royal-orbit-a"></span>
          <span class="team-royal-orbit team-royal-orbit-b"></span>
        `;
        section.prepend(backdrop);
      }

      cleanups.push(createHexWave(section));

      const intro = section.querySelector<HTMLElement>(".section-heading > p:last-child");
      if (intro) {
        intro.textContent =
          "Soufiane SBRE, Yannick Müller et Zayd Haidar assurent le cadrage, la coordination et le suivi terrain de vos opérations.";
      }

      const grid = section.querySelector<HTMLElement>(".team-grid");
      if (grid && !grid.querySelector(".team-link-network")) {
        const network = document.createElement("div");
        network.className = "team-link-network";
        network.setAttribute("aria-hidden", "true");
        network.innerHTML = `
          <span class="team-link-line team-link-line-a"></span>
          <span class="team-link-line team-link-line-b"></span>
          <span class="team-link-node team-link-node-a"></span>
          <span class="team-link-node team-link-node-b"></span>
          <span class="team-link-node team-link-node-c"></span>
        `;
        grid.prepend(network);
      }

      const cards = Array.from(section.querySelectorAll<HTMLElement>(".team-card"));
      cards.forEach((card, index) => {
        const profile = profiles[index];
        if (!profile) return;

        const img = card.querySelector<HTMLImageElement>("img");
        const name = card.querySelector<HTMLElement>("h3");
        const role = card.querySelector<HTMLElement>(".team-role");
        const description = card.querySelector<HTMLElement>("p:last-child");

        if (img) {
          if (profile.image) img.src = profile.image;
          img.alt = profile.alt;
        }
        if (name) name.textContent = profile.name;
        if (role) role.textContent = profile.role;
        if (description) description.textContent = profile.description;

        card.querySelector(".provisional")?.remove();
        card.dataset.teamIndex = String(index + 1).padStart(2, "0");

        const move = (event: PointerEvent) => {
          if (matchMedia("(max-width: 900px), (prefers-reduced-motion: reduce)").matches) return;
          const rect = card.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width;
          const py = (event.clientY - rect.top) / rect.height;
          const rx = (0.5 - py) * 8;
          const ry = (px - 0.5) * 10;
          card.style.setProperty("--team-rx", `${rx.toFixed(2)}deg`);
          card.style.setProperty("--team-ry", `${ry.toFixed(2)}deg`);
          card.style.setProperty("--team-mx", `${(px * 100).toFixed(1)}%`);
          card.style.setProperty("--team-my", `${(py * 100).toFixed(1)}%`);
        };
        const leave = () => {
          card.style.setProperty("--team-rx", "0deg");
          card.style.setProperty("--team-ry", "0deg");
          card.style.setProperty("--team-mx", "50%");
          card.style.setProperty("--team-my", "35%");
        };

        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });

      const reveal = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            section.classList.add("team-3d-ready");
            reveal.disconnect();
          }
        },
        { threshold: 0.22 },
      );
      reveal.observe(section);
      cleanups.push(() => reveal.disconnect());

      section.querySelector(".team-note")?.remove();
    };

    apply();

    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
