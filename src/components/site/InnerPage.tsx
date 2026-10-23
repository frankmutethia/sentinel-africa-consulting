import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { contactLink, homeSection } from "./navigation";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import "@/website.css";
import "./inner-page.css";

/** Header, main landmark and footer shared by every page other than the homepage. */
export function InnerPage({ children }: { children: ReactNode }) {
  return (
    <div className="sentinel-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader base="/" />
      <main id="main">{children}</main>
      <SiteFooter base="/" />
    </div>
  );
}

interface PageHeroProps {
  /** Breadcrumb labels between Home and the current page. */
  trail: string[];
  eyebrow: string;
  title: string;
  lead: ReactNode;
  actions?: ReactNode;
  /** Shown beside the copy on wide screens and below it on narrow ones. */
  aside: ReactNode;
}

export function PageHero({ trail, eyebrow, title, lead, actions, aside }: PageHeroProps) {
  return (
    <section id="top" className="page-hero" aria-labelledby="page-title">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="site-container page-hero-layout">
        <div className="page-hero-copy">
          <nav aria-label="Breadcrumb" className="page-breadcrumb">
            <a href={homeSection("/", "top")}>Home</a>
            {trail.map((crumb) => (
              <span key={crumb}>
                <span aria-hidden="true">/</span> {crumb}
              </span>
            ))}
            <span aria-current="page">
              <span aria-hidden="true">/</span> {title}
            </span>
          </nav>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id="page-title">{title}</h1>
          <div className="page-hero-lead">{lead}</div>
          {actions && <div className="page-hero-actions">{actions}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}

/** `interest` pre-selects that option in the homepage callback form. */
export function PageCta({ interest }: { interest?: string }) {
  return (
    <section className="page-cta" aria-labelledby="page-cta-title">
      <div className="site-container page-cta-layout">
        <div>
          <p className="eyebrow">Let’s move forward</p>
          <h2 id="page-cta-title">
            Your next step starts with a <span>conversation.</span>
          </h2>
        </div>
        <a href={contactLink(interest)} className="button">
          Request a free callback <ArrowUpRight size={18} />
        </a>
      </div>
    </section>
  );
}
