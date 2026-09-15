import { hobbies } from "@/statics/hobbies";
import { personal } from "@/statics/personal";
import { SectionHeading } from "@/components/ui/section-heading";
import { BedDouble, Bike, BookOpen, Camera, Code2, CookingPot, Footprints, Lightbulb, Plane } from "lucide-react";

const hobbyIcons = {
  coding: Code2,
  running: Footprints,
  traveling: Plane,
  photography: Camera,
  cooking: CookingPot,
  sleeping: BedDouble,
  riding: Bike,
  learning: Lightbulb,
  reading: BookOpen,
};

export function About() {
  return (
    <section className="section page-shell" id="about">
      <SectionHeading index="01" eyebrow="About" title="Hi, I’m Denta.\nI make things work." copy="Usually with too many tabs open and something cooking in the background." />
      <div className="about-grid">
        <div className="about-lead"><span>A quick hello</span><p>{personal.about}</p><small>{personal.funLine}</small></div>
        <div className="about-details">
          <div><span>Currently</span><strong>{personal.currentCompany.role}</strong><p>Making multilingual websites faster, friendlier, and easier to grow at <a className="text-link" href={personal.currentCompany.url} target="_blank" rel="noreferrer">{personal.currentCompany.name}</a> in Eindhoven.</p></div>
          <div><span>When the laptop closes</span><ul className="hobby-list">{hobbies.map((hobby) => { const Icon = hobbyIcons[hobby.icon]; return <li key={hobby.name} title={hobby.note}><b aria-hidden="true"><Icon /></b><small>{hobby.name}</small></li>; })}</ul></div>
        </div>
      </div>
    </section>
  );
}
