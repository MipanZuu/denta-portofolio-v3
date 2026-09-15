"use client";

import { useEffect, useState } from "react";

type GamePhase = "idle" | "playing" | "finished";
const GAME_SECONDS = 20;
const GRID_SIZE = 16;

function nextCell(previous: number) {
  let next = Math.floor(Math.random() * GRID_SIZE);
  while (next === previous) next = Math.floor(Math.random() * GRID_SIZE);
  return next;
}

export function QuickSignalGame() {
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [activeCell, setActiveCell] = useState(5);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    try {
      const saved = Number(localStorage.getItem("quick-signal-best"));
      if (Number.isFinite(saved) && saved > 0) queueMicrotask(() => setBest(saved));
    } catch { /* Storage is optional. */ }
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    const timer = window.setInterval(() => setTimeLeft((current) => {
      if (current <= 1) { window.clearInterval(timer); setPhase("finished"); return 0; }
      return current - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [phase, runId]);

  useEffect(() => {
    if (phase !== "finished" || score <= best) return;
    queueMicrotask(() => setBest(score));
    try { localStorage.setItem("quick-signal-best", String(score)); } catch { /* Storage is optional. */ }
  }, [best, phase, score]);

  const start = () => { setScore(0); setTimeLeft(GAME_SECONDS); setActiveCell(nextCell(activeCell)); setRunId((value) => value + 1); setPhase("playing"); };
  const choose = (index: number) => {
    if (phase !== "playing") return;
    if (index === activeCell) { setScore((value) => value + 1); setActiveCell(nextCell(activeCell)); }
    else setScore((value) => Math.max(0, value - 1));
  };

  const message = phase === "idle" ? "Start the clock, then catch the bright square." : phase === "finished" ? `Time. You caught ${score} signal${score === 1 ? "" : "s"}.` : "Signal is live. Wrong taps cost one point.";
  return (
    <article className="playground-panel playground-game">
      <div className="signal-stats"><div><small>Score</small><strong>{score}</strong></div><div><small>Time</small><strong>{timeLeft}s</strong></div><div><small>Best</small><strong>{best}</strong></div></div>
      <div className={`signal-grid ${phase === "playing" ? "is-playing" : ""}`}>
        {Array.from({ length: GRID_SIZE }, (_, index) => {
          const active = phase === "playing" && index === activeCell;
          return <button className={active ? "is-signal" : ""} type="button" key={index} disabled={phase !== "playing"} aria-label={active ? "Signal. Press to score" : `Empty cell ${index + 1}`} onClick={() => choose(index)}><span aria-hidden="true" /></button>;
        })}
      </div>
      <div className="signal-footer"><p aria-live="polite">{message}</p><button type="button" onClick={start}>{phase === "finished" ? "Play again" : phase === "playing" ? "Restart" : "Start game"}</button></div>
    </article>
  );
}
