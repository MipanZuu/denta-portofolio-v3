import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/statics/education";
import { experiences } from "@/statics/experience";

function TimelineRow({ number, title, subtitle, companyUrl, location, type, duration, highlights }: { number: string; title: string; subtitle: string; companyUrl?: string; location: string; type: string; duration: string; highlights?: string[] }) {
  return <article className={`timeline-row ${highlights ? "timeline-row-featured" : ""}`}><span className="timeline-number">{number}</span><div className="timeline-role"><h3>{title}</h3>{companyUrl ? <a href={companyUrl} target="_blank" rel="noreferrer">{subtitle} <ArrowUpRight aria-hidden="true" /></a> : <p>{subtitle}</p>}{highlights ? <ul>{highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : null}</div><div className="timeline-meta"><span>{location}</span><small>{type}</small></div><time>{duration}</time></article>;
}

export function Experience() {
  return <section className="section page-shell" id="experience">
    <SectionHeading index="02" eyebrow="Journey" title={"Experience built\nthrough doing."} copy="From product delivery to teaching, every role has sharpened the way I communicate and build." />
    <div className="timeline">{experiences.map((item, index) => <TimelineRow key={`${item.company}-${item.position}`} number={String(index + 1).padStart(2, "0")} title={item.position} subtitle={item.company} companyUrl={item.companyUrl} location={item.location} type={item.type} duration={item.duration} highlights={item.highlights} />)}</div>
    <div className="education-block"><h3>Education</h3><div className="education-grid">{education.map((item) => <article key={item.school}><span>{item.duration}</span><h4>{item.school}</h4><p>{item.subject} · {item.location}</p>{item.grade ? <strong className="education-grade"><span>GPA:</span><span>{item.grade}</span></strong> : null}<small>{item.type}</small></article>)}</div></div>
  </section>;
}
