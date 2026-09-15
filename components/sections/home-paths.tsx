import Link from "next/link";
import { ProjectVisual } from "@/components/projects/project-visual";
import { HomePlayground } from "@/components/sections/home-playground";
import { ArrowUpRight } from "@/components/ui/icons";
import { experiences } from "@/statics/experience";
import { projects } from "@/statics/projects";
import { technologyGroups } from "@/statics/technologies";

export function HomePaths() {
  const technologyCount = technologyGroups.reduce((total, group) => total + group.items.length, 0);
  return <>
    <section className="home-snapshot page-shell" aria-label="Portfolio overview">
      <p>Explore the work behind the introduction.</p>
      <div><strong>{projects.length}</strong><span>Selected projects</span></div>
      <div><strong>{experiences.length}</strong><span>Professional roles</span></div>
      <div><strong>{technologyCount}</strong><span>Tools in the kit</span></div>
    </section>

    <HomePlayground />

    <section className="home-featured page-shell">
      <div className="home-section-heading"><p><span>02</span>Featured work</p><h2>A few things<br/>I&apos;ve brought to life.</h2><Link href="/projects">View every project <ArrowUpRight /></Link></div>
      <div className="home-project-grid">{projects.slice(0, 3).map((project, index) => <Link className="home-project" href="/projects" key={project.title}>
        <div className={project.image ? "" : "project-thumbnail-placeholder"}>
          <ProjectVisual image={project.image} title={project.title} sizes="(max-width: 800px) 92vw, 31vw" />
          <span className="home-project-index">0{index + 1}</span>
        </div>
        <h3>{project.title}</h3><p>{project.stack.slice(0, 3).join(" · ")}</p>
      </Link>)}</div>
    </section>

    <section className="home-next page-shell">
      <p>More than a list of technologies</p>
      <h2>I care about the reasoning,<br/>the collaboration, and the finish.</h2>
      <div className="home-path-grid">
        <Link href="/about"><span>About me</span><p>The story, education, and interests behind the work.</p><ArrowUpRight /></Link>
        <Link href="/experience"><span>Experience</span><p>The roles that shaped how I solve and communicate.</p><ArrowUpRight /></Link>
        <Link href="/technologies"><span>Technologies</span><p>The languages, frameworks, and tools I work with.</p><ArrowUpRight /></Link>
      </div>
    </section>

    <section className="home-contact">
      <div className="page-shell"><p><span className="availability-dot"/>Available for the right opportunity</p><h2>Let&apos;s make the next<br/>idea feel <em>inevitable.</em></h2><Link href="/contact">Start a conversation <ArrowUpRight /></Link></div>
    </section>
  </>;
}
