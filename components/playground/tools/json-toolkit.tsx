"use client";

import { useMemo, useState } from "react";

const starterJson = `{
  "hello": "world",
  "useful": true,
  "numbers": [3, 1, 2]
}`;

type JsonError = { message: string; line?: number; column?: number; excerpt?: string };

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([first], [second]) => first.localeCompare(second))
        .map(([key, nestedValue]) => [key, sortKeys(nestedValue)]),
    );
  }
  return value;
}

function inspectError(error: unknown, input: string): JsonError {
  const message = error instanceof Error ? error.message : "That JSON could not be parsed.";
  const positionMatch = message.match(/position\s+(\d+)/i);
  const locationMatch = message.match(/line\s+(\d+)\s+column\s+(\d+)/i);
  let line = locationMatch ? Number(locationMatch[1]) : undefined;
  let column = locationMatch ? Number(locationMatch[2]) : undefined;

  if (positionMatch) {
    const position = Number(positionMatch[1]);
    const before = input.slice(0, position);
    line = before.split("\n").length;
    column = position - before.lastIndexOf("\n");
  }

  return { message, line, column, excerpt: line ? input.split("\n")[line - 1]?.trim() : undefined };
}

export function JsonToolkit() {
  const [input, setInput] = useState(starterJson);
  const [output, setOutput] = useState(starterJson);
  const [copyLabel, setCopyLabel] = useState("Copy result");

  const inspection = useMemo(() => {
    if (!input.trim()) return { parsed: undefined, error: null };
    try {
      return { parsed: JSON.parse(input) as unknown, error: null };
    } catch (error) {
      return { parsed: undefined, error: inspectError(error, input) };
    }
  }, [input]);

  const valid = Boolean(input.trim()) && !inspection.error;
  const transform = (mode: "format" | "minify" | "sort") => {
    if (!valid) return;
    const value = mode === "sort" ? sortKeys(inspection.parsed) : inspection.parsed;
    setOutput(JSON.stringify(value, null, mode === "minify" ? 0 : 2));
    setCopyLabel("Copy result");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopyLabel("Copied!");
      window.setTimeout(() => setCopyLabel("Copy result"), 1500);
    } catch {
      setCopyLabel("Copy failed");
    }
  };

  return (
    <article className="playground-panel json-toolkit">
      <div className="json-toolkit-actions" aria-label="JSON actions">
        <button type="button" className="is-primary" disabled={!valid} onClick={() => transform("format")}>Format</button>
        <button type="button" disabled={!valid} onClick={() => transform("minify")}>Minify</button>
        <button type="button" disabled={!valid} onClick={() => transform("sort")}>Sort keys</button>
        <button type="button" disabled={!output} onClick={copy}>{copyLabel}</button>
        <button type="button" className="is-clear" onClick={() => { setInput(""); setOutput(""); setCopyLabel("Copy result"); }}>Clear</button>
      </div>

      <div className="json-toolkit-editors">
        <label>
          <span>Input</span>
          <textarea spellCheck={false} value={input} onChange={(event) => setInput(event.target.value)} placeholder={'Paste JSON here, for example {"name":"Denta"}'} />
        </label>
        <label>
          <span>Result</span>
          <textarea spellCheck={false} value={output} readOnly placeholder="Your transformed JSON will appear here." />
        </label>
      </div>

      <div className={`json-toolkit-status ${inspection.error ? "is-error" : ""}`} role="status">
        <span aria-hidden="true">{inspection.error ? "!" : valid ? "✓" : "…"}</span>
        <div>
          <strong>{inspection.error ? "JSON needs a tiny repair" : valid ? "Valid JSON" : "Waiting for JSON"}</strong>
          <p>{inspection.error ? inspection.error.message : valid ? "The brackets are behaving. Pick an action above." : "Paste something between the braces and I’ll check it here in your browser."}</p>
          {inspection.error && (inspection.error.line || inspection.error.excerpt) ? (
            <small>
              {inspection.error.line ? `Line ${inspection.error.line}${inspection.error.column ? `, column ${inspection.error.column}` : ""}` : ""}
              {inspection.error.excerpt ? ` · ${inspection.error.excerpt}` : ""}
            </small>
          ) : null}
        </div>
      </div>

      <p className="json-toolkit-roadmap">Coming later: JSON to TypeScript and JSON to YAML. One bracket adventure at a time.</p>
    </article>
  );
}
