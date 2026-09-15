import type { Metadata } from "next";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { JsonToolkit } from "@/components/playground/tools/json-toolkit";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Format, minify, validate, sort, and copy JSON locally in your browser.";

export const metadata: Metadata = createPageMetadata(
  "JSON Toolkit",
  description,
  "/playground/json-toolkit",
);

export default function Page() {
  return (
    <>
      <JsonLd data={createWebPageJsonLd("JSON Toolkit", description, "/playground/json-toolkit")} />
      <PlaygroundDetailHeading
        kind="Tool"
        index="04"
        title="JSON Toolkit"
        description="Paste a payload, tidy it up, check what broke, or squeeze it onto one line. Your JSON never leaves this page."
      />
      <JsonToolkit />
    </>
  );
}
