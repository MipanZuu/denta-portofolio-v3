"use client";

import { usePathname } from "next/navigation";
import { playgroundBuildNotes } from "@/statics/playground-build-notes";

export function PlaygroundBuildNote() {
  const pathname = usePathname();
  const note = playgroundBuildNotes[pathname];
  if (!note) return null;

  return (
    <details className="playground-build-note">
      <summary>
        <span><small>Build notes</small><strong>Under the hood, without the lecture</strong></span>
        <span className="playground-build-note-toggle" aria-hidden="true">+</span>
      </summary>
      <div className="playground-build-note-body">
        <div className="playground-build-note-intro">
          <p>{note.intro}</p>
        </div>
        <div className="playground-build-note-copy">
          {note.sections.map((section, index) => <section key={section.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h2>{section.title}</h2><p>{section.body}</p></div></section>)}
        </div>
        {note.snippets?.length ? <div className="playground-code-notes">{note.snippets.map((snippet) => <figure className="playground-code-note" key={snippet.title}><figcaption><span>{snippet.label}</span><strong>{snippet.title}</strong></figcaption><pre><code>{snippet.code}</code></pre></figure>)}</div> : null}
      </div>
    </details>
  );
}
