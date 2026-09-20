import { DocsShell } from "@/components/docs/docs-shell";
import docs from "@/statics/docs-next.json";

export default function NextjsDocsLayout({ children }: { children: React.ReactNode }) {
  return <main className="route-page docs-page"><DocsShell groups={docs.groups}>{children}</DocsShell></main>;
}
