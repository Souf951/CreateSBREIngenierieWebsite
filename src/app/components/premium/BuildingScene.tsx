import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Modern SBRE villa used by the homepage construction phasing. */
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
    renderer.toneMappingExposure = 1.24;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 120);
    camera.position.set(17.5, 10.4, 21.5);
    camera.lookAt(0.2, 2.7, 0.2);

    const villa = new THREE.Group();
    villa.scale.setScalar(0.9);
    scene.add(villa);

    const mat = {
      warmConcrete: new THREE.MeshStandardMaterial({ color: "#d8d1c4", roughness: 0.88 }),
      limestone: new THREE.MeshStandardMaterial({ color: "#eee7d9", roughness: 0.78 }),
      stone: new THREE.MeshStandardMaterial({ color: "#b8ae9d", roughness: 0.93 }),
      charcoal: new THREE.MeshStandardMaterial({ color: "#18211d", roughness: 0.34, metalness: 0.46 }),
      aluminum: new THREE.MeshStandardMaterial({ color: "#26332f", roughness: 0.25, metalness: 0.72 }),
      wood: new THREE.MeshStandardMaterial({ color: "#9a6a43", roughness: 0.68 }),
      sbreGreen: new THREE.MeshStandardMaterial({ color: "#0a6a49", roughness: 0.64 }),
      sbreGreenDark: new THREE.MeshStandardMaterial({ color: "#073f30", roughness: 0.72 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#79aeb1",
        roughness: 0.03,
        transmission: 0.38,
        transparent: true,
        opacity: 0.5,
        metalness: 0.06,
        side: THREE.DoubleSide,
      }),
      railGlass: new THREE.MeshPhysicalMaterial({
        color: "#b9d4d2",
        roughness: 0.02,
        transmission: 0.48,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      }),
      lawn: new THREE.MeshStandardMaterial({ color: "#4e7d50", roughness: 1 }),
      hedge: new THREE.MeshStandardMaterial({ color: "#315d3d", roughness: 1 }),
      foliage: new THREE.MeshStandardMaterial({ color: "#416f46", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#6b4d34", roughness: 1 }),
      water: new THREE.MeshPhysicalMaterial({
        color: "#4daec0",
        roughness: 0.04,
        transmission: 0.15,
        transparent: true,
        opacity: 0.82,
      }),
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

    const tree = (g: THREE.Group, x: number, z: number, s = 1) => {
      cylinder(g, x, 0.62 * s, z, 0.08 * s, 1.2 * s, mat.trunk);
      sphere(g, x, 1.45 * s, z, 0.46 * s, mat.foliage);
      sphere(g, x + 0.26 * s, 1.37 * s, z + 0.08 * s, 0.29 * s, mat.foliage);
      sphere(g, x - 0.23 * s, 1.33 * s, z - 0.08 * s, 0.28 * s, mat.foliage);
    };

    const glassPanel = (g: THREE.Group, x: number, y: number, z: number, w: number, h: number, axis: "x" | "z" = "x") => {
      if (axis === "x") {
        box(g, x, y, z, w, h, 0.07, mat.glass);
        const count = Math.max(2, Math.round(w / 1.35));
        for (let i = 0; i <= count; i++) box(g, x - w / 2 + (i * w) / count, y, z + 0.02, 0.045, h + 0.04, 0.05, mat.aluminum);
      } else {
        box(g, x, y, z, 0.07, h, w, mat.glass);
        const count = Math.max(2, Math.round(w / 1.35));
        for (let i = 0; i <= count; i++) box(g, x + 0.02, y, z - w / 2 + (i * w) / count, 0.05, h + 0.04, 0.045, mat.aluminum);
      }
    };

    const glassRail = (g: THREE.Group, x: number, y: number, z: number, w: number, axis: "x" | "z") => {
      if (axis === "x") {
        box(g, x, y, z, w, 0.62, 0.035, mat.railGlass);
        box(g, x, y + 0.32, z, w, 0.035, 0.05, mat.aluminum);
      } else {
        box(g, x, y, z, 0.035, 0.62, w, mat.railGlass);
        box(g, x, y + 0.32, z, 0.05, 0.035, w, mat.aluminum);
      }
    };

    // 01 — Foundations / terrain.
    box(groups[0], 0, -0.2, 0, 15.4, 0.28, 11.2, mat.stone);
    box(groups[0], -0.25, 0.0, 0.1, 12.0, 0.3, 7.5, mat.warmConcrete);
    for (const x of [-4.7, -1.7, 1.3, 4.25]) {
      box(groups[0], x, -0.52, 1.9, 0.52, 0.72, 0.52, mat.stone);
      box(groups[0], x, -0.52, -2.0, 0.52, 0.72, 0.52, mat.stone);
    }

    // 02 — Structure: crisp cantilevered plates with one compact service core.
    box(groups[1], -0.7, 1.45, -0.05, 10.8, 0.22, 6.3, mat.warmConcrete);
    box(groups[1], -0.25, 3.03, 0.05, 11.5, 0.22, 6.55, mat.warmConcrete);
    box(groups[1], 0.75, 4.62, 0.0, 9.8, 0.24, 5.95, mat.limestone);
    box(groups[1], 1.0, 6.0, -0.1, 10.2, 0.22, 6.25, mat.limestone);

    box(groups[1], -5.05, 2.25, -0.2, 0.34, 4.4, 5.35, mat.warmConcrete);
    box(groups[1], 4.65, 2.25, -1.0, 0.34, 4.4, 3.7, mat.warmConcrete);
    box(groups[1], -0.55, 2.45, -2.8, 9.1, 4.75, 0.34, mat.stone);
    box(groups[1], 2.55, 4.85, -1.6, 2.2, 2.3, 2.4, mat.warmConcrete);

    for (const x of [-4.2, -1.4, 1.4, 4.15]) {
      box(groups[1], x, 1.55, 2.72, 0.17, 2.65, 0.17, mat.warmConcrete);
      box(groups[1], x, 3.8, 2.65, 0.15, 2.4, 0.15, mat.limestone);
    }

    // 03 — Envelope: aligned glazing, darker frames and one green architectural blade.
    glassPanel(groups[2], -0.45, 1.6, 2.82, 9.2, 2.45, "x");
    glassPanel(groups[2], -0.1, 3.82, 2.72, 8.45, 2.2, "x");
    glassPanel(groups[2], 1.15, 5.25, 2.53, 7.15, 1.98, "x");
    glassPanel(groups[2], 4.53, 1.58, 0.1, 5.0, 2.43, "z");
    glassPanel(groups[2], 5.15, 3.8, 0.35, 4.25, 2.18, "z");

    box(groups[2], -5.0, 3.78, -0.5, 0.38, 4.55, 4.35, mat.limestone);
    box(groups[2], 3.38, 3.78, 2.82, 0.92, 2.28, 0.14, mat.sbreGreenDark);
    box(groups[2], -4.18, 2.95, -2.78, 1.05, 5.45, 0.18, mat.sbreGreen);

    // Warm wood soffits give the white volumes a more residential character.
    box(groups[2], -0.3, 2.92, 2.45, 8.8, 0.09, 0.8, mat.wood);
    box(groups[2], 0.85, 4.52, 2.38, 7.2, 0.09, 0.7, mat.wood);
    for (let x = -3.3; x <= -1.1; x += 0.3) box(groups[2], x, 5.14, -2.82, 0.08, 1.86, 0.18, mat.wood);

    // 04 — Finishes / garden / terraces.
    box(groups[3], -3.8, 0.17, 3.95, 6.25, 0.12, 2.45, mat.lawn);
    box(groups[3], 3.5, 0.17, 3.9, 5.25, 0.12, 2.6, mat.lawn);
    box(groups[3], -3.8, 0.17, -4.0, 5.8, 0.12, 2.2, mat.lawn);

    box(groups[3], -0.55, 0.28, 3.38, 7.7, 0.12, 1.3, mat.stone);
    box(groups[3], 4.6, 0.27, 0.25, 2.0, 0.12, 6.9, mat.stone);
    box(groups[3], 1.25, 3.16, 3.02, 7.2, 0.12, 1.18, mat.wood);
    box(groups[3], 1.95, 4.75, 2.92, 5.9, 0.1, 1.08, mat.wood);

    glassRail(groups[3], 1.25, 3.54, 3.53, 7.2, "x");
    glassRail(groups[3], 1.95, 5.08, 3.4, 5.9, "x");
    glassRail(groups[3], 4.88, 3.54, 1.9, 3.05, "z");

    // Green roof terrace and pergola.
    box(groups[3], 1.05, 6.14, -0.1, 8.75, 0.09, 5.0, mat.lawn);
    box(groups[3], 1.0, 6.2, 1.85, 8.1, 0.08, 0.55, mat.sbreGreen);
    for (const x of [-1.0, 1.15, 3.3]) box(groups[3], x, 5.22, 3.55, 0.1, 1.0, 0.1, mat.aluminum);
    for (let i = 0; i < 9; i++) box(groups[3], -0.9 + i * 0.5, 5.7, 3.08, 0.06, 0.06, 1.25, mat.wood);

    // SBRE balcony sign mounted to the front glass railing.
    const labelCanvas = document.createElement("canvas");
    labelCanvas.width = 1024;
    labelCanvas.height = 256;
    const ctx = labelCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 1024, 256);
      ctx.fillStyle = "rgba(245,245,238,0.97)";
      ctx.fillRect(0, 0, 1024, 256);
      ctx.strokeStyle = "#07583f";
      ctx.lineWidth = 16;
      ctx.strokeRect(8, 8, 1008, 240);
      ctx.fillStyle = "#07583f";
      ctx.font = "700 132px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("SBRE", 512, 112);
      ctx.font = "600 40px Arial";
      ctx.letterSpacing = "8px";
      ctx.fillText("INGÉNIERIE", 512, 205);
    }
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    labelTexture.colorSpace = THREE.SRGBColorSpace;
    labelTexture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true, side: THREE.DoubleSide });
    const balconySign = new THREE.Mesh(new THREE.PlaneGeometry(2.85, 0.72), labelMat);
    balconySign.position.set(1.35, 3.62, 3.575);
    groups[3].add(balconySign);

    // Lower reflecting pool / sun deck.
    box(groups[3], -1.8, 0.16, -4.0, 6.15, 0.2, 1.7, mat.warmConcrete);
    box(groups[3], -1.8, 0.29, -4.0, 5.75, 0.05, 1.35, mat.water);
    box(groups[3], 1.75, 0.29, -4.0, 1.3, 0.1, 1.55, mat.wood);

    // Landscaping kept clean and architectural.
    box(groups[3], -6.0, 0.42, 0.3, 0.62, 0.42, 5.8, mat.hedge);
    box(groups[3], 5.75, 0.42, 3.25, 2.25, 0.42, 0.55, mat.hedge);
    tree(groups[3], -5.6, -4.2, 0.92);
    tree(groups[3], 5.55, 4.2, 0.98);
    tree(groups[3], 6.2, -3.55, 0.78);

    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: 0.17 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.25;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#fff9ef", "#39584d", 2.75));
    const sun = new THREE.DirectionalLight("#ffe8c9", 4.15);
    sun.position.set(-9, 15, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13 });
    sun.shadow.bias = -0.002;
    scene.add(sun);

    const rim = new THREE.DirectionalLight("#b7d7d2", 1.05);
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
      lastPointerX = 0;
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
        g.position.y = (1 - next) * -0.32;
      });

      if (!dragging) rotationAngle = (rotationAngle + dt * 0.034) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, targetPointer, 5, dt);
      villa.rotation.y = rotationAngle + manualOffset + pointerOffset;
      villa.position.y = 0.06 + Math.sin(now * 0.00105) * 0.055;
      villa.rotation.z = Math.sin(now * 0.00058) * 0.0016;

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
      labelTexture.dispose();
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
      aria-label={`Villa contemporaine SBRE en pierre, verre, bois et touches vertes — phase ${phase + 1} sur 4. Glissez horizontalement pour la faire pivoter.`}
    />
  );
}