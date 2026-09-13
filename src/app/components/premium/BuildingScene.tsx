import { useEffect, useRef } from "react";
import * as THREE from "three";

/** Small procedural architecture scene. No model downloads, physics or postprocessing. */
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
    renderer.toneMappingExposure = 1.45;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
    camera.position.set(13, 10, 17);
    camera.lookAt(0, 1.5, 0);
    const villa = new THREE.Group();
    scene.add(villa);
    const concrete = new THREE.MeshStandardMaterial({
      color: "#e5e2d8",
      roughness: 0.84,
    });
    const white = new THREE.MeshStandardMaterial({
      color: "#f4f2e9",
      roughness: 0.65,
    });
    const wood = new THREE.MeshStandardMaterial({
      color: "#977655",
      roughness: 0.78,
    });
    const frame = new THREE.MeshStandardMaterial({
      color: "#263d38",
      roughness: 0.45,
      metalness: 0.45,
    });
    const glass = new THREE.MeshStandardMaterial({
      color: "#75998d",
      roughness: 0.16,
      metalness: 0.65,
      transparent: true,
      opacity: 0.72,
    });
    const groups = [
      new THREE.Group(),
      new THREE.Group(),
      new THREE.Group(),
      new THREE.Group(),
    ];
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
      mat: THREE.Material,
    ) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      g.add(m);
      return m;
    }
    box(groups[0], 0, 0, 0, 11, 0.22, 8, concrete);
    box(groups[0], 0, 0.25, 0, 8, 0.28, 5.5, white);
    for (const x of [-3.7, 0, 3.7])
      for (const z of [-2.4, 2.4])
        box(groups[1], x, 1.65, z, 0.23, 2.6, 0.23, concrete);
    box(groups[1], 0, 3, 0, 8.3, 0.27, 5.8, white);
    box(groups[1], 0.8, 5.6, -0.4, 7, 0.22, 5, white);
    box(groups[1], -2.5, 4.3, -2.5, 0.22, 2.5, 0.22, concrete);
    box(groups[1], 4.1, 4.3, 1.7, 0.22, 2.5, 0.22, concrete);
    box(groups[2], 0, 1.7, -2.55, 8, 2.6, 0.16, white);
    box(groups[2], -3.9, 1.7, 0, 0.18, 2.6, 5, white);
    box(groups[2], 0.8, 4.3, -2.75, 7, 2.45, 0.15, white);
    box(groups[2], -2.6, 4.3, -0.4, 0.18, 2.45, 4.7, white);
    box(groups[2], 4.15, 4.3, -0.4, 0.18, 2.45, 4.7, white);
    box(groups[2], 0.8, 4.3, 1.95, 6.6, 2.3, 0.07, glass);
    box(groups[2], 0, 1.7, 2.5, 7.5, 2.35, 0.07, glass);
    box(groups[2], 3.9, 1.7, 0, 0.07, 2.35, 5, glass);
    for (let x = -3.6; x <= 3.7; x += 1.23)
      box(groups[2], x, 1.7, 2.54, 0.055, 2.5, 0.08, frame);
    for (let x = -2.3; x <= 4; x += 1.23)
      box(groups[2], x, 4.3, 2, 0.055, 2.4, 0.08, frame);
    for (let z = -2.2; z <= 2.2; z += 1.1)
      box(groups[2], 3.94, 1.7, z, 0.08, 2.5, 0.055, frame);
    box(groups[3], -2.3, 0.42, 3.5, 3, 0.1, 1.8, wood);
    for (let i = 0; i < 16; i++)
      box(groups[3], -3.7 + i * 0.19, 0.485, 3.5, 0.02, 0.008, 1.8, frame);
    box(groups[3], 2.8, 0.28, 3.2, 2.3, 0.12, 0.65, concrete);
    box(groups[3], 2.8, 0.16, 3.8, 2.3, 0.12, 0.6, concrete);
    for (let i = 0; i < 20; i++)
      box(groups[3], -2.25 + i * 0.12, 4.3, 2.07, 0.045, 2.35, 0.08, wood);
    box(groups[3], 0.8, 5.75, -0.4, 6.5, 0.08, 4.5, frame);
    const soil = new THREE.MeshStandardMaterial({
      color: "#344f40",
      roughness: 1,
    });
    box(groups[3], -4.6, 0.25, -1, 0.65, 0.3, 4, white);
    box(groups[3], -4.6, 0.49, -1, 0.55, 0.23, 3.9, soil);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.ShadowMaterial({ opacity: 0.25 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    scene.add(ground);
    scene.add(new THREE.HemisphereLight("#fff9e8", "#456653", 3));
    const sun = new THREE.DirectionalLight("#fff2dc", 4);
    sun.position.set(-7, 14, 7);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -10,
      right: 10,
      top: 10,
      bottom: -10,
    });
    sun.shadow.bias = -0.002;
    scene.add(sun);
    const resize = () => {
      const w = container.clientWidth,
        h = container.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      redraw.current();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();
    let raf = 0,
      visible = true,
      previous = 0,
      settled = 0,
      targetX = 0;
    const move = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 0.12;
      start();
    };
    const leave = () => {
      targetX = 0;
      start();
    };
    container.addEventListener("pointermove", move);
    container.addEventListener("pointerleave", leave);
    const render = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      let moving = false;
      groups.forEach((g, i) => {
        const target = i <= phaseRef.current ? 1 : 0;
        const current = g.scale.y;
        const next = THREE.MathUtils.damp(current, target, 9, dt);
        g.scale.y = Math.max(0.001, next);
        g.visible = next > 0.01;
        g.position.y = (1 - next) * -0.3;
        if (Math.abs(next - target) > 0.002) moving = true;
      });
      villa.rotation.y = THREE.MathUtils.damp(villa.rotation.y, targetX, 6, dt);
      if (Math.abs(villa.rotation.y - targetX) > 0.001) moving = true;
      renderer.render(scene, camera);
      // Stop drawing when settled. Phase changes are watched by the small timer below.
      if (moving || settled++ < 3) raf = requestAnimationFrame(render);
    };
    function start() {
      settled = 0;
      if (!raf && visible && !document.hidden) {
        previous = performance.now();
        raf = requestAnimationFrame(render);
      }
    }
    redraw.current = start;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
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
      container.removeEventListener("pointermove", move);
      container.removeEventListener("pointerleave", leave);
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
      aria-label={`Villa contemporaine en trois dimensions — phase ${phase + 1} sur 4`}
    />
  );
}
