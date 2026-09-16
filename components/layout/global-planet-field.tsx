"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

function randomSource(seedValue: number) {
  let seed = seedValue;
  return () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
}

export function GlobalPlanetField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const immersiveRoute = pathname === "/journey" || pathname === "/space";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || immersiveRoute) return;
    let disposed = false;
    let scheduled = 0;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, .1, 80);
      camera.position.z = 13;
      const system = new THREE.Group();
      scene.add(system);
      scene.add(new THREE.HemisphereLight(0xb8d2ff, 0x1a0e13, 1.35));
      const sun = new THREE.DirectionalLight(0xfff3df, 3.4);
      sun.position.set(-7, 9, 12);
      scene.add(sun);

      const starLayers = new THREE.Group();
      scene.add(starLayers);
      const starResources: Array<{
        geometry: InstanceType<typeof THREE.BufferGeometry>;
        material: InstanceType<typeof THREE.PointsMaterial>;
      }> = [];
      const makeStarLayer = (
        count: number,
        spread: number,
        depth: number,
        size: number,
        opacity: number,
        seed: number,
      ) => {
        const random = randomSource(seed);
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const palette = [
          new THREE.Color(0xffffff),
          new THREE.Color(0xb9d0ff),
          new THREE.Color(0xffd6a7),
          new THREE.Color(0xd9ffb2),
        ];
        for (let index = 0; index < count; index += 1) {
          const offset = index * 3;
          positions[offset] = (random() - .5) * spread;
          positions[offset + 1] = (random() - .5) * spread * .68;
          positions[offset + 2] = depth - random() * 4;
          const color = palette[Math.floor(random() * palette.length)];
          colors.set([color.r, color.g, color.b], offset);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        const material = new THREE.PointsMaterial({
          size,
          vertexColors: true,
          transparent: true,
          opacity,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          sizeAttenuation: true,
        });
        const points = new THREE.Points(geometry, material);
        starResources.push({ geometry, material });
        starLayers.add(points);
        return points;
      };
      const farStars = makeStarLayer(720, 34, -20, .035, .42, 4201);
      const middleStars = makeStarLayer(360, 27, -10, .052, .5, 7331);
      const nearStars = makeStarLayer(130, 23, -2, .075, .4, 9109);

      const textures: InstanceType<typeof THREE.CanvasTexture>[] = [];
      const makeTexture = (seed: number, colors: [string, string, string], rocky: boolean) => {
        const textureCanvas = document.createElement("canvas");
        textureCanvas.width = 512;
        textureCanvas.height = 256;
        const context = textureCanvas.getContext("2d");
        if (!context) return null;
        const random = randomSource(seed);
        const gradient = context.createLinearGradient(0, 0, 0, 256);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(.5, colors[1]);
        gradient.addColorStop(1, colors[2]);
        context.fillStyle = gradient;
        context.fillRect(0, 0, 512, 256);
        for (let y = 0; y < 256; y += rocky ? 5 : 3) {
          const offset = Math.sin(y * .05 + seed) * 18;
          context.fillStyle = `rgba(255,255,255,${rocky ? .025 + random() * .05 : .045 + random() * .09})`;
          context.fillRect(offset - 30, y, 572, 1 + random() * (rocky ? 4 : 8));
        }
        const details = rocky ? 125 : 42;
        for (let index = 0; index < details; index += 1) {
          const x = random() * 512;
          const y = random() * 256;
          const radius = 2 + random() * (rocky ? 17 : 28);
          context.beginPath();
          context.ellipse(x, y, radius * (rocky ? 1.2 : 2.8), radius, random() * Math.PI, 0, Math.PI * 2);
          context.fillStyle = rocky ? `rgba(12,18,18,${.05 + random() * .15})` : `rgba(255,220,185,${.025 + random() * .06})`;
          context.fill();
        }
        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        textures.push(texture);
        return texture;
      };

      const makePlanet = (radius: number, texture: ReturnType<typeof makeTexture>, ringed = false) => {
        const group = new THREE.Group();
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(radius, 48, 36),
          new THREE.MeshStandardMaterial({ map: texture, roughness: .76, metalness: .02 }),
        );
        group.add(sphere);
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.035, 40, 30),
          new THREE.MeshPhysicalMaterial({ color: 0xbfe7df, transparent: true, opacity: .1, transmission: .7, side: THREE.BackSide, depthWrite: false }),
        );
        group.add(atmosphere);
        if (ringed) {
          for (let band = 0; band < 7; band += 1) {
            const inner = radius * (1.34 + band * .08);
            const ring = new THREE.Mesh(
              new THREE.RingGeometry(inner, inner + radius * .035, 112),
              new THREE.MeshBasicMaterial({ color: band % 2 ? 0xc9ff57 : 0xe5cfa8, transparent: true, opacity: .14 + band * .025, side: THREE.DoubleSide, depthWrite: false }),
            );
            ring.rotation.x = Math.PI * .62;
            ring.rotation.z = -.14;
            group.add(ring);
          }
        }
        group.userData.sphere = sphere;
        return group;
      };

      const near = makePlanet(3.9, makeTexture(113, ["#27151b", "#9d4735", "#291822"], true));
      near.position.set(-8.8, -6.1, -1.5);
      near.rotation.z = -.16;
      const middle = makePlanet(1.85, makeTexture(271, ["#162b29", "#5d8c58", "#152625"], false), true);
      middle.position.set(7.5, -.8, -3.8);
      middle.rotation.set(.18, -.45, .1);
      const far = makePlanet(.72, makeTexture(811, ["#111a38", "#4969a2", "#12162d"], false));
      far.position.set(-5.5, 4.2, -8.5);
      system.add(near, middle, far);

      const render = () => {
        scheduled = 0;
        renderer.render(scene, camera);
      };
      const scheduleRender = () => { if (!scheduled) scheduled = window.requestAnimationFrame(render); };
      let nearBaseY = -6.1;
      let middleBaseY = -.8;
      let farBaseY = 4.2;
      const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const mobile = width < 700;
        nearBaseY = mobile ? -5.35 : -6.1;
        middleBaseY = mobile ? .65 : -.8;
        farBaseY = mobile ? 4.15 : 4.2;
        near.position.set(mobile ? -3.7 : -8.8, nearBaseY, mobile ? -2.7 : -1.5);
        middle.position.set(mobile ? 2.45 : 7.5, middleBaseY, mobile ? -4.8 : -3.8);
        far.position.set(mobile ? -1.9 : -5.5, farBaseY, mobile ? -8 : -8.5);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        scheduleRender();
      };
      const pointer = (event: PointerEvent) => {
        const pointerX = event.clientX / window.innerWidth - .5;
        const pointerY = event.clientY / window.innerHeight - .5;
        system.rotation.y = pointerX * .055;
        system.rotation.x = pointerY * -.035;
        nearStars.position.set(pointerX * -.22, pointerY * .16, 0);
        middleStars.position.set(pointerX * -.1, pointerY * .07, 0);
        farStars.position.set(pointerX * -.035, pointerY * .025, 0);
        scheduleRender();
      };
      const scroll = () => {
        const offset = window.scrollY * .00045;
        near.position.y = nearBaseY + offset;
        middle.position.y = middleBaseY + offset * .45;
        far.position.y = farBaseY + offset * .18;
        nearStars.position.y = window.scrollY * .00016;
        middleStars.position.y = window.scrollY * .00007;
        (near.userData.sphere as InstanceType<typeof THREE.Mesh>).rotation.y = window.scrollY * .00012;
        (middle.userData.sphere as InstanceType<typeof THREE.Mesh>).rotation.y = -window.scrollY * .00018;
        scheduleRender();
      };
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", pointer, { passive: true });
      window.addEventListener("scroll", scroll, { passive: true });
      resize();
      cleanup = () => {
        window.cancelAnimationFrame(scheduled);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", pointer);
        window.removeEventListener("scroll", scroll);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose();
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        starResources.forEach(({ geometry, material }) => {
          geometry.dispose();
          material.dispose();
        });
        textures.forEach((texture) => texture.dispose());
        renderer.dispose();
      };
    });
    return () => { disposed = true; cleanup(); };
  }, [immersiveRoute]);

  if (immersiveRoute) return null;
  return <canvas className="global-planet-field" ref={canvasRef} aria-hidden="true" />;
}
