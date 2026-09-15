import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import Link from "next/link";
import { personal } from "@/statics/personal";

export function BlogAuthor({ date, linked = true }: { date: string; linked?: boolean }) {
  const content = <><span className="blog-avatar"><Image src="/images/logo.png" alt="" width={48} height={48} /></span><span className="blog-author-copy"><strong>{personal.fullName}<b aria-label="Portfolio author"><BadgeCheck /></b></strong><small>Software Engineer · {date}</small></span></>;
  return linked ? <Link className="blog-author" href="/about">{content}</Link> : <div className="blog-author">{content}</div>;
}
