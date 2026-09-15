"use client";

/* eslint-disable @next/next/no-img-element */

import {
  ChangeEvent,
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { PhotoPreset } from "@/lib/photo-presets";
import { MoveHorizontal, Sparkles } from "lucide-react";

type Adjustments = {
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  temperature: number;
  tint: number;
  vibrance: number;
  saturation: number;
};

type CurrentValues = ReturnType<typeof values>;

const neutral: Adjustments = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  vibrance: 0,
  saturation: 0,
};

function values(preset: PhotoPreset | null, manual: Adjustments) {
  return {
    exposure: (preset?.exposure ?? 0) + manual.exposure,

    contrast: (preset?.contrast ?? 0) + manual.contrast,

    highlights: (preset?.highlights ?? 0) + manual.highlights,

    shadows: (preset?.shadows ?? 0) + manual.shadows,

    temperature:
      ((preset?.temperature ?? 5200) - 5200) / 28 + manual.temperature,

    tint: (preset?.tint ?? 0) + manual.tint,

    vibrance: (preset?.vibrance ?? 0) + manual.vibrance,

    saturation: (preset?.saturation ?? 0) + manual.saturation,

    whites: preset?.whites ?? 0,
    blacks: preset?.blacks ?? 0,
    vignette: preset?.vignette ?? 0,
  };
}

/**
 * ============================================================
 * PREVIEW FILTER
 * ============================================================
 *
 * Used for:
 *
 * - large preview
 * - preset thumbnails
 *
 * CSS filters are used here because Safari handles them much
 * more consistently than CanvasRenderingContext2D.filter.
 */
function filterFor(current: CurrentValues) {
  const brightness = Math.max(
    0.2,
    1 +
      current.exposure * 0.18 +
      current.shadows * 0.0012 +
      current.whites * 0.0007 +
      current.blacks * 0.0005,
  );

  const contrast = Math.max(
    0.2,
    1 + current.contrast / 100 - current.highlights * 0.0005,
  );

  const saturation = Math.max(
    0,
    1 + current.saturation / 100 + current.vibrance / 170,
  );

  const sepia = Math.min(0.22, Math.abs(current.temperature) / 520);

  const hue = current.tint * 0.08 + current.temperature * 0.025;

  return [
    `brightness(${brightness})`,
    `contrast(${contrast})`,
    `saturate(${saturation})`,
    `sepia(${sepia})`,
    `hue-rotate(${hue}deg)`,
  ].join(" ");
}

/**
 * ============================================================
 * RAW CANVAS DRAWING
 * ============================================================
 */

function drawRawPhoto(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
) {
  context.save();

  context.clearRect(0, 0, width, height);

  context.filter = "none";

  context.globalAlpha = 1;

  context.globalCompositeOperation = "source-over";

  context.drawImage(image, 0, 0, width, height);

  context.restore();
}

/**
 * ============================================================
 * PREVIEW OVERLAY
 * ============================================================
 */

function drawOverlay(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  current: CurrentValues,
) {
  context.clearRect(0, 0, width, height);

  context.save();

  /*
   * Temperature
   */
  if (current.temperature !== 0) {
    const alpha = Math.min(0.16, Math.abs(current.temperature) / 900);

    context.fillStyle =
      current.temperature > 0
        ? `rgba(255,142,45,${alpha})`
        : `rgba(52,125,255,${alpha})`;

    context.fillRect(0, 0, width, height);
  }

  /*
   * Tint
   */
  if (current.tint !== 0) {
    const alpha = Math.min(0.1, Math.abs(current.tint) / 900);

    context.fillStyle =
      current.tint > 0
        ? `rgba(216,61,179,${alpha})`
        : `rgba(46,170,92,${alpha})`;

    context.fillRect(0, 0, width, height);
  }

  /*
   * Vignette
   */
  if (current.vignette < 0) {
    const gradient = context.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.18,

      width / 2,
      height / 2,
      Math.max(width, height) * 0.72,
    );

    gradient.addColorStop(0.45, "rgba(0,0,0,0)");

    gradient.addColorStop(
      1,
      `rgba(0,0,0,${Math.min(0.5, Math.abs(current.vignette) / 160)})`,
    );

    context.fillStyle = gradient;

    context.fillRect(0, 0, width, height);
  }

  context.restore();
}

