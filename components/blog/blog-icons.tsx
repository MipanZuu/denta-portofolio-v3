type IconProps = { className?: string; filled?: boolean };

const shared = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function HeartIcon({ className, filled }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared} fill={filled ? "currentColor" : "none"}><path d="M20.8 4.7a5.6 5.6 0 0 0-7.9 0L12 5.6l-.9-.9a5.6 5.6 0 0 0-7.9 7.9l.9.9L12 21l7.9-7.5.9-.9a5.6 5.6 0 0 0 0-7.9Z" /></svg>;
}

export function CommentIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.7 9.7 0 0 1-3.8-.8L3 21l1.7-4.7A8.6 8.6 0 1 1 21 11.5Z" /></svg>;
}

export function SendIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="m22 2-7 20-4-9-9-4 20-7Z" /><path d="M22 2 11 13" /></svg>;
}

export function EyeIcon({ className }: IconProps) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" {...shared}><path d="M2.2 12s3.5-6 9.8-6 9.8 6 9.8 6-3.5 6-9.8 6-9.8-6-9.8-6Z" /><circle cx="12" cy="12" r="2.6" /></svg>;
}
