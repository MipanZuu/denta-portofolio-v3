import { DocsShell } from "@/components/docs/docs-shell";
import docs from "@/statics/docs-microservices.json";

export default function MicroservicesDocsLayout({ children }: { children: React.ReactNode }) {
  return <main className="route-page docs-page"><DocsShell groups={docs.groups} guideSlug="microservices" guideTitle="Microservices guide">{children}</DocsShell></main>;
}
