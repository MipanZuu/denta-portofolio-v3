import Link from "next/link";
import { playgroundGames, playgroundTools } from "@/statics/playground";

function OverviewGroup({ title, items }: { title: string; items: typeof playgroundGames }) {
  return (
    <section className="playground-overview-group">
      <header><span>{items[0]?.kind}</span><h2>{title}</h2></header>
      <div className="playground-overview-list">
        {items.map((item, index) => (
          <Link href={item.href} key={item.href}>
            <span className="playground-overview-index">{String(index + 1).padStart(2, "0")}</span>
            <span><strong>{item.title}</strong><small>{item.description}</small></span>
            <span className="playground-overview-arrow" aria-hidden="true">↗</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function PlaygroundOverview() {
  return <div className="playground-overview"><OverviewGroup title="Games" items={playgroundGames} /><OverviewGroup title="Tools" items={playgroundTools} /></div>;
}
