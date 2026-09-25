"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CurrentMood } from "@/components/spotify/current-mood";
import { HeroOrbitNavigation } from "@/components/sections/hero-orbit-navigation";
import { ArrowUpRight, DownloadIcon } from "@/components/ui/icons";
import { personal } from "@/statics/personal";
import { useVisualQuality } from "@/components/layout/visual-quality";

const disciplines = ["PRODUCT THINKING", "FRONTEND CRAFT", "FULL-STACK SYSTEMS", "INTERACTIVE WEB"];

export function InteractiveHero() {
  const [discipline, setDiscipline] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const { quality } = useVisualQuality();

  useEffect(() => {
    const interval = window.setInterval(() => setDiscipline((current) => (current + 1) % disciplines.length), 2100);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 1.5 : quality === "balanced" ? 1.15 : 1));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
      camera.position.z = 8;
      const system = new THREE.Group();
      scene.add(system);

      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.47, quality === "high" ? 64 : quality === "balanced" ? 40 : 24, quality === "high" ? 48 : quality === "balanced" ? 30 : 18),
        new THREE.MeshPhysicalMaterial({
          color: 0xe7dcc4,
          roughness: 0.08,
          metalness: 0.04,
          transmission: 0.8,
          thickness: 1.8,
          transparent: true,
          opacity: 0.82,
          clearcoat: 1,
          clearcoatRoughness: 0.03,
          iridescence: 0.88,
          iridescenceIOR: 1.38,
          attenuationColor: new THREE.Color(0xc9ff57),
          attenuationDistance: 2.4,
        }),
      );
      system.add(globe);

      const mineralCore = new THREE.Mesh(
        new THREE.SphereGeometry(1.12, quality === "high" ? 48 : 28, quality === "high" ? 36 : 20),
        new THREE.MeshStandardMaterial({ color: 0x284f47, emissive: 0x102d2c, emissiveIntensity: 0.58, roughness: 0.38, metalness: 0.08 }),
      );
      system.add(mineralCore);

      const atmosphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.58, quality === "high" ? 56 : 30, quality === "high" ? 42 : 22),
        new THREE.MeshPhysicalMaterial({ color: 0xffe7c2, roughness: 0, transmission: 0.96, transparent: true, opacity: 0.13, side: THREE.BackSide, depthWrite: false }),
      );
      system.add(atmosphere);

      const ringMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.08,
        transmission: 0.96,
        transparent: true,
        opacity: 0.5,
      });
      const rings = [2.15, 2.72].map((radius, index) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.025 + index * 0.012, quality === "high" ? 12 : 8, quality === "high" ? 150 : 72), ringMaterial);
        ring.rotation.set(1.05 + index * 0.35, index * 0.18, index ? -0.25 : 0.28);
        system.add(ring);
        return ring;
      });
      const colors = [0xff6543, 0xc9ff57, 0xa9c3ff];
      const satellites = colors.map((color, index) => {
        const pivot = new THREE.Group();
        pivot.rotation.set(1.05 + index * 0.18, index * 0.34, index * 1.7);
        const satellite = new THREE.Mesh(
          new THREE.SphereGeometry(0.13 + index * 0.025, 24, 18),
          new THREE.MeshPhysicalMaterial({ color, roughness: 0.08, transmission: 0.35, clearcoat: 1 }),
        );
        satellite.position.x = 2.2 + index * 0.28;
        pivot.add(satellite);
        system.add(pivot);
        return pivot;
      });

      scene.add(new THREE.HemisphereLight(0xe9f1ff, 0x233426, 2.1));
      const keyLight = new THREE.PointLight(0xffffff, 22, 20, 2);
      keyLight.position.set(-3, 3.5, 5);
      const warmLight = new THREE.PointLight(0xff7047, 20, 14, 2);
      warmLight.position.set(3.8, -2.5, 3);
      const limeLight = new THREE.PointLight(0xc9ff57, 14, 12, 2);
      limeLight.position.set(-3.2, -2.2, 2);
      scene.add(keyLight, warmLight, limeLight);

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
      const clock = new THREE.Clock();
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let lastRender = 0;
      const animate = (timestamp = 0) => {
        if (disposed) return;
        if (quality === "balanced" && timestamp - lastRender < 30) {
          frame = requestAnimationFrame(animate);
          return;
        }
        lastRender = timestamp;
        const time = clock.getElapsedTime();
        system.rotation.x += (pointerRef.current.y * 0.16 - system.rotation.x) * 0.035;
        system.rotation.y += (pointerRef.current.x * 0.22 - system.rotation.y) * 0.035;
        system.position.y = Math.sin(time * 0.58) * 0.09;
        globe.rotation.y += 0.0018;
        mineralCore.rotation.y -= 0.0012;
        atmosphere.rotation.y += 0.0006;
        rings[0].rotation.z += 0.0008;
        rings[1].rotation.z -= 0.0011;
        satellites.forEach((pivot, index) => { pivot.rotation.z = time * (0.2 + index * 0.055) + index * 2; });
        renderer.render(scene, camera);
        if (!reduceMotion && quality !== "low") frame = requestAnimationFrame(animate);
      };
      animate();
      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        renderer.dispose();
      };
    });

    return () => { disposed = true; cleanup(); };
  }, [quality]);

  return <section className="landing-hero page-shell">
    <div className="landing-copy">
      <p className="landing-name">{personal.fullName}</p>
      <p className="hero-eyebrow"><span className="availability-dot" />{personal.eyebrow}</p>
      <h1>Useful products.<br/><em>Memorable</em> experiences.</h1>
      <p className="landing-intro">{personal.intro}</p>
      <div className="hero-actions">
        <Link className="button button-primary" href="/projects">See selected work <ArrowUpRight /></Link>
        <button
          className="button button-ghost resume-disabled"
          type="button"
          disabled
          title="Résumé download is unavailable"
        >
          Résumé <DownloadIcon />
        </button>
      </div>
    </div>

    <div className="landing-aside">
      <div
        className="landing-signal"
        ref={stageRef}
        aria-label={`Currently exploring ${disciplines[discipline].toLowerCase()}`}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          pointerRef.current = { x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2, y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2 };
        }}
        onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 }; }}
      >
        <canvas className="signal-canvas" ref={canvasRef} aria-hidden="true" />
        <HeroOrbitNavigation />
        <div className="signal-copy">
          <span>Currently exploring</span>
          <strong key={discipline}>{disciplines[discipline]}</strong>
        </div>
        <p>Engineering the details.<br/>Designing for people.</p>
      </div>
      <CurrentMood />
    </div>
  </section>;
}
