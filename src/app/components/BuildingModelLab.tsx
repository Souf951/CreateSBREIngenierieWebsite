import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import "../../styles/building-model-lab.css";

type ModelLevel = 0 | 1 | 2 | 3;

const OPTIONS = [
  {
    kicker: "01 / ESSENTIEL",
    title: "Maquette actuelle",
    body: "Volumétrie claire, vitrages, dalles et garde-corps. Légère et rapide à charger.",
  },
  {
    kicker: "02 / ARCHITECTURAL",
    title: "Façade détaillée",
    body: "Matériaux plus riches, trame de façade, menuiseries, balcons, éclairage et paysage.",
  },
  {
    kicker: "03 / HABITÉ",
    title: "Micro-logements vivants",
    body: "Intérieurs éclairés, mobilier simplifié, silhouettes, couloir central et lecture des studios.",
  },
  {
    kicker: "04 / X-RAY",
    title: "Coupe interactive",
    body: "Approchez la souris : le bâtiment s’ouvre progressivement pour révéler studios, couloir et habitants.",
  },
] as const;

function makeConcreteTexture(renderer: THREE.WebGLRenderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#b96f59";
  ctx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 1200; i += 1) {
    const v = 125 + Math.random() * 85;
    ctx.fillStyle = `rgba(${v},${v * 0.72},${v * 0.62},${Math.random() * 0.05})`;
    const r = Math.random() * 2.2;
    ctx.fillRect(Math.random() * 256, Math.random() * 256, r, r);
  }
  for (let y = 24; y < 256; y += 42) {
    ctx.fillStyle = "rgba(55,35,28,.09)";
    ctx.fillRect(0, y, 256, 1);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3.2, 1.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return texture;
}

function addBox(
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

function addPerson(parent: THREE.Object3D, x: number, y: number, z: number, color: number) {
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.82 });
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd39a79, roughness: 0.9 });
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.34, 4, 8), bodyMat);
  body.position.y = 0.36;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), skinMat);
  head.position.y = 0.73;
  group.add(body, head);
  group.position.set(x, y, z);
  group.scale.setScalar(0.82);
  parent.add(group);
  return group;
}

