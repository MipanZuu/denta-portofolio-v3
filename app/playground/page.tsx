import type { Metadata } from "next";
import { PlaygroundOverview } from "@/components/playground/playground-overview";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { PlaygroundPrivacyNote } from "@/components/playground/playground-privacy-note";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description =
  "A small collection of interactive games and useful browser tools by Denta Bramasta.";

export const metadata: Metadata = createPageMetadata(
  "Playground",
  description,
  "/playground",
);

export default function PlaygroundPage() {
  return (
    <>
      <JsonLd
        data={createWebPageJsonLd(
          "Denta Bramasta interactive playground",
          description,
          "/playground",
          "CollectionPage",
        )}
      />
      <SectionHeading index="08" eyebrow="Playground" title="Useful things. Silly things." copy="Pick a quick game when your brain needs a reset, or open a small tool when you just want the job done." />
      <PlaygroundPrivacyNote />
      <PlaygroundOverview />
    </>
  );
}
