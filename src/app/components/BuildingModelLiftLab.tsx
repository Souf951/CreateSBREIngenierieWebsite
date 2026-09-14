import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import "../../styles/building-model-lift-lab.css";

const HDRI = "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/urban_street_03_1k.hdr";

function canvasTexture(renderer: THREE.WebGLRenderer, kind: "brick" | "oak" | "fabric") {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const x = c.getContext("2d")!;
  if (kind === "brick") {
    x.fillStyle = "#9a604e";
    x.fillRect(0, 0, 512, 512);
    const bh = 46;
    for (let row = 0; row < 12; row++) {
      const y = row * bh;
      const offset = row % 2 ? 44 : 0;
      for (let col = -1; col < 8; col++) {
        const bx = col * 88 + offset;
        const v = 135 + Math.random() * 38;
        x.fillStyle = `rgb(${v},${Math.round(v * .66)},${Math.round(v * .56)})`;
        x.fillRect(bx + 2, y + 2, 84, 41);
        for (let n = 0; n < 22; n++) {
          x.fillStyle = `rgba(55,31,24,${Math.random() * .1})`;
          x.fillRect(bx + Math.random() * 82, y + Math.random() * 39, 1 + Math.random() * 2, 1 + Math.random() * 2);
        }
      }
    }
    x.strokeStyle = "rgba(235,225,214,.32)";
    x.lineWidth = 3;
    for (let y = 0; y < 512; y += bh) { x.beginPath(); x.moveTo(0, y); x.lineTo(512, y); x.stroke(); }
  } else if (kind === "oak") {
    x.fillStyle = "#b79266"; x.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y += 28) {
      x.strokeStyle = `rgba(91,57,29,${.08 + Math.random() * .08})`;
      x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(140, y - 4, 370, y + 5, 512, y + 1); x.stroke();
    }
  } else {
    x.fillStyle = "#727572"; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 6500; i++) {
      const v = 80 + Math.random() * 70;
      x.fillStyle = `rgba(${v},${v},${v},.08)`;
      x.fillRect(Math.random() * 512, Math.random() * 512, 1, 1);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(kind === "brick" ? 4 : 3, kind === "brick" ? 3 : 2);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return t;
}

function addBox(parent: THREE.Object3D, size: [number, number, number], pos: [number, number, number], mat: THREE.Material, radius = 0) {
  const geo = radius > 0
    ? new THREE.BoxGeometry(size[0], size[1], size[2], 2, 2, 2)
    : new THREE.BoxGeometry(...size);
  const m = new THREE.Mesh(geo, mat);
  m.position.set(...pos);
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
}

