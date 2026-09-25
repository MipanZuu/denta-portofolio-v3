"use client";

import { ArrowDown, Check, CheckCircle2, Copy, ExternalLink, GitBranch } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Block = { id: string; title: string; paragraphs?: string[]; list?: string[]; note?: string; codeLabel?: string; code?: string };
type Source = { label: string; href: string };

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }
  return <div className="docs-code"><div className="docs-code-bar"><span>{label}</span><button onClick={copy} type="button">{copied ? <Check /> : <Copy />}{copied ? "Copied" : "Copy"}</button></div><pre><code>{code}</code></pre></div>;
}

function DiagramBlock({ label, code }: { label: string; code: string }) {
  const lines = code.split("\n").slice(1).filter(Boolean);
  const nodes = new Map<string, string>();
  const edges: Array<{ from: string; to: string; label?: string }> = [];

  for (const line of lines) {
    for (const match of line.matchAll(/\b([A-Z])(?:\[\((.*?)\)\]|\[([^\]]+)\]|\{([^}]+)\})/g)) {
      nodes.set(match[1], match[2] ?? match[3] ?? match[4] ?? match[1]);
    }
    const edge = line.match(/^\s*([A-Z])(?:\[\(?.*?\)?\]|\{.*?\})?\s*-->\s*(?:\|([^|]+)\|\s*)?([A-Z])/);
    if (edge) edges.push({ from: edge[1], to: edge[3], label: edge[2] });
  }

  const ranks = new Map<string, number>();
  for (const edge of edges) {
    if (!ranks.has(edge.from)) ranks.set(edge.from, 0);
    if (!ranks.has(edge.to)) ranks.set(edge.to, (ranks.get(edge.from) ?? 0) + 1);
  }
  for (const key of nodes.keys()) if (!ranks.has(key)) ranks.set(key, 0);
  const groups = [...nodes.entries()].reduce<Array<Array<{ id: string; title: string }>>>((result, [id, title]) => {
    const rank = ranks.get(id) ?? 0;
    (result[rank] ??= []).push({ id, title });
    return result;
  }, []).filter(Boolean);

  return <figure className="docs-flow" aria-label={`${label} diagram`}>
    <figcaption><GitBranch /><span>{label.replace(/^Mermaid\s*[—-]\s*/i, "Interactive diagram · ")}</span><small>Follow each layer</small></figcaption>
    <div className="docs-flow-space">
      {groups.map((group, rank) => {
        const connectorLabels = [...new Set(edges.filter((edge) => (ranks.get(edge.to) ?? 0) === rank + 1 && edge.label).map((edge) => edge.label))];
        return <div className="docs-flow-level-wrap" key={group.map((node) => node.id).join("-")}>
          <div className="docs-flow-level">{group.map((node) => <div className="docs-flow-node" key={node.id}><small>{node.id}</small><strong>{node.title}</strong></div>)}</div>
          {rank < groups.length - 1 && <div className="docs-flow-connector"><ArrowDown />{connectorLabels.map((text) => <span key={text}>{text}</span>)}</div>}
        </div>;
      })}
    </div>
  </figure>;
}

