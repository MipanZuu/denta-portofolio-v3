import type { Metadata } from "next";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { requireAdmin } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog studio", robots: { index: false, follow: false } };

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const user = await requireAdmin();
  return <main className="dashboard-shell page-shell"><DashboardNav email={user.email} /><div className="dashboard-workspace">{children}</div></main>;
}
