import type { Metadata } from "next";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { ShareSnap } from "@/components/playground/tools/sharesnap";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Preview how a link will look on social platforms and generate a downloadable Open Graph image in your browser.";

export const metadata: Metadata = createPageMetadata("ShareSnap Social Preview Generator", description, "/playground/sharesnap");

export default function Page() {
  return (
    <>
      <JsonLd data={createWebPageJsonLd("ShareSnap Social Preview Generator", description, "/playground/sharesnap")} />
      <PlaygroundDetailHeading kind="Tool" index="06" title="ShareSnap" description="Shape a social card before the internet gets to judge the crop. Preview the essentials, then export a clean 1200 × 630 Open Graph image." />
      <ShareSnap />
    </>
  );
}
