import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { technologyGroups } from "@/statics/technologies";

export function Toolkit() {
  return <section className="section page-shell" id="toolkit">
    <SectionHeading index="04" eyebrow="Toolkit" title={"Tools change.\nThe craft stays."} copy="A growing set of technologies I use to move ideas from an empty canvas to a reliable product." />
    <div className="toolkit-groups">{technologyGroups.map((group, index) => <article className="toolkit-group" key={group.title}><header className="toolkit-group-heading"><span>{String(index + 1).padStart(2, "0")}</span><h3>{group.title}</h3><p>{group.description}</p></header><div className="toolkit-grid">{group.items.map((item) => <div className="tech-item" key={item.name}><span><Image src={item.image} alt="" width={44} height={44} /></span><p>{item.name}</p></div>)}</div></article>)}</div>
  </section>;
}
