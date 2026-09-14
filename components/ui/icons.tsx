type IconProps = { className?: string };

const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function ArrowUpRight({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="M7 17 17 7M7 7h10v10" /></svg>;
}

export function MenuIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="M5 8h14M5 16h14" /></svg>;
}

export function CloseIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="m6 6 12 12M18 6 6 18" /></svg>;
}

export function DownloadIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></svg>;
}

export function MailIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6" /></svg>;
}