/**
 * ============================================================
 * EXPORT PIXEL PROCESSING
 * ============================================================
 */

function clamp(value: number) {
  return Math.max(0, Math.min(255, value));
}

function applyPresetToPixels(imageData: ImageData, current: CurrentValues) {
  const data = imageData.data;

  /*
   * IMPORTANT:
   *
   * These calculations intentionally mirror filterFor().
   *
   * That means the downloaded image should visually match
   * the CSS-filtered preview.
   */

  const brightness = Math.max(
    0.2,
    1 +
      current.exposure * 0.18 +
      current.shadows * 0.0012 +
      current.whites * 0.0007 +
      current.blacks * 0.0005,
  );

  const contrast = Math.max(
    0.2,
    1 + current.contrast / 100 - current.highlights * 0.0005,
  );

  const saturation = Math.max(
    0,
    1 + current.saturation / 100 + current.vibrance / 170,
  );

  const sepia = Math.min(0.22, Math.abs(current.temperature) / 520);

  const hueDegrees = current.tint * 0.08 + current.temperature * 0.025;

  const angle = (hueDegrees * Math.PI) / 180;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const contrastOffset = 128 * (1 - contrast);

  /*
   * CSS hue-rotate matrix.
   */
  const hue00 = 0.213 + cos * 0.787 - sin * 0.213;

  const hue01 = 0.715 - cos * 0.715 - sin * 0.715;

  const hue02 = 0.072 - cos * 0.072 + sin * 0.928;

  const hue10 = 0.213 - cos * 0.213 + sin * 0.143;

  const hue11 = 0.715 + cos * 0.285 + sin * 0.14;

  const hue12 = 0.072 - cos * 0.072 - sin * 0.283;

  const hue20 = 0.213 - cos * 0.213 - sin * 0.787;

  const hue21 = 0.715 - cos * 0.715 + sin * 0.715;

  const hue22 = 0.072 + cos * 0.928 + sin * 0.072;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    /*
     * -------------------------
     * brightness()
     * -------------------------
     */

    r *= brightness;
    g *= brightness;
    b *= brightness;

    /*
     * -------------------------
     * contrast()
     * -------------------------
     */

    r = r * contrast + contrastOffset;

    g = g * contrast + contrastOffset;

    b = b * contrast + contrastOffset;

    /*
     * -------------------------
     * saturate()
     * -------------------------
     */

    const saturatedR =
      (0.213 + 0.787 * saturation) * r +
      (0.715 - 0.715 * saturation) * g +
      (0.072 - 0.072 * saturation) * b;

    const saturatedG =
      (0.213 - 0.213 * saturation) * r +
      (0.715 + 0.285 * saturation) * g +
      (0.072 - 0.072 * saturation) * b;

    const saturatedB =
      (0.213 - 0.213 * saturation) * r +
      (0.715 - 0.715 * saturation) * g +
      (0.072 + 0.928 * saturation) * b;

    r = saturatedR;
    g = saturatedG;
    b = saturatedB;

    /*
     * -------------------------
     * sepia()
     * -------------------------
     */

    if (sepia > 0) {
      const sepiaR = r * 0.393 + g * 0.769 + b * 0.189;

      const sepiaG = r * 0.349 + g * 0.686 + b * 0.168;

      const sepiaB = r * 0.272 + g * 0.534 + b * 0.131;

      r = r * (1 - sepia) + sepiaR * sepia;

      g = g * (1 - sepia) + sepiaG * sepia;

      b = b * (1 - sepia) + sepiaB * sepia;
    }

    /*
     * -------------------------
     * hue-rotate()
     * -------------------------
     */

    const rotatedR = r * hue00 + g * hue01 + b * hue02;

    const rotatedG = r * hue10 + g * hue11 + b * hue12;

    const rotatedB = r * hue20 + g * hue21 + b * hue22;

    data[i] = Math.round(clamp(rotatedR));

    data[i + 1] = Math.round(clamp(rotatedG));

    data[i + 2] = Math.round(clamp(rotatedB));
  }
}

