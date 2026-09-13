import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Contemporary concrete-and-glass villa used by the homepage construction phasing. */
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
    renderer.toneMappingExposure = 1.32;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 120);
    camera.position.set(18, 10.8, 21.5);
    camera.lookAt(0.2, 2.6, 0.4);

    const villa = new THREE.Group();
    villa.scale.setScalar(0.92);
    scene.add(villa);

    const mat = {
      concrete: new THREE.MeshStandardMaterial({ color: "#d8d6cf", roughness: 0.9 }),
      concreteLight: new THREE.MeshStandardMaterial({ color: "#eceae4", roughness: 0.8 }),
      concreteDark: new THREE.MeshStandardMaterial({ color: "#aaa79f", roughness: 0.92 }),
      stone: new THREE.MeshStandardMaterial({ color: "#c9c3b7", roughness: 0.95 }),
      dark: new THREE.MeshStandardMaterial({ color: "#18221f", roughness: 0.38, metalness: 0.48 }),
      aluminum: new THREE.MeshStandardMaterial({ color: "#303b39", roughness: 0.28, metalness: 0.72 }),
      wood: new THREE.MeshStandardMaterial({ color: "#8c674c", roughness: 0.76 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#9bc0c4",
        roughness: 0.035,
        transmission: 0.34,
        transparent: true,
        opacity: 0.52,
        metalness: 0.08,
        side: THREE.DoubleSide,
      }),
      railGlass: new THREE.MeshPhysicalMaterial({
        color: "#b8d1d4",
        roughness: 0.03,
        transmission: 0.42,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide,
      }),
      lawn: new THREE.MeshStandardMaterial({ color: "#557f4d", roughness: 1 }),
      hedge: new THREE.MeshStandardMaterial({ color: "#365f3d", roughness: 1 }),
      foliage: new THREE.MeshStandardMaterial({ color: "#47734b", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#70543a", roughness: 1 }),
      water: new THREE.MeshPhysicalMaterial({
        color: "#68b7c8",
        roughness: 0.04,
        transmission: 0.16,
        transparent: true,
        opacity: 0.78,
      }),
      fabric: new THREE.MeshStandardMaterial({ color: "#e7e2d8", roughness: 0.95 }),
      skin: new THREE.MeshStandardMaterial({ color: "#c9916f", roughness: 0.82 }),
      shirt: new THREE.MeshStandardMaterial({ color: "#293d49", roughness: 0.8 }),
    };

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
      material: THREE.Material,
      rotY = 0,
    ) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    }

    function cylinder(
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      r: number,
      h: number,
      material: THREE.Material,
      segments = 20,
    ) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    }

    function sphere(
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      r: number,
      material: THREE.Material,
    ) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 12), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      g.add(mesh);
      return mesh;
    }

    function tree(g: THREE.Group, x: number, z: number, s = 1) {
      cylinder(g, x, 0.62 * s, z, 0.08 * s, 1.2 * s, mat.trunk, 12);
      sphere(g, x, 1.45 * s, z, 0.48 * s, mat.foliage);
      sphere(g, x + 0.28 * s, 1.38 * s, z + 0.1 * s, 0.31 * s, mat.foliage);
      sphere(g, x - 0.24 * s, 1.34 * s, z - 0.08 * s, 0.3 * s, mat.foliage);
    }

    function glassPanel(
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      axis: "x" | "z" = "x",
    ) {
      box(g, x, y, z, w, h, d, mat.glass);
      const count = Math.max(2, Math.round((axis === "x" ? w : d) / 1.25));
      for (let i = 0; i <= count; i++) {
        const t = i / count - 0.5;
        if (axis === "x") box(g, x + t * w, y, z + 0.015, 0.045, h + 0.05, 0.055, mat.aluminum);
        else box(g, x + 0.015, y, z + t * d, 0.055, h + 0.05, 0.045, mat.aluminum);
      }
    }

    function glassRail(g: THREE.Group, x: number, y: number, z: number, w: number, d: number, axis: "x" | "z") {
      if (axis === "x") {
        box(g, x, y, z, w, 0.68, 0.035, mat.railGlass);
        box(g, x, y + 0.35, z, w, 0.035, 0.055, mat.aluminum);
        const count = Math.max(2, Math.round(w / 1.45));
        for (let i = 0; i <= count; i++) box(g, x - w / 2 + (i * w) / count, y, z, 0.028, 0.72, 0.04, mat.aluminum);
      } else {
        box(g, x, y, z, 0.035, 0.68, d, mat.railGlass);
        box(g, x, y + 0.35, z, 0.055, 0.035, d, mat.aluminum);
        const count = Math.max(2, Math.round(d / 1.45));
        for (let i = 0; i <= count; i++) box(g, x, y, z - d / 2 + (i * d) / count, 0.04, 0.72, 0.028, mat.aluminum);
      }
    }

    function person(g: THREE.Group, x: number, y: number, z: number, scale = 1) {
      const p = new THREE.Group();
      p.position.set(x, y, z);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.11 * scale, 0.28 * scale, 4, 8), mat.shirt);
      body.position.y = 0.34 * scale;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.1 * scale, 12, 8), mat.skin);
      head.position.y = 0.68 * scale;
      p.add(body, head);
      p.traverse((o) => {
        if (o instanceof THREE.Mesh) o.castShadow = true;
      });
      g.add(p);
      return p;
    }

    // 01 — Foundations / terrain
    box(groups[0], 0, -0.2, 0, 15.6, 0.28, 11.3, mat.concreteDark);
    box(groups[0], -0.4, 0.0, 0.15, 11.8, 0.28, 7.4, mat.concrete);
    box(groups[0], 5.15, 0.0, 0.4, 3.0, 0.24, 7.9, mat.concrete);
    for (const x of [-4.8, -1.8, 1.2, 4.2]) {
      box(groups[0], x, -0.55, 1.9, 0.52, 0.75, 0.52, mat.concreteDark);
      box(groups[0], x, -0.55, -2.0, 0.52, 0.75, 0.52, mat.concreteDark);
    }

    // 02 — Structure: three clean horizontal plates, a solid rear core and cantilevered top level.
    const slab1Y = 1.48;
    const slab2Y = 3.02;
    const slab3Y = 4.58;
    box(groups[1], -0.7, slab1Y, -0.15, 10.6, 0.22, 6.2, mat.concrete);
    box(groups[1], -0.45, slab2Y, 0.0, 11.2, 0.22, 6.5, mat.concrete);
    box(groups[1], 0.65, slab3Y, 0.05, 9.5, 0.22, 5.9, mat.concreteLight);
    box(groups[1], 1.15, 5.93, -0.1, 9.95, 0.2, 6.3, mat.concreteLight);

    box(groups[1], -5.15, 1.55, -0.25, 0.34, 2.8, 5.4, mat.concrete);
    box(groups[1], 4.55, 1.55, -1.3, 0.34, 2.8, 3.25, mat.concrete);
    box(groups[1], -4.65, 3.82, -1.2, 0.34, 2.62, 3.8, mat.concreteLight);
    box(groups[1], 5.25, 3.82, -0.5, 0.34, 2.62, 4.5, mat.concreteLight);
    box(groups[1], -0.6, 2.28, -2.75, 9.0, 4.5, 0.34, mat.concreteDark);

    for (const x of [-4.35, -1.45, 1.35, 4.05]) {
      box(groups[1], x, 1.5, 2.75, 0.18, 2.75, 0.18, mat.concrete);
      box(groups[1], x, 3.76, 2.66, 0.16, 2.45, 0.16, mat.concreteLight);
    }

    // 03 — Envelope: broad floor-to-ceiling glazing and dark aluminium frames.
    glassPanel(groups[2], -0.45, 1.55, 2.83, 9.25, 2.48, 0.075, "x");
    glassPanel(groups[2], -0.15, 3.78, 2.73, 8.3, 2.24, 0.075, "x");
    glassPanel(groups[2], 1.05, 5.22, 2.55, 7.1, 2.05, 0.075, "x");

    glassPanel(groups[2], 4.5, 1.55, 0.15, 0.075, 2.48, 5.05, "z");
    glassPanel(groups[2], 5.2, 3.8, 0.35, 0.075, 2.22, 4.35, "z");

    // Strong concrete side blade and vertical sunscreen, echoing the reference villa.
    box(groups[2], -5.02, 3.75, -0.55, 0.34, 4.5, 4.4, mat.concreteLight);
    box(groups[2], 3.25, 3.72, 2.82, 0.9, 2.3, 0.12, mat.concreteDark);
    for (let x = -3.55; x <= -1.25; x += 0.28) {
      box(groups[2], x, 5.1, -2.84, 0.085, 1.92, 0.18, mat.wood);
    }

    // 04 — Finishes / garden / terraces.
    box(groups[3], -3.85, 0.16, 3.95, 6.2, 0.12, 2.45, mat.lawn);
    box(groups[3], 3.45, 0.16, 3.85, 5.3, 0.12, 2.65, mat.lawn);
    box(groups[3], -3.9, 0.16, -4.0, 5.8, 0.12, 2.2, mat.lawn);

    box(groups[3], -0.55, 0.27, 3.38, 7.6, 0.12, 1.3, mat.stone);
    box(groups[3], 4.58, 0.26, 0.25, 2.0, 0.12, 6.9, mat.stone);
    box(groups[3], 1.25, 3.15, 3.02, 7.25, 0.12, 1.15, mat.stone);
    box(groups[3], 1.95, 4.72, 2.92, 5.9, 0.1, 1.05, mat.stone);

    glassRail(groups[3], 1.25, 3.52, 3.53, 7.25, 0, "x");
    glassRail(groups[3], 1.95, 5.07, 3.4, 5.9, 0, "x");
    glassRail(groups[3], 4.88, 3.52, 1.9, 0, 3.05, "z");

    // Exterior stair on the right side, rising along the concrete retaining wall.
    for (let i = 0; i < 9; i++) {
      box(groups[3], 6.15, 0.22 + i * 0.18, -1.9 + i * 0.38, 1.35, 0.16, 0.55, mat.concreteLight);
    }
    box(groups[3], 6.85, 1.08, -0.35, 0.18, 1.85, 4.2, mat.concreteDark);

    // Discreet lower pool / reflecting basin and sun deck.
    box(groups[3], -1.85, 0.15, -4.0, 6.1, 0.2, 1.65, mat.concrete);
    box(groups[3], -1.85, 0.28, -4.0, 5.72, 0.05, 1.32, mat.water);
    box(groups[3], 1.65, 0.28, -4.0, 1.25, 0.1, 1.55, mat.wood);

    // Outdoor furniture kept simple and architectural.
    box(groups[3], -2.8, 0.46, 3.65, 1.5, 0.22, 0.72, mat.fabric);
    box(groups[3], -2.8, 0.76, 3.92, 1.5, 0.5, 0.16, mat.fabric);
    box(groups[3], -0.8, 0.46, 3.65, 1.5, 0.22, 0.72, mat.fabric);
    cylinder(groups[3], -1.8, 0.43, 3.05, 0.38, 0.07, mat.dark, 28);

    // Pergola / shading detail on the upper terrace.
    for (const x of [-0.8, 1.25, 3.3]) box(groups[3], x, 5.15, 3.55, 0.1, 1.0, 0.1, mat.aluminum);
    for (let i = 0; i < 9; i++) box(groups[3], -0.75 + i * 0.5, 5.65, 3.1, 0.06, 0.06, 1.2, mat.wood);

    // Landscaping close to the architecture, not toy-like clutter.
    box(groups[3], -6.0, 0.42, 0.3, 0.62, 0.42, 5.8, mat.hedge);
    box(groups[3], 5.75, 0.42, 3.25, 2.25, 0.42, 0.55, mat.hedge);
    tree(groups[3], -5.6, -4.2, 0.92);
    tree(groups[3], 5.55, 4.2, 0.98);
    tree(groups[3], 6.2, -3.55, 0.78);

    // A few people give scale, while remaining intentionally subtle.
    const personA = person(groups[3], 2.3, 3.15, 3.0, 0.9);
    const personB = person(groups[3], -3.0, 0.28, 3.25, 0.92);
    const personC = person(groups[3], 4.75, 0.28, 2.8, 0.82);
    const people = [personA, personB, personC];

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.25;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#fff8eb", "#476055", 2.9));
    const sun = new THREE.DirectionalLight("#ffe8c8", 4.5);
    sun.position.set(-9, 15, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13 });
    sun.shadow.bias = -0.002;
    scene.add(sun);

    const rim = new THREE.DirectionalLight("#c2dde1", 1.15);
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
        try {
          container.releasePointerCapture?.(activePointerId);
        } catch {
          /* no-op */
        }
      }
      activePointerId = null;
      lastPointerX = 0;
      targetPointer = 0;
      container.style.cursor = "grab";
      start();
    };

    const leave = () => {
      if (!dragging) targetPointer = 0;
    };

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

      if (!dragging) rotationAngle = (rotationAngle + dt * 0.034) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, targetPointer, 5, dt);
      villa.rotation.y = rotationAngle + manualOffset + pointerOffset;
      villa.position.y = 0.06 + Math.sin(now * 0.00105) * 0.065;
      villa.rotation.z = Math.sin(now * 0.00058) * 0.002;

      if (phaseRef.current === 3) {
        people.forEach((p, i) => {
          p.rotation.y = Math.sin(now * 0.0012 + i * 1.4) * 0.12;
        });
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
      aria-label={`Villa contemporaine en béton et verre avec terrasses, jardin et bassin — phase ${phase + 1} sur 4. Glissez horizontalement pour la faire pivoter.`}
    />
  );
}
