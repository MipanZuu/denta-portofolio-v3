import { hobbies } from "@/statics/hobbies";
import { personal } from "@/statics/personal";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  BedDouble,
  Bike,
  BookOpen,
  Camera,
  Code2,
  CookingPot,
  Footprints,
  Lightbulb,
  Plane,
} from "lucide-react";

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
      <SectionHeading
        index="01"
        eyebrow="About"
        title="Hi, I’m Denta.\nI make things work."
        copy="Usually with too many tabs open and something cooking in the background."
      />
      <div className="about-grid">
        <div className="about-lead about-orbit-card">
          <span>A quick hello</span>
          <div className="about-identity-orbit" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <p>{personal.about}</p>
          <small>{personal.funLine}</small>
        </div>
        <div className="about-details">
          <div className="about-detail-card">
            <span>What I care about</span>
            <strong>Useful ideas, carefully made</strong>
            <p>
              I like turning complicated systems into products that feel calm,
              clear, and enjoyable to use.
            </p>
          </div>
          <div className="about-detail-card">
            <span>When the laptop closes</span>
            <ul className="hobby-list">
              {hobbies.map((hobby) => {
                const Icon = hobbyIcons[hobby.icon];
                return (
                  <li key={hobby.name} title={hobby.note}>
                    <b aria-hidden="true">
                      <Icon />
                    </b>
                    <small>{hobby.name}</small>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
