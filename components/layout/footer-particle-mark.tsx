"use client";

import { useEffect, useRef } from "react";
import { useVisualQuality } from "@/components/layout/visual-quality";

type Particle = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  phase: number;
};

type Star = { x: number; y: number; radius: number; alpha: number; phase: number };

const colors = ["#f7fbff", "#a9c3ff", "#8ce6e6", "#c9ff57", "#ff8a68"];

export function FooterParticleMark() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const { quality } = useVisualQuality();

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!stage || !canvas || !context) return;

    let frame = 0;
    let visible = false;
    let particles: Particle[] = [];
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || quality === "low";

    const seededRandom = (() => {
      let seed = 90210;
      return () => {
        seed = (seed * 16807) % 2147483647;
        return (seed - 1) / 2147483646;
      };
    })();

    const build = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      const ratio = Math.min(window.devicePixelRatio, 1.2);
      canvas.width = Math.max(1, Math.floor(width * ratio));
      canvas.height = Math.max(1, Math.floor(height * ratio));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const mask = document.createElement("canvas");
      mask.width = Math.max(1, Math.floor(width));
      mask.height = Math.max(1, Math.floor(height));
      const maskContext = mask.getContext("2d", { willReadFrequently: true });
      if (!maskContext) return;
      const testSize = 100;
      maskContext.font = `900 ${testSize}px Arial Black, Arial, sans-serif`;
      const measured = maskContext.measureText("MZYY").width;
      const fontSize = Math.min(height * .67, width * .9 / measured * testSize);
      maskContext.font = `900 ${fontSize}px Arial Black, Arial, sans-serif`;
      maskContext.textAlign = "center";
      maskContext.textBaseline = "middle";
      maskContext.fillStyle = "#fff";
      maskContext.fillText("MZYY", width / 2, height / 2 + fontSize * .035);
      const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
      const step = width < 680 ? 7 : 8;
      const nextParticles: Particle[] = [];
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          if (pixels[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3] < 90) continue;
          const jitterX = (seededRandom() - .5) * 1.7;
          const jitterY = (seededRandom() - .5) * 1.7;
          nextParticles.push({
            x: x + jitterX,
            y: y + jitterY,
            homeX: x + jitterX,
            homeY: y + jitterY,
            vx: 0,
            vy: 0,
            radius: 1.1 + seededRandom() * 1.25,
            color: colors[Math.floor(seededRandom() * colors.length)],
            phase: seededRandom() * Math.PI * 2,
          });
        }
      }
      particles = nextParticles;
      stars = Array.from({ length: Math.max(60, Math.floor(width / 12)) }, () => ({
        x: seededRandom() * width,
        y: seededRandom() * height,
        radius: .25 + seededRandom() * 1.1,
        alpha: .12 + seededRandom() * .45,
        phase: seededRandom() * Math.PI * 2,
      }));
    };

    const render = (time = 0) => {
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        context.globalAlpha = star.alpha * (.72 + Math.sin(time * .0012 + star.phase) * .28);
        context.fillStyle = "#dbeaff";
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fill();
      });

      const pointer = pointerRef.current;
      const influence = Math.min(155, Math.max(95, width * .11));
      particles.forEach((particle) => {
        if (pointer.active && !reducedMotion) {
          const dx = particle.x - pointer.x;
          const dy = particle.y - pointer.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          if (distance < influence) {
            const strength = (1 - distance / influence) * 1.65;
            particle.vx += dx / distance * strength + -dy / distance * strength * .34;
            particle.vy += dy / distance * strength + dx / distance * strength * .34;
          }
        }
        particle.vx += (particle.homeX - particle.x) * .018;
        particle.vy += (particle.homeY - particle.y) * .018;
        particle.vx *= .91;
        particle.vy *= .91;
        particle.x += particle.vx;
        particle.y += particle.vy;

        const speed = Math.min(1, Math.abs(particle.vx) + Math.abs(particle.vy));
        context.globalAlpha = .76 + Math.sin(time * .0018 + particle.phase) * .16;
        context.fillStyle = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius + speed * .35, 0, Math.PI * 2);
        context.fill();
      });
      context.globalAlpha = 1;
    };

    const animate = (time: number) => {
      if (!visible) return;
      render(time);
      frame = window.requestAnimationFrame(animate);
    };
    const resizeObserver = new ResizeObserver(() => { build(); render(); });
    resizeObserver.observe(stage);
    const observer = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting;
      const wasVisible = visible;
      visible = nextVisible;
      if (nextVisible && !wasVisible && !reducedMotion) frame = window.requestAnimationFrame(animate);
      if (!nextVisible) window.cancelAnimationFrame(frame);
    }, { rootMargin: "100px" });
    observer.observe(stage);
    build();
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      observer.disconnect();
    };
  }, [quality]);

  return (
    <div
      className="footer-particle-mark"
      ref={stageRef}
      onPointerMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerRef.current = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, active: true };
      }}
      onPointerLeave={() => { pointerRef.current.active = false; }}
      aria-label="Mzyy particle mark. Move the pointer across it to disturb the nebula."
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      <span>Move through the nebula</span>
    </div>
  );
}
