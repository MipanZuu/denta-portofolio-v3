"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three/webgpu";
import {
  Break,
  Fn,
  If,
  Loop,
  asin,
  atan,
  clamp,
  cos,
  cross,
  dot,
  float,
  floor,
  fract,
  length,
  mix,
  normalize,
  pass,
  pow,
  screenUV,
  sign,
  sin,
  smoothstep,
  sqrt,
  step,
  uniform,
  vec2,
  vec3,
  vec4,
} from "three/tsl";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";

const config = {
  blackHoleMass: 0.4,
  diskInnerRadius: 4.1,
  diskOuterRadius: 14.5,
  diskTemperature: 49.78,
  temperatureFalloff: 5.22,
  diskBrightness: 5,
  diskRotationSpeed: -8.7,
  turbulenceScale: 1.81,
  turbulenceStretch: 0.75,
  turbulenceSharpness: 7.4,
  turbulenceCycleTime: 5,
  turbulenceLacunarity: 2.5,
  turbulencePersistence: 0.8,
  diskEdgeSoftnessInner: 0.18,
  diskEdgeSoftnessOuter: 0.5,
  gravitationalLensing: 2.4,
  dopplerStrength: 1,
  stepSize: 1,
  starDensity: 0.1,
  starSize: 1.2,
  starBrightness: 0.1,
  nebula1Scale: 2,
  nebula1Density: 0.5,
  nebula1Brightness: 0.01,
  nebula1Color: "#071f44",
  nebula2Scale: 5.5,
  nebula2Density: 0.05,
  nebula2Brightness: 0.21,
  nebula2Color: "#010615",
  bloomStrength: 0.68,
  bloomRadius: 0,
  bloomThreshold: 0.45,
};

