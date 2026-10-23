import type { CSSProperties, ReactNode } from "react";
import {
  Accessibility,
  ArrowDown,
  ArrowRight,
  Baby,
  BookOpen,
  CircleDollarSign,
  HandHeart,
  Scale,
  Users,
} from "lucide-react";
import educationPhoto from "@/assets/sdg/quality-education.jpg";
import genderPhoto from "@/assets/sdg/gender-equality.jpg";
import inequalityPhoto from "@/assets/sdg/reduced-inequalities.jpg";
import { InnerPage, PageCta, PageHero } from "./InnerPage";
import { homeSection } from "./navigation";
import { Reveal } from "./Reveal";
import "./sdg.css";

// Official UN SDG colours for the three goals.
const goals = [
  {
    number: 4,
    name: "Quality Education",
    colour: "#c5192d",
    icon: BookOpen,
    id: "quality-education",
  },
  { number: 5, name: "Gender Equality", colour: "#ff3a21", icon: Users, id: "gender-equality" },
  {
    number: 10,
    name: "Reduced Inequality",
    colour: "#dd1367",
    icon: Scale,
    id: "reduced-inequality",
  },
];

// Transcribed from the published "Gender Equality" panel: share of men and women.
const genderSplit = [
  { team: "Sentinel’s Staff Team", men: 48, women: 52 },
  { team: "Sentinel’s Board Members", men: 43, women: 57 },
  { team: "Sentinel’s Senior Management Team", men: 33, women: 67 },
  { team: "Sentinel’s Middle Management Team", men: 42, women: 58 },
];

// Transcribed from the published "Reduced Inequalities" panel.
const inequalityCommitments = [
  { icon: CircleDollarSign, text: "Sentinel Africa has equal pay for equal work" },
  { icon: Accessibility, text: "Sentinel Africa office Rainbow Tower has disability access" },
  { icon: Baby, text: "Maternity Leave Days – 90 days + 3 months remote working. Full pay" },
  {
    icon: HandHeart,
    text: "Sentinel Africa does not discriminate on Country, Age, Race, Religion, or Disability.",
  },
];

function GoalBadge({ goal }: { goal: (typeof goals)[number] }) {
  return (
    <span className="sdg-badge" style={{ "--goal": goal.colour } as CSSProperties}>
      <goal.icon size={18} strokeWidth={1.8} aria-hidden="true" />
      SDG {goal.number} · {goal.name}
    </span>
  );
}

function GoalSection({
  goal,
  photo,
  photoAlt,
  reverse = false,
  children,
}: {
  goal: (typeof goals)[number];
  photo: string;
  photoAlt: string;
  reverse?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={goal.id}
      className={`sdg-goal ${reverse ? "is-reversed" : ""}`}
      style={{ "--goal": goal.colour } as CSSProperties}
      aria-labelledby={`${goal.id}-title`}
    >
      <div className="site-container sdg-goal-layout">
        <Reveal className="sdg-goal-photo">
          <img src={photo} alt={photoAlt} loading="lazy" width="436" height="768" />
          <span className="sdg-goal-number" aria-hidden="true">
            {goal.number}
          </span>
        </Reveal>
        <Reveal delay={120} className="sdg-goal-copy">
          {children}
        </Reveal>
      </div>
    </section>
  );
}

