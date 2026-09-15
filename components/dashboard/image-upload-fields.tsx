"use client";

import { upload } from "@vercel/blob/client";
import Image from "next/image";
import { useRef, useState } from "react";
import { X } from "lucide-react";

type ImageUploadFieldsProps = {
  initialCoverUrl?: string;
  initialGalleryUrls?: string;
};

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-+|-+$/g, "");
}

export function ImageUploadFields({ initialCoverUrl = "", initialGalleryUrls = "" }: ImageUploadFieldsProps) {
  const coverInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [coverUrl, setCoverUrl] = useState(initialCoverUrl);
  const [galleryUrls, setGalleryUrls] = useState(initialGalleryUrls);
  const [uploading, setUploading] = useState<"cover" | "gallery" | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const galleryPreviewUrls = Array.from(new Set(galleryUrls.split("\n").map((url) => url.trim()).filter((url) => url.startsWith("https://"))));

  function removeGalleryImage(imageUrl: string) {
    setGalleryUrls((current) => current.split("\n").map((url) => url.trim()).filter((url) => url && url !== imageUrl).join("\n"));
  }

  async function uploadFiles(kind: "cover" | "gallery", files: FileList | null) {
    if (!files?.length) return;
    setUploading(kind);
    setProgress(0);
    setError("");

    try {
      const uploadedUrls: string[] = [];
      for (const [index, file] of Array.from(files).entries()) {
        if (file.size > 15 * 1024 * 1024) throw new Error(`${file.name} is larger than 15 MB.`);
        const blob = await upload(`portfolio-blog/${kind}/${Date.now()}-${safeFileName(file.name)}`, file, {
          access: "public",
          handleUploadUrl: "/api/blog/upload",
          multipart: file.size > 10 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => setProgress(Math.round(((index + percentage / 100) / files.length) * 100)),
        });
        uploadedUrls.push(blob.url);
      }

      if (kind === "cover") setCoverUrl(uploadedUrls[0]);
      else setGalleryUrls((current) => [current.trim(), ...uploadedUrls].filter(Boolean).join("\n"));
      setProgress(100);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "The upload could not be completed.");
    } finally {
      setUploading(null);
      if (coverInput.current) coverInput.current.value = "";
      if (galleryInput.current) galleryInput.current.value = "";
    }
  }

  return <div className="media-field-stack">
    <div className="media-field-group"><label>Cover image URL<input name="coverImageUrl" type="url" value={coverUrl} onChange={(event) => setCoverUrl(event.target.value)} placeholder="https://…" /></label><div className="upload-row"><input ref={coverInput} className="upload-native-input" id="cover-upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void uploadFiles("cover", event.target.files)} /><label className="upload-button" htmlFor="cover-upload">{uploading === "cover" ? `Uploading ${progress}%` : "Upload cover image"}</label>{coverUrl ? <button type="button" onClick={() => setCoverUrl("")}>Clear</button> : null}</div>{coverUrl ? <div className="upload-preview"><Image src={coverUrl} alt="Cover preview" fill sizes="320px" /></div> : null}</div>
    <div className="media-field-group"><label>Gallery image URLs<textarea name="images" value={galleryUrls} onChange={(event) => setGalleryUrls(event.target.value)} rows={5} placeholder={"One URL per line\nhttps://…"} /></label><div className="upload-row"><input ref={galleryInput} className="upload-native-input" id="gallery-upload" type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={(event) => void uploadFiles("gallery", event.target.files)} /><label className="upload-button" htmlFor="gallery-upload">{uploading === "gallery" ? `Uploading ${progress}%` : "Upload gallery images"}</label>{galleryUrls ? <button type="button" onClick={() => setGalleryUrls("")}>Clear all</button> : null}</div>{galleryPreviewUrls.length ? <div className="upload-gallery-preview" aria-label={`${galleryPreviewUrls.length} gallery images`}>{galleryPreviewUrls.map((imageUrl, index) => <div className="upload-gallery-item" key={imageUrl}><Image src={imageUrl} alt={`Gallery preview ${index + 1}`} fill sizes="160px" /><span>{index + 1}</span><button type="button" onClick={() => removeGalleryImage(imageUrl)} aria-label={`Remove gallery image ${index + 1}`}><X aria-hidden="true" /></button></div>)}</div> : null}</div>
    {uploading ? <progress className="upload-progress" max="100" value={progress}>{progress}%</progress> : null}
    {error ? <p className="upload-error" role="alert">{error}</p> : null}
    <p className="field-note">Upload from your device or paste public HTTPS URLs. Up to 15 MB per image.</p>
  </div>;
}
