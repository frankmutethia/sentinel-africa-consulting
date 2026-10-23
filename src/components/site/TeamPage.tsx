import { ArrowDown, ArrowRight, ArrowUpRight, Linkedin, Mail, Twitter } from "lucide-react";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { homeSection } from "./navigation";
import { Reveal } from "./Reveal";
import "./team.css";
import { members, type Member } from "@/content/team";

function ContactLinks({ member }: { member: Member }) {
  return (
    <div className="team-contacts">
      {member.linkedin && (
        <a
          href={member.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn (opens in a new tab)`}
        >
          <Linkedin size={16} />
        </a>
      )}
      {member.twitter && (
        <a
          href={member.twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on X (Twitter) (opens in a new tab)`}
        >
          <Twitter size={16} />
        </a>
      )}
      <a href={`mailto:${member.email}`} aria-label={`Email ${member.name}`}>
        <Mail size={16} />
      </a>
    </div>
  );
}

export default function TeamPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["About Us"]}
        eyebrow="Our people"
        title="Our Team"
        lead={
          <p>
            The practitioners who lead Sentinel Africa’s work with clients, in Africa and beyond.
          </p>
        }
        actions={
          <>
            <a href="#members" className="button">
              Meet the team <ArrowDown size={16} />
            </a>
            <a href={homeSection("/", "contact")} className="text-link">
              Talk to our consultants <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <nav className="team-roster" aria-label="Team profiles">
            <p className="team-roster-label">Leadership team</p>
            <ul>
              {members.map((member) => (
                <li key={member.id}>
                  <a href={`#${member.id}`}>
                    <img src={member.photo} alt="" width="48" height="48" />
                    <span>
                      <strong>{member.name}</strong>
                      <small>{member.title}</small>
                    </span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        }
      />

      <section id="members" className="team-section section-space" aria-labelledby="members-title">
        <div className="site-container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">Our team</p>
              <h2 id="members-title">
                Deep expertise.
                <br />
                <span className="blue-text">Working in the trenches with you.</span>
              </h2>
            </div>
          </Reveal>
          <ul className="team-grid">
            {members.map((member, index) => (
              <li key={member.id}>
                <Reveal delay={index * 80} className="team-reveal">
                  <article className="team-card">
                    <a
                      href={`#${member.id}`}
                      className="team-photo"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      <img src={member.photo} alt="" loading="lazy" width="640" height="960" />
                    </a>
                    <div className="team-info">
                      <h3>{member.name}</h3>
                      <p>{member.title}</p>
                    </div>
                    <div className="team-card-footer">
                      <ContactLinks member={member} />
                      <a
                        href={`#${member.id}`}
                        className="team-profile-link"
                        aria-label={`Read ${member.name}’s profile`}
                      >
                        Profile <ArrowDown size={14} />
                      </a>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="team-profiles section-space" aria-labelledby="profiles-title">
        <div className="site-container">
          <Reveal>
            <p className="eyebrow">Profiles</p>
            <h2 id="profiles-title">Get to know the team.</h2>
          </Reveal>
          <div className="team-profile-list">
            {members.map((member) => (
              <article
                key={member.id}
                id={member.id}
                className="team-profile"
                aria-labelledby={`${member.id}-name`}
              >
                <Reveal className="team-profile-photo">
                  <img
                    src={member.photo}
                    alt={`Portrait of ${member.name}`}
                    loading="lazy"
                    width="640"
                    height="960"
                  />
                </Reveal>
                <Reveal delay={100} className="team-profile-copy">
                  <p className="team-profile-title">{member.title}</p>
                  <h3 id={`${member.id}-name`}>{member.name}</h3>
                  {member.bio.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                  <ContactLinks member={member} />
                </Reveal>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PageCta />
    </InnerPage>
  );
}
