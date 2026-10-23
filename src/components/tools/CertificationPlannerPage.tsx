import { useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  Check,
  ClipboardCopy,
  Download,
  Info,
  ListChecks,
  Printer,
  RotateCcw,
  Send,
  Users,
} from "lucide-react";
import { InnerPage, PageCta, PageHero } from "../site/InnerPage";
import { toolsPage } from "../site/navigation";
import { OtherTools } from "../site/ServiceBlocks";
import {
  activeDurationQuestions,
  buildQuestions,
  complexities,
  computeReport,
  countries,
  depths,
  goals,
  interpretScore,
  maturities,
  range,
  ratingLabels,
  reportSummary,
  sectors,
  standardName,
  standards,
  type Profile,
  type Report,
} from "./certificationPlanner";
import "../site/services.css";
import "./certification-planner.css";

const plannerTitle = "Certification Readiness & Implementation Planner";
const enquiryEmail = "info@sentinelafricaconsulting.com";

const stepLabels = ["Organisation & standards", "Readiness & duration", "Results & resources"];

const defaultProfile: Profile = {
  organisation: "",
  sector: "service",
  country: "Kenya",
  staff: 100,
  sites: 1,
  complexity: "medium",
  existing: "none",
  depth: "quick",
  goal: goals[0]!,
  standards: ["27001"],
};

const roadmap = [
  [
    "Mobilise & diagnose",
    "Confirm scope; detailed clause-by-clause gap assessment; governance; implementation plan",
  ],
  ["Design", "Policies, objectives, risk methodology, process design, legal/contractual mapping"],
  [
    "Implement & build evidence",
    "Operate controls and processes; communicate; train; measure; maintain records",
  ],
  [
    "Verify & improve",
    "Internal audit, management review, corrective actions, evidence verification",
  ],
  [
    "Independent certification",
    "Arrange Stage 1 and Stage 2 with an appropriate accredited certification body",
  ],
];

