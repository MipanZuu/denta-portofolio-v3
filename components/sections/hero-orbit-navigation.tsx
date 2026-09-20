"use client";

import Link from "next/link";
import { BriefcaseBusiness, FileText, FlaskConical, Orbit, Route, UserRound } from "lucide-react";
import { useRef, useState, type PointerEvent } from "react";

const destinations = [
  { label: "About", href: "/about", icon: UserRound },
  { label: "Projects", href: "/projects", icon: BriefcaseBusiness },
  { label: "Journey", href: "/journey", icon: Route },
  { label: "Playground", href: "/playground", icon: FlaskConical },
  { label: "Space", href: "/space", icon: Orbit },
  { label: "Docs", href: "/docs", icon: FileText },
] as const;

export function HeroOrbitNavigation() {
  const [rotation, setRotation] = useState(0);
  const dragRef = useRef({ active: false, angle: 0 });
  const pointerAngle = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return Math.atan2(event.clientY - bounds.top - bounds.height / 2, event.clientX - bounds.left - bounds.width / 2) * 180 / Math.PI;
  };

  return (
    <div
      className="hero-nav-wheel"
      aria-label="Rotatable orbital navigation"
      onPointerDown={(event) => {
        if ((event.target as Element).closest("a")) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        event.currentTarget.classList.add("is-dragging");
        dragRef.current = { active: true, angle: pointerAngle(event) };
      }}
      onPointerMove={(event) => {
        if (!dragRef.current.active) return;
        const nextAngle = pointerAngle(event);
        let delta = nextAngle - dragRef.current.angle;

        // atan2 jumps from 180 to -180 at the seam. Converting that jump to
        // the shortest signed distance keeps the orbit continuous through 360°.
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;

        dragRef.current.angle = nextAngle;
        setRotation((current) => current + delta);
      }}
      onPointerUp={(event) => {
        dragRef.current.active = false;
        event.currentTarget.classList.remove("is-dragging");
        if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      }}
      onPointerCancel={(event) => {
        dragRef.current.active = false;
        event.currentTarget.classList.remove("is-dragging");
      }}
      onWheel={(event) => setRotation((current) => current + (event.deltaY > 0 ? 12 : -12))}
    >
      <div className="hero-wheel-track" aria-hidden="true"><i /><i /><i /></div>
      {destinations.map((destination, index) => {
        const angle = rotation + index * 60;
        const Icon = destination.icon;
        return (
          <Link
            href={destination.href}
            className="hero-wheel-destination"
            style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(var(--hero-wheel-radius))` }}
            key={destination.href}
            aria-label={destination.label}
          >
            <span style={{ transform: `rotate(${-angle}deg)` }}>
              <small>{destination.label}</small>
              <b><Icon aria-hidden="true" /></b>
            </span>
          </Link>
        );
      })}
      <span className="hero-wheel-instruction">Drag orbit</span>
    </div>
  );
}
