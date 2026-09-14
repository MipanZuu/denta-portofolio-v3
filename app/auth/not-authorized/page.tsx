import Link from "next/link";

export default function NotAuthorizedPage() {
  return <main className="dashboard-auth page-shell"><section><p className="eyebrow">Private workspace</p><h1>Access unavailable.</h1><p>This dashboard is reserved for the portfolio owner.</p><Link className="button button-primary" href="/">Return home</Link></section></main>;
}
