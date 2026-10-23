import { useEffect, useRef } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  FileSignature,
  FileText,
  Globe2,
  Mail,
  Scale,
  Timer,
  Upload,
} from "lucide-react";
import banner from "@/assets/services/dpp-banner.jpg";
import bannerVideo from "@/assets/services/dpp-banner-video.mp4";
import bannerVideoPoster from "@/assets/services/dpp-banner-video-poster.jpg";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { contactLink } from "./navigation";
import { Reveal } from "./Reveal";
import { OtherServices, SectionHeading } from "./ServiceBlocks";
import "./rwanda-dpp.css";

// Sentinel Africa's own questionnaire, hosted on Zoho Forms.
const ascertainForm =
  "https://forms.zohopublic.com/SentinelAfrica/form/F1AscertainifaDataProcessororController/formperma/pMN-dhi6olYJWvbOey9qlt0vRY475f8OIN2J2NuuzdY";

function AscertainLink({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <a
      href={ascertainForm}
      target="_blank"
      rel="noopener noreferrer"
      className={light ? "button dpp-button-light" : "button"}
    >
      {children} <ArrowUpRight size={17} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** The published looping banner video; it stays paused for visitors who prefer reduced motion. */
function BannerVideo() {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    // play() returns a promise in browsers; it rejects if autoplay is blocked, which is fine.
    if (!reduce) Promise.resolve(video.current?.play()).catch(() => undefined);
  }, []);
  return (
    <video
      ref={video}
      className="dpp-video"
      src={bannerVideo}
      poster={bannerVideoPoster}
      muted
      loop
      playsInline
      controls
      preload="metadata"
      width="1280"
      height="320"
      aria-label="Are you a data controller or processor? Get to know right now!"
    />
  );
}

const steps = [
  { icon: Upload, text: "You’ll provide us with your details and upload the necessary documents." },
  {
    icon: ClipboardCheck,
    text: "Our team of experts will meticulously review and correct any discrepancies.",
  },
  {
    icon: FileSignature,
    text: "We will then have you sign the required documents, then compile the documents into a comprehensive package for submission to the supervisory authority.",
  },
  {
    icon: Mail,
    text: "You will need to create an email and share the credentials, we will then share the documents for you via that email and inform you when your certificate is ready in a week.",
  },
];

const documents: { text: string; template?: boolean }[] = [
  {
    text: "Letter of application addressed to the Chief Executive Officer of NCSA",
    template: true,
  },
  { text: "Certificate of incorporation" },
  { text: "License from Regulator (if applicable) e.g. license issued by RURA, MINICOM" },
  { text: "Legal instrument establishing the entity (in the case of a public entity)" },
  {
    text: "Contract with the representative (only for those Data Controllers/ Data Processors that are neither established nor reside in Rwanda but process personal data of Data Subjects located in Rwanda)",
  },
  {
    text: "Any other supporting document (e.g. a contract between Data Controller and Data Processor, privacy notice)",
  },
  { text: "DPO’s Letter of Appointment", template: true },
];

