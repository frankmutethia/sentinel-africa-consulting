import type { CSSProperties } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Coins,
  Eye,
  Landmark,
  LockKeyhole,
  RefreshCw,
  Shield,
  ShieldCheck,
  Store,
  Target,
  Users,
  UsersRound,
  Waypoints,
} from "lucide-react";
import heroArt from "@/assets/services/managed-hero.jpg";
import teamPhoto from "@/assets/services/managed-team.jpg";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { contactLink, servicePages } from "./navigation";
import { Reveal } from "./Reveal";
import { OtherServices, SectionHeading } from "./ServiceBlocks";
import "./managed-services.css";

const cybershieldPage = servicePages.find((page) => page.label === "Cybershield")!.href;

// The organizations named in the published introduction.
const audiences = [
  { name: "Corporates", icon: Building2 },
  { name: "SMEs", icon: Store },
  { name: "Ministries", icon: Landmark },
  { name: "Governments", icon: Landmark },
  { name: "Agencies", icon: UsersRound },
];

const benefits = [
  {
    title: "Expertise",
    icon: BadgeCheck,
    text: "By partnering with us, you gain access to a team of trained experts who will make your risk management programs effective. We provide the needed assurance to your stakeholders that your critical risks are being managed efficiently.",
  },
  {
    title: "Stability",
    icon: Users,
    text: "We manage people-related disruptions that may affect your key programs, ensuring staff availability and uninterrupted support.",
  },
  {
    title: "Visibility",
    icon: Eye,
    text: "With our services, you can have adequate visibility and tracking of your risk management progress, enabling you to assess where you stand and the improvements made over time.",
  },
  {
    title: "Cost Control",
    icon: Coins,
    text: "Our cost-effective solutions help you manage operational and administrative costs related to people and tools, allowing you to optimize your resources.",
  },
];

const capabilities = [
  {
    title: "Data Protection as a Service",
    icon: LockKeyhole,
    text: "We help you build and maintain a robust data protection framework, ensuring compliance with data privacy regulations.",
  },
  {
    title: "Information Security as a Service",
    icon: ShieldCheck,
    text: "Our experts design and implement comprehensive information security measures to protect your critical assets.",
  },
  {
    title: "Enterprise Risk as a Service",
    icon: Target,
    text: "We assist in developing and managing a holistic enterprise risk management approach, mitigating potential risks and enhancing organizational resilience.",
  },
  {
    title: "Business Continuity as a Service",
    icon: RefreshCw,
    text: "Our services include developing and maintaining business continuity plans to ensure your business can recover swiftly from disruptions.",
  },
];

const engagements = [
  {
    label: "Build",
    icon: Waypoints,
    text: "Develop or expand your risk function focused on our core disciplines info security, data protection, risk, and Business Continuity",
  },
  {
    label: "Augment",
    icon: UsersRound,
    text: "Augment existing resources especially where the growing needs of the organizational context demand it",
  },
];

