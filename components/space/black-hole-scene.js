"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Hand, Info, Mouse, X } from "lucide-react";
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

function createGasGiantTexture() {
  const width = 512;
  const height = 256;
  const data = new Uint8Array(width * height * 4);

  for (let y = 0; y < height; y += 1) {
    const latitude = y / height;
    const broadBands = Math.sin(latitude * Math.PI * 22);
    const fineBands = Math.sin(latitude * Math.PI * 58) * 0.24;

    for (let x = 0; x < width; x += 1) {
      const longitude = x / width;
      const flow = Math.sin(
        longitude * Math.PI * 12 + Math.sin(latitude * Math.PI * 18) * 2.4,
      );
      const stormX = longitude - 0.7;
      const stormY = latitude - 0.62;
      const storm = Math.exp(
        -((stormX * stormX) / 0.007 + (stormY * stormY) / 0.0018),
      );
      const variation = broadBands * 18 + fineBands * 14 + flow * 5;
      const index = (y * width + x) * 4;
      data[index] = Math.max(0, Math.min(255, 173 + variation + storm * 55));
      data[index + 1] = Math.max(
        0,
        Math.min(255, 116 + variation * 0.72 + storm * 22),
      );
      data[index + 2] = Math.max(
        0,
        Math.min(255, 79 + variation * 0.38 + storm * 10),
      );
      data[index + 3] = 255;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  return texture;
}

function createStarField() {
  const positions = new Float32Array(2400 * 3);
  let seed = 928371;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let index = 0; index < positions.length; index += 3) {
    const theta = random() * Math.PI * 2;
    const phi = Math.acos(2 * random() - 1);
    const radius = 65 + random() * 35;
    positions[index] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index + 1] = radius * Math.cos(phi);
    positions[index + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xdde9ff,
    size: 0.18,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.88,
  });
  return new THREE.Points(geometry, material);
}

function createNebula() {
  const count = 11000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color = new THREE.Color();
  let seed = 483921;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let index = 0; index < count; index += 1) {
    const radius = Math.pow(random(), 0.58) * 12;
    const arm = random() < 0.5 ? 0 : Math.PI;
    const angle = radius * 0.72 + arm + (random() - 0.5) * 1.05;
    const softness = 0.35 + radius * 0.07;
    const offset = index * 3;
    positions[offset] = Math.cos(angle) * radius + (random() - 0.5) * softness;
    positions[offset + 1] = (random() - 0.5) * (2.7 - radius * 0.1);
    positions[offset + 2] =
      Math.sin(angle) * radius + (random() - 0.5) * softness;

    const colorChoice = random();
    if (radius < 2.1) color.setRGB(1, 0.75, 0.42);
    else if (colorChoice < 0.44) color.setRGB(0.23, 0.48, 1);
    else if (colorChoice < 0.76) color.setRGB(0.66, 0.25, 0.96);
    else color.setRGB(1, 0.27, 0.55);
    const brightness = 0.46 + random() * 0.54;
    colors[offset] = color.r * brightness;
    colors[offset + 1] = color.g * brightness;
    colors[offset + 2] = color.b * brightness;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const cloud = new THREE.Points(geometry, material);
  const coreGeometry = new THREE.SphereGeometry(0.72, 32, 24);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd7aa,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  const group = new THREE.Group();
  group.rotation.x = 0.38;
  group.rotation.z = -0.16;
  group.add(cloud, core);
  return { group, cloud };
}

