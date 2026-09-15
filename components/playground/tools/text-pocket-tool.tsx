"use client";

import { useMemo, useState } from "react";

const cleanText = (value: string) => value.split("\n").map((line) => line.replace(/\s+/g, " ").trim()).join("\n").replace(/\n{3,}/g, "\n\n").trim();
const sentenceCase = (value: string) => value.toLocaleLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (_, prefix: string, letter: string) => `${prefix}${letter.toLocaleUpperCase()}`);
const titleCase = (value: string) => value.toLocaleLowerCase().replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());

export function TextPocketTool() {
  const [text, setText] = useState("");
  const [copyStatus, setCopyStatus] = useState("Copy text");
  const metrics = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return { words, characters: text.length, lines: text ? text.split(/\r?\n/).length : 0, readingTime: words ? Math.max(1, Math.ceil(words / 200)) : 0 };
  }, [text]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopyStatus("Copied"); window.setTimeout(() => setCopyStatus("Copy text"), 1500); }
    catch { setCopyStatus("Copy failed"); }
  };
  return (
    <article className="playground-panel playground-tool">
      <label className="text-pocket-input"><span>Your text</span><textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Paste a draft, message, notes, or anything else..." /></label>
      <div className="text-pocket-metrics"><div><strong>{metrics.words}</strong><small>Words</small></div><div><strong>{metrics.characters}</strong><small>Characters</small></div><div><strong>{metrics.lines}</strong><small>Lines</small></div><div><strong>{metrics.readingTime}</strong><small>Min read</small></div></div>
      <div className="text-pocket-actions"><button disabled={!text} onClick={() => setText(cleanText(text))}>Clean spacing</button><button disabled={!text} onClick={() => setText(sentenceCase(text))}>Sentence case</button><button disabled={!text} onClick={() => setText(titleCase(text))}>Title Case</button><button disabled={!text} onClick={() => setText(text.toLocaleUpperCase())}>UPPERCASE</button><button disabled={!text} onClick={() => setText(text.toLocaleLowerCase())}>lowercase</button><button className="is-primary" disabled={!text} onClick={copy}>{copyStatus}</button><button className="is-clear" disabled={!text} onClick={() => setText("")}>Clear</button></div>
    </article>
  );
}
