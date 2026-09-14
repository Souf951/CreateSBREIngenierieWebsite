import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import "../../styles/building-model-lab.css";

type ModelLevel = 0 | 1 | 2 | 3;

const OPTIONS = [
  {
    kicker: "01 / ESSENTIEL",
    title: "Maquette actuelle",
    body: "Lecture rapide des volumes, dalles, vitrages et garde-corps. Version légère.",
  },
  {
    kicker: "02 / MATÉRIAUX PBR",
    title: "Façade réaliste",
    body: "Béton texturé, menuiseries sombres, verre physique, ombres de contact et lumière HDRI urbaine.",
  },
  {
    kicker: "03 / HABITÉ",
    title: "Micro-logements visibles",
    body: "Studios meublés, couloir central, portes palières, éclairage chaud et silhouettes discrètes.",
  },
  {
    kicker: "04 / COUPE RÉELLE",
    title: "Coupe architecturale interactive",
    body: "La façade se coupe progressivement sous la souris pour révéler le couloir central et les studios sans séparer artificiellement le bâtiment.",
  },
] as const;

const HDRI = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/urban_street_03_1k.hdr";

function textureFromCanvas(renderer: THREE.WebGLRenderer, kind: "concrete" | "wood" | "asphalt") {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const x = c.getContext("2d")!;

  if (kind === "concrete") {
    x.fillStyle = "#b98f78";
    x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 3800; i += 1) {
      const n = 118 + Math.random() * 90;
      x.fillStyle = `rgba(${n},${n * 0.82},${n * 0.74},${0.018 + Math.random() * 0.045})`;
      const r = 0.4 + Math.random() * 2.8;
      x.fillRect(Math.random() * 512, Math.random() * 512, r, r);
    }
    for (let y = 52; y < 512; y += 96) {
      x.fillStyle = "rgba(52,39,33,.07)";
      x.fillRect(0, y, 512, 1);
    }
  } else if (kind === "wood") {
    x.fillStyle = "#8b6a47";
    x.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 16) {
      x.strokeStyle = `rgba(55,34,20,${0.08 + Math.random() * 0.08})`;
      x.beginPath();
      x.moveTo(0, y + Math.random() * 4);
      x.bezierCurveTo(150, y - 3, 350, y + 5, 512, y + Math.random() * 4);
      x.stroke();
    }
  } else {
    x.fillStyle = "#303533";
    x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 7000; i += 1) {
      const n = 60 + Math.random() * 60;
      x.fillStyle = `rgba(${n},${n},${n},${0.04 + Math.random() * 0.08})`;
      x.fillRect(Math.random() * 512, Math.random() * 512, 1.2, 1.2);
    }
  }

  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(kind === "wood" ? 5 : 3, kind === "wood" ? 2 : 3);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}

function box(
  parent: THREE.Object3D,
  size: [number, number, number],
  pos: [number, number, number],
  material: THREE.Material,
  cast = true,
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...pos);
  mesh.castShadow = cast;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function person(parent: THREE.Object3D, x: number, y: number, z: number, color: number, scale = 1) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.075, 0.28, 4, 8),
    new THREE.MeshStandardMaterial({ color, roughness: 0.86 }),
  );
  body.position.y = 0.27;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.075, 12, 9),
    new THREE.MeshStandardMaterial({ color: 0xc58d70, roughness: 0.95 }),
  );
  head.position.y = 0.53;
  g.add(body, head);
  g.position.set(x, y, z);
  g.scale.setScalar(scale);
  parent.add(g);
  return g;
}

