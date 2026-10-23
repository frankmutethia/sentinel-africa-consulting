import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  BriefcaseBusiness,
  Check,
  GraduationCap,
  Lock,
  Mail,
  MessageCircle,
  Quote,
  Users,
} from "lucide-react";
import scholarPhoto from "@/assets/sdg/quality-education.jpg";
import videoPoster from "@/assets/careers/talent-shield-video.jpg";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { careersPage, sdgPage } from "./navigation";
import { Reveal } from "./Reveal";
import { VideoEmbed } from "./VideoEmbed";
import "./services.css";
import "./careers.css";

// Copy transcribed from the published SAC Talent Shield page.
const enquiries = {
  whatsapp: "+254715484888",
  email: "talentshield@sentinelafrica.co.ke",
};

/** Whether the programme is taking applications. Change to true when a cohort opens. */
const applicationsOpen = false;

const benefits = [
  {
    icon: GraduationCap,
    title: "Tuition fees sponsorship",
    text: "Scholarships that cover tuition fees for university education.",
  },
  {
    icon: Users,
    title: "Career advice and mentorship",
    text: "Guidance and mentorship that build a successful professional journey.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Internship opportunities",
    text: "Invaluable internships that lay the foundation for a fulfilling career.",
  },
];

const eligibility = [
  "You must have been admitted to a Kenyan University through KUCCPS.",
  "You should either be joining your first year at the university or currently in your first year of study.",
  "Ability to provide consent to share your information. For those under the age of 18 years, a guardian will have to assist in filling in the application form.",
  "Be available for contact and provide references available for contact.",
];

const stages = [
  "This will involve filling in the assessment on the basic criteria for shortlisting. The shortlisted applicant will proceed to Stage Two.",
  "You shall be contacted through the contact details provided in Stage One to request supporting documents for review. The successful applicants shall proceed to Stage Three.",
  "Applicants will be invited to an interview session. Interviews shall be conducted through videoconferencing.",
  "A final round of checks will be conducted, and the award decision made. The successful applicant will be notified of the award.",
];

