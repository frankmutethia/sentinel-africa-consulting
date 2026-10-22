import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import conferenceAsset from "@/assets/sentinel-conference.jpg.asset.json";
import speakerAsset from "@/assets/sentinel-speaker.jpg.asset.json";
import awardAsset from "@/assets/sentinel-award.jpg.asset.json";
import awardsGroupAsset from "@/assets/sentinel-awards-group.jpg.asset.json";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title: "Sentinel Africa Consulting — Risk Management Advisory",
      },
      {
        name: "description",
        content:
          "Sentinel Africa Consulting is a pioneering force in risk management advisory — information security, data privacy, business continuity and enterprise risk, across Africa and beyond.",
      },
      {
        property: "og:title",
        content: "Sentinel Africa Consulting — Risk Management Advisory",
      },
      {
        property: "og:description",
        content:
          "Steering the conversations that build better-run organizations. Information security, data privacy, business continuity and enterprise risk advisory across Africa and beyond.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/* ------------------------------------------------------------------ */
/*  Brand mark                                                         */
/* ------------------------------------------------------------------ */

function SentinelMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" fill="none" className={className} aria-hidden="true">
      <path
        d="M18 2.5 31 8v9.2c0 7.9-5.6 13.4-13 16.3C10.6 30.6 5 25.1 5 17.2V8L18 2.5Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M18 10.5c2.2 0 4 1.8 4 4v3.2a4 4 0 1 1-8 0v-3.2c0-2.2 1.8-4 4-4Z"
        fill="var(--color-signal)"
      />
      <path
        d="M12.5 19.8 16.6 24l7-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <a
      href="#top"
      className={`flex items-center gap-2.5 ${
        dark ? "text-primary-foreground" : "text-primary"
      }`}
    >
      <SentinelMark />
      <span className="font-display text-lg font-semibold leading-none tracking-tight">
        Sentinel
        <span className="block text-[0.6rem] font-medium tracking-[0.28em] uppercase opacity-70">
          Africa Consulting
        </span>
      </span>
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Who we are", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Practice areas", href: "#practice" },
  { label: "Clients", href: "#clients" },
  { label: "Testimonials", href: "#testimonials" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <div className={scrolled ? "" : "drop-shadow-sm"}>
          <Wordmark />
        </div>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`link-sweep text-sm font-medium transition-colors ${
                scrolled
                  ? "text-foreground hover:text-primary"
                  : "text-primary-foreground/90 hover:text-primary-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-signal/30"
          >
            Free Call Back
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-border/60 lg:hidden"
        >
          <span
            className={`h-0.5 w-5 bg-current transition-transform duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            } ${scrolled ? "" : "text-primary-foreground"}`}
          />
          <span
            className={`h-0.5 w-5 bg-current transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            } ${scrolled ? "" : "text-primary-foreground"}`}
          />
          <span
            className={`h-0.5 w-5 bg-current transition-transform duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            } ${scrolled ? "" : "text-primary-foreground"}`}
          />
        </button>
      </div>

      <div
        className={`overflow-hidden border-border bg-background/95 backdrop-blur-xl transition-all duration-500 lg:hidden ${
          open ? "max-h-96 border-t" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-signal px-5 py-2.5 text-center text-sm font-semibold text-primary"
          >
            Free Call Back
          </a>
        </nav>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

const HERO_STATS = [
  { value: "10+", label: "Years of advisory" },
  { value: "4", label: "ISO standards" },
  { value: "6", label: "Practice areas" },
  { value: "2", label: "Continents served" },
];

function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen flex-col overflow-hidden bg-ink">
      <div className="absolute inset-0" aria-hidden="true">
        <img
          src={conferenceAsset.url}
          alt=""
          className="hero-drift h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pt-32 pb-16 sm:px-8">
        <p
          className="rise-in mb-6 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-signal"
          style={{ animationDelay: "150ms" }}
        >
          <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-signal" />
          Risk Management Advisory · Africa &amp; Beyond
        </p>

        <h1 className="max-w-3xl font-display text-5xl font-semibold leading-[1.04] text-primary-foreground sm:text-6xl lg:text-7xl">
          <span className="rise-in block" style={{ animationDelay: "300ms" }}>
            Steering the conversations
          </span>
          <span className="rise-in block" style={{ animationDelay: "450ms" }}>
            that build{" "}
            <span className="relative whitespace-nowrap text-signal">
              better-run
              <svg
                viewBox="0 0 240 12"
                className="draw-rule absolute -bottom-1 left-0 h-3 w-full"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9 C 60 3, 180 3, 238 8"
                  stroke="var(--color-signal)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </span>
          </span>
          <span className="rise-in block" style={{ animationDelay: "600ms" }}>
            organizations
          </span>
        </h1>

        <p
          className="rise-in mt-7 max-w-xl text-lg leading-relaxed text-primary-foreground/70"
          style={{ animationDelay: "750ms" }}
        >
          We debunk misconceptions and redefine risk management as a strategic
          enabler — unlocking opportunities for growth and resilience.
        </p>

        <div className="rise-in mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "900ms" }}>
          <a
            href="#services"
            className="rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-signal/30"
          >
            Explore our services
          </a>
          <a
            href="#contact"
            className="rounded-full border border-primary-foreground/25 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:border-primary-foreground/60 hover:bg-primary-foreground/10"
          >
            Request a free call back
          </a>
        </div>
      </div>

      <div className="relative border-t border-primary-foreground/10">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-5 py-10 sm:px-8 lg:grid-cols-4">
          {HERO_STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="rise-in lg:border-l lg:border-primary-foreground/10 lg:pl-8"
              style={{ animationDelay: `${1050 + i * 120}ms` }}
            >
              <dt className="font-display text-3xl font-semibold text-signal sm:text-4xl">
                {stat.value}
              </dt>
              <dd className="mt-1 text-sm text-primary-foreground/60">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Alliances marquee                                                  */
/* ------------------------------------------------------------------ */

const ALLIANCES = ["ICT Authority", "NITA Uganda", "KnowBe4", "Excelledia", "PECB Certified"];

function Alliances() {
  const items = [...ALLIANCES, ...ALLIANCES];
  return (
    <section aria-label="Alliances" className="border-b border-border bg-background py-10">
      <p className="mb-6 text-center text-[0.68rem] font-semibold tracking-[0.3em] uppercase text-muted-foreground">
        Trusted alliances &amp; accreditations
      </p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-20 pr-20">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-xl font-semibold whitespace-nowrap text-foreground/35 transition-colors hover:text-foreground/70"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Who we are                                                         */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="bg-background py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src={speakerAsset.url}
              alt="Sentinel Africa consultant speaking at the Kenya RE Summit"
              className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
          <div className="absolute -bottom-10 -right-4 hidden w-56 overflow-hidden rounded-2xl border-4 border-background shadow-2xl sm:block lg:-right-10 lg:w-64">
            <img
              src={awardAsset.url}
              alt="Sentinel Africa receiving an award at the CIOs Summit 2025 in Lusaka, Zambia"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          <div className="absolute -top-5 -left-5 -z-10 h-full w-full rounded-3xl border-2 border-signal/40" />
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-signal">
              <span className="h-px w-8 bg-signal" />
              Who we are
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl">
              A pioneering force in risk management advisory
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-7 leading-relaxed text-muted-foreground">
              Welcome to Sentinel Africa Consulting. Our founders — seasoned
              practitioners of risk management — witnessed the
              misunderstandings and untapped potential in this critical
              discipline. Motivated by the desire to transform organizations,
              they set out to teach and spread the gospel of effective risk
              management. Thus, Sentinel Africa was born.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              We debunk misconceptions and redefine risk management as a
              strategic enabler. Our approach is participatory — we
              collaboratively explore your unique risk landscape and develop
              tailored solutions, empowering individuals from all walks of life
              to navigate uncertainty with confidence.
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              With a proven track record across Africa and beyond, we embed
              robust frameworks that align with your organization&apos;s goals —
              cultivating a culture of risk intelligence and informed
              decision-making.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <blockquote className="mt-8 border-l-2 border-signal pl-5 font-display text-lg font-medium text-primary">
              As you explore our website, we hope you discover the qualities
              that set us apart — an outstanding service provider and an
              exceptional place to build a career.
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services (ISO standards)                                           */
/* ------------------------------------------------------------------ */

const SERVICES = [
  {
    index: "01",
    standard: "ISO 27701",
    title: "Data Protection & Privacy",
    body: "A Privacy Information Management System that keeps personal data handled lawfully, transparently and securely — from mapping flows to certification readiness.",
  },
  {
    index: "02",
    standard: "ISO 27001",
    title: "Information Security Management",
    body: "An Information Security Management System that protects your most valuable currency — people, processes and technology — against an evolving threat landscape.",
  },
  {
    index: "03",
    standard: "ISO 22301",
    title: "Business Continuity Management",
    body: "A BCMS that keeps your organization running through disruption — impact analysis, continuity strategies and rehearsed response plans.",
  },
  {
    index: "04",
    standard: "ISO 31000",
    title: "Enterprise Risk Management",
    body: "An ERM framework that turns risk into a strategic enabler — principled governance, risk appetite and intelligent decision-making at every level.",
  },
];

function Services() {
  return (
    <section id="services" className="bg-muted/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-signal">
            <span className="h-px w-8 bg-signal" />
            Services
            <span className="h-px w-8 bg-signal" />
          </p>
          <h2 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
            Frameworks that carry your organization forward
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            We implement, audit and certify against the standards the world
            trusts — tailored to your sector, size and risk appetite.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service, i) => (
            <Reveal key={service.index} delay={i * 100}>
              <article className="card-lift group flex h-full flex-col rounded-2xl border border-border bg-card p-7">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm font-semibold tracking-widest text-signal">
                    {service.index}
                  </span>
                  <span className="rounded-full bg-signal-soft px-3 py-1 text-[0.65rem] font-semibold tracking-wider uppercase text-ink-soft">
                    {service.standard}
                  </span>
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold leading-snug text-primary">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-soft transition-colors group-hover:text-signal">
                  Learn more
                  <svg
                    viewBox="0 0 16 16"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="M2 8h11M9 3.5 13.5 8 9 12.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Practice areas                                                     */
/* ------------------------------------------------------------------ */

const PRACTICE_AREAS = [
  {
    title: "Consultancy",
    body: "Bespoke advisory engagements that embed risk intelligence into how your organization decides and grows.",
    icon: (
      <path d="M8 10h8M8 14h5M4 4h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
    ),
  },
  {
    title: "Managed Services",
    body: "Ongoing stewardship of your risk and compliance function — frameworks maintained, audits orchestrated.",
    icon: (
      <path d="M12 3 4 7v5c0 5 3.4 8.4 8 9.5 4.6-1.1 8-4.5 8-9.5V7l-8-4ZM12 11v4M12 8.5v.5" />
    ),
  },
  {
    title: "Training",
    body: "PECB-aligned courses from awareness to Lead Auditor — practical, interactive and certification-ready.",
    icon: (
      <path d="M12 4 2 9l10 5 10-5-10-5ZM6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6" />
    ),
  },
  {
    title: "Cybershield",
    body: "Layered cyber resilience — posture assessments, awareness programs and incident readiness.",
    icon: (
      <path d="M12 3 5 6v5.5c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5V6l-7-3ZM9.5 12l1.8 1.8L14.8 10" />
    ),
  },
  {
    title: "Automation Tools",
    body: "Tooling that removes manual toil from compliance — evidence collection, risk registers and reporting.",
    icon: (
      <path d="M5 5h14v14H5V5ZM8 5V3m8 2V3M8 21v-2m8 2v-2M5 8H3m2 8H3m16-8h2m-2 8h2M9 12l2 2 4-4" />
    ),
  },
  {
    title: "Rwanda DPP Registration",
    body: "End-to-end registration support with Rwanda's data protection regulator — from gap analysis to submission.",
    icon: (
      <path d="M12 21c5-2 8-6 8-11V5l-8-3-8 3v5c0 5 3 9 8 11ZM8.5 11.5 11 14l4.5-4.5" />
    ),
  },
];

function Practice() {
  return (
    <section id="practice" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <Reveal className="max-w-xl">
            <p className="mb-4 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-signal">
              <span className="h-px w-8 bg-signal" />
              What we do
            </p>
            <h2 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
              Six ways we stand beside you
            </h2>
          </Reveal>
          <Reveal delay={120} className="max-w-md">
            <p className="leading-relaxed text-muted-foreground">
              Every engagement is participatory — we explore your unique risk
              landscape together and build solutions that fit how you work.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {PRACTICE_AREAS.map((area, i) => (
            <Reveal key={area.title} delay={(i % 3) * 100} className="h-full">
              <article className="group flex h-full flex-col bg-card p-8 transition-colors duration-300 hover:bg-muted/60">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-signal-soft text-ink-soft transition-colors duration-300 group-hover:bg-signal group-hover:text-primary">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {area.icon}
                  </svg>
                </div>
                <h3 className="mt-6 font-display text-lg font-semibold text-primary">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{area.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  On-stage / impact band                                             */
/* ------------------------------------------------------------------ */

function Impact() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-20">
        <div>
          <Reveal>
            <p className="mb-4 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-signal">
              <span className="h-px w-8 bg-signal" />
              On the continental stage
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl">
              Recognized where Africa&apos;s leaders gather
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-primary-foreground/70">
              From the CIOs Summit 2025 in Lusaka to boardrooms across the
              continent, Sentinel Africa steers the conversations shaping how
              organizations govern risk — and is honored for it.
            </p>
            <p className="mt-8 flex items-center gap-3 text-sm font-medium text-signal">
              <span className="pulse-dot inline-block h-2 w-2 rounded-full bg-signal" />
              CIOs Summit 2025 · Lusaka, Zambia · 18–21 November
            </p>
          </Reveal>
        </div>

        <Reveal delay={150} className="relative">
          <div className="overflow-hidden rounded-3xl">
            <img
              src={awardsGroupAsset.url}
              alt="Award recipients on stage at the CIOs Summit 2025 in Lusaka, Zambia"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 -z-10 h-full w-full rounded-3xl border-2 border-signal/40" />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Clients                                                            */
/* ------------------------------------------------------------------ */

const CLIENTS = [
  { name: "KEMRI", detail: "Kenya Medical Research Institute" },
  { name: "IPSL", detail: "Institute of Professional Studies" },
  { name: "TechHouse", detail: "Powering Innovation" },
  { name: "RSSB", detail: "Rwanda Social Security Board" },
  { name: "Amal Bank", detail: "Banking & Finance" },
];

function Clients() {
  return (
    <section id="clients" className="border-b border-border bg-background py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-signal">
            <span className="h-px w-8 bg-signal" />
            Clients
            <span className="h-px w-8 bg-signal" />
          </p>
          <h2 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
            Organizations that trust the Sentinel
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-3 lg:grid-cols-5">
          {CLIENTS.map((client, i) => (
            <Reveal key={client.name} delay={i * 80} className="h-full">
              <div className="flex h-full min-h-36 flex-col items-center justify-center bg-card px-6 py-10 text-center transition-colors duration-300 hover:bg-muted/60">
                <span className="font-display text-xl font-semibold text-foreground/80">
                  {client.name}
                </span>
                <span className="mt-1.5 text-xs text-muted-foreground">{client.detail}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */

const TESTIMONIALS = [
  {
    quote:
      "I would like to thank Sentinel Africa for successfully taking us through the PECB ISO 27001 certification. The training was exhaustive — we were able to get fully certified as Lead Auditors with PECB.",
    author: "PECB Certified Lead Auditor",
    context: "ISO 27001 Certification",
  },
  {
    quote:
      "I enrolled in Sentinel's ISO 27001 Lead Implementer course, and it was an incredibly practical and interactive experience. The course provided a clear roadmap for establishing an ISMS from the ground up to completion.",
    author: "ISMS Lead Implementer",
    context: "ISO 27001 Training",
  },
  {
    quote:
      "Having worked on my company's Information Security Management System based on ISO 27001/2, I needed to get certified to distinguish myself as a Lead Implementer and Lead Auditor. Sentinel Africa helped me achieve exactly that.",
    author: "Information Security Manager",
    context: "Lead Auditor Certification",
  },
];

function Testimonials() {
  return (
    <section id="testimonials" className="bg-muted/50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-signal">
            <span className="h-px w-8 bg-signal" />
            Client testimonials
            <span className="h-px w-8 bg-signal" />
          </p>
          <h2 className="font-display text-4xl font-semibold text-primary sm:text-5xl">
            In their own words
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((item, i) => (
            <Reveal key={item.author} delay={i * 120} className="h-full">
              <figure className="card-lift flex h-full flex-col rounded-2xl border border-border bg-card p-8">
                <svg
                  viewBox="0 0 24 24"
                  className="h-8 w-8 text-signal/60"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H6.5A2.5 2.5 0 0 1 10 7.5V7Zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-3.5A2.5 2.5 0 0 1 21 7.5V7Z" />
                </svg>
                <blockquote className="mt-5 flex-1 leading-relaxed text-muted-foreground">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-7 border-t border-border pt-5">
                  <p className="font-display text-sm font-semibold text-primary">{item.author}</p>
                  <p className="mt-0.5 text-xs tracking-wide text-muted-foreground">
                    {item.context}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact CTA                                                        */
/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-primary py-24 sm:py-32">
      <div
        className="absolute inset-0 opacity-[0.07]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--color-primary-foreground) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="mb-4 flex items-center gap-3 text-[0.7rem] font-semibold tracking-[0.3em] uppercase text-signal">
            <span className="h-px w-8 bg-signal" />
            Get started
          </p>
          <h2 className="font-display text-4xl font-semibold leading-tight text-primary-foreground sm:text-5xl">
            Wondering where or how to start?
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-primary-foreground/70">
            Request a free call back. Our consultants will advise you and help
            you get started — no obligation, no jargon.
          </p>
        </Reveal>

        <Reveal delay={150}>
          <form
            className="rounded-3xl border border-primary-foreground/10 bg-ink-soft/60 p-7 backdrop-blur-sm sm:p-9"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid gap-5">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold tracking-wider uppercase text-primary-foreground/60">
                  Your name
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="Jane Njeri"
                  className="w-full rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:border-signal focus:ring-2 focus:ring-signal/30 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold tracking-wider uppercase text-primary-foreground/60">
                  Phone number
                </span>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+254 …"
                  className="w-full rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/30 focus:border-signal focus:ring-2 focus:ring-signal/30 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold tracking-wider uppercase text-primary-foreground/60">
                  I&apos;m interested in
                </span>
                <select
                  name="service"
                  defaultValue=""
                  className="w-full appearance-none rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3 text-sm text-primary-foreground focus:border-signal focus:ring-2 focus:ring-signal/30 focus:outline-none"
                >
                  <option value="" disabled className="text-foreground">
                    Choose a service
                  </option>
                  {SERVICES.map((s) => (
                    <option key={s.index} value={s.standard} className="text-foreground">
                      {s.standard} — {s.title}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className="mt-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-signal/30"
              >
                Request a free call back
              </button>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="bg-ink py-16 text-primary-foreground/70">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Wordmark dark />
            <p className="mt-6 max-w-xs text-sm leading-relaxed">
              Trusted advisors in data privacy &amp; protection — steering
              important conversations that build better-run organizations,
              in Africa and beyond.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.25em] uppercase text-primary-foreground/50">
              Navigate
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-signal">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#contact" className="transition-colors hover:text-signal">
                  Free call back
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.25em] uppercase text-primary-foreground/50">
              Standards
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {SERVICES.map((s) => (
                <li key={s.index}>
                  <a href="#services" className="transition-colors hover:text-signal">
                    {s.standard} · {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-primary-foreground/10 pt-8 text-xs">
          <p>© 2026 Sentinel Africa Consulting. All rights reserved.</p>
          <p className="tracking-[0.2em] uppercase">In Africa and Beyond</p>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Alliances />
        <About />
        <Services />
        <Practice />
        <Impact />
        <Clients />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Index;
