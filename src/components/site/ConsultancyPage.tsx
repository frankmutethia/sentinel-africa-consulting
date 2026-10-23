import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Gauge,
  LockKeyhole,
  Quote,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sprout,
  Target,
  TrendingUp,
  Trophy,
} from "lucide-react";
import heroArt from "@/assets/services/consultancy-hero.png";
import teamPhotoOne from "@/assets/services/consultancy-team-1.jpg";
import teamPhotoTwo from "@/assets/services/consultancy-team-2.jpg";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { contactLink, howWeDoItPage } from "./navigation";
import { Reveal } from "./Reveal";
import { OtherServices, SectionHeading } from "./ServiceBlocks";
import "./consultancy.css";

const standards = [
  { title: "Information Security Standards", icon: ShieldCheck },
  { title: "Business Continuity Standards", icon: RefreshCw },
  { title: "Risk Management Standards", icon: Target },
  { title: "Data Privacy Standards", icon: LockKeyhole },
  { title: "GSMA Standards", icon: Smartphone },
];

// Outcomes named in the published introduction.
const outcomes = [
  { title: "Tangible results", icon: Trophy },
  { title: "Boosted efficiency", icon: Gauge },
  { title: "Enhanced overall performance", icon: TrendingUp },
];

// The modus operandi named on the page; captions paraphrase How We Do It.
const method = [
  { step: "Understand", caption: "Your unique context and scope", tone: "understand" },
  { step: "Tailor", caption: "Solutions shaped to your specific needs", tone: "tailor" },
  { step: "Embed", caption: "Integrated into your environment", tone: "embed" },
];

// The published list of strategy documents and processes, grouped for scanning.
const documentGroups = [
  {
    name: "Policies and response plans",
    items: [
      {
        title: "Tailored Information Security Policy",
        text: "We create bespoke information security policies that align with the organization’s operations and risks, ensuring data protection and secure practices.",
      },
      {
        title: "Customized Data Protection and Privacy Policy",
        text: "Our team crafts policies and procedures that comply with relevant regulations and reflect the organization’s commitment to safeguarding personal information.",
      },
      {
        title: "Personalized Business Continuity Plan (BCP)",
        text: "We design BCPs that cater to the organization’s critical processes, helping them swiftly recover from disruptive incidents and ensure uninterrupted operations.",
      },
      {
        title: "Tailor-Made Incident Response Plan (IRP)",
        text: "Our IRPs are uniquely designed to address the organization’s specific cybersecurity incidents, enabling swift and effective response and recovery.",
      },
      {
        title: "Personalized Data Breach Response Plan",
        text: "We develop data breach response plans that fit the organization’s specific requirements, guiding them in handling and notifying affected parties.",
      },
      {
        title: "Customized Disaster Recovery Plan (DRP)",
        text: "Our DRPs are tailored to the organization’s critical systems and data, ensuring they can effectively recover from disasters.",
      },
    ],
  },
  {
    name: "Risk, governance and compliance",
    items: [
      {
        title: "Customized Risk Management Framework",
        text: "We develop risk management frameworks that are tailored to the organization’s risk appetite, identifying and mitigating risks in a way that suits their culture.",
      },
      {
        title: "Individualized Risk Assessment and Analysis",
        text: "Our risk assessments identify unique threats and vulnerabilities relevant to the organization, enabling proactive risk mitigation.",
      },
      {
        title: "Bespoke Compliance Framework and Processes",
        text: "We help organizations establish compliance frameworks aligned with their specific industry standards and regulations, ensuring seamless compliance.",
      },
      {
        title: "Unique Third-Party Risk Management Procedures",
        text: "We assist in assessing and managing risks associated with third-party vendors, adapting processes to the organization’s context.",
      },
      {
        title: "Personalized Governance, Risk, and Compliance (GRC) Framework",
        text: "Our GRC frameworks integrate with the organization’s governance structure, optimizing oversight and decision-making.",
      },
    ],
  },
  {
    name: "Security operations and culture",
    items: [
      {
        title: "Custom Security Awareness and Training Programs",
        text: "Our training programs are designed to resonate with the organization’s employees, fostering a security-aware culture.",
      },
      {
        title: "Uniquely Crafted Security Architecture and Design",
        text: "We offer tailored security architectures aligned with the organization’s needs and objectives.",
      },
      {
        title: "Custom Security Incident Management Procedures",
        text: "Our procedures reflect the organization’s operational environment, ensuring effective handling of security incidents.",
      },
      {
        title: "Personalized Security Metrics and Reporting",
        text: "We develop metrics and reporting mechanisms that are meaningful to the organization, enabling informed decisions and accountability.",
      },
    ],
  },
];

