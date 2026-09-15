import type { Metadata } from "next";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { PresetStudio } from "@/components/playground/tools/preset-studio";
import { JsonLd } from "@/components/seo/json-ld";
import { getPhotoPresets } from "@/lib/photo-presets";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Apply Denta's Lightroom-inspired presets to a photo and export it locally from your browser.";
export const metadata: Metadata = createPageMetadata("Denta Preset Studio", description, "/playground/preset-studio");

export default async function Page() {
  const presets = await getPhotoPresets();
  return (
    <>
      <JsonLd data={createWebPageJsonLd("Denta Preset Studio", description, "/playground/preset-studio")} />
      <PlaygroundDetailHeading kind="Tool" index="01" title="Preset Studio" description="Borrow my photographic mood for a minute. Drop in a photo, try one of my real presets, fine-tune it, and take the result home." />
      <PresetStudio presets={presets} />
    </>
  );
}
