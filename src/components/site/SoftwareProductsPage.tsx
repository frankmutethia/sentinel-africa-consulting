import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  GraduationCap,
  Handshake,
  Layers,
  Rocket,
  SearchCheck,
  ShieldCheck,
  Users,
} from "lucide-react";
import gapAssessShot from "@/assets/services/gapassess-platform.webp";
import ismsShot from "@/assets/services/sentinel-isms-platform.webp";
import strataOneShot from "@/assets/services/strataone-platform.webp";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { contactLink, servicePages } from "./navigation";
import { Reveal } from "./Reveal";
import { OtherServices, SectionHeading } from "./ServiceBlocks";
import "./software-products.css";

/** The name this page has in the Our Services menu and the callback form. */
const pageLabel = "Our Software Products";
const serviceHref = (label: string) => servicePages.find((page) => page.label === label)!.href;

// Descriptions follow each product's own website; the previews are screenshots of them.
const products = [
  {
    id: "gapassess",
    name: "GapAssess",
    step: "Assess",
    icon: SearchCheck,
    category: "ISO 27001 gap assessment",
    tagline: "Know exactly where you stand.",
    text: "GapAssess evaluates your information security posture against the requirements of ISO/IEC 27001:2022. It shows where you fall short, scores the maturity of each area and turns the results into reports you can act on, so you know exactly what stands between you and certification.",
    audience:
      "Organisations starting an ISO 27001 programme, re-baselining an existing one or preparing for a certification audit.",
    features: [
      "Structured assessment against ISO/IEC 27001:2022",
      "Gap identification with maturity scoring for each area",
      "Reports ready for management and auditors",
      "A clear, prioritised path to certification readiness",
      "Secure sign-in with multi-factor authentication",
    ],
    url: "https://gap-assessment.rodelatech.com/login",
    visit: "Open GapAssess",
    shot: gapAssessShot,
  },
  {
    id: "isms-platform",
    name: "Sentinel Africa ISMS Platform",
    step: "Implement",
    icon: ShieldCheck,
    category: "ISO 27001 compliance automation",
    tagline: "Run your ISMS with precision and confidence.",
    text: "An enterprise platform for implementing and running an information security management system. It manages ISO 27001:2022 implementations, risk assessments, internal audits and Annex A controls, across one organisation or many, with pre-configured templates and workflows that get your ISMS running in weeks rather than months.",
    audience:
      "Government ministries, departments and agencies, and organisations running ISO 27001 across several entities in Kenya, Rwanda and East Africa.",
    features: [
      "All 10 clauses of ISO 27001:2022 and the 93 Annex A controls",
      "Deployment in 4–6 weeks with pre-configured templates and workflows",
      "Multi-organisation management from a single platform",
      "Role-based access for platform, organisation and department users",
      "Central document management for policies and procedures",
      "Live dashboards, full audit trails and compliance reports on demand",
    ],
    url: "https://isms.rodelatech.com/",
    visit: "Visit the ISMS Platform",
    shot: ismsShot,
  },
  {
    id: "strataone",
    name: "StrataOne",
    step: "Connect and grow",
    icon: Layers,
    category: "Connected GRC solutions",
    tagline: "Bring governance, risk and compliance into alignment.",
    text: "StrataOne brings your management systems into one workspace. Define your organisation’s context, people and documents once and build on them across every standard, from risk treatment and control assessment to internal audit and management review, with every document versioned and formally approved.",
    audience:
      "Organisations running more than one management system, and audit firms that audit across several clients.",
    features: [
      "ISO/IEC 27001 information security management system",
      "ISO/IEC 42001:2023 artificial intelligence management system",
      "Shared organisation context, people and documents across standards",
      "Risk assessment and treatment with clear ownership",
      "Versioned documents, formal approvals and a full audit trail",
      "Internal Audit workspace for audit firms, with a 30-day free trial",
    ],
    url: "https://strataone.tech/",
    visit: "Visit StrataOne",
    shot: strataOneShot,
  },
];

const support = [
  {
    icon: Rocket,
    title: "Guided setup",
    text: "We configure each product around your scope, structure and existing documentation.",
    link: { label: "Talk to our team", href: contactLink(pageLabel) },
  },
  {
    icon: GraduationCap,
    title: "Training for your team",
    text: "Certified ISO 27001 and data protection training, so your people use the tools with confidence.",
    link: { label: "Training", href: serviceHref("Training") },
  },
  {
    icon: Users,
    title: "Expert assessments and audits",
    text: "Our consultants review the results with you and lead internal audits when you need them.",
    link: { label: "Consultancy", href: serviceHref("Consultancy") },
  },
  {
    icon: Handshake,
    title: "Ongoing support",
    text: "Keep your management system current through a long-term managed services retainer.",
    link: { label: "Managed Services", href: serviceHref("Managed Services") },
  },
];

