import { hobbies } from "@/statics/hobbies";
import { personal } from "@/statics/personal";
import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
  return (
    <section className="section page-shell" id="about">
      <SectionHeading index="01" eyebrow="About" title="Curious by nature.\nPractical by choice." />
      <div className="about-grid">
        <p className="about-lead">{personal.about}</p>
        <div className="about-details">
          <div><span>Currently</span><strong>{personal.currentCompany.role}</strong><p>Building digital products at <a className="text-link" href={personal.currentCompany.url} target="_blank" rel="noreferrer">{personal.currentCompany.name}</a><br />Eindhoven, Netherlands</p></div>
          <div><span>Outside work</span><div className="hobby-list">{hobbies.map((hobby) => <small key={hobby.name} title={hobby.note}>{hobby.name}</small>)}</div></div>
        </div>
      </div>
    </section>
  );
}
