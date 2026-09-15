import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function BuildingSceneV3({
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
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
    camera.position.set(18.6, 9.7, 22.8);
    camera.lookAt(0.2, 2.45, 0.15);

    const villa = new THREE.Group();
    villa.scale.setScalar(0.9);
    scene.add(villa);

    const mat = {
      foundation: new THREE.MeshStandardMaterial({ color: "#777269", roughness: 0.95 }),
      mineral: new THREE.MeshStandardMaterial({ color: "#d8d0c4", roughness: 0.86 }),
      mineralWarm: new THREE.MeshStandardMaterial({ color: "#c7b39d", roughness: 0.9 }),
      charcoal: new THREE.MeshStandardMaterial({ color: "#262d2b", roughness: 0.55, metalness: 0.15 }),
      graphite: new THREE.MeshStandardMaterial({ color: "#151b1a", roughness: 0.3, metalness: 0.58 }),
      bronze: new THREE.MeshStandardMaterial({ color: "#78614d", roughness: 0.36, metalness: 0.46 }),
      wood: new THREE.MeshStandardMaterial({ color: "#9b6842", roughness: 0.72 }),
      woodDark: new THREE.MeshStandardMaterial({ color: "#5a3d2b", roughness: 0.78 }),
      interiorFloor: new THREE.MeshStandardMaterial({ color: "#795a43", roughness: 0.8 }),
      interiorWall: new THREE.MeshStandardMaterial({ color: "#d9c8b5", roughness: 0.88 }),
      olive: new THREE.MeshStandardMaterial({ color: "#667253", roughness: 0.9 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#82a9ac",
        roughness: 0.045,
        transmission: 0.42,
        transparent: true,
        opacity: 0.52,
        metalness: 0.04,
        side: THREE.DoubleSide,
      }),
      glassDark: new THREE.MeshPhysicalMaterial({
        color: "#516d70",
        roughness: 0.06,
        transmission: 0.28,
        transparent: true,
        opacity: 0.58,
        metalness: 0.08,
        side: THREE.DoubleSide,
      }),
      railGlass: new THREE.MeshPhysicalMaterial({
        color: "#abc3c4",
        roughness: 0.04,
        transmission: 0.46,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      }),
      lawn: new THREE.MeshStandardMaterial({ color: "#496343", roughness: 1 }),
      hedge: new THREE.MeshStandardMaterial({ color: "#294b34", roughness: 1 }),
      foliage: new THREE.MeshStandardMaterial({ color: "#3f6846", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#6a4d36", roughness: 1 }),
      water: new THREE.MeshPhysicalMaterial({ color: "#3c97ab", roughness: 0.03, transmission: 0.22, transparent: true, opacity: 0.84 }),
      textile: new THREE.MeshStandardMaterial({ color: "#d6c8b6", roughness: 0.94 }),
      textileDark: new THREE.MeshStandardMaterial({ color: "#46544e", roughness: 0.9 }),
      skin: new THREE.MeshStandardMaterial({ color: "#c88d6d", roughness: 0.82 }),
      shirt: new THREE.MeshStandardMaterial({ color: "#283b44", roughness: 0.82 }),
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

    const glazing = (g: THREE.Group, x: number, y: number, z: number, w: number, h: number, bays: number, dark = false) => {
      box(g, x, y, z, w, h, 0.07, dark ? mat.glassDark : mat.glass);
      for (let i = 0; i <= bays; i++) {
        const xx = x - w / 2 + (w * i) / bays;
        box(g, xx, y, z + 0.018, 0.05, h + 0.05, 0.065, mat.graphite);
      }
      box(g, x, y + h / 2, z + 0.018, w, 0.05, 0.065, mat.graphite);
      box(g, x, y - h / 2, z + 0.018, w, 0.05, 0.065, mat.graphite);
    };

    const rail = (g: THREE.Group, x: number, y: number, z: number, w: number) => {
      box(g, x, y, z, w, 0.62, 0.035, mat.railGlass);
      box(g, x, y + 0.32, z, w, 0.035, 0.05, mat.graphite);
      const bays = Math.max(3, Math.round(w / 1.5));
      for (let i = 0; i <= bays; i++) box(g, x - w / 2 + (w * i) / bays, y, z, 0.025, 0.66, 0.04, mat.graphite);
    };

    const tree = (g: THREE.Group, x: number, z: number, s = 1) => {
      cylinder(g, x, 0.62 * s, z, 0.08 * s, 1.2 * s, mat.trunk);
      sphere(g, x, 1.45 * s, z, 0.48 * s, mat.foliage);
      sphere(g, x + 0.27 * s, 1.38 * s, z + 0.08 * s, 0.3 * s, mat.foliage);
      sphere(g, x - 0.24 * s, 1.35 * s, z - 0.08 * s, 0.29 * s, mat.foliage);
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

    // 01 — Foundations: crisp plinth, retaining walls and structural pads.
    box(groups[0], 0, -0.2, 0, 15.7, 0.28, 11.4, mat.foundation);
    box(groups[0], -0.5, 0.0, 0.1, 12.0, 0.28, 7.6, mat.mineral);
    box(groups[0], 5.0, 0.0, 0.2, 3.2, 0.24, 7.9, mat.mineralWarm);
    for (const x of [-4.8, -1.9, 1.0, 3.9]) {
      box(groups[0], x, -0.56, 2.0, 0.52, 0.76, 0.52, mat.foundation);
      box(groups[0], x, -0.56, -2.0, 0.52, 0.76, 0.52, mat.foundation);
    }

    // 02 — Structure: asymmetrical composition, floating upper volume and deep cantilever.
    box(groups[1], -1.1, 1.5, -0.2, 10.5, 0.22, 6.2, mat.mineral);
    box(groups[1], 0.15, 3.18, -0.18, 9.3, 0.24, 5.8, mat.mineral);
    box(groups[1], 1.0, 4.86, -0.28, 7.8, 0.24, 5.4, mat.charcoal);
    box(groups[1], 1.15, 5.95, -0.38, 8.4, 0.2, 5.8, mat.charcoal);

    box(groups[1], -5.25, 2.3, -0.55, 0.36, 5.0, 4.9, mat.charcoal);
    box(groups[1], 4.3, 1.58, -0.7, 0.34, 3.0, 4.6, mat.mineralWarm);
    box(groups[1], -0.3, 2.35, -2.95, 9.6, 4.7, 0.34, mat.mineralWarm);
    box(groups[1], 4.55, 4.0, -0.6, 0.34, 2.7, 3.9, mat.charcoal);

    for (const x of [-4.1, -1.2, 1.7, 4.0]) box(groups[1], x, 1.58, 2.76, 0.15, 2.86, 0.15, mat.mineral);
    for (const x of [-2.5, 0.3, 3.1]) box(groups[1], x, 3.28, 2.56, 0.14, 1.42, 0.14, mat.charcoal);

    // 03 — Envelope: aligned glazing, stronger solids and a dark floating pavilion.
    glazing(groups[2], -1.0, 1.58, 2.82, 8.8, 2.56, 6);
    glazing(groups[2], 0.2, 3.72, 2.58, 7.75, 1.8, 5, true);
    glazing(groups[2], 1.1, 5.28, 2.42, 5.9, 1.2, 4, true);

    // horizontal shadow lines make the façade read as one designed object.
    box(groups[2], -1.0, 0.27, 2.86, 8.95, 0.3, 0.2, mat.charcoal);
    box(groups[2], 0.2, 2.78, 2.66, 7.9, 0.3, 0.18, mat.bronze);
    box(groups[2], 1.1, 4.64, 2.5, 6.2, 0.22, 0.16, mat.charcoal);

    // side façades: mineral base, charcoal upper volume and warm cedar screen.
    box(groups[2], -5.08, 2.32, -0.55, 0.38, 4.8, 4.45, mat.charcoal);
    box(groups[2], 4.18, 1.55, -0.15, 0.38, 2.75, 5.1, mat.mineralWarm);
    box(groups[2], 4.48, 4.0, -0.2, 0.38, 2.45, 4.15, mat.charcoal);
    for (let x = -3.85; x <= -1.05; x += 0.32) box(groups[2], x, 5.1, -2.86, 0.075, 1.75, 0.16, mat.wood);

    // recessed entrance portal and canopy.
    box(groups[2], 4.18, 1.45, 1.45, 0.26, 2.5, 1.5, mat.graphite);
    box(groups[2], 3.3, 2.85, 1.6, 2.2, 0.16, 1.6, mat.charcoal);

    // Warm interior visible through the façade.
    box(groups[2], -0.9, 0.36, 1.05, 8.3, 0.08, 3.1, mat.interiorFloor);
    box(groups[2], 0.15, 2.84, 0.9, 7.2, 0.08, 2.8, mat.interiorFloor);
    box(groups[2], -3.1, 1.55, 0.2, 0.12, 2.35, 2.0, mat.interiorWall);
    box(groups[2], 1.15, 1.55, 0.1, 0.12, 2.3, 1.8, mat.olive);
    box(groups[2], -1.75, 0.98, 0.6, 2.3, 0.7, 0.5, mat.woodDark);
    box(groups[2], 1.85, 0.65, 1.0, 1.75, 0.28, 0.76, mat.textile);
    box(groups[2], 1.85, 1.04, 0.66, 1.75, 0.72, 0.18, mat.textileDark);
    cylinder(groups[2], -0.15, 0.74, 1.3, 0.44, 0.08, mat.bronze);
    box(groups[2], -1.5, 3.2, 0.25, 2.0, 0.65, 0.45, mat.wood);

    // 04 — Finishes: infinity-style pool, sunken terrace, pergola and landscaping.
    box(groups[3], -4.3, 0.16, 4.0, 5.2, 0.12, 2.3, mat.lawn);
    box(groups[3], 3.3, 0.16, 3.95, 5.1, 0.12, 2.5, mat.lawn);
    box(groups[3], -4.0, 0.16, -4.05, 5.7, 0.12, 2.1, mat.lawn);

    box(groups[3], -0.85, 0.26, 3.45, 7.5, 0.12, 1.25, mat.mineralWarm);
    box(groups[3], 4.65, 0.26, 0.15, 1.9, 0.12, 6.8, mat.mineralWarm);
    box(groups[3], 0.65, 3.28, 3.0, 6.7, 0.12, 1.05, mat.wood);
    rail(groups[3], 0.65, 3.64, 3.5, 6.7);

    // pool with dark stone surround for stronger contrast.
    box(groups[3], -1.5, 0.14, -4.05, 6.8, 0.22, 1.85, mat.charcoal);
    box(groups[3], -1.5, 0.29, -4.05, 6.35, 0.05, 1.48, mat.water);
    box(groups[3], 2.45, 0.28, -4.05, 1.15, 0.1, 1.58, mat.wood);

    // sculptural lounge + fire-table.
    box(groups[3], -2.9, 0.47, 3.7, 1.7, 0.23, 0.78, mat.textile);
    box(groups[3], -2.9, 0.78, 3.98, 1.7, 0.52, 0.16, mat.textileDark);
    box(groups[3], -0.75, 0.47, 3.7, 1.6, 0.23, 0.78, mat.textile);
    cylinder(groups[3], -1.8, 0.45, 3.03, 0.42, 0.09, mat.charcoal);

    // slim pergola in bronze/wood.
    for (const x of [-0.6, 1.35, 3.3]) box(groups[3], x, 5.18, 3.42, 0.09, 0.95, 0.09, mat.bronze);
    for (let i = 0; i < 10; i++) box(groups[3], -0.55 + i * 0.43, 5.64, 3.02, 0.055, 0.055, 1.18, mat.wood);

    // precise landscape edges rather than toy-like decoration.
    box(groups[3], -6.05, 0.43, 0.25, 0.58, 0.44, 5.9, mat.hedge);
    box(groups[3], 5.7, 0.43, 3.25, 2.15, 0.44, 0.52, mat.hedge);
    tree(groups[3], -5.55, -4.15, 0.9);
    tree(groups[3], 5.45, 4.15, 0.96);
    tree(groups[3], 6.0, -3.55, 0.76);

    const people = [
      person(groups[3], 1.8, 3.28, 3.0, 0.88),
      person(groups[3], -3.15, 0.28, 3.28, 0.9),
      person(groups[3], 4.65, 0.28, 2.8, 0.8),
    ];

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.18 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.25;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#f6ead8", "#304a40", 2.45));
    const sun = new THREE.DirectionalLight("#ffd7ae", 4.15);
    sun.position.set(-8.5, 15, 11);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13 });
    sun.shadow.bias = -0.002;
    scene.add(sun);

    const rim = new THREE.DirectionalLight("#9fc8c8", 1.1);
    rim.position.set(11, 8, -10);
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
    let rotationAngle = -0.52;
    let manualOffset = 0;
    let dragging = false;
    let lastPointerX = 0;
    let activePointerId: number | null = null;

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

      if (!dragging) rotationAngle = (rotationAngle + dt * 0.03) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, targetPointer, 5, dt);
      villa.rotation.y = rotationAngle + manualOffset + pointerOffset;
      villa.position.y = 0.04 + Math.sin(now * 0.00105) * 0.05;

      if (phaseRef.current === 3) people.forEach((p, i) => (p.rotation.y = Math.sin(now * 0.0012 + i * 1.35) * 0.11));

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

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
      container.removeEventListener("pointerdown", pointerDown);
      container.removeEventListener("pointermove", pointerMove);
      container.removeEventListener("pointerup", endDrag);
      container.removeEventListener("pointercancel", endDrag);
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
      aria-label={`Villa contemporaine premium, volumes asymétriques, façade sombre et bois, grandes baies vitrées, terrasses et piscine — phase ${phase + 1} sur 4.`}
    />
  );
}
