"use client";
/* eslint-disable @next/next/no-img-element */

import { ChangeEvent, CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import type { PhotoPreset } from "@/lib/photo-presets";

type Adjustments = { exposure: number; contrast: number; highlights: number; shadows: number; temperature: number; tint: number; vibrance: number; saturation: number };
const neutral: Adjustments = { exposure: 0, contrast: 0, highlights: 0, shadows: 0, temperature: 0, tint: 0, vibrance: 0, saturation: 0 };

function values(preset: PhotoPreset | null, manual: Adjustments) {
  return {
    exposure: (preset?.exposure ?? 0) + manual.exposure,
    contrast: (preset?.contrast ?? 0) + manual.contrast,
    highlights: (preset?.highlights ?? 0) + manual.highlights,
    shadows: (preset?.shadows ?? 0) + manual.shadows,
    temperature: ((preset?.temperature ?? 5200) - 5200) / 28 + manual.temperature,
    tint: (preset?.tint ?? 0) + manual.tint,
    vibrance: (preset?.vibrance ?? 0) + manual.vibrance,
    saturation: (preset?.saturation ?? 0) + manual.saturation,
    whites: preset?.whites ?? 0,
    blacks: preset?.blacks ?? 0,
    vignette: preset?.vignette ?? 0,
  };
}

function filterFor(current: ReturnType<typeof values>) {
  const brightness = Math.max(.2, 1 + current.exposure * .18 + current.shadows * .0012 + current.whites * .0007 + current.blacks * .0005);
  const contrast = Math.max(.2, 1 + current.contrast / 100 - current.highlights * .0005);
  const saturation = Math.max(0, 1 + current.saturation / 100 + current.vibrance / 170);
  const sepia = Math.min(.22, Math.abs(current.temperature) / 520);
  const hue = current.tint * .08 + current.temperature * .025;
  return `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) sepia(${sepia}) hue-rotate(${hue}deg)`;
}

function drawPhoto(context: CanvasRenderingContext2D, image: HTMLImageElement, width: number, height: number, current: ReturnType<typeof values>) {
  context.clearRect(0, 0, width, height);
  context.filter = filterFor(current);
  context.drawImage(image, 0, 0, width, height);
  context.filter = "none";
  if (current.temperature !== 0) {
    context.fillStyle = current.temperature > 0 ? `rgba(255,142,45,${Math.min(.16, current.temperature / 900)})` : `rgba(52,125,255,${Math.min(.16, Math.abs(current.temperature) / 900)})`;
    context.fillRect(0, 0, width, height);
  }
  if (current.tint !== 0) {
    context.fillStyle = current.tint > 0 ? `rgba(216,61,179,${Math.min(.1, current.tint / 900)})` : `rgba(46,170,92,${Math.min(.1, Math.abs(current.tint) / 900)})`;
    context.fillRect(0, 0, width, height);
  }
  if (current.vignette < 0) {
    const gradient = context.createRadialGradient(width / 2, height / 2, Math.min(width, height) * .18, width / 2, height / 2, Math.max(width, height) * .72);
    gradient.addColorStop(.45, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(0,0,0,${Math.min(.5, Math.abs(current.vignette) / 160)})`);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }
}

function Slider({ label, value, min, max, step = 1, onChange }: { label: string; value: number; min: number; max: number; step?: number; onChange: (value: number) => void }) {
  return <label className="preset-slider"><span>{label}<strong>{value > 0 ? "+" : ""}{Number(value.toFixed(1))}</strong></span><input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

export function PresetStudio({ presets }: { presets: PhotoPreset[] }) {
  const [photo, setPhoto] = useState<{ url: string; image: HTMLImageElement; name: string } | null>(null);
  const [selectedId, setSelectedId] = useState(presets[0]?.id ?? "");
  const [manual, setManual] = useState<Adjustments>(neutral);
  const [search, setSearch] = useState("");
  const [comparison, setComparison] = useState(50);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState(90);
  const inputRef = useRef<HTMLInputElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);
  const editedCanvasRef = useRef<HTMLCanvasElement>(null);
  const selected = presets.find((preset) => preset.id === selectedId) ?? null;
  const current = useMemo(() => values(selected, manual), [selected, manual]);
  const filtered = useMemo(() => presets.filter((preset) => preset.name.toLowerCase().includes(search.toLowerCase())), [presets, search]);

  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo.url); }, [photo]);
  useEffect(() => {
    if (!photo || !originalCanvasRef.current || !editedCanvasRef.current) return;
    const max = 1500;
    const scale = Math.min(1, max / Math.max(photo.image.naturalWidth, photo.image.naturalHeight));
    const width = Math.round(photo.image.naturalWidth * scale);
    const height = Math.round(photo.image.naturalHeight * scale);
    const originalCanvas = originalCanvasRef.current;
    const editedCanvas = editedCanvasRef.current;
    originalCanvas.width = editedCanvas.width = width;
    originalCanvas.height = editedCanvas.height = height;
    const originalContext = originalCanvas.getContext("2d");
    const editedContext = editedCanvas.getContext("2d");
    if (originalContext) drawPhoto(originalContext, photo.image, width, height, values(null, neutral));
    if (editedContext) drawPhoto(editedContext, photo.image, width, height, current);
  }, [current, photo]);

  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => setPhoto({ url, image, name: file.name });
    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  };

  const update = (key: keyof Adjustments, value: number) => setManual((state) => ({ ...state, [key]: value }));
  const selectPreset = (id: string) => { setSelectedId(id); setManual(neutral); };
  const exportPhoto = async () => {
    if (!photo) return;
    const canvas = document.createElement("canvas");
    canvas.width = photo.image.naturalWidth;
    canvas.height = photo.image.naturalHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (format === "jpeg") { context.fillStyle = "#fff"; context.fillRect(0, 0, canvas.width, canvas.height); }
    drawPhoto(context, photo.image, canvas.width, canvas.height, current);
    const mime = `image/${format}`;
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, format === "png" ? undefined : quality / 100));
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${photo.name.replace(/\.[^.]+$/, "")}-${selected?.name ?? "edited"}.${format === "jpeg" ? "jpg" : format}`;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <article className="playground-panel preset-studio">
      {!photo ? <button type="button" className="preset-dropzone" onClick={() => inputRef.current?.click()}><span>✦</span><strong>Choose a photo to begin</strong><small>JPEG, PNG, or WebP. It stays on this device.</small></button> : (
        <>
          <div className="preset-stage" style={{ "--comparison": `${comparison}%` } as CSSProperties}>
            <canvas ref={originalCanvasRef} aria-label="Original photo preview" />
            <canvas ref={editedCanvasRef} className="preset-stage-edited" aria-label="Edited photo preview" />
            <div className="preset-compare-line" aria-hidden="true"><span>↔</span></div>
            <input className="preset-compare-input" type="range" min="0" max="100" value={comparison} onChange={(event) => setComparison(Number(event.target.value))} aria-label={`Before and after comparison, ${comparison}% original`} />
            <small className="preset-before-label">Before</small><small className="preset-after-label">After</small>
            <span className="preset-name-label">{selected?.name ?? "No preset"}</span>
          </div>
          <div className="preset-browser"><div className="preset-browser-heading"><div><strong>My presets</strong><small>{presets.length} XMP recipes</small></div><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Find a preset" /></div><div className="preset-list">{filtered.map((preset) => { const style = { "--preset-filter": filterFor(values(preset, neutral)) } as CSSProperties; return <button type="button" key={preset.id} className={selectedId === preset.id ? "is-active" : ""} onClick={() => selectPreset(preset.id)} style={style}><img src={photo.url} alt="" /><span>{preset.name}</span></button>; })}</div></div>
          <div className="preset-adjustments"><header><div><strong>Fine tune</strong><small>Adjustments are added on top of the preset</small></div><button type="button" onClick={() => setManual(neutral)}>Reset sliders</button></header><div className="preset-control-grid"><fieldset><legend>Light</legend><Slider label="Exposure" value={manual.exposure} min={-3} max={3} step={.1} onChange={(value) => update("exposure", value)} /><Slider label="Contrast" value={manual.contrast} min={-100} max={100} onChange={(value) => update("contrast", value)} /><Slider label="Highlights" value={manual.highlights} min={-100} max={100} onChange={(value) => update("highlights", value)} /><Slider label="Shadows" value={manual.shadows} min={-100} max={100} onChange={(value) => update("shadows", value)} /></fieldset><fieldset><legend>Color</legend><Slider label="Temperature" value={manual.temperature} min={-100} max={100} onChange={(value) => update("temperature", value)} /><Slider label="Tint" value={manual.tint} min={-100} max={100} onChange={(value) => update("tint", value)} /><Slider label="Vibrance" value={manual.vibrance} min={-100} max={100} onChange={(value) => update("vibrance", value)} /><Slider label="Saturation" value={manual.saturation} min={-100} max={100} onChange={(value) => update("saturation", value)} /></fieldset></div></div>
          <div className="preset-export"><select value={format} onChange={(event) => setFormat(event.target.value as typeof format)} aria-label="Export format"><option value="jpeg">JPEG</option><option value="png">PNG</option><option value="webp">WebP</option></select>{format !== "png" ? <label><span>Quality {quality}%</span><input type="range" min="40" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label> : null}<button type="button" onClick={exportPhoto}>Download edited photo</button><button type="button" className="is-secondary" onClick={() => inputRef.current?.click()}>Choose another</button></div>
          <p className="preset-honesty"><strong>A small honest note:</strong> this is a browser interpretation of the strongest XMP settings, not Lightroom hiding in a trench coat. Camera profiles, masks, calibration, advanced curves, and Lightroom&apos;s color engine may look different.</p>
        </>
      )}
      <input ref={inputRef} className="image-lab-file-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} />
    </article>
  );
}
