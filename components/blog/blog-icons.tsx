import { Heart, MessageCircle, Send, Eye } from "lucide-react";

type IconProps = { className?: string; filled?: boolean };

export function HeartIcon({ className, filled }: IconProps) {
  return <Heart className={className} fill={filled ? "currentColor" : "none"} aria-hidden="true" />;
}
export function CommentIcon({ className }: IconProps) {
  return <MessageCircle className={className} aria-hidden="true" />;
}
export function SendIcon({ className }: IconProps) {
  return <Send className={className} aria-hidden="true" />;
}
export function EyeIcon({ className }: IconProps) {
  return <Eye className={className} aria-hidden="true" />;
}
