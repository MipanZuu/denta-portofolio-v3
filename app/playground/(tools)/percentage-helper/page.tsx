import type { Metadata } from "next";
import { PercentageHelperTool } from "@/components/playground/tools/percentage-helper-tool";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Calculate percentages, ratios, and percentage change with a simple browser tool.";
export const metadata: Metadata = createPageMetadata("Percentage Helper", description, "/playground/percentage-helper");
export default function Page() { return <><JsonLd data={createWebPageJsonLd("Percentage Helper", description, "/playground/percentage-helper")} /><PlaygroundDetailHeading kind="Tool" index="05" title="Percentage Helper" description="For discounts, bills, reports, and all the times the formula disappears from your head." /><PercentageHelperTool /></>; }
