import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type PhotoPreset = {
  id: string;
  name: string;
  exposure: number;
  contrast: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  temperature: number;
  tint: number;
  vibrance: number;
  saturation: number;
  vignette: number;
};

function attribute(xml: string, name: string, fallback = 0) {
  const match = xml.match(new RegExp(`crs:${name}="([+-]?[\\d.]+)"`));
  const value = match ? Number(match[1]) : fallback;
  return Number.isFinite(value) ? value : fallback;
}

export async function getPhotoPresets(): Promise<PhotoPreset[]> {
  const directory = path.join(process.cwd(), "public", "presets", "denta-presets");
  const files = (await readdir(directory)).filter((file) => file.toLowerCase().endsWith(".xmp")).sort((a, b) => a.localeCompare(b));
  return Promise.all(files.map(async (file) => {
    const xml = await readFile(path.join(directory, file), "utf8");
    const embeddedName = xml.match(/<rdf:li xml:lang="x-default">([^<]+)<\/rdf:li>/)?.[1]?.trim();
    return {
      id: file,
      name: embeddedName || file.replace(/\.xmp$/i, "").trim(),
      exposure: attribute(xml, "Exposure2012"),
      contrast: attribute(xml, "Contrast2012"),
      highlights: attribute(xml, "Highlights2012"),
      shadows: attribute(xml, "Shadows2012"),
      whites: attribute(xml, "Whites2012"),
      blacks: attribute(xml, "Blacks2012"),
      temperature: attribute(xml, "Temperature", 5200),
      tint: attribute(xml, "Tint"),
      vibrance: attribute(xml, "Vibrance"),
      saturation: attribute(xml, "Saturation"),
      vignette: attribute(xml, "PostCropVignetteAmount"),
    };
  }));
}
