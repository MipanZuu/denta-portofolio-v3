import Image from "next/image";
import { ArrowUpRight } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/statics/projects";

export function Projects() {
  return <section className="section page-shell projects-section" id="work">
    <SectionHeading index="03" eyebrow="Selected work" title={"Projects with\na point of view."} copy="A selection of university, freelance, and personal work spanning product interfaces and full-stack systems." />
    <div className="projects-grid">{projects.map((project, index) => <article className={`project-card project-card-${(index % 3) + 1}`} key={project.title}>
      <div className="project-image"><Image src={project.image} alt={`${project.title} interface preview`} fill sizes="(max-width: 768px) 92vw, 45vw" /><span className="project-index">{String(index + 1).padStart(2, "0")}</span>{(project.preview || project.source) ? <a href={project.preview ?? project.source} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><ArrowUpRight /></a> : null}</div>
      <div className="project-info"><div><h3>{project.title}</h3><p>{project.description}</p></div><ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul></div>
    </article>)}</div>
  </section>;
}
