"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useVisualQuality } from "@/components/layout/visual-quality";

function randomSource(seedValue: number) {
  let seed = seedValue;
  return () => { seed = seed * 16807 % 2147483647; return (seed - 1) / 2147483646; };
}

type PlanetPalette = [string, string, string];
type EnvironmentKey = "home" | "about" | "projects" | "docs" | "playground";

const environments: Record<EnvironmentKey, {
  near: PlanetPalette;
  middle: PlanetPalette;
  far: PlanetPalette;
  light: number;
  starScale: number;
}> = {
  home: { near: ["#27151b", "#9d4735", "#291822"], middle: ["#162b29", "#5d8c58", "#152625"], far: ["#111a38", "#4969a2", "#12162d"], light: 0xbfe7df, starScale: 1.12 },
  about: { near: ["#2c1717", "#b56845", "#351b24"], middle: ["#34241d", "#d39a63", "#2d1d1c"], far: ["#261a31", "#87648f", "#171326"], light: 0xffc89d, starScale: .82 },
  projects: { near: ["#111d2e", "#315a78", "#0d1524"], middle: ["#102b2b", "#55a28e", "#0a2020"], far: ["#20223d", "#7180c2", "#11152c"], light: 0x9fd9ff, starScale: 1.28 },
  docs: { near: ["#171d19", "#48564b", "#111512"], middle: ["#253127", "#77906d", "#172019"], far: ["#1b2430", "#53677b", "#10161e"], light: 0xdde8d8, starScale: .5 },
  playground: { near: ["#23132d", "#7a3b87", "#161022"], middle: ["#0d3031", "#33a99d", "#081c22"], far: ["#2a1931", "#d35d79", "#15101f"], light: 0xb8fff0, starScale: 1.45 },
};

function environmentFor(pathname: string): EnvironmentKey {
  const route = pathname.split("/").filter(Boolean)[0];
  if (route === "about" || route === "projects" || route === "docs" || route === "playground") return route;
  return "home";
}

