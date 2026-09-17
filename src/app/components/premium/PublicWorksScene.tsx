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
    renderer.toneMappingExposure = 1.03;
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
      asphalt: new THREE.MeshStandardMaterial({ color: "#2c3030", roughness: 0.97 }),
      asphaltLight: new THREE.MeshStandardMaterial({ color: "#3b4140", roughness: 0.96 }),
      curb: new THREE.MeshStandardMaterial({ color: "#d8d5cc", roughness: 0.92 }),
      sidewalk: new THREE.MeshStandardMaterial({ color: "#c3beb4", roughness: 0.96 }),
      sidewalkInset: new THREE.MeshStandardMaterial({ color: "#aaa69d", roughness: 0.98 }),
      cycle: new THREE.MeshStandardMaterial({ color: "#a36649", roughness: 0.93 }),
      white: new THREE.MeshStandardMaterial({ color: "#f2efe7", roughness: 0.74 }),
      orange: new THREE.MeshStandardMaterial({ color: "#d66f37", roughness: 0.74 }),
      dark: new THREE.MeshStandardMaterial({ color: "#18201e", roughness: 0.5, metalness: 0.32 }),
      pole: new THREE.MeshStandardMaterial({ color: "#4d5653", roughness: 0.43, metalness: 0.62 }),
      lamp: new THREE.MeshStandardMaterial({ color: "#222a28", roughness: 0.42, metalness: 0.52 }),
      grass: new THREE.MeshStandardMaterial({ color: "#567257", roughness: 1 }),
      foliage: new THREE.MeshStandardMaterial({ color: "#365843", roughness: 1 }),
      foliage2: new THREE.MeshStandardMaterial({ color: "#4d6c4f", roughness: 1 }),
      trunk: new THREE.MeshStandardMaterial({ color: "#5c4635", roughness: 1 }),
      skin: new THREE.MeshStandardMaterial({ color: "#c99676", roughness: 0.84 }),
      red: new THREE.MeshStandardMaterial({ color: "#a9473f", roughness: 0.72 }),
      blue: new THREE.MeshStandardMaterial({ color: "#496f85", roughness: 0.72 }),
      yellow: new THREE.MeshStandardMaterial({ color: "#d9ad45", roughness: 0.75 }),
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
      signBlue: new THREE.MeshStandardMaterial({ color: "#275f82", roughness: 0.58 }),
      signWhite: new THREE.MeshStandardMaterial({ color: "#f4f1e9", roughness: 0.65 }),
    };

    const groups = [new THREE.Group(), new THREE.Group(), new THREE.Group(), new THREE.Group()];
    groups.forEach((group) => {
      group.scale.y = 0.001;
      group.visible = false;
      works.add(group);
    });

    const box = (
      group: THREE.Group,
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
      group.add(mesh);
      return mesh;
    };

    const cylinder = (
      group: THREE.Group,
      x: number,
      y: number,
      z: number,
      radius: number,
      height: number,
      material: THREE.Material,
      segments = 24,
    ) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };

    const sphere = (
      group: THREE.Group,
      x: number,
      y: number,
      z: number,
      radius: number,
      material: THREE.Material,
      detail = 16,
    ) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, detail, Math.max(10, detail - 4)), material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      group.add(mesh);
      return mesh;
    };

    const flatRing = (
      group: THREE.Group,
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
      group.add(mesh);
      return mesh;
    };

    const tree = (group: THREE.Group, x: number, z: number, scale = 1) => {
      cylinder(group, x, 0.56 * scale, z, 0.055 * scale, 1.12 * scale, mat.trunk, 10);
      sphere(group, x, 1.28 * scale, z, 0.34 * scale, mat.foliage, 14);
      sphere(group, x + 0.22 * scale, 1.21 * scale, z + 0.06 * scale, 0.24 * scale, mat.foliage2, 14);
      sphere(group, x - 0.2 * scale, 1.18 * scale, z - 0.05 * scale, 0.22 * scale, mat.foliage, 14);
    };

    const person = (group: THREE.Group, x: number, z: number, shirt: THREE.Material, scale = 1) => {
      const p = new THREE.Group();
      p.position.set(x, 0.38, z);
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.09 * scale, 0.28 * scale, 4, 8), shirt);
      body.position.y = 0.31 * scale;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.09 * scale, 12, 10), mat.skin);
      head.position.y = 0.66 * scale;
      p.add(body, head);
      group.add(p);
      return p;
    };

    const car = (group: THREE.Group, material: THREE.Material, scale = 1) => {
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
      group.add(c);
      return c;
    };

    // 01 — terrassement et réseaux enterrés.
    box(groups[0], 0, -0.28, 0, 16.6, 0.48, 11.2, mat.soil);
    box(groups[0], 0, -0.02, 0, 12.8, 0.18, 6.2, mat.subbase);
    box(groups[0], -4.9, 0.05, 0, 0.95, 0.32, 5.5, mat.soil);
    for (let i = 0; i < 4; i += 1) {
      const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 5.1, 14), i === 0 ? mat.orange : mat.dark);
      duct.rotation.x = Math.PI / 2;
      duct.position.set(-5.05 + i * 0.19, 0.08, 0);
      groups[0].add(duct);
    }

    // 02 — structure de chaussée, bordures et drainage.
    box(groups[1], 0, 0.12, 0, 13.5, 0.26, 6.5, mat.gravel);
    box(groups[1], 0, 0.28, 0, 12.2, 0.08, 5.45, mat.subbase);
    box(groups[1], 0, 0.34, -3.05, 13.9, 0.16, 0.22, mat.curb);
    box(groups[1], 0, 0.34, 3.05, 13.9, 0.16, 0.22, mat.curb);
    box(groups[1], 0, 0.3, -3.78, 14.2, 0.12, 1.2, mat.sidewalk);
    box(groups[1], 0, 0.3, 3.78, 14.2, 0.12, 1.2, mat.sidewalk);
    box(groups[1], 0, 0.35, -3.27, 14.0, 0.035, 0.45, mat.cycle);
    box(groups[1], 0, 0.35, 3.27, 14.0, 0.035, 0.45, mat.cycle);

    // 03 — enrobés et marquage.
    box(groups[2], 0, 0.44, 0, 12.2, 0.14, 5.45, mat.asphalt);
    for (let x = -5.3; x <= 5.3; x += 1.45) box(groups[2], x, 0.525, 0, 0.72, 0.018, 0.07, mat.white);
    box(groups[2], 0, 0.525, -2.5, 11.4, 0.018, 0.075, mat.white);
    box(groups[2], 0, 0.525, 2.5, 11.4, 0.018, 0.075, mat.white);
    for (let i = 0; i < 8; i += 1) box(groups[2], 4.6, 0.53, -1.42 + i * 0.4, 1.15, 0.02, 0.15, mat.white);

    // 04 — aménagement urbain final : giratoire et mobilier correctement implanté.
    const g4 = groups[3];

    // Chaussées en croix + giratoire central.
    box(g4, 0, 0.46, 0, 13.8, 0.13, 4.25, mat.asphaltLight);
    box(g4, 0, 0.46, 0, 4.25, 0.13, 10.6, mat.asphaltLight);
    flatRing(g4, 1.35, 3.05, 0.535, mat.asphalt, 112);

    // Îlot central paysager.
    flatRing(g4, 1.05, 1.35, 0.55, mat.curb, 96);
    cylinder(g4, 0, 0.55, 0, 1.04, 0.13, mat.grass, 72);
    cylinder(g4, 0, 0.64, 0, 0.63, 0.08, mat.green, 72);
    for (const [x, z, s] of [[-0.25, 0.18, 0.46], [0.28, -0.12, 0.42], [0.12, 0.38, 0.34]] as const) {
      tree(g4, x, z, s);
    }

    // Îlots séparateurs : les panneaux seront implantés dessus, jamais dans les voies.
    const splitter = (x: number, z: number, rot = 0) => {
      const island = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.14, 0.46), mat.curb);
      island.position.set(x, 0.59, z);
      island.rotation.y = rot;
      island.castShadow = true;
      island.receiveShadow = true;
      g4.add(island);

      const center = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.08, 0.23), mat.green);
      center.position.set(x, 0.69, z);
      center.rotation.y = rot;
      g4.add(center);
    };
    splitter(-4.25, 0);
    splitter(4.25, 0);
    splitter(0, -3.62, Math.PI / 2);
    splitter(0, 3.62, Math.PI / 2);

    // Marquage circulaire.
    for (let i = 0; i < 22; i += 1) {
      const a = (i / 22) * Math.PI * 2;
      const dash = box(g4, Math.cos(a) * 2.35, 0.555, Math.sin(a) * 2.35, 0.38, 0.018, 0.07, mat.white, -a);
      dash.castShadow = false;
    }

    const zebraX = (x: number) => {
      for (let i = -3; i <= 3; i += 1) box(g4, x, 0.555, i * 0.24, 0.62, 0.018, 0.12, mat.white);
    };
    const zebraZ = (z: number) => {
      for (let i = -3; i <= 3; i += 1) box(g4, i * 0.24, 0.555, z, 0.12, 0.018, 0.62, mat.white);
    };
    zebraX(-5.32);
    zebraX(5.32);
    zebraZ(-4.62);
    zebraZ(4.62);

    // Trottoirs : bandes extérieures clairement séparées de la chaussée.
    box(g4, 0, 0.3, -4.62, 14.0, 0.12, 1.32, mat.sidewalk);
    box(g4, 0, 0.3, 4.62, 14.0, 0.12, 1.32, mat.sidewalk);
    box(g4, -6.52, 0.3, 0, 1.34, 0.12, 8.35, mat.sidewalk);
    box(g4, 6.52, 0.3, 0, 1.34, 0.12, 8.35, mat.sidewalk);

    // Pistes cyclables côté chaussée ; mobilier urbain côté extérieur.
    box(g4, 0, 0.365, -4.02, 13.52, 0.026, 0.34, mat.cycle);
    box(g4, 0, 0.365, 4.02, 13.52, 0.026, 0.34, mat.cycle);
    box(g4, -6.0, 0.365, 0, 0.34, 0.026, 7.75, mat.cycle);
    box(g4, 6.0, 0.365, 0, 0.34, 0.026, 7.75, mat.cycle);

    // Liserés de séparation pour rendre les zones très lisibles.
    box(g4, 0, 0.39, -4.24, 13.7, 0.025, 0.045, mat.curb);
    box(g4, 0, 0.39, 4.24, 13.7, 0.025, 0.045, mat.curb);
    box(g4, -6.22, 0.39, 0, 0.045, 0.025, 7.95, mat.curb);
    box(g4, 6.22, 0.39, 0, 0.045, 0.025, 7.95, mat.curb);

    // Arbres sur la bande extérieure du trottoir uniquement.
    for (const x of [-5.65, -3.55, 3.55, 5.65]) {
      tree(g4, x, -5.05, 0.68);
      tree(g4, x, 5.05, 0.68);
    }
    for (const z of [-2.7, 2.7]) {
      tree(g4, -6.92, z, 0.62);
      tree(g4, 6.92, z, 0.62);
    }

    // Lampadaires : tous sur la bande arrière du trottoir, jamais sur la chaussée/piste.
    const lamp = (x: number, z: number, facing: "north" | "south" | "east" | "west") => {
      cylinder(g4, x, 1.58, z, 0.045, 2.52, mat.pole, 12);

      let armX = 0;
      let armZ = 0;
      let rot = 0;
      if (facing === "north") { armZ = 0.22; rot = Math.PI / 2; }
      if (facing === "south") { armZ = -0.22; rot = Math.PI / 2; }
      if (facing === "east") { armX = 0.22; rot = 0; }
      if (facing === "west") { armX = -0.22; rot = 0; }

      box(g4, x + armX / 2, 2.72, z + armZ / 2, Math.abs(armX) || 0.08, 0.055, Math.abs(armZ) || 0.08, mat.pole, rot);
      box(g4, x + armX, 2.7, z + armZ, facing === "east" || facing === "west" ? 0.32 : 0.1, 0.065, facing === "north" || facing === "south" ? 0.32 : 0.1, mat.lamp);
    };

    const lampLayout: Array<[number, number, "north" | "south" | "east" | "west"]> = [
      [-4.15, -4.94, "north"], [0, -4.94, "north"], [4.15, -4.94, "north"],
      [-4.15, 4.94, "south"], [0, 4.94, "south"], [4.15, 4.94, "south"],
      [-6.88, -2.35, "east"], [-6.88, 2.35, "east"],
      [6.88, -2.35, "west"], [6.88, 2.35, "west"],
    ];
    lampLayout.forEach(([x, z, direction]) => lamp(x, z, direction));

    // Panneaux directionnels implantés au centre des îlots séparateurs.
    const sign = (x: number, z: number, rot = 0) => {
      cylinder(g4, x, 1.0, z, 0.025, 1.28, mat.pole, 10);
      const panel = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.045, 32), mat.signBlue);
      panel.rotation.z = Math.PI / 2;
      panel.rotation.y = rot;
      panel.position.set(x, 1.58, z);
      panel.castShadow = true;
      g4.add(panel);

      const inset = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.048, 32), mat.signWhite);
      inset.rotation.z = Math.PI / 2;
      inset.rotation.y = rot;
      inset.position.set(x, 1.58, z);
      g4.add(inset);
    };
    sign(-4.25, 0, Math.PI / 2);
    sign(4.25, 0, -Math.PI / 2);
    sign(0, -3.62, 0);
    sign(0, 3.62, Math.PI);

    // Bancs également en retrait, derrière la piste cyclable.
    const bench = (x: number, z: number, rot = 0) => {
      box(g4, x, 0.47, z, 1.25, 0.1, 0.4, mat.wood, rot);
      const offset = rot === 0 ? 0.16 : -0.16;
      box(g4, x, 0.78, z + offset, 1.25, 0.45, 0.06, mat.dark, rot);
    };
    bench(-2.9, 4.88, 0);
    bench(2.9, -4.88, Math.PI);

    // Piétons exclusivement sur les trottoirs / passages piétons.
    const pedestrians = [
      person(g4, -5.65, 4.56, mat.blue, 0.9),
      person(g4, 5.65, -4.56, mat.red, 0.88),
      person(g4, -2.45, -4.88, mat.yellow, 0.84),
      person(g4, 2.45, 4.88, mat.blue, 0.82),
    ];

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
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
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

    const down = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      dragVelocity = 0;
      renderer.domElement.setPointerCapture?.(event.pointerId);
      renderer.domElement.style.cursor = "grabbing";
    };
    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      const delta = dx * 0.007;
      angle += delta;
      dragVelocity = delta;
    };
    const up = (event: PointerEvent) => {
      dragging = false;
      renderer.domElement.releasePointerCapture?.(event.pointerId);
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

      groups.forEach((group, index) => {
        const target = index <= phaseRef.current ? 1 : 0;
        const next = THREE.MathUtils.damp(group.scale.y, target, 8, dt);
        group.scale.y = Math.max(0.001, next);
        group.visible = next > 0.01;
        group.position.y = (1 - next) * -0.26;
      });

      if (!dragging) {
        angle += (0.026 + dragVelocity) * dt;
        dragVelocity = THREE.MathUtils.damp(dragVelocity, 0, 3.4, dt);
      }
      works.rotation.y = angle;
      works.position.y = 0.035 + Math.sin(now * 0.0009) * 0.035;

      if (phaseRef.current === 3) {
        const t = now * 0.00034;
        const roundaboutRadius = 2.38;
        const offsets = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];

        [0, 1, 2].forEach((idx) => {
          const a = t + offsets[idx];
          cars[idx].position.set(Math.cos(a) * roundaboutRadius, 0.61, Math.sin(a) * roundaboutRadius);
          cars[idx].rotation.y = -a + Math.PI / 2;
        });

        const shuttle = (Math.sin(t * 1.6) + 1) / 2;
        const approach = 6.0 - shuttle * 2.0;
        cars[3].position.set(-approach, 0.61, -1.1);
        cars[3].rotation.y = 0;
        cars[4].position.set(1.1, 0.61, approach);
        cars[4].rotation.y = -Math.PI / 2;

        pedestrians.forEach((pedestrian, index) => {
          pedestrian.position.y = 0.38 + Math.sin(now * 0.003 + index) * 0.018;
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
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
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