function BuildingLabScene({ level }: { level: ModelLevel }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      stencil: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = level === 0 ? 1.12 : 1.02;
    renderer.localClippingEnabled = true;
    renderer.setClearColor(0xcfd5d1, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(level === 0 ? 0xe8ece9 : 0xcbd0cc);
    scene.fog = new THREE.Fog(0xcbd0cc, 26, 62);

    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 120);
    camera.position.set(18.8, 11.8, 21.8);
    camera.lookAt(0, 4.2, 0);

    scene.add(new THREE.HemisphereLight(0xf7fbff, 0x47524b, level === 0 ? 2.4 : 1.1));
    const sun = new THREE.DirectionalLight(0xfff4df, level === 0 ? 4.2 : 3.4);
    sun.position.set(10, 18, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -15;
    sun.shadow.camera.right = 15;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -8;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const envLoader = level >= 1 ? new RGBELoader() : null;
    let envTexture: THREE.Texture | null = null;
    if (envLoader) {
      envLoader.load(
        HDRI,
        (hdr) => {
          hdr.mapping = THREE.EquirectangularReflectionMapping;
          envTexture = hdr;
          scene.environment = hdr;
          if (level >= 2) scene.background = hdr;
        },
        undefined,
        () => {},
      );
    }

    const root = new THREE.Group();
    root.rotation.y = -0.55;
    root.position.y = 0.05;
    root.scale.setScalar(0.9);
    scene.add(root);

    const concreteMap = level >= 1 ? textureFromCanvas(renderer, "concrete") : null;
    const woodMap = level >= 1 ? textureFromCanvas(renderer, "wood") : null;
    const asphaltMap = textureFromCanvas(renderer, "asphalt");

    const clippingPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 99);
    const shellMaterials: THREE.Material[] = [];
    const shellMat = (m: THREE.Material) => {
      if (level === 3 && "clippingPlanes" in m) {
        (m as THREE.MeshStandardMaterial).clippingPlanes = [clippingPlane];
        (m as THREE.MeshStandardMaterial).clipShadows = true;
      }
      shellMaterials.push(m);
      return m;
    };

    const concrete = shellMat(
      new THREE.MeshStandardMaterial({
        color: level === 0 ? 0xd49d7c : 0xb88972,
        map: concreteMap ?? undefined,
        roughness: level === 0 ? 0.7 : 0.88,
        metalness: 0.01,
      }),
    );
    const concreteLight = shellMat(
      new THREE.MeshStandardMaterial({ color: 0xd7c5b7, roughness: 0.9 }),
    );
    const metal = shellMat(
      new THREE.MeshStandardMaterial({ color: 0x202422, roughness: 0.32, metalness: 0.72 }),
    );
    const glass = shellMat(
      new THREE.MeshPhysicalMaterial({
        color: level === 0 ? 0x829994 : 0x9eb1ad,
        roughness: level === 0 ? 0.24 : 0.08,
        metalness: 0.03,
        transmission: level >= 1 ? 0.22 : 0.05,
        transparent: true,
        opacity: level >= 1 ? 0.54 : 0.78,
        thickness: 0.12,
        ior: 1.45,
        envMapIntensity: level >= 1 ? 1.55 : 0.4,
      }),
    );
    const warmGlass = shellMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffd7a2,
        emissive: 0x8b4719,
        emissiveIntensity: level >= 2 ? 0.5 : 0,
        roughness: 0.16,
        transmission: 0.08,
        transparent: true,
        opacity: 0.72,
      }),
    );
    const interiorWall = new THREE.MeshStandardMaterial({ color: 0xe4e0d8, roughness: 0.93 });
    const corridorFloor = new THREE.MeshStandardMaterial({ color: 0xafa9a0, roughness: 0.9 });
    const oak = new THREE.MeshStandardMaterial({ color: 0x876548, map: woodMap ?? undefined, roughness: 0.86 });
    const linen = new THREE.MeshStandardMaterial({ color: 0xd7d2c9, roughness: 1 });
    const darkFabric = new THREE.MeshStandardMaterial({ color: 0x5a5d59, roughness: 1 });
    const lawn = new THREE.MeshStandardMaterial({ color: 0x536b53, roughness: 1 });
    const asphalt = new THREE.MeshStandardMaterial({ color: 0x3d4240, map: asphaltMap, roughness: 0.98 });

    // Real site base instead of a floating toy-like platform.
    const site = box(root, [16.5, 0.28, 11.8], [0, -0.22, 0], lawn, false);
    site.receiveShadow = true;
    box(root, [16.5, 0.08, 3.0], [0, -0.03, 5.25], asphalt, false);
    box(root, [4.2, 0.09, 1.9], [0, 0.0, 3.55], new THREE.MeshStandardMaterial({ color: 0xb6b1a9, roughness: 0.95 }), false);

    // Long residential volume: 9 floors, central corridor, studios on both façades.
    const floors = 9;
    const floorH = 0.94;
    const width = 10.8;
    const depth = 6.15;
    const corner = 1.25;

    const shell = new THREE.Group();
    const interiors = new THREE.Group();
    root.add(shell, interiors);

    const roundedSlab = (y: number, mat: THREE.Material, thickness = 0.17, expand = 0) => {
      box(shell, [width - corner * 2 + expand * 2, thickness, depth + expand * 2], [0, y, 0], mat);
      for (const sx of [-1, 1]) {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(depth / 2 + expand, depth / 2 + expand, thickness, 48), mat);
        c.position.set(sx * (width / 2 - corner), y, 0);
        c.scale.x = corner / (depth / 2) + expand * 0.02;
        c.castShadow = c.receiveShadow = true;
        shell.add(c);
      }
    };

    for (let f = 0; f < floors; f += 1) {
      const y = 0.38 + f * floorH;
      roundedSlab(y, concrete, 0.17, level >= 1 ? 0.03 : 0);

      // Main façades: module rhythm closer to a real micro-apartment building.
      const modules = 10;
      for (const zSide of [-1, 1] as const) {
        for (let m = 0; m < modules; m += 1) {
          const x = -4.65 + m * 1.035;
          const z = zSide * (depth / 2 - 0.09);
          const frame = box(shell, [0.055, 0.68, 0.08], [x, y + 0.47, z], metal, false);
          frame.castShadow = false;
          const windowMat = level >= 2 && (m + f) % 3 === 0 ? warmGlass : glass;
          box(shell, [0.86, 0.61, 0.045], [x + 0.46, y + 0.47, z], windowMat, false);
          if (level >= 1 && (m + f) % 4 === 0) {
            box(shell, [0.84, 0.19, 0.05], [x + 0.46, y + 0.82, z + zSide * 0.045], concreteLight, false);
          }
        }
      }

      // End façades with fewer, larger openings.
      for (const xSide of [-1, 1] as const) {
        const x = xSide * (width / 2 - 0.07);
        for (let m = -2; m <= 2; m += 1) {
          const z = m * 0.95;
          box(shell, [0.05, 0.62, 0.7], [x, y + 0.47, z], glass, false);
        }
      }

      // Thin projecting balcony line + physically scaled rails.
      if (level >= 1 && f > 0) {
        for (const zSide of [-1, 1] as const) {
          box(shell, [width + 0.22, 0.08, 0.72], [0, y + 0.1, zSide * (depth / 2 + 0.32)], concreteLight);
          box(shell, [width + 0.1, 0.025, 0.025], [0, y + 0.64, zSide * (depth / 2 + 0.65)], metal, false);
          for (let i = -5; i <= 5; i += 1) {
            box(shell, [0.025, 0.52, 0.025], [i * 0.94, y + 0.38, zSide * (depth / 2 + 0.65)], metal, false);
          }
        }
      }

      if (level >= 2) {
        const floorY = y + 0.12;
        // Central corridor and continuous ceiling.
        box(interiors, [1.5, 0.07, depth - 0.42], [0, floorY, 0], corridorFloor, false);
        box(interiors, [1.55, 0.06, depth - 0.42], [0, y + 0.82, 0], interiorWall, false);
        box(interiors, [0.05, 0.66, depth - 0.45], [-0.78, y + 0.47, 0], interiorWall, false);
        box(interiors, [0.05, 0.66, depth - 0.45], [0.78, y + 0.47, 0], interiorWall, false);

        for (const side of [-1, 1] as const) {
          for (let s = 0; s < 5; s += 1) {
            const z = -2.25 + s * 1.12;
            const roomX = side * 3.15;
            box(interiors, [4.55, 0.06, 1.04], [roomX, floorY + 0.01, z], oak, false);
            // Partition walls + corridor door.
            box(interiors, [4.45, 0.66, 0.045], [roomX, y + 0.47, z + 0.52], interiorWall, false);
            box(interiors, [0.05, 0.62, 0.62], [side * 0.88, y + 0.44, z], metal, false);
            // Bed, desk, kitchenette, wardrobe.
            box(interiors, [1.05, 0.16, 0.52], [side * 3.95, floorY + 0.13, z + 0.18], linen, false);
            box(interiors, [0.78, 0.34, 0.24], [side * 2.55, floorY + 0.2, z - 0.26], oak, false);
            box(interiors, [0.42, 0.62, 0.34], [side * 1.85, floorY + 0.32, z + 0.22], concreteLight, false);
            box(interiors, [0.42, 0.38, 0.34], [side * 1.85, floorY + 0.18, z - 0.25], darkFabric, false);
          }
        }

        if (f % 2 === 0) {
          person(interiors, -3.3, floorY + 0.05, -0.55, 0x384f66, 0.85);
          person(interiors, 3.55, floorY + 0.05, 1.35, 0x8e523f, 0.82);
          person(interiors, 0.02, floorY + 0.05, f % 4 === 0 ? 0.5 : -1.0, 0x55614b, 0.82);
        }
      }
    }

    roundedSlab(0.38 + floors * floorH, concreteLight, 0.22, 0.05);

    // Roof terrace, central stair/lift core, rails and occupants.
    if (level >= 1) {
      const roofY = 0.56 + floors * floorH;
      box(shell, [2.25, 0.9, 1.8], [0, roofY + 0.43, 0.15], concreteLight);
      box(shell, [2.0, 0.64, 0.05], [0, roofY + 0.46, 1.06], glass, false);
      for (const zSide of [-1, 1] as const) {
        box(shell, [width - 0.35, 0.025, 0.025], [0, roofY + 0.75, zSide * (depth / 2 - 0.1)], metal, false);
      }
      for (let i = -5; i <= 5; i += 1) {
        for (const zSide of [-1, 1] as const) box(shell, [0.025, 0.72, 0.025], [i * 0.92, roofY + 0.39, zSide * (depth / 2 - 0.1)], metal, false);
      }
      person(shell, -2.0, roofY + 0.08, 0.9, 0x756049, 0.9);
      person(shell, 2.1, roofY + 0.08, -0.45, 0x4c6b78, 0.88);
    }

    // Landscaping and scale context.
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a432f, roughness: 1 });
    const leafMats = [0x48604a, 0x5b7357, 0x3f5b45].map((c) => new THREE.MeshStandardMaterial({ color: c, roughness: 1 }));
    for (let i = 0; i < 12; i += 1) {
      const x = -7.1 + (i % 6) * 2.8;
      const z = i < 6 ? -4.8 : 4.6;
      const h = 0.85 + (i % 3) * 0.22;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.085, h, 10), trunkMat);
      trunk.position.set(x, h / 2, z);
      trunk.castShadow = true;
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42 + (i % 2) * 0.08, 2), leafMats[i % leafMats.length]);
      crown.position.set(x, h + 0.25, z);
      crown.castShadow = true;
      root.add(trunk, crown);
    }

    // Section cut surface to make the X-ray read like an architectural section rather than two toy halves.
    const cutSurfaceMat = new THREE.MeshStandardMaterial({ color: 0xf0ebe2, roughness: 0.92, side: THREE.DoubleSide });
    const cutSurface = new THREE.Mesh(new THREE.PlaneGeometry(depth + 0.55, floors * floorH + 0.25), cutSurfaceMat);
    cutSurface.rotation.y = Math.PI / 2;
    cutSurface.position.set(99, 4.48, 0);
    cutSurface.visible = level === 3;
    root.add(cutSurface);

    let angle = -0.55;
    let targetCut = 0;
    let cut = 0;
    let dragging = false;
    let lastX = 0;
    let raf = 0;

    const resize = () => {
      const { width: w, height: h } = container.getBoundingClientRect();
      renderer.setSize(Math.max(w, 1), Math.max(h, 1), false);
      camera.aspect = Math.max(w, 1) / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const pointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      if (level === 3 && !dragging) {
        const proximity = 1 - Math.min(1, Math.sqrt(nx * nx * 0.72 + ny * ny));
        targetCut = THREE.MathUtils.smoothstep(proximity, 0.18, 0.82);
      }
      if (dragging) {
        angle += (e.clientX - lastX) * 0.0065;
        lastX = e.clientX;
      }
    };
    const pointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      renderer.domElement.style.cursor = "grabbing";
      renderer.domElement.setPointerCapture(e.pointerId);
    };
    const pointerUp = (e: PointerEvent) => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
      if (renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId);
    };
    const pointerLeave = () => {
      if (level === 3 && !dragging) targetCut = 0;
    };

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.addEventListener("pointermove", pointerMove);
    renderer.domElement.addEventListener("pointerdown", pointerDown);
    renderer.domElement.addEventListener("pointerup", pointerUp);
    renderer.domElement.addEventListener("pointercancel", pointerUp);
    renderer.domElement.addEventListener("pointerleave", pointerLeave);

    const clock = new THREE.Clock();
    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.04);
      if (!dragging) angle += dt * 0.032;
      root.rotation.y = angle;
      cut += (targetCut - cut) * 0.075;
      if (level === 3) {
        // Move a real clipping plane through the façade instead of pulling the model apart.
        const x = 6.0 - cut * 7.1;
        clippingPlane.constant = x;
        cutSurface.position.x = x;
        cutSurface.visible = cut > 0.025;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", pointerMove);
      renderer.domElement.removeEventListener("pointerdown", pointerDown);
      renderer.domElement.removeEventListener("pointerup", pointerUp);
      renderer.domElement.removeEventListener("pointercancel", pointerUp);
      renderer.domElement.removeEventListener("pointerleave", pointerLeave);
      concreteMap?.dispose();
      woodMap?.dispose();
      asphaltMap.dispose();
      envTexture?.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [level]);

  return <div className="building-lab-canvas" ref={host} />;
}

