"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Mouse } from "lucide-react";
import * as THREE from "three";
import { journeyChapters } from "@/statics/journey";

function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function makePlanetTexture(index: number, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const random = seededRandom(107 + index * 811);
  const base = new THREE.Color(accent);
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  context.fillStyle = `#${base.clone().multiplyScalar(0.38).getHexString()}`;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < canvas.height; y += 4) {
    const wave = Math.sin(y * 0.09 + index) * 18;
    context.fillStyle = `hsla(${hsl.h * 360}, ${38 + random() * 44}%, ${24 + random() * 34}%, ${0.18 + random() * 0.34})`;
    context.fillRect(wave, y, canvas.width, 3 + random() * 5);
  }
  for (let i = 0; i < 130; i += 1) {
    context.fillStyle = `rgba(255,255,255,${random() * 0.08})`;
    context.beginPath();
    context.arc(
      random() * 512,
      random() * 256,
      2 + random() * 20,
      0,
      Math.PI * 2,
    );
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function createPlanet(index: number, accent: string) {
  const group = new THREE.Group();
  const color = new THREE.Color(accent);
  const radius = index === 0 ? 3.1 : 2.1 + (index % 4) * 0.34;
  const texture = makePlanetTexture(index, accent);
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 48),
    new THREE.MeshStandardMaterial({
      color: index === 0 ? 0xffc676 : 0xffffff,
      map: texture,
      roughness: index === 0 ? 0.75 : 0.86,
      metalness: 0.02,
      emissive: index === 0 ? color : new THREE.Color(0x000000),
      emissiveIntensity: index === 0 ? 1.25 : 0,
    }),
  );
  group.add(planet);
  group.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.08, 48, 36),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: index === 0 ? 0.2 : 0.1,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
      }),
    ),
  );
  if ([2, 5, 7].includes(index)) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(radius * 1.38, radius * 2.04, 128),
      new THREE.MeshBasicMaterial({
        color: index === 5 ? 0xe7c394 : color,
        transparent: true,
        opacity: 0.58,
        side: THREE.DoubleSide,
      }),
    );
    ring.rotation.x = Math.PI * 0.62;
    ring.rotation.y = 0.2;
    group.add(ring);
  }
  if (index > 0 && index % 2 === 0) {
    const moonPivot = new THREE.Group();
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(0.34 + index * 0.012, 24, 18),
      new THREE.MeshStandardMaterial({ color: 0xcbd2dc, roughness: 1 }),
    );
    moon.position.x = radius * 2.25;
    moonPivot.rotation.x = 0.45;
    moonPivot.add(moon);
    group.add(moonPivot);
    group.userData.moonPivot = moonPivot;
  }
  const light = new THREE.PointLight(color, index === 0 ? 48 : 12, 36, 2);
  light.position.set(radius * 0.7, radius * 0.7, 3);
  group.add(light);
  group.userData.planet = planet;
  group.userData.texture = texture;
  return group;
}

function createStarField() {
  const random = seededRandom(20020829);
  const count = 9200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const palette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xb9d7ff),
    new THREE.Color(0xffd5a5),
  ];
  for (let i = 0; i < count; i += 1) {
    const offset = i * 3;
    const radius = 24 + Math.pow(random(), 0.7) * 90;
    const angle = random() * Math.PI * 2;
    positions[offset] = Math.cos(angle) * radius;
    positions[offset + 1] = Math.sin(angle) * radius * 0.58;
    positions[offset + 2] = 28 - random() * 390;
    const color = palette[Math.floor(random() * palette.length)];
    colors[offset] = color.r;
    colors[offset + 1] = color.g;
    colors[offset + 2] = color.b;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.16,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.94,
    vertexColors: true,
  });
  return new THREE.Points(geometry, material);
}

