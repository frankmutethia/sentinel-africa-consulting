import {
  Activity,
  AppWindow,
  ArrowDown,
  ArrowRight,
  Building,
  Crosshair,
  FileBarChart,
  Globe,
  HandCoins,
  Network,
  Radar,
  ScanSearch,
  ShieldAlert,
  Users,
  Wifi,
} from "lucide-react";
import heroArt from "@/assets/services/cyber-hero.png";
import vaptArt from "@/assets/services/cyber-vapt.jpg";
import firewallArt from "@/assets/services/cyber-firewall.jpg";
import patchArt from "@/assets/services/cyber-patch.jpg";
import reportingArt from "@/assets/services/cyber-reporting.jpg";
import consultationArt from "@/assets/services/cyber-consultation.jpg";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { contactLink } from "./navigation";
import { Reveal } from "./Reveal";
import { OtherServices, SectionHeading } from "./ServiceBlocks";
import "./cybershield.css";

// The four activities named in the published introduction.
const cycle = [
  { name: "Monitoring", icon: Activity },
  { name: "Detection", icon: Radar },
  { name: "Analysis", icon: ScanSearch },
  { name: "Response", icon: ShieldAlert },
];

const services = [
  {
    title: "Vulnerability Management (VAPTs)",
    image: vaptArt,
    text: "Regular scanning and assessment of systems and applications for vulnerabilities, followed by appropriate mitigation strategies.",
  },
  {
    title: "Firewall and Network Security Management (Network Architecture Review)",
    image: firewallArt,
    text: "Management and configuration of firewall rules, network segmentation, and traffic filtering.",
  },
  {
    title: "Security Patch Management",
    image: patchArt,
    text: "Ensuring that systems and applications are up-to-date with the latest security patches and updates.",
  },
  {
    title: "Security Reporting and Analytics",
    image: reportingArt,
    text: "Regular reporting on security metrics, incidents, and vulnerabilities to provide insights into the organization’s security posture.",
  },
  {
    title: "Security Consultation",
    image: consultationArt,
    text: "Providing expertise and guidance on security best practices, compliance requirements, and risk management strategies.",
  },
];

// Transcribed from the published "Comprehensive Vulnerability Assessment" diagram.
const assessments = [
  { name: "External Assessment", icon: Globe, finds: "Identify vulnerabilities from the outside" },
  {
    name: "Internal Assessment",
    icon: Network,
    finds: "Identifies vulnerabilities on the inside of the network",
  },
  {
    name: "Social Engineering",
    icon: Users,
    finds: "Identifies vulnerabilities within human resources & training gaps",
  },
  {
    name: "Wireless Assessment",
    icon: Wifi,
    finds: "Identifies vulnerabilities within a wireless network",
  },
  {
    name: "Physical Security Assessment",
    icon: Building,
    finds: "Identifies vulnerabilities related to people & facilities",
  },
  { name: "Application & Database", icon: AppWindow, finds: "Identifies Software Vulnerabilities" },
];

// Transcribed from the published "Vulnerability Assessment vs Penetration Testing" diagram.
const comparison = [
  {
    aspect: "Result",
    icon: FileBarChart,
    assessment: "Lists out all the existing vulnerabilities",
    testing: "Simulates real-life attacks leading to exploitation of vulnerabilities.",
  },
  {
    aspect: "Focus",
    icon: Crosshair,
    assessment: "Focuses on individual vulnerabilities.",
    testing: "Focuses on the quantification of damages.",
  },
  {
    aspect: "Business Value",
    icon: HandCoins,
    assessment: "Finds the instances when business equipment can be compromised",
    testing: "Exploits the weaknesses & suggests measures for mitigation.",
  },
];

