import Image from "next/image";
import { ArrowUpRight, DownloadIcon } from "@/components/ui/icons";
import { personal } from "@/statics/personal";

export function Hero() {
  return (
    <section className="hero page-shell" id="top">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="hero-eyebrow"><span className="availability-dot" />{personal.eyebrow}</p>
          <h1>I craft digital<br />experiences with<br /><em>intent.</em></h1>
          <p className="hero-intro">{personal.intro}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore my work <ArrowUpRight /></a>
            <a className="button button-ghost" href={personal.resume} target="_blank">Résumé <DownloadIcon /></a>
          </div>
        </div>

        <div className="portrait-wrap">
          <div className="portrait-frame">
            <Image src={personal.portrait} alt="Portrait of Denta Bramasta" fill priority sizes="(max-width: 768px) 86vw, 38vw" />
            <div className="portrait-overlay" />
            <span className="portrait-caption">Developer<br />Designer<br />Problem solver</span>
          </div>
          <div className="orbit-badge"><span>Available for work · Available for work · </span><b>↗</b></div>
        </div>
      </div>
      <div className="hero-footer"><span>Scroll to discover</span><span className="scroll-line" /><span>Selected portfolio · 2026</span></div>
    </section>
  );
}
