import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";
import gapAssessShot from "@/assets/services/gapassess-platform.webp";
import ismsShot from "@/assets/services/sentinel-isms-platform.webp";
import strataOneShot from "@/assets/services/strataone-platform.webp";
import rodelaLogo from "@/assets/logos/rodela-logo.png";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { contactLink } from "./navigation";
import { Reveal } from "./Reveal";
import { OtherServices, SectionHeading } from "./ServiceBlocks";
import "./automation-tools.css";

// Platforms built by our technology partner Rodela Techhouse. Descriptions follow each
// product's own website; the previews are screenshots of those sites.
const tools = [
  {
    id: "gapassess",
    name: "GapAssess",
    step: "Assess",
    icon: SearchCheck,
    category: "ISO 27001 gap assessment",
    tagline: "Know exactly where you stand.",
    text: "Evaluate your information security posture against ISO/IEC 27001:2022. GapAssess identifies the gaps, scores your maturity and generates reports, giving you a clear path to certification readiness.",
    features: [
      "Assessment against ISO/IEC 27001:2022",
      "Gap identification and maturity scoring",
      "Reports for management and auditors",
      "Secured with multi-factor authentication",
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
    text: "An enterprise ISMS automation platform for managing ISO 27001:2022 implementations, risk assessments, internal audits and Annex A controls across multiple organisations. Built for government ministries, departments and agencies, and organisations across East Africa.",
    features: [
      "All 10 clauses of ISO 27001:2022 and the 93 Annex A controls",
      "Multi-organisation management for ministries, departments and agencies",
      "Role-based access for platform, organisation and department users",
      "Central documents, audit trails and compliance reports on demand",
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
    text: "StrataOne brings your management systems into one workspace. Define your organisation’s context, people and documents once and build on them across every standard, with a dedicated internal audit workspace for audit firms.",
    features: [
      "ISO/IEC 27001 information security management system",
      "ISO/IEC 42001:2023 artificial intelligence management system",
      "Risk assessment and treatment with clear ownership",
      "Versioned documents, formal approvals and a full audit trail",
      "Internal Audit workspace, with a 30-day free trial",
    ],
    url: "https://strataone.tech/",
    visit: "Visit StrataOne",
    shot: strataOneShot,
  },
];

const host = (url: string) => new URL(url).hostname;

/** A product screenshot inside a simple browser window. */
function BrowserFrame({
  url,
  shot,
  label,
  lazy = true,
}: {
  url: string;
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
        <span className="tools-browser-address">{host(url)}</span>
      </figcaption>
      <img src={shot} alt={label} width="1280" height="720" loading={lazy ? "lazy" : "eager"} />
    </figure>
  );
}

export default function AutomationToolsPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Our Services"]}
        eyebrow="Powered by Rodela Techhouse"
        title="Automation Tools"
        lead={
          <p>
            Three compliance platforms from our technology partner, Rodela Techhouse, take you from
            your first ISO 27001 gap assessment to a connected governance, risk and compliance
            programme.
          </p>
        }
        actions={
          <>
            <a href="#tools" className="button">
              Explore the tools <ArrowDown size={16} />
            </a>
            <a href={contactLink("Automation Tools")} className="text-link">
              Request a demo <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="tools-showcase" aria-label="Our automation tools">
            {[...tools].reverse().map((tool, index) => (
              <div key={tool.id} className={`tools-showcase-layer is-layer-${index}`}>
                <BrowserFrame
                  url={tool.url}
                  shot={tool.shot}
                  label={`${tool.name} preview`}
                  lazy={false}
                />
              </div>
            ))}
            <p className="tools-powered">
              <span>Powered by</span>
              <img src={rodelaLogo} alt="Rodela" width="555" height="208" />
            </p>
          </div>
        }
      />

      <section id="tools" className="svc-section" aria-labelledby="tools-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="How the tools fit together"
            id="tools-title"
            title="From first assessment"
            accent="to a connected compliance programme."
          />
          <Reveal>
            <ol className="tools-path">
              {tools.map(({ id, name, step, icon: Icon, category }, index) => (
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

      {tools.map((tool, index) => (
        <section
          key={tool.id}
          id={tool.id}
          className={`svc-section tools-product ${index % 2 === 0 ? "is-pale" : "is-reversed"}`}
          aria-labelledby={`${tool.id}-title`}
        >
          <div className="site-container tools-product-layout">
            <Reveal className="tools-product-shot">
              <BrowserFrame url={tool.url} shot={tool.shot} label={`${tool.name} website`} />
            </Reveal>
            <Reveal delay={120} className="tools-product-copy">
              <p className="eyebrow">
                0{index + 1} · {tool.category}
              </p>
              <h2 id={`${tool.id}-title`}>{tool.name}</h2>
              <p className="svc-lead-title">{tool.tagline}</p>
              <p className="svc-body">{tool.text}</p>
              <ul className="svc-checklist tools-features">
                {tool.features.map((feature) => (
                  <li key={feature}>
                    <span>
                      <Check size={14} aria-hidden="true" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="svc-actions">
                <a href={tool.url} className="button" target="_blank" rel="noreferrer">
                  {tool.visit} <ArrowUpRight size={17} />
                </a>
                <a href={contactLink("Automation Tools")} className="text-link">
                  Request a demo <ArrowRight size={17} />
                </a>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <OtherServices current="Automation Tools" />

      <PageCta interest="Automation Tools" />
    </InnerPage>
  );
}
