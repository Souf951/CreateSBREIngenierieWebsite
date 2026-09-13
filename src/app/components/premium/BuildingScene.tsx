import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Procedural luxury villa scene used by the homepage construction phasing. */
export default function BuildingScene({
  phase = 3,
  onFailure,
}: {
  phase?: number;
  onFailure: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const redraw = useRef<() => void>(() => {});
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    redraw.current();
  }, [phase]);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      onFailure();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(14.5, 9.5, 18.5);
    camera.lookAt(0, 2.1, 0.4);

    const villa = new THREE.Group();
    scene.add(villa);

    const concrete = new THREE.MeshStandardMaterial({ color: "#dedbd1", roughness: 0.82 });
    const ivory = new THREE.MeshStandardMaterial({ color: "#f1efe7", roughness: 0.58 });
    const limestone = new THREE.MeshStandardMaterial({ color: "#c9bda7", roughness: 0.9 });
    const wood = new THREE.MeshStandardMaterial({ color: "#9c7650", roughness: 0.72 });
    const bronze = new THREE.MeshStandardMaterial({ color: "#56473b", roughness: 0.35, metalness: 0.55 });
    const darkFrame = new THREE.MeshStandardMaterial({ color: "#1d2f2b", roughness: 0.35, metalness: 0.55 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#8fb1a7",
      roughness: 0.08,
      metalness: 0.08,
      transmission: 0.18,
      transparent: true,
      opacity: 0.62,
    });
    const water = new THREE.MeshPhysicalMaterial({
      color: "#6aa5a1",
      roughness: 0.08,
      metalness: 0.05,
      transparent: true,
      opacity: 0.82,
    });
    const green = new THREE.MeshStandardMaterial({ color: "#365b49", roughness: 1 });

    const groups = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
    groups.forEach((g) => {
      g.scale.y = 0.001;
      g.visible = false;
      villa.add(g);
    });

    function box(
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
    ) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    }

    function cylinder(
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      r: number,
      h: number,
      mat: THREE.Material,
    ) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 28), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    }

    // 01 — Fondations / socle architectural
    box(groups[0], 0, -0.05, 0, 12.5, 0.24, 9, concrete);
    box(groups[0], -0.6, 0.18, -0.2, 9.5, 0.3, 6.2, limestone);
    box(groups[0], 4.4, 0.1, 1.8, 2.6, 0.18, 5.2, concrete);

    // 02 — Structure, two interlocking volumes + cantilever
    box(groups[1], -1.2, 1.55, -0.2, 7.8, 0.22, 5.5, concrete);
    box(groups[1], -4.8, 1.55, 1.5, 0.26, 2.65, 3.8, concrete);
    box(groups[1], 2.6, 1.55, -1.5, 0.26, 2.65, 2.6, concrete);
    for (const x of [-3.9, -1.5, 1.0, 3.3]) {
      box(groups[1], x, 1.5, 2.45, 0.18, 2.7, 0.18, concrete);
    }
    box(groups[1], 0.9, 3.15, -0.25, 8.6, 0.25, 5.7, concrete);
    box(groups[1], 1.65, 4.45, -0.2, 6.8, 2.45, 4.7, ivory);
    box(groups[1], -2.65, 4.45, 0.8, 0.25, 2.45, 3.2, concrete);
    box(groups[1], 5.05, 4.45, 0.2, 0.25, 2.45, 3.7, concrete);
    box(groups[1], 1.65, 5.78, -0.2, 7.4, 0.18, 5.1, darkFrame);

    // 03 — Enveloppe, premium glazing and stone/wood composition
    box(groups[2], -0.3, 1.65, 2.62, 8.7, 2.55, 0.08, glass);
    box(groups[2], 3.7, 1.65, 0.1, 0.08, 2.55, 5.1, glass);
    box(groups[2], 1.7, 4.45, 2.18, 6.3, 2.25, 0.08, glass);
    box(groups[2], 4.9, 4.45, -0.2, 0.08, 2.25, 4.4, glass);

    for (let x = -4.1; x <= 3.9; x += 1.16) {
      box(groups[2], x, 1.65, 2.67, 0.055, 2.65, 0.08, darkFrame);
    }
    for (let x = -1.2; x <= 4.6; x += 1.13) {
      box(groups[2], x, 4.45, 2.23, 0.055, 2.38, 0.08, darkFrame);
    }
    for (let z = -2.0; z <= 2.0; z += 1.0) {
      box(groups[2], 3.75, 1.65, z, 0.08, 2.65, 0.055, darkFrame);
      box(groups[2], 4.95, 4.45, z, 0.08, 2.38, 0.055, darkFrame);
    }

    // Large limestone feature wall on the rear wing
    box(groups[2], -4.35, 1.62, -0.55, 0.32, 2.5, 4.2, limestone);
    for (let i = 0; i < 14; i++) {
      box(groups[2], -4.5, 0.45 + i * 0.16, -0.55, 0.05, 0.045, 4.25, bronze);
    }

    // Vertical timber brise-soleil on upper floor
    for (let i = 0; i < 18; i++) {
      box(groups[2], -1.3 + i * 0.18, 4.45, -2.52, 0.06, 2.2, 0.12, wood);
    }

    // 04 — Finitions: infinity pool, deck, pergola, landscape, exterior details
    box(groups[3], -1.5, 0.36, 3.7, 5.4, 0.12, 2.0, wood);
    box(groups[3], 2.5, 0.33, 3.7, 2.4, 0.12, 2.0, limestone);
    box(groups[3], 4.3, 0.28, 1.6, 2.0, 0.18, 5.8, limestone);

    // Pool basin + water plane
    box(groups[3], -0.6, 0.17, -3.35, 6.8, 0.2, 1.65, concrete);
    box(groups[3], -0.6, 0.3, -3.35, 6.45, 0.08, 1.35, water);
    box(groups[3], -0.6, 0.29, -4.12, 6.8, 0.06, 0.12, glass);

    // Floating exterior steps
    for (let i = 0; i < 4; i++) {
      box(groups[3], 4.75, 0.18 + i * 0.11, 3.4 - i * 0.42, 1.5, 0.1, 0.34, concrete);
    }

    // Slim pergola over terrace
    for (const x of [-3.6, -1.8, 0]) {
      box(groups[3], x, 2.75, 3.5, 0.11, 2.25, 0.11, bronze);
    }
    box(groups[3], -1.8, 3.82, 3.5, 4.0, 0.12, 0.12, bronze);
    for (let i = 0; i < 10; i++) {
      box(groups[3], -3.6 + i * 0.4, 3.82, 3.5, 0.08, 0.08, 1.35, wood);
    }

    // Balcony edge and glass guard
    box(groups[3], 1.55, 3.22, 2.65, 7.2, 0.11, 0.45, limestone);
    box(groups[3], 1.55, 3.62, 2.82, 6.8, 0.72, 0.045, glass);
    for (let x = -1.55; x <= 4.7; x += 1.25) {
      box(groups[3], x, 3.62, 2.84, 0.045, 0.72, 0.05, darkFrame);
    }

    // Planters / greenery
    box(groups[3], -5.1, 0.28, -1.1, 0.7, 0.34, 4.8, limestone);
    box(groups[3], -5.1, 0.53, -1.1, 0.56, 0.18, 4.6, green);
    box(groups[3], 4.7, 0.34, -2.4, 2.0, 0.42, 0.65, limestone);
    box(groups[3], 4.7, 0.61, -2.4, 1.8, 0.18, 0.48, green);
    for (const [x, z, r] of [
      [-4.8, -2.4, 0.36],
      [4.8, -2.5, 0.34],
      [5.0, 2.8, 0.3],
    ] as const) {
      cylinder(groups[3], x, 1.05, z, r, 1.25, green);
    }

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.22 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#fff8e9", "#456653", 2.8));
    const sun = new THREE.DirectionalLight("#fff1d8", 4.4);
    sun.position.set(-7, 14, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -11, right: 11, top: 11, bottom: -11 });
    sun.shadow.bias = -0.002;
    scene.add(sun);

    const rim = new THREE.DirectionalLight("#b8d7cf", 1.1);
    rim.position.set(8, 7, -8);
    scene.add(rim);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      redraw.current();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let raf = 0;
    let visible = true;
    let previous = 0;
    let targetPointer = 0;
    let pointerOffset = 0;
    let rotationAngle = -0.28;

    const move = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetPointer = ((e.clientX - rect.left) / rect.width - 0.5) * 0.14;
    };
    const leave = () => {
      targetPointer = 0;
    };
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerleave", leave);

    const render = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      groups.forEach((g, i) => {
        const target = i <= phaseRef.current ? 1 : 0;
        const current = g.scale.y;
        const next = THREE.MathUtils.damp(current, target, 9, dt);
        g.scale.y = Math.max(0.001, next);
        g.visible = next > 0.01;
        g.position.y = (1 - next) * -0.3;
      });

      rotationAngle = (rotationAngle + dt * 0.045) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, targetPointer, 5, dt);
      villa.rotation.y = rotationAngle + pointerOffset;
      villa.position.y = 0.08 + Math.sin(now * 0.0012) * 0.085;
      villa.rotation.z = Math.sin(now * 0.00065) * 0.003;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    function start() {
      if (!raf && visible && !document.hidden) {
        previous = performance.now();
        raf = requestAnimationFrame(render);
      }
    }

    redraw.current = start;

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(container);

    const resume = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else start();
    };
    document.addEventListener("visibilitychange", resume);

    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    start();

    return () => {
      redraw.current = () => {};
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerleave", leave);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [onFailure]);

  return (
    <div
      ref={host}
      className="building-canvas"
      role="img"
      aria-label={`Villa contemporaine haut de gamme en trois dimensions — phase ${phase + 1} sur 4`}
    />
  );
}
