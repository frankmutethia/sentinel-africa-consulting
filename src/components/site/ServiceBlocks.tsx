import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Bot,
  Briefcase,
  Check,
  FileCheck2,
  GraduationCap,
  Handshake,
  ShieldHalf,
  type LucideIcon,
} from "lucide-react";
import { servicePages } from "./navigation";
import { Reveal } from "./Reveal";
import "./services.css";

/** Eyebrow, two-tone heading and an optional note, as used across the site. */
export function SectionHeading({
  eyebrow,
  id,
  title,
  accent,
  note,
}: {
  eyebrow: string;
  id: string;
  title: ReactNode;
  accent?: ReactNode;
  note?: ReactNode;
}) {
  return (
    <Reveal className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>
          {title}
          {accent && (
            <>
              <br />
              <span className="blue-text">{accent}</span>
            </>
          )}
        </h2>
      </div>
      {note && <p>{note}</p>}
    </Reveal>
  );
}

/** Illustration shown beside the hero copy. */
export function HeroArt({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  return (
    <div className="svc-hero-art">
      <img src={src} alt={alt} width={width} height={height} />
    </div>
  );
}

export interface CardItem {
  title: string;
  text?: ReactNode;
  icon?: LucideIcon;
  image?: { src: string; alt: string };
  href?: string;
}

/** A responsive grid of cards. `columns` is the count on wide screens. */
export function CardGrid({ items, columns = 3 }: { items: CardItem[]; columns?: 2 | 3 | 4 | 5 }) {
  return (
    <ul className={`svc-card-grid svc-cols-${columns}`}>
      {items.map((item, index) => (
        <li key={item.title}>
          <Reveal delay={(index % columns) * 80} className="svc-card-reveal">
            <article className="svc-card">
              {item.image && (
                <div className="svc-card-image">
                  <img src={item.image.src} alt={item.image.alt} loading="lazy" />
                </div>
              )}
              <div className="svc-card-body">
                {item.icon && (
                  <span className="svc-card-icon">
                    <item.icon size={22} strokeWidth={1.5} />
                  </span>
                )}
                <h3>{item.title}</h3>
                {item.text && <div className="svc-card-text">{item.text}</div>}
                {item.href && (
                  <a href={item.href} className="svc-card-link">
                    Learn more <ArrowUpRight size={15} />
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function CheckList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="svc-checklist">
      {items.map((item, index) => (
        <li key={index}>
          <span aria-hidden="true">
            <Check size={14} strokeWidth={2.5} />
          </span>
          <div>{item}</div>
        </li>
      ))}
    </ul>
  );
}

/** Copy beside a photo or illustration; `reverse` puts the media first. */
export function MediaSplit({
  media,
  children,
  reverse = false,
}: {
  media: ReactNode;
  children: ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className={`svc-split ${reverse ? "is-reversed" : ""}`}>
      <Reveal className="svc-split-copy">{children}</Reveal>
      <Reveal delay={120} className="svc-split-media">
        {media}
      </Reveal>
    </div>
  );
}

const serviceIcons: Record<string, LucideIcon> = {
  Consultancy: Briefcase,
  "Managed Services": Handshake,
  Training: GraduationCap,
  Cybershield: ShieldHalf,
  "Automation Tools": Bot,
  "Rwanda DPP Registration": FileCheck2,
};

/** Links to the other service pages, shown at the end of each one. */
export function OtherServices({ current }: { current: string }) {
  return (
    <section className="svc-others" aria-labelledby="other-services-title">
      <div className="site-container">
        <div className="svc-others-head">
          <p className="eyebrow">Our services</p>
          <h2 id="other-services-title">Explore our other services</h2>
        </div>
        <ul className="svc-others-list">
          {servicePages
            .filter((page) => page.label !== current)
            .map((page) => {
              const Icon = serviceIcons[page.label] ?? Briefcase;
              return (
                <li key={page.href}>
                  <a href={page.href}>
                    <span className="svc-others-icon">
                      <Icon size={22} strokeWidth={1.6} aria-hidden="true" />
                    </span>
                    <strong>{page.label}</strong>
                    <ArrowUpRight size={18} aria-hidden="true" className="svc-others-arrow" />
                  </a>
                </li>
              );
            })}
        </ul>
      </div>
    </section>
  );
}
