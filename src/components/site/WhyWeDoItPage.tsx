import { ArrowDown, ArrowRight, Quote } from "lucide-react";
import missionArt from "@/assets/why-we-do-it/mission.png";
import visionArt from "@/assets/why-we-do-it/vision.png";
import teamPhoto from "@/assets/why-we-do-it/team.jpg";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { homeSection } from "./navigation";
import { Reveal } from "./Reveal";
import "./why-we-do-it.css";

export default function WhyWeDoItPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["About Us"]}
        eyebrow="Our purpose"
        title="Why We Do It"
        lead={
          <p>
            Sentinel Africa Consulting was born out of a fervent desire to redefine risk management
            as a powerful and invaluable discipline. Having experienced both the misconceptions and
            the true value of risk management during their tenure in various corporate settings, the
            founders of this organization were driven to make a lasting impact.
          </p>
        }
        actions={
          <>
            <a href="#purpose" className="button">
              Our mission and vision <ArrowDown size={16} />
            </a>
            <a href={homeSection("/", "contact")} className="text-link">
              Talk to our consultants <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <figure className="why-quote">
            <Quote size={34} strokeWidth={1.2} aria-hidden="true" />
            <blockquote>
              Welcome to a consultancy experience where risk management becomes an{" "}
              <span>enabler rather than a constraint.</span>
            </blockquote>
            <figcaption>Sentinel Africa Consulting</figcaption>
          </figure>
        }
      />

      <section className="why-story section-space" aria-labelledby="story-title">
        <div className="site-container why-story-layout">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2 id="story-title">
              Born from practice.
              <br />
              <span className="blue-text">Driven to make a lasting impact.</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="why-body">
              In their roles as Risk Management practitioners, they witnessed the reluctance of some
              business managers who perceived risk management as an impediment to growth and an
              overly restrictive process. This perception sparked the founders’ aspiration to
              educate and evangelize the essence of risk management across organizations of all
              kinds.
            </p>
            <p className="why-body">
              Their day-to-day work fueled their passion to demystify the value proposition of
              effective risk management, aiming to empower individuals from diverse backgrounds to
              embrace its principles. Rather than imposing predefined risk assessments, the founders
              championed a participatory approach that benefits both organizations and consultants.
              This approach involves collaboratively uncovering the most fundamental risk areas and
              fully embracing the life cycle of risk management to unlock the true benefits of an
              embedded risk management framework.
            </p>
          </Reveal>
        </div>
      </section>

      <section
        id="purpose"
        className="why-purpose section-space"
        aria-label="Our mission and vision"
      >
        <div className="site-container why-purpose-grid">
          <Reveal className="why-purpose-reveal">
            <article className="why-purpose-card">
              <div className="why-purpose-art">
                <img
                  src={missionArt}
                  alt="Mission illustration"
                  loading="lazy"
                  width="1000"
                  height="438"
                />
              </div>
              <p className="eyebrow">Our mission</p>
              <h2>We are in the business of helping our clients create and protect value.</h2>
              <p>
                This involves understanding the client’s unique issues, tailoring solutions to
                resolve those issues, and embedding a sustainable and continuously improving
                management system within the entity.
              </p>
            </article>
          </Reveal>
          <Reveal delay={100} className="why-purpose-reveal">
            <article className="why-purpose-card">
              <div className="why-purpose-art">
                <img
                  src={visionArt}
                  alt="Vision illustration"
                  loading="lazy"
                  width="1000"
                  height="438"
                />
              </div>
              <p className="eyebrow">Our vision</p>
              <h2>To be the Advisor of Choice</h2>
              <p>
                Our purpose at Sentinel Africa is to help our clients to build better-run companies.
                To make our clients win!
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="why-commitment section-space" aria-labelledby="commitment-title">
        <div className="site-container why-commitment-layout">
          <div>
            <Reveal>
              <p className="eyebrow">Our commitment</p>
              <h2 id="commitment-title">
                A partner in your
                <br />
                <span className="blue-text">risk management journey.</span>
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="why-body">
                Sentinel Africa Consulting stands firm in its commitment to being a partner in your
                risk management journey. We understand that each organization has unique challenges,
                and we are dedicated to providing tailored solutions that empower you to navigate
                uncertainty with confidence. Our mission is to equip you with the knowledge and
                tools to proactively identify, assess, and mitigate risks, ensuring a path to
                sustainable growth and success.
              </p>
              <p className="why-body">
                Welcome to a consultancy experience where risk management becomes an enabler rather
                than a constraint. At Sentinel Africa, we are passionate about creating a culture of
                risk intelligence, empowering you to embrace risks as opportunities and build a
                resilient future for your organization. Together, let us unlock the true potential
                of risk management and embrace a future of informed decisions and sustainable
                growth.
              </p>
            </Reveal>
          </div>
          <Reveal delay={150} className="why-team">
            <img
              src={teamPhoto}
              alt="The Sentinel Africa Consulting team"
              loading="lazy"
              width="1280"
              height="847"
            />
          </Reveal>
        </div>
      </section>

      <PageCta />
    </InnerPage>
  );
}