/**
 * ============================================================
 * EXPORT OVERLAYS
 * ============================================================
 */

function applyExportOverlays(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  current: CurrentValues,
) {
  context.save();

  context.globalAlpha = 1;

  context.globalCompositeOperation = "source-over";

  /*
   * Temperature
   */
  if (current.temperature !== 0) {
    const alpha = Math.min(0.16, Math.abs(current.temperature) / 900);

    context.fillStyle =
      current.temperature > 0
        ? `rgba(255,142,45,${alpha})`
        : `rgba(52,125,255,${alpha})`;

    context.fillRect(0, 0, width, height);
  }

  /*
   * Tint
   */
  if (current.tint !== 0) {
    const alpha = Math.min(0.1, Math.abs(current.tint) / 900);

    context.fillStyle =
      current.tint > 0
        ? `rgba(216,61,179,${alpha})`
        : `rgba(46,170,92,${alpha})`;

    context.fillRect(0, 0, width, height);
  }

  /*
   * Vignette
   */
  if (current.vignette < 0) {
    const gradient = context.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.18,

      width / 2,
      height / 2,
      Math.max(width, height) * 0.72,
    );

    gradient.addColorStop(0.45, "rgba(0,0,0,0)");

    gradient.addColorStop(
      1,
      `rgba(0,0,0,${Math.min(0.5, Math.abs(current.vignette) / 160)})`,
    );

    context.fillStyle = gradient;

    context.fillRect(0, 0, width, height);
  }

  context.restore();
}

/**
 * ============================================================
 * CANVAS -> BLOB
 * ============================================================
 *
 * canvas.toBlob() exists on modern browsers, but this fallback
 * makes the export path safer.
 */

function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");

  const metadata = parts[0];
  const data = parts[1];

  const mimeMatch = metadata.match(/data:([^;]+);base64/);

  const mime = mimeMatch?.[1] ?? "image/jpeg";

  const binary = atob(data);

  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], {
    type: mime,
  });
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality?: number,
): Promise<Blob> {
  if (canvas.toBlob) {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, mime, quality);
    });

    if (blob) {
      return blob;
    }
  }

  /*
   * Fallback.
   */
  const dataUrl = canvas.toDataURL(mime, quality);

  return dataUrlToBlob(dataUrl);
}

/**
 * ============================================================
 * SLIDER
 * ============================================================
 */

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="preset-slider">
      <span>
        {label}

        <strong>
          {value > 0 ? "+" : ""}

          {Number(value.toFixed(1))}
        </strong>
      </span>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

/**
 * ============================================================
 * COMPONENT
 * ============================================================
 */

