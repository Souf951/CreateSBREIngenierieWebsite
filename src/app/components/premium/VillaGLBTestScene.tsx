import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const MODEL_URL = "https://cdn.3dassets.dev/assets/26895/v1/model.glb";

export default function VillaGLBTestScene({
  phase = 3,
  onFailure,
}: {
  phase?: number;
  onFailure: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useEffect(() => {
    if (!host.current) return;

    const container = host.current;
    let renderer: THREE.WebGLRenderer;

    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      onFailure();
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
    camera.position.set(12.5, 8.2, 14.5);
    camera.lookAt(0, 2.5, 0);

    const root = new THREE.Group();
    root.rotation.y = -0.52;
    scene.add(root);

    const hemi = new THREE.HemisphereLight("#fff7e8", "#385044", 2.2);
    scene.add(hemi);

    const key = new THREE.DirectionalLight("#fff0d4", 4.2);
    key.position.set(-8, 14, 10);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);

    const fill = new THREE.DirectionalLight("#b9d8d5", 1.5);
    fill.position.set(10, 7, -8);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.ShadowMaterial({ opacity: 0.2 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    let disposed = false;
    let loadedModel: THREE.Object3D | null = null;
    const materialBaseOpacity = new Map<THREE.Material, number>();

    const applyPhase = () => {
      if (!loadedModel) return;
      const progress = [0.34, 0.56, 0.78, 1][phaseRef.current] ?? 1;
      loadedModel.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => {
          if (!materialBaseOpacity.has(material)) {
            materialBaseOpacity.set(material, material.opacity ?? 1);
          }
          const base = materialBaseOpacity.get(material) ?? 1;
          material.transparent = progress < 0.999 || material.transparent;
          material.opacity = Math.min(base, Math.max(0.16, progress));
          material.depthWrite = progress > 0.55;
          material.needsUpdate = true;
        });
      });
    };

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        loadedModel = model;

        model.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;
          }
        });

        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        model.position.sub(center);
        model.position.y += size.y / 2;

        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = 10.2 / Math.max(maxDimension, 0.001);
        model.scale.setScalar(scale);

        root.add(model);
        applyPhase();
      },
      undefined,
      () => onFailure(),
    );

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let raf = 0;
    let last = performance.now();
    let dragging = false;
    let lastX = 0;
    let manualRotation = 0;

    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      lastX = event.clientX;
      container.setPointerCapture?.(event.pointerId);
      container.style.cursor = "grabbing";
    };

    const move = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      lastX = event.clientX;
      manualRotation += dx * 0.008;
    };

    const up = () => {
      dragging = false;
      container.style.cursor = "grab";
    };

    container.style.cursor = "grab";
    container.style.touchAction = "pan-y";
    container.addEventListener("pointerdown", down);
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerup", up);
    container.addEventListener("pointercancel", up);

    const render = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!dragging) root.rotation.y += dt * 0.12;
      root.rotation.y += THREE.MathUtils.damp(0, manualRotation, 8, dt);
      manualRotation = THREE.MathUtils.damp(manualRotation, 0, 8, dt);
      root.position.y = 0.04 + Math.sin(now * 0.00085) * 0.04;
      applyPhase();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      container.removeEventListener("pointerdown", down);
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerup", up);
      container.removeEventListener("pointercancel", up);
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

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  return (
    <div
      ref={host}
      className="building-canvas"
      role="img"
      tabIndex={0}
      aria-label={`Test d'une villa GLB téléchargeable — phase ${phase + 1} sur 4. Faites glisser horizontalement pour faire pivoter le modèle.`}
    />
  );
}
