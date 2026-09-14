import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/icons";
import { experiences } from "@/statics/experience";
import { projects } from "@/statics/projects";
import { technologyGroups } from "@/statics/technologies";
import { personal } from "@/statics/personal";

export function HomePaths() {
  const technologyCount = technologyGroups.reduce((total, group) => total + group.items.length, 0);
  return <>
    <section className="home-story page-shell">
      <p className="home-story-label"><span>01</span> A little about me</p>
      <div className="home-story-copy">
        <h2>I turn complex systems into products that feel <em>clear, useful, and human.</em></h2>
        <div><p>{personal.about}</p><Link href="/about">More about me <ArrowUpRight /></Link></div>
      </div>
      <div className="home-story-stats" aria-label="Portfolio overview">
        <p>By the numbers</p>
        <div><strong>{projects.length}</strong><span>Selected projects</span></div>
        <div><strong>{experiences.length}</strong><span>Professional roles</span></div>
        <div><strong>{technologyCount}</strong><span>Tools in the kit</span></div>
      </div>
    </section>

    <section className="home-featured" id="selected-work">
      <div className="page-shell">
        <div className="home-section-heading"><p><span>02</span>Selected work</p><h2>Things I&apos;ve<br/>brought to life.</h2><Link href="/projects">All projects <ArrowUpRight /></Link></div>
        <div className="home-project-grid">{projects.slice(0, 3).map((project, index) => <Link className="home-project" href="/projects" key={project.title}>
          <div><Image src={project.image} alt="" fill sizes="(max-width: 800px) 88vw, 31vw"/><span>0{index + 1}</span></div>
          <div className="home-project-meta"><h3>{project.title}</h3><p>{project.description}</p><small>{project.stack.slice(0, 3).join(" · ")}</small></div>
        </Link>)}</div>
      </div>
    </section>

    <section className="home-next page-shell">
      <p><span>03</span> Beyond the work</p>
      <h2>Good products come from curiosity, collaboration, and care for the details.</h2>
      <div className="home-path-grid">
        <Link href="/about"><span>About me</span><p>The story, education, and interests behind the work.</p><ArrowUpRight /></Link>
        <Link href="/experience"><span>Experience</span><p>The roles that shaped how I solve and communicate.</p><ArrowUpRight /></Link>
        <Link href="/technologies"><span>Technologies</span><p>The languages, frameworks, and tools I work with.</p><ArrowUpRight /></Link>
      </div>
    </section>

    <section className="home-contact">
      <div className="page-shell"><p><span className="availability-dot"/>Open to meaningful collaborations</p><h2>Have an idea?<br/><em>Let&apos;s build it.</em></h2><Link href="/contact">Start a conversation <ArrowUpRight /></Link></div>
    </section>
  </>;
}
