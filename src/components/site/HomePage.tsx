import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  LockKeyhole,
  Phone,
  Quote,
  ShieldCheck,
  Target,
  RefreshCw,
} from "lucide-react";
import { initials, type ServiceIcon } from "@/content/homepage";
import { TestimonialSubmission } from "./TestimonialSubmission";
import { FormattedText } from "./FormattedText";
import { homepage } from "@/content/homepageDemo";
import { Alliances, Clients } from "./BrandSections";
import { servicePages, toolPages } from "./navigation";
import { Reveal } from "./Reveal";
import { SiteFooter } from "./SiteFooter";
import { WhatsAppWidget } from "./WhatsAppWidget";
import { SiteHeader } from "./SiteHeader";
import "@/website.css";

const safeDestination = (url: string | undefined, fallback: string) =>
  url && /^(https?:\/\/|\/(?!\/)|#)/i.test(url) ? url : fallback;
const { hero, about, contact } = homepage;
const services = homepage.services.items;
const testimonials = homepage.testimonials.items;

const serviceIcons: Record<ServiceIcon, typeof ShieldCheck> = {
  shield: ShieldCheck,
  lock: LockKeyhole,
  refresh: RefreshCw,
  target: Target,
};

const practiceAreas = [
  ...servicePages.map((page) => page.label),
  ...toolPages.map((tool) => tool.interest),
];

/** A dropdown choice passed from another page as `?interest=…` (see contactLink). */
function interestFromUrl() {
  const requested = new URLSearchParams(window.location.search).get("interest") ?? "";
  const choices: string[] = [...services.map((service) => service.title), ...practiceAreas];
  return choices.includes(requested) ? requested : "";
}

function Hero({ onTraining }: { onTraining: () => void }) {
  return (
    <section id="top" className="editorial-hero" aria-labelledby="hero-title">
      <div className="hero-grid-pattern" aria-hidden="true" />
      <div className="site-container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-enter">
            <span className="status-dot" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero-enter">
            {hero.headline.replace(/ \S+$/, "")}
            <br className="desktop-break" /> {hero.headline.match(/\S+$/)?.[0]}
            <br />
            <span>{hero.highlight}</span>
            <br />
            {hero.headlineEnd}
            <span className="hero-period">.</span>
          </h1>
          <p className="hero-description hero-enter">{hero.intro}</p>
          <div className="hero-actions hero-enter">
            <a
              href={safeDestination(hero.primaryHref, "#contact")}
              className="button"
              onClick={onTraining}
            >
              {hero.primaryButton} <ArrowUpRight size={18} />
            </a>
            <a href={safeDestination(hero.secondaryHref, "#services")} className="text-link">
              {hero.secondaryButton} <ArrowRight size={17} />
            </a>
          </div>
          <div className="hero-proof hero-enter">
            <span className="proof-number">
              {hero.statValue}
              <span>+</span>
            </span>
            <span>
              {hero.statLabel}
              <br />
              <strong>{hero.statStrong}</strong>
            </span>
          </div>
        </div>
        <div className="hero-visual hero-enter">
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-photo-frame">
            {hero.mediaType === "video" && hero.videoUrl ? (
              <video
                src={safeDestination(hero.videoUrl, "")}
                poster={hero.videoPoster || hero.image}
                controls
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <img
                src={hero.image}
                alt={hero.imageAlt}
                fetchPriority="high"
                width="1200"
                height="800"
              />
            )}
            <div className="photo-caption">
              <span className="status-dot" />
              {hero.imageCaption}
            </div>
          </div>
          <div className="hero-side-label" aria-hidden="true">
            {hero.sideLabel}
          </div>
          <div className="certification-panel">
            <span className="certification-icon">
              <ShieldCheck size={27} strokeWidth={1.4} />
            </span>
            <div>
              <p className="tiny-label">{hero.certificationTitle}</p>
              <p>
                {hero.certifications.map((item, index) => (
                  <span key={item.standard} className="certification-item">
                    {index > 0 && <i />}
                    {item.standard} <span>{item.system}</span>
                  </span>
                ))}
              </p>
              <span className="certification-note">{hero.certificationNote}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="site-container hero-bottom">
        <span>{hero.bottomLine}</span>
        <a href="#alliances">
          Discover Sentinel <ArrowDown size={15} />
        </a>
      </div>
    </section>
  );
}

function About() {
  if (about.body !== undefined)
    return (
      <section id="about" className="about-section section-space" aria-labelledby="about-title">
        <div className="site-container">
          <p className="eyebrow">Who we are</p>
          <h2 id="about-title">{about.title}</h2>
          <div style={{ maxWidth: 850, marginTop: 24 }}>
            <FormattedText text={about.body} />
          </div>
        </div>
      </section>
    );
  return (
    <section id="about" className="about-section section-space" aria-labelledby="about-title">
      <div className="site-container about-layout">
        <Reveal className="about-visual">
          <div className="about-photo">
            <img src={about.photo} alt={about.photoAlt} loading="lazy" width="800" height="1000" />
          </div>
          <div className="about-inset">
            <img src={about.inset} alt={about.insetAlt} loading="lazy" />
            <span>{about.insetCaption}</span>
          </div>
          <div className="about-index">
            <span>01 /</span> WHO WE ARE
          </div>
        </Reveal>
        <div className="about-copy">
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 id="about-title">
              {about.title}
              <br />
              <span className="blue-text">{about.accent}</span>
            </h2>
            <p className="section-lead">{about.lead}</p>
          </Reveal>
          <Reveal delay={100}>
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>
          <Reveal delay={180}>
            <div className="about-principles">
              {about.principles.map((principle) => (
                <span key={principle}>
                  <Check size={16} />
                  {principle}
                </span>
              ))}
            </div>
            <p className="about-closing">{about.closing}</p>
            <a href="#services" className="text-link">
              {about.linkLabel} <ArrowUpRight size={17} />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Services({ onSelect }: { onSelect: (service: string) => void }) {
  return (
    <section
      id="services"
      className="services-section section-space"
      aria-labelledby="services-title"
    >
      <div className="site-container">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">{homepage.services.eyebrow}</p>
            <h2 id="services-title">
              {homepage.services.title}
              <br />
              <span className="blue-text">{homepage.services.accent}</span>
            </h2>
          </div>
          <p>{homepage.services.intro}</p>
        </Reveal>
        <div className="services-grid">
          {services.map((service, index) => {
            const Icon = serviceIcons[service.icon] ?? ShieldCheck;
            return (
              <Reveal key={service.title} delay={(index % 2) * 100}>
                <article className="service-panel">
                  <div className="service-top">
                    <span className="service-icon">
                      <Icon size={28} strokeWidth={1.35} />
                    </span>
                    <span className="standard-label">{service.standard}</span>
                    <span className="service-number">0{index + 1}</span>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="service-detail">{service.detail}</span>
                  <a
                    href="#contact"
                    className="service-link"
                    onClick={() => onSelect(service.title)}
                    aria-label={`Discuss ${service.title}`}
                  >
                    {homepage.services.linkLabel} <ArrowUpRight size={20} />
                  </a>
                </article>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <div className="practice-strip">
            <p>{homepage.services.stripLabel}</p>
            <div>
              {servicePages.map((page) => (
                <a key={page.href} href={page.href}>
                  {page.label}
                  <ArrowUpRight size={13} />
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact({
  interest,
  onSelect,
}: {
  interest: string;
  onSelect: (service: string) => void;
}) {
  const [notice, setNotice] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Hello Sentinel Africa,\n\nI would like to request a free callback.\n\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nInterested in: ${interest}\n\nThank you.`;
    window.location.href = `mailto:${contact.recipient}?subject=${encodeURIComponent("Free callback request — " + interest)}&body=${encodeURIComponent(body)}`;
    setNotice(true);
  }
  return (
    <section id="contact" className="contact-section section-space" aria-labelledby="contact-title">
      <div className="contact-orbit" aria-hidden="true" />
      <div className="site-container contact-layout">
        <Reveal>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 id="contact-title">
            {contact.title}
            <br />
            with a <span>{contact.accent}</span>
          </h2>
          <p className="contact-description">{contact.intro}</p>
          <div className="contact-reassurance">
            {contact.reassurances.map((item) => (
              <span key={item}>
                <Check size={16} />
                {item}
              </span>
            ))}
          </div>
          <a className="contact-phone" href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}>
            <span>
              <Phone size={19} />
            </span>
            <div>
              <small>{contact.phoneLabel}</small>
              <strong>
                {contact.phone} <ArrowUpRight size={15} />
              </strong>
            </div>
          </a>
        </Reveal>
        <Reveal delay={150}>
          <form className="callback-form" onSubmit={handleSubmit}>
            <div className="form-heading">
              <h3>{contact.formTitle}</h3>
              <ArrowUpRight size={25} />
            </div>
            <p>{contact.formIntro}</p>
            <label htmlFor="callback-name">
              Your name
              <input
                id="callback-name"
                name="name"
                autoComplete="name"
                placeholder="Full name"
                required
              />
            </label>
            <label htmlFor="callback-phone">
              Phone number
              <input
                id="callback-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="e.g. +254 700 000 000"
                required
              />
            </label>
            <label htmlFor="callback-service">
              I’m interested in
              <div className="select-wrap">
                <select
                  id="callback-service"
                  name="service"
                  required
                  value={interest}
                  onChange={(event) => onSelect(event.target.value)}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  <optgroup label="Our services">
                    {services.map((service) => (
                      <option key={service.title}>{service.title}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Ways to work with us">
                    {practiceAreas.map((area) => (
                      <option key={area}>{area}</option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </div>
            </label>
            <button type="submit" className="button">
              Request my callback <ArrowUpRight size={18} />
            </button>
            <p className="form-note">
              Opens your email app with your callback request ready to send.
            </p>
            {notice && (
              <p className="form-status" role="status">
                Send the prepared email to complete your request. You can also call us on +254 715
                484888.
              </p>
            )}
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section
      id="testimonials"
      className="testimonials-section section-space"
      aria-labelledby="testimonials-title"
    >
      <div className="site-container">
        <Reveal className="section-heading">
          <div>
            <p className="eyebrow">{homepage.testimonials.eyebrow}</p>
            <h2 id="testimonials-title">
              {homepage.testimonials.title}
              <br />
              <span className="blue-text">{homepage.testimonials.accent}</span>
            </h2>
          </div>
          <div className="testimonial-invitation">
            <p>{homepage.testimonials.intro}</p>
            <TestimonialSubmission />
          </div>
        </Reveal>
        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <Reveal key={item.name} delay={(index % 2) * 100}>
              <figure className="testimonial-panel">
                <Quote size={32} strokeWidth={1.25} aria-hidden="true" />
                <blockquote>{item.quote}</blockquote>
                <figcaption>
                  <span className="testimonial-avatar" aria-hidden="true">
                    {initials(item.name)}
                  </span>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.role}</span>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [interest, setInterest] = useState(interestFromUrl);
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);
  return (
    <div className="sentinel-site">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero onTraining={() => setInterest("Training")} />
        <Alliances />
        <About />
        <Services onSelect={setInterest} />
        <Contact interest={interest} onSelect={setInterest} />
        <Clients />
        <Testimonials />
      </main>
      <SiteFooter />
      <WhatsAppWidget />
    </div>
  );
}
