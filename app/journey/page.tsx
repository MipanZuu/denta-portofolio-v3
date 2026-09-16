import type { Metadata } from "next";
import { JourneyScene } from "@/components/journey/journey-scene";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description =
  "Travel through Denta Bramasta's personal, education, and software engineering journey in an interactive 3D space experience.";
export const metadata: Metadata = createPageMetadata(
  "Journey",
  description,
  "/journey",
);

export default function JourneyPage() {
  return (
    <main className="journey-page">
      <JsonLd
        data={createWebPageJsonLd(
          "Denta Bramasta's journey",
          description,
          "/journey",
          "ProfilePage",
        )}
      />
      <JourneyScene />
    </main>
  );
}
