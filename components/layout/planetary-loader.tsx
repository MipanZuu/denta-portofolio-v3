"use client";

import { useEffect, useRef } from "react";

export function PlanetaryLoader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let frame = 0;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, .1, 50);
      camera.position.z = 8;
      scene.add(new THREE.HemisphereLight(0xb8ddff, 0x160d19, 1.5));
      const light = new THREE.DirectionalLight(0xfff1dc, 4.2);
      light.position.set(-5, 7, 10);
      scene.add(light);

      const textureCanvas = document.createElement("canvas");
      textureCanvas.width = 512;
      textureCanvas.height = 256;
      const textureContext = textureCanvas.getContext("2d");
      if (!textureContext) return;
      const gradient = textureContext.createLinearGradient(0, 0, 0, 256);
      gradient.addColorStop(0, "#172f2d");
      gradient.addColorStop(.48, "#86a963");
      gradient.addColorStop(1, "#1d2529");
      textureContext.fillStyle = gradient;
      textureContext.fillRect(0, 0, 512, 256);
      for (let y = 0; y < 256; y += 4) {
        textureContext.fillStyle = `rgba(255,${205 + y % 40},${145 + y % 55},${.035 + (y % 17) / 240})`;
        textureContext.fillRect(Math.sin(y * .08) * 24 - 24, y, 560, 2 + y % 6);
      }
      const planetTexture = new THREE.CanvasTexture(textureCanvas);
      planetTexture.colorSpace = THREE.SRGBColorSpace;
      planetTexture.wrapS = THREE.RepeatWrapping;

      const system = new THREE.Group();
      scene.add(system);
      const planet = new THREE.Mesh(new THREE.SphereGeometry(1.42, 56, 42), new THREE.MeshStandardMaterial({ map: planetTexture, roughness: .66, metalness: .03 }));
      system.add(planet);
      const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.49, 48, 36), new THREE.MeshPhysicalMaterial({ color: 0xc9ffdd, transparent: true, opacity: .11, transmission: .8, side: THREE.BackSide, depthWrite: false }));
      system.add(atmosphere);
      const rings = new THREE.Group();
      for (let band = 0; band < 8; band += 1) {
        const inner = 1.95 + band * .1;
        rings.add(new THREE.Mesh(new THREE.RingGeometry(inner, inner + .038, 120), new THREE.MeshBasicMaterial({ color: band % 2 ? 0xc9ff57 : 0xffbc89, transparent: true, opacity: .17 + band * .025, side: THREE.DoubleSide, depthWrite: false })));
      }
      rings.rotation.set(Math.PI * .61, .13, -.12);
      system.add(rings);

      const moonPivot = new THREE.Group();
      moonPivot.rotation.x = .46;
      const moon = new THREE.Mesh(new THREE.SphereGeometry(.22, 24, 18), new THREE.MeshStandardMaterial({ color: 0xff7957, roughness: .72 }));
      moon.position.x = 2.75;
      moonPivot.add(moon);
      system.add(moonPivot);

      const starCount = 720;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      let seed = 2917;
      const random = () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
      const palette = [new THREE.Color(0xffffff), new THREE.Color(0xa9c3ff), new THREE.Color(0xffd5a5), new THREE.Color(0xc9ffcf)];
      for (let index = 0; index < starCount; index += 1) {
        const offset = index * 3;
        positions[offset] = (random() - .5) * 20;
        positions[offset + 1] = (random() - .5) * 12;
        positions[offset + 2] = -2 - random() * 18;
        const color = palette[Math.floor(random() * palette.length)];
        colors.set([color.r, color.g, color.b], offset);
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const starMaterial = new THREE.PointsMaterial({ size: .055, vertexColors: true, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        system.scale.setScalar(width < 600 ? .76 : 1);
      };
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      resize();
      const clock = new THREE.Clock();
      const animate = () => {
        if (disposed) return;
        frame = window.requestAnimationFrame(animate);
        const time = clock.getElapsedTime();
        planet.rotation.y = time * .22;
        atmosphere.rotation.y = -time * .08;
        rings.rotation.z = -.12 + Math.sin(time * .45) * .05;
        moonPivot.rotation.z = time * .72;
        stars.rotation.z = time * .006;
        system.position.y = Math.sin(time * 1.15) * .08;
        renderer.render(scene, camera);
      };
      animate();
      cleanup = () => {
        window.cancelAnimationFrame(frame);
        observer.disconnect();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        starGeometry.dispose();
        starMaterial.dispose();
        planetTexture.dispose();
        renderer.dispose();
      };
    });
    return () => { disposed = true; cleanup(); };
  }, []);

  return <div className="route-loading" role="status" aria-live="polite">
    <canvas className="loading-planet-canvas" ref={canvasRef} aria-hidden="true" />
    <span className="loading-orbit-status" aria-hidden="true">Entering orbit</span>
    <span className="sr-only">Loading page</span>
  </div>;
}
