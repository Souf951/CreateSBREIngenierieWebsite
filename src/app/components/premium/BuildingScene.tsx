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
    renderer.toneMappingExposure = 1.28;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 120);
    camera.position.set(17, 11.5, 20.5);
    camera.lookAt(0, 2.4, 0.5);

    const villa = new THREE.Group();
    scene.add(villa);

    const mat = {
      concrete: new THREE.MeshStandardMaterial({ color: "#d9d7cf", roughness: 0.83 }),
      ivory: new THREE.MeshStandardMaterial({ color: "#f1efe8", roughness: 0.56 }),
      limestone: new THREE.MeshStandardMaterial({ color: "#cbbda4", roughness: 0.88 }),
      warmStone: new THREE.MeshStandardMaterial({ color: "#b89c7c", roughness: 0.86 }),
      wood: new THREE.MeshStandardMaterial({ color: "#9a6846", roughness: 0.7 }),
      bronze: new THREE.MeshStandardMaterial({ color: "#4e4035", roughness: 0.3, metalness: 0.6 }),
      dark: new THREE.MeshStandardMaterial({ color: "#172925", roughness: 0.34, metalness: 0.5 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#8fb3ab",
        roughness: 0.06,
        transmission: 0.22,
        transparent: true,
        opacity: 0.58,
      }),
      water: new THREE.MeshPhysicalMaterial({
        color: "#49b5d2",
        roughness: 0.05,
        transmission: 0.1,
        transparent: true,
        opacity: 0.84,
      }),
      lawn: new THREE.MeshStandardMaterial({ color: "#4d8c59", roughness: 1 }),
      hedge: new THREE.MeshStandardMaterial({ color: "#2f6b48", roughness: 1 }),
      foliage: new THREE.MeshStandardMaterial({ color: "#4e7e50", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#6d4e35", roughness: 1 }),
      whiteFabric: new THREE.MeshStandardMaterial({ color: "#f6f3ea", roughness: 0.95 }),
      coral: new THREE.MeshStandardMaterial({ color: "#e66d5a", roughness: 0.7 }),
      yellow: new THREE.MeshStandardMaterial({ color: "#f2c14e", roughness: 0.7 }),
      blue: new THREE.MeshStandardMaterial({ color: "#4b8ed8", roughness: 0.7 }),
      skin: new THREE.MeshStandardMaterial({ color: "#d4a078", roughness: 0.78 }),
    };

    const groups = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
    groups.forEach((g) => {
      g.scale.y = 0.001;
      g.visible = false;
      villa.add(g);
    });

    function box(g: THREE.Group, x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    }

    function cylinder(g: THREE.Group, x: number, y: number, z: number, r: number, h: number, material: THREE.Material, segments = 24) {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    }

    function sphere(g: THREE.Group, x: number, y: number, z: number, r: number, material: THREE.Material) {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      g.add(m);
      return m;
    }

    function person(parent: THREE.Group, x: number, y: number, z: number, shirt: THREE.Material, scale = 1) {
      const p = new THREE.Group();
      p.position.set(x, y, z);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.16 * scale, 0.32 * scale, 4, 10), shirt);
      body.position.y = 0.35 * scale;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.13 * scale, 14, 10), mat.skin);
      head.position.y = 0.72 * scale;
      const armGeo = new THREE.CylinderGeometry(0.035 * scale, 0.035 * scale, 0.34 * scale, 10);
      const arm1 = new THREE.Mesh(armGeo, mat.skin);
      const arm2 = arm1.clone();
      arm1.rotation.z = 0.95;
      arm2.rotation.z = -0.95;
      arm1.position.set(-0.2 * scale, 0.42 * scale, 0);
      arm2.position.set(0.2 * scale, 0.42 * scale, 0);
      p.add(body, head, arm1, arm2);
      p.traverse((o) => {
        if (o instanceof THREE.Mesh) o.castShadow = true;
      });
      parent.add(p);
      return p;
    }

    function tree(g: THREE.Group, x: number, z: number, s = 1) {
      cylinder(g, x, 0.72 * s, z, 0.09 * s, 1.4 * s, mat.trunk, 12);
      sphere(g, x, 1.55 * s, z, 0.55 * s, mat.foliage);
      sphere(g, x + 0.3 * s, 1.45 * s, z + 0.12 * s, 0.38 * s, mat.foliage);
      sphere(g, x - 0.28 * s, 1.4 * s, z - 0.08 * s, 0.34 * s, mat.foliage);
    }

    // 01 — Foundations: generous plot, retaining slab and stepped plinth.
    box(groups[0], 0, -0.16, 0, 15.2, 0.28, 11.6, mat.concrete);
    box(groups[0], -0.6, 0.05, -0.35, 10.8, 0.22, 7.0, mat.limestone);
    box(groups[0], 4.9, 0.0, 0.8, 3.8, 0.18, 7.4, mat.concrete);

    // 02 — Structure: cleaner aligned walls, continuous slabs and cantilever.
    box(groups[1], -0.5, 1.55, -0.25, 9.2, 0.24, 6.0, mat.concrete);
    box(groups[1], -5.0, 1.56, 0.1, 0.3, 2.72, 5.3, mat.concrete);
    box(groups[1], 4.0, 1.56, -0.65, 0.3, 2.72, 3.85, mat.concrete);
    box(groups[1], -0.5, 2.94, -0.25, 9.3, 0.24, 6.05, mat.concrete);
    for (const x of [-4.2, -1.6, 1.2, 3.2]) box(groups[1], x, 1.48, 2.66, 0.19, 2.7, 0.19, mat.concrete);

    box(groups[1], 1.05, 4.35, -0.35, 7.55, 2.55, 4.9, mat.ivory);
    box(groups[1], -3.15, 4.35, 0.45, 0.3, 2.55, 3.4, mat.concrete);
    box(groups[1], 4.78, 4.35, -0.15, 0.3, 2.55, 4.3, mat.concrete);
    box(groups[1], 1.05, 5.72, -0.35, 8.0, 0.18, 5.35, mat.dark);

    // 03 — Envelope: coherent facade composition.
    box(groups[2], -0.28, 1.55, 2.78, 8.9, 2.58, 0.08, mat.glass);
    for (let x = -4.3; x <= 4.0; x += 1.03) box(groups[2], x, 1.55, 2.82, 0.055, 2.65, 0.09, mat.dark);
    box(groups[2], 3.96, 1.55, -0.2, 0.08, 2.58, 5.2, mat.glass);
    for (let z = -2.45; z <= 2.3; z += 0.95) box(groups[2], 4.01, 1.55, z, 0.09, 2.65, 0.055, mat.dark);

    box(groups[2], 1.08, 4.35, 2.12, 7.15, 2.26, 0.08, mat.glass);
    for (let x = -2.1; x <= 4.2; x += 1.02) box(groups[2], x, 4.35, 2.16, 0.055, 2.36, 0.09, mat.dark);
    box(groups[2], 4.75, 4.35, -0.3, 0.08, 2.26, 4.5, mat.glass);
    for (let z = -2.15; z <= 1.75; z += 0.9) box(groups[2], 4.79, 4.35, z, 0.09, 2.36, 0.055, mat.dark);

    box(groups[2], -4.78, 1.52, -0.5, 0.35, 2.58, 4.35, mat.warmStone);
    for (let i = 0; i < 17; i++) box(groups[2], -4.98, 0.34 + i * 0.16, -0.5, 0.04, 0.04, 4.4, mat.bronze);
    for (let i = 0; i < 19; i++) box(groups[2], -2.55 + i * 0.17, 4.35, -2.72, 0.055, 2.18, 0.12, mat.wood);

    // 04 — Finishes: garden, infinity pool, furniture, landscaping and family life.
    // lawn plates
    box(groups[3], -4.35, 0.17, -3.9, 5.7, 0.12, 2.5, mat.lawn);
    box(groups[3], 4.8, 0.17, 3.2, 4.1, 0.12, 3.5, mat.lawn);
    box(groups[3], 5.35, 0.17, -3.15, 2.6, 0.12, 3.4, mat.lawn);

    // terraces
    box(groups[3], -2.0, 0.32, 3.65, 5.8, 0.14, 2.2, mat.wood);
    box(groups[3], 2.55, 0.30, 3.65, 2.5, 0.14, 2.2, mat.limestone);
    box(groups[3], 4.65, 0.26, 0.8, 2.3, 0.15, 6.0, mat.limestone);

    // infinity pool with stone coping
    box(groups[3], -0.7, 0.15, -3.6, 7.25, 0.24, 2.45, mat.concrete);
    box(groups[3], -0.7, 0.29, -3.6, 6.82, 0.07, 2.04, mat.water);
    box(groups[3], -0.7, 0.3, -4.63, 7.0, 0.07, 0.12, mat.glass);
    box(groups[3], -4.38, 0.31, -3.6, 0.12, 0.12, 2.25, mat.limestone);
    box(groups[3], 2.98, 0.31, -3.6, 0.12, 0.12, 2.25, mat.limestone);

    // children playing in pool — intentionally stylised, architectural-scale figures.
    const childA = person(groups[3], -1.55, 0.28, -3.45, mat.coral, 0.72);
    const childB = person(groups[3], 0.25, 0.28, -3.75, mat.yellow, 0.68);
    const childC = person(groups[3], 1.45, 0.28, -3.35, mat.blue, 0.64);
    const childFigures = [childA, childB, childC];

    // colourful pool toys
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.08, 10, 24), mat.yellow);
    ring.rotation.x = Math.PI / 2;
    ring.position.set(-0.3, 0.38, -3.05);
    ring.castShadow = true;
    groups[3].add(ring);
    sphere(groups[3], 1.9, 0.44, -4.0, 0.22, mat.coral);

    // pergola with aligned posts and timber rafters
    for (const x of [-3.8, -1.9, 0.0]) box(groups[3], x, 1.55, 3.5, 0.11, 2.45, 0.11, mat.bronze);
    box(groups[3], -1.9, 2.78, 3.5, 4.05, 0.12, 0.12, mat.bronze);
    for (let i = 0; i < 11; i++) box(groups[3], -3.78 + i * 0.38, 2.78, 3.5, 0.07, 0.07, 1.55, mat.wood);

    // outdoor lounge furniture
    box(groups[3], -3.0, 0.52, 3.9, 1.45, 0.22, 0.72, mat.whiteFabric);
    box(groups[3], -3.0, 0.85, 4.22, 1.45, 0.55, 0.18, mat.whiteFabric);
    box(groups[3], -1.1, 0.52, 3.9, 1.45, 0.22, 0.72, mat.whiteFabric);
    cylinder(groups[3], -2.05, 0.48, 3.1, 0.42, 0.08, mat.bronze, 32);

    // balcony and frameless guard
    box(groups[3], 1.25, 3.03, 2.62, 7.35, 0.12, 0.48, mat.limestone);
    box(groups[3], 1.25, 3.42, 2.83, 7.0, 0.72, 0.045, mat.glass);
    for (let x = -1.95; x <= 4.35; x += 1.28) box(groups[3], x, 3.42, 2.85, 0.04, 0.72, 0.05, mat.dark);

    // planters and clipped hedges
    box(groups[3], -5.55, 0.3, -0.2, 0.75, 0.36, 5.6, mat.limestone);
    box(groups[3], -5.55, 0.58, -0.2, 0.6, 0.26, 5.35, mat.hedge);
    box(groups[3], 5.65, 0.3, -1.85, 2.5, 0.36, 0.72, mat.limestone);
    box(groups[3], 5.65, 0.58, -1.85, 2.25, 0.26, 0.52, mat.hedge);

    tree(groups[3], -5.55, -4.45, 1.05);
    tree(groups[3], 5.75, 4.35, 1.12);
    tree(groups[3], 6.15, -3.65, 0.9);
    tree(groups[3], 4.45, 4.65, 0.72);

    // stepping stones through lawn
    for (let i = 0; i < 5; i++) box(groups[3], 4.45 + i * 0.42, 0.26, 2.0 - i * 0.52, 0.5, 0.08, 0.32, mat.limestone);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.2 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.22;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#fff7e8", "#466755", 2.7));
    const sun = new THREE.DirectionalLight("#ffe9cb", 4.2);
    sun.position.set(-8, 15, 9);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -12, right: 12, top: 12, bottom: -12 });
    sun.shadow.bias = -0.002;
    scene.add(sun);

    const rim = new THREE.DirectionalLight("#b9d9d2", 1.25);
    rim.position.set(9, 8, -10);
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
    let rotationAngle = -0.38;

    const move = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetPointer = ((e.clientX - rect.left) / rect.width - 0.5) * 0.15;
    };
    const leave = () => { targetPointer = 0; };
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerleave", leave);

    const render = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      groups.forEach((g, i) => {
        const target = i <= phaseRef.current ? 1 : 0;
        const next = THREE.MathUtils.damp(g.scale.y, target, 9, dt);
        g.scale.y = Math.max(0.001, next);
        g.visible = next > 0.01;
        g.position.y = (1 - next) * -0.32;
      });

      rotationAngle = (rotationAngle + dt * 0.038) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, targetPointer, 5, dt);
      villa.rotation.y = rotationAngle + pointerOffset;
      villa.position.y = 0.08 + Math.sin(now * 0.00115) * 0.08;
      villa.rotation.z = Math.sin(now * 0.00062) * 0.0025;

      if (phaseRef.current === 3) {
        childFigures.forEach((child, i) => {
          child.position.y = 0.28 + Math.sin(now * 0.004 + i * 1.8) * 0.035;
          child.rotation.y = Math.sin(now * 0.0017 + i) * 0.22;
        });
        ring.rotation.z = Math.sin(now * 0.0015) * 0.08;
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
      aria-label={`Villa contemporaine haut de gamme avec jardin et piscine en trois dimensions — phase ${phase + 1} sur 4`}
    />
  );
}
