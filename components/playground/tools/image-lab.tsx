"use client";

import { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";

type ImageInfo = { file: File; url: string; width: number; height: number };
type Result = { blob: Blob; url: string; width: number; height: number; filename: string };

const formats = {
  webp: { mime: "image/webp", extension: "webp", label: "WebP" },
  jpeg: { mime: "image/jpeg", extension: "jpg", label: "JPEG" },
  png: { mime: "image/png", extension: "png", label: "PNG" },
} as const;

function fileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export function ImageLab() {
  const [source, setSource] = useState<ImageInfo | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [format, setFormat] = useState<keyof typeof formats>("webp");
  const [quality, setQuality] = useState(82);
  const [locked, setLocked] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => {
    if (source) URL.revokeObjectURL(source.url);
  }, [source]);

  useEffect(() => () => {
    if (result) URL.revokeObjectURL(result.url);
  }, [result]);

  const clearResult = () => {
    setResult(null);
  };

  const chooseFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("That file does not look like an image.");
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setSource((current) => {
        if (current) URL.revokeObjectURL(current.url);
        return { file, url, width: image.naturalWidth, height: image.naturalHeight };
      });
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
      setError("");
      clearResult();
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      setError("I could not read that image. Try another one.");
    };
    image.src = url;
  };

  const changeWidth = (next: number) => {
    if (!source) return;
    setWidth(next);
    if (locked) setHeight(Math.max(1, Math.round(next * source.height / source.width)));
  };

  const changeHeight = (next: number) => {
    if (!source) return;
    setHeight(next);
    if (locked) setWidth(Math.max(1, Math.round(next * source.width / source.height)));
  };

  const processImage = async () => {
    if (!source || width < 1 || height < 1) return;
    setWorking(true);
    setError("");
    try {
      const image = new Image();
      image.src = source.url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable.");
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      if (format === "jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.drawImage(image, 0, 0, width, height);
      const selected = formats[format];
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((next) => next ? resolve(next) : reject(new Error("Conversion failed.")), selected.mime, format === "png" ? undefined : quality / 100);
      });
      clearResult();
      const baseName = source.file.name.replace(/\.[^.]+$/, "") || "image";
      setResult({ blob, url: URL.createObjectURL(blob), width, height, filename: `${baseName}-${width}x${height}.${selected.extension}` });
    } catch {
      setError("The browser could not process this image. A different file or smaller size may help.");
    } finally {
      setWorking(false);
    }
  };

  return (
    <article className="playground-panel image-lab">
      {!source ? (
        <button className="image-lab-dropzone" type="button" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }}>
          <span aria-hidden="true"><Upload /></span>
          <strong>Drop an image here</strong>
          <small>or choose one from your device</small>
        </button>
      ) : (
        <div className="image-lab-workspace">
          <div className="image-lab-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result?.url ?? source.url} alt={result ? "Processed preview" : "Original preview"} />
            <div><strong>{result ? "Ready to download" : source.file.name}</strong><span>{result ? `${result.width} × ${result.height} · ${fileSize(result.blob.size)}` : `${source.width} × ${source.height} · ${fileSize(source.file.size)}`}</span></div>
          </div>
          <div className="image-lab-controls">
            <div className="image-lab-dimensions">
              <label><span>Width</span><input type="number" min="1" max="12000" value={width} onChange={(event) => changeWidth(Number(event.target.value))} /></label>
              <button type="button" className={locked ? "is-locked" : ""} onClick={() => setLocked((value) => !value)} aria-label={`${locked ? "Unlock" : "Lock"} aspect ratio`}>{locked ? "Linked" : "Free"}</button>
              <label><span>Height</span><input type="number" min="1" max="12000" value={height} onChange={(event) => changeHeight(Number(event.target.value))} /></label>
            </div>
            <fieldset><legend>Output format</legend><div>{Object.entries(formats).map(([key, item]) => <button key={key} type="button" className={format === key ? "is-active" : ""} onClick={() => setFormat(key as keyof typeof formats)}>{item.label}</button>)}</div></fieldset>
            {format !== "png" ? <label className="image-lab-quality"><span>Quality <strong>{quality}%</strong></span><input type="range" min="10" max="100" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label> : <p className="image-lab-png-note">PNG uses lossless output, so there is no quality slider.</p>}
            <div className="image-lab-actions">
              <button type="button" className="is-primary" disabled={working || width < 1 || height < 1} onClick={processImage}>{working ? "Working…" : "Process image"}</button>
              {result ? <a href={result.url} download={result.filename}>Download {formats[format].label}</a> : null}
              <button type="button" onClick={() => inputRef.current?.click()}>Choose another</button>
            </div>
          </div>
        </div>
      )}
      <input ref={inputRef} className="image-lab-file-input" type="file" accept="image/*" onChange={(event) => chooseFile(event.target.files?.[0])} />
      {error ? <p className="image-lab-error" role="alert">{error}</p> : null}
    </article>
  );
}
