import type { Metadata } from "next";
import { ImageLab } from "@/components/playground/tools/image-lab";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Resize, compress, and convert images to WebP, PNG, or JPEG locally in your browser.";

export const metadata: Metadata = createPageMetadata("Image Lab", description, "/playground/image-lab");

export default function Page() {
  return (
    <>
      <JsonLd data={createWebPageJsonLd("Image Lab", description, "/playground/image-lab")} />
      <PlaygroundDetailHeading
        kind="Tool"
        index="04"
        title="Image Lab"
        description="Shrink it, resize it, or change its format. The image stays on your device while your browser does the work."
      />
      <ImageLab />
    </>
  );
}
