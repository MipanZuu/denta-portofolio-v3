import type { Metadata } from "next";
import { QuickSignalGame } from "@/components/playground/games/quick-signal-game";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Play Quick Signal, a twenty-second reaction game by Denta Bramasta.";
export const metadata: Metadata = createPageMetadata("Quick Signal Game", description, "/playground/quick-signal");
export default function Page() { return <><JsonLd data={createWebPageJsonLd("Quick Signal Game", description, "/playground/quick-signal")} /><PlaygroundDetailHeading kind="Game" index="01" title="Quick Signal" description="Twenty seconds. Sixteen squares. Catch the one that lights up." /><QuickSignalGame /></>; }