export default function RwandaDppPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Our Services"]}
        eyebrow="Your Fast-Track to Compliance!"
        title="Rwanda DPP Registration"
        lead={
          <>
            <p className="dpp-lead-title">
              Introducing Sentinel Africa’s Rwanda DPP Registration Accelerator – Your Fast-Track to
              Compliance!
            </p>
            <p>
              Welcome to the Rwanda DPP Registration Accelerator, a cutting-edge solution designed
              to streamline and expedite registration so as to comply with the DPP law in Rwanda.
            </p>
          </>
        }
        actions={
          <>
            <AscertainLink>
              Find Out if you are a Data Processor or Controller in Seconds!
            </AscertainLink>
            <a href="#how" className="text-link">
              How we help <ArrowDown size={17} />
            </a>
          </>
        }
        aside={
          <div className="dpp-hero">
            <img
              src={banner}
              alt="Are you a data controller or processor in Rwanda? We will help you get registered in 5 days"
              width="1280"
              height="320"
            />
            <dl className="svc-hero-facts">
              <div>
                <dt>5</dt>
                <dd>Days to handle the entire process</dd>
              </div>
              <div>
                <dt>{steps.length}</dt>
                <dd>Simple steps on our online platform</dd>
              </div>
              <div>
                <dt>{documents.length}</dt>
                <dd>Documents to prepare</dd>
              </div>
            </dl>
          </div>
        }
      />

      <section className="dpp-intro" aria-label="About the accelerator">
        <div className="site-container dpp-intro-layout">
          <Reveal>
            <p className="dpp-intro-text">
              We understand that navigating the intricacies of registration can be daunting and
              time-consuming for organizations, especially those lacking the expertise and
              resources.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="svc-body">
              With our expertise and in-depth knowledge of the registration requirements, we offer a
              seamless journey to obtain your certificate of registration as a data controller or
              processor in Rwanda.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="svc-section is-pale" aria-labelledby="why-title">
        <div className="site-container dpp-law">
          <Reveal>
            <p className="eyebrow">The law</p>
            <h2 id="why-title">Why do you need to register?</h2>
            <p className="svc-body">
              Therefore, it is mandatory for any natural person, public or private corporate body
              intending to be a Data Controller or a Data Processor to register with the Data
              Protection and Privacy Office under National Cyber Security Authority (NCSA) and
              receive a registration certificate.
            </p>
            <p className="svc-body">
              By registering and providing information about your data processing operations to the
              supervisory authority, you are making the first step towards compliance and
              contributing to a responsible, transparent, and accountable data ecosystem in Rwanda.
            </p>
          </Reveal>
          <Reveal delay={120} className="dpp-law-cards">
            <figure className="dpp-article">
              <span className="dpp-article-icon">
                <Scale size={26} strokeWidth={1.4} />
              </span>
              <p className="eyebrow">Article 29</p>
              <blockquote>
                Article 29 of Rwanda’s Personal Data Protection and Privacy Law provides that a
                person who intends to be a Data Controller or a Data Processor must register with
                the supervisory authority.
              </blockquote>
            </figure>
            <p className="dpp-warning">
              <AlertTriangle size={20} aria-hidden="true" />
              Operating without a registration certificate is an administrative misconduct.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="svc-section" aria-labelledby="who-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Who is required to register?"
            id="who-title"
            title="Any Data Controller"
            accent="and processor who:"
          />
          <ul className="dpp-who">
            <li>
              <Reveal className="dpp-who-card">
                <span>
                  <Building2 size={26} strokeWidth={1.4} />
                </span>
                <h3>In Rwanda</h3>
                <p>
                  is established or resides in Rwanda and processes personal data while in Rwanda;
                </p>
              </Reveal>
            </li>
            <li>
              <Reveal delay={100} className="dpp-who-card">
                <span>
                  <Globe2 size={26} strokeWidth={1.4} />
                </span>
                <h3>Outside Rwanda</h3>
                <p>
                  is neither established nor resides in Rwanda, but processes the personal data of
                  Data Subjects located in Rwanda.
                </p>
              </Reveal>
            </li>
          </ul>
        </div>
      </section>

      <section className="dpp-ascertain" aria-labelledby="ascertain-title">
        <div className="site-container dpp-ascertain-layout">
          <Reveal>
            <BannerVideo />
          </Reveal>
          <Reveal delay={100} className="dpp-ascertain-copy">
            <div>
              <p className="eyebrow">Step one</p>
              <h2 id="ascertain-title">Ascertain If you are a Data Controller or Processor!</h2>
            </div>
            <div>
              <p>
                You are required to register as a data processor or controller, you therefore need
                to ascertain if you are a controller or processor or both. We will help you
                ascertain that by simply answering a few questions. Click the link below and get to
                know in a few minutes.
              </p>
              <AscertainLink light>
                Start Now by Ascertaining if you are a Data Controller or Processor in seconds!
              </AscertainLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="how" className="svc-section" aria-labelledby="how-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="How will we help?"
            id="how-title"
            title="Get it right"
            accent="the first time."
            note="Our unique approach ensures that you get it right the first time, saving you valuable time and effort. Through a user-friendly online platform:"
          />
          <ol className="dpp-timeline">
            {steps.map((step, index) => (
              <li key={index}>
                <Reveal delay={index * 80} className="dpp-timeline-step">
                  <span className="dpp-timeline-marker">
                    <step.icon size={22} strokeWidth={1.6} />
                  </span>
                  <small>Step {index + 1}</small>
                  <p>{step.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
          <Reveal>
            <div className="dpp-five-days">
              <span className="dpp-five-days-badge">
                <Timer size={22} aria-hidden="true" />
                <strong>5</strong> days
              </span>
              <p>
                In just five days, we’ll handle the entire process, from document preparation to
                application submission, allowing you to focus on your core business activities
                without disruptions. Rest assured, we’ll navigate every step with precision and
                care, ensuring your registration journey is smooth and successful.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="svc-section is-pale" aria-labelledby="documents-title">
        <div className="site-container dpp-documents-layout">
          <Reveal className="dpp-documents-copy">
            <p className="eyebrow">Be prepared</p>
            <h2 id="documents-title">
              Here is a List of the Documents
              <br />
              <span className="blue-text">you will need to upload!</span>
            </h2>
            <p className="svc-body">
              Join numerous organizations in Rwanda that have already experienced the efficiency and
              convenience of the Rwanda DPP Registration Accelerator. Let us empower your compliance
              journey, so you can confidently operate within the regulatory framework and elevate
              your organization to new heights of data protection and privacy.
            </p>
            <p className="dpp-partner">
              Partner with Sentinel Africa today, and embark on a fast track to DPP registration –
              unlocking compliance with ease and precision. Trust in our expertise, and together,
              we’ll achieve your compliance goals in record time.
            </p>
            <div className="svc-actions">
              <AscertainLink>Start your Registration Journey Now!</AscertainLink>
              <a href={contactLink("Rwanda DPP Registration")} className="text-link">
                Talk to us first <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="dpp-documents">
              <p className="dpp-documents-title">
                <FileText size={20} strokeWidth={1.6} aria-hidden="true" /> Documents checklist
              </p>
              <ol>
                {documents.map((document, index) => (
                  <li key={document.text}>
                    <span className="dpp-document-number">{index + 1}</span>
                    <div>
                      {document.text}
                      {document.template && (
                        <span className="dpp-template">We will provide a template</span>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      <OtherServices current="Rwanda DPP Registration" />

      <PageCta interest="Rwanda DPP Registration" />
    </InnerPage>
  );
}