export default function ManagedServicesPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Our Services"]}
        eyebrow="Retainers – Long-term Managed Consultancy Services"
        title="Managed Services"
        lead={
          <p>
            Welcome to our Managed Consultancy Services, where we understand the challenges faced by
            Corporates, SMEs, Ministries, Governments, and Agencies in effectively managing their
            risk functions.
          </p>
        }
        actions={
          <>
            <a href="#capabilities" className="button">
              Explore our capabilities <ArrowDown size={16} />
            </a>
            <a href={contactLink("Managed Services")} className="text-link">
              Request a callback <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="svc-hero-visual">
            <div className="svc-hero-glow" aria-hidden="true" />
            <img
              src={heroArt}
              alt="Illustration of a team protecting information assets"
              width="474"
              height="326"
            />
            <div className="managed-audiences">
              <p>Who we serve</p>
              <ul>
                {audiences.map((audience) => (
                  <li key={audience.name}>
                    <audience.icon size={15} strokeWidth={1.8} aria-hidden="true" />
                    {audience.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
      />

      <section className="managed-gap" aria-labelledby="gap-title">
        <div className="site-container managed-gap-layout">
          <Reveal>
            <p className="eyebrow">The capacity gap</p>
            <h2 id="gap-title">
              Bridging the gap in <span>risk management capacity.</span>
            </h2>
            <p className="managed-gap-text">
              Research shows that 80% of SMEs lack sufficient capacity in risk management
              disciplines, while 70% of government entities lack the right skill base to implement
              risk management adequately. To bridge this gap, we offer to be your outsourced managed
              service risk provider, delivering specialized solutions in information security, data
              protection, risk management, and business continuity.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <dl className="managed-stats">
              <div>
                <dt>
                  <span className="managed-meter" style={{ "--fill": "80%" } as CSSProperties} />
                  80%
                </dt>
                <dd>of SMEs lack sufficient capacity in risk management disciplines</dd>
              </div>
              <div>
                <dt>
                  <span className="managed-meter" style={{ "--fill": "70%" } as CSSProperties} />
                  70%
                </dt>
                <dd>
                  of government entities lack the right skill base to implement risk management
                  adequately
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="svc-section" aria-labelledby="benefits-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Benefits"
            id="benefits-title"
            title="Our Managed Consultancy Services"
            accent="offer the following benefits."
          />
          <ol className="managed-benefits">
            {benefits.map((benefit, index) => (
              <li key={benefit.title}>
                <Reveal delay={index * 80} className="managed-benefit">
                  <div className="managed-benefit-top">
                    <span>
                      <benefit.icon size={22} strokeWidth={1.5} />
                    </span>
                    <small>{String(index + 1).padStart(2, "0")}</small>
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="capabilities"
        className="svc-section is-pale"
        aria-labelledby="capabilities-title"
      >
        <div className="site-container">
          <SectionHeading
            eyebrow="Capabilities"
            id="capabilities-title"
            title="Unique capabilities,"
            accent="delivered as a service."
            note="Our Managed Consultancy Services encompass the following unique capabilities."
          />
          <div className="managed-capabilities">
            <ul className="managed-capability-grid">
              {capabilities.map((capability, index) => (
                <li key={capability.title}>
                  <Reveal delay={(index % 2) * 80} className="managed-capability">
                    <span>
                      <capability.icon size={24} strokeWidth={1.5} />
                    </span>
                    <h3>{capability.title}</h3>
                    <p>{capability.text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal delay={120} className="managed-shield">
              <span className="managed-shield-icon">
                <Shield size={30} strokeWidth={1.4} />
              </span>
              <p className="eyebrow">Featured capability</p>
              <h3>Cyber Shield</h3>
              <p>
                Our comprehensive cybersecurity offering provides a shield of protection against
                cyber threats, bolstering your cybersecurity posture.
              </p>
              <a href={cybershieldPage} className="button">
                Explore Cybershield <ArrowUpRight size={17} />
              </a>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="svc-section" aria-labelledby="help-title">
        <div className="site-container managed-help">
          <Reveal className="managed-help-photo">
            <img
              src={teamPhoto}
              alt="A Sentinel Africa consultant on a client call"
              loading="lazy"
              width="1280"
              height="848"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Your trusted partner</p>
            <h2 id="help-title">We help you:</h2>
            <ul className="managed-engagements">
              {engagements.map((engagement) => (
                <li key={engagement.label}>
                  <span>
                    <engagement.icon size={20} strokeWidth={1.6} />
                  </span>
                  <div>
                    <strong>{engagement.label}</strong>
                    <p>{engagement.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="svc-body">
              At Sentinel Africa, we are committed to delivering tailored and long-term solutions to
              augment your risk function and address your organization’s growing needs.
            </p>
            <p className="managed-partner">
              Make us your trusted partner in managing your risk landscape efficiently and
              effectively, empowering you to focus on achieving your strategic objectives with
              confidence.
            </p>
            <a href={contactLink("Managed Services")} className="button">
              Discuss a retainer <ArrowRight size={17} />
            </a>
          </Reveal>
        </div>
      </section>

      <OtherServices current="Managed Services" />

      <PageCta interest="Managed Services" />
    </InnerPage>
  );
}