export function GlobalPlanetField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const { quality } = useVisualQuality();
  const immersiveRoute = pathname === "/journey" || pathname === "/space";
  const environmentKey = environmentFor(pathname);
  const environment = environments[environmentKey];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || immersiveRoute) return;
    let disposed = false;
    let scheduled = 0;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 1.2 : 1));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, .1, 80);
      camera.position.z = 13;
      const system = new THREE.Group();
      scene.add(system);
      scene.add(new THREE.HemisphereLight(environment.light, 0x1a0e13, 1.35));
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
      const density = (quality === "high" ? 1 : quality === "balanced" ? .58 : .25) * environment.starScale;
      const farStars = makeStarLayer(Math.round(720 * density), 34, -20, .035, .42, 4201);
      const middleStars = makeStarLayer(Math.round(360 * density), 27, -10, .052, .5, 7331);
      const nearStars = makeStarLayer(Math.round(130 * density), 23, -2, .075, .4, 9109);

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
        const detail = quality === "high" ? [48, 36] : quality === "balanced" ? [32, 24] : [20, 14];
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(radius, detail[0], detail[1]),
          new THREE.MeshStandardMaterial({ map: texture, roughness: .76, metalness: .02 }),
        );
        group.add(sphere);
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.035, Math.max(16, detail[0] - 8), Math.max(12, detail[1] - 6)),
          new THREE.MeshPhysicalMaterial({ color: 0xbfe7df, transparent: true, opacity: .1, transmission: .7, side: THREE.BackSide, depthWrite: false }),
        );
        group.add(atmosphere);
        if (ringed) {
          for (let band = 0; band < (quality === "low" ? 3 : 7); band += 1) {
            const inner = radius * (1.34 + band * .08);
            const ring = new THREE.Mesh(
              new THREE.RingGeometry(inner, inner + radius * .035, quality === "high" ? 112 : 56),
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

      const near = makePlanet(3.9, makeTexture(113, environment.near, true));
      near.position.set(-8.8, -6.1, -1.5);
      near.rotation.z = -.16;
      const middle = makePlanet(1.85, makeTexture(271, environment.middle, false), true);
      middle.position.set(7.5, -.8, -3.8);
      middle.rotation.set(.18, -.45, .1);
      const far = makePlanet(.72, makeTexture(811, environment.far, false));
      far.position.set(-5.5, 4.2, -8.5);
      system.add(near, middle, far);

      let updateConstellation: (() => void) | null = null;

      if (environmentKey === "about") {
        [
          { radius: .17, distance: 2.55, color: 0xffc78f, phase: .35 },
          { radius: .1, distance: 3.05, color: 0xeaa6b8, phase: 2.4 },
        ].forEach(({ radius, distance, color, phase }) => {
          const moon = new THREE.Mesh(
            new THREE.SphereGeometry(radius, 20, 14),
            new THREE.MeshStandardMaterial({ color, roughness: .72 }),
          );
          moon.position.set(Math.cos(phase) * distance, Math.sin(phase) * distance * .34, .5);
          middle.add(moon);
        });
      }

      if (environmentKey === "projects") {
        const points = [near.position, middle.position, far.position, new THREE.Vector3(1.2, 3.1, -6.2)];
        const constellationGeometry = new THREE.BufferGeometry().setFromPoints([points[0], points[3], points[3], points[1], points[3], points[2]]);
        const constellation = new THREE.LineSegments(
          constellationGeometry,
          new THREE.LineBasicMaterial({ color: 0xa9c3ff, transparent: true, opacity: .2 }),
        );
        system.add(constellation);
        updateConstellation = () => {
          const mobile = window.innerWidth < 700;
          const junction = new THREE.Vector3(mobile ? .2 : 1.2, mobile ? 2.5 : 3.1, -6.2);
          constellationGeometry.setFromPoints([
            near.position,
            junction,
            junction,
            middle.position,
            junction,
            far.position,
          ]);
        };
      }

      if (environmentKey === "docs") {
        [1.05, 1.28, 1.55].forEach((radius, index) => {
          const reticle = new THREE.Mesh(
            new THREE.RingGeometry(radius, radius + .012, 72),
            new THREE.MeshBasicMaterial({ color: 0xdde8d8, transparent: true, opacity: .13 - index * .025, side: THREE.DoubleSide }),
          );
          reticle.rotation.x = Math.PI * .52;
          far.add(reticle);
        });
      }

      if (environmentKey === "playground") {
        [4.6, 5.35, 6.1].forEach((radius, index) => {
          const laboratoryOrbit = new THREE.Mesh(
            new THREE.TorusGeometry(radius, .012, 6, 96),
            new THREE.MeshBasicMaterial({ color: index === 1 ? 0xc9ff57 : 0x8ce6e6, transparent: true, opacity: .12 }),
          );
          laboratoryOrbit.rotation.set(1.1 + index * .17, .2, index * .38);
          middle.add(laboratoryOrbit);
        });
      }

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
        updateConstellation?.();
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
      const restore = (event: Event) => {
        event.preventDefault();
        scheduleRender();
      };
      const resume = () => {
        if (document.visibilityState === "visible") {
          resize();
          scheduleRender();
        }
      };
      canvas.addEventListener("webglcontextlost", restore);
      canvas.addEventListener("webglcontextrestored", scheduleRender);
      document.addEventListener("visibilitychange", resume);
      window.addEventListener("pageshow", resume);
      window.addEventListener("resize", resize);
      if (quality !== "low") window.addEventListener("pointermove", pointer, { passive: true });
      window.addEventListener("scroll", scroll, { passive: true });
      resize();
      cleanup = () => {
        window.cancelAnimationFrame(scheduled);
        canvas.removeEventListener("webglcontextlost", restore);
        canvas.removeEventListener("webglcontextrestored", scheduleRender);
        document.removeEventListener("visibilitychange", resume);
        window.removeEventListener("pageshow", resume);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", pointer);
        window.removeEventListener("scroll", scroll);
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
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
  }, [environment, environmentKey, immersiveRoute, pathname, quality]);

  if (immersiveRoute) return null;
  return <canvas key={pathname} className={`global-planet-field environment-${environmentKey}`} ref={canvasRef} aria-hidden="true" />;
}
