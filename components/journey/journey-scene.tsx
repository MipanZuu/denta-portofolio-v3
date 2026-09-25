"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Mouse } from "lucide-react";
import * as THREE from "three";
import { journeyChapters } from "@/statics/journey";
import { useVisualQuality } from "@/components/layout/visual-quality";

function seededRandom(seedValue: number) {
  let seed = seedValue;
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function makePlanetTexture(index: number, accent: string) {
  const canvas = document.createElement("canvas");
  const bumpCanvas = document.createElement("canvas");
  canvas.width = bumpCanvas.width = 1024;
  canvas.height = bumpCanvas.height = 512;
  const context = canvas.getContext("2d");
  const bumpContext = bumpCanvas.getContext("2d");
  if (!context || !bumpContext) return null;
  const random = seededRandom(107 + index * 811);
  const base = new THREE.Color(accent);
  const hsl = { h: 0, s: 0, l: 0 };
  base.getHSL(hsl);
  const rocky = [1, 3, 4, 6, 8].includes(index);

  const background = context.createLinearGradient(0, 0, 0, canvas.height);
  background.addColorStop(0, `hsl(${hsl.h * 360}, ${42 + hsl.s * 28}%, 22%)`);
  background.addColorStop(
    0.48,
    `hsl(${hsl.h * 360 + 10}, ${55 + hsl.s * 20}%, 48%)`,
  );
  background.addColorStop(
    1,
    `hsl(${hsl.h * 360 - 12}, ${38 + hsl.s * 26}%, 16%)`,
  );
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);

  bumpContext.fillStyle = "#777";
  bumpContext.fillRect(0, 0, bumpCanvas.width, bumpCanvas.height);
  for (let y = 0; y < canvas.height; y += 3) {
    const wave = Math.sin(y * 0.045 + index) * 24 + Math.sin(y * 0.013) * 34;
    const bandHeight = 2 + random() * (rocky ? 8 : 15);
    context.fillStyle = `hsla(${hsl.h * 360 + (random() - 0.5) * 24}, ${35 + random() * 45}%, ${22 + random() * 44}%, ${rocky ? 0.18 : 0.34})`;
    context.fillRect(wave - 50, y, canvas.width + 100, bandHeight);
    bumpContext.fillStyle = `rgba(${80 + random() * 150},${80 + random() * 150},${80 + random() * 150},.34)`;
    bumpContext.fillRect(wave - 50, y, bumpCanvas.width + 100, bandHeight);
  }

  const detailCount = rocky ? 310 : 150;
  for (let i = 0; i < detailCount; i += 1) {
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    const radius = rocky ? 2 + random() * 20 : 5 + random() * 34;
    context.fillStyle = rocky
      ? `rgba(${30 + random() * 80},${24 + random() * 65},${24 + random() * 70},${0.06 + random() * 0.18})`
      : `rgba(255,255,255,${random() * 0.075})`;
    context.beginPath();
    context.ellipse(
      x,
      y,
      radius * (rocky ? 1 : 2.8),
      radius,
      random() * Math.PI,
      0,
      Math.PI * 2,
    );
    context.fill();
    if (rocky && radius > 10) {
      context.strokeStyle = `rgba(255,255,255,${0.04 + random() * 0.1})`;
      context.lineWidth = 2 + random() * 3;
      context.stroke();
    }
    bumpContext.fillStyle = rocky
      ? `rgb(${45 + random() * 120},${45 + random() * 120},${45 + random() * 120})`
      : `rgba(210,210,210,.2)`;
    bumpContext.beginPath();
    bumpContext.ellipse(
      x,
      y,
      radius * (rocky ? 1 : 2.8),
      radius,
      0,
      0,
      Math.PI * 2,
    );
    bumpContext.fill();
  }

  if (!rocky) {
    const stormX = 620 + (index % 3) * 70;
    const storm = context.createRadialGradient(stormX, 300, 4, stormX, 300, 68);
    storm.addColorStop(0, "rgba(255,245,220,.62)");
    storm.addColorStop(0.45, "rgba(218,132,104,.34)");
    storm.addColorStop(1, "rgba(120,60,70,0)");
    context.fillStyle = storm;
    context.beginPath();
    context.ellipse(stormX, 300, 115, 38, -0.1, 0, Math.PI * 2);
    context.fill();
  }

  const colorMap = new THREE.CanvasTexture(canvas);
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.anisotropy = 8;
  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.anisotropy = 8;
  return { colorMap, bumpMap };
}

