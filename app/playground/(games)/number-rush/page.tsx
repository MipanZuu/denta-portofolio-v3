import type { Metadata } from "next";
import { NumberRushGame } from "@/components/playground/games/number-rush-game";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Play Number Rush, a quick thirty-second mental maths game by Denta Bramasta.";
export const metadata: Metadata = createPageMetadata("Number Rush Game", description, "/playground/number-rush");
export default function Page() { return <><JsonLd data={createWebPageJsonLd("Number Rush Game", description, "/playground/number-rush")} /><PlaygroundDetailHeading kind="Game" index="03" title="Number Rush" description="A quick maths sprint for anyone who enjoys beating the clock." /><NumberRushGame /></>; }
