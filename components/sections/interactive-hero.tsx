"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CurrentMood } from "@/components/spotify/current-mood";
import { ArrowUpRight, DownloadIcon } from "@/components/ui/icons";
import { personal } from "@/statics/personal";

const disciplines = ["PRODUCT THINKING", "FRONTEND CRAFT", "FULL-STACK SYSTEMS", "INTERACTIVE WEB"];

export function InteractiveHero() {
  const [discipline, setDiscipline] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.08;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 30);
      camera.position.z = 8;
      const system = new THREE.Group();
      scene.add(system);

      const globe = new THREE.Mesh(
        new THREE.SphereGeometry(1.47, 64, 48),
        new THREE.MeshPhysicalMaterial({
          color: 0xb9cdfd,
          roughness: 0.04,
          transmission: 0.87,
          thickness: 1.5,
          transparent: true,
          opacity: 0.7,
          clearcoat: 1,
          clearcoatRoughness: 0.03,
          iridescence: 0.42,
        }),
      );
      system.add(globe);

      const ringMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.08,
        transmission: 0.96,
        transparent: true,
        opacity: 0.5,
      });
      const rings = [2.15, 2.72].map((radius, index) => {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.025 + index * 0.012, 12, 150), ringMaterial);
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
      scene.add(keyLight);

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
      const animate = () => {
        if (disposed) return;
        const time = clock.getElapsedTime();
        system.rotation.x += (pointerRef.current.y * 0.16 - system.rotation.x) * 0.035;
        system.rotation.y += (pointerRef.current.x * 0.22 - system.rotation.y) * 0.035;
        system.position.y = Math.sin(time * 0.58) * 0.09;
        globe.rotation.y += 0.0018;
        rings[0].rotation.z += 0.0008;
        rings[1].rotation.z -= 0.0011;
        satellites.forEach((pivot, index) => { pivot.rotation.z = time * (0.2 + index * 0.055) + index * 2; });
        renderer.render(scene, camera);
        if (!reduceMotion) frame = requestAnimationFrame(animate);
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
  }, []);

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
        <div className="signal-orbit" aria-hidden="true"><span /><span /><span /></div>
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
