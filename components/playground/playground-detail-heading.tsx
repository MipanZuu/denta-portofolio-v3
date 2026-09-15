import { PlaygroundPrivacyNote } from "@/components/playground/playground-privacy-note";

export function PlaygroundDetailHeading({ kind, index, title, description }: { kind: "Game" | "Tool"; index: string; title: string; description: string }) {
  return (
    <header className="playground-detail-heading">
      <span>{kind} / {index}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <PlaygroundPrivacyNote />
    </header>
  );
}