export default function CybershieldPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Our Services"]}
        eyebrow="24/7 monitoring, detection, analysis and response"
        title="Cybershield"
        lead={
          <p>
            Our Cybershield service plays a pivotal role in “24/7” monitoring, detection, analysis,
            and response to security incidents, ensuring rapid threat identification, containment,
            and mitigation to safeguard the client’s infrastructure and data.
          </p>
        }
        actions={
          <>
            <a href="#soc" className="button">
              Explore Cybershield <ArrowDown size={16} />
            </a>
            <a href={contactLink("Cybershield")} className="text-link">
              Request a callback <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="cyber-hero">
            <img
              src={heroArt}
              alt="Security analysts in a monitoring centre: detect, understand, act"
              width="1200"
              height="627"
            />
            <dl className="svc-hero-facts">
              <div>
                <dt>24/7</dt>
                <dd>Security Operations Center</dd>
              </div>
              <div>
                <dt>{services.length + 1}</dt>
                <dd>Managed security services</dd>
              </div>
              <div>
                <dt>{assessments.length}</dt>
                <dd>Vulnerability assessment types</dd>
              </div>
            </dl>
          </div>
        }
      />

      <section id="soc" className="cyber-soc" aria-labelledby="soc-title">
        <div className="site-container cyber-soc-layout">
          <Reveal>
            <p className="eyebrow">Security Operations Center</p>
            <h2 id="soc-title">
              Threat Detection and Monitoring: <span>24/7 Security Operations Center (SOC)</span>{" "}
              Services.
            </h2>
            <p className="cyber-soc-text">
              Constant monitoring of network traffic, system logs, and security events to identify
              and respond to potential security threats or breaches. This is accomplished by the SOC
              office by offering around-the-clock monitoring and response capabilities.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ol className="cyber-cycle" aria-label="How the SOC works around the clock">
              {cycle.map((stage, index) => (
                <li key={stage.name}>
                  <span className="cyber-cycle-icon">
                    <stage.icon size={24} strokeWidth={1.5} />
                  </span>
                  <small>0{index + 1}</small>
                  <strong>{stage.name}</strong>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="svc-section" aria-labelledby="services-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Managed security services"
            id="services-title"
            title="Safeguarding your"
            accent="infrastructure and data."
          />
          <ul className="cyber-services">
            {services.map((service, index) => (
              <li key={service.title}>
                <Reveal delay={(index % 3) * 80} className="cyber-service">
                  <div className="cyber-service-image">
                    <img src={service.image} alt="" loading="lazy" />
                  </div>
                  <div className="cyber-service-body">
                    <h3>{service.title}</h3>
                    <p>{service.text}</p>
                  </div>
                </Reveal>
              </li>
            ))}
            <li>
              <Reveal delay={160} className="cyber-service cyber-service-cta">
                <ShieldAlert size={30} strokeWidth={1.4} aria-hidden="true" />
                <h3>Need around-the-clock protection?</h3>
                <a href={contactLink("Cybershield")} className="button">
                  Talk to our experts <ArrowRight size={17} />
                </a>
              </Reveal>
            </li>
          </ul>
        </div>
      </section>

      <section className="svc-section is-pale" aria-labelledby="assessment-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Comprehensive vulnerability assessment"
            id="assessment-title"
            title="How do we comprehensively do"
            accent="our vulnerability assessments?"
          />
          <Reveal>
            <div className="cyber-assessment">
              <p className="cyber-assessment-bar" aria-hidden="true">
                Comprehensive Vulnerability Assessment
              </p>
              <ol className="cyber-assessment-steps">
                {assessments.map((step, index) => (
                  <li key={step.name}>
                    <span className="cyber-assessment-stem" aria-hidden="true" />
                    <div className="cyber-assessment-card">
                      <span className="cyber-assessment-icon">
                        <step.icon size={24} strokeWidth={1.5} />
                      </span>
                      <small>0{index + 1}</small>
                      <h3>{step.name}</h3>
                      <p>{step.finds}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="svc-section" aria-labelledby="compare-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Know the difference"
            id="compare-title"
            title="What is the difference between"
            accent="Vulnerability Assessment and Penetration Testing?"
          />
          <Reveal>
            <table className="cyber-compare">
              <thead>
                <tr>
                  <th scope="col">Vulnerability Assessment</th>
                  <th scope="col">
                    <span className="sr-only">Aspect</span>
                  </th>
                  <th scope="col">Penetration Testing</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row) => (
                  <tr key={row.aspect}>
                    <td data-label="Vulnerability Assessment">{row.assessment}</td>
                    <th scope="row">
                      <span className="cyber-compare-aspect">
                        <row.icon size={22} strokeWidth={1.5} aria-hidden="true" />
                        {row.aspect}
                      </span>
                    </th>
                    <td data-label="Penetration Testing">{row.testing}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal>
            <div className="cyber-callback">
              <p>
                Request a call back from our experts today to provide you with guidance on
                monitoring, detection, analysis, and response to security incidents, to ensure rapid
                threat identification, containment, and mitigation to safeguard the client’s
                infrastructure and data.
              </p>
              <a href={contactLink("Cybershield")} className="button">
                Request a call back <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <OtherServices current="Cybershield" />

      <PageCta interest="Cybershield" />
    </InnerPage>
  );
}