export default function SdgPage() {
  const [education, gender, inequality] = goals as [
    (typeof goals)[number],
    (typeof goals)[number],
    (typeof goals)[number],
  ];
  return (
    <InnerPage>
      <PageHero
        trail={["Resources"]}
        eyebrow="Our commitment to sustainability"
        title="Our SDG’s Commitment"
        lead={
          <p>
            Our commitment to sustainability knows no bounds. We believe and acknowledge that we are
            a socially responsible organization committed to making a positive impact on the world.
          </p>
        }
        actions={
          <>
            <a href="#goals" className="button">
              Explore our goals <ArrowDown size={16} />
            </a>
            <a href={homeSection("/", "contact")} className="text-link">
              Partner with us <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <ul className="sdg-tiles" aria-label="Sustainable Development Goals we contribute to">
            {goals.map((goal) => (
              <li key={goal.number}>
                <a
                  href={`#${goal.id}`}
                  className="sdg-tile"
                  style={{ "--goal": goal.colour } as CSSProperties}
                >
                  <span className="sdg-tile-number">{goal.number}</span>
                  <goal.icon size={30} strokeWidth={1.5} aria-hidden="true" />
                  <span className="sdg-tile-name">{goal.name}</span>
                </a>
              </li>
            ))}
          </ul>
        }
      />

      <section id="goals" className="sdg-intro" aria-label="Our commitment">
        <div className="site-container sdg-intro-layout">
          <Reveal>
            <p className="sdg-intro-text">
              We recognize the significance of the United Nations’ Sustainable Development Goals
              (SDGs) and their role in addressing global challenges.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <p className="svc-body">
              In particular, we are deeply committed to contributing to SDG Goal 4: Quality
              Education, SDG Goal 5: Gender Equality, and SDG Goal 10: Reduced Inequality. Our
              commitment extends beyond business success; we strive to foster sustainable
              development in the communities we serve and are part of.
            </p>
          </Reveal>
        </div>
      </section>

      <GoalSection
        goal={education}
        photo={educationPhoto}
        photoAlt="A Sentinel Talent Shield scholar"
      >
        <GoalBadge goal={education} />
        <h2 id={`${education.id}-title`}>Sentinel Talent Shield</h2>
        <p className="svc-body">
          Sentinel believes that quality education is the foundation for individual empowerment and
          economic growth. It is to that effect that we provide scholarships and financial
          assistance to deserving students from marginalized backgrounds, enabling them to pursue
          higher education and unlock their potential.
        </p>
        <div className="sdg-panel">
          <p>
            We believe in the development of talent and the value of education in society. To this
            end, we have set up the Sentinel Talent Shield Program to offer support to talented but
            less fortunate students in an undergraduate program in Kenyan Universities.
          </p>
          <p>
            We are fully sponsoring two talented students (A Gentleman &amp; a Lady) by fully paying
            for their tuition, and their upkeep, and giving them opportunities for internships which
            often leads to job opportunities at Sentinel Africa. We intend to extend our reach to
            more than 2 persons per year to keep influencing our society and the future positively.
          </p>
        </div>
      </GoalSection>

      <GoalSection
        goal={gender}
        photo={genderPhoto}
        photoAlt="A member of the Sentinel Africa team"
        reverse
      >
        <GoalBadge goal={gender} />
        <h2 id={`${gender.id}-title`}>Gender Equality</h2>
        <p className="svc-body">
          Sentinel strives to foster an inclusive and equitable workplace and society through
          maintaining a diverse workforce and promoting a culture of inclusion where every employee
          feels valued and empowered. We actively encourage and support women’s representation in
          leadership roles within the organization and ensure that all employees, regardless of
          gender, receive fair and equal compensation for their work.
        </p>
        <dl className="sdg-split">
          <div className="sdg-split-legend" aria-hidden="true">
            <span className="is-women">Women</span>
            <span className="is-men">Men</span>
          </div>
          {genderSplit.map((row) => (
            <div key={row.team} className="sdg-split-row">
              <dt>{row.team}</dt>
              <dd>
                <span className="sdg-split-bar">
                  <span className="is-women" style={{ width: `${row.women}%` }}>
                    {row.women}%
                  </span>
                  <span className="is-men" style={{ width: `${row.men}%` }}>
                    {row.men}%
                  </span>
                </span>
                <span className="sr-only">
                  {row.women}% women, {row.men}% men
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </GoalSection>

      <GoalSection
        goal={inequality}
        photo={inequalityPhoto}
        photoAlt="A member of the Sentinel Africa team"
      >
        <GoalBadge goal={inequality} />
        <h2 id={`${inequality.id}-title`}>Reduced Inequalities</h2>
        <p className="svc-body">
          Sentinel acknowledges that reducing inequality is crucial for building sustainable and
          thriving societies. Within our organization, we maintain policies that promote fair
          treatment, equal opportunities, and a safe working environment for all employees. Beyond
          our organization, we work closely with our suppliers to ensure ethical sourcing practices,
          supporting fair wages and safe working conditions for all staff along the supply chain.
        </p>
        <ul className="sdg-commitments">
          {inequalityCommitments.map((item) => (
            <li key={item.text}>
              <span>
                <item.icon size={22} strokeWidth={1.6} aria-hidden="true" />
              </span>
              {item.text}
            </li>
          ))}
        </ul>
      </GoalSection>

      <PageCta />
    </InnerPage>
  );
}
