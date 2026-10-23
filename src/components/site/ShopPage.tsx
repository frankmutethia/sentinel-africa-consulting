import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Clock,
  GraduationCap,
  Laptop,
  ShieldCheck,
} from "lucide-react";
import shopBanner from "@/assets/services/shop-banner.jpg";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { contactLink, servicePages } from "./navigation";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ServiceBlocks";
import { courseAreas } from "./trainingCourses";
import "./shop.css";

const trainingPage = servicePages.find((page) => page.label === "Training")!.href;

// Why self-study, summarised from the Training page's formats.
const perks = [
  { icon: Clock, title: "Learn at your pace", text: "Study when and where it suits you." },
  { icon: Laptop, title: "Fully online", text: "Course material available wherever you are." },
  {
    icon: ShieldCheck,
    title: "Certification ready",
    text: "Prepare for internationally recognized certifications.",
  },
];

export default function ShopPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["Resources"]}
        eyebrow="Certified self-study trainings"
        title="Shop"
        lead={
          <p>
            Explore Knowledge in the Digital Era: Your Gateway to Seamless Learning and Discovery!
          </p>
        }
        actions={
          <>
            <a href="#catalogue" className="button">
              Browse self-study courses <ArrowDown size={16} />
            </a>
            <a href={contactLink("Training")} className="text-link">
              Ask about enrolment <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="shop-hero">
            <img
              src={shopBanner}
              alt="Certified self-study trainings from Sentinel Africa"
              width="1280"
              height="320"
            />
          </div>
        }
      />

      <section className="shop-perks" aria-label="Why self-study">
        <ul className="site-container shop-perks-list">
          {perks.map((perk) => (
            <li key={perk.title}>
              <span>
                <perk.icon size={22} strokeWidth={1.6} />
              </span>
              <div>
                <strong>{perk.title}</strong>
                <p>{perk.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="catalogue" className="svc-section" aria-labelledby="catalogue-title">
        <div className="site-container">
          <SectionHeading
            eyebrow="Self-study catalogue"
            id="catalogue-title"
            title="Certified self-study"
            accent="trainings."
            note="Online checkout is coming to this site. Until then, our team will enrol you directly: choose a course and request a callback."
          />
          <div className="shop-grid">
            {courseAreas.map((area, index) => (
              <Reveal key={area.id} delay={(index % 2) * 80} className="shop-area">
                <div className="shop-area-head">
                  <img src={area.image} alt="" width="72" height="72" loading="lazy" />
                  <div>
                    <small>{area.short}</small>
                    <h3>{area.title}</h3>
                  </div>
                </div>
                {area.groups.map((group) => (
                  <div key={group.standard} className="shop-standard">
                    <p>{group.standard}</p>
                    <ul>
                      {group.courses.map((course) => (
                        <li key={course}>
                          <span className="shop-course-name">
                            <GraduationCap size={17} strokeWidth={1.6} aria-hidden="true" />
                            {course}
                          </span>
                          <span className="shop-course-tag">
                            <BookOpen size={13} aria-hidden="true" /> Self-study
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <a href={contactLink("Training")} className="button shop-area-button">
                  Enquire about these courses <ArrowRight size={17} />
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="shop-note">
              <p>
                Prefer a classroom? We also run physical and virtual instructor-led classes, public
                and in-house.
              </p>
              <a href={trainingPage} className="text-link">
                See all training formats <ArrowRight size={17} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <PageCta interest="Training" />
    </InnerPage>
  );
}