export function DocsArticle({ section, sources, previous, next, guideName = "Next.js", basePath = "/docs/nextjs" }: {
  section: { id: string; number: string; title: string; summary: string; blocks: Block[] };
  sources: Source[];
  previous?: { id: string; title: string };
  next?: { id: string; title: string };
  guideName?: string;
  basePath?: string;
}) {
  const [complete, setComplete] = useState(false);
  const [checkpointOpen, setCheckpointOpen] = useState(false);
  const guideSlug = basePath.split("/").filter(Boolean).at(-1) ?? "nextjs";
  const storageKey = `docs-progress:${guideSlug}`;
  const readingMinutes = useMemo(() => {
    const words = [section.summary, ...section.blocks.flatMap((block) => [block.title, ...(block.paragraphs ?? []), ...(block.list ?? []), block.note ?? ""])].join(" ").trim().split(/\s+/).length;
    return Math.max(5, Math.ceil(words / 180));
  }, [section]);

  function saveProgress(markComplete: boolean, updateState = true) {
    let saved: { completed?: string[]; lastRead?: string } = {};
    try { saved = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}"); } catch {}
    const completed = new Set(Array.isArray(saved.completed) ? saved.completed : []);
    if (markComplete) completed.add(section.id);
    window.localStorage.setItem(storageKey, JSON.stringify({ completed: [...completed], lastRead: section.id, updatedAt: Date.now() }));
    if (updateState) setComplete(completed.has(section.id));
    window.dispatchEvent(new Event("docs-progress-change"));
  }

  useEffect(() => {
    let saved: { completed?: string[] } = {};
    try { saved = JSON.parse(window.localStorage.getItem(storageKey) ?? "{}"); } catch {}
    let autoCompleted = Array.isArray(saved.completed) && saved.completed.includes(section.id);
    const stateFrame = window.requestAnimationFrame(() => {
      setComplete(autoCompleted);
      saveProgress(false, false);
    });
    const onScroll = () => {
      const article = document.querySelector<HTMLElement>(".docs-route-article");
      if (!article) return;
      const bounds = article.getBoundingClientRect();
      const travelled = window.innerHeight - bounds.top;
      if (!autoCompleted && travelled / Math.max(article.offsetHeight, 1) >= .9) {
        autoCompleted = true;
        saveProgress(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(stateFrame);
      window.removeEventListener("scroll", onScroll);
    };
    // The chapter ID is the persistence boundary; saveProgress intentionally stays local.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.id, storageKey]);

  return <div className="docs-article-grid">
    <article className="docs-route-article">
      <header className="docs-route-hero"><span>Chapter {section.number} / {guideName}</span><h1>{section.title}</h1><p>{section.summary}</p><div className="docs-chapter-meta"><small>{readingMinutes} min focused read</small><button type="button" className={complete ? "is-complete" : ""} onClick={() => saveProgress(true)}><CheckCircle2 />{complete ? "Completed" : "Mark complete"}</button></div></header>
      {section.blocks.map((block) => <section className="docs-topic" id={block.id} key={block.id}>
        <h2>{block.title}</h2>
        {block.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {block.list && <ul>{block.list.map((item) => <li key={item}>{item}</li>)}</ul>}
        {block.code && (block.codeLabel?.toLowerCase().startsWith("mermaid")
          ? <DiagramBlock label={block.codeLabel} code={block.code} />
          : <CodeBlock label={block.codeLabel ?? "Example"} code={block.code} />)}
        {block.note && <aside className="docs-note"><strong>Keep in orbit</strong><p>{block.note}</p></aside>}
      </section>)}
      <section className="docs-checkpoint">
        <span>Chapter checkpoint</span><h2>Can you explain “{section.title}” without reaching for the API reference?</h2>
        <p>Describe the main trade-off, one failure mode, and the decision you would make in a real project.</p>
        <button type="button" onClick={() => setCheckpointOpen((value) => !value)}>{checkpointOpen ? "Hide reflection" : "Reveal reflection prompt"}</button>
        {checkpointOpen && <aside><strong>Try this:</strong> explain the idea to a teammate in three sentences, then connect it to one system you have already built. If the trade-off is still vague, revisit the chapter before continuing.</aside>}
      </section>
      <nav className="docs-chapter-pagination" aria-label="Adjacent chapters">
        {previous ? <Link href={`${basePath}/${previous.id}`}><small>Previous</small><strong>{previous.title}</strong></Link> : <span />}
        {next ? <Link href={`${basePath}/${next.id}`}><small>Next</small><strong>{next.title}</strong></Link> : <span />}
      </nav>
      <footer className="docs-sources"><span>Resources</span><h2>Go deeper with the official documentation</h2><div>{sources.map((source) => <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>{source.label}<ExternalLink /></a>)}</div></footer>
    </article>
    <aside className="docs-page-toc"><span>On this page</span><strong>{section.title}</strong><nav>{section.blocks.map((block) => <a href={`#${block.id}`} key={block.id}>{block.title}</a>)}</nav></aside>
  </div>;
}
