"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

type BlogMediaProps = {
  images: string[];
  alt: string;
  priority?: boolean;
  href?: string;
};

export function BlogMedia({ images, alt, priority = false, href }: BlogMediaProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStart = useRef<number | null>(null);
  const dragged = useRef(false);
  const hasMultipleImages = images.length > 1;

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % images.length);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    pointerStart.current = event.clientX;
    dragged.current = false;
  }

  function handlePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerStart.current === null || !hasMultipleImages) return;
    const distance = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(distance) < 42) return;
    dragged.current = true;
    if (distance < 0) showNext();
    else showPrevious();
  }

  if (!images.length) return <div className="blog-media blog-media-placeholder"><span>Field notes</span><strong>DB</strong><small>Ideas, systems, and the work between.</small></div>;

  const visual = <Image src={images[activeIndex]} alt={images.length > 1 ? `${alt}, image ${activeIndex + 1} of ${images.length}` : alt} fill sizes="(max-width: 760px) 100vw, 720px" priority={priority && activeIndex === 0} />;

  return <div className="blog-carousel" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStart.current = null; }}>
    <div className="blog-media">
      {href ? <Link href={href} aria-label={`Read ${alt}`} onClick={(event) => { if (dragged.current) event.preventDefault(); }}>{visual}</Link> : visual}
    </div>
    {hasMultipleImages ? <>
      <span className="blog-carousel-count" aria-hidden="true">{activeIndex + 1}/{images.length}</span>
      <button className="blog-carousel-control blog-carousel-previous" type="button" onClick={showPrevious} aria-label="Previous image"><ChevronLeft /></button>
      <button className="blog-carousel-control blog-carousel-next" type="button" onClick={showNext} aria-label="Next image"><ChevronRight /></button>
      <div className="blog-carousel-dots" aria-label={`Image ${activeIndex + 1} of ${images.length}`}>
        {images.map((image, index) => <button key={`${image}-${index}`} className={index === activeIndex ? "is-active" : ""} type="button" onClick={() => setActiveIndex(index)} aria-label={`Show image ${index + 1}`} aria-current={index === activeIndex ? "true" : undefined} />)}
      </div>
    </> : null}
  </div>;
}
