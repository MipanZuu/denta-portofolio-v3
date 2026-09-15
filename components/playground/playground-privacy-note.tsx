export function PlaygroundPrivacyNote() {
  return (
    <aside className="playground-privacy-note" aria-label="Playground privacy note">
      <div className="playground-privacy-mark" aria-hidden="true"><ShieldCheck /><small>LOCAL</small></div>
      <div className="playground-privacy-copy">
        <strong>Your stuff stays yours.</strong>
        <p>Photos, text, and files are handled inside this browser. Nothing you add here is uploaded to my server. A game may keep a high score on this device, because forgetting your personal best would be rude.</p>
      </div>
      <ul aria-label="Privacy details"><li><span>Browser</span><strong>Processed here</strong></li><li><span>Server</span><strong>Gets nothing</strong></li><li><span>Game scores</span><strong>Local only</strong></li></ul>
    </aside>
  );
}
import { ShieldCheck } from "lucide-react";
