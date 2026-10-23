import { ArrowDown, ArrowRight, ArrowUpRight, Lightbulb, Wrench } from "lucide-react";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { contactLink, toolPages } from "./navigation";
import { Reveal } from "./Reveal";
import { pageIcons } from "./pageIcons";
import "./services.css";
import "./tools.css";

/** Every self-service tool in one place. New tools appear here from `toolPages`. */
export default function ToolsPage() {
  return (
    <InnerPage>
      <PageHero
        trail={[]}
        eyebrow="Practical tools"
        title="Tools"
        lead={
          <p>
            Self-service tools from Sentinel Africa that help you check, prepare and act on risk and
            compliance requirements, backed by our consultants when you need them.
          </p>
        }
        actions={
          <>
            <a href="#all-tools" className="button">
              Browse the tools <ArrowDown size={16} />
            </a>
            <a href={contactLink()} className="text-link">
              Talk to our team <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <ul className="tools-hub-index" aria-label="Available tools">
            {toolPages.map((tool) => {
              const Icon = pageIcons[tool.label] ?? Wrench;
              return (
                <li key={tool.href}>
                  <a href={tool.href}>
                    <span className="tools-hub-index-icon">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span>
                      <strong>{tool.label}</strong>
                      <small>{tool.category}</small>
                    </span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        }
      />

      <section id="all-tools" className="svc-section" aria-labelledby="all-tools-title">
        <div className="site-container">
          <Reveal>
            <p className="eyebrow">All tools</p>
            <h2 id="all-tools-title">
              {toolPages.length} tools, <span className="blue-text">one place.</span>
            </h2>
          </Reveal>
          <ul className="tools-hub-grid">
            {toolPages.map((tool, index) => {
              const Icon = pageIcons[tool.label] ?? Wrench;
              return (
                <Reveal key={tool.href} delay={(index % 2) * 90} className="tools-hub-reveal">
                  <li className="tools-hub-card">
                    <div className="tools-hub-card-top">
                      <span className="tools-hub-card-icon">
                        <Icon size={24} aria-hidden="true" />
                      </span>
                      <span className="tools-hub-category">{tool.category}</span>
                      {tool.badge && <span className="tools-hub-badge">{tool.badge}</span>}
                    </div>
                    <h3>{tool.label}</h3>
                    <p>{tool.summary}</p>
                    <div className="tools-hub-card-actions">
                      <a className="button" href={tool.href}>
                        Open {tool.label} <ArrowRight size={16} />
                      </a>
                      <a className="text-link" href={contactLink(tool.interest)}>
                        Ask an expert <ArrowUpRight size={15} />
                      </a>
                    </div>
                  </li>
                </Reveal>
              );
            })}
            <Reveal delay={90} className="tools-hub-reveal">
              <li className="tools-hub-card is-upcoming">
                <span className="tools-hub-card-icon">
                  <Lightbulb size={24} aria-hidden="true" />
                </span>
                <h3>More tools on the way</h3>
                <p>
                  We are building more practical tools for risk, security and data protection. Tell
                  us what would help your organisation most.
                </p>
                <a className="text-link" href={contactLink()}>
                  Suggest a tool <ArrowUpRight size={15} />
                </a>
              </li>
            </Reveal>
          </ul>
        </div>
      </section>

      <PageCta />
    </InnerPage>
  );
}
