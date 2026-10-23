import {
  ArrowDown,
  ArrowRight,
  Handshake,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Waypoints,
} from "lucide-react";
import { ApproachDiagram } from "./ApproachDiagram";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { homeSection } from "./navigation";
import { Reveal } from "./Reveal";
import "./how-we-do-it.css";

const steps = [
  {
    number: "01",
    name: "Understand",
    tone: "understand",
    icon: Search,
    text: "We comprehensively analyze our client’s operations, goals, and challenges to achieve this. We collaborate closely with their teams to understand their business environment, industry regulations, and risk landscape. This allows us to develop a holistic perspective that enables us to identify potential vulnerabilities and opportunities for improvement.",
  },
  {
    number: "02",
    name: "Tailor",
    tone: "tailor",
    icon: SlidersHorizontal,
    text: "Drawing on our extensive expertise in risk management, we design strategies and frameworks that align with our client’s objectives. Our solutions are not only effective but also practical, taking into account the unique characteristics and requirements of each organization.",
  },
  {
    number: "03",
    name: "Embed",
    tone: "embed",
    icon: Waypoints,
    text: "We go beyond providing recommendations and guidance. Our dedicated team works hand in hand with our clients to ensure the successful implementation and integration of the proposed solutions. We provide ongoing support, training, and monitoring to empower our client’s internal teams and foster a culture of risk awareness and proactive management.",
  },
];

export default function HowWeDoItPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["About Us"]}
        eyebrow="Our methodology"
        title="How We Do It"
        lead={
          <p>
            At Sentinel Africa Consulting, we excel in delivering customized solutions by deeply
            understanding our client’s unique context and scope. Our approach revolves around
            tailoring our services to address their specific needs and seamlessly integrating these
            solutions into their organizations.
          </p>
        }
        actions={
          <>
            <a href="#steps" className="button">
              See the three steps <ArrowDown size={16} />
            </a>
            <a href={homeSection("/", "contact")} className="text-link">
              Talk to our consultants <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="how-diagram-panel">
            <ApproachDiagram className="how-diagram" />
          </div>
        }
      />

      <section id="steps" className="how-steps section-space" aria-labelledby="steps-title">
        <div className="site-container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">Our approach</p>
              <h2 id="steps-title">
                Understand. Tailor.
                <br />
                <span className="blue-text">Embed.</span>
              </h2>
            </div>
            <p>Three steps that turn risk management into part of how your organization works.</p>
          </Reveal>
          <ol className="how-step-grid">
            {steps.map((step, index) => (
              <li key={step.name}>
                <Reveal delay={index * 100} className="how-step-reveal">
                  <article className={`how-step how-step-${step.tone}`}>
                    <div className="how-step-top">
                      <span className="how-step-icon">
                        <step.icon size={24} strokeWidth={1.5} />
                      </span>
                      <span className="how-step-number">Step {step.number}</span>
                    </div>
                    <h3>{step.name}</h3>
                    <p>{step.text}</p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="how-commitment section-space" aria-labelledby="commitment-title">
        <div className="site-container how-commitment-layout">
          <Reveal>
            <p className="eyebrow">At every step</p>
            <h2 id="commitment-title">
              Collaboration, transparency
              <br />
              <span className="blue-text">and open communication.</span>
            </h2>
          </Reveal>
          <div className="how-commitment-panels">
            <Reveal>
              <div className="how-panel">
                <span className="how-panel-icon">
                  <Handshake size={22} strokeWidth={1.5} />
                </span>
                <p>
                  At every step, we prioritize collaboration, transparency, and open communication.
                  By building strong relationships with our clients, we establish a foundation of
                  trust that enables us to deliver sustainable and long-lasting results.
                </p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="how-panel">
                <span className="how-panel-icon">
                  <ShieldCheck size={22} strokeWidth={1.5} />
                </span>
                <p>
                  Through our client-centric approach and unwavering commitment to excellence, we
                  help organizations fortify their risk management practices, enhance information
                  security, ensure business continuity, and safeguard data privacy &amp; protection.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <PageCta />
    </InnerPage>
  );
}
