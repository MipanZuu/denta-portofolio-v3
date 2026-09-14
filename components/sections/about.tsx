import { education } from "@/statics/education";
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
          <div><span>Currently</span><strong>{education[0].type}</strong><p>{education[0].subject}<br />{education[0].school}</p></div>
          <div><span>Outside work</span><div className="hobby-list">{hobbies.map((hobby) => <small key={hobby.name} title={hobby.note}>{hobby.name}</small>)}</div></div>
        </div>
      </div>
    </section>
  );
}
