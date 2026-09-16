"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Camera, Compass, Sparkles } from "lucide-react";

const coordinates = [
  {
    id: "now",
    label: "Now",
    eyebrow: "Current coordinates",
    title: "Making useful things, then making them clearer.",
    copy: "Right now I am sharpening the way I turn complicated ideas into calm, practical products while leaving enough room for experiments that make the web feel alive.",
    stat: "In motion",
    detail: "Building · Learning · Refining",
    color: 0xa9c3ff,
    icon: Compass,
  },
  {
    id: "building",
    label: "Building",
    eyebrow: "On the workbench",
    title: "Search that understands the trip.",
    copy: "My latest work explores smarter parking recommendations by connecting timing, preferences, availability, and the practical details people actually care about.",
    stat: "AI search",
    detail: "Product engineering",
    color: 0xc9ff57,
    icon: Sparkles,
  },
  {
    id: "outside",
    label: "Off-screen",
    eyebrow: "Outside the editor",
    title: "A camera, running shoes, and somewhere new.",
    copy: "Photography slows me down enough to notice things. Running clears the noise. Travel reliably gives me another question worth following.",
    stat: "Keep moving",
    detail: "Photography · Running · Travel",
    color: 0xff6543,
    icon: Camera,
  },
] as const;

export function HomeOrbit() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const applyColorRef = useRef<((color: number) => void) | null>(null);
  const [active, setActive] = useState(0);
  const selected = coordinates[active];

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;
    let disposed = false;
    let frame = 0;
    let visible = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0, 10);
      const system = new THREE.Group();
      scene.add(system);

      const planetMaterial = new THREE.MeshPhysicalMaterial({ color: coordinates[0].color, roughness: 0.04, metalness: 0, transmission: 0.76, thickness: 1.8, transparent: true, opacity: 0.92, clearcoat: 1, clearcoatRoughness: 0.025, iridescence: 0.5, iridescenceIOR: 1.24, attenuationColor: new THREE.Color(coordinates[0].color), attenuationDistance: 2.2 });
      const planet = new THREE.Mesh(new THREE.SphereGeometry(2.25, 72, 54), planetMaterial);
      system.add(planet);
      const coreMaterial = new THREE.MeshBasicMaterial({ color: coordinates[0].color, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false });
      const core = new THREE.Mesh(new THREE.SphereGeometry(1.72, 48, 36), coreMaterial);
      system.add(core);
      const atmosphereMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.02, transmission: 0.98, transparent: true, opacity: 0.12, side: THREE.BackSide, depthWrite: false });
      const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(2.34, 64, 48), atmosphereMaterial);
      system.add(atmosphere);

      const ringMaterial = new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, transmission: 0.96, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(3.25, 0.045, 18, 170), ringMaterial);
      ring.rotation.x = 1.13;
      ring.rotation.z = 0.22;
      system.add(ring);
      const satellite = new THREE.Mesh(new THREE.SphereGeometry(0.18, 24, 18), new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.08, transmission: 0.82 }));
      satellite.position.set(3.25, 0, 0);
      const satellitePivot = new THREE.Group();
      satellitePivot.rotation.x = 1.13;
      satellitePivot.add(satellite);
      system.add(satellitePivot);

      const glow = new THREE.PointLight(coordinates[0].color, 24, 18, 2);
      glow.position.set(-3, 2, 4);
      scene.add(glow, new THREE.HemisphereLight(0xdce7ff, 0x243124, 2.1));
      applyColorRef.current = (color) => {
        planetMaterial.color.setHex(color);
        planetMaterial.attenuationColor.setHex(color);
        coreMaterial.color.setHex(color);
        glow.color.setHex(color);
      };

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
      const animate = () => {
        if (disposed) return;
        frame = requestAnimationFrame(animate);
        if (!visible) return;
        const time = clock.getElapsedTime();
        system.rotation.x += (pointerRef.current.y * 0.16 - system.rotation.x) * 0.035;
        system.rotation.y += (pointerRef.current.x * 0.22 - system.rotation.y) * 0.035;
        planet.rotation.y += 0.0022;
        core.scale.setScalar(1 + Math.sin(time * 0.8) * 0.035);
        atmosphere.rotation.y -= 0.0009;
        ring.rotation.z += 0.0011;
        satellitePivot.rotation.z = time * 0.3;
        system.position.y = Math.sin(time * 0.55) * 0.12;
        renderer.render(scene, camera);
      };
      animate();
      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        planet.geometry.dispose();
        planetMaterial.dispose();
        core.geometry.dispose();
        coreMaterial.dispose();
        atmosphere.geometry.dispose();
        atmosphereMaterial.dispose();
        ring.geometry.dispose();
        ringMaterial.dispose();
        satellite.geometry.dispose();
        satellite.material.dispose();
        renderer.dispose();
      };
    });

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "200px" });
    observer.observe(stage);
    return () => { disposed = true; observer.disconnect(); applyColorRef.current = null; cleanup(); };
  }, []);

  useEffect(() => {
    applyColorRef.current?.(coordinates[active].color);
  }, [active]);

  return <section className="home-orbit page-shell" ref={sectionRef} aria-labelledby="home-orbit-title">
    <header className="home-section-heading"><p><span>04</span>Current coordinates</p><h2 id="home-orbit-title">A small transmission<br />from where I am now.</h2><Link href="/journey">Travel through my journey <ArrowUpRight /></Link></header>
    <div className="home-orbit-console">
      <div className="home-orbit-stage" onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); pointerRef.current = { x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 2, y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 2 }; }} onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 }; }}>
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="home-orbit-readout"><small>Signal</small><strong>{selected.stat}</strong><span>{selected.detail}</span></div>
      </div>
      <div className="home-orbit-copy" aria-live="polite"><span>{selected.eyebrow}</span><h3 key={selected.id}>{selected.title}</h3><p>{selected.copy}</p><div className="home-orbit-tabs" aria-label="Choose a transmission">{coordinates.map((item, index) => { const Icon = item.icon; return <button className={active === index ? "is-active" : ""} type="button" aria-pressed={active === index} onClick={() => setActive(index)} key={item.id}><Icon aria-hidden="true" />{item.label}</button>; })}</div></div>
    </div>
  </section>;
}