export function JourneyScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const chapter = journeyChapters[active];

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x01040a);
    scene.fog = new THREE.Fog(0x01040a, 110, 235);
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 480);
    camera.position.set(0, 0, 11);
    scene.add(new THREE.HemisphereLight(0x8bb6ff, 0x130912, 1.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    keyLight.position.set(8, 10, 14);
    scene.add(keyLight);
    const stars = createStarField();
    scene.add(stars);

    const nebulaGeometry = new THREE.BufferGeometry();
    const nebulaRandom = seededRandom(7741);
    const nebulaPositions = new Float32Array(1800 * 3);
    for (let i = 0; i < nebulaPositions.length; i += 3) {
      const band = Math.floor(i / 3) % 3;
      nebulaPositions[i] = (nebulaRandom() - 0.5) * 34 + (band - 1) * 14;
      nebulaPositions[i + 1] = (nebulaRandom() - 0.5) * 16;
      nebulaPositions[i + 2] = -54 - band * 96 + (nebulaRandom() - 0.5) * 42;
    }
    nebulaGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(nebulaPositions, 3),
    );
    const nebulaMaterial = new THREE.PointsMaterial({
      color: 0x6e83d4,
      size: 0.34,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
    scene.add(nebula);

    const gap = 38;
    const planets = journeyChapters.map((item, index) => {
      const planet = createPlanet(index, item.accent);
      const side = index % 2 === 0 ? 1 : -1;
      planet.position.set(
        side * (6.1 + (index % 3) * 0.75),
        Math.sin(index * 1.7) * 2.5,
        -index * gap,
      );
      planet.rotation.set(0.12 * index, index * 0.4, index % 2 ? -0.12 : 0.12);
      scene.add(planet);
      return planet;
    });

    const resize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    let activeIndex = 0;
    const updateScroll = () => {
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = THREE.MathUtils.clamp(-bounds.top / distance, 0, 1);
      progressRef.current = progress;
      const next = Math.min(
        journeyChapters.length - 1,
        Math.round(progress * (journeyChapters.length - 1)),
      );
      if (next !== activeIndex) {
        activeIndex = next;
        setActive(next);
      }
    };
    const move = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX / window.innerWidth - 0.5,
        y: event.clientY / window.innerHeight - 0.5,
      };
    };
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    updateScroll();
    setReady(true);

    let frame = 0;
    const clock = new THREE.Clock();
    const render = () => {
      frame = requestAnimationFrame(render);
      const time = clock.getElapsedTime();
      const chapterPosition =
        progressRef.current * (journeyChapters.length - 1);
      const targetZ = 11 - chapterPosition * gap;
      const curveX =
        Math.sin(chapterPosition * 1.35) * 1.6 + pointerRef.current.x * 1.1;
      const curveY =
        Math.sin(chapterPosition * 0.72) * 0.8 - pointerRef.current.y * 0.65;
      camera.position.z += (targetZ - camera.position.z) * 0.065;
      camera.position.x += (curveX - camera.position.x) * 0.045;
      camera.position.y += (curveY - camera.position.y) * 0.045;
      camera.lookAt(
        camera.position.x * 0.25,
        camera.position.y * 0.2,
        camera.position.z - 18,
      );
      stars.rotation.z = time * 0.0025;
      nebula.rotation.z = -time * 0.003;
      planets.forEach((planet, index) => {
        const body = planet.userData.planet as THREE.Mesh;
        body.rotation.y += 0.0018 + index * 0.00008;
        const moonPivot = planet.userData.moonPivot as THREE.Group | undefined;
        if (moonPivot) moonPivot.rotation.y += 0.007;
        planet.position.y +=
          (Math.sin(time * 0.42 + index * 1.7) * 0.42 +
            Math.sin(index * 1.7) * 2.5 -
            planet.position.y) *
          0.012;
      });
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("pointermove", move);
      observer.disconnect();
      planets.forEach((planet) => {
        (planet.userData.texture as THREE.Texture | null)?.dispose();
        planet.traverse((object) => {
          if (!(object instanceof THREE.Mesh)) return;
          object.geometry.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material.dispose());
        });
      });
      stars.geometry.dispose();
      (stars.material as THREE.Material).dispose();
      nebulaGeometry.dispose();
      nebulaMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="journey-experience" ref={sectionRef}>
      <div className="journey-viewport">
        <canvas ref={canvasRef} aria-hidden="true" />
        <div className="journey-vignette" aria-hidden="true" />
        <div className="journey-progress" aria-hidden="true">
          <span>Flight log</span>
          <b>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(journeyChapters.length).padStart(2, "0")}
          </b>
          <i>
            <span
              style={{
                transform: `scaleX(${(active + 1) / journeyChapters.length})`,
              }}
            />
          </i>
        </div>
        <article
          className={`journey-hud ${active % 2 ? "is-right" : ""}`}
          key={`${chapter.year}-${chapter.title}`}
          aria-live="polite"
        >
          <div className="journey-hud-line" aria-hidden="true">
            <i style={{ background: chapter.accent }} />
          </div>
          <span>
            {String(active + 1).padStart(2, "0")} · {chapter.kicker}
          </span>
          <time>{chapter.year}</time>
          <h1>{chapter.title}</h1>
          <p>{chapter.copy}</p>
          {active === 0 ? (
            <small>
              <Mouse aria-hidden="true" /> Scroll to fly forward{" "}
              <ArrowDown aria-hidden="true" />
            </small>
          ) : null}
          {active === journeyChapters.length - 1 ? (
            <Link href="/projects">
              See what I build now <ArrowUpRight aria-hidden="true" />
            </Link>
          ) : null}
        </article>
        {!ready ? (
          <div className="journey-loading">Preparing the flight path…</div>
        ) : null}
      </div>
      <div className="journey-scroll-track" aria-hidden="true">
        {journeyChapters.map((item) => (
          <span key={`${item.year}-${item.title}`} />
        ))}
      </div>
      <ol className="journey-accessible-list">
        {journeyChapters.map((item) => (
          <li key={`${item.year}-${item.title}`}>
            <time>{item.year}</time>
            <strong>{item.title}</strong>
            <p>{item.copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
