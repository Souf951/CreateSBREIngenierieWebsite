import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BuildingSceneV2({
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
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 120);
    camera.position.set(17.5, 10.2, 21.5);
    camera.lookAt(0, 2.65, 0.25);

    const villa = new THREE.Group();
    villa.scale.setScalar(0.9);
    scene.add(villa);

    const mat = {
      concrete: new THREE.MeshStandardMaterial({ color: "#d8d0c3", roughness: 0.82 }),
      render: new THREE.MeshStandardMaterial({ color: "#eee7dc", roughness: 0.78 }),
      stone: new THREE.MeshStandardMaterial({ color: "#b8a48d", roughness: 0.92 }),
      stoneDark: new THREE.MeshStandardMaterial({ color: "#7f7568", roughness: 0.92 }),
      aluminum: new THREE.MeshStandardMaterial({ color: "#1e2927", roughness: 0.26, metalness: 0.7 }),
      wood: new THREE.MeshStandardMaterial({ color: "#9a6845", roughness: 0.68 }),
      woodDark: new THREE.MeshStandardMaterial({ color: "#674431", roughness: 0.75 }),
      interiorWall: new THREE.MeshStandardMaterial({ color: "#d9c3aa", roughness: 0.86 }),
      interiorFloor: new THREE.MeshStandardMaterial({ color: "#8f6e53", roughness: 0.78 }),
      accent: new THREE.MeshStandardMaterial({ color: "#6e7d58", roughness: 0.85 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#9ab8b6",
        roughness: 0.05,
        transmission: 0.34,
        transparent: true,
        opacity: 0.5,
        metalness: 0.04,
        side: THREE.DoubleSide,
      }),
      railGlass: new THREE.MeshPhysicalMaterial({
        color: "#a9c4c3",
        roughness: 0.04,
        transmission: 0.42,
        transparent: true,
        opacity: 0.36,
        side: THREE.DoubleSide,
      }),
      lawn: new THREE.MeshStandardMaterial({ color: "#536f47", roughness: 1 }),
      hedge: new THREE.MeshStandardMaterial({ color: "#2f5439", roughness: 1 }),
      foliage: new THREE.MeshStandardMaterial({ color: "#446b45", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#6e513a", roughness: 1 }),
      water: new THREE.MeshPhysicalMaterial({ color: "#4d9eab", roughness: 0.04, transmission: 0.18, transparent: true, opacity: 0.8 }),
      fabric: new THREE.MeshStandardMaterial({ color: "#d7c9b8", roughness: 0.94 }),
      darkFabric: new THREE.MeshStandardMaterial({ color: "#4f5f57", roughness: 0.9 }),
      skin: new THREE.MeshStandardMaterial({ color: "#c88e6d", roughness: 0.82 }),
      shirt: new THREE.MeshStandardMaterial({ color: "#334852", roughness: 0.8 }),
    };

    const groups = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
    groups.forEach((g) => {
      g.scale.y = 0.001;
      g.visible = false;
      villa.add(g);
    });

    const box = (
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      material: THREE.Material,
      rotY = 0,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    };

    const cylinder = (g: THREE.Group, x: number, y: number, z: number, r: number, h: number, material: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    };

    const sphere = (g: THREE.Group, x: number, y: number, z: number, r: number, material: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      g.add(mesh);
      return mesh;
    };

    const glassWall = (g: THREE.Group, x: number, y: number, z: number, w: number, h: number, bays: number) => {
      box(g, x, y, z, w, h, 0.07, mat.glass);
      for (let i = 0; i <= bays; i++) {
        const xx = x - w / 2 + (w * i) / bays;
        box(g, xx, y, z + 0.018, 0.055, h + 0.05, 0.065, mat.aluminum);
      }
      box(g, x, y + h / 2, z + 0.018, w, 0.055, 0.065, mat.aluminum);
      box(g, x, y - h / 2, z + 0.018, w, 0.055, 0.065, mat.aluminum);
    };

    const glassRail = (g: THREE.Group, x: number, y: number, z: number, w: number) => {
      box(g, x, y, z, w, 0.68, 0.035, mat.railGlass);
      box(g, x, y + 0.35, z, w, 0.035, 0.055, mat.aluminum);
      const bays = Math.max(3, Math.round(w / 1.5));
      for (let i = 0; i <= bays; i++) {
        box(g, x - w / 2 + (w * i) / bays, y, z, 0.03, 0.72, 0.04, mat.aluminum);
      }
    };

    const tree = (g: THREE.Group, x: number, z: number, s = 1) => {
      cylinder(g, x, 0.62 * s, z, 0.08 * s, 1.2 * s, mat.trunk);
      sphere(g, x, 1.45 * s, z, 0.48 * s, mat.foliage);
      sphere(g, x + 0.28 * s, 1.38 * s, z + 0.1 * s, 0.31 * s, mat.foliage);
      sphere(g, x - 0.24 * s, 1.34 * s, z - 0.08 * s, 0.3 * s, mat.foliage);
    };

    const person = (g: THREE.Group, x: number, y: number, z: number, scale = 1) => {
      const p = new THREE.Group();
      p.position.set(x, y, z);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.11 * scale, 0.28 * scale, 4, 8), mat.shirt);
      body.position.y = 0.34 * scale;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.1 * scale, 12, 8), mat.skin);
      head.position.y = 0.68 * scale;
      p.add(body, head);
      g.add(p);
      return p;
    };

    // 01 — foundations
    box(groups[0], 0, -0.2, 0, 15.6, 0.28, 11.3, mat.stoneDark);
    box(groups[0], -0.35, 0, 0.1, 11.8, 0.28, 7.4, mat.concrete);
    box(groups[0], 5.1, 0, 0.2, 3.0, 0.24, 7.8, mat.concrete);
    for (const x of [-4.6, -1.6, 1.4, 4.2]) {
      box(groups[0], x, -0.55, 1.9, 0.52, 0.75, 0.52, mat.stoneDark);
      box(groups[0], x, -0.55, -2.0, 0.52, 0.75, 0.52, mat.stoneDark);
    }

    // 02 — structure: levels follow one structural grid so walls, slabs and windows line up.
    const level1 = 1.48;
    const level2 = 3.08;
    const roof = 4.68;
    box(groups[1], -0.55, level1, -0.05, 10.9, 0.22, 6.3, mat.concrete);
    box(groups[1], -0.25, level2, -0.05, 10.3, 0.22, 6.15, mat.concrete);
    box(groups[1], 0.15, roof, -0.05, 9.7, 0.22, 5.95, mat.render);

    // aligned side/rear structural walls
    box(groups[1], -5.15, 2.22, -0.15, 0.34, 4.95, 5.9, mat.concrete);
    box(groups[1], 4.85, 2.22, -0.15, 0.34, 4.95, 5.9, mat.render);
    box(groups[1], -0.15, 2.22, -2.9, 9.75, 4.95, 0.34, mat.stone);
    for (const x of [-4.15, -1.35, 1.45, 4.05]) {
      box(groups[1], x, 1.5, 2.72, 0.16, 2.78, 0.16, mat.concrete);
      box(groups[1], x, 3.1, 2.72, 0.16, 1.38, 0.16, mat.render);
    }

    // 03 — envelope: exactly aligned glazing bays by floor.
    glassWall(groups[2], -0.55, 1.55, 2.79, 9.1, 2.52, 6);
    glassWall(groups[2], -0.25, 3.62, 2.79, 8.45, 1.82, 6);

    // solid bands make the façade legible and remove the "floating" window effect.
    box(groups[2], -0.55, 0.26, 2.82, 9.2, 0.32, 0.18, mat.stone);
    box(groups[2], -0.25, 2.64, 2.82, 8.55, 0.28, 0.18, mat.woodDark);
    box(groups[2], -0.25, 4.58, 2.82, 8.55, 0.24, 0.18, mat.render);

    // warmer lateral cladding and architectural blades
    box(groups[2], -5.02, 2.2, -0.6, 0.36, 4.75, 4.45, mat.stone);
    box(groups[2], 4.72, 2.12, 0.15, 0.36, 4.6, 4.8, mat.render);
    box(groups[2], 3.45, 3.62, 2.85, 0.95, 1.82, 0.16, mat.wood);
    for (let x = -3.85; x <= -1.2; x += 0.34) {
      box(groups[2], x, 4.95, -2.88, 0.085, 1.35, 0.18, mat.wood);
    }

    // Interior visible behind the glass: warm floors, partitions, cabinetry and furniture.
    box(groups[2], -0.6, 0.35, 1.2, 8.6, 0.08, 3.1, mat.interiorFloor);
    box(groups[2], -0.2, 2.72, 1.15, 7.9, 0.08, 3.0, mat.interiorFloor);
    box(groups[2], -3.25, 1.55, 0.25, 0.12, 2.3, 2.0, mat.interiorWall);
    box(groups[2], 1.45, 1.55, 0.1, 0.12, 2.3, 1.8, mat.accent);
    box(groups[2], -1.55, 1.0, 0.55, 2.2, 0.72, 0.55, mat.woodDark);
    box(groups[2], 2.15, 0.68, 1.1, 1.8, 0.28, 0.75, mat.fabric);
    box(groups[2], 2.15, 1.05, 0.75, 1.8, 0.72, 0.18, mat.darkFabric);
    cylinder(groups[2], -0.1, 0.75, 1.35, 0.48, 0.08, mat.stoneDark);
    box(groups[2], -1.95, 3.2, 0.4, 2.2, 0.7, 0.5, mat.wood);
    box(groups[2], 2.15, 3.25, 0.55, 1.6, 0.25, 0.65, mat.fabric);

    // 04 — finishes / garden / terraces
    box(groups[3], -3.85, 0.16, 3.95, 6.2, 0.12, 2.45, mat.lawn);
    box(groups[3], 3.45, 0.16, 3.85, 5.3, 0.12, 2.65, mat.lawn);
    box(groups[3], -3.9, 0.16, -4.0, 5.8, 0.12, 2.2, mat.lawn);
    box(groups[3], -0.55, 0.27, 3.38, 7.6, 0.12, 1.3, mat.stone);
    box(groups[3], 4.58, 0.26, 0.25, 2.0, 0.12, 6.9, mat.stone);
    box(groups[3], 0.4, 3.18, 3.02, 7.25, 0.12, 1.05, mat.wood);
    glassRail(groups[3], 0.4, 3.55, 3.52, 7.25);

    box(groups[3], -1.85, 0.15, -4.0, 6.1, 0.2, 1.65, mat.concrete);
    box(groups[3], -1.85, 0.28, -4.0, 5.72, 0.05, 1.32, mat.water);
    box(groups[3], 1.65, 0.28, -4.0, 1.25, 0.1, 1.55, mat.wood);

    box(groups[3], -2.8, 0.46, 3.65, 1.5, 0.22, 0.72, mat.fabric);
    box(groups[3], -2.8, 0.76, 3.92, 1.5, 0.5, 0.16, mat.darkFabric);
    box(groups[3], -0.8, 0.46, 3.65, 1.5, 0.22, 0.72, mat.fabric);
    cylinder(groups[3], -1.8, 0.43, 3.05, 0.38, 0.07, mat.darkFabric);

    for (const x of [-1.0, 1.0, 3.0]) box(groups[3], x, 5.05, 3.45, 0.1, 0.9, 0.1, mat.aluminum);
    for (let i = 0; i < 9; i++) box(groups[3], -0.9 + i * 0.5, 5.5, 3.05, 0.06, 0.06, 1.15, mat.wood);

    box(groups[3], -6.0, 0.42, 0.3, 0.62, 0.42, 5.8, mat.hedge);
    box(groups[3], 5.75, 0.42, 3.25, 2.25, 0.42, 0.55, mat.hedge);
    tree(groups[3], -5.6, -4.2, 0.92);
    tree(groups[3], 5.55, 4.2, 0.98);
    tree(groups[3], 6.2, -3.55, 0.78);

    const people = [
      person(groups[3], 1.6, 3.18, 3.0, 0.88),
      person(groups[3], -3.0, 0.28, 3.25, 0.92),
      person(groups[3], 4.75, 0.28, 2.8, 0.82),
    ];

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.17 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.25;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#fff2dd", "#40584b", 2.5));
    const sun = new THREE.DirectionalLight("#ffdcb8", 4.0);
    sun.position.set(-9, 15, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13 });
    sun.shadow.bias = -0.002;
    scene.add(sun);
    const rim = new THREE.DirectionalLight("#b8d4cf", 1.0);
    rim.position.set(10, 8, -11);
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
    let rotationAngle = -0.46;
    let manualOffset = 0;
    let dragging = false;
    let lastPointerX = 0;
    let activePointerId: number | null = null;

    const start = () => {
      if (!raf && visible && !document.hidden) {
        previous = performance.now();
        raf = requestAnimationFrame(render);
      }
    };

    const pointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      lastPointerX = e.clientX;
      activePointerId = e.pointerId;
      targetPointer = 0;
      pointerOffset = 0;
      container.setPointerCapture?.(e.pointerId);
      container.style.cursor = "grabbing";
      start();
    };

    const pointerMove = (e: PointerEvent) => {
      if (dragging && (activePointerId === null || e.pointerId === activePointerId)) {
        const dx = e.clientX - lastPointerX;
        lastPointerX = e.clientX;
        manualOffset += dx * 0.0085;
        start();
        return;
      }
      const rect = container.getBoundingClientRect();
      targetPointer = ((e.clientX - rect.left) / rect.width - 0.5) * 0.11;
    };

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      if (activePointerId !== null) {
        try { container.releasePointerCapture?.(activePointerId); } catch { /* no-op */ }
      }
      activePointerId = null;
      targetPointer = 0;
      container.style.cursor = "grab";
      start();
    };

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

      if (!dragging) rotationAngle = (rotationAngle + dt * 0.032) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, targetPointer, 5, dt);
      villa.rotation.y = rotationAngle + manualOffset + pointerOffset;
      villa.position.y = 0.05 + Math.sin(now * 0.00105) * 0.055;

      if (phaseRef.current === 3) people.forEach((p, i) => (p.rotation.y = Math.sin(now * 0.0012 + i * 1.4) * 0.12));

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    container.style.cursor = "grab";
    container.style.touchAction = "pan-y";
    container.addEventListener("pointerdown", pointerDown);
    container.addEventListener("pointermove", pointerMove);
    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);
    container.addEventListener("pointerleave", () => { if (!dragging) targetPointer = 0; });

    redraw.current = start;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(container);

    const resume = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else start();
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
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
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
      tabIndex={0}
      aria-label={`Villa contemporaine aux baies alignées, matériaux chauds, terrasses et jardin — phase ${phase + 1} sur 4.`}
    />
  );
}