export default function TalentShieldPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Careers"]}
        eyebrow="Sentinel Talent Shield Program"
        title="SAC Talent Shield"
        lead={
          <p>
            <strong>Empowering Dreams &amp; Shaping Futures.</strong> Tuition scholarships,
            mentorship and internships for gifted but underprivileged students joining Kenyan
            universities.
          </p>
        }
        actions={
          <>
            <a href="#eligibility" className="button">
              Eligibility and stages <ArrowDown size={16} />
            </a>
            <a href="#enquiries" className="text-link">
              Ask about the programme <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <figure className="shield-hero-photo">
            <img
              src={scholarPhoto}
              alt="A Sentinel Talent Shield scholar"
              width="436"
              height="768"
            />
            <figcaption className={applicationsOpen ? "is-open" : "is-closed"}>
              <Lock size={15} aria-hidden="true" />
              {applicationsOpen ? "Applications are open" : "Applications are currently closed"}
            </figcaption>
          </figure>
        }
      />

      <section className="shield-quote-section" aria-label="From a Talent Shield scholar">
        <div className="site-container">
          <Reveal>
            <blockquote className="shield-quote">
              <Quote size={34} aria-hidden="true" />
              <p>
                As a proud alumni of the Talent Shield program, I can confidently say that it has
                exceeded my expectations in every way. It has been a beacon of hope, a catalyst for
                growth, and a promise of a brighter future. Sentinel Africa has truly redefined
                sponsorship with Talent Shield, and I am excited to witness the positive impact it
                will continue to have on the lives of countless young individuals like me.
              </p>
              <footer>
                <strong>Vivian Wairimu</strong> · Talent Shield Beneficiary, Cohort I
              </footer>
            </blockquote>
          </Reveal>
        </div>
      </section>

      <section id="about" className="svc-section is-pale" aria-labelledby="about-title">
        <div className="site-container shield-about-layout">
          <Reveal>
            <p className="eyebrow">About Talent Shield</p>
            <h2 id="about-title">
              Untapped potential exists <span className="blue-text">in every corner.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="svc-body">
              At Sentinel Africa Consulting, we are driven by a profound belief in the power of
              talent and the transformational impact of education. We understand that untapped
              potential exists in every corner of our society, and we are committed to nurturing it.
            </p>
            <p className="svc-body">
              The Sentinel Talent Shield Program extends a helping hand to gifted but
              underprivileged individuals who are either joining the university or in their first
              year at the university. Our mission is clear: to provide holistic support that not
              only covers tuition scholarships but also includes essential career guidance and
              development.
            </p>
            <p className="svc-body">
              We are dedicated to creating a nurturing environment of empowerment through access to
              education and mentorship opportunities. If you are a talented, motivated individual
              who dreams of achieving greatness, we invite you to be a part of the Sentinel Talent
              Shield program.
            </p>
          </Reveal>
        </div>
        <div className="site-container">
          <ul className="shield-benefits">
            {benefits.map(({ icon: Icon, title, text }) => (
              <li key={title}>
                <span>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="eligibility" className="svc-section" aria-labelledby="eligibility-title">
        <div className="site-container shield-eligibility-layout">
          <Reveal>
            <p className="eyebrow">Eligibility criteria</p>
            <h2 id="eligibility-title">Who can apply</h2>
            <ul className="svc-checklist shield-eligibility">
              {eligibility.map((item) => (
                <li key={item}>
                  <span>
                    <Check size={14} aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Application stages</p>
            <h2>From application to award</h2>
            <ol className="shield-stages">
              {stages.map((text, index) => (
                <li key={text}>
                  <span className="shield-stage-badge" aria-hidden="true">
                    <small>Stage</small>
                    {index + 1}
                  </span>
                  <p>
                    <strong className="shield-stage-label">Stage {index + 1}. </strong>
                    {text}
                  </p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section id="enquiries" className="svc-section is-pale" aria-labelledby="enquiries-title">
        <div className="site-container shield-enquiries-layout">
          <Reveal>
            <div className={`shield-status ${applicationsOpen ? "is-open" : "is-closed"}`}>
              <Lock size={20} aria-hidden="true" />
              <div>
                <p className="shield-status-title">
                  {applicationsOpen ? "Applications are open" : "Applications are currently closed"}
                </p>
                <p>
                  {applicationsOpen
                    ? "Contact us below to start your application."
                    : "Follow us or get in touch to hear when the next cohort opens."}
                </p>
              </div>
            </div>
            <h2 id="enquiries-title">All enquiries are welcome</h2>
            <ul className="shield-contacts">
              <li>
                <a
                  href={`https://wa.me/${enquiries.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <MessageCircle size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <small>WhatsApp</small>
                    {enquiries.whatsapp}
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${enquiries.email}`}>
                  <span>
                    <Mail size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <small>Email</small>
                    {enquiries.email}
                  </span>
                </a>
              </li>
            </ul>
            <div className="shield-links">
              <a className="text-link" href={`${sdgPage}#quality-education`}>
                <BookOpen size={16} aria-hidden="true" /> Our commitment to quality education
              </a>
              <a className="text-link" href={careersPage}>
                Careers at Sentinel Africa <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <VideoEmbed
              videoId="6MunfAi8ehg"
              title="Talent Shield Scholarship program First Graduant from the University of Nairobi Celebration"
              poster={videoPoster}
            />
            <p className="shield-video-caption">
              Celebrating the programme’s first graduate from the University of Nairobi.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="careers-equal-section" aria-labelledby="privacy-title">
        <div className="site-container">
          <h2 id="privacy-title" className="shield-privacy-title">
            Privacy statement
          </h2>
          <p className="careers-equal">
            The Sentinel Talent Shield Program is meant to grow and nurture special talent within
            Kenya. The application process will require that you share your personal data with us.
            We only collect information that we deem necessary in order to make the selection
            process possible and we will store and dispose of it securely at the end of the process.
          </p>
        </div>
      </section>

      <PageCta />
    </InnerPage>
  );
}