export default function BuildingModelLab() {
  const [level, setLevel] = useState<ModelLevel>(3);
  const option = OPTIONS[level];

  return (
    <main className="building-lab-page">
      <header className="building-lab-header">
        <Link to="/" className="building-lab-back">← Retour au site</Link>
        <div>
          <span>SBRE / LABORATOIRE 3D</span>
          <strong>MICRO-LOGEMENTS · TEST PHOTORÉALISTE</strong>
        </div>
      </header>

      <section className="building-lab-intro">
        <p>PROTOTYPE — 4 NIVEAUX DE RENDU</p>
        <h1>De la maquette web au <em>rendu architectural.</em></h1>
        <div className="building-lab-intro-copy">
          <p>La version avancée abandonne volontairement l’aspect “jouet” : matériaux physiques, texture de béton, environnement HDRI urbain, proportions plus architecturales et détails de façade.</p>
          <p>Sur le niveau 04, approchez la souris : une véritable coupe se déplace dans le bâtiment pour révéler le couloir central et les micro-logements.</p>
        </div>
      </section>

      <section className="building-lab-stage">
        <div className="building-lab-stage-copy">
          <span>{option.kicker}</span>
          <h2>{option.title}</h2>
          <p>{option.body}</p>
          <div className="building-lab-specs">
            <span>9 niveaux</span>
            <span>Couloir central</span>
            <span>Studios bilatéraux</span>
            <span>PBR + HDRI</span>
          </div>
        </div>
        <BuildingLabScene level={level} />
        <div className="building-lab-hint">
          {level === 3
            ? "Approchez la souris du bâtiment pour déplacer la coupe · glissez pour tourner"
            : "Glissez horizontalement pour tourner la maquette"}
        </div>
      </section>

      <section className="building-lab-options" aria-label="Niveaux de modélisation">
        {OPTIONS.map((item, index) => (
          <button
            key={item.kicker}
            className={index === level ? "is-active" : ""}
            onClick={() => setLevel(index as ModelLevel)}
          >
            <span>{item.kicker}</span>
            <strong>{item.title}</strong>
            <p>{item.body}</p>
          </button>
        ))}
      </section>

      <section className="building-lab-note">
        <span>CHOIX TECHNIQUE</span>
        <p>Les modèles CC0 trouvés en ligne étaient surtout “low-poly” et auraient accentué l’effet dessin animé. Ce prototype reprend donc les techniques de rendu architectural utilisées avec Three.js — matériaux physiques, HDRI CC0 et clipping réel — tout en conservant une géométrie conçue spécialement pour nos micro-logements.</p>
      </section>
    </main>
  );
}
