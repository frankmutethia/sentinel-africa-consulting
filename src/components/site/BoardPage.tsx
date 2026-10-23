import { ArrowDown, ArrowRight } from "lucide-react";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { homeSection } from "./navigation";
import { Reveal } from "./Reveal";
import "./board.css";
import { directors } from "@/content/board";

const composition = (["Chair", "Non-executive", "Executive"] as const).map((role) => ({
  role,
  count: directors.filter((director) => director.role === role).length,
}));

export default function BoardPage() {
  return (
    <InnerPage>
      <PageHero
        trail={["About Us"]}
        eyebrow="Leadership"
        title="Our Board"
        lead={
          <p>
            The directors who guide Sentinel Africa Consulting’s strategy, governance and long-term
            direction.
          </p>
        }
        actions={
          <>
            <a href="#directors" className="button">
              Meet the board <ArrowDown size={16} />
            </a>
            <a href={homeSection("/", "contact")} className="text-link">
              Talk to our consultants <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="board-summary">
            <p className="board-summary-total">
              <strong>{directors.length}</strong> directors
            </p>
            <dl>
              {composition.map((item) => (
                <div key={item.role}>
                  <dt>{item.role === "Chair" ? "Board chair" : `${item.role} directors`}</dt>
                  <dd>{item.count}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      <section
        id="directors"
        className="board-section section-space"
        aria-labelledby="directors-title"
      >
        <div className="site-container">
          <Reveal className="section-heading">
            <div>
              <p className="eyebrow">Board of directors</p>
              <h2 id="directors-title">
                Experience that guides.
                <br />
                <span className="blue-text">Governance you can trust.</span>
              </h2>
            </div>
          </Reveal>
          <ul className="board-grid">
            {directors.map((director, index) => (
              <li key={director.name}>
                <Reveal delay={(index % 3) * 80} className="board-reveal">
                  <article className={`board-card ${director.role === "Chair" ? "is-chair" : ""}`}>
                    <div className="board-photo">
                      <img
                        src={director.photo}
                        alt={`Portrait of ${director.name}`}
                        loading="lazy"
                        width="640"
                        height="960"
                      />
                      <span className="board-role">{director.role}</span>
                    </div>
                    <div className="board-info">
                      <h3>{director.name}</h3>
                      <p>{director.title}</p>
                    </div>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PageCta />
    </InnerPage>
  );
}
