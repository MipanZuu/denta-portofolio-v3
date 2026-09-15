"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "@/components/ui/icons";

const modes = [
  {
    id: "curiosity",
    label: "Curiosity",
    title: "Ideas in orbit",
    colors: [0xa9c3ff, 0xc9ff57, 0xff6543],
  },
  {
    id: "craft",
    label: "Craft",
    title: "Details in motion",
    colors: [0xff6543, 0xffd6a9, 0xa9c3ff],
  },
  {
    id: "systems",
    label: "Systems",
    title: "Pieces that click",
    colors: [0xc9ff57, 0x8fe5ca, 0xa9c3ff],
  },
] as const;

export function HomePlayground() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const activeModeRef = useRef(0);
  const applyModeRef = useRef<((index: number) => void) | null>(null);
  const [activeMode, setActiveMode] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !section || !stage) return;

    let disposed = false;
    let animationFrame = 0;
    let cleanupScene = () => {};

    Promise.all([
      import("three"),
      import("three/addons/environments/RoomEnvironment.js"),
    ]).then(([THREE, { RoomEnvironment }]) => {
      if (disposed) return;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 0, 11);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = environment;

      const group = new THREE.Group();
      group.rotation.z = -0.08;
      scene.add(group);

      const geometry = new THREE.SphereGeometry(1, 64, 48);
      const bubbleData = [
        { position: [0.15, 0, 0], scale: 2.05, speed: 0.48 },
        { position: [-2.75, 1.55, -0.7], scale: 0.78, speed: 0.76 },
        { position: [2.95, 1.65, -1.1], scale: 0.62, speed: 0.92 },
        { position: [2.65, -1.75, -0.5], scale: 0.92, speed: 0.64 },
        { position: [-2.5, -1.9, -1.3], scale: 0.5, speed: 1.05 },
      ];
      const materials: InstanceType<typeof THREE.MeshPhysicalMaterial>[] = [];
      const bubbles = bubbleData.map((bubble, index) => {
        const material = new THREE.MeshPhysicalMaterial({
          color: modes[0].colors[index % 3],
          roughness: 0.06,
          metalness: 0,
          transmission: 0.98,
          thickness: index === 0 ? 1.4 : 0.8,
          ior: 1.28,
          transparent: true,
          opacity: index === 0 ? 0.82 : 0.7,
          clearcoat: 1,
          clearcoatRoughness: 0.04,
          iridescence: 0.55,
          iridescenceIOR: 1.2,
          attenuationColor: new THREE.Color(modes[0].colors[index % 3]),
          attenuationDistance: 2.4,
        });
        materials.push(material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...(bubble.position as [number, number, number]));
        mesh.scale.setScalar(bubble.scale);
        mesh.userData.baseY = bubble.position[1];
        mesh.userData.speed = bubble.speed;
        group.add(mesh);
        return mesh;
      });

      const ringMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.08,
        transmission: 0.92,
        transparent: true,
        opacity: 0.56,
        side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.05, 0.035, 18, 150),
        ringMaterial,
      );
      ring.rotation.x = 1.12;
      ring.rotation.z = 0.36;
      group.add(ring);

      const glow = new THREE.PointLight(0xc9ff57, 14, 18, 2);
      glow.position.set(-2, 1.5, 3);
      scene.add(glow, new THREE.AmbientLight(0xbfd0ff, 1.8));

      applyModeRef.current = (index) => {
        const selected = modes[index] ?? modes[0];
        materials.forEach((material, materialIndex) => {
          const color = selected.colors[materialIndex % selected.colors.length];
          material.color.setHex(color);
          material.attenuationColor.setHex(color);
        });
        glow.color.setHex(selected.colors[1]);
      };
      applyModeRef.current(activeModeRef.current);

      const resize = () => {
        const width = stage.clientWidth;
        const height = stage.clientHeight;
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(stage);
      resize();

      const startedAt = performance.now();
      const animate = (now: number) => {
        if (disposed) return;
        animationFrame = requestAnimationFrame(animate);
        const time = (now - startedAt) / 1000;
        const targetX = pointerRef.current.y * 0.18 + scrollRef.current * 0.16;
        const targetY = pointerRef.current.x * 0.26 + scrollRef.current * 0.24;
        group.rotation.x += (targetX - group.rotation.x) * 0.035;
        group.rotation.y += (targetY - group.rotation.y) * 0.035;
        group.position.y = (scrollRef.current - 0.5) * -0.8;
        bubbles.forEach((bubble, index) => {
          bubble.position.y =
            bubble.userData.baseY +
            Math.sin(time * bubble.userData.speed + index * 1.4) * 0.18;
          bubble.rotation.y += 0.002 + index * 0.0003;
        });
        ring.rotation.z += 0.0014;
        renderer.render(scene, camera);
      };
      animationFrame = requestAnimationFrame(animate);

      cleanupScene = () => {
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        applyModeRef.current = null;
        geometry.dispose();
        materials.forEach((material) => material.dispose());
        ring.geometry.dispose();
        ringMaterial.dispose();
        environment.dispose();
        pmrem.dispose();
        renderer.dispose();
      };
    });

    const updateScroll = () => {
      const bounds = section.getBoundingClientRect();
      scrollRef.current = Math.max(
        0,
        Math.min(1, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)),
      );
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    updateScroll();

    return () => {
      disposed = true;
      window.removeEventListener("scroll", updateScroll);
      cleanupScene();
    };
  }, []);

  useEffect(() => {
    activeModeRef.current = activeMode;
    applyModeRef.current?.(activeMode);
  }, [activeMode]);

  const moveBubbles = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
      y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
    };
  };

  return (
    <section
      className="home-playground page-shell"
      ref={sectionRef}
      onPointerMove={moveBubbles}
      onPointerLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
      }}
    >
      <div className="home-playground-copy">
        <p><span>01</span> Interactive break</p>
        <h2>A little glass.<br /><em>A little gravity.</em></h2>
        <p>
          A tiny playground, because portfolios do not have to sit still.
          Follow your cursor, pick a mood, and let the bubbles wander.
        </p>
        <Link href="/space">Go deeper into space <ArrowUpRight /></Link>
      </div>

      <div className="home-playground-stage" aria-label="Interactive glass bubble sculpture">
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="home-playground-label">
          <small>Currently orbiting</small>
          <strong key={activeMode}>{modes[activeMode].title}</strong>
        </div>
        <div className="home-playground-modes" aria-label="Choose a bubble mood">
          {modes.map((mode, index) => (
            <button
              className={activeMode === index ? "is-active" : ""}
              type="button"
              key={mode.id}
              onClick={() => setActiveMode(index)}
              aria-pressed={activeMode === index}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
