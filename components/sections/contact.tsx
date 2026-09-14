import { ArrowUpRight, MailIcon } from "@/components/ui/icons";
import { contact } from "@/statics/contact";

export function Contact() {
  return <section className="contact-section" id="contact"><div className="page-shell contact-inner">
    <p className="contact-kicker"><span className="availability-dot" />Open to ideas, projects, and conversations</p>
    <h2>Have something<br />in mind? <em>Let&apos;s talk.</em></h2>
    <a className="email-link" href={`mailto:${contact.email}`}><MailIcon />{contact.email}<ArrowUpRight /></a>
  </div></section>;
}
