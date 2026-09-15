import type { ReactNode } from "react";
import { PlaygroundSidebar } from "@/components/playground/playground-sidebar";
import { PlaygroundBuildNote } from "@/components/playground/playground-build-note";

export default function PlaygroundLayout({ children }: { children: ReactNode }) {
  return (
    <main className="route-page playground-page">
      <section className="section playground-section">
        <div className="page-shell playground-route-layout">
          <PlaygroundSidebar />
          <div className="playground-route-content">
            {children}
            <PlaygroundBuildNote />
          </div>
        </div>
      </section>
    </main>
  );
}
