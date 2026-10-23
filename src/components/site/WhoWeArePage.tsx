import {
  ArrowRight,
  Building2,
  Compass,
  Handshake,
  HardHat,
  MapPin,
  Play,
  Scale,
  ShieldCheck,
  Target,
  Users,
  Zap,
} from "lucide-react";
import introVideo from "@/assets/who-we-are/who-we-are.mp4";
import introPoster from "@/assets/who-we-are/who-we-are-poster.jpg";
import coreValues from "@/assets/who-we-are/core-values.png";
import { homeSection } from "./navigation";
import { Reveal } from "./Reveal";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import "./who-we-are.css";

const facts = [
  { icon: ShieldCheck, label: "Certified", value: "ISO/IEC 27001 ISMS · ISO/IEC 27701 PIMS" },
  { icon: Building2, label: "Headquarters", value: "Nairobi, Kenya" },
  { icon: MapPin, label: "Subsidiaries", value: "Rwanda and Uganda" },
  { icon: Users, label: "Sectors", value: "Private and public domains" },
];

const values = [
  { icon: Scale, name: "Integrity & Ethics", tone: "yellow" },
  { icon: Zap, name: "Speed & Flexibility", tone: "teal" },
  { icon: Handshake, name: "Building Meaningful Relationships", tone: "orange" },
  { icon: HardHat, name: "Working in the Trenches", tone: "blue" },
];

export default function WhoWeArePage() {
  return (
    <InnerPage>
      <PageHero
        trail={["About Us"]}
        eyebrow="About Sentinel Africa"
        title="Who We Are"
        lead={
          <p>A premier risk management consultancy firm, operating throughout Africa and beyond.</p>
        }
        actions={
          <>
            <a href="#story" className="button">
              Watch our story <Play size={16} />
            </a>
            <a href={homeSection("/", "contact")} className="text-link">
              Talk to our consultants <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <dl className="who-facts">
            {facts.map((fact) => (
              <div key={fact.label}>
                <span className="who-fact-icon">
                  <fact.icon size={20} strokeWidth={1.5} />
                </span>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        }
      />

      <section id="story" className="who-story section-space" aria-labelledby="story-title">
        <div className="site-container">
          <Reveal className="who-video-frame">
            <video
              controls
              preload="metadata"
              poster={introPoster}
              width="1280"
              height="720"
              aria-label="Sentinel Africa Consulting introduction video"
            >
              <source src={introVideo} type="video/mp4" />
            </video>
          </Reveal>
          <div className="who-intro">
            <Reveal>
              <p className="eyebrow">Welcome</p>
              <h2 id="story-title">
                Safeguarding your assets.
                <br />
                <span className="blue-text">Ensuring your long-term success.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="who-body">
                Welcome to Sentinel Africa Consulting, we are a premier Risk Management Consultancy
                firm operating throughout Africa and beyond. With our extensive expertise in Risk
                Management; Information Security, Business Continuity, Enterprise Risk, and Data
                Privacy &amp; Protection, we are committed to safeguarding your organization’s
                assets and ensuring its long-term success.
              </p>
              <p className="who-body">
                Our commitment to excellence is reflected in our ISO/IEC 27001 ISMS and ISO/IEC
                27701 PIMS certifications. Headquartered in Nairobi, Kenya, and with subsidiaries in
                Rwanda and Uganda, we have established a strong presence across the African region.
                Our team of experts possesses deep industry knowledge, enabling us to cater to a
                wide range of sectors in both the private and public domains.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="who-pillars section-space" aria-label="Our approach and our compass">
        <div className="site-container">
          <div className="who-pillar-grid">
            <Reveal>
              <article className="who-pillar">
                <span className="who-pillar-icon">
                  <Target size={26} strokeWidth={1.4} />
                </span>
                <span className="who-pillar-number">01</span>
                <h2>Our Approach to Risk Management</h2>
                <p>
                  At Sentinel Africa Consulting, we approach risk management with a dual focus:
                  protecting your existing value and fostering its growth. We believe in
                  understanding the unique needs of each client and developing tailored solutions to
                  address their specific challenges. By implementing sustainable and continuously
                  improving management systems, we ensure that risk management becomes an integral
                  part of your organization’s DNA.
                </p>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="who-pillar">
                <span className="who-pillar-icon">
                  <Compass size={26} strokeWidth={1.4} />
                </span>
                <span className="who-pillar-number">02</span>
                <h2>Our Compass</h2>
                <p>
                  Our core values of Integrity &amp; Ethics, Speed &amp; Flexibility, Building
                  Meaningful Relationships, and Working in the Trenches guide us in our service
                  delivery. We are dedicated to assisting our clients in building better-run
                  organizations and achieving their goals. Our ultimate vision is to become The
                  Advisor of Choice, Your Advisor of choice by providing unparalleled guidance and
                  support.
                </p>
              </article>
            </Reveal>
          </div>
          <Reveal>
            <p className="who-statement">
              As you explore our website, we hope you discover the qualities that set us apart as an{" "}
              <span>outstanding service provider</span> and an{" "}
              <span>exceptional place to build a career.</span>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="who-values section-space" aria-labelledby="values-title">
        <div className="site-container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">Our core values</p>
              <h2 id="values-title">
                Infused into our service delivery.
                <br />
                <span className="blue-text">Guiding us every step of the way.</span>
              </h2>
            </div>
            <p>
              Our Core Values are infused into our service delivery. They guide us every step of the
              way.
            </p>
          </Reveal>
          <div className="who-values-layout">
            <Reveal className="who-values-art">
              <img
                src={coreValues}
                alt="Our core values: Building Meaningful Relationships, Integrity & Ethics, Speed & Flexibility, and Working in the Trenches"
                loading="lazy"
                width="1536"
                height="979"
              />
            </Reveal>
            <ul className="who-value-list">
              {values.map((value) => (
                <li key={value.name} className={`who-value who-value-${value.tone}`}>
                  <span className="who-value-icon">
                    <value.icon size={22} strokeWidth={1.5} />
                  </span>
                  <span className="who-value-name">{value.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PageCta />
    </InnerPage>
  );
}
