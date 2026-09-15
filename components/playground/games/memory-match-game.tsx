"use client";

import { useEffect, useState } from "react";

const marks = ["◆", "●", "▲", "■", "✦", "✚", "⬟", "◎"];
const orderedDeck = marks.flatMap((mark) => [mark, mark]);
const shuffle = () => [...orderedDeck].sort(() => Math.random() - 0.5);

export function MemoryMatchGame() {
  const [deck, setDeck] = useState(orderedDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (open.length !== 2) return;
    const [first, second] = open;
    const timer = window.setTimeout(() => {
      if (deck[first] === deck[second]) setMatched((current) => [...current, deck[first]]);
      setOpen([]);
    }, 550);
    return () => window.clearTimeout(timer);
  }, [deck, open]);

  const start = () => { setDeck(shuffle()); setOpen([]); setMatched([]); setMoves(0); setPlaying(true); };
  const choose = (index: number) => {
    if (!playing || open.length === 2 || open.includes(index) || matched.includes(deck[index])) return;
    setOpen((current) => [...current, index]);
    setMoves((current) => current + (open.length === 1 ? 1 : 0));
  };
  const complete = matched.length === marks.length;

  return (
    <article className="playground-panel">
      <div className="memory-status"><span>Moves <strong>{moves}</strong></span><span>Pairs <strong>{matched.length}/{marks.length}</strong></span></div>
      <div className="memory-grid" aria-label="Memory match board">
        {deck.map((mark, index) => {
          const revealed = open.includes(index) || matched.includes(mark);
          return <button key={`${index}-${mark}`} type="button" className={revealed ? "is-revealed" : ""} disabled={!playing || complete} onClick={() => choose(index)} aria-label={revealed ? `Revealed ${mark}` : `Hidden tile ${index + 1}`}><span>{revealed ? mark : "?"}</span></button>;
        })}
      </div>
      <div className="signal-footer"><p aria-live="polite">{complete ? `All pairs found in ${moves} moves.` : playing ? "Remember what you reveal." : "Shuffle the tiles when you are ready."}</p><button type="button" onClick={start}>{playing ? "Shuffle again" : "Start game"}</button></div>
    </article>
  );
}
