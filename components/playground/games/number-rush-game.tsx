"use client";

import { FormEvent, useEffect, useState } from "react";

type Question = { left: number; right: number; answer: number; sign: string };
const makeQuestion = (): Question => {
  const left = 2 + Math.floor(Math.random() * 18);
  const right = 2 + Math.floor(Math.random() * 12);
  const multiply = Math.random() > 0.62;
  return { left, right, sign: multiply ? "×" : "+", answer: multiply ? left * right : left + right };
};

export function NumberRushGame() {
  const [question, setQuestion] = useState<Question>({ left: 8, right: 4, sign: "+", answer: 12 });
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [time, setTime] = useState(30);
  const [playing, setPlaying] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setTime((current) => {
      if (current <= 1) { window.clearInterval(timer); setPlaying(false); return 0; }
      return current - 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [playing, runId]);

  const start = () => { setQuestion(makeQuestion()); setAnswer(""); setScore(0); setStreak(0); setTime(30); setRunId((value) => value + 1); setPlaying(true); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!playing || answer === "") return;
    if (Number(answer) === question.answer) { setScore((value) => value + 1); setStreak((value) => value + 1); }
    else setStreak(0);
    setAnswer(""); setQuestion(makeQuestion());
  };

  return (
    <article className="playground-panel number-rush">
      <div className="signal-stats"><div><small>Score</small><strong>{score}</strong></div><div><small>Time</small><strong>{time}s</strong></div><div><small>Streak</small><strong>{streak}</strong></div></div>
      <form onSubmit={submit}>
        <p aria-label={`${question.left} ${question.sign} ${question.right}`}>{question.left} <span>{question.sign}</span> {question.right}</p>
        <label><span>Your answer</span><input type="number" inputMode="numeric" value={answer} disabled={!playing} onChange={(event) => setAnswer(event.target.value)} autoFocus /></label>
        <button type="submit" disabled={!playing || answer === ""}>Check</button>
      </form>
      <div className="signal-footer"><p aria-live="polite">{playing ? "Correct answers grow your streak." : time === 0 ? `Time. Final score: ${score}.` : "Thirty seconds of friendly number chaos."}</p><button type="button" onClick={start}>{time === 0 ? "Play again" : playing ? "Restart" : "Start game"}</button></div>
    </article>
  );
}
