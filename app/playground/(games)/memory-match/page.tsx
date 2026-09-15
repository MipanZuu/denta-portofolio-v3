import type { Metadata } from "next";
import { MemoryMatchGame } from "@/components/playground/games/memory-match-game";
import { PlaygroundDetailHeading } from "@/components/playground/playground-detail-heading";
import { JsonLd } from "@/components/seo/json-ld";
import { createPageMetadata, createWebPageJsonLd } from "@/statics/seo";

const description = "Play Memory Match, a relaxed browser card-pair game by Denta Bramasta.";
export const metadata: Metadata = createPageMetadata("Memory Match Game", description, "/playground/memory-match");
export default function Page() { return <><JsonLd data={createWebPageJsonLd("Memory Match Game", description, "/playground/memory-match")} /><PlaygroundDetailHeading kind="Game" index="02" title="Memory Match" description="Find eight matching pairs with as few moves as you can." /><MemoryMatchGame /></>; }
