import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BuildingSceneRefined({
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
    camera.position.set(18.4, 9.4, 22.5);
    camera.lookAt(0, 2.55, 0.4);

    const villa = new THREE.Group();
    villa.scale.setScalar(0.92);
    scene.add(villa);

    const mat = {
      foundation: new THREE.MeshStandardMaterial({ color: "#747067", roughness: 0.95 }),
      render: new THREE.MeshStandardMaterial({ color: "#e8e2d8", roughness: 0.84 }),
      stone: new THREE.MeshStandardMaterial({ color: "#bba88f", roughness: 0.92 }),
      charcoal: new THREE.MeshStandardMaterial({ color: "#202826", roughness: 0.48, metalness: 0.18 }),
      aluminum: new THREE.MeshStandardMaterial({ color: "#17211f", roughness: 0.28, metalness: 0.68 }),
      wood: new THREE.MeshStandardMaterial({ color: "#8c5d3d", roughness: 0.72 }),
      interior: new THREE.MeshStandardMaterial({ color: "#d9c4aa", roughness: 0.86 }),
      interiorFloor: new THREE.MeshStandardMaterial({ color: "#7f6048", roughness: 0.82 }),
      green: new THREE.MeshStandardMaterial({ color: "#536b4b", roughness: 1 }),
      hedge: new THREE.MeshStandardMaterial({ color: "#294c35", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#6b4d35", roughness: 1 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#8db3b5",
        roughness: 0.04,
        transmission: 0.38,
        transparent: true,
        opacity: 0.5,
        metalness: 0.03,
        side: THREE.DoubleSide,
      }),
      railGlass: new THREE.MeshPhysicalMaterial({
        color: "#aec6c6",
        roughness: 0.04,
        transmission: 0.44,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      }),
      water: new THREE.MeshPhysicalMaterial({
        color: "#4ca0b0",
        roughness: 0.03,
        transmission: 0.2,
        transparent: true,
        opacity: 0.82,
      }),
      textile: new THREE.MeshStandardMaterial({ color: "#d7c9b7", roughness: 0.94 }),
      skin: new THREE.MeshStandardMaterial({ color: "#c88d6d", roughness: 0.82 }),
      shirt: new THREE.MeshStandardMaterial({ color: "#2d424a", roughness: 0.82 }),
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
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    };

    const cylinder = (g: THREE.Group, x: number, y: number, z: number, r: number, h: number, material: THREE.Material) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 18), material);
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

    const frontGlazing = (g: THREE.Group, x: number, y: number, z: number, w: number, h: number, bays: number) => {
      box(g, x, y, z, w, h, 0.07, mat.glass);
      for (let i = 0; i <= bays; i++) {
        const xx = x - w / 2 + (w * i) / bays;
        box(g, xx, y, z + 0.018, 0.05, h + 0.05, 0.065, mat.aluminum);
      }
      box(g, x, y + h / 2, z + 0.018, w, 0.05, 0.065, mat.aluminum);
      box(g, x, y - h / 2, z + 0.018, w, 0.05, 0.065, mat.aluminum);
    };

    const sideGlazing = (g: THREE.Group, x: number, y: number, z: number, d: number, h: number, bays: number) => {
      box(g, x, y, z, 0.07, h, d, mat.glass);
      for (let i = 0; i <= bays; i++) {
        const zz = z - d / 2 + (d * i) / bays;
        box(g, x + 0.018, y, zz, 0.065, h + 0.05, 0.05, mat.aluminum);
      }
      box(g, x + 0.018, y + h / 2, z, 0.065, 0.05, d, mat.aluminum);
      box(g, x + 0.018, y - h / 2, z, 0.065, 0.05, d, mat.aluminum);
    };

    const rail = (g: THREE.Group, x: number, y: number, z: number, w: number) => {
      box(g, x, y, z, w, 0.62, 0.035, mat.railGlass);
      box(g, x, y + 0.32, z, w, 0.035, 0.05, mat.aluminum);
      const bays = Math.max(3, Math.round(w / 1.5));
      for (let i = 0; i <= bays; i++) {
        box(g, x - w / 2 + (w * i) / bays, y, z, 0.025, 0.66, 0.04, mat.aluminum);
      }
    };

    const tree = (g: THREE.Group, x: number, z: number, s = 1) => {
      cylinder(g, x, 0.62 * s, z, 0.08 * s, 1.2 * s, mat.trunk);
      sphere(g, x, 1.45 * s, z, 0.48 * s, mat.green);
      sphere(g, x + 0.26 * s, 1.38 * s, z + 0.08 * s, 0.3 * s, mat.green);
      sphere(g, x - 0.24 * s, 1.34 * s, z - 0.08 * s, 0.29 * s, mat.green);
    };

    const person = (g: THREE.Group, x: number, y: number, z: number, s = 1) => {
      const p = new THREE.Group();
      p.position.set(x, y, z);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.11 * s, 0.28 * s, 4, 8), mat.shirt);
      body.position.y = 0.34 * s;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.1 * s, 12, 8), mat.skin);
      head.position.y = 0.68 * s;
      p.add(body, head);
      g.add(p);
      return p;
    };

    // 01 — foundations / base platform
    box(groups[0], 0, -0.2, 0, 15.5, 0.28, 11.2, mat.foundation);
    box(groups[0], -0.2, 0.0, 0.0, 12.4, 0.26, 7.4, mat.render);
    for (const x of [-4.6, -1.55, 1.55, 4.6]) {
      box(groups[0], x, -0.55, 1.9, 0.5, 0.75, 0.5, mat.foundation);
      box(groups[0], x, -0.55, -1.9, 0.5, 0.75, 0.5, mat.foundation);
    }

    // 02 — structure: one coherent structural grid, same axes on every level.
    const frontZ = 2.7;
    const rearZ = -2.65;
    const leftX = -5.05;
    const rightX = 5.05;
    const slabGround = 1.42;
    const slabFirst = 3.75;
    const roof = 6.04;

    box(groups[1], 0, slabGround, 0, 10.4, 0.22, 5.9, mat.render);
    box(groups[1], 0, slabFirst, 0, 10.4, 0.22, 5.9, mat.render);
    box(groups[1], 0, roof, 0, 10.4, 0.2, 5.9, mat.charcoal);

    // continuous side walls: no offsets or floating wall fragments.
    box(groups[1], leftX, 3.72, 0, 0.34, 4.62, 5.35, mat.stone);
    box(groups[1], rightX, 3.72, -1.0, 0.34, 4.62, 3.35, mat.render);
    box(groups[1], 0, 3.72, rearZ, 9.75, 4.62, 0.34, mat.render);

    for (const x of [-4.7, -1.55, 1.55, 4.7]) {
      box(groups[1], x, 2.55, frontZ, 0.16, 2.2, 0.16, mat.charcoal);
      box(groups[1], x, 4.9, frontZ, 0.16, 2.1, 0.16, mat.charcoal);
    }

    // 03 — envelope: windows follow exactly the structural grid.
    frontGlazing(groups[2], 0, 2.55, frontZ + 0.03, 9.72, 2.08, 6);
    frontGlazing(groups[2], 0, 4.9, frontZ + 0.03, 9.72, 2.0, 6);
    sideGlazing(groups[2], rightX + 0.03, 2.55, 0.95, 1.7, 2.08, 2);
    sideGlazing(groups[2], rightX + 0.03, 4.9, 0.95, 1.7, 2.0, 2);

    // entrance is integrated into the right-hand bay, not added as a detached block.
    box(groups[2], 4.95, 1.43, 1.5, 0.22, 2.45, 1.45, mat.charcoal);
    box(groups[2], 4.2, 2.78, 1.55, 1.85, 0.14, 1.4, mat.charcoal);

    // warm interior planes line up behind the glazing.
    box(groups[2], 0, 1.55, 0.6, 9.4, 0.08, 3.2, mat.interiorFloor);
    box(groups[2], 0, 3.88, 0.6, 9.4, 0.08, 3.2, mat.interiorFloor);
    box(groups[2], -2.6, 2.55, 0.0, 0.12, 2.05, 2.1, mat.interior);
    box(groups[2], 1.45, 2.55, 0.0, 0.12, 2.05, 2.1, mat.interior);
    box(groups[2], -1.0, 1.03, 0.7, 2.4, 0.55, 0.52, mat.wood);
    box(groups[2], 2.0, 0.78, 1.0, 1.8, 0.28, 0.78, mat.textile);

    // architectural frame and timber screen: aligned to facade edges.
    box(groups[2], 0, 0.26, frontZ + 0.08, 10.1, 0.24, 0.2, mat.charcoal);
    box(groups[2], 0, 3.62, frontZ + 0.08, 10.1, 0.16, 0.18, mat.wood);
    for (let x = -4.55; x <= -3.0; x += 0.25) {
      box(groups[2], x, 5.0, rearZ - 0.08, 0.065, 1.8, 0.14, mat.wood);
    }

    // 04 — finishes / terraces / landscape.
    box(groups[3], 0, 0.14, 4.05, 12.2, 0.1, 2.25, mat.green);
    box(groups[3], -4.7, 0.14, -4.0, 3.1, 0.1, 2.1, mat.green);
    box(groups[3], 4.7, 0.14, -4.0, 3.1, 0.1, 2.1, mat.green);
    box(groups[3], 0, 0.25, 3.25, 8.4, 0.12, 1.0, mat.stone);

    box(groups[3], 0, 3.88, 3.18, 8.4, 0.12, 0.98, mat.stone);
    rail(groups[3], 0, 4.22, 3.62, 8.35);

    // pergola is centered on the same façade grid.
    for (const x of [-3.6, -1.2, 1.2, 3.6]) box(groups[3], x, 6.42, 2.8, 0.08, 0.9, 0.08, mat.aluminum);
    for (let x = -3.9; x <= 3.9; x += 0.55) box(groups[3], x, 6.82, 2.82, 0.055, 0.055, 1.1, mat.wood);

    // pool and outdoor lounge.
    box(groups[3], -1.9, 0.12, -4.05, 6.2, 0.18, 1.7, mat.render);
    box(groups[3], -1.9, 0.24, -4.05, 5.82, 0.045, 1.38, mat.water);
    box(groups[3], 2.0, 0.22, -4.05, 1.2, 0.08, 1.5, mat.wood);
    box(groups[3], -2.6, 0.46, 3.6, 1.45, 0.22, 0.7, mat.textile);
    box(groups[3], -0.8, 0.46, 3.6, 1.45, 0.22, 0.7, mat.textile);

    box(groups[3], -6.0, 0.42, 0.2, 0.6, 0.42, 5.8, mat.hedge);
    box(groups[3], 5.9, 0.42, 3.25, 1.9, 0.42, 0.52, mat.hedge);
    tree(groups[3], -5.6, -4.15, 0.9);
    tree(groups[3], 5.5, 4.1, 0.95);

    const people = [
      person(groups[3], 2.3, 3.88, 3.05, 0.88),
      person(groups[3], -3.0, 0.25, 3.1, 0.9),
    ];

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.17 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.25;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#fff7e8", "#456055", 2.8));
    const sun = new THREE.DirectionalLight("#ffe9cd", 4.4);
    sun.position.set(-9, 15, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13 });
    sun.shadow.bias = -0.002;
    scene.add(sun);

    const rim = new THREE.DirectionalLight("#bfd9dc", 1.1);
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
    let rotationAngle = -0.48;
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

    const leave = () => { if (!dragging) targetPointer = 0; };
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        manualOffset -= 0.18;
        e.preventDefault();
        start();
      } else if (e.key === "ArrowRight") {
        manualOffset += 0.18;
        e.preventDefault();
        start();
      }
    };

    container.style.cursor = "grab";
    container.style.touchAction = "pan-y";
    container.addEventListener("pointerdown", pointerDown);
    container.addEventListener("pointermove", pointerMove);
    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);
    container.addEventListener("pointerleave", leave);
    container.addEventListener("keydown", keyDown);

    function render(now: number) {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;

      groups.forEach((g, i) => {
        const target = i <= phaseRef.current ? 1 : 0;
        const next = THREE.MathUtils.damp(g.scale.y, target, 9, dt);
        g.scale.y = Math.max(0.001, next);
        g.visible = next > 0.01;
        g.position.y = (1 - next) * -0.3;
      });

      if (!dragging) rotationAngle = (rotationAngle + dt * 0.032) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, targetPointer, 5, dt);
      villa.rotation.y = rotationAngle + manualOffset + pointerOffset;
      villa.position.y = 0.06 + Math.sin(now * 0.00105) * 0.06;

      if (phaseRef.current === 3) {
        people.forEach((p, i) => { p.rotation.y = Math.sin(now * 0.0012 + i * 1.4) * 0.12; });
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
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
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", resume);
      container.removeEventListener("pointerdown", pointerDown);
      container.removeEventListener("pointermove", pointerMove);
      container.removeEventListener("pointerup", endDrag);
      container.removeEventListener("pointercancel", endDrag);
      container.removeEventListener("pointerleave", leave);
      container.removeEventListener("keydown", keyDown);
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
      aria-label={`Villa contemporaine avec murs et baies alignés sur une trame structurelle cohérente — phase ${phase + 1} sur 4. Glissez horizontalement pour la faire pivoter.`}
    />
  );
}
