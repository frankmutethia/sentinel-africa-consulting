import { useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  CalendarDays,
  Download,
  GraduationCap,
  MonitorPlay,
  Presentation,
  Users,
} from "lucide-react";
import physicalArt from "@/assets/services/format-physical.jpg";
import virtualArt from "@/assets/services/format-virtual.jpg";
import selfStudyArt from "@/assets/services/format-self-study.jpg";
import classVideoPoster from "@/assets/services/video-cdpo-class.jpg";
import upcomingVideoPoster from "@/assets/services/video-cdpo-upcoming.jpg";
import pecbLogo from "@/assets/logos/PECB.png";
import certiTrustLogo from "@/assets/logos/HD_Certi-Trust_Logo-Squared-Transparent-1_opt-3.png";
import trainingCalendar from "@/assets/services/sati-training-calendar-2026.pdf";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { courseAreas } from "./trainingCourses";
import { contactLink } from "./navigation";
import { Reveal } from "./Reveal";
import { OtherServices, SectionHeading } from "./ServiceBlocks";
import { VideoEmbed } from "./VideoEmbed";
import "./training.css";

const courseCount = courseAreas.reduce(
  (total, area) => total + area.groups.reduce((sum, group) => sum + group.courses.length, 0),
  0,
);

const formats = [
  { title: "Physical Instructor-Led", image: physicalArt, icon: Users },
  { title: "Virtual Instructor-Led", image: virtualArt, icon: MonitorPlay },
  { title: "Self-Study", image: selfStudyArt, icon: BookOpen },
];