/** A product screenshot inside a simple browser window, labelled with the product name. */
function BrowserFrame({
  name,
  shot,
  label,
  lazy = true,
}: {
  name: string;
  shot: string;
  label: string;
  lazy?: boolean;
}) {
  return (
    <figure className="tools-browser">
      <figcaption className="tools-browser-bar">
        <span className="tools-browser-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="tools-browser-address">{name}</span>
      </figcaption>
      <img src={shot} alt={label} width="1280" height="720" loading={lazy ? "lazy" : "eager"} />
    </figure>
  );
}

export default function SoftwareProductsPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Our Services"]}
        eyebrow="Compliance software"
        title={pageLabel}
        lead={
          <p>
            Three compliance platforms that take you from your first ISO 27001 gap assessment to a
            connected governance, risk and compliance programme, with Sentinel Africa’s consultants
            beside you at every step.
          </p>
        }
        actions={
          <>
            <a href="#products" className="button">
              Explore the products <ArrowDown size={16} />
            </a>
            <a href={contactLink(pageLabel)} className="text-link">
              Request a demo <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="tools-showcase" aria-label="Our software products">
            {[...products].reverse().map((product, index) => (
              <div key={product.id} className={`tools-showcase-layer is-layer-${index}`}>
                <BrowserFrame
                  name={product.name}
                  shot={product.shot}
                  label={`${product.name} preview`}
                  lazy={false}
                />
              </div>
            ))}
            <p className="tools-standards">
              <span>ISO/IEC 27001</span>
              <i aria-hidden="true" />
              <span>ISO/IEC 42001</span>
            </p>
          </div>
        }
      />

      <section id="products" className="svc-section" aria-labelledby="products-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="How the products fit together"
            id="products-title"
            title="From first assessment"
            accent="to a connected compliance programme."
          />
          <Reveal>
            <ol className="tools-path">
              {products.map(({ id, name, step, icon: Icon, category }, index) => (
                <li key={id}>
                  <a href={`#${id}`}>
                    <span className="tools-path-icon">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    <span className="tools-path-step">
                      0{index + 1} · {step}
                    </span>
                    <strong>{name}</strong>
                    <span className="tools-path-category">{category}</span>
                    <ArrowDown className="tools-path-arrow" size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {products.map((product, index) => (
        <section
          key={product.id}
          id={product.id}
          className={`svc-section tools-product ${index % 2 === 0 ? "is-pale" : "is-reversed"}`}
          aria-labelledby={`${product.id}-title`}
        >
          <div className="site-container tools-product-layout">
            <Reveal className="tools-product-shot">
              <BrowserFrame
                name={product.name}
                shot={product.shot}
                label={`${product.name} screen`}
              />
            </Reveal>
            <Reveal delay={120} className="tools-product-copy">
              <p className="eyebrow">
                0{index + 1} · {product.category}
              </p>
              <h2 id={`${product.id}-title`}>{product.name}</h2>
              <p className="svc-lead-title">{product.tagline}</p>
              <p className="svc-body">{product.text}</p>
              <p className="tools-audience">
                <strong>Who it’s for</strong>
                {product.audience}
              </p>
              <ul className="svc-checklist tools-features">
                {product.features.map((feature) => (
                  <li key={feature}>
                    <span>
                      <Check size={14} aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="svc-actions">
                <a href={product.url} className="button" target="_blank" rel="noreferrer">
                  {product.visit} <ArrowUpRight size={17} />
                </a>
                <a href={contactLink(pageLabel)} className="text-link">
                  Request a demo <ArrowRight size={17} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="svc-section" aria-labelledby="support-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Implementation and support"
            id="support-title"
            title="Software is only part of the answer."
            accent="Our consultants make it work for you."
          />
          <Reveal>
            <ul className="tools-support">
              {support.map(({ icon: Icon, title, text, link }) => (
                <li key={title}>
                  <span className="tools-path-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <a className="text-link" href={link.href}>
                    {link.label} <ArrowUpRight size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <OtherServices current={pageLabel} />

      <PageCta interest={pageLabel} />
    </InnerPage>
  );
}
