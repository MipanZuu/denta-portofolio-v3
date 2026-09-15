"use client";

import { useMemo, useState } from "react";

type Mode = "portion" | "ratio" | "change";
const labels: Record<Mode, [string, string]> = { portion: ["Percentage", "Number"], ratio: ["Part", "Whole"], change: ["Starting value", "New value"] };

export function PercentageHelperTool() {
  const [mode, setMode] = useState<Mode>("portion");
  const [first, setFirst] = useState("20");
  const [second, setSecond] = useState("150");
  const result = useMemo(() => {
    const a = Number(first), b = Number(second);
    if (!Number.isFinite(a) || !Number.isFinite(b)) return "Add two numbers";
    const value = mode === "portion" ? (a / 100) * b : mode === "ratio" ? (b === 0 ? NaN : (a / b) * 100) : (a === 0 ? NaN : ((b - a) / Math.abs(a)) * 100);
    if (!Number.isFinite(value)) return "Cannot divide by zero";
    return `${new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(value)}${mode === "portion" ? "" : "%"}`;
  }, [first, mode, second]);
  return (
    <article className="playground-panel percentage-helper">
      <div className="percentage-modes" role="group" aria-label="Calculation type">
        <button className={mode === "portion" ? "is-active" : ""} onClick={() => setMode("portion")}>Percent of</button><button className={mode === "ratio" ? "is-active" : ""} onClick={() => setMode("ratio")}>Part as percent</button><button className={mode === "change" ? "is-active" : ""} onClick={() => setMode("change")}>Percentage change</button>
      </div>
      <div className="percentage-fields"><label><span>{labels[mode][0]}</span><input type="number" value={first} onChange={(event) => setFirst(event.target.value)} /></label><label><span>{labels[mode][1]}</span><input type="number" value={second} onChange={(event) => setSecond(event.target.value)} /></label></div>
      <div className="percentage-result" aria-live="polite"><small>Answer</small><strong>{result}</strong></div>
    </article>
  );
}