function createBlackHoleScene(container) {
  const hash21 = Fn(([p]) =>
    fract(sin(dot(p, vec2(127.1, 311.7))).mul(43758.5453)),
  );
  const hash31 = Fn(([p]) =>
    fract(sin(dot(p, vec3(127.1, 311.7, 74.7))).mul(43758.5453)),
  );
  const hash22 = Fn(([p]) =>
    vec2(
      fract(sin(dot(p, vec2(127.1, 311.7))).mul(43758.5453)),
      fract(sin(dot(p, vec2(269.5, 183.3))).mul(43758.5453)),
    ),
  );
  const noise3D = Fn(([p]) => {
    const i = floor(p);
    const f = fract(p);
    const u = f.mul(f).mul(float(3).sub(f.mul(2)));
    const a = hash31(i);
    const b = hash31(i.add(vec3(1, 0, 0)));
    const c = hash31(i.add(vec3(0, 1, 0)));
    const d = hash31(i.add(vec3(1, 1, 0)));
    const e = hash31(i.add(vec3(0, 0, 1)));
    const f2 = hash31(i.add(vec3(1, 0, 1)));
    const g = hash31(i.add(vec3(0, 1, 1)));
    const h = hash31(i.add(vec3(1, 1, 1)));
    return mix(
      mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
      mix(mix(e, f2, u.x), mix(g, h, u.x), u.y),
      u.z,
    );
  });
  const fbm = Fn(([p, lacunarity, persistence]) => {
    const value = float(0).toVar();
    const amplitude = float(0.5).toVar();
    const pos = p.toVar();
    value.addAssign(noise3D(pos).mul(amplitude));
    pos.mulAssign(lacunarity);
    amplitude.mulAssign(persistence);
    value.addAssign(noise3D(pos).mul(amplitude));
    pos.mulAssign(lacunarity);
    amplitude.mulAssign(persistence);
    value.addAssign(noise3D(pos).mul(amplitude));
    pos.mulAssign(lacunarity);
    amplitude.mulAssign(persistence);
    value.addAssign(noise3D(pos).mul(amplitude));
    return value;
  });
  const blackbodyColor = Fn(([tempK]) => {
    const t = clamp(tempK.sub(1000).div(9000), float(0), float(1));
    const red = clamp(float(1).sub(t.sub(0.8).mul(2)), float(0.5), float(1));
    const green = smoothstep(float(0), float(0.5), t).mul(
      float(1).sub(t.sub(0.7).mul(0.3).max(0)),
    );
    const blue = smoothstep(float(0.3), float(1), t).mul(t);
    return vec3(red, green, blue);
  });

  const uniforms = {
    blackHoleMass: uniform(config.blackHoleMass),
    diskInnerRadius: uniform(config.diskInnerRadius),
    diskOuterRadius: uniform(config.diskOuterRadius),
    diskTemperature: uniform(config.diskTemperature),
    temperatureFalloff: uniform(config.temperatureFalloff),
    diskBrightness: uniform(config.diskBrightness),
    diskRotationSpeed: uniform(config.diskRotationSpeed),
    turbulenceScale: uniform(config.turbulenceScale),
    turbulenceStretch: uniform(config.turbulenceStretch),
    turbulenceSharpness: uniform(config.turbulenceSharpness),
    turbulenceCycleTime: uniform(config.turbulenceCycleTime),
    turbulenceLacunarity: uniform(config.turbulenceLacunarity),
    turbulencePersistence: uniform(config.turbulencePersistence),
    diskEdgeSoftnessInner: uniform(config.diskEdgeSoftnessInner),
    diskEdgeSoftnessOuter: uniform(config.diskEdgeSoftnessOuter),
    gravitationalLensing: uniform(config.gravitationalLensing),
    dopplerStrength: uniform(config.dopplerStrength),
    stepSize: uniform(config.stepSize),
    starBackgroundColor: uniform(new THREE.Color("#000000")),
    starDensity: uniform(config.starDensity),
    starSize: uniform(config.starSize),
    starBrightness: uniform(config.starBrightness),
    nebula1Scale: uniform(config.nebula1Scale),
    nebula1Density: uniform(config.nebula1Density),
    nebula1Brightness: uniform(config.nebula1Brightness),
    nebula1Color: uniform(new THREE.Color(config.nebula1Color)),
    nebula2Scale: uniform(config.nebula2Scale),
    nebula2Density: uniform(config.nebula2Density),
    nebula2Brightness: uniform(config.nebula2Brightness),
    nebula2Color: uniform(new THREE.Color(config.nebula2Color)),
    time: uniform(0),
    resolution: uniform(new THREE.Vector2(1, 1)),
    cameraPosition: uniform(new THREE.Vector3(0, 5, 20)),
    cameraTarget: uniform(new THREE.Vector3()),
  };

  const starField = Fn(([rayDir]) => {
    const theta = atan(rayDir.z, rayDir.x);
    const phi = asin(clamp(rayDir.y, float(-1), float(1)));
    const scaledCoord = vec2(theta, phi).mul(float(60).div(uniforms.starSize));
    const cell = floor(scaledCoord);
    const cellUV = fract(scaledCoord);
    const starProb = step(float(1).sub(uniforms.starDensity), hash21(cell));
    const starPos = hash22(cell.add(42)).mul(0.8).add(0.1);
    const distToStar = length(cellUV.sub(starPos));
    const finalStarSize = hash21(cell.add(100))
      .mul(0.03)
      .add(0.01)
      .mul(uniforms.starSize);
    const starCore = smoothstep(finalStarSize, float(0), distToStar);
    const starGlow = smoothstep(finalStarSize.mul(3), float(0), distToStar).mul(
      0.3,
    );
    const colorTemp = hash21(cell.add(200));
    const starColor = mix(vec3(0.8, 0.9, 1), vec3(1, 0.95, 0.8), colorTemp);
    return starColor
      .mul(starCore.add(starGlow))
      .mul(starProb)
      .mul(uniforms.starBrightness);
  });
  const nebulaField = Fn(([rayDir]) => {
    const n1 = fbm(rayDir.mul(uniforms.nebula1Scale), float(2), float(0.5))
      .mul(2)
      .sub(1);
    const layer1 = clamp(n1.add(uniforms.nebula1Density), float(0), float(1));
    const n2 = fbm(rayDir.mul(uniforms.nebula2Scale), float(2), float(0.5))
      .mul(2)
      .sub(1);
    const layer2 = clamp(n2.add(uniforms.nebula2Density), float(0), float(1));
    return uniforms.nebula1Color
      .mul(layer1)
      .mul(uniforms.nebula1Brightness)
      .add(uniforms.nebula2Color.mul(layer2).mul(uniforms.nebula2Brightness));
  });
  const accretionDiskColor = Fn(([hitR, hitAngle, time, rayDir]) => {
    const innerR = uniforms.diskInnerRadius;
    const outerR = uniforms.diskOuterRadius;
    const normR = clamp(
      hitR.sub(innerR).div(outerR.sub(innerR)),
      float(0),
      float(1),
    );
    const tempFalloff = pow(innerR.div(hitR), uniforms.temperatureFalloff);
    const diskColor = blackbodyColor(
      mix(float(1500), uniforms.diskTemperature.mul(1000), tempFalloff),
    ).toVar("diskColor");
    const rotationSign = sign(uniforms.diskRotationSpeed);
    const velocityDir = vec3(
      sin(hitAngle).negate().mul(rotationSign),
      float(0),
      cos(hitAngle).mul(rotationSign),
    );
    const beta = float(1)
      .div(sqrt(hitR.div(innerR)))
      .mul(0.3);
    const dopplerFactor = float(1).div(
      float(1).sub(beta.mul(dot(velocityDir, rayDir))),
    );
    diskColor.mulAssign(
      clamp(
        pow(dopplerFactor, float(3).mul(uniforms.dopplerStrength)),
        float(0.1),
        float(5),
      ),
    );
    const edgeFalloff = smoothstep(
      float(0),
      uniforms.diskEdgeSoftnessInner,
      normR,
    ).mul(
      smoothstep(float(1), float(1).sub(uniforms.diskEdgeSoftnessOuter), normR),
    );
    const cycleLength = uniforms.turbulenceCycleTime;
    const cyclicTime = time.mod(cycleLength);
    const blendFactor = cyclicTime.div(cycleLength);
    const phase1 = cyclicTime
      .mul(uniforms.diskRotationSpeed)
      .div(pow(hitR, float(1.5)));
    const phase2 = cyclicTime
      .add(cycleLength)
      .mul(uniforms.diskRotationSpeed)
      .div(pow(hitR, float(1.5)));
    const angle1 = hitAngle.add(phase1);
    const angle2 = hitAngle.add(phase2);
    const noise1 = vec3(
      hitR.mul(uniforms.turbulenceScale),
      cos(angle1).div(uniforms.turbulenceStretch.max(0.1)),
      sin(angle1).div(uniforms.turbulenceStretch.max(0.1)),
    );
    const noise2 = vec3(
      hitR.mul(uniforms.turbulenceScale),
      cos(angle2).div(uniforms.turbulenceStretch.max(0.1)),
      sin(angle2).div(uniforms.turbulenceStretch.max(0.1)),
    );
    const turbulence = mix(
      fbm(
        noise2,
        uniforms.turbulenceLacunarity,
        uniforms.turbulencePersistence,
      ),
      fbm(
        noise1,
        uniforms.turbulenceLacunarity,
        uniforms.turbulencePersistence,
      ),
      blendFactor,
    );
    const opacity = pow(
      clamp(turbulence, float(0), float(1)),
      uniforms.turbulenceSharpness,
    ).mul(edgeFalloff);
    return vec4(diskColor.mul(uniforms.diskBrightness), opacity);
  });

  const blackHoleShader = Fn(() => {
    const rs = uniforms.blackHoleMass.mul(2);
    const uv = screenUV.sub(0.5).mul(2);
    const screenPos = vec2(
      uv.x.mul(uniforms.resolution.x.div(uniforms.resolution.y)),
      uv.y,
    );
    const camForward = normalize(
      uniforms.cameraTarget.sub(uniforms.cameraPosition),
    );
    const camRight = normalize(cross(vec3(0, 1, 0), camForward));
    const camUp = cross(camForward, camRight);
    const rayDir = normalize(
      camForward.add(camRight.mul(screenPos.x)).add(camUp.mul(screenPos.y)),
    ).toVar("rayDir");
    const rayPos = uniforms.cameraPosition.toVar("rayPos");
    const prevPos = uniforms.cameraPosition.toVar("prevPos");
    const color = vec3(0).toVar("color");
    const alpha = float(0).toVar("alpha");
    const escaped = float(0).toVar("escaped");
    const captured = float(0).toVar("captured");

    Loop(32, () => {
      If(
        escaped
          .greaterThan(0.5)
          .or(captured.greaterThan(0.5))
          .or(alpha.greaterThan(0.99)),
        () => Break(),
      );
      const r = length(rayPos);
      If(r.lessThan(rs.mul(1.01)), () => {
        captured.assign(1);
        Break();
      });
      If(r.greaterThan(100), () => {
        escaped.assign(1);
        Break();
      });
      rayDir.addAssign(
        rayPos
          .negate()
          .div(r)
          .mul(
            rs
              .div(r.mul(r))
              .mul(uniforms.stepSize)
              .mul(uniforms.gravitationalLensing),
          ),
      );
      rayDir.assign(normalize(rayDir));
      prevPos.assign(rayPos);
      rayPos.addAssign(rayDir.mul(uniforms.stepSize));
      If(prevPos.y.mul(rayPos.y).lessThan(0).and(alpha.lessThan(0.99)), () => {
        const t = prevPos.y.negate().div(rayPos.y.sub(prevPos.y));
        const hitPos = mix(prevPos, rayPos, t);
        const hitR = sqrt(hitPos.x.mul(hitPos.x).add(hitPos.z.mul(hitPos.z)));
        If(
          hitR
            .greaterThan(uniforms.diskInnerRadius)
            .and(hitR.lessThan(uniforms.diskOuterRadius)),
          () => {
            const disk = accretionDiskColor(
              hitR,
              atan(hitPos.z, hitPos.x),
              uniforms.time,
              rayDir,
            );
            const remaining = float(1).sub(alpha);
            color.addAssign(disk.xyz.mul(disk.w).mul(remaining));
            alpha.addAssign(remaining.mul(disk.w));
          },
        );
      });
    });
    If(captured.lessThan(0.5), () => escaped.assign(1));
    If(escaped.greaterThan(0.5).and(alpha.lessThan(0.99)), () => {
      const background = uniforms.starBackgroundColor.toVar("background");
      background.addAssign(starField(rayDir));
      background.addAssign(nebulaField(rayDir));
      color.addAssign(background.mul(float(1).sub(alpha)));
    });
    return vec4(pow(color, vec3(1 / 2.2)), 1);
  })();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.set(0, -2, -18);
  camera.lookAt(0, 0, 0);
  const renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.setAttribute(
    "aria-label",
    "Interactive black hole visualization",
  );
  container.appendChild(renderer.domElement);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = -0.5;
  controls.minDistance = 5;
  controls.maxDistance = 50;
  const geometry = new THREE.SphereGeometry(100, 32, 32);
  geometry.scale(-1, 1, 1);
  const material = new THREE.MeshBasicNodeMaterial();
  material.colorNode = blackHoleShader;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  let animationFrame = 0;
  let stopped = false;
  let postProcessing = null;
  let lastFrameTime = performance.now();
  const updateSize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / Math.max(height, 1);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    uniforms.resolution.value.set(width, height);
  };
  const resizeObserver = new ResizeObserver(updateSize);
  resizeObserver.observe(container);
  updateSize();
  const animate = () => {
    if (stopped) return;
    animationFrame = requestAnimationFrame(animate);
    const now = performance.now();
    const delta = Math.min((now - lastFrameTime) / 1000, 0.033);
    lastFrameTime = now;
    controls.update();
    uniforms.time.value += delta;
    uniforms.cameraPosition.value.copy(camera.position);
    const target = new THREE.Vector3(0, 0, -1)
      .applyQuaternion(camera.quaternion)
      .multiplyScalar(10)
      .add(camera.position);
    uniforms.cameraTarget.value.copy(target);
    if (postProcessing) postProcessing.render();
    else renderer.render(scene, camera);
  };

  const ready = renderer.init().then(() => {
    if (stopped) return;
    postProcessing = new THREE.PostProcessing(renderer);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode();
    const bloomPass = bloom(scenePassColor);
    bloomPass.threshold.value = config.bloomThreshold;
    bloomPass.strength.value = config.bloomStrength;
    bloomPass.radius.value = config.bloomRadius;
    postProcessing.outputNode = scenePassColor.add(bloomPass);
    animate();
  });

  return {
    ready,
    destroy() {
      stopped = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export function BlackHoleScene() {
  const containerRef = useRef(null);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let scene;
    queueMicrotask(() => {
      if (disposed) return;
      try {
        scene = createBlackHoleScene(container);
        scene.ready
          .then(() => {
            if (!disposed) setReady(true);
          })
          .catch(() => {
            if (!disposed) setError(true);
          });
      } catch {
        if (!disposed) setError(true);
      }
    });
    return () => {
      disposed = true;
      scene?.destroy();
    };
  }, []);

  return (
    <section className="black-hole-experience" ref={containerRef}>
      {error ? (
        <div className="space-fallback" role="status">
          <strong>WebGPU is not available here.</strong>
          <span>Open this page in a recent version of Chrome or Edge.</span>
        </div>
      ) : !ready ? (
        <div className="space-loading" aria-live="polite">
          Entering orbit…
        </div>
      ) : null}
      {ready && showGuide ? (
        <aside className="space-guide" aria-labelledby="space-guide-title">
          <div className="space-guide-heading">
            <span>Interactive / Space 01</span>
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              aria-label="Close space controls"
            >
              ×
            </button>
          </div>
          <div>
            <h1 id="space-guide-title">Take the black hole for a spin.</h1>
            <p>
              Move around the event horizon and find your own view of the
              universe.
            </p>
          </div>
          <div className="space-guide-controls" aria-label="Scene controls">
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 10V7a2 2 0 0 1 4 0v3-5a2 2 0 0 1 4 0v5-3a2 2 0 0 1 4 0v7c0 4-2.8 7-7 7h-1c-2.6 0-4.4-1.3-6-3l-2.5-2.8a2 2 0 0 1 3-2.7L8 14" />
              </svg>
              Drag to orbit
            </span>
            <span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="7" y="2" width="10" height="20" rx="5" />
                <path d="M12 6v4" />
              </svg>
              Scroll to travel
            </span>
          </div>
          <button
            className="space-guide-action"
            type="button"
            onClick={() => setShowGuide(false)}
          >
            Begin exploring <span aria-hidden="true">↗</span>
          </button>
        </aside>
      ) : ready ? (
        <button
          className="space-guide-toggle"
          type="button"
          onClick={() => setShowGuide(true)}
          aria-label="Show space controls"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5m0-8h.01" />
          </svg>
          Controls
        </button>
      ) : null}
    </section>
  );
}