function createSolarSystem() {
  const group = new THREE.Group();
  const orbiters = [];
  const planetData = [
    { radius: 2.0, size: 0.17, color: 0x9c9288, speed: 1.6 },
    { radius: 2.75, size: 0.25, color: 0xd9a665, speed: 1.15 },
    { radius: 3.65, size: 0.28, color: 0x3d82d6, speed: 0.9 },
    { radius: 4.55, size: 0.21, color: 0xc75c39, speed: 0.72 },
    { radius: 6.05, size: 0.68, color: 0xd2a674, speed: 0.39 },
    { radius: 7.7, size: 0.58, color: 0xdac48e, speed: 0.29, ringed: true },
    { radius: 9.15, size: 0.4, color: 0x7bc7cf, speed: 0.2 },
    { radius: 10.45, size: 0.38, color: 0x426bd6, speed: 0.16 },
  ];

  const sunGeometry = new THREE.SphereGeometry(1.12, 48, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffc44d });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  group.add(sun);
  const sunLight = new THREE.PointLight(0xffd59a, 35, 36, 1.35);
  group.add(sunLight);

  planetData.forEach((data, index) => {
    const orbitPoints = [];
    for (let stepIndex = 0; stepIndex <= 128; stepIndex += 1) {
      const angle = (stepIndex / 128) * Math.PI * 2;
      orbitPoints.push(
        new THREE.Vector3(
          Math.cos(angle) * data.radius,
          0,
          Math.sin(angle) * data.radius,
        ),
      );
    }
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0x7c92ad,
      transparent: true,
      opacity: 0.2,
    });
    group.add(new THREE.Line(orbitGeometry, orbitMaterial));

    const pivot = new THREE.Group();
    pivot.rotation.y = index * 0.82;
    const planetGeometry = new THREE.SphereGeometry(data.size, 32, 24);
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: data.color,
      roughness: 0.82,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    planetMesh.position.x = data.radius;
    pivot.add(planetMesh);

    if (data.ringed) {
      const ringGeometry = new THREE.RingGeometry(
        data.size * 1.35,
        data.size * 2.05,
        64,
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xcdb98e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.x = data.radius;
      ring.rotation.x = Math.PI / 2.45;
      pivot.add(ring);
    }

    orbiters.push({ pivot, planet: planetMesh, speed: data.speed });
    group.add(pivot);
  });

  group.rotation.x = 0.38;
  group.rotation.z = -0.08;
  return { group, orbiters, sun };
}

