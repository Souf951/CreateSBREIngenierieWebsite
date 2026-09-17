import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const POINTS = 170;
const MOVING_POINTS = 11;

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
    let starTimer: number | undefined;

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

      const movingPoints: Array<{
        el: HTMLSpanElement;
        baseY: number;
        speed: number;
        offset: number;
        phase: number;
        yAmplitude: number;
        yFrequency: number;
        xWobble: number;
        xFrequency: number;
        driftBias: number;
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

      for (let index = 0; index < MOVING_POINTS; index += 1) {
        const movingPoint = document.createElement("span");
        movingPoint.className = "sbre-moving-point";

        const baseY = 10 + random() * 78;
        const size = 2.4 + random() * 3.2;
        const speed = 1.55 + random() * 2.35;
        const offset = random() * 132;
        const phase = random() * Math.PI * 2;
        const yAmplitude = 5 + random() * 16;
        const yFrequency = 0.18 + random() * 0.42;
        const xWobble = 0.6 + random() * 3.4;
        const xFrequency = 0.22 + random() * 0.48;
        const driftBias = -4 + random() * 8;

        movingPoint.style.top = `${baseY}%`;
        movingPoint.style.width = `${size}px`;
        movingPoint.style.height = `${size}px`;
        movingPoint.style.opacity = `${0.3 + random() * 0.3}`;

        layer.appendChild(movingPoint);
        movingPoints.push({
          el: movingPoint,
          baseY,
          speed,
          offset,
          phase,
          yAmplitude,
          yFrequency,
          xWobble,
          xFrequency,
          driftBias,
        });
      }

      header.prepend(layer);

      const launchShootingStar = () => {
        if (cancelled || !layer.isConnected) return;

        const star = document.createElement("span");
        star.className = "sbre-shooting-star";

        const startY = 12 + Math.random() * 54;
        const duration = 1250 + Math.random() * 650;
        const travelX = 112 + Math.random() * 18;
        const travelY = 18 + Math.random() * 22;
        const scale = 0.78 + Math.random() * 0.42;

        star.style.top = `${startY}%`;
        star.style.left = "-14%";
        star.style.setProperty("--star-scale", `${scale}`);
        layer.appendChild(star);

        const animation = star.animate(
          [
            {
              transform: `translate3d(0,0,0) rotate(-12deg) scale(${scale})`,
              opacity: 0,
            },
            {
              transform: `translate3d(10vw,${travelY * 0.08}px,0) rotate(-12deg) scale(${scale})`,
              opacity: 0.82,
              offset: 0.12,
            },
            {
              transform: `translate3d(${travelX}vw,${travelY}px,0) rotate(-12deg) scale(${scale})`,
              opacity: 0,
            },
          ],
          {
            duration,
            easing: "cubic-bezier(.18,.72,.24,1)",
            fill: "forwards",
          },
        );

        animation.finished
          .catch(() => undefined)
          .finally(() => star.remove());

        const nextDelay = 5200 + Math.random() * 7200;
        starTimer = window.setTimeout(launchShootingStar, nextDelay);
      };

      starTimer = window.setTimeout(launchShootingStar, 2600 + Math.random() * 2600);

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

        movingPoints.forEach(({
          el,
          baseY,
          speed,
          offset,
          phase,
          yAmplitude,
          yFrequency,
          xWobble,
          xFrequency,
          driftBias,
        }) => {
          const linearX = ((time * speed + offset) % 132) - 16;
          const horizontalCurve =
            Math.sin(time * xFrequency + phase) * xWobble +
            Math.sin(time * (xFrequency * 0.43) + phase * 1.7) * (xWobble * 0.48);

          const verticalCurve =
            Math.sin(time * yFrequency + phase) * yAmplitude +
            Math.cos(time * (yFrequency * 0.57) + phase * 0.72) * (yAmplitude * 0.36) +
            Math.sin((linearX + phase * 9) * 0.045) * driftBias;

          const y = Math.max(4, Math.min(94, baseY + verticalCurve));
          const x = linearX + horizontalCurve;
          const pulse = 0.82 + Math.sin(time * (0.72 + yFrequency) + phase) * 0.18;

          el.style.left = `${x}%`;
          el.style.top = `${y}%`;
          el.style.transform = `translate3d(0, 0, 0) scale(${pulse})`;
          el.style.filter = `brightness(${1.02 + pulse * 0.16})`;
          el.style.boxShadow = `0 0 ${7 + pulse * 5}px rgba(28, 109, 82, ${0.18 + pulse * 0.18}), 0 0 3px rgba(255,255,255,.45)`;
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
      if (starTimer) window.clearTimeout(starTimer);
      document.querySelector(".premium-site .site-header .sbre-point-cloud")?.remove();
    };
  }, [pathname]);

  return null;
}