function BuildingLabScene({ level }: { level: ModelLevel }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09110e, 0.022);
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(15.5, 10.2, 20.5);
    camera.lookAt(0, 4.2, 0);

    scene.add(new THREE.HemisphereLight(0xeef6ff, 0x13231b, 2.1));
    const key = new THREE.DirectionalLight(0xffead7, 5.0);
    key.position.set(10, 16, 11);
    key.castShadow = true;
    key.shadow.mapSize.set(1536, 1536);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x8bb7ff, 2.1);
    fill.position.set(-12, 8, -8);
    scene.add(fill);

    const root = new THREE.Group();
    root.rotation.y = -0.46;
    root.scale.setScalar(level === 0 ? 0.92 : 0.88);
    scene.add(root);

    const leftWing = new THREE.Group();
    const rightWing = new THREE.Group();
    root.add(leftWing, rightWing);

    const concreteTexture = level >= 1 ? makeConcreteTexture(renderer) : null;
    const slabMat = new THREE.MeshStandardMaterial({
      color: level === 0 ? 0xe9b99b : 0xc17b62,
      map: concreteTexture ?? undefined,
      roughness: level === 0 ? 0.68 : 0.82,
      metalness: 0.02,
    });
    const edgeMat = new THREE.MeshStandardMaterial({ color: 0xdcb18f, roughness: 0.72 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x111b18, roughness: 0.62, metalness: 0.22 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: level >= 1 ? 0x6f8f87 : 0x87a098,
      roughness: 0.12,
      metalness: 0.04,
      transmission: level >= 2 ? 0.18 : 0.06,
      transparent: true,
      opacity: level >= 2 ? 0.72 : 0.82,
    });
    const warmGlass = new THREE.MeshStandardMaterial({
      color: 0xf2b56d,
      emissive: 0x7a3a12,
      emissiveIntensity: level >= 2 ? 1.3 : 0,
      transparent: true,
      opacity: 0.8,
      roughness: 0.32,
    });
    const corridorMat = new THREE.MeshStandardMaterial({ color: 0xdedbd0, roughness: 0.9 });
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x7d684f, roughness: 0.88 });
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x315d45, roughness: 0.96 });

    // Ground / site plate.
    const ground = new THREE.Mesh(new THREE.CylinderGeometry(7.25, 7.25, 0.28, 72), greenMat);
    ground.scale.z = 0.74;
    ground.position.y = -0.22;
    ground.receiveShadow = true;
    root.add(ground);

    const floors = 9;
    const floorH = 0.94;
    const radiusX = 5.15;
    const radiusZ = 3.5;

    const addFacadeHalf = (parent: THREE.Group, side: -1 | 1) => {
      for (let f = 0; f < floors; f += 1) {
        const y = 0.38 + f * floorH;
        // Main floor slab.
        const slab = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.17, 72), slabMat);
        slab.scale.set(radiusX, 1, radiusZ);
        slab.position.y = y;
        slab.castShadow = slab.receiveShadow = true;
        parent.add(slab);

        // Slightly projecting balcony slab for levels 1+.
        if (level >= 1) {
          const balcony = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.095, 72), edgeMat);
          balcony.scale.set(radiusX + 0.24, 1, radiusZ + 0.2);
          balcony.position.y = y + 0.12;
          parent.add(balcony);
        }

        // Curtain wall / windows.
        const glass = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.61, 72, 1, true), level >= 2 && f % 2 ? warmGlass : glassMat);
        glass.scale.set(radiusX - 0.2, 1, radiusZ - 0.22);
        glass.position.y = y + 0.43;
        parent.add(glass);

        // Vertical facade rhythm / mullions.
        const mullionCount = level === 0 ? 18 : 32;
        for (let i = 0; i < mullionCount; i += 1) {
          const a = (i / mullionCount) * Math.PI * 2;
          const x = Math.cos(a) * (radiusX - 0.03);
          if ((side < 0 && x > 0.15) || (side > 0 && x < -0.15)) continue;
          const z = Math.sin(a) * (radiusZ - 0.03);
          const post = addBox(parent, [0.055, 0.66, 0.055], [x, y + 0.46, z], darkMat, false);
          post.rotation.y = -a;
        }

        if (level >= 1) {
          // Guardrail top + uprights.
          const rail = new THREE.Mesh(new THREE.TorusGeometry(1, 0.027, 6, 90), darkMat);
          rail.scale.set(radiusX + 0.36, radiusZ + 0.34, 1);
          rail.rotation.x = Math.PI / 2;
          rail.position.y = y + 0.63;
          parent.add(rail);
          for (let i = 0; i < 30; i += 1) {
            const a = (i / 30) * Math.PI * 2;
            const x = Math.cos(a) * (radiusX + 0.32);
            if ((side < 0 && x > 0.15) || (side > 0 && x < -0.15)) continue;
            const z = Math.sin(a) * (radiusZ + 0.3);
            addBox(parent, [0.025, 0.48, 0.025], [x, y + 0.39, z], darkMat, false);
          }
        }
      }

      // Roof slab.
      const roof = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.22, 72), slabMat);
      roof.scale.set(radiusX + 0.06, 1, radiusZ + 0.04);
      roof.position.y = 0.38 + floors * floorH;
      parent.add(roof);
    };

    // Clip each wing geometrically by using half-space visual cover: models remain complete but overlap exactly until split.
    // Each wing receives alternate facade arcs so the closed state still reads as one coherent building.
    addFacadeHalf(leftWing, -1);
    addFacadeHalf(rightWing, 1);

    if (level >= 2) {
      // Central corridor and studio cells become visible through the glazing and fully readable in X-ray mode.
      for (let f = 0; f < floors - 1; f += 1) {
        const baseY = 0.55 + f * floorH;
        addBox(root, [1.28, 0.08, 5.2], [0, baseY + 0.02, 0], corridorMat, false);
        for (const side of [-1, 1] as const) {
          for (let z = -2.2; z <= 2.2; z += 1.1) {
            const x = side * 2.65;
            addBox(root, [2.28, 0.065, 0.98], [x, baseY + 0.03, z], floorMat, false);
            // Party walls / studio separators.
            addBox(root, [0.05, 0.62, 1.0], [side * 1.52, baseY + 0.34, z], corridorMat, false);
            // Bed + desk give recognisable micro-studio scale.
            const soft = new THREE.MeshStandardMaterial({ color: z > 0 ? 0xc9d5c8 : 0xb5a98d, roughness: 0.9 });
            addBox(root, [0.74, 0.13, 0.42], [side * 2.38, baseY + 0.13, z + 0.16], soft, false);
            addBox(root, [0.42, 0.3, 0.12], [side * 1.88, baseY + 0.18, z - 0.27], darkMat, false);
          }
        }
        if (f % 2 === 0) {
          addPerson(root, -2.3, baseY + 0.06, -0.7, 0xb25a3b);
          addPerson(root, 2.25, baseY + 0.06, 1.0, 0x365f78);
          addPerson(root, 0.05, baseY + 0.06, 0.0, 0x64723f);
        }
      }
    }

    if (level >= 1) {
      // Roof terrace and urban landscape.
      addBox(root, [5.8, 0.1, 2.6], [0, 9.05, 0], floorMat, false);
      for (let i = 0; i < 5; i += 1) {
        const planter = addBox(root, [0.65, 0.32, 0.65], [-2.1 + i * 1.05, 9.18, -0.75], greenMat, false);
        planter.rotation.y = i * 0.17;
      }
      addPerson(root, -1.4, 9.18, 0.45, 0xd1aa67);
      addPerson(root, 1.0, 9.18, 0.3, 0x51728b);
    }

    // Context: trees + path.
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3f2a, roughness: 1 });
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      const x = Math.cos(a) * 6.25;
      const z = Math.sin(a) * 4.55;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.75, 8), trunkMat);
      trunk.position.set(x, 0.28, z);
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.34 + (i % 3) * 0.05, 12, 10), greenMat);
      crown.position.set(x, 0.83, z);
      root.add(trunk, crown);
    }

    let autoAngle = -0.46;
    let targetSplit = 0;
    let split = 0;
    let dragging = false;
    let lastX = 0;
    let raf = 0;

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      camera.aspect = Math.max(width, 1) / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const pointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      if (level === 3 && !dragging) {
        const d = Math.sqrt(nx * nx + ny * ny);
        targetSplit = THREE.MathUtils.clamp(1.08 - d, 0, 1);
      }
      if (dragging) {
        const dx = event.clientX - lastX;
        lastX = event.clientX;
        autoAngle += dx * 0.008;
      }
    };
    const pointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const pointerUp = (event: PointerEvent) => {
      dragging = false;
      if (renderer.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
    };
    const pointerLeave = () => {
      if (level === 3) targetSplit = 0;
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
      if (!dragging) autoAngle += dt * (level === 3 ? 0.045 : 0.06);
      root.rotation.y = autoAngle;
      root.position.y = Math.sin(performance.now() * 0.0007) * 0.045;
      split += (targetSplit - split) * 0.065;
      const distance = split * 2.25;
      leftWing.position.x = -distance;
      rightWing.position.x = distance;
      if (level === 3) {
        leftWing.rotation.z = split * 0.015;
        rightWing.rotation.z = -split * 0.015;
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
      concreteTexture?.dispose();
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
          <strong>MICRO-LOGEMENTS · TEST PRIVÉ</strong>
        </div>
      </header>

      <section className="building-lab-intro">
        <p>PROTOTYPE — 4 NIVEAUX DE MODÉLISATION</p>
        <h1>Du volume lisible à la <em>coupe habitée.</em></h1>
        <div className="building-lab-intro-copy">
          <p>Cette page est isolée du site principal. Elle sert uniquement à comparer quatre directions possibles avant de choisir jusqu’où pousser la 3D.</p>
          <p>Vous pouvez faire tourner chaque modèle. Sur le niveau 04, approchez la souris du bâtiment pour l’ouvrir et révéler l’organisation des micro-logements.</p>
        </div>
      </section>

      <section className="building-lab-stage">
        <div className="building-lab-stage-copy">
          <span>{option.kicker}</span>
          <h2>{option.title}</h2>
          <p>{option.body}</p>
          <div className="building-lab-specs">
            <span>9 niveaux</span><span>Couloir central</span><span>Studios bilatéraux</span><span>Interaction souris</span>
          </div>
        </div>
        <BuildingLabScene level={level} />
        <div className="building-lab-hint">
          {level === 3 ? "Approchez la souris du centre pour ouvrir la coupe · glissez pour tourner" : "Glissez horizontalement pour tourner la maquette"}
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
        <span>OBJECTIF</span>
        <p>Le niveau 04 est volontairement le plus ambitieux : façade texturée, lumière intérieure, studios, mobilier, personnes et ouverture interactive. Si cette direction vous plaît, on pourra ensuite l’optimiser pour remplacer progressivement la maquette actuelle du site.</p>
      </section>
    </main>
  );
}
