import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PublicWorksScene({ phase = 3, onFailure }: { phase?: number; onFailure: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const redraw = useRef<() => void>(() => {});
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => redraw.current(), [phase]);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      onFailure();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 140);
    camera.position.set(15.5, 11.8, 18.5);
    camera.lookAt(0, 0.9, 0);

    const works = new THREE.Group();
    scene.add(works);

    const mat = {
      soil: new THREE.MeshStandardMaterial({ color: "#856445", roughness: 1 }),
      subbase: new THREE.MeshStandardMaterial({ color: "#aaa79e", roughness: 1 }),
      gravel: new THREE.MeshStandardMaterial({ color: "#8f928f", roughness: 1 }),
      asphalt: new THREE.MeshStandardMaterial({ color: "#33393a", roughness: 0.92 }),
      curb: new THREE.MeshStandardMaterial({ color: "#d6d2c8", roughness: 0.88 }),
      sidewalk: new THREE.MeshStandardMaterial({ color: "#bbb6a8", roughness: 0.9 }),
      white: new THREE.MeshStandardMaterial({ color: "#f6f1e6", roughness: 0.62 }),
      yellow: new THREE.MeshStandardMaterial({ color: "#f2c34c", roughness: 0.62 }),
      orange: new THREE.MeshStandardMaterial({ color: "#e27a3d", roughness: 0.66 }),
      dark: new THREE.MeshStandardMaterial({ color: "#1d2c29", roughness: 0.4, metalness: 0.32 }),
      pole: new THREE.MeshStandardMaterial({ color: "#5c6661", roughness: 0.44, metalness: 0.48 }),
      grass: new THREE.MeshStandardMaterial({ color: "#4e8057", roughness: 1 }),
      foliage: new THREE.MeshStandardMaterial({ color: "#3f724e", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#6d4e34", roughness: 1 }),
      skin: new THREE.MeshStandardMaterial({ color: "#d6a17a", roughness: 0.8 }),
      red: new THREE.MeshStandardMaterial({ color: "#cf554b", roughness: 0.7 }),
      blue: new THREE.MeshStandardMaterial({ color: "#4e86c6", roughness: 0.7 }),
      green: new THREE.MeshStandardMaterial({ color: "#4f8a59", roughness: 0.92 }),
      wood: new THREE.MeshStandardMaterial({ color: "#9b6b48", roughness: 0.78 }),
    };

    const groups = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
    groups.forEach((g) => {
      g.scale.y = 0.001;
      g.visible = false;
      works.add(g);
    });

    const box = (g: THREE.Group, x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material, rotY = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      m.position.set(x, y, z);
      m.rotation.y = rotY;
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    };
    const cylinder = (g: THREE.Group, x: number, y: number, z: number, r: number, h: number, material: THREE.Material, segments = 20) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    };
    const sphere = (g: THREE.Group, x: number, y: number, z: number, r: number, material: THREE.Material) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      g.add(m);
      return m;
    };
    const person = (g: THREE.Group, x: number, z: number, shirt: THREE.Material, scale = 1) => {
      const p = new THREE.Group();
      p.position.set(x, 0.35, z);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.12 * scale, 0.34 * scale, 4, 10), shirt);
      body.position.y = 0.38 * scale;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 12, 10), mat.skin);
      head.position.y = 0.78 * scale;
      const legGeo = new THREE.CylinderGeometry(0.034 * scale, 0.034 * scale, 0.38 * scale, 8);
      const leg1 = new THREE.Mesh(legGeo, mat.dark);
      const leg2 = leg1.clone();
      leg1.position.set(-0.07 * scale, 0.04, 0);
      leg2.position.set(0.07 * scale, 0.04, 0);
      p.add(body, head, leg1, leg2);
      g.add(p);
      return p;
    };
    const tree = (g: THREE.Group, x: number, z: number, s = 1) => {
      cylinder(g, x, 0.65 * s, z, 0.08 * s, 1.3 * s, mat.trunk, 10);
      sphere(g, x, 1.45 * s, z, 0.48 * s, mat.foliage);
      sphere(g, x + 0.28 * s, 1.35 * s, z + 0.06 * s, 0.3 * s, mat.foliage);
      sphere(g, x - 0.24 * s, 1.34 * s, z - 0.08 * s, 0.28 * s, mat.foliage);
    };

    // 01 — Terrassement / réseaux enterrés.
    box(groups[0], 0, -0.24, 0, 14.8, 0.42, 8.4, mat.soil);
    box(groups[0], 0, -0.02, 0, 11.6, 0.18, 5.3, mat.subbase);
    box(groups[0], -4.6, 0.08, 0.1, 1.0, 0.35, 4.4, mat.soil);
    for (let i = 0; i < 3; i++) {
      const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.2, 14), i === 0 ? mat.orange : mat.dark);
      duct.rotation.x = Math.PI / 2;
      duct.position.set(-4.8 + i * 0.22, 0.1, 0.1);
      groups[0].add(duct);
    }

    // 02 — Structure de chaussée / bordures / drainage.
    box(groups[1], 0, 0.12, 0, 11.8, 0.28, 5.4, mat.gravel);
    box(groups[1], 0, 0.28, 0, 10.6, 0.08, 4.3, mat.subbase);
    box(groups[1], 0, 0.36, -2.55, 12.2, 0.18, 0.26, mat.curb);
    box(groups[1], 0, 0.36, 2.55, 12.2, 0.18, 0.26, mat.curb);
    box(groups[1], 0, 0.34, -3.3, 12.5, 0.14, 1.2, mat.sidewalk);
    box(groups[1], 0, 0.34, 3.3, 12.5, 0.14, 1.2, mat.sidewalk);
    for (const x of [-4.2, -1.4, 1.4, 4.2]) {
      box(groups[1], x, 0.47, -2.42, 0.55, 0.04, 0.2, mat.dark);
      box(groups[1], x, 0.47, 2.42, 0.55, 0.04, 0.2, mat.dark);
    }

    // 03 — Revêtement / marquage / éclairage public.
    box(groups[2], 0, 0.46, 0, 10.6, 0.16, 4.3, mat.asphalt);
    for (let x = -4.7; x <= 4.7; x += 1.45) box(groups[2], x, 0.56, 0, 0.72, 0.025, 0.08, mat.white);
    box(groups[2], 0, 0.56, -1.95, 10.1, 0.025, 0.09, mat.white);
    box(groups[2], 0, 0.56, 1.95, 10.1, 0.025, 0.09, mat.white);
    for (let i = 0; i < 7; i++) box(groups[2], 3.8, 0.565, -1.25 + i * 0.42, 1.1, 0.025, 0.18, mat.white);
    for (const x of [-4.6, -1.5, 1.6, 4.7]) {
      cylinder(groups[2], x, 1.7, -3.75, 0.055, 2.8, mat.pole, 12);
      box(groups[2], x + 0.22, 3.02, -3.75, 0.48, 0.06, 0.08, mat.dark);
      cylinder(groups[2], x, 1.7, 3.75, 0.055, 2.8, mat.pole, 12);
      box(groups[2], x - 0.22, 3.02, 3.75, 0.48, 0.06, 0.08, mat.dark);
    }
    for (let x = -5.2; x <= 5.2; x += 1.3) cylinder(groups[2], x, 0.72, 4.15, 0.055, 0.7, mat.dark, 12);

    // 04 — Aménagement final vivant.
    box(groups[3], 0, 0.28, -4.65, 13.0, 0.12, 1.5, mat.grass);
    box(groups[3], 0, 0.28, 4.65, 13.0, 0.12, 1.5, mat.grass);
    for (const x of [-5.1, -2.4, 0.4, 3.1, 5.2]) {
      tree(groups[3], x, -4.7, 0.8);
      tree(groups[3], x - 0.35, 4.75, 0.75);
    }
    for (const x of [-3.2, 2.5]) {
      box(groups[3], x, 0.55, 4.35, 1.25, 0.12, 0.45, mat.wood);
      box(groups[3], x, 0.86, 4.55, 1.25, 0.55, 0.08, mat.dark);
    }
    for (const x of [-1.2, 4.2]) {
      box(groups[3], x, 0.42, -4.1, 1.8, 0.3, 0.7, mat.curb);
      box(groups[3], x, 0.62, -4.1, 1.55, 0.15, 0.5, mat.green);
    }

    const walkers = [
      person(groups[3], -4.4, 3.15, mat.blue, 0.95),
      person(groups[3], -0.8, -3.15, mat.red, 0.9),
      person(groups[3], 2.1, 3.05, mat.yellow, 0.85),
    ];
    const children = [
      person(groups[3], 4.4, -4.3, mat.yellow, 0.64),
      person(groups[3], 5.0, -4.0, mat.blue, 0.62),
    ];
    const ball = sphere(groups[3], 4.7, 0.48, -4.45, 0.18, mat.red);
    box(groups[3], 4.6, 0.33, -4.55, 2.6, 0.08, 1.4, mat.green);
    for (let i = 0; i < 5; i++) box(groups[3], 3.7 + i * 0.45, 0.43, -4.25, 0.28, 0.06, 0.4, mat.curb);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), new THREE.ShadowMaterial({ opacity: 0.2 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.46;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#fff5e7", "#41584d", 2.8));
    const sun = new THREE.DirectionalLight("#fff0d9", 4.1);
    sun.position.set(-9, 15, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15 });
    sun.shadow.bias = -0.002;
    scene.add(sun);

    const resize = () => {
      const w = container.clientWidth, h = container.clientHeight;
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
    let previous = performance.now();
    let angle = -0.32;
    let dragging = false;
    let lastX = 0;
    let dragVelocity = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      dragVelocity = 0;
      renderer.domElement.setPointerCapture?.(e.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const delta = dx * 0.008;
      angle += delta;
      dragVelocity = delta;
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      renderer.domElement.releasePointerCapture?.(e.pointerId);
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.addEventListener("pointerdown", down);
    renderer.domElement.addEventListener("pointermove", move);
    renderer.domElement.addEventListener("pointerup", up);
    renderer.domElement.addEventListener("pointercancel", up);

    const render = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      groups.forEach((g, i) => {
        const target = i <= phaseRef.current ? 1 : 0;
        const next = THREE.MathUtils.damp(g.scale.y, target, 8, dt);
        g.scale.y = Math.max(0.001, next);
        g.visible = next > 0.01;
        g.position.y = (1 - next) * -0.32;
      });

      if (!dragging) {
        angle += (0.032 + dragVelocity) * dt;
        dragVelocity = THREE.MathUtils.damp(dragVelocity, 0, 3.5, dt);
      }
      works.rotation.y = angle;
      works.position.y = 0.06 + Math.sin(now * 0.001) * 0.055;

      if (phaseRef.current === 3) {
        walkers.forEach((p, i) => {
          p.position.x += dt * (i % 2 === 0 ? 0.32 : -0.26);
          if (p.position.x > 5.4) p.position.x = -5.4;
          if (p.position.x < -5.4) p.position.x = 5.4;
          p.rotation.y = i % 2 === 0 ? Math.PI / 2 : -Math.PI / 2;
        });
        children.forEach((p, i) => {
          p.position.y = 0.35 + Math.sin(now * 0.004 + i * 1.4) * 0.025;
          p.rotation.y = Math.sin(now * 0.0018 + i) * 0.3;
        });
        ball.position.y = 0.48 + Math.abs(Math.sin(now * 0.003)) * 0.12;
      }

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
      else { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(container);
    const resume = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", resume);
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    start();

    return () => {
      redraw.current = () => {};
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", up);
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

  return <div ref={host} className="building-canvas" role="img" aria-label={`Travaux publics et aménagement routier en trois dimensions — phase ${phase + 1} sur 4`} />;
}
