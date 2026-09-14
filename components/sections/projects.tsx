import Image from "next/image";
import { ArrowUpRight } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { projects } from "@/statics/projects";

export function Projects() {
  return (
    <section className="section page-shell projects-section" id="work">
      <SectionHeading
        index="03"
        eyebrow="Selected work"
        title={"Projects built\nwith purpose."}
        copy="A collection of university, freelance, and personal work—presented with the problem and thinking in focus."
      />

      <div className="projects-list">
        {projects.map((project, index) => (
          <article className="project-row" key={project.title}>
            <span className="project-index">{String(index + 1).padStart(2, "0")}</span>

            <div className="project-thumbnail">
              <Image
                src={project.image}
                alt={`${project.title} interface preview`}
                fill
                sizes="(max-width: 700px) 86vw, 280px"
              />
            </div>

            <div className="project-copy">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul>{project.stack.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>

            <div className="project-links">
              {project.preview ? <a href={project.preview} target="_blank" rel="noreferrer">Live preview <ArrowUpRight /></a> : null}
              {project.source ? <a href={project.source} target="_blank" rel="noreferrer">Source code <ArrowUpRight /></a> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
