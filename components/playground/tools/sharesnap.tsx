"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

const FALLBACK_URL = "https://example.com/a-good-page";

function hostname(value: string) {
  try { return new URL(value.startsWith("http") ? value : `https://${value}`).hostname.replace(/^www\./, ""); }
  catch { return "your-site.com"; }
}

function PreviewImage({ image, title }: { image: string; title: string }) {
  return image
    // eslint-disable-next-line @next/next/no-img-element
    ? <img className="sharesnap-card-image" src={image} alt="Uploaded social preview" />
    : <div className="sharesnap-card-placeholder"><span>OG</span><strong>{title || "Your headline"}</strong></div>;
}

export function ShareSnap() {
  const [url, setUrl] = useState("https://dentabramasta.com/blog/a-good-post");
  const [title, setTitle] = useState("A clear title people will want to open");
  const [description, setDescription] = useState("Add one useful sentence that explains what waits behind the click.");
  const [image, setImage] = useState("");
  const [fileName, setFileName] = useState("");
  const [exporting, setExporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { if (image) URL.revokeObjectURL(image); }, [image]);

  const selectImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const next = URL.createObjectURL(file);
    setImage(next);
    setFileName(file.name);
  };

  const clearImage = () => { setImage(""); setFileName(""); if (inputRef.current) inputRef.current.value = ""; };
  const site = hostname(url || FALLBACK_URL);

  const exportOg = async () => {
    setExporting(true);
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 630;
      const context = canvas.getContext("2d");
      if (!context) return;

      const gradient = context.createLinearGradient(0, 0, 1200, 630);
      gradient.addColorStop(0, "#f4f3ed");
      gradient.addColorStop(.65, "#edf2e4");
      gradient.addColorStop(1, "#dfffa1");
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1200, 630);

      if (image) {
        const source = new Image();
        source.src = image;
        await source.decode();
        const scale = Math.max(1200 / source.naturalWidth, 630 / source.naturalHeight);
        const drawWidth = source.naturalWidth * scale;
        const drawHeight = source.naturalHeight * scale;
        context.globalAlpha = .2;
        context.drawImage(source, (1200 - drawWidth) / 2, (630 - drawHeight) / 2, drawWidth, drawHeight);
        context.globalAlpha = 1;
        context.fillStyle = "rgba(244,243,237,.72)";
        context.fillRect(0, 0, 1200, 630);
      }

      context.fillStyle = "#ff6543";
      context.font = "600 24px ui-monospace, monospace";
      context.fillText(site.toUpperCase(), 76, 88);
      context.fillStyle = "#0d120e";
      context.font = "700 68px Arial, sans-serif";
      const words = (title || "Your headline goes here").split(/\s+/);
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const candidate = line ? `${line} ${word}` : word;
        if (context.measureText(candidate).width > 1030 && line) { lines.push(line); line = word; }
        else line = candidate;
      }
      if (line) lines.push(line);
      lines.slice(0, 3).forEach((text, index) => context.fillText(text, 76, 205 + index * 78));
      context.fillStyle = "#5e665f";
      context.font = "400 30px Arial, sans-serif";
      const subtitle = description.length > 105 ? `${description.slice(0, 102)}...` : description;
      context.fillText(subtitle || "A short description for the curious people.", 76, 520, 1030);
      context.fillStyle = "#0d120e";
      context.beginPath();
      context.arc(1124, 78, 20, 0, Math.PI * 2);
      context.fill();

      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return;
      const downloadUrl = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = "sharesnap-og-image.png";
      anchor.click();
      URL.revokeObjectURL(downloadUrl);
    } finally { setExporting(false); }
  };

  return (
    <article className="playground-panel sharesnap">
      <div className="sharesnap-editor">
        <div className="sharesnap-fields">
          <label><span>Page URL</span><input type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder={FALLBACK_URL} /></label>
          <label><span>Title <small>{title.length}/70</small></span><input value={title} maxLength={100} onChange={(event) => setTitle(event.target.value)} /></label>
          <label><span>Description <small>{description.length}/160</small></span><textarea value={description} maxLength={220} onChange={(event) => setDescription(event.target.value)} /></label>
          <div className="sharesnap-upload"><input ref={inputRef} type="file" accept="image/*" onChange={selectImage} /><button type="button" onClick={() => inputRef.current?.click()}>{image ? "Replace image" : "Upload image"}</button>{fileName ? <span>{fileName}</span> : <span>Recommended: 1200 × 630</span>}{image ? <button type="button" className="is-text" onClick={clearImage}>Remove</button> : null}</div>
          <button type="button" className="sharesnap-export" onClick={exportOg} disabled={exporting}>{exporting ? "Drawing pixels..." : "Generate OG image"}</button>
        </div>
        <aside className="sharesnap-dimensions"><strong>Handy dimensions</strong><ul><li><span>Open Graph</span><b>1200 × 630</b></li><li><span>LinkedIn</span><b>1200 × 627</b></li><li><span>X large card</span><b>1200 × 628</b></li><li><span>Square fallback</span><b>1080 × 1080</b></li></ul></aside>
      </div>

      <div className="sharesnap-previews">
        <section className="sharesnap-platform"><header><span>in</span><strong>LinkedIn-style</strong></header><div className="sharesnap-linkedin"><PreviewImage image={image} title={title} /><div><small>{site}</small><h2>{title || "Untitled page"}</h2><p>{description}</p></div></div></section>
        <section className="sharesnap-platform"><header><span>𝕏</span><strong>X-style</strong></header><div className="sharesnap-x"><PreviewImage image={image} title={title} /><div><small>{site}</small><h2>{title || "Untitled page"}</h2><p>{description}</p></div></div></section>
        <section className="sharesnap-platform"><header><span>◉</span><strong>Discord-style</strong></header><div className="sharesnap-discord"><i /><small>{site}</small><h2>{title || "Untitled page"}</h2><p>{description}</p><PreviewImage image={image} title={title} /></div></section>
        <section className="sharesnap-platform"><header><span>◔</span><strong>WhatsApp-style</strong></header><div className="sharesnap-whatsapp"><PreviewImage image={image} title={title} /><div><h2>{title || "Untitled page"}</h2><p>{description}</p><small>{site}</small></div></div></section>
      </div>
    </article>
  );
}
