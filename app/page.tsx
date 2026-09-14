import { HomePaths } from "@/components/sections/home-paths";
import { InteractiveHero } from "@/components/sections/interactive-hero";
import { JsonLd } from "@/components/seo/json-ld";
import { createWebPageJsonLd, seo } from "@/statics/seo";

export default function Home() {
  return (
    <main>
      <JsonLd data={createWebPageJsonLd(seo.title, seo.description, "")} />
      <InteractiveHero />
      <HomePaths />
    </main>
  );
}