function disposeGroup(group) {
  const geometries = new Set();
  const materials = new Set();
  group.traverse((object) => {
    if (object.geometry) geometries.add(object.geometry);
    if (object.material) {
      const objectMaterials = Array.isArray(object.material)
        ? object.material
        : [object.material];
      objectMaterials.forEach((material) => materials.add(material));
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => {
    material.map?.dispose();
    material.dispose();
  });
}

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

  const planetTexture = createGasGiantTexture();
  const planetGeometry = new THREE.SphereGeometry(5, 96, 64);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
    roughness: 0.78,
    metalness: 0.03,
    emissive: new THREE.Color(0x241309),
    emissiveIntensity: 0.18,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const atmosphereGeometry = new THREE.SphereGeometry(5.18, 64, 48);
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x8ecbff,
    transparent: true,
    opacity: 0.11,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  const ringGeometry = new THREE.RingGeometry(6.35, 9.2, 160);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xd9b487,
    transparent: true,
    opacity: 0.34,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const rings = new THREE.Mesh(ringGeometry, ringMaterial);
  rings.rotation.x = 1.12;
  rings.rotation.z = -0.18;

  const planetGroup = new THREE.Group();
  planetGroup.rotation.z = -0.12;
  planetGroup.add(planet, atmosphere, rings);
  planetGroup.visible = false;
  scene.add(planetGroup);

  const stars = createStarField();
  stars.visible = false;
  scene.add(stars);
  const nebula = createNebula();
  nebula.group.visible = false;
  scene.add(nebula.group);
  const solarSystem = createSolarSystem();
  solarSystem.group.visible = false;
  scene.add(solarSystem.group);
  const ambientLight = new THREE.AmbientLight(0x36506f, 0.72);
  const keyLight = new THREE.DirectionalLight(0xffe1b5, 4.2);
  keyLight.position.set(-8, 5, -10);
  const rimLight = new THREE.PointLight(0x4c88ff, 18, 48);
  rimLight.position.set(8, -2, 3);
  scene.add(ambientLight, keyLight, rimLight);

  let animationFrame = 0;
  let stopped = false;
  let postProcessing = null;
  let bloomPass = null;
  let lastFrameTime = performance.now();
  const setObject = (object) => {
    const showPlanet = object === "planet";
    const showNebula = object === "nebula";
    const showSolarSystem = object === "solar-system";
    mesh.visible = object === "black-hole";
    planetGroup.visible = showPlanet;
    nebula.group.visible = showNebula;
    solarSystem.group.visible = showSolarSystem;
    stars.visible = showPlanet || showNebula || showSolarSystem;
    controls.minDistance = showPlanet
      ? 9
      : showNebula
        ? 7
        : showSolarSystem
          ? 13
          : 5;
    controls.maxDistance = showPlanet
      ? 32
      : showNebula
        ? 38
        : showSolarSystem
          ? 42
          : 50;
    controls.target.set(0, 0, 0);
    if (showSolarSystem) camera.position.set(0, 10.5, -18);
    else if (showNebula) camera.position.set(0, 3.5, -20);
    else camera.position.set(0, showPlanet ? -0.8 : -2, -18);
    camera.lookAt(0, 0, 0);
    const accessibleLabels = {
      "black-hole": "Interactive black hole visualization",
      planet: "Interactive ringed gas giant visualization",
      nebula: "Interactive colorful spiral nebula visualization",
      "solar-system": "Interactive visualization of the solar system",
    };
    renderer.domElement.setAttribute(
      "aria-label",
      accessibleLabels[object] ?? accessibleLabels["black-hole"],
    );
    if (bloomPass) {
      bloomPass.threshold.value = showNebula
        ? 0.24
        : showPlanet || showSolarSystem
          ? 0.72
          : config.bloomThreshold;
      bloomPass.strength.value = showNebula
        ? 0.95
        : showPlanet || showSolarSystem
          ? 0.35
          : config.bloomStrength;
    }
  };
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
    if (planetGroup.visible) {
      planet.rotation.y += delta * 0.11;
      stars.rotation.y -= delta * 0.004;
    }
    if (nebula.group.visible) {
      nebula.cloud.rotation.y += delta * 0.025;
      nebula.group.rotation.z += delta * 0.004;
    }
    if (solarSystem.group.visible) {
      solarSystem.sun.rotation.y += delta * 0.08;
      solarSystem.orbiters.forEach((orbiter) => {
        orbiter.pivot.rotation.y += delta * orbiter.speed * 0.16;
        orbiter.planet.rotation.y += delta * 0.45;
      });
      stars.rotation.y -= delta * 0.002;
    }
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
    bloomPass = bloom(scenePassColor);
    bloomPass.threshold.value = config.bloomThreshold;
    bloomPass.strength.value = config.bloomStrength;
    bloomPass.radius.value = config.bloomRadius;
    postProcessing.outputNode = scenePassColor.add(bloomPass);
    animate();
  });

  return {
    ready,
    setObject,
    destroy() {
      stopped = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      controls.dispose();
      geometry.dispose();
      material.dispose();
      disposeGroup(planetGroup);
      disposeGroup(nebula.group);
      disposeGroup(solarSystem.group);
      disposeGroup(stars);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export function BlackHoleScene() {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [selectedObject, setSelectedObject] = useState("black-hole");

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let disposed = false;
    let scene;
    queueMicrotask(() => {
      if (disposed) return;
      try {
        scene = createBlackHoleScene(container);
        sceneRef.current = scene;
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
      sceneRef.current = null;
    };
  }, []);

  const changeObject = (event) => {
    const nextObject = event.target.value;
    setSelectedObject(nextObject);
    sceneRef.current?.setObject(nextObject);
  };

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
      {ready ? (
        <label className="space-object-picker">
          <span>Celestial object</span>
          <span className="space-object-select">
            <select value={selectedObject} onChange={changeObject}>
              <option value="black-hole">Black hole</option>
              <option value="planet">Aurelia · Gas giant</option>
              <option value="nebula">Chromia · Nebula</option>
              <option value="solar-system">Our solar system</option>
            </select>
            <ChevronDown aria-hidden="true" />
          </span>
        </label>
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
              <X aria-hidden="true" />
            </button>
          </div>
          <div>
            <h1 id="space-guide-title">Choose your corner of the universe.</h1>
            <p>
              Switch celestial scenes, move around them, and find a view worth
              getting lost in.
            </p>
          </div>
          <div className="space-guide-controls" aria-label="Scene controls">
            <span>
              <Hand aria-hidden="true" />
              Drag to orbit
            </span>
            <span>
              <Mouse aria-hidden="true" />
              Scroll to travel
            </span>
          </div>
          <button
            className="space-guide-action"
            type="button"
            onClick={() => setShowGuide(false)}
          >
            Begin exploring <ArrowUpRight aria-hidden="true" />
          </button>
        </aside>
      ) : ready ? (
        <button
          className="space-guide-toggle"
          type="button"
          onClick={() => setShowGuide(true)}
          aria-label="Show space controls"
        >
          <Info aria-hidden="true" />
          Controls
        </button>
      ) : null}
    </section>
  );
}