// Each group continues the numbering of the one before it (01 to 15).
const numberedGroups = documentGroups.map((group, index) => ({
  ...group,
  start: documentGroups
    .slice(0, index)
    .reduce((total, previous) => total + previous.items.length, 0),
}));
const documentCount = documentGroups.reduce((total, group) => total + group.items.length, 0);

export default function ConsultancyPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Our Services"]}
        eyebrow="Short-term Implementations Advisory"
        title="Consultancy"
        lead={
          <p>
            Our consultancy services offer expert guidance and advisory on a wide range of projects
            and challenges.
          </p>
        }
        actions={
          <>
            <a href="#standards" className="button">
              Explore what we implement <ArrowDown size={16} />
            </a>
            <a href={contactLink("Consultancy")} className="text-link">
              Request a callback <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="svc-hero-visual">
            <div className="svc-hero-glow" aria-hidden="true" />
            <img
              src={heroArt}
              alt="Consultants working through a puzzle together around a table"
              width="700"
              height="599"
            />
            <dl className="svc-hero-facts">
              <div>
                <dt>{standards.length}</dt>
                <dd>ISO standard families implemented</dd>
              </div>
              <div>
                <dt>{documentCount}</dt>
                <dd>Strategy documents and processes</dd>
              </div>
              <div>
                <dt>{method.length}</dt>
                <dd>Steps: Understand, Tailor, Embed</dd>
              </div>
            </dl>
          </div>
        }
      />

      <section className="consult-overview" aria-label="What our consultancy delivers">
        <div className="site-container consult-overview-layout">
          <Reveal>
            <p className="consult-overview-text">
              With a team of seasoned professionals, we provide tailored solutions to address your
              specific needs. From risk management to process improvement, our short-term
              implementations are designed to deliver tangible results, boost efficiency, and
              enhance your organization’s overall performance.
            </p>
          </Reveal>
          <ul className="consult-outcomes">
            {outcomes.map((outcome, index) => (
              <li key={outcome.title}>
                <Reveal delay={index * 80} className="consult-outcome">
                  <span>
                    <outcome.icon size={22} strokeWidth={1.5} />
                  </span>
                  {outcome.title}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="consult-vision" aria-labelledby="view-title">
        <div className="site-container consult-vision-layout">
          <Reveal>
            <figure className="consult-quote">
              <Quote size={36} strokeWidth={1.2} aria-hidden="true" />
              <p className="eyebrow">Our vision</p>
              <blockquote>
                Our vision is to be the <span>advisor of choice</span> and we aim to achieve this by
                obsessively going about making our clients and partners win.
              </blockquote>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <h2 id="view-title">Our view on risk management is two-fold:</h2>
            <ol className="consult-folds">
              <li>
                <span className="consult-fold-icon">
                  <ShieldCheck size={26} strokeWidth={1.4} />
                </span>
                <span className="consult-fold-number">01</span>
                <strong>The protection of value</strong>
              </li>
              <li>
                <span className="consult-fold-icon">
                  <Sprout size={26} strokeWidth={1.4} />
                </span>
                <span className="consult-fold-number">02</span>
                <strong>The growth of value</strong>
              </li>
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="svc-section" aria-labelledby="method-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Our modus operandi"
            id="method-title"
            title="Understand. Tailor."
            accent="Embed in your environment."
          />
          <ol className="consult-method">
            {method.map((item, index) => (
              <li key={item.step}>
                <Reveal delay={index * 100} className={`consult-step consult-step-${item.tone}`}>
                  <span className="consult-step-number">Step {index + 1}</span>
                  <strong>{item.step}</strong>
                  <span>{item.caption}</span>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal>
            <div className="consult-method-footer">
              <p className="svc-body">
                And as such we have defined a modus operandi for carrying out our activities;
                Understand, Tailor, Embed in your environment. Sentinel Africa has a large pool of
                industry-experienced consultants who help our customers develop strategies,
                policies, or documentation that will help achieve their corporate objectives.
              </p>
              <a href={howWeDoItPage} className="text-link">
                See how we do it <ArrowUpRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="standards" className="svc-section is-pale" aria-labelledby="standards-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="What we implement"
            id="standards-title"
            title="Implementation of"
            accent="ISO standards."
          />
          <ul className="consult-standards">
            {standards.map((standard, index) => (
              <li key={standard.title}>
                <Reveal delay={index * 60} className="consult-standard">
                  <span>
                    <standard.icon size={24} strokeWidth={1.5} />
                  </span>
                  <strong>{standard.title}</strong>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="svc-section" aria-labelledby="documents-title">
        <div className="site-container consult-documents">
          <div className="consult-documents-intro">
            <p className="eyebrow">Strategy documents and processes</p>
            <h2 id="documents-title">
              Customized to your
              <br />
              <span className="blue-text">unique requirements.</span>
            </h2>
            <p className="svc-body">
              At Sentinel Africa Consulting, we partner with organizations to develop a
              comprehensive suite of strategy documents and processes that are customized to their
              unique requirements. By thoroughly understanding their scope and specific needs, we
              tailor these solutions to provide maximum impact and value. Our expert team assists in
              implementing these strategies within the organization’s existing culture, fostering
              impactful and sustainable change. Some of the key strategy documents and processes we
              help organizations develop include:
            </p>
            <a href={contactLink("Consultancy")} className="button">
              Discuss your requirements <ArrowRight size={17} />
            </a>
          </div>
          <div className="consult-document-groups">
            {numberedGroups.map((group) => (
              <section key={group.name} aria-label={group.name} className="consult-document-group">
                <h3>{group.name}</h3>
                <ol>
                  {group.items.map((item, index) => (
                    <li key={item.title}>
                      <span className="consult-document-number">
                        {String(group.start + index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <strong>{item.title}</strong>
                        <p>{item.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="svc-section is-pale" aria-labelledby="change-title">
        <div className="site-container consult-change">
          <Reveal className="consult-collage">
            <img
              src={teamPhotoOne}
              alt="Sentinel Africa consultants at work"
              loading="lazy"
              width="1280"
              height="850"
            />
            <img
              src={teamPhotoTwo}
              alt="Sentinel Africa consultants reviewing work together"
              loading="lazy"
              width="1280"
              height="848"
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Impactful change</p>
            <h2 id="change-title">
              Personalized and
              <br />
              <span className="blue-text">adaptive strategies.</span>
            </h2>
            <p className="svc-body">
              At Sentinel Africa Consulting, we believe that impactful change starts with
              personalized and adaptive strategies. By understanding each organization’s needs and
              tailoring our solutions accordingly, we empower them to thrive in an ever-evolving
              landscape of risk management.
            </p>
            <div className="consult-callback">
              <p>
                Request a call back from our experts today to provide you with guidance on how to
                implement and audit different Management System or start on different Risk
                management projects.
              </p>
              <a href={contactLink("Consultancy")} className="button">
                Request a call back <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <OtherServices current="Consultancy" />

      <PageCta interest="Consultancy" />
    </InnerPage>
  );
}