function Field({
  id,
  label,
  children,
  wide = false,
}: {
  id: string;
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`cp-field ${wide ? "is-wide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

/** One question answered with a row of pill-shaped radio buttons. */
function Choice({
  name,
  legend,
  detail,
  tag,
  choices,
  value,
  onChange,
  children,
}: {
  name: string;
  legend: ReactNode;
  detail?: string;
  tag?: string;
  choices: [string, string][];
  value: string | undefined;
  onChange: (value: string) => void;
  children?: ReactNode;
}) {
  return (
    <fieldset className={`cp-question ${value !== undefined ? "is-answered" : ""}`}>
      <legend>
        {legend}
        {tag && <span className="cp-question-tag">{tag}</span>}
      </legend>
      {detail && <p className="cp-question-detail">{detail}</p>}
      <div className="cp-pills">
        {choices.map(([choice, label]) => (
          <label key={choice} className={value === choice ? "is-selected" : ""}>
            <input
              type="radio"
              name={name}
              value={choice}
              checked={value === choice}
              onChange={() => onChange(choice)}
            />
            {label}
          </label>
        ))}
      </div>
      {children}
    </fieldset>
  );
}

function downloadJson(data: unknown, filename: string) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Results({ report, onRestart }: { report: Report; onRestart: () => void }) {
  const { profile } = report;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(reportSummary(report));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="cp-results">
      <section className="cp-card" aria-labelledby="report-title">
        <div className="cp-card-head">
          <div>
            <p className="eyebrow">Your readiness report</p>
            <h2 id="report-title">Management system readiness report</h2>
            <p className="cp-muted">
              {profile.organisation || "Organisation"} · {profile.country} · {profile.staff}{" "}
              employees · {profile.sites} site(s) · {profile.standards.length} standard(s) ·
              Self-reported planning estimate
            </p>
          </div>
          <span className={`cp-status is-${report.level}`} role="status">
            {report.status}
          </span>
        </div>

        <dl className="cp-metrics">
          <div className="is-primary">
            <dt>Overall readiness</dt>
            <dd>{report.score}%</dd>
          </div>
          <div>
            <dt>To readiness</dt>
            <dd>{range(report.readinessMonths)} mo</dd>
          </div>
          <div>
            <dt>Internal effort</dt>
            <dd>{range(report.internalDays)} days</dd>
          </div>
          <div>
            <dt>External support</dt>
            <dd>{range(report.externalDays)} days</dd>
          </div>
        </dl>

        <h3 className="cp-subhead">
          <CalendarClock size={18} aria-hidden="true" /> Implementation and certification timing
        </h3>
        <dl className="cp-metrics is-three">
          <div>
            <dt>Implementation</dt>
            <dd>{range(report.implementationMonths)} mo</dd>
          </div>
          <div>
            <dt>Certification readiness</dt>
            <dd>{range(report.readinessMonths)} mo</dd>
          </div>
          <div>
            <dt>Including certification</dt>
            <dd>{range(report.certificationMonths)} mo</dd>
          </div>
        </dl>
        <p className="cp-note">
          <Info size={16} aria-hidden="true" />
          <span>
            <strong>Target-date assessment:</strong> {report.feasibility}. Assumed internal delivery
            capacity: approximately {report.capacityDaysPerMonth.toFixed(1)} effective person-days
            per month. A major schedule driver is {report.scheduleDriver}. Actual audit dates and
            issuance are controlled by the independent certification body.
          </span>
        </p>

        <h3 className="cp-subhead">
          <BarChart3 size={18} aria-hidden="true" /> Readiness by management system
        </h3>
        <ul className="cp-bars">
          {report.standards.map((s) => (
            <li key={s.id}>
              <span className="cp-bar-name">{s.name}</span>
              <span className="cp-bar" aria-hidden="true">
                <span style={{ width: `${s.score}%` }} />
              </span>
              <strong>{s.score}%</strong>
              <span className="cp-muted">{interpretScore(s.score)}</span>
            </li>
          ))}
        </ul>

        <h3 className="cp-subhead">
          <ListChecks size={18} aria-hidden="true" /> Evidence gaps and immediate priorities
        </h3>
        {report.priorities.length ? (
          <div className="cp-table-wrap">
            <table className="cp-table">
              <thead>
                <tr>
                  <th scope="col">Priority gap</th>
                  <th scope="col">Current position</th>
                  <th scope="col">Next action</th>
                </tr>
              </thead>
              <tbody>
                {report.priorities.map(({ question, rating, note }) => (
                  <tr key={question.id}>
                    <td>
                      <strong>{question.title}</strong>
                      {question.critical && (
                        <span className="cp-critical">Critical readiness check</span>
                      )}
                    </td>
                    <td>
                      {ratingLabels[rating]}
                      {note && <span className="cp-muted"> — {note}</span>}
                    </td>
                    <td>
                      {rating < 2
                        ? "Define owner, method and implementation evidence"
                        : "Verify actual operation and collect records"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="cp-muted">
            No gaps reported. Verify evidence through an independent readiness review before
            applying for certification.
          </p>
        )}

        <h3 className="cp-subhead">
          <Users size={18} aria-hidden="true" /> Indicative implementation resource plan
        </h3>
        <div className="cp-table-wrap">
          <table className="cp-table">
            <thead>
              <tr>
                <th scope="col">Resource or workstream</th>
                <th scope="col">Indicative allocation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Internal project sponsor / management representative</td>
                <td>Accountability and decision-making throughout the programme</td>
              </tr>
              <tr>
                <td>Internal process owners and subject matter specialists</td>
                <td>
                  <strong>{range(report.internalDays)} person-days total</strong>, shared across
                  roles
                </td>
              </tr>
              <tr>
                <td>External implementation advisory / coaching</td>
                <td>
                  <strong>{range(report.externalDays)} consultant person-days</strong> if external
                  support is used
                </td>
              </tr>
              <tr>
                <td>Suggested cross-functional working group</td>
                <td>{report.workingGroup} designated participants, part-time</td>
              </tr>
              <tr>
                <td>Training needs</td>
                <td>
                  Management awareness, process-owner training, internal auditor competence and
                  staff awareness; scope to be confirmed
                </td>
              </tr>
              <tr>
                <td>Certification body / audit fees</td>
                <td>
                  Not estimated; obtain an independent accredited certification-body quotation
                </td>
              </tr>
              <tr>
                <td>Software, controls, infrastructure or facility remediation</td>
                <td>Not estimated; requires a diagnostic of technical and operational gaps</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="cp-small">
          Person-days reflect cumulative effort, not full-time staffing. The internal and external
          ranges are separate planning allocations and may overlap in calendar time. They are
          planning heuristics, not Sentinel Africa rates, a certification-body audit-duration
          calculation or a commercial proposal.
        </p>

        <h3 className="cp-subhead">Recommended Sentinel Africa support</h3>
        <ul className="cp-recommendations">
          {report.recommendations.map((r) => (
            <li key={r.name}>
              <strong>{r.name}</strong>
              <p>{r.text}</p>
              <a className="text-link" href={r.href}>
                Learn more <ArrowUpRight size={15} />
              </a>
            </li>
          ))}
        </ul>

        <p className="cp-note is-gold">
          <Info size={16} aria-hidden="true" />
          <span>
            <strong>Need a financial quotation?</strong> This free assessment does not calculate
            consulting, training or audit fees. Request a quotation below for a proposal tailored to
            your scope. Independent certification body fees are quoted separately.
          </span>
        </p>

        <h3 className="cp-subhead">Suggested implementation roadmap</h3>
        <ol className="cp-roadmap">
          {roadmap.map(([phase, activities], index) => (
            <li key={phase}>
              <span className="cp-roadmap-step">{index + 1}</span>
              <div>
                <strong>{phase}</strong>
                <p>{activities}</p>
              </div>
            </li>
          ))}
        </ol>

        <p className="cp-note">
          <Info size={16} aria-hidden="true" />
          <span>
            <strong>Interpretation and limitations.</strong> This is a high-level self-reported
            diagnostic, not a clause-by-clause conformity audit, assurance opinion, certification
            recommendation or quotation. Effort estimates are planning assumptions rather than
            audited industry benchmarks; they exclude certification-body fees, taxes, travel, major
            remediation purchases and infrastructure changes. The deadline supplied is a target, not
            an input that forces an optimistic result. An accredited certification body
            independently determines certification following its audits.
          </span>
        </p>

        <div className="cp-actions">
          <button type="button" className="button" onClick={() => window.print()}>
            Print / save PDF <Printer size={16} />
          </button>
          <button
            type="button"
            className="cp-ghost"
            onClick={() => downloadJson(report, "sentinel-readiness-report.json")}
          >
            <Download size={16} aria-hidden="true" /> Export report (JSON)
          </button>
          <button type="button" className="cp-ghost" onClick={copy}>
            <ClipboardCopy size={16} aria-hidden="true" />{" "}
            {copied ? "Summary copied" : "Copy summary"}
          </button>
          <button type="button" className="cp-ghost" onClick={onRestart}>
            <RotateCcw size={16} aria-hidden="true" /> Start a new assessment
          </button>
        </div>
      </section>

      <QuotationRequest report={report} />
    </div>
  );
}

const helpOptions = [
  "Implementation consultancy",
  "Detailed gap assessment",
  "Training and competence development",
  "Internal audit and readiness review",
  "Integrated management system support",
  "Not sure — please advise",
];
const startOptions = [
  "As soon as practical",
  "Within 3 months",
  "Within 6 months",
  "Later / exploring options",
];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Prepares a quotation request in the visitor's email app, with the report summary. */
function QuotationRequest({ report }: { report: Report }) {
  const [form, setForm] = useState({
    organisation: report.profile.organisation,
    name: "",
    email: "",
    phone: "",
    role: "",
    method: "Email",
    help: helpOptions[0]!,
    start: startOptions[0]!,
    consent: false,
  });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const set = (key: keyof typeof form) => (value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const problem = !form.organisation.trim()
      ? "Enter your organisation name."
      : !form.name.trim()
        ? "Enter your name."
        : !emailPattern.test(form.email.trim())
          ? "Enter a valid business email."
          : !form.consent
            ? "Tick the box to share your details and assessment summary."
            : "";
    setError(problem);
    if (problem) return;
    const body = [
      "Hello Sentinel Africa,",
      "",
      "I would like a tailored quotation for ISO management system support.",
      "",
      `Organisation: ${form.organisation.trim()}`,
      `Name: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      ...(form.phone.trim() ? [`Phone: ${form.phone.trim()}`] : []),
      ...(form.role.trim() ? [`Role: ${form.role.trim()}`] : []),
      `Preferred contact: ${form.method}`,
      `Support required: ${form.help}`,
      `Preferred start: ${form.start}`,
      "",
      reportSummary(report),
      "",
      "Thank you.",
    ].join("\n");
    window.location.href = `mailto:${enquiryEmail}?subject=${encodeURIComponent(
      `ISO certification quotation request — ${form.organisation.trim()}`,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="cp-card cp-quote" aria-labelledby="quote-title">
      <p className="eyebrow">Optional</p>
      <h2 id="quote-title">Request a tailored quotation</h2>
      <p className="cp-muted">
        Your report is free to keep without giving us contact details. If you would like consulting,
        training or implementation support, send us a request with your assessment summary.
      </p>
      <form onSubmit={submit} noValidate>
        <div className="cp-grid">
          <Field id="q-org" label="Organisation name *">
            <input
              id="q-org"
              value={form.organisation}
              maxLength={150}
              autoComplete="organization"
              onChange={(e) => set("organisation")(e.target.value)}
            />
          </Field>
          <Field id="q-name" label="Contact name *">
            <input
              id="q-name"
              value={form.name}
              maxLength={120}
              autoComplete="name"
              onChange={(e) => set("name")(e.target.value)}
            />
          </Field>
          <Field id="q-email" label="Business email *">
            <input
              id="q-email"
              type="email"
              value={form.email}
              maxLength={180}
              autoComplete="email"
              onChange={(e) => set("email")(e.target.value)}
            />
          </Field>
          <Field id="q-phone" label="Telephone (optional)">
            <input
              id="q-phone"
              type="tel"
              value={form.phone}
              maxLength={60}
              autoComplete="tel"
              onChange={(e) => set("phone")(e.target.value)}
            />
          </Field>
          <Field id="q-role" label="Your role (optional)">
            <input
              id="q-role"
              value={form.role}
              maxLength={100}
              autoComplete="organization-title"
              onChange={(e) => set("role")(e.target.value)}
            />
          </Field>
          <Field id="q-method" label="Preferred contact method">
            <select
              id="q-method"
              value={form.method}
              onChange={(e) => set("method")(e.target.value)}
            >
              <option>Email</option>
              <option>Telephone</option>
            </select>
          </Field>
          <Field id="q-help" label="Support required">
            <select id="q-help" value={form.help} onChange={(e) => set("help")(e.target.value)}>
              {helpOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field id="q-start" label="Preferred project start">
            <select id="q-start" value={form.start} onChange={(e) => set("start")(e.target.value)}>
              {startOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
        </div>
        <label className="cp-consent">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => set("consent")(e.target.checked)}
          />
          <span>
            I agree to share the details above and my assessment summary with Sentinel Africa so it
            can respond to my request.
          </span>
        </label>
        {error && (
          <p className="cp-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="button">
          Prepare quotation request <Send size={16} />
        </button>
        {sent && (
          <p className="cp-sent" role="status">
            <Check size={16} aria-hidden="true" /> Your email app should now be open with your
            request written out. If it isn’t, email{" "}
            <a href={`mailto:${enquiryEmail}`}>{enquiryEmail}</a>.
          </p>
        )}
      </form>
    </section>
  );
}

export default function CertificationPlannerPage() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [profileError, setProfileError] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [duration, setDuration] = useState<Record<string, string>>({});
  const [report, setReport] = useState<Report | null>(null);
  const top = useRef<HTMLDivElement>(null);

  const questions = buildQuestions(profile);
  const durationList = activeDurationQuestions(profile.depth);
  const answered =
    questions.filter((q) => answers[q.id] !== undefined).length +
    durationList.filter((q) => duration[q.id] !== undefined).length;
  const total = questions.length + durationList.length;

  const go = (next: number) => {
    setStep(next);
    top.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  };
  const update = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((current) => ({ ...current, [key]: value }));

  const start = () => {
    const problem = !profile.standards.length
      ? "Select at least one standard."
      : !(profile.staff >= 1) || !(profile.sites >= 1)
        ? "Enter valid employee and site counts."
        : "";
    setProfileError(problem);
    if (!problem) go(2);
  };

  const generate = () => {
    const active = Object.fromEntries(durationList.map((q) => [q.id, duration[q.id] ?? null]));
    setReport(computeReport(profile, answers, active, profile.depth === "detailed" ? notes : {}));
    go(3);
  };

  const restart = () => {
    setReport(null);
    go(1);
  };

  return (
    <InnerPage>
      <PageHero
        trail={[{ label: "Tools", href: toolsPage }]}
        eyebrow="How ready are you for ISO certification?"
        title={plannerTitle}
        lead={
          <p>
            Understand your management system’s current maturity, identify priority gaps and
            estimate the people, effort and time needed to implement an effective ISO management
            system. Free, private and done in your browser.
          </p>
        }
        actions={
          <a href="#planner" className="button">
            Start the assessment <ArrowRight size={16} />
          </a>
        }
        aside={
          <ol className="cp-hero-steps" aria-label="How the planner works">
            {[
              [
                "Tell us about your organisation",
                "Sector, size, sites and the standards you need.",
              ],
              [
                "Answer the readiness questions",
                "Rate each requirement and your delivery capacity.",
              ],
              ["Get your report", "Readiness score, timeline, effort and a roadmap."],
            ].map(([title, text], index) => (
              <li key={title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <small>{text}</small>
                </div>
              </li>
            ))}
          </ol>
        }
      />

      <section id="planner" className="svc-section is-pale cp-section" aria-label={plannerTitle}>
        <div className="site-container" ref={top}>
          <ol className="cp-steps" aria-label="Progress">
            {stepLabels.map((label, index) => (
              <li
                key={label}
                aria-current={step === index + 1 ? "step" : undefined}
                className={step > index + 1 ? "is-done" : ""}
              >
                <span>{step > index + 1 ? <Check size={14} aria-hidden="true" /> : index + 1}</span>
                {label}
              </li>
            ))}
          </ol>

          {step === 1 && (
            <section className="cp-card" aria-labelledby="org-title">
              <h2 id="org-title">Tell us about your organisation</h2>
              <p className="cp-muted">
                These answers tailor your questions and the implementation estimate. Your assessment
                stays in your browser; nothing is sent unless you choose to request a quotation.
              </p>
              <div className="cp-grid">
                <Field id="cp-org" label="Organisation name (optional)">
                  <input
                    id="cp-org"
                    value={profile.organisation}
                    placeholder="Organisation or project name"
                    onChange={(e) => update("organisation", e.target.value)}
                  />
                </Field>
                <Field id="cp-sector" label="Industry / sector">
                  <select
                    id="cp-sector"
                    value={profile.sector}
                    onChange={(e) => update("sector", e.target.value)}
                  >
                    {sectors.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="cp-country" label="Country">
                  <select
                    id="cp-country"
                    value={profile.country}
                    onChange={(e) => update("country", e.target.value)}
                  >
                    {countries.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </Field>
                <Field id="cp-staff" label="Employees in certification scope">
                  <input
                    id="cp-staff"
                    type="number"
                    min={1}
                    max={1000000}
                    value={profile.staff}
                    onChange={(e) => update("staff", Number(e.target.value))}
                  />
                </Field>
                <Field id="cp-sites" label="Sites in scope">
                  <input
                    id="cp-sites"
                    type="number"
                    min={1}
                    max={10000}
                    value={profile.sites}
                    onChange={(e) => update("sites", Number(e.target.value))}
                  />
                </Field>
                <Field id="cp-complexity" label="Operational complexity">
                  <select
                    id="cp-complexity"
                    value={profile.complexity}
                    onChange={(e) => update("complexity", e.target.value)}
                  >
                    {complexities.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="cp-existing" label="Existing management systems">
                  <select
                    id="cp-existing"
                    value={profile.existing}
                    onChange={(e) => update("existing", e.target.value)}
                  >
                    {maturities.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="cp-depth" label="Assessment depth">
                  <select
                    id="cp-depth"
                    value={profile.depth}
                    onChange={(e) => update("depth", e.target.value as Profile["depth"])}
                  >
                    {depths.map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="cp-goal" label="Main objective">
                  <select
                    id="cp-goal"
                    value={profile.goal}
                    onChange={(e) => update("goal", e.target.value)}
                  >
                    {goals.map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <fieldset className="cp-standards">
                <legend>Select the standards to assess</legend>
                <div>
                  {standards.map((s) => {
                    const checked = profile.standards.includes(s.id);
                    return (
                      <label key={s.id} className={checked ? "is-selected" : ""}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            update(
                              "standards",
                              checked
                                ? profile.standards.filter((id) => id !== s.id)
                                : standards
                                    .map((x) => x.id)
                                    .filter((id) => id === s.id || profile.standards.includes(id)),
                            )
                          }
                        />
                        <span>
                          <strong>{s.name}</strong>
                          <small>{s.area}</small>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {profileError && (
                <p className="cp-error" role="alert">
                  {profileError}
                </p>
              )}
              <div className="cp-actions">
                <button type="button" className="button" onClick={start}>
                  Start assessment <ArrowRight size={16} />
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="cp-card" aria-labelledby="assess-title">
              <div className="cp-card-head">
                <div>
                  <h2 id="assess-title">Readiness assessment</h2>
                  <p className="cp-muted">
                    Choose the statement that best describes your current position. An item counts
                    as implemented only when you can show current evidence.
                  </p>
                </div>
                <span className="cp-count" aria-live="polite">
                  {answered} / {total} answered
                </span>
              </div>
              <div
                className="cp-progress"
                role="progressbar"
                aria-label="Questions answered"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={answered}
              >
                <span style={{ width: `${(100 * answered) / total}%` }} />
              </div>

              {questions.map((q, index) => (
                <Choice
                  key={q.id}
                  name={q.id}
                  legend={`${index + 1}. ${q.title}`}
                  tag={q.standard === "Common" ? "Shared governance" : standardName(q.standard)}
                  detail={q.detail}
                  choices={ratingLabels.map((label, i) => [String(i), label])}
                  value={answers[q.id] === undefined ? undefined : String(answers[q.id])}
                  onChange={(v) => setAnswers((current) => ({ ...current, [q.id]: Number(v) }))}
                >
                  {profile.depth === "detailed" && (
                    <div className="cp-field cp-evidence">
                      <label htmlFor={`ev-${q.id}`}>Evidence or gap note (optional)</label>
                      <input
                        id={`ev-${q.id}`}
                        maxLength={300}
                        placeholder="Document, record, owner or outstanding gap"
                        value={notes[q.id] ?? ""}
                        onChange={(e) =>
                          setNotes((current) => ({ ...current, [q.id]: e.target.value }))
                        }
                      />
                    </div>
                  )}
                </Choice>
              ))}

              <div className="cp-divider">
                <h2>Project duration and delivery capacity</h2>
                <p className="cp-muted">
                  These answers inform your implementation duration, resource capacity and
                  certification schedule. They are separate from your readiness score.
                </p>
              </div>
              {durationList.map((q, index) => (
                <Choice
                  key={q.id}
                  name={`d-${q.id}`}
                  legend={`${index + 1}. ${q.label}`}
                  choices={q.choices}
                  value={duration[q.id]}
                  onChange={(v) => setDuration((current) => ({ ...current, [q.id]: v }))}
                />
              ))}

              <div className="cp-actions">
                <button type="button" className="cp-ghost" onClick={() => go(1)}>
                  <ArrowLeft size={16} aria-hidden="true" /> Organisation details
                </button>
                <button
                  type="button"
                  className="button"
                  onClick={generate}
                  disabled={answered !== total}
                >
                  Generate readiness report <ArrowRight size={16} />
                </button>
                {answered !== total && (
                  <span className="cp-muted cp-remaining">
                    {total - answered} {total - answered === 1 ? "question" : "questions"} left
                  </span>
                )}
              </div>
            </section>
          )}

          {step === 3 && report && <Results report={report} onRestart={restart} />}
        </div>
      </section>

      <OtherTools current={plannerTitle} />
      <PageCta interest="ISO Certification Readiness" />
    </InnerPage>
  );
}