function CourseCatalogue() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const last = courseAreas.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="training-catalogue">
      <div className="training-tabs" role="tablist" aria-label="Training areas">
        {courseAreas.map((area, index) => (
          <button
            key={area.id}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`tab-${area.id}`}
            aria-selected={active === index}
            aria-controls={`panel-${area.id}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={onKeyDown}
          >
            <img src={area.image} alt="" width="40" height="40" />
            <span>
              <small>{area.short}</small>
              {area.title}
            </span>
          </button>
        ))}
      </div>
      {courseAreas.map((area, index) => (
        <div
          key={area.id}
          role="tabpanel"
          id={`panel-${area.id}`}
          aria-labelledby={`tab-${area.id}`}
          hidden={active !== index}
          className="training-panel"
        >
          <div className="training-panel-head">
            <img src={area.image} alt="" width="120" height="120" />
            <div>
              <h3>{area.title}</h3>
              <a href={contactLink("Training")} className="text-link">
                Book a course in this area <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <div className="training-standards">
            {area.groups.map((group) => (
              <div key={group.standard} className="training-standard-block">
                <p className="training-standard">{group.standard}</p>
                <ul>
                  {group.courses.map((course) => (
                    <li key={course}>
                      <GraduationCap size={18} strokeWidth={1.6} aria-hidden="true" />
                      {course}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarDownload({ light = false }: { light?: boolean }) {
  return (
    <a
      href={trainingCalendar}
      className={light ? "button training-calendar-button" : "button"}
      download="Sentinel-Africa-2026-Training-Calendar.pdf"
    >
      View and Download Our 2026 Training Calendar <Download size={16} />
    </a>
  );
}

export default function TrainingPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Our Services"]}
        eyebrow="Book Both Public and In-house – Physical, Virtual, or Self Study"
        title="Training"
        lead={
          <>
            <p>
              We offer a diverse range of certification and awareness training programs to empower
              organizations and professionals with the knowledge and expertise they need to excel in
              today’s dynamic business environment.
            </p>
            <div className="training-accreditation">
              <p>
                As an affiliated training center with renowned certification bodies such as PECB,
                and Certi-Trust, we ensure that our training is of the highest quality, globally
                recognized, and aligned with industry standards.
              </p>
              <div className="training-accreditation-logos">
                <img src={pecbLogo} alt="PECB" width="479" height="105" />
                <img src={certiTrustLogo} alt="Certi-Trust" width="70" height="72" />
              </div>
            </div>
          </>
        }
        actions={
          <>
            <a href="#courses" className="button">
              Browse courses <ArrowDown size={16} />
            </a>
            <a href={contactLink("Training")} className="text-link">
              Book a training <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="training-hero-media">
            <VideoEmbed
              videoId="q0BFEcHWgy4"
              title="Data protection act kenya | GDPR | CDPO - Training"
              poster={classVideoPoster}
            />
            <dl className="svc-hero-facts">
              <div>
                <dt>{courseAreas.length}</dt>
                <dd>Training areas</dd>
              </div>
              <div>
                <dt>{courseCount}</dt>
                <dd>Certification courses</dd>
              </div>
              <div>
                <dt>{formats.length}</dt>
                <dd>Learning formats</dd>
              </div>
            </dl>
          </div>
        }
      />

      <section id="courses" className="svc-section" aria-labelledby="courses-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Certification programmes"
            id="courses-title"
            title="From engaging sessions to practical knowledge-sharing,"
            accent="our training is designed to make learning enjoyable and understandable."
          />
          <Reveal>
            <CourseCatalogue />
          </Reveal>
        </div>
      </section>

      <section className="training-calendar-band" aria-labelledby="calendar-title">
        <div className="site-container training-calendar-layout">
          <span className="training-calendar-icon" aria-hidden="true">
            <CalendarDays size={30} strokeWidth={1.4} />
          </span>
          <div>
            <p className="eyebrow">Plan ahead</p>
            <h2 id="calendar-title">Our Training Calendar</h2>
          </div>
          <CalendarDownload light />
        </div>
      </section>

      <section className="svc-section is-pale" aria-labelledby="formats-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Our Training Formats"
            id="formats-title"
            title="Learn in the format"
            accent="that suits you."
            note="We offer both public classes and in-house to suit your specific requirements, available in different formats to provide you with flexibility and convenience in choosing the best learning environment."
          />
          <ul className="training-formats">
            {formats.map((format, index) => (
              <li key={format.title}>
                <Reveal delay={index * 80} className="training-format">
                  <div className="training-format-image">
                    <img src={format.image} alt="" loading="lazy" />
                  </div>
                  <div className="training-format-label">
                    <span>
                      <format.icon size={20} strokeWidth={1.6} />
                    </span>
                    <h3>{format.title}</h3>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
          <div className="training-modes">
            <span>
              <Presentation size={16} aria-hidden="true" /> Public classes
            </span>
            <span>
              <Users size={16} aria-hidden="true" /> In-house for your team
            </span>
          </div>
        </div>
      </section>

      <section className="svc-section" aria-labelledby="cdpo-title">
        <div className="site-container training-feature">
          <Reveal>
            <VideoEmbed
              videoId="GgjLCbkVYB4"
              title="Learn the Data protection act Kenya - Become a Certified Data Protection Officer - CDPO Training"
              poster={upcomingVideoPoster}
            />
          </Reveal>
          <Reveal delay={120}>
            <p className="eyebrow">Upcoming training</p>
            <h2 id="cdpo-title">
              Become a Certified
              <br />
              <span className="blue-text">Data Protection Officer.</span>
            </h2>
            <p className="svc-body">
              Learn the Data protection act Kenya - Become a Certified Data Protection Officer -
              CDPO Training.
            </p>
            <div className="svc-actions">
              <a href={contactLink("Training")} className="button">
                Book CDPO training <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="svc-section is-pale" aria-labelledby="commitment-title">
        <div className="site-container training-commitment">
          <Reveal>
            <p className="eyebrow">Our commitment</p>
            <h2 id="commitment-title">
              Continuous improvement
              <br />
              <span className="blue-text">and professional growth.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="svc-body">
              At Sentinel Africa, we are committed to empowering professionals and organizations
              with the skills and knowledge they need to excel in their domains. Our expert trainers
              bring a wealth of experience to the classroom, ensuring an engaging and impactful
              learning experience. Join us on a journey of continuous improvement and professional
              growth, and let our comprehensive training programs propel you toward success in your
              chosen field.
            </p>
            <div className="svc-actions">
              <a href={contactLink("Training")} className="button">
                Book a training <ArrowRight size={17} />
              </a>
              <a
                href={trainingCalendar}
                className="text-link"
                download="Sentinel-Africa-2026-Training-Calendar.pdf"
              >
                Download the 2026 calendar <Download size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <OtherServices current="Training" />

      <PageCta interest="Training" />
    </InnerPage>
  );
}
