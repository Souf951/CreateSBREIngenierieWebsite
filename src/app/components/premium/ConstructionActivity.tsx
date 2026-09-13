import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ConstructionActivity({ kind }: { kind: "villa" | "immeuble" }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 120);
    camera.position.set(12, 8.5, 17);
    camera.lookAt(0, 1.2, 0);

    const root = new THREE.Group();
    const baseX = kind === "immeuble" ? -0.1 : 0.15;
    const baseY = -0.35;
    const baseZ = 0.2;
    root.position.set(baseX, baseY, baseZ);
    root.scale.setScalar(kind === "immeuble" ? 0.9 : 0.84);
    scene.add(root);

    const mats = {
      yellow: new THREE.MeshStandardMaterial({ color: "#e8b43f", roughness: 0.58, metalness: 0.16 }),
      dark: new THREE.MeshStandardMaterial({ color: "#26312e", roughness: 0.52, metalness: 0.35 }),
      steel: new THREE.MeshStandardMaterial({ color: "#727b76", roughness: 0.45, metalness: 0.55 }),
      concrete: new THREE.MeshStandardMaterial({ color: "#b8b7b0", roughness: 0.9 }),
      orange: new THREE.MeshStandardMaterial({ color: "#ef7f35", roughness: 0.68 }),
      blue: new THREE.MeshStandardMaterial({ color: "#3e73a8", roughness: 0.7 }),
      white: new THREE.MeshStandardMaterial({ color: "#f3efe6", roughness: 0.78 }),
      skin: new THREE.MeshStandardMaterial({ color: "#c99771", roughness: 0.82 }),
      dust: new THREE.MeshBasicMaterial({ color: "#c9b89b", transparent: true, opacity: 0.12, depthWrite: false }),
    };

    const box = (x: number, y: number, z: number, w: number, h: number, d: number, material: THREE.Material) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      root.add(m);
      return m;
    };

    const cyl = (x: number, y: number, z: number, r: number, h: number, material: THREE.Material, segments = 16) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), material);
      m.position.set(x, y, z);
      m.castShadow = true;
      root.add(m);
      return m;
    };

    const worker = (x: number, z: number, shirt: THREE.Material, scale = 1) => {
      const p = new THREE.Group();
      p.position.set(x, 0.05, z);
      const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.13 * scale, 0.34 * scale, 4, 8), shirt);
      torso.position.y = 0.55 * scale;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.12 * scale, 12, 8), mats.skin);
      head.position.y = 1.02 * scale;
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.135 * scale, 12, 7, 0, Math.PI * 2, 0, Math.PI / 2), mats.yellow);
      helmet.position.y = 1.10 * scale;
      const legGeo = new THREE.CylinderGeometry(0.035 * scale, 0.035 * scale, 0.46 * scale, 8);
      const armGeo = new THREE.CylinderGeometry(0.03 * scale, 0.03 * scale, 0.42 * scale, 8);
      const l1 = new THREE.Mesh(legGeo, mats.dark);
      const l2 = l1.clone();
      l1.position.set(-0.07 * scale, 0.18 * scale, 0);
      l2.position.set(0.07 * scale, 0.18 * scale, 0);
      const a1 = new THREE.Mesh(armGeo, mats.skin);
      const a2 = a1.clone();
      a1.rotation.z = 0.72;
      a2.rotation.z = -0.72;
      a1.position.set(-0.22 * scale, 0.64 * scale, 0);
      a2.position.set(0.22 * scale, 0.64 * scale, 0);
      p.add(torso, head, helmet, l1, l2, a1, a2);
      p.traverse((o) => { if (o instanceof THREE.Mesh) o.castShadow = true; });
      root.add(p);
      return { group: p, armA: a1, armB: a2 };
    };

    // Tower crane with counterweight, hook and suspended formwork panel.
    box(kind === "immeuble" ? -5.6 : -5.1, 2.65, -0.7, 0.32, 5.3, 0.32, mats.yellow);
    for (let y = 0.3; y < 5.1; y += 0.55) {
      const brace = box(kind === "immeuble" ? -5.6 : -5.1, y, -0.7, 0.6, 0.055, 0.055, mats.dark);
      brace.rotation.z = y % 1.1 < 0.1 ? 0.72 : -0.72;
    }
    box(kind === "immeuble" ? -1.4 : -1.0, 5.25, -0.7, 8.6, 0.18, 0.18, mats.yellow);
    box(kind === "immeuble" ? -6.15 : -5.65, 5.25, -0.7, 1.35, 0.22, 0.3, mats.yellow);
    box(kind === "immeuble" ? -6.55 : -6.05, 5.08, -0.7, 0.55, 0.45, 0.62, mats.concrete);
    const cable = cyl(kind === "immeuble" ? 1.6 : 2.0, 3.95, -0.7, 0.018, 2.55, mats.dark, 8);
    const hook = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 8, 14, Math.PI * 1.45), mats.dark);
    hook.position.set(kind === "immeuble" ? 1.6 : 2.0, 2.64, -0.7);
    hook.rotation.z = -0.4;
    root.add(hook);
    const load = box(kind === "immeuble" ? 1.6 : 2.0, 2.22, -0.7, 1.15, 0.16, 0.78, mats.concrete);

    // Mixer and wheelbarrow suggest active masonry/concrete work.
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.34, 0.72, 18), mats.orange);
    drum.rotation.z = Math.PI / 2.8;
    drum.position.set(kind === "immeuble" ? 3.8 : 3.45, 0.62, 2.5);
    drum.castShadow = true;
    root.add(drum);
    box(kind === "immeuble" ? 3.8 : 3.45, 0.25, 2.5, 0.72, 0.18, 0.72, mats.dark);
    cyl(kind === "immeuble" ? 3.55 : 3.2, 0.14, 2.75, 0.12, 0.18, mats.dark, 12).rotation.z = Math.PI / 2;
    cyl(kind === "immeuble" ? 4.05 : 3.7, 0.14, 2.75, 0.12, 0.18, mats.dark, 12).rotation.z = Math.PI / 2;

    const wheelbarrow = new THREE.Group();
    wheelbarrow.position.set(kind === "immeuble" ? -3.2 : -2.7, 0.18, 2.55);
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.18, 0.45), mats.steel);
    tray.rotation.z = -0.1;
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.12, 14), mats.dark);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(0.4, -0.06, 0);
    const handle1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.05), mats.dark);
    const handle2 = handle1.clone();
    handle1.position.set(-0.58, 0.08, 0.16);
    handle2.position.set(-0.58, 0.08, -0.16);
    wheelbarrow.add(tray, wheel, handle1, handle2);
    root.add(wheelbarrow);

    // Workers distributed around the slab.
    const workers = [
      worker(kind === "immeuble" ? -2.8 : -2.4, 1.15, mats.orange, 0.9),
      worker(kind === "immeuble" ? 0.2 : 0.4, 1.95, mats.blue, 0.92),
      worker(kind === "immeuble" ? 2.8 : 2.5, -1.55, mats.orange, 0.86),
      worker(kind === "immeuble" ? 4.15 : 3.75, 1.7, mats.white, 0.9),
    ];

    // Tool: compact jackhammer / breaker for one worker.
    const breaker = box(kind === "immeuble" ? 0.2 : 0.4, 0.48, 1.72, 0.08, 0.82, 0.08, mats.dark);
    breaker.rotation.z = 0.12;

    // Dust plumes built from translucent spheres. Kept subtle so the model stays premium.
    const dust = new THREE.Group();
    root.add(dust);
    const dustSeeds = [
      [-0.1, 0.18, 1.72, 0.34],
      [0.35, 0.26, 1.45, 0.26],
      [-2.15, 0.15, 1.3, 0.22],
      [3.0, 0.16, -1.3, 0.24],
    ] as const;
    const dustClouds = dustSeeds.map(([x, y, z, r], i) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), mats.dust.clone());
      (mesh.material as THREE.MeshBasicMaterial).opacity = 0.08 + i * 0.015;
      mesh.position.set(x, y, z);
      mesh.scale.set(1.5, 0.7, 1.15);
      dust.add(mesh);
      return mesh;
    });

    scene.add(new THREE.HemisphereLight("#fff5e6", "#52665c", 2.4));
    const sun = new THREE.DirectionalLight("#ffe7c8", 3.1);
    sun.position.set(-8, 13, 8);
    sun.castShadow = true;
    scene.add(sun);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    // The construction layer is a second transparent WebGL canvas, so it must
    // mirror the exact same rotation / drag behavior as the model beneath it.
    const interactionTarget = container.parentElement?.querySelector<HTMLElement>(".building-canvas") ?? container.parentElement ?? container;
    let raf = 0;
    let previous = performance.now();
    let angle = kind === "immeuble" ? -0.42 : -0.38;
    let manualOffset = 0;
    let pointerTarget = 0;
    let pointerOffset = 0;
    let dragging = false;
    let activePointerId: number | null = null;
    let lastPointerX = 0;

    const pointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      activePointerId = e.pointerId;
      lastPointerX = e.clientX;
      pointerTarget = 0;
      pointerOffset = 0;
    };

    const pointerMove = (e: PointerEvent) => {
      if (dragging && (activePointerId === null || e.pointerId === activePointerId)) {
        const dx = e.clientX - lastPointerX;
        lastPointerX = e.clientX;
        manualOffset += dx * 0.0085;
        return;
      }
      const rect = interactionTarget.getBoundingClientRect();
      if (rect.width > 0) pointerTarget = ((e.clientX - rect.left) / rect.width - 0.5) * 0.12;
    };

    const endDrag = (e: PointerEvent) => {
      if (!dragging) return;
      if (activePointerId !== null && e.pointerId !== activePointerId) return;
      dragging = false;
      activePointerId = null;
      lastPointerX = 0;
      pointerTarget = 0;
    };

    const leave = () => {
      if (!dragging) pointerTarget = 0;
    };

    interactionTarget.addEventListener("pointerdown", pointerDown);
    interactionTarget.addEventListener("pointermove", pointerMove);
    interactionTarget.addEventListener("pointerup", endDrag);
    interactionTarget.addEventListener("pointercancel", endDrag);
    interactionTarget.addEventListener("pointerleave", leave);

    const render = (now: number) => {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      const t = now * 0.001;

      // Keep the whole site installation physically attached to the foundation.
      // Same initial angle, same drag sensitivity and same auto-rotation speed
      // as the corresponding villa / oval-building scene underneath.
      if (!dragging) angle = (angle + dt * (kind === "immeuble" ? 0.042 : 0.038)) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, pointerTarget, 5, dt);
      root.rotation.y = angle + manualOffset + pointerOffset;
      root.position.x = baseX;
      root.position.z = baseZ;
      root.position.y = baseY + (kind === "immeuble"
        ? 0.08 + Math.sin(now * 0.00105) * 0.09
        : 0.08 + Math.sin(now * 0.00115) * 0.08);
      root.rotation.z = kind === "immeuble"
        ? Math.sin(now * 0.00055) * 0.003
        : Math.sin(now * 0.00062) * 0.0025;

      // Small crane hook sway and suspended load movement.
      cable.rotation.z = Math.sin(t * 0.7) * 0.012;
      hook.position.x = (kind === "immeuble" ? 1.6 : 2.0) + Math.sin(t * 0.72) * 0.08;
      load.position.x = (kind === "immeuble" ? 1.6 : 2.0) + Math.sin(t * 0.72) * 0.08;
      load.rotation.y += dt * 0.08;
      drum.rotation.x += dt * 0.55;

      workers.forEach(({ group, armA, armB }, i) => {
        group.position.y = 0.05 + Math.sin(t * 2.1 + i) * 0.012;
        armA.rotation.z = 0.72 + Math.sin(t * 2.6 + i * 0.7) * 0.18;
        armB.rotation.z = -0.72 - Math.sin(t * 2.6 + i * 0.7) * 0.18;
      });
      wheelbarrow.rotation.y = Math.sin(t * 0.45) * 0.08;
      dustClouds.forEach((cloud, i) => {
        cloud.position.y = dustSeeds[i][1] + ((t * (0.08 + i * 0.015)) % 0.8);
        cloud.scale.x = 1.4 + Math.sin(t + i) * 0.25;
        cloud.scale.z = 1.1 + Math.cos(t * 0.8 + i) * 0.2;
        (cloud.material as THREE.MeshBasicMaterial).opacity = 0.05 + (1 - ((t * 0.08 + i * 0.17) % 1)) * 0.08;
      });

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      interactionTarget.removeEventListener("pointerdown", pointerDown);
      interactionTarget.removeEventListener("pointermove", pointerMove);
      interactionTarget.removeEventListener("pointerup", endDrag);
      interactionTarget.removeEventListener("pointercancel", endDrag);
      interactionTarget.removeEventListener("pointerleave", leave);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          const materials = Array.isArray(o.material) ? o.material : [o.material];
          materials.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [kind]);

  return <div ref={host} className="construction-activity" aria-hidden="true" />;
}
