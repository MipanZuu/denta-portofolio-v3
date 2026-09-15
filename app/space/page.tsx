import type { Metadata } from "next";
import { BlackHoleScene } from "@/components/space/black-hole-scene";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description =
  "Explore an interactive WebGPU black hole and its glowing accretion disk.";

export const metadata: Metadata = createPageMetadata(
  "Space",
  description,
  "/space",
);

export default function SpacePage() {
  return (
    <main className="space-page">
      <JsonLd
        data={createWebPageJsonLd(
          "Interactive black hole",
          description,
          "/space",
        )}
      />
      <BlackHoleScene />
    </main>
  );
}
