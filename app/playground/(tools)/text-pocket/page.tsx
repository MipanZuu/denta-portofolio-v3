import type { Metadata } from "next";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { TextPocketTool } from "@/components/playground/tools/text-pocket-tool";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Count, clean, and change the case of text locally with Text Pocket.";
export const metadata: Metadata = createPageMetadata("Text Pocket Tool", description, "/playground/text-pocket");
export default function Page() { return <><JsonLd data={createWebPageJsonLd("Text Pocket Tool", description, "/playground/text-pocket")} /><PlaygroundDetailHeading kind="Tool" index="01" title="Text Pocket" description="Clean up a draft without sending a single character anywhere." /><TextPocketTool /></>; }
