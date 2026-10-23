import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  Clock3,
  GraduationCap,
  Mail,
  MapPin,
  Paperclip,
  Send,
  Target,
} from "lucide-react";
import { InnerPage, PageHero } from "./InnerPage";
import { careersPage, talentShieldPage } from "./navigation";
import { Reveal } from "./Reveal";
import { careersEmail, formatDeadline, isOpen, roles, type Role } from "./careers";
import "./services.css";
import "./careers.css";

const roleUrl = (slug: string) => `${careersPage}?role=${slug}`;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Fields = Record<"name" | "email" | "phone" | "area" | "link" | "message", string>;
const blank: Fields = { name: "", email: "", phone: "", area: "", link: "", message: "" };

/**
 * Prepares an application in the visitor's email app, like the homepage callback form.
 * Nothing is stored by the website; the visitor attaches their documents and sends it.
 */
function ApplicationForm({ role }: { role?: Role }) {
  const [fields, setFields] = useState<Fields>(blank);
  const [errors, setErrors] = useState<Partial<Fields>>({});
  const [sentTo, setSentTo] = useState<string | null>(null);
  const prefix = role ? "apply" : "interest";
  const to = role ? role.applyTo : careersEmail;
  const set = (key: keyof Fields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found: Partial<Fields> = {};
    if (!fields.name.trim()) found.name = "Enter your full name.";
    if (!emailPattern.test(fields.email.trim())) found.email = "Enter a valid email address.";
    if (fields.phone.replace(/\D/g, "").length < 7) found.phone = "Enter a phone number.";
    if (!role && !fields.area.trim()) found.area = "Tell us the kind of role you’re interested in.";
    if (fields.message.trim().length < 20)
      found.message = "Write a short note about yourself (at least 20 characters).";
    setErrors(found);
    const first = (Object.keys(found) as (keyof Fields)[])[0];
    if (first) {
      document.getElementById(`${prefix}-${first}`)?.focus();
      return;
    }
    const subject = role
      ? `Application: ${role.title}`
      : `Expression of interest: ${fields.area.trim()}`;
    const attachments = role ? role.submit.map((item) => `- ${item}`).join("\n") : "- My CV";
    const body = [
      "Hello Sentinel Africa,",
      "",
      role
        ? `I would like to apply for the ${role.title} role.`
        : `I would like to register my interest in future roles: ${fields.area.trim()}.`,
      "",
      `Name: ${fields.name.trim()}`,
      `Email: ${fields.email.trim()}`,
      `Phone: ${fields.phone.trim()}`,
      ...(fields.link.trim() ? [`Profile or portfolio: ${fields.link.trim()}`] : []),
      "",
      fields.message.trim(),
      "",
      "Attached:",
      attachments,
      "",
      "Thank you.",
    ].join("\n");
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSentTo(to);
  };

  const field = (
    key: keyof Fields,
    label: string,
    input: ReactNode,
    hint?: string,
    wide = false,
  ) => (
    <div className={`careers-field ${wide ? "is-wide" : ""}`}>
      <label htmlFor={`${prefix}-${key}`}>{label}</label>
      {input}
      {errors[key] ? (
        <p className="careers-error" id={`${prefix}-${key}-error`}>
          {errors[key]}
        </p>
      ) : (
        hint && <p className="careers-hint">{hint}</p>
      )}
    </div>
  );
  const inputProps = (key: keyof Fields) => ({
    id: `${prefix}-${key}`,
    value: fields[key],
    onChange: (event: { target: { value: string } }) => set(key)(event.target.value),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${prefix}-${key}-error` : undefined,
  });

  return (
    <form className="careers-form" onSubmit={submit} noValidate>
      <div className="careers-fields">
        {field("name", "Full name", <input {...inputProps("name")} autoComplete="name" />)}
        {field(
          "email",
          "Email address",
          <input {...inputProps("email")} type="email" autoComplete="email" />,
        )}
        {field(
          "phone",
          "Phone number",
          <input {...inputProps("phone")} type="tel" autoComplete="tel" />,
        )}
        {role
          ? field(
              "link",
              "LinkedIn or portfolio (optional)",
              <input {...inputProps("link")} type="url" placeholder="https://" />,
            )
          : field(
              "area",
              "Kind of role",
              <input {...inputProps("area")} placeholder="e.g. Information security consultant" />,
            )}
        {field(
          "message",
          role ? "Why you’re a fit" : "About you",
          <textarea {...inputProps("message")} rows={5} />,
          role
            ? "Summarise your experience for this role."
            : "Your experience, skills and the work you’d like to do.",
          true,
        )}
      </div>
      <p className="careers-attach">
        <Paperclip size={15} aria-hidden="true" />
        <span>
          Your email app opens with your application written out.{" "}
          {role
            ? "Attach the documents listed above before sending."
            : "Attach your CV before sending."}
        </span>
      </p>
      <button type="submit" className="button">
        {role ? "Prepare my application" : "Send my details"} <Send size={16} />
      </button>
      {sentTo && (
        <p className="careers-sent" role="status">
          <Check size={16} aria-hidden="true" />
          <span>
            Your email app should now be open. If it isn’t, email your application to{" "}
            <a href={`mailto:${sentTo}`}>{sentTo}</a>.
          </span>
        </p>
      )}
    </form>
  );
}

function RoleMeta({ role }: { role: Role }) {
  const open = isOpen(role);
  return (
    <ul className="careers-meta">
      <li>
        <BriefcaseBusiness size={15} aria-hidden="true" /> {role.type}
      </li>
      <li>
        <MapPin size={15} aria-hidden="true" /> {role.location}
      </li>
      {role.term && (
        <li>
          <Clock3 size={15} aria-hidden="true" /> {role.term}
        </li>
      )}
      <li className={open ? "is-open" : "is-closed"}>
        <CalendarClock size={15} aria-hidden="true" />
        {open
          ? `Apply by ${formatDeadline(role.deadline)}`
          : `Closed ${formatDeadline(role.deadline)}`}
      </li>
    </ul>
  );
}

function RoleCard({ role }: { role: Role }) {
  const open = isOpen(role);
  return (
    <li className={`careers-card ${open ? "" : "is-closed"}`}>
      <div className="careers-card-top">
        <span className={`careers-status ${open ? "is-open" : "is-closed"}`}>
          {open ? "Open" : "Closed"}
        </span>
      </div>
      <h3>{role.title}</h3>
      <p>{role.summary}</p>
      <RoleMeta role={role} />
      <a className={open ? "button" : "text-link"} href={roleUrl(role.slug)}>
        {open ? "View role and apply" : "View role"} <ArrowRight size={16} />
      </a>
    </li>
  );
}

const shieldPoints = [
  { icon: GraduationCap, text: "Constantly trained" },
  { icon: Award, text: "Recognised and rewarded" },
  { icon: Target, text: "Challenged with meaningful assignments" },
];

function EqualOpportunity() {
  return (
    <p className="careers-equal">
      We are committed to recruiting the best qualified, best-fit personnel and to maintaining a
      pool of human resources according to the manpower requirement and planning of the company. We
      provide all our applicants with equal opportunities for employment. Job applicants are treated
      fairly and equally. Employment is offered only to the best qualified applicants with reference
      to their merits and abilities to meet the requirements of the jobs irrespective of whether
      they are referrals or direct applicants.
    </p>
  );
}

function RoleView({ role }: { role: Role }) {
  const open = isOpen(role);
  return (
    <InnerPage>
      <section className="careers-role-hero" aria-labelledby="page-title">
        <div className="site-container">
          <nav aria-label="Breadcrumb" className="page-breadcrumb">
            <a href="/">Home</a>
            <span>
              <span aria-hidden="true">/</span> Careers
            </span>
            <span>
              <span aria-hidden="true">/</span> <a href={careersPage}>Join our Team</a>
            </span>
            <span aria-current="page">
              <span aria-hidden="true">/</span> {role.title}
            </span>
          </nav>
          <a className="careers-back" href={`${careersPage}#opportunities`}>
            <ArrowLeft size={15} aria-hidden="true" /> All opportunities
          </a>
          <p className="eyebrow">{open ? "Open opportunity" : "Closed opportunity"}</p>
          <h1 id="page-title">{role.title}</h1>
          <RoleMeta role={role} />
        </div>
      </section>

      <section className="svc-section careers-role" aria-label="Role details">
        <div className="site-container careers-role-layout">
          <article className="careers-role-body">
            {role.sections.map((section) => (
              <section key={section.heading} className="careers-role-section">
                <h2>{section.heading}</h2>
                {section.text?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.list &&
                  (section.numbered ? (
                    <ol className="careers-list is-numbered">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="careers-list">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ))}
                {section.groups && (
                  <ol className="careers-groups">
                    {section.groups.map((group) => (
                      <li key={group.title}>
                        <h3>{group.title}</h3>
                        <ul className="careers-list">
                          {group.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
            <EqualOpportunity />
          </article>

          <aside className="careers-apply" aria-labelledby="apply-title">
            <h2 id="apply-title">{open ? "Apply for this role" : "Applications closed"}</h2>
            {open ? (
              <>
                <p className="careers-apply-lead">
                  Applications close on <strong>{formatDeadline(role.deadline)}</strong> and go to{" "}
                  <a href={`mailto:${role.applyTo}`}>{role.applyTo}</a>.
                </p>
                <p className="careers-apply-subhead">Include in your application</p>
                <ul className="svc-checklist careers-submit">
                  {role.submit.map((item) => (
                    <li key={item}>
                      <span>
                        <Check size={14} aria-hidden="true" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <ApplicationForm role={role} />
              </>
            ) : (
              <>
                <p className="careers-apply-lead">
                  This opportunity closed on <strong>{formatDeadline(role.deadline)}</strong>. It is
                  kept here for reference.
                </p>
                <a className="button" href={`${careersPage}#register-interest`}>
                  Register your interest <ArrowRight size={16} />
                </a>
              </>
            )}
          </aside>
        </div>
      </section>
    </InnerPage>
  );
}

function ListView() {
  const open = roles.filter((role) => isOpen(role));
  const closed = roles
    .filter((role) => !isOpen(role))
    .sort((a, b) => b.deadline.localeCompare(a.deadline));

  return (
    <InnerPage>
      <PageHero
        trail={["Careers"]}
        eyebrow="Become a Sentinel"
        title="Join our Team"
        lead={
          <>
            <p>
              A Sentinel is a guard during peace and a soldier during war. Our team of sentinels are
              obsessed with guarding our clients against risk as well as shielding them as they
              pursue opportunities – making them win!
            </p>
            <p>
              Join the team and grow to become a great Sentinel – strong in the service of our
              clients and communities, diligent, and effortlessly competent.
            </p>
          </>
        }
        actions={
          <>
            <a href="#opportunities" className="button">
              View opportunities <ArrowDown size={16} />
            </a>
            <a href="#register-interest" className="text-link">
              Register your interest <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="careers-shield">
            <p className="careers-shield-title">Under our shield, employees are</p>
            <ul>
              {shieldPoints.map(({ icon: Icon, text }) => (
                <li key={text}>
                  <span>
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <p className="careers-shield-foot">
              <MapPin size={14} aria-hidden="true" /> Nairobi · Kampala · Kigali
            </p>
          </div>
        }
      />

      <section id="opportunities" className="svc-section" aria-labelledby="opportunities-title">
        <div className="site-container">
          <Reveal>
            <p className="eyebrow">Career opportunities</p>
            <h2 id="opportunities-title">
              Open roles <span className="blue-text">at Sentinel Africa.</span>
            </h2>
          </Reveal>
          {open.length > 0 ? (
            <ul className="careers-grid">
              {open.map((role) => (
                <RoleCard key={role.slug} role={role} />
              ))}
            </ul>
          ) : (
            <div className="careers-empty">
              <span>
                <BriefcaseBusiness size={24} aria-hidden="true" />
              </span>
              <div>
                <h3>There are no open roles right now</h3>
                <p>
                  New opportunities are published here. Register your interest and we’ll keep your
                  details for future roles that match your experience.
                </p>
              </div>
              <a className="button" href="#register-interest">
                Register your interest <ArrowDown size={16} />
              </a>
            </div>
          )}

          {closed.length > 0 && (
            <div className="careers-closed">
              <h3>Recently closed</h3>
              <ul className="careers-grid">
                {closed.map((role) => (
                  <RoleCard key={role.slug} role={role} />
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section
        id="register-interest"
        className="svc-section is-pale"
        aria-labelledby="interest-title"
      >
        <div className="site-container careers-interest-layout">
          <Reveal>
            <p className="eyebrow">General applications</p>
            <h2 id="interest-title">
              Don’t see your role? <span className="blue-text">Register your interest.</span>
            </h2>
            <p className="svc-body">
              Send us your details and CV. We maintain a pool of talent and will contact you when a
              suitable opportunity opens.
            </p>
            <p className="careers-interest-mail">
              <Mail size={16} aria-hidden="true" />
              Applications go to <a href={`mailto:${careersEmail}`}>{careersEmail}</a>
            </p>
            <a className="text-link" href={talentShieldPage}>
              University student? See the Talent Shield scholarship <ArrowRight size={16} />
            </a>
          </Reveal>
          <Reveal delay={120} className="careers-interest-card">
            <ApplicationForm />
          </Reveal>
        </div>
      </section>

      <section className="careers-equal-section" aria-label="Equal opportunity">
        <div className="site-container">
          <EqualOpportunity />
        </div>
      </section>
    </InnerPage>
  );
}

export default function CareersPage() {
  const slug = new URLSearchParams(window.location.search).get("role");
  const role = roles.find((item) => item.slug === slug);
  useEffect(() => {
    if (role) document.title = `${role.title} — Careers at Sentinel Africa Consulting`;
  }, [role]);
  return role ? <RoleView role={role} /> : <ListView />;
}
