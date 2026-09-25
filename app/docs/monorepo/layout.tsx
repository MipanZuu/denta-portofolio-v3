import { DocsShell } from "@/components/docs/docs-shell";
import docs from "@/statics/docs-monorepo.json";

export default function MonorepoDocsLayout({ children }: { children: React.ReactNode }) {
  return <main className="route-page docs-page"><DocsShell groups={docs.groups} guideSlug="monorepo" guideTitle="Monorepo guide">{children}</DocsShell></main>;
}
