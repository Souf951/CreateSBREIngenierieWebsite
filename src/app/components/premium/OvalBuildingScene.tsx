import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Procedural mixed-use / residential oval building inspired by contemporary Swiss architecture. */
export default function OvalBuildingScene({
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
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 120);
    camera.position.set(14.5, 11.5, 18.5);
    camera.lookAt(0, 4.6, 0);

    const building = new THREE.Group();
    building.scale.setScalar(0.88);
    scene.add(building);

    const concrete = new THREE.MeshStandardMaterial({ color: "#c98f78", roughness: 0.78 });
    const coreMat = new THREE.MeshStandardMaterial({ color: "#d7c4b5", roughness: 0.88 });
    const dark = new THREE.MeshStandardMaterial({ color: "#283531", roughness: 0.5, metalness: 0.34 });
    const glass = new THREE.MeshStandardMaterial({
      color: "#6f9aa0",
      roughness: 0.12,
      metalness: 0.5,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide,
    });
    const rail = new THREE.MeshStandardMaterial({ color: "#313d39", roughness: 0.38, metalness: 0.6 });
    const green = new THREE.MeshStandardMaterial({ color: "#315442", roughness: 0.95 });
    const terraceMat = new THREE.MeshStandardMaterial({ color: "#b58b65", roughness: 0.9 });
    const skinMat = new THREE.MeshStandardMaterial({ color: "#c98d6c", roughness: 0.9 });
    const clothes = [
      new THREE.MeshStandardMaterial({ color: "#d7d2c6", roughness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: "#304a5a", roughness: 0.88 }),
      new THREE.MeshStandardMaterial({ color: "#7d4b3d", roughness: 0.88 }),
    ];

    const groups = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
    groups.forEach((g) => {
      g.scale.y = 0.001;
      g.visible = false;
      building.add(g);
    });

    const ellipseMesh = (
      g: THREE.Group,
      y: number,
      rx: number,
      rz: number,
      h: number,
      mat: THREE.Material,
      segments = 64,
    ) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rx, rx, h, segments), mat);
      mesh.scale.z = rz / rx;
      mesh.position.y = y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    };

    const box = (
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      w: number,
      h: number,
      d: number,
      mat: THREE.Material,
      rotY = 0,
    ) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      mesh.rotation.y = rotY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    };

    // True elliptical balcony rail. A torus is rotationally symmetric, so it can
    // look visually "fixed" while the building rotates. This curve is genuinely
    // oval in plan and therefore follows the exact orientation of the building.
    const ring = (
      g: THREE.Group,
      y: number,
      rx: number,
      rz: number,
      tube: number,
      mat: THREE.Material,
    ) => {
      const points: THREE.Vector3[] = [];
      const segments = 96;
      for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(a) * rx, 0, Math.sin(a) * rz));
      }
      const curve = new THREE.CatmullRomCurve3(points, true, "centripetal");
      const mesh = new THREE.Mesh(
        new THREE.TubeGeometry(curve, segments, tube, 6, true),
        mat,
      );
      mesh.position.y = y;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    };

    const rooftopWalkers: Array<{
      group: THREE.Group;
      radiusX: number;
      radiusZ: number;
      offset: number;
      speed: number;
    }> = [];

    const addRooftopWalker = (
      parent: THREE.Group,
      color: THREE.Material,
      radiusX: number,
      radiusZ: number,
      offset: number,
      speed: number,
    ) => {
      const person = new THREE.Group();

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.34, 10), color);
      torso.position.y = 0.39;
      torso.castShadow = true;
      person.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), skinMat);
      head.position.y = 0.66;
      head.castShadow = true;
      person.add(head);

      const legA = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.28, 0.065), dark);
      legA.position.set(-0.045, 0.13, 0.015);
      legA.rotation.x = 0.16;
      person.add(legA);

      const legB = legA.clone();
      legB.position.x = 0.045;
      legB.position.z = -0.015;
      legB.rotation.x = -0.16;
      person.add(legB);

      parent.add(person);
      rooftopWalkers.push({ group: person, radiusX, radiusZ, offset, speed });
    };

    // 01 — Foundations
    ellipseMesh(groups[0], -0.28, 5.5, 4.0, 0.28, coreMat);
    ellipseMesh(groups[0], 0.02, 5.0, 3.55, 0.34, concrete);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 8) {
      const x = Math.cos(a) * 4.2;
      const z = Math.sin(a) * 3.0;
      box(groups[0], x, -0.55, z, 0.35, 0.7, 0.35, coreMat, -a);
    }

    const floorCount = 9;
    const floorHeight = 1.05;

    // 02 — Structure
    box(groups[1], 0, 4.55, 0, 1.55, 9.4, 1.35, coreMat);
    for (let floor = 0; floor <= floorCount; floor++) {
      const y = 0.36 + floor * floorHeight;
      ellipseMesh(groups[1], y, 4.7, 3.35, 0.16, concrete);
    }
    for (let floor = 0; floor < floorCount; floor++) {
      const y = 0.88 + floor * floorHeight;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = Math.cos(a) * 4.05;
        const z = Math.sin(a) * 2.87;
        box(groups[1], x, y, z, 0.16, 0.88, 0.16, coreMat, -a);
      }
    }

    // 03 — Envelope
    for (let floor = 0; floor < floorCount; floor++) {
      const y = 0.87 + floor * floorHeight;
      const facade = new THREE.Mesh(
        new THREE.CylinderGeometry(4.15, 4.15, 0.78, 64, 1, true),
        glass,
      );
      facade.scale.z = 2.95 / 4.15;
      facade.position.y = y;
      facade.castShadow = true;
      groups[2].add(facade);

      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        const x = Math.cos(a) * 4.18;
        const z = Math.sin(a) * 2.97;
        box(groups[2], x, y, z, 0.055, 0.84, 0.075, dark, -a);
      }
    }

    // 04 — Finitions / curved balcony identity
    // The rails are deliberately anchored lower so their uprights visibly start
    // on the balcony slab rather than appearing attached to the ceiling above.
    for (let floor = 0; floor < floorCount; floor++) {
      const slabY = 0.4 + floor * floorHeight;
      ellipseMesh(groups[3], slabY + 0.03, 5.0, 3.58, 0.12, concrete);
      ring(groups[3], slabY + 0.48, 4.9, 3.48, 0.025, rail);
      ring(groups[3], slabY + 0.68, 4.9, 3.48, 0.018, rail);
      for (let i = 0; i < 32; i++) {
        const a = (i / 32) * Math.PI * 2;
        const x = Math.cos(a) * 4.9;
        const z = Math.sin(a) * 3.48;
        box(groups[3], x, slabY + 0.58, z, 0.025, 0.42, 0.025, rail, -a);
      }
    }

    // Rooftop terrace: slightly raised deck, guard rails and a few subtle users.
    ellipseMesh(groups[3], 9.94, 4.85, 3.45, 0.18, concrete);
    ellipseMesh(groups[3], 10.07, 4.46, 3.04, 0.10, terraceMat);

    // Low technical/penthouse volume in the centre to make the rooftop read as usable.
    box(groups[3], 0.2, 10.31, 0.1, 1.7, 0.44, 1.18, coreMat, 0.04);
    box(groups[3], 0.2, 10.55, 0.1, 1.82, 0.07, 1.30, dark, 0.04);

    // Perimeter guard rails, raised above the terrace surface.
    ring(groups[3], 10.40, 4.68, 3.28, 0.025, rail);
    ring(groups[3], 10.64, 4.68, 3.28, 0.018, rail);
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const x = Math.cos(a) * 4.68;
      const z = Math.sin(a) * 3.28;
      box(groups[3], x, 10.52, z, 0.025, 0.48, 0.025, rail, -a);
    }

    // Rooftop greenery / planters to soften the top silhouette.
    for (const a of [-2.45, -1.95, 0.55, 1.02]) {
      const x = Math.cos(a) * 3.72;
      const z = Math.sin(a) * 2.38;
      box(groups[3], x, 10.20, z, 0.42, 0.22, 0.34, green, -a);
    }

    // People circulate slowly around the rooftop terrace in the final phase.
    addRooftopWalker(groups[3], clothes[0], 3.25, 2.02, 0.35, 0.00016);
    addRooftopWalker(groups[3], clothes[1], 3.65, 2.34, 2.35, -0.00012);
    addRooftopWalker(groups[3], clothes[2], 2.85, 1.72, 4.45, 0.00014);

    // Ground / landscape accents
    ellipseMesh(groups[3], -0.08, 6.2, 4.55, 0.06, green);
    for (let i = 0; i < 6; i++) {
      const a = -0.9 + i * 0.32;
      const x = Math.cos(a) * 5.75;
      const z = Math.sin(a) * 4.15;
      box(groups[3], x, 0.22, z, 0.12, 0.75, 0.12, dark, -a);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 10), green);
      crown.position.set(x, 0.78, z);
      groups[3].add(crown);
    }

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.22 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.72;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#fff5e6", "#40594c", 2.9));
    const sun = new THREE.DirectionalLight("#fff3df", 4.2);
    sun.position.set(-8, 16, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13 });
    sun.shadow.bias = -0.002;
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

    let raf = 0;
    let visible = true;
    let previous = performance.now();
    let angle = -0.42;
    let pointerTarget = 0;
    let pointerOffset = 0;
    let manualOffset = 0;
    let dragging = false;
    let lastPointerX = 0;
    let activePointerId: number | null = null;

    const pointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      lastPointerX = e.clientX;
      activePointerId = e.pointerId;
      pointerTarget = 0;
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
      pointerTarget = ((e.clientX - rect.left) / rect.width - 0.5) * 0.12;
    };

    const endDrag = (e: PointerEvent) => {
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
      pointerTarget = 0;
      container.style.cursor = "grab";
      start();
    };

    const leave = () => {
      if (!dragging) pointerTarget = 0;
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
        const next = THREE.MathUtils.damp(g.scale.y, target, 8, dt);
        g.scale.y = Math.max(0.001, next);
        g.visible = next > 0.01;
        g.position.y = (1 - next) * -0.42;
      });

      rooftopWalkers.forEach((walker, index) => {
        const a = walker.offset + now * walker.speed;
        walker.group.position.set(
          Math.cos(a) * walker.radiusX,
          10.13 + Math.sin(now * 0.006 + index) * 0.012,
          Math.sin(a) * walker.radiusZ,
        );
        walker.group.rotation.y = -a + (walker.speed > 0 ? Math.PI / 2 : -Math.PI / 2);
      });

      if (!dragging) angle = (angle + dt * 0.042) % (Math.PI * 2);
      pointerOffset = THREE.MathUtils.damp(pointerOffset, pointerTarget, 5, dt);
      building.rotation.y = angle + manualOffset + pointerOffset;
      building.position.y = 0.08 + Math.sin(now * 0.00105) * 0.09;
      building.rotation.z = Math.sin(now * 0.00055) * 0.003;

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
      if (!document.hidden) start();
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
      aria-label={`Immeuble contemporain ovale en trois dimensions — phase ${phase + 1} sur 4. Glissez horizontalement pour le faire pivoter.`}
    />
  );
}
