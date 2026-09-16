"use client";

import { useEffect, useRef } from "react";

export function HomeAlias() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.65));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 80);
      camera.position.set(0, 0, 17);
      const logo = new THREE.Group();
      scene.add(logo);

      const random = (() => { let seed = 2471; return () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; })();
      const dotCanvas = document.createElement("canvas");
      dotCanvas.width = dotCanvas.height = 64;
      const dotContext = dotCanvas.getContext("2d");
      if (!dotContext) return;
      const dotGradient = dotContext.createRadialGradient(32, 32, 0, 32, 32, 32);
      dotGradient.addColorStop(0, "rgba(255,255,255,1)");
      dotGradient.addColorStop(.45, "rgba(255,255,255,.92)");
      dotGradient.addColorStop(1, "rgba(255,255,255,0)");
      dotContext.fillStyle = dotGradient;
      dotContext.fillRect(0, 0, 64, 64);
      const dotTexture = new THREE.CanvasTexture(dotCanvas);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = 768;
      maskCanvas.height = 384;
      const maskContext = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskContext) return;
      maskContext.fillStyle = "#fff";
      maskContext.font = "900 300px Arial Black, Arial, sans-serif";
      maskContext.textAlign = "center";
      maskContext.textBaseline = "middle";
      maskContext.fillText("MZ", maskCanvas.width / 2, maskCanvas.height / 2 + 10);
      const mask = maskContext.getImageData(0, 0, maskCanvas.width, maskCanvas.height).data;
      const samples: Array<[number, number, number]> = [];
      for (let y = 0; y < maskCanvas.height; y += 3) {
        for (let x = 0; x < maskCanvas.width; x += 3) {
          const alpha = mask[(y * maskCanvas.width + x) * 4 + 3];
          if (alpha > 80 && random() > 0.13) samples.push([x, y, alpha / 255]);
        }
      }
      const grainCount = samples.length;
      const grainPositions = new Float32Array(grainCount * 3);
      const grainPhases = new Float32Array(grainCount);
      const grainSizes = new Float32Array(grainCount);
      const grainDrift = new Float32Array(grainCount);
      const grainColors = new Float32Array(grainCount * 3);
      const orange = new THREE.Color(0xff6543);
      const lime = new THREE.Color(0xc9ff57);
      const pale = new THREE.Color(0xffe6aa);
      samples.forEach(([x, y, alpha], index) => {
        const offset = index * 3;
        grainPositions[offset] = (x - maskCanvas.width / 2) * .015 + (random() - .5) * .035;
        grainPositions[offset + 1] = (maskCanvas.height / 2 - y) * .015 + (random() - .5) * .035;
        grainPositions[offset + 2] = (random() - .5) * .55;
        grainPhases[index] = random() * Math.PI * 2;
        grainSizes[index] = .34 + random() * .46;
        grainDrift[index] = (random() > .84 ? .18 + random() * .34 : .025 + random() * .07) * alpha;
        const color = (random() > .72 ? lime : random() > .48 ? pale : orange).clone().multiplyScalar(.78 + random() * .35);
        grainColors.set([color.r, color.g, color.b], offset);
      });
      const grainGeometry = new THREE.BufferGeometry();
      grainGeometry.setAttribute("position", new THREE.BufferAttribute(grainPositions, 3));
      grainGeometry.setAttribute("phase", new THREE.BufferAttribute(grainPhases, 1));
      grainGeometry.setAttribute("grainSize", new THREE.BufferAttribute(grainSizes, 1));
      grainGeometry.setAttribute("drift", new THREE.BufferAttribute(grainDrift, 1));
      grainGeometry.setAttribute("color", new THREE.BufferAttribute(grainColors, 3));
      const grainMaterial = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, pixelRatio: { value: Math.min(window.devicePixelRatio, 1.65) } },
        vertexShader: `attribute float phase; attribute float grainSize; attribute float drift; varying vec3 vColor; varying float vGlow; uniform float time; uniform float pixelRatio; void main(){ vec3 p=position; p.x+=sin(time*.42+phase*2.1)*drift; p.y+=cos(time*.37+phase)*drift*.7; p.z+=sin(time*.68+phase*1.7)*drift*1.4; vec4 mv=modelViewMatrix*vec4(p,1.0); vColor=color; vGlow=.78+.22*sin(time*.9+phase); gl_PointSize=grainSize*pixelRatio*(112.0/max(1.0,-mv.z)); gl_Position=projectionMatrix*mv; }`,
        fragmentShader: `varying vec3 vColor; varying float vGlow; void main(){ float d=length(gl_PointCoord-vec2(.5)); if(d>.5) discard; float core=1.0-smoothstep(0.0,.18,d); float halo=1.0-smoothstep(.08,.5,d); gl_FragColor=vec4(vColor*(1.0+core*.55),(core+halo*.62)*vGlow); }`,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const grains = new THREE.Points(grainGeometry, grainMaterial);
      logo.add(grains);

      const fieldCount = 2600;
      const fieldPositions = new Float32Array(fieldCount * 3);
      for (let index = 0; index < fieldCount; index += 1) {
        const offset = index * 3;
        fieldPositions[offset] = (random() - .5) * 25;
        fieldPositions[offset + 1] = (random() - .5) * 16;
        fieldPositions[offset + 2] = -2 - random() * 28;
      }
      const fieldGeometry = new THREE.BufferGeometry();
      fieldGeometry.setAttribute("position", new THREE.BufferAttribute(fieldPositions, 3));
      const fieldMaterial = new THREE.PointsMaterial({ color: 0xff8b4d, size: .062, map: dotTexture, transparent: true, opacity: .22, alphaTest: .02, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
      const field = new THREE.Points(fieldGeometry, fieldMaterial);
      scene.add(field);
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
        grainMaterial.uniforms.time.value = time;
        logo.rotation.x += (pointerRef.current.y * .13 - logo.rotation.x) * .035;
        logo.rotation.y += (pointerRef.current.x * .2 - logo.rotation.y) * .035;
        field.rotation.z = Math.sin(time * .08) * .05;
        field.position.z = Math.sin(time * .18) * 1.2;
        renderer.render(scene, camera);
      };
      animate();
      cleanup = () => {
        cancelAnimationFrame(frame);
        resizeObserver.disconnect();
        grainGeometry.dispose();
        grainMaterial.dispose();
        fieldGeometry.dispose();
        fieldMaterial.dispose();
        dotTexture.dispose();
        renderer.dispose();
      };
    });

    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { rootMargin: "180px" });
    observer.observe(stage);
    return () => { disposed = true; observer.disconnect(); cleanup(); };
  }, []);

  return <section className="home-alias page-shell" aria-labelledby="home-alias-title">
    <div className="home-alias-stage" onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); pointerRef.current = { x: ((event.clientX - bounds.left) / bounds.width - .5) * 2, y: ((event.clientY - bounds.top) / bounds.height - .5) * 2 }; }} onPointerLeave={() => { pointerRef.current = { x: 0, y: 0 }; }}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <span className="home-alias-stage-label">MZ / since 2020</span>
    </div>
    <div className="home-alias-copy">
      <p><span>05</span>Behind the mark</p>
      <h2 id="home-alias-title">One typo.<br />A name that stuck.</h2>
      <p>Mzyy started during the COVID years as <strong>MipanZuu</strong>, a name borrowed from the llama meme. Then one day I typed <strong>MipanZyy</strong> by accident. The U and Y keys were neighbours, and apparently that was enough to redirect the whole story.</p>
      <p>Some games had stricter character limits, so the name kept shrinking until only <strong>Mzyy</strong> remained. The MZ mark is the compact version: part old gaming name, part personal signature, and now the little symbol that follows my work around.</p>
      <div className="home-alias-evolution" aria-label="The evolution of the Mzyy name"><span>MipanZuu</span><i>→</i><span>MipanZyy</span><i>→</i><strong>Mzyy</strong></div>
    </div>
  </section>;
}