export function PresetStudio({ presets }: { presets: PhotoPreset[] }) {
  const [photo, setPhoto] = useState<{
    url: string;
    image: HTMLImageElement;
    name: string;
  } | null>(null);

  const [selectedId, setSelectedId] = useState(presets[0]?.id ?? "");

  const [manual, setManual] = useState<Adjustments>(neutral);

  const [search, setSearch] = useState("");

  const [comparison, setComparison] = useState(50);

  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");

  const [quality, setQuality] = useState(90);

  const [isExporting, setIsExporting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const originalCanvasRef = useRef<HTMLCanvasElement>(null);

  const editedCanvasRef = useRef<HTMLCanvasElement>(null);

  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  const selected = presets.find((preset) => preset.id === selectedId) ?? null;

  const current = useMemo(() => values(selected, manual), [selected, manual]);

  const previewFilter = useMemo(() => filterFor(current), [current]);

  const filtered = useMemo(
    () =>
      presets.filter((preset) =>
        preset.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [presets, search],
  );

  /**
   * ==========================================================
   * CLEANUP PHOTO URL
   * ==========================================================
   */

  useEffect(() => {
    return () => {
      if (photo) {
        URL.revokeObjectURL(photo.url);
      }
    };
  }, [photo]);

  /**
   * ==========================================================
   * PREVIEW
   * ==========================================================
   */

  useEffect(() => {
    if (
      !photo ||
      !originalCanvasRef.current ||
      !editedCanvasRef.current ||
      !overlayCanvasRef.current
    ) {
      return;
    }

    const max = 1500;

    const scale = Math.min(
      1,
      max /
        Math.max(
          photo.image.naturalWidth,

          photo.image.naturalHeight,
        ),
    );

    const width = Math.round(photo.image.naturalWidth * scale);

    const height = Math.round(photo.image.naturalHeight * scale);

    const originalCanvas = originalCanvasRef.current;

    const editedCanvas = editedCanvasRef.current;

    const overlayCanvas = overlayCanvasRef.current;

    originalCanvas.width = width;

    originalCanvas.height = height;

    editedCanvas.width = width;

    editedCanvas.height = height;

    overlayCanvas.width = width;

    overlayCanvas.height = height;

    const originalContext = originalCanvas.getContext("2d");

    const editedContext = editedCanvas.getContext("2d");

    const overlayContext = overlayCanvas.getContext("2d");

    if (originalContext) {
      drawRawPhoto(originalContext, photo.image, width, height);
    }

    if (editedContext) {
      drawRawPhoto(editedContext, photo.image, width, height);
    }

    if (overlayContext) {
      drawOverlay(overlayContext, width, height, current);
    }
  }, [photo, current]);

  /**
   * ==========================================================
   * CHOOSE PHOTO
   * ==========================================================
   */

  const choosePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const url = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      setPhoto({
        url,
        image,
        name: file.name,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
    };

    image.src = url;

    /*
     * Allow the same file to
     * be selected again.
     */
    event.target.value = "";
  };

  /**
   * ==========================================================
   * MANUAL ADJUSTMENTS
   * ==========================================================
   */

  const update = (key: keyof Adjustments, value: number) => {
    setManual((state) => ({
      ...state,
      [key]: value,
    }));
  };

  /**
   * ==========================================================
   * PRESET
   * ==========================================================
   */

  const selectPreset = (id: string) => {
    setSelectedId(id);

    setManual(neutral);
  };

  /**
   * ==========================================================
   * EXPORT
   * ==========================================================
   *
   * IMPORTANT:
   *
   * ALL browsers use this exact path.
   *
   * We DO NOT use:
   *
   * context.filter
   *
   * anywhere in the export.
   */

  const exportPhoto = async () => {
    if (!photo || isExporting) {
      return;
    }

    setIsExporting(true);

    try {
      const width = photo.image.naturalWidth;

      const height = photo.image.naturalHeight;

      /*
       * ----------------------
       * Create export canvas
       * ----------------------
       */

      const canvas = document.createElement("canvas");

      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!context) {
        throw new Error("Could not create export canvas.");
      }

      /*
       * ----------------------
       * Draw ORIGINAL
       * ----------------------
       */

      context.filter = "none";

      context.globalAlpha = 1;

      context.globalCompositeOperation = "source-over";

      context.drawImage(photo.image, 0, 0, width, height);

      /*
       * ----------------------
       * Read pixels
       * ----------------------
       */

      const imageData = context.getImageData(0, 0, width, height);

      /*
       * ----------------------
       * APPLY PRESET
       * ----------------------
       */

      applyPresetToPixels(imageData, current);

      /*
       * ----------------------
       * Write pixels
       * ----------------------
       */

      context.putImageData(imageData, 0, 0);

      /*
       * ----------------------
       * Temperature
       * Tint
       * Vignette
       * ----------------------
       */

      applyExportOverlays(context, width, height, current);

      /*
       * ----------------------
       * JPEG background
       * ----------------------
       */

      if (format === "jpeg") {
        context.save();

        context.globalCompositeOperation = "destination-over";

        context.fillStyle = "#ffffff";

        context.fillRect(0, 0, width, height);

        context.restore();
      }

      /*
       * ----------------------
       * MIME
       * ----------------------
       */

      const mime =
        format === "jpeg"
          ? "image/jpeg"
          : format === "png"
            ? "image/png"
            : "image/webp";

      /*
       * ----------------------
       * Blob
       * ----------------------
       */

      const blob = await canvasToBlob(
        canvas,
        mime,

        format === "png" ? undefined : quality / 100,
      );

      /*
       * ----------------------
       * Download URL
       * ----------------------
       */

      const downloadUrl = URL.createObjectURL(blob);

      const extension = format === "jpeg" ? "jpg" : format;

      const baseName = photo.name.replace(/\.[^.]+$/, "");

      const presetName = selected?.name ?? "edited";

      const link = document.createElement("a");

      link.href = downloadUrl;

      link.download = `${baseName}-${presetName}.${extension}`;

      /*
       * Safari + Chrome safe.
       */
      link.style.display = "none";

      document.body.appendChild(link);

      link.click();

      /*
       * Don't immediately
       * remove/revoke it.
       *
       * Some browsers finish
       * the download async.
       */
      window.setTimeout(() => {
        link.remove();

        URL.revokeObjectURL(downloadUrl);
      }, 10_000);
    } catch (error) {
      console.error("Failed to export photo:", error);
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (
    <article className="playground-panel preset-studio">
      {!photo ? (
        <button
          type="button"
          className="preset-dropzone"
          onClick={() => inputRef.current?.click()}
        >
          <span>
            <Sparkles />
          </span>

          <strong>Choose a photo to begin</strong>

          <small>JPEG, PNG, or WebP. It stays on this device.</small>
        </button>
      ) : (
        <>
          {/*
           * ====================
           * PREVIEW
           * ====================
           */}

          <div
            className="preset-stage"
            style={
              {
                "--comparison": `${comparison}%`,
              } as CSSProperties
            }
          >
            {/*
             * BEFORE
             */}

            <canvas
              ref={originalCanvasRef}
              aria-label="Original photo preview"
            />

            {/*
             * AFTER
             *
             * Safari-safe:
             * CSS filter instead
             * of context.filter.
             */}

            <canvas
              ref={editedCanvasRef}
              className="preset-stage-edited"
              aria-label="Edited photo preview"
              style={{
                filter: previewFilter,

                WebkitFilter: previewFilter,
              }}
            />

            {/*
             * Temperature /
             * tint / vignette
             */}

            <canvas
              ref={overlayCanvasRef}
              className="preset-stage-overlay"
              aria-hidden="true"
            />

            {/*
             * Compare line
             */}

            <div className="preset-compare-line" aria-hidden="true">
              <span>
                <MoveHorizontal />
              </span>
            </div>

            {/*
             * Compare slider
             */}

            <input
              className="preset-compare-input"
              type="range"
              min="0"
              max="100"
              value={comparison}
              onChange={(event) => setComparison(Number(event.target.value))}
              aria-label={`Before and after comparison, ${comparison}% original`}
            />

            <small className="preset-before-label">Before</small>

            <small className="preset-after-label">After</small>

            <span className="preset-name-label">
              {selected?.name ?? "No preset"}
            </span>
          </div>

          {/*
           * ====================
           * PRESETS
           * ====================
           */}

          <div className="preset-browser">
            <div className="preset-browser-heading">
              <div>
                <strong>My presets</strong>

                <small>{presets.length} XMP recipes</small>
              </div>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Find a preset"
              />
            </div>

            <div className="preset-list">
              {filtered.map((preset) => {
                const style = {
                  "--preset-filter": filterFor(values(preset, neutral)),
                } as CSSProperties;

                return (
                  <button
                    type="button"
                    key={preset.id}
                    className={selectedId === preset.id ? "is-active" : ""}
                    onClick={() => selectPreset(preset.id)}
                    style={style}
                  >
                    <img src={photo.url} alt="" />

                    <span>{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/*
           * ====================
           * ADJUSTMENTS
           * ====================
           */}

          <div className="preset-adjustments">
            <header>
              <div>
                <strong>Fine tune</strong>

                <small>Adjustments are added on top of the preset</small>
              </div>

              <button type="button" onClick={() => setManual(neutral)}>
                Reset sliders
              </button>
            </header>

            <div className="preset-control-grid">
              {/*
               * LIGHT
               */}

              <fieldset>
                <legend>Light</legend>

                <Slider
                  label="Exposure"
                  value={manual.exposure}
                  min={-3}
                  max={3}
                  step={0.1}
                  onChange={(value) => update("exposure", value)}
                />

                <Slider
                  label="Contrast"
                  value={manual.contrast}
                  min={-100}
                  max={100}
                  onChange={(value) => update("contrast", value)}
                />

                <Slider
                  label="Highlights"
                  value={manual.highlights}
                  min={-100}
                  max={100}
                  onChange={(value) => update("highlights", value)}
                />

                <Slider
                  label="Shadows"
                  value={manual.shadows}
                  min={-100}
                  max={100}
                  onChange={(value) => update("shadows", value)}
                />
              </fieldset>

              {/*
               * COLOR
               */}

              <fieldset>
                <legend>Color</legend>

                <Slider
                  label="Temperature"
                  value={manual.temperature}
                  min={-100}
                  max={100}
                  onChange={(value) => update("temperature", value)}
                />

                <Slider
                  label="Tint"
                  value={manual.tint}
                  min={-100}
                  max={100}
                  onChange={(value) => update("tint", value)}
                />

                <Slider
                  label="Vibrance"
                  value={manual.vibrance}
                  min={-100}
                  max={100}
                  onChange={(value) => update("vibrance", value)}
                />

                <Slider
                  label="Saturation"
                  value={manual.saturation}
                  min={-100}
                  max={100}
                  onChange={(value) => update("saturation", value)}
                />
              </fieldset>
            </div>
          </div>

          {/*
           * ====================
           * EXPORT
           * ====================
           */}

          <div className="preset-export">
            <select
              value={format}
              disabled={isExporting}
              onChange={(event) =>
                setFormat(event.target.value as typeof format)
              }
              aria-label="Export format"
            >
              <option value="jpeg">JPEG</option>

              <option value="png">PNG</option>

              <option value="webp">WebP</option>
            </select>

            {format !== "png" ? (
              <label>
                <span>Quality {quality}%</span>

                <input
                  type="range"
                  min="40"
                  max="100"
                  value={quality}
                  disabled={isExporting}
                  onChange={(event) => setQuality(Number(event.target.value))}
                />
              </label>
            ) : null}

            <button type="button" onClick={exportPhoto} disabled={isExporting}>
              {isExporting ? "Processing..." : "Download edited photo"}
            </button>

            <button
              type="button"
              className="is-secondary"
              disabled={isExporting}
              onClick={() => inputRef.current?.click()}
            >
              Choose another
            </button>
          </div>

          <p className="preset-honesty">
            <strong>A small honest note:</strong> this is a browser
            interpretation of the strongest XMP settings, not Lightroom hiding
            in a trench coat. Camera profiles, masks, calibration, advanced
            curves, and Lightroom&apos;s color engine may look different.
          </p>
        </>
      )}

      <input
        ref={inputRef}
        className="image-lab-file-input"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={choosePhoto}
      />
    </article>
  );
}