function LiftScene() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!host.current) return;
    const el = host.current;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
    renderer.setSize(el.clientWidth, el.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x101513, 1);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x101513);
    scene.fog = new THREE.Fog(0x101513, 34, 60);
    const camera = new THREE.PerspectiveCamera(30, 1, .1, 100);
    camera.position.set(17.5, 10.5, 19.5);
    camera.lookAt(0, 4.5, 0);

    scene.add(new THREE.HemisphereLight(0xe9f0ee, 0x18231e, 1.25));
    const sun = new THREE.DirectionalLight(0xffeed7, 3.6);
    sun.position.set(10, 16, 11); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); scene.add(sun);
    const warm = new THREE.PointLight(0xffc37d, 9, 18, 2); warm.position.set(-2, 5.1, 1); scene.add(warm);
    let env: THREE.Texture | null = null;
    new RGBELoader().load(HDRI, (hdr) => { hdr.mapping = THREE.EquirectangularReflectionMapping; env = hdr; scene.environment = hdr; }, undefined, () => {});

    const brickMap = canvasTexture(renderer, "brick");
    const oakMap = canvasTexture(renderer, "oak");
    const fabricMap = canvasTexture(renderer, "fabric");
    const brick = new THREE.MeshStandardMaterial({ color: 0xb2745d, map: brickMap, roughness: .9, metalness: .01 });
    const concrete = new THREE.MeshStandardMaterial({ color: 0xb9b5ae, roughness: .88 });
    const black = new THREE.MeshStandardMaterial({ color: 0x151817, roughness: .28, metalness: .78 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xb7cfca, roughness: .08, transmission: .32, thickness: .12, transparent: true, opacity: .58, envMapIntensity: 1.5 });
    const oak = new THREE.MeshStandardMaterial({ color: 0xc49c6d, map: oakMap, roughness: .78 });
    const white = new THREE.MeshStandardMaterial({ color: 0xece9e1, roughness: .88 });
    const sofa = new THREE.MeshStandardMaterial({ color: 0x6d716d, map: fabricMap, roughness: 1 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x262b29, roughness: .65 });
    const quartz = new THREE.MeshStandardMaterial({ color: 0xd7d5cf, roughness: .28 });
    const bedding = new THREE.MeshStandardMaterial({ color: 0xe9e5dd, roughness: 1 });
    const steel = new THREE.MeshStandardMaterial({ color: 0x8f9693, roughness: .2, metalness: .92 });
    const greenery = new THREE.MeshStandardMaterial({ color: 0x405947, roughness: 1 });

    const root = new THREE.Group(); root.rotation.y = -.5; scene.add(root);
    addBox(root, [17, .22, 12], [0, -.2, 0], new THREE.MeshStandardMaterial({ color: 0x26362d, roughness: 1 }));
    addBox(root, [17, .06, 3], [0, -.05, 4.7], new THREE.MeshStandardMaterial({ color: 0x383d3b, roughness: .97 }));

    const lower = new THREE.Group();
    const lifted = new THREE.Group();
    root.add(lower, lifted);
    const floors = 8, h = 1.0, w = 10.2, d = 6.1;

    const addFloor = (parent: THREE.Group, f: number, detailed = false) => {
      const y = .32 + f * h;
      addBox(parent, [w, .18, d], [0, y, 0], concrete);
      addBox(parent, [w, .68, .22], [0, y + .48, -d/2 + .03], brick);
      addBox(parent, [w, .68, .22], [0, y + .48, d/2 - .03], brick);
      for (let i = -4; i <= 4; i++) {
        for (const z of [-d/2 - .02, d/2 + .02]) {
          addBox(parent, [.82, .55, .045], [i * 1.03, y + .5, z], glass);
          addBox(parent, [.035, .64, .06], [i * 1.03 - .46, y + .48, z], black);
        }
      }
      for (const z of [-d/2 - .42, d/2 + .42]) {
        addBox(parent, [w + .28, .08, .72], [0, y + .12, z], concrete);
        addBox(parent, [w + .16, .03, .03], [0, y + .66, z + Math.sign(z) * .32], black);
      }
      if (!detailed) return;

      // Cut-away apartment floor: corridor in the middle, one legible apartment in foreground.
      const fy = y + .15;
      addBox(parent, [1.45, .07, 5.45], [0, fy, 0], new THREE.MeshStandardMaterial({ color: 0x9d9991, roughness: .9 }));
      addBox(parent, [8.45, .07, 2.45], [0, fy + .01, 1.63], oak);
      addBox(parent, [8.45, .07, 2.45], [0, fy + .01, -1.63], oak);
      addBox(parent, [.08, .7, 5.45], [-.78, y + .48, 0], white);
      addBox(parent, [.08, .7, 5.45], [.78, y + .48, 0], white);

      // Living room.
      addBox(parent, [1.45, .32, .64], [-2.7, fy + .2, 1.65], sofa);
      addBox(parent, [1.15, .18, .12], [-2.7, fy + .5, 1.94], sofa);
      addBox(parent, [.78, .12, .48], [-1.55, fy + .12, 1.65], oak);
      addBox(parent, [2.25, .025, 1.45], [-2.15, fy + .045, 1.6], new THREE.MeshStandardMaterial({ color: 0xbbb0a0, roughness: 1 }));

      // Kitchenette with quartz top, sink and induction hob.
      addBox(parent, [2.05, .56, .48], [2.8, fy + .29, 2.18], white);
      addBox(parent, [2.16, .08, .58], [2.8, fy + .61, 2.18], quartz);
      addBox(parent, [.62, .025, .42], [3.35, fy + .66, 2.18], dark);
      const sink = new THREE.Mesh(new THREE.CylinderGeometry(.19, .19, .05, 24), steel); sink.rotation.x = Math.PI / 2; sink.position.set(2.55, fy + .65, 2.17); parent.add(sink);
      addBox(parent, [1.95, .06, .22], [2.8, fy + 1.02, 2.55], oak);
      for (let i = 0; i < 3; i++) addBox(parent, [.07, .21, .07], [2.2 + i * .55, fy + .92, 2.48], dark);

      // Bedroom.
      addBox(parent, [1.75, .22, 1.35], [2.75, fy + .16, -1.58], bedding);
      addBox(parent, [1.75, .34, .1], [2.75, fy + .31, -2.19], white);
      addBox(parent, [.62, .62, .5], [4.25, fy + .33, -1.9], oak);
      addBox(parent, [.34, .18, .32], [1.65, fy + .12, -1.9], oak);
      const pillowMat = new THREE.MeshStandardMaterial({ color: 0xf5f2eb, roughness: 1 });
      addBox(parent, [.56, .12, .34], [2.35, fy + .34, -1.95], pillowMat);
      addBox(parent, [.56, .12, .34], [3.15, fy + .34, -1.95], pillowMat);

      // White partitions defining rooms without hiding the plan.
      addBox(parent, [.08, .72, 2.0], [1.05, y + .5, -1.65], white);
      addBox(parent, [.08, .72, 1.5], [-.95, y + .5, 1.8], white);
    };

    for (let f = 0; f < floors; f++) {
      if (f <= 4) addFloor(lower, f, f === 4);
      else addFloor(lifted, f, false);
    }
    addBox(lifted, [w + .12, .22, d + .08], [0, .32 + floors * h, 0], concrete);

    // Landscape and scale cues.
    for (let i = 0; i < 10; i++) {
      const x = -7 + (i % 5) * 3.4;
      const z = i < 5 ? -4.65 : 4.25;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.055, .08, .8, 8), new THREE.MeshStandardMaterial({ color: 0x58412f, roughness: 1 }));
      trunk.position.set(x, .38, z);
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.42 + (i % 2) * .08, 2), greenery); crown.position.set(x, 1.05, z);
      root.add(trunk, crown);
    }

    let targetLift = 0, lift = 0, angle = -.5, dragging = false, lastX = 0, raf = 0;
    const resize = () => { const r = el.getBoundingClientRect(); renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false); camera.aspect = Math.max(1, r.width) / Math.max(1, r.height); camera.updateProjectionMatrix(); };
    const ro = new ResizeObserver(resize); ro.observe(el); resize();
    const move = (e: PointerEvent) => {
      const r = renderer.domElement.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!dragging) {
        const p = 1 - Math.min(1, Math.sqrt(nx * nx * .78 + ny * ny));
        targetLift = THREE.MathUtils.smoothstep(p, .18, .82);
      } else { angle += (e.clientX - lastX) * .006; lastX = e.clientX; }
    };
    const down = (e: PointerEvent) => { dragging = true; lastX = e.clientX; renderer.domElement.setPointerCapture(e.pointerId); renderer.domElement.style.cursor = "grabbing"; };
    const up = (e: PointerEvent) => { dragging = false; renderer.domElement.style.cursor = "grab"; if (renderer.domElement.hasPointerCapture(e.pointerId)) renderer.domElement.releasePointerCapture(e.pointerId); };
    const leave = () => { if (!dragging) targetLift = 0; };
    renderer.domElement.style.cursor = "grab"; renderer.domElement.style.touchAction = "pan-y";
    renderer.domElement.addEventListener("pointermove", move); renderer.domElement.addEventListener("pointerdown", down); renderer.domElement.addEventListener("pointerup", up); renderer.domElement.addEventListener("pointercancel", up); renderer.domElement.addEventListener("pointerleave", leave);

    const clock = new THREE.Clock();
    const tick = () => {
      const dt = Math.min(clock.getDelta(), .04);
      if (!dragging) angle += dt * .022;
      root.rotation.y = angle;
      lift += (targetLift - lift) * .07;
      lifted.position.y = lift * 3.05;
      lifted.rotation.z = lift * .008;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf); ro.disconnect();
      renderer.domElement.removeEventListener("pointermove", move); renderer.domElement.removeEventListener("pointerdown", down); renderer.domElement.removeEventListener("pointerup", up); renderer.domElement.removeEventListener("pointercancel", up); renderer.domElement.removeEventListener("pointerleave", leave);
      brickMap.dispose(); oakMap.dispose(); fabricMap.dispose(); env?.dispose();
      scene.traverse((o) => { if (o instanceof THREE.Mesh) { o.geometry.dispose(); const mats = Array.isArray(o.material) ? o.material : [o.material]; mats.forEach((m) => m.dispose()); } });
      renderer.dispose(); renderer.domElement.remove();
    };
  }, []);
  return <div className="lift-lab-canvas" ref={host} />;
}