function makeAtmosphereGlow(accent: string, isSun: boolean) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const color = new THREE.Color(accent);
  const r = Math.round(color.r * 255);
  const g = Math.round(color.g * 255);
  const b = Math.round(color.b * 255);
  const gradient = context.createRadialGradient(128, 128, 38, 128, 128, 126);
  gradient.addColorStop(0, `rgba(${r},${g},${b},0)`);
  gradient.addColorStop(0.38, `rgba(${r},${g},${b},${isSun ? 0.38 : 0.16})`);
  gradient.addColorStop(0.52, `rgba(${r},${g},${b},${isSun ? 0.24 : 0.1})`);
  gradient.addColorStop(0.72, `rgba(${r},${g},${b},${isSun ? 0.1 : 0.035})`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPlanet(index: number, accent: string) {
  const group = new THREE.Group();
  const color = new THREE.Color(accent);
  const radius = index === 0 ? 3.1 : 2.1 + (index % 4) * 0.34;
  const textures = makePlanetTexture(index, accent);
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 64, 48),
    new THREE.MeshStandardMaterial({
      color: index === 0 ? 0xffc676 : 0xffffff,
      map: textures?.colorMap ?? null,
      bumpMap: textures?.bumpMap ?? null,
      bumpScale: index === 0 ? 0.035 : 0.11,
      roughness: index === 0 ? 0.58 : 0.82,
      metalness: 0.02,
      emissive: index === 0 ? color : new THREE.Color(0x000000),
      emissiveIntensity: index === 0 ? 1.25 : 0,
    }),
  );
  group.add(planet);
  const glowTexture = makeAtmosphereGlow(accent, index === 0);
  if (glowTexture) {
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color,
        transparent: true,
        opacity: index === 0 ? 0.9 : 0.58,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    glow.scale.setScalar(radius * (index === 0 ? 3.9 : 3.05));
    glow.renderOrder = -1;
    group.add(glow);
  }
  group.add(
    new THREE.Mesh(
      new THREE.SphereGeometry(radius * 1.025, 64, 48),
      new THREE.ShaderMaterial({
        uniforms: {
          glowColor: { value: color },
          intensity: { value: index === 0 ? 0.68 : 0.38 },
        },
        vertexShader:
          "varying vec3 vNormal; varying vec3 vView; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }",
        fragmentShader:
          "uniform vec3 glowColor; uniform float intensity; varying vec3 vNormal; varying vec3 vView; void main(){ float facing=max(dot(vNormal,vView),0.0); float rim=1.0-smoothstep(0.0,0.28,facing); rim*=rim; gl_FragColor=vec4(glowColor,rim*intensity); }",
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.FrontSide,
      }),
    ),
  );
  if ([2, 5, 7].includes(index)) {
    const rings = new THREE.Group();
    for (let band = 0; band < 11; band += 1) {
      const inner = radius * (1.35 + band * 0.067);
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(
          inner,
          inner + radius * (0.035 + (band % 3) * 0.008),
          160,
        ),
        new THREE.MeshBasicMaterial({
          color: band % 2 ? color : 0xead8b8,
          transparent: true,
          opacity: 0.18 + (band % 4) * 0.095,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      rings.add(ring);
    }
    rings.rotation.x = Math.PI * 0.62;
    rings.rotation.y = 0.2;
    group.add(rings);
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
  group.userData.textures = textures;
  group.userData.glowTexture = glowTexture;
  return group;
}

function createStarField() {
  const random = seededRandom(20020829);
  const count = 11200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
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
    sizes[i] = random() > 0.985 ? 4 + random() * 4.5 : 0.65 + random() * 2.1;
    phases[i] = random() * Math.PI * 2;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute("phase", new THREE.BufferAttribute(phases, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      pixelRatio: { value: Math.min(window.devicePixelRatio, 1.7) },
    },
    vertexShader: `
      attribute float size;
      attribute float phase;
      varying vec3 vColor;
      varying float vTwinkle;
      uniform float time;
      uniform float pixelRatio;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vColor = color;
        vTwinkle = 0.76 + 0.24 * sin(time * (0.75 + phase * 0.08) + phase);
        gl_PointSize = size * pixelRatio * (115.0 / max(1.0, -mv.z));
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vTwinkle;
      void main() {
        vec2 point = gl_PointCoord - vec2(0.5);
        float distanceToCenter = length(point);
        float core = 1.0 - smoothstep(0.0, 0.16, distanceToCenter);
        float halo = 1.0 - smoothstep(0.05, 0.5, distanceToCenter);
        float crossGlow = exp(-abs(point.x) * 30.0) * exp(-abs(point.y) * 3.5) + exp(-abs(point.y) * 30.0) * exp(-abs(point.x) * 3.5);
        float alpha = (core + halo * 0.68 + crossGlow * 0.13) * vTwinkle;
        if (distanceToCenter > 0.5) discard;
        gl_FragColor = vec4(vColor * (1.0 + core * 0.55), alpha);
      }
    `,
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
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
  const { quality } = useVisualQuality();

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 1.7 : quality === "balanced" ? 1.15 : 1));
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
    let lastRender = 0;
    const render = (timestamp = 0) => {
      frame = requestAnimationFrame(render);
      const minimumFrameTime = quality === "high" ? 0 : quality === "balanced" ? 30 : 65;
      if (timestamp - lastRender < minimumFrameTime) return;
      lastRender = timestamp;
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
      (stars.material as THREE.ShaderMaterial).uniforms.time.value = time;
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
        const textures = planet.userData.textures as {
          colorMap: THREE.Texture;
          bumpMap: THREE.Texture;
        } | null;
        textures?.colorMap.dispose();
        textures?.bumpMap.dispose();
        (planet.userData.glowTexture as THREE.Texture | null)?.dispose();
        planet.traverse((object) => {
          if (
            !(object instanceof THREE.Mesh) &&
            !(object instanceof THREE.Sprite)
          )
            return;
          if (object instanceof THREE.Mesh) object.geometry.dispose();
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
  }, [quality]);

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
