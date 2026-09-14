import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function PublicWorksScene({
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
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 120);
    camera.position.set(15.8, 12.8, 18.8);
    camera.lookAt(0, 0.85, 0);

    const works = new THREE.Group();
    works.scale.setScalar(0.92);
    scene.add(works);

    const mat = {
      soil: new THREE.MeshStandardMaterial({ color: "#6d5948", roughness: 1 }),
      subbase: new THREE.MeshStandardMaterial({ color: "#9d9b94", roughness: 1 }),
      gravel: new THREE.MeshStandardMaterial({ color: "#858984", roughness: 1 }),
      asphalt: new THREE.MeshStandardMaterial({ color: "#2d3131", roughness: 0.96 }),
      asphaltLight: new THREE.MeshStandardMaterial({ color: "#424747", roughness: 0.95 }),
      curb: new THREE.MeshStandardMaterial({ color: "#d7d3ca", roughness: 0.9 }),
      concrete: new THREE.MeshStandardMaterial({ color: "#c7c3ba", roughness: 0.93 }),
      sidewalk: new THREE.MeshStandardMaterial({ color: "#b9b5ac", roughness: 0.96 }),
      cycle: new THREE.MeshStandardMaterial({ color: "#9d6248", roughness: 0.92 }),
      white: new THREE.MeshStandardMaterial({ color: "#f2f0e8", roughness: 0.72 }),
      yellow: new THREE.MeshStandardMaterial({ color: "#d9ad45", roughness: 0.75 }),
      orange: new THREE.MeshStandardMaterial({ color: "#d66f37", roughness: 0.74 }),
      dark: new THREE.MeshStandardMaterial({ color: "#171d1c", roughness: 0.5, metalness: 0.32 }),
      pole: new THREE.MeshStandardMaterial({ color: "#636b68", roughness: 0.44, metalness: 0.58 }),
      grass: new THREE.MeshStandardMaterial({ color: "#567257", roughness: 1 }),
      foliage: new THREE.MeshStandardMaterial({ color: "#365843", roughness: 1 }),
      foliage2: new THREE.MeshStandardMaterial({ color: "#4d6c4f", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#5c4635", roughness: 1 }),
      skin: new THREE.MeshStandardMaterial({ color: "#c99676", roughness: 0.84 }),
      red: new THREE.MeshStandardMaterial({ color: "#a9473f", roughness: 0.72 }),
      blue: new THREE.MeshStandardMaterial({ color: "#496f85", roughness: 0.72 }),
      green: new THREE.MeshStandardMaterial({ color: "#4e6f55", roughness: 0.95 }),
      wood: new THREE.MeshStandardMaterial({ color: "#8b6648", roughness: 0.82 }),
      glass: new THREE.MeshPhysicalMaterial({
        color: "#9cb5b8",
        roughness: 0.12,
        metalness: 0.04,
        transparent: true,
        opacity: 0.72,
      }),
      carWhite: new THREE.MeshStandardMaterial({ color: "#dcdedb", roughness: 0.44, metalness: 0.18 }),
      carRed: new THREE.MeshStandardMaterial({ color: "#7d302d", roughness: 0.42, metalness: 0.2 }),
      carBlue: new THREE.MeshStandardMaterial({ color: "#314e63", roughness: 0.44, metalness: 0.2 }),
      carGray: new THREE.MeshStandardMaterial({ color: "#636968", roughness: 0.46, metalness: 0.22 }),
      signBlue: new THREE.MeshStandardMaterial({ color: "#245f8a", roughness: 0.58 }),
    };

    const groups = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
    groups.forEach((g) => {
      g.scale.y = 0.001;
      g.visible = false;
      works.add(g);
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

    const cylinder = (
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      r: number,
      h: number,
      material: THREE.Material,
      segments = 24,
    ) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, segments), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    };

    const sphere = (
      g: THREE.Group,
      x: number,
      y: number,
      z: number,
      r: number,
      material: THREE.Material,
      detail = 16,
    ) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, detail, Math.max(10, detail - 4)), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      g.add(mesh);
      return mesh;
    };

    const tree = (g: THREE.Group, x: number, z: number, s = 1) => {
      cylinder(g, x, 0.56 * s, z, 0.055 * s, 1.12 * s, mat.trunk, 10);
      sphere(g, x, 1.28 * s, z, 0.34 * s, mat.foliage, 14);
      sphere(g, x + 0.22 * s, 1.21 * s, z + 0.06 * s, 0.24 * s, mat.foliage2, 14);
      sphere(g, x - 0.2 * s, 1.18 * s, z - 0.05 * s, 0.22 * s, mat.foliage, 14);
    };

    const person = (g: THREE.Group, x: number, z: number, shirt: THREE.Material, scale = 1) => {
      const p = new THREE.Group();
      p.position.set(x, 0.38, z);
      const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.09 * scale, 0.28 * scale, 4, 8),
        shirt,
      );
      body.position.y = 0.31 * scale;
      const head = new THREE.Mesh(
        new THREE.SphereGeometry(0.09 * scale, 12, 10),
        mat.skin,
      );
      head.position.y = 0.66 * scale;
      p.add(body, head);
      g.add(p);
      return p;
    };

    const car = (g: THREE.Group, material: THREE.Material, scale = 1) => {
      const c = new THREE.Group();
      const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.0 * scale, 0.24 * scale, 0.5 * scale), material);
      chassis.position.y = 0.18 * scale;
      chassis.castShadow = true;
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(0.58 * scale, 0.23 * scale, 0.44 * scale), mat.glass);
      cabin.position.set(-0.05 * scale, 0.4 * scale, 0);
      cabin.castShadow = true;
      const wheelGeo = new THREE.CylinderGeometry(0.105 * scale, 0.105 * scale, 0.065 * scale, 14);
      wheelGeo.rotateX(Math.PI / 2);
      for (const x of [-0.31, 0.31]) {
        for (const z of [-0.27, 0.27]) {
          const wheel = new THREE.Mesh(wheelGeo, mat.dark);
          wheel.position.set(x * scale, 0.09 * scale, z * scale);
          c.add(wheel);
        }
      }
      c.add(chassis, cabin);
      g.add(c);
      return c;
    };

    const flatRing = (
      g: THREE.Group,
      inner: number,
      outer: number,
      y: number,
      material: THREE.Material,
      segments = 96,
    ) => {
      const mesh = new THREE.Mesh(new THREE.RingGeometry(inner, outer, segments), material);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = y;
      mesh.receiveShadow = true;
      g.add(mesh);
      return mesh;
    };

    // 01 — Terrassement / réseaux enterrés.
    box(groups[0], 0, -0.28, 0, 16.6, 0.48, 11.2, mat.soil);
    box(groups[0], 0, -0.02, 0, 12.8, 0.18, 6.2, mat.subbase);
    box(groups[0], -4.9, 0.05, 0, 0.95, 0.32, 5.5, mat.soil);
    for (let i = 0; i < 4; i += 1) {
      const duct = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.065, 5.1, 14),
        i === 0 ? mat.orange : mat.dark,
      );
      duct.rotation.x = Math.PI / 2;
      duct.position.set(-5.05 + i * 0.19, 0.08, 0);
      groups[0].add(duct);
    }

    // 02 — Structure de chaussée / bordures / drainage.
    box(groups[1], 0, 0.12, 0, 13.5, 0.26, 6.5, mat.gravel);
    box(groups[1], 0, 0.28, 0, 12.2, 0.08, 5.45, mat.subbase);
    box(groups[1], 0, 0.34, -3.05, 13.9, 0.16, 0.22, mat.curb);
    box(groups[1], 0, 0.34, 3.05, 13.9, 0.16, 0.22, mat.curb);
    box(groups[1], 0, 0.3, -3.78, 14.2, 0.12, 1.2, mat.sidewalk);
    box(groups[1], 0, 0.3, 3.78, 14.2, 0.12, 1.2, mat.sidewalk);
    box(groups[1], 0, 0.35, -3.27, 14.0, 0.035, 0.45, mat.cycle);
    box(groups[1], 0, 0.35, 3.27, 14.0, 0.035, 0.45, mat.cycle);

    // 03 — Enrobés, marquage et équipements de base.
    box(groups[2], 0, 0.44, 0, 12.2, 0.14, 5.45, mat.asphalt);
    for (let x = -5.3; x <= 5.3; x += 1.45) {
      box(groups[2], x, 0.525, 0, 0.72, 0.018, 0.07, mat.white);
    }
    box(groups[2], 0, 0.525, -2.5, 11.4, 0.018, 0.075, mat.white);
    box(groups[2], 0, 0.525, 2.5, 11.4, 0.018, 0.075, mat.white);
    for (let i = 0; i < 8; i += 1) {
      box(groups[2], 4.6, 0.53, -1.42 + i * 0.4, 1.15, 0.02, 0.15, mat.white);
    }

    // 04 — Aménagement urbain final : giratoire compact et crédible.
    const g4 = groups[3];

    // Branches du carrefour et anneau circulable, à plat.
    box(g4, 0, 0.46, 0, 13.8, 0.13, 4.25, mat.asphaltLight);
    box(g4, 0, 0.46, 0, 4.25, 0.13, 10.6, mat.asphaltLight);
    flatRing(g4, 1.35, 3.05, 0.535, mat.asphalt, 112);

    // Ilot central franchissable + cœur végétalisé.
    flatRing(g4, 1.05, 1.35, 0.55, mat.curb, 96);
    cylinder(g4, 0, 0.55, 0, 1.04, 0.13, mat.grass, 72);
    cylinder(g4, 0, 0.64, 0, 0.63, 0.08, mat.green, 72);
    for (const [x, z, s] of [
      [-0.25, 0.18, 0.46],
      [0.28, -0.12, 0.42],
      [0.12, 0.38, 0.34],
    ] as const) tree(g4, x, z, s);

    // Ilots séparateurs aux quatre entrées.
    const splitter = (x: number, z: number, rot = 0) => {
      const island = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.12, 0.36), mat.curb);
      island.position.set(x, 0.58, z);
      island.rotation.y = rot;
      island.castShadow = true;
      g4.add(island);
      const green = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.08, 0.18), mat.green);
      green.position.set(x, 0.67, z);
      green.rotation.y = rot;
      g4.add(green);
    };
    splitter(-4.3, 0);
    splitter(4.3, 0);
    splitter(0, -3.65, Math.PI / 2);
    splitter(0, 3.65, Math.PI / 2);

    // Lignes cédez-le-passage / guidage circulaire.
    const dashRing = (radius: number, count: number) => {
      for (let i = 0; i < count; i += 1) {
        const a = (i / count) * Math.PI * 2;
        const x = Math.cos(a) * radius;
        const z = Math.sin(a) * radius;
        const dash = box(g4, x, 0.555, z, 0.38, 0.018, 0.07, mat.white, -a);
        dash.castShadow = false;
      }
    };
    dashRing(2.35, 22);

    // Passages piétons en retrait des entrées.
    const zebraX = (x: number) => {
      for (let i = -3; i <= 3; i += 1) box(g4, x, 0.555, i * 0.24, 0.62, 0.018, 0.12, mat.white);
    };
    const zebraZ = (z: number) => {
      for (let i = -3; i <= 3; i += 1) box(g4, i * 0.24, 0.555, z, 0.12, 0.018, 0.62, mat.white);
    };
    zebraX(-5.35);
    zebraX(5.35);
    zebraZ(-4.65);
    zebraZ(4.65);

    // Trottoirs, pistes cyclables et espaces verts périphériques.
    box(g4, 0, 0.3, -4.55, 14.0, 0.1, 1.18, mat.sidewalk);
    box(g4, 0, 0.3, 4.55, 14.0, 0.1, 1.18, mat.sidewalk);
    box(g4, -6.45, 0.3, 0, 1.18, 0.1, 8.2, mat.sidewalk);
    box(g4, 6.45, 0.3, 0, 1.18, 0.1, 8.2, mat.sidewalk);
    box(g4, 0, 0.355, -4.02, 13.5, 0.025, 0.35, mat.cycle);
    box(g4, 0, 0.355, 4.02, 13.5, 0.025, 0.35, mat.cycle);
    box(g4, -6.0, 0.355, 0, 0.35, 0.025, 7.7, mat.cycle);
    box(g4, 6.0, 0.355, 0, 0.35, 0.025, 7.7, mat.cycle);

    // Plantation régulière, avec recul par rapport aux visibilités du giratoire.
    for (const x of [-5.6, -3.6, 3.6, 5.6]) {
      tree(g4, x, -5.0, 0.7);
      tree(g4, x, 5.0, 0.68);
    }
    for (const z of [-3.0, 3.0]) {
      tree(g4, -6.8, z, 0.64);
      tree(g4, 6.8, z, 0.64);
    }

    // Eclairage public sobre et cohérent.
    const lamp = (x: number, z: number, rot = 0) => {
      cylinder(g4, x, 1.55, z, 0.045, 2.5, mat.pole, 12);
      box(g4, x + Math.cos(rot) * 0.18, 2.74, z + Math.sin(rot) * 0.18, 0.38, 0.05, 0.07, mat.dark, -rot);
    };
    for (const [x, z, r] of [
      [-5.4, -4.2, 0],
      [-1.8, -4.2, 0],
      [1.8, -4.2, Math.PI],
      [5.4, -4.2, Math.PI],
      [-5.4, 4.2, 0],
      [-1.8, 4.2, 0],
      [1.8, 4.2, Math.PI],
      [5.4, 4.2, Math.PI],
    ] as const) lamp(x, z, r);

    // Signalisation du giratoire et cédez-le-passage.
    const sign = (x: number, z: number, rot = 0) => {
      cylinder(g4, x, 0.95, z, 0.025, 1.35, mat.pole, 10);
      const panel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 28), mat.signBlue);
      panel.rotation.z = Math.PI / 2;
      panel.rotation.y = rot;
      panel.position.set(x, 1.55, z);
      g4.add(panel);
    };
    sign(-4.65, 1.05, Math.PI / 2);
    sign(4.65, -1.05, -Math.PI / 2);
    sign(1.05, -3.95, 0);
    sign(-1.05, 3.95, Math.PI);

    // Mobilier urbain en dehors des trajectoires piétonnes.
    for (const [x, z, r] of [
      [-3.0, 4.75, 0],
      [3.0, -4.75, Math.PI],
    ] as const) {
      box(g4, x, 0.48, z, 1.25, 0.1, 0.4, mat.wood, r);
      box(g4, x, 0.78, z + (r === 0 ? 0.16 : -0.16), 1.25, 0.45, 0.06, mat.dark, r);
    }

    const pedestrians = [
      person(g4, -5.2, 3.75, mat.blue, 0.9),
      person(g4, 5.1, -3.65, mat.red, 0.88),
      person(g4, -2.5, -4.55, mat.yellow, 0.84),
      person(g4, 2.6, 4.55, mat.blue, 0.82),
    ];

    // Trafic final : voitures sur l'anneau + approches.
    const cars = [
      car(g4, mat.carWhite, 0.75),
      car(g4, mat.carBlue, 0.72),
      car(g4, mat.carRed, 0.7),
      car(g4, mat.carGray, 0.74),
      car(g4, mat.carWhite, 0.68),
    ];

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(220, 220),
      new THREE.ShadowMaterial({ opacity: 0.16 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.48;
    ground.receiveShadow = true;
    scene.add(ground);

    scene.add(new THREE.HemisphereLight("#f8f4ea", "#435247", 2.2));
    const sun = new THREE.DirectionalLight("#fff2df", 3.3);
    sun.position.set(-8, 16, 11);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 15, bottom: -15 });
    sun.shadow.bias = -0.0015;
    scene.add(sun);

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
    let previous = performance.now();
    let angle = -0.35;
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
      const delta = dx * 0.007;
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
        g.position.y = (1 - next) * -0.26;
      });

      if (!dragging) {
        angle += (0.026 + dragVelocity) * dt;
        dragVelocity = THREE.MathUtils.damp(dragVelocity, 0, 3.4, dt);
      }
      works.rotation.y = angle;
      works.position.y = 0.035 + Math.sin(now * 0.0009) * 0.035;

      if (phaseRef.current === 3) {
        const t = now * 0.00042;

        // Deux véhicules circulent réellement dans le giratoire.
        [0, 1, 2].forEach((idx) => {
          const a = t * (0.85 + idx * 0.07) + idx * 2.1;
          const radius = idx === 1 ? 2.18 : 2.5;
          cars[idx].position.set(Math.cos(a) * radius, 0.61, Math.sin(a) * radius);
          cars[idx].rotation.y = -a + Math.PI / 2;
        });

        // Deux véhicules sur les branches d'approche.
        const xLoop = ((t * 3.6) % 12.2) - 6.1;
        cars[3].position.set(xLoop, 0.61, -1.05);
        cars[3].rotation.y = 0;
        cars[4].position.set(-1.0, 0.61, -xLoop * 0.72);
        cars[4].rotation.y = Math.PI / 2;

        pedestrians.forEach((p, i) => {
          p.position.y = 0.38 + Math.sin(now * 0.003 + i) * 0.018;
        });
      }

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    const start = () => {
      if (!raf && visible && !document.hidden) {
        previous = performance.now();
        raf = requestAnimationFrame(render);
      }
    };
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
      renderer.domElement.removeEventListener("pointerdown", down);
      renderer.domElement.removeEventListener("pointermove", move);
      renderer.domElement.removeEventListener("pointerup", up);
      renderer.domElement.removeEventListener("pointercancel", up);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
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
  }, [onFailure]);

  return (
    <div
      ref={host}
      className="building-canvas"
      role="img"
      aria-label={`Travaux publics et aménagement urbain en trois dimensions — phase ${phase + 1} sur 4`}
    />
  );
}