export default function BuildingModelLiftLab() {
  return (
    <main className="lift-lab-page">
      <header className="lift-lab-header">
        <Link to="/" className="lift-lab-back">← Retour au site</Link>
        <div><span>SBRE / VISUALISATION ARCHITECTURALE</span><strong>MICRO-LOGEMENTS · PROTOTYPE INTERACTIF</strong></div>
      </header>
      <section className="lift-lab-copy">
        <p>04 / ARCHVIZ INTERACTIF</p>
        <h1>Coupe architecturale <em>interactive.</em></h1>
        <p className="lift-lab-lead">Passez votre souris sur le bâtiment pour soulever les étages supérieurs et révéler un appartement réellement organisé : salon, kitchenette équipée, chambre et couloir central.</p>
      </section>
      <section className="lift-lab-stage">
        <LiftScene />
        <div className="lift-lab-badge"><span>INTERACTION</span><strong>Approchez la souris du centre</strong><small>Les étages supérieurs se soulèvent progressivement · glissez pour tourner</small></div>
      </section>
      <section className="lift-lab-details">
        <div><span>MATÉRIAUX</span><strong>Brique texturée · béton · acier noir · vitrage physique</strong></div>
        <div><span>INTÉRIEUR</span><strong>Parquet chêne · cuisine quartz · salon · chambre équipée</strong></div>
        <div><span>RENDU</span><strong>HDRI urbain · lumière naturelle · éclairage intérieur chaud</strong></div>
      </section>
    </main>
  );
}
