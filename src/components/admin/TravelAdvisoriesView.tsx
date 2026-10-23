import { useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  ClipboardCopy,
  Database,
  FilePlus2,
  FileSearch,
  History,
  Info,
  Inbox,
  Landmark,
  ListChecks,
  LoaderCircle,
  Newspaper,
  PenLine,
  RefreshCw,
  Rss,
  Send,
  ShieldCheck,
  UserCheck,
  WifiOff,
} from "lucide-react";
import { travelAdvisoryPage } from "../site/navigation";
import {
  today,
  travelData,
  unmatchedAirline,
  unmatchedCountry,
  type Advisory,
  type Category,
  type Direction,
  type Requirement,
} from "../travel/travelAdvisory";
import {
  formatWhoDate,
  useWhoReports,
  type WhoReport,
  type WhoState,
} from "../travel/whoOutbreakNews";

// The editorial side of the Travel Advisory, following the Sentinel Africa travel portal:
// new notices wait for review, editors check the official source, write a faithful
// summary and only then publish. Saving is not connected yet, so a prepared record is
// shown ready to add to src/content/travel-advisory.json.

const tabs = [
  { id: "queue", label: "Review queue", icon: Inbox },
  { id: "published", label: "Published records", icon: ListChecks },
  { id: "prepare", label: "Prepare a record", icon: FilePlus2 },
  { id: "sources", label: "Official sources", icon: Landmark },
  { id: "activity", label: "Activity log", icon: History },
] as const;
type TabId = (typeof tabs)[number]["id"];

const countries = travelData.countries.filter((country) => country !== unmatchedCountry);
const airlines = travelData.airlines
  .map((airline) => airline.name)
  .filter((name) => name !== unmatchedAirline);

const directions: { value: Direction; label: string }[] = [
  { value: "entry", label: "Entry (destination)" },
  { value: "exit", label: "Exit (departure)" },
  { value: "transit", label: "Transit" },
];
const categories: { value: Category; label: string }[] = [
  { value: "restriction", label: "Restriction" },
  { value: "declaration", label: "Health declaration" },
  { value: "screening", label: "Screening" },
  { value: "transit", label: "Transit rule" },
  { value: "airline", label: "Airline requirement" },
];

const workflow = [
  { icon: Rss, title: "Detected", text: "A source check finds a new Ebola-related notice." },
  {
    icon: FileSearch,
    title: "Source checked",
    text: "An editor opens the original and checks dates and scope.",
  },
  {
    icon: PenLine,
    title: "Summarised",
    text: "The editor sets the geography and writes a faithful summary.",
  },
  {
    icon: Send,
    title: "Published",
    text: "The record appears on the Travel Advisory page, with its source.",
  },
];

type Kind = "advisory" | "requirement";
type Form = Record<
  | "country"
  | "direction"
  | "category"
  | "airline"
  | "title"
  | "text"
  | "regions"
  | "sourceName"
  | "sourceUrl"
  | "publishedDate"
  | "effectiveFrom"
  | "effectiveUntil",
  string
>;
type FormErrors = Partial<Record<keyof Form, string>>;

const blankForm = (): Form => ({
  country: "",
  direction: "entry",
  category: "restriction",
  airline: "",
  title: "",
  text: "",
  regions: "",
  sourceName: "",
  sourceUrl: "",
  publishedDate: today(),
  effectiveFrom: "",
  effectiveUntil: "",
});

const isoDate = /^\d{4}-\d{2}-\d{2}$/;
const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);

/** The checks the travel portal applies before a record can be saved. */
function check(kind: Kind, form: Form): FormErrors {
  const errors: FormErrors = {};
  if (!form.country) errors.country = "Choose the country this record applies to.";
  if (form.title.trim().length < 8) errors.title = "Write a title of at least 8 characters.";
  const minimum = kind === "advisory" ? 35 : 25;
  if (form.text.trim().length < minimum)
    errors.text = `Write a substantive ${kind === "advisory" ? "summary" : "description"} of at least ${minimum} characters.`;
  if (kind === "advisory" && !form.regions.trim())
    errors.regions = "Name the affected geography, as the source does.";
  if (!form.sourceName.trim()) errors.sourceName = "Name the official source.";
  if (!/^https:\/\/\S+\.\S+/.test(form.sourceUrl.trim()))
    errors.sourceUrl = "Link the official source with an https:// address.";
  if (!isoDate.test(form.publishedDate))
    errors.publishedDate = "Enter the source’s publication date.";
  if (
    kind === "requirement" &&
    form.effectiveFrom &&
    form.effectiveUntil &&
    form.effectiveFrom > form.effectiveUntil
  )
    errors.effectiveUntil = "The end date must not be before the start date.";
  return errors;
}

function buildRecord(kind: Kind, form: Form): Advisory | Requirement {
  const reviewedAt = today();
  const base = {
    country: form.country,
    title: form.title.trim(),
    sourceName: form.sourceName.trim(),
    sourceUrl: form.sourceUrl.trim(),
    publishedDate: form.publishedDate,
    reviewedAt,
  };
  if (kind === "advisory")
    return {
      id: slug(`${form.country}-${form.title}`),
      ...base,
      summary: form.text.trim(),
      regions: form.regions.trim(),
    };
  return {
    id: slug(`${form.country}-${form.direction}-${form.category}-${form.title}`),
    ...base,
    direction: form.direction as Direction,
    category: form.category as Category,
    ...(form.airline && { airline: form.airline }),
    detail: form.text.trim(),
    ...(form.effectiveFrom && { effectiveFrom: form.effectiveFrom }),
    ...(form.effectiveUntil && { effectiveUntil: form.effectiveUntil }),
  };
}

function Field({
  id,
  label,
  error,
  hint,
  wide = false,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`admin-field ${wide ? "is-wide" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && !error && <p className="admin-field-hint">{hint}</p>}
      {error && (
        <p className="admin-field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Inbox;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="admin-panel-empty">
      <span>
        <Icon size={22} aria-hidden="true" />
      </span>
      <p className="admin-panel-empty-title">{title}</p>
      <p>{children}</p>
    </div>
  );
}

/** A record started from a WHO report in the review queue. */
type Draft = { kind: Kind; form: Partial<Form>; report: WhoReport };

function PrepareRecord({ draft }: { draft: Draft | null }) {
  const [kind, setKind] = useState<Kind>(draft?.kind ?? "requirement");
  const [form, setForm] = useState<Form>(() => ({ ...blankForm(), ...draft?.form }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [record, setRecord] = useState<Advisory | Requirement | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (key: keyof Form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }));
  const invalid = (key: keyof Form) =>
    errors[key] ? { "aria-invalid": true as const, "aria-describedby": `tr-${key}-error` } : {};

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = check(kind, form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`tr-${first}`)?.focus();
      return;
    }
    setRecord(buildRecord(kind, form));
    setCopied(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(record, null, 2));
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="admin-prepare">
      <form
        className="admin-card admin-form"
        onSubmit={submit}
        noValidate
        aria-labelledby="prepare-title"
      >
        <div className="admin-card-head">
          <div>
            <h2 id="prepare-title">Prepare a record</h2>
            <p>
              Only from an official source you have read in full. Every field is checked as in the
              portal.
            </p>
          </div>
        </div>
        {draft && (
          <p className="admin-draft-source">
            <Info size={15} aria-hidden="true" />
            <span>
              Started from WHO report{" "}
              <a href={draft.report.url} target="_blank" rel="noreferrer">
                {draft.report.donId}
              </a>
              . Read it in full, then write the affected geography and a faithful summary.
            </span>
          </p>
        )}
        <div className="admin-segmented" role="radiogroup" aria-label="Record type">
          {(
            [
              ["requirement", "Travel requirement"],
              ["advisory", "Advisory summary"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={kind === value}
              onClick={() => {
                setKind(value);
                setErrors({});
                setRecord(null);
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="admin-form-grid">
          <Field id="tr-country" label="Country" error={errors.country}>
            <select
              id="tr-country"
              value={form.country}
              onChange={(e) => set("country")(e.target.value)}
              {...invalid("country")}
            >
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country}>{country}</option>
              ))}
            </select>
          </Field>
          {kind === "requirement" ? (
            <>
              <Field id="tr-direction" label="Applies on">
                <select
                  id="tr-direction"
                  value={form.direction}
                  onChange={(e) => set("direction")(e.target.value)}
                >
                  {directions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="tr-category" label="Category">
                <select
                  id="tr-category"
                  value={form.category}
                  onChange={(e) => set("category")(e.target.value)}
                >
                  {categories.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="tr-airline" label="Airline (only if airline-specific)">
                <select
                  id="tr-airline"
                  value={form.airline}
                  onChange={(e) => set("airline")(e.target.value)}
                >
                  <option value="">All airlines</option>
                  {airlines.map((airline) => (
                    <option key={airline}>{airline}</option>
                  ))}
                </select>
              </Field>
            </>
          ) : (
            <Field
              id="tr-regions"
              label="Affected geography"
              error={errors.regions}
              hint="Provinces or regions, as named by the source."
            >
              <input
                id="tr-regions"
                value={form.regions}
                onChange={(e) => set("regions")(e.target.value)}
                {...invalid("regions")}
              />
            </Field>
          )}
          <Field id="tr-title" label="Title" error={errors.title} wide>
            <input
              id="tr-title"
              value={form.title}
              onChange={(e) => set("title")(e.target.value)}
              {...invalid("title")}
            />
          </Field>
          <Field
            id="tr-text"
            label={kind === "advisory" ? "Reviewed summary" : "Requirement detail"}
            error={errors.text}
            hint="Faithful to the source. Never say a route is safe."
            wide
          >
            <textarea
              id="tr-text"
              rows={4}
              value={form.text}
              onChange={(e) => set("text")(e.target.value)}
              {...invalid("text")}
            />
          </Field>
          <Field id="tr-sourceName" label="Source name" error={errors.sourceName}>
            <input
              id="tr-sourceName"
              placeholder="e.g. WHO Disease Outbreak News"
              value={form.sourceName}
              onChange={(e) => set("sourceName")(e.target.value)}
              {...invalid("sourceName")}
            />
          </Field>
          <Field id="tr-sourceUrl" label="Source link" error={errors.sourceUrl}>
            <input
              id="tr-sourceUrl"
              type="url"
              placeholder="https://"
              value={form.sourceUrl}
              onChange={(e) => set("sourceUrl")(e.target.value)}
              {...invalid("sourceUrl")}
            />
          </Field>
          <Field id="tr-publishedDate" label="Published by the source" error={errors.publishedDate}>
            <input
              id="tr-publishedDate"
              type="date"
              value={form.publishedDate}
              onChange={(e) => set("publishedDate")(e.target.value)}
              {...invalid("publishedDate")}
            />
          </Field>
          {kind === "requirement" && (
            <>
              <Field id="tr-effectiveFrom" label="In force from (optional)">
                <input
                  id="tr-effectiveFrom"
                  type="date"
                  value={form.effectiveFrom}
                  onChange={(e) => set("effectiveFrom")(e.target.value)}
                />
              </Field>
              <Field
                id="tr-effectiveUntil"
                label="In force until (optional)"
                error={errors.effectiveUntil}
              >
                <input
                  id="tr-effectiveUntil"
                  type="date"
                  value={form.effectiveUntil}
                  onChange={(e) => set("effectiveUntil")(e.target.value)}
                  {...invalid("effectiveUntil")}
                />
              </Field>
            </>
          )}
        </div>
        <div className="admin-form-foot">
          <button type="submit" className="admin-button">
            <CheckCircle2 size={15} aria-hidden="true" /> Check and prepare
          </button>
          <button
            type="button"
            className="admin-button is-ghost"
            onClick={() => {
              setForm(blankForm());
              setErrors({});
              setRecord(null);
            }}
          >
            Clear
          </button>
        </div>
      </form>

      <aside className="admin-card admin-record-preview" aria-labelledby="record-title">
        <div className="admin-card-head">
          <div>
            <h2 id="record-title">Record ready to publish</h2>
            <p>Saving from the console is not connected yet.</p>
          </div>
        </div>
        {record ? (
          <>
            <p className="admin-record-status" role="status">
              <CheckCircle2 size={16} aria-hidden="true" /> Passed every check
            </p>
            <pre className="admin-code">
              <code>{JSON.stringify(record, null, 2)}</code>
            </pre>
            <button type="button" className="admin-button" onClick={copy}>
              <ClipboardCopy size={15} aria-hidden="true" /> {copied ? "Copied" : "Copy record"}
            </button>
            <p className="admin-record-help">
              Send it to the web team, or add it to the “
              {kind === "advisory" ? "advisories" : "requirements"}” list in
              src/content/travel-advisory.json and update “lastReviewed”. It appears on the public
              page with the next website build.
            </p>
          </>
        ) : (
          <EmptyState icon={ShieldCheck} title="Nothing prepared yet">
            Fill in the form and choose “Check and prepare”. The finished record appears here.
          </EmptyState>
        )}
      </aside>
    </div>
  );
}

function RecordsTable({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <caption className="admin-sr-only">{caption}</caption>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, index) => (
            <tr key={index}>
              {cells.map((cell, column) => (
                <td key={column}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type QueueStatus = "awaiting" | "published" | "changed";
const queueLabels: Record<QueueStatus, { label: string; style: string }> = {
  awaiting: { label: "Awaiting review", style: "is-new" },
  changed: { label: "Changed since review", style: "is-progress" },
  published: { label: "Published", style: "is-done" },
};

/** Where a WHO report stands here: not yet summarised, published, or edited by WHO since. */
function queueStatus(report: WhoReport): QueueStatus {
  const advisory = travelData.advisories.find((item) => item.sourceUrl === report.url);
  if (!advisory) return "awaiting";
  return advisory.reviewedAt < report.modified.slice(0, 10) ? "changed" : "published";
}

const clock = (date: Date) =>
  date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

function WhoQueue({
  state,
  reload,
  onPrepare,
}: {
  state: WhoState;
  reload: () => void;
  onPrepare: (report: WhoReport) => void;
}) {
  return (
    <div className="admin-who">
      <div className="admin-who-bar">
        <p>
          <strong>WHO Disease Outbreak News</strong>
          <span className="admin-muted">
            {state.status === "ready"
              ? `Ebola reports from the past 12 months · checked ${clock(state.checkedAt)}`
              : state.status === "loading"
                ? "Checking WHO…"
                : "WHO could not be reached"}
          </span>
        </p>
        <button
          type="button"
          className="admin-button is-ghost is-small"
          onClick={reload}
          disabled={state.status === "loading"}
        >
          <RefreshCw size={14} aria-hidden="true" /> Refresh
        </button>
      </div>
      {state.status === "loading" && (
        <p className="admin-who-wait">
          <LoaderCircle className="admin-spin" size={16} aria-hidden="true" /> Loading reports from
          WHO…
        </p>
      )}
      {state.status === "error" && (
        <EmptyState icon={WifiOff} title="WHO’s reports couldn’t be loaded">
          The connection or WHO’s service may be unavailable. Choose Refresh to try again.
        </EmptyState>
      )}
      {state.status === "ready" &&
        (state.reports.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table admin-who-table">
              <caption className="admin-sr-only">
                WHO Ebola reports awaiting editorial review
              </caption>
              <thead>
                <tr>
                  <th scope="col">Report</th>
                  <th scope="col">Countries</th>
                  <th scope="col">Published</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="admin-sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {state.reports.map((report) => {
                  const status = queueLabels[queueStatus(report)];
                  return (
                    <tr key={report.donId}>
                      <td>
                        <span className="admin-who-report">
                          <strong>{report.donId}</strong>
                          <span>{report.title}</span>
                        </span>
                      </td>
                      <td className="admin-who-countries">
                        {report.countries.map((country) => country.name).join(", ") || "—"}
                      </td>
                      <td>
                        {formatWhoDate(report.published)}
                        {report.updated && (
                          <span className="admin-who-updated">
                            Updated {formatWhoDate(report.modified)}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`admin-status ${status.style}`}>{status.label}</span>
                      </td>
                      <td>
                        <span className="admin-who-actions">
                          <a
                            className="admin-icon-link"
                            href={report.url}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`Open ${report.donId} on who.int`}
                            title="Open on who.int"
                          >
                            <ArrowUpRight size={16} aria-hidden="true" />
                          </a>
                          <button
                            type="button"
                            className="admin-button is-small"
                            onClick={() => onPrepare(report)}
                            aria-label={`Prepare a record from ${report.donId}`}
                          >
                            <PenLine size={14} aria-hidden="true" /> Prepare
                          </button>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={Inbox} title="No WHO Ebola reports in the past 12 months">
            New Disease Outbreak News about Ebola appears here for an editor to review.
          </EmptyState>
        ))}
    </div>
  );
}

export function TravelAdvisoriesView() {
  const [tab, setTab] = useState<TabId>("queue");
  const [draft, setDraft] = useState<Draft | null>(null);
  const who = useWhoReports();
  const { advisories, requirements, sources } = travelData;
  const awaiting =
    who.state.status === "ready"
      ? who.state.reports.filter((report) => queueStatus(report) !== "published").length
      : null;

  const prepareFrom = (report: WhoReport) => {
    const country = report.countries.find((entry) => countries.includes(entry.siteName ?? ""));
    setDraft({
      kind: "advisory",
      report,
      form: {
        country: country?.siteName ?? "",
        title: report.title,
        sourceName: `WHO Disease Outbreak News ${report.donId}`,
        sourceUrl: report.url,
        publishedDate: report.published.slice(0, 10),
      },
    });
    setTab("prepare");
  };

  // Arrow keys move between tabs, as in any tab list.
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length]!;
    setTab(next.id);
    document.getElementById(`travel-tab-${next.id}`)?.focus();
  };

  const stats = [
    {
      label: "Awaiting review",
      value: awaiting ?? "—",
      note:
        who.state.status === "error"
          ? "WHO could not be reached"
          : "WHO reports not yet published here",
      icon: Inbox,
      live: awaiting !== null,
    },
    {
      label: "Published advisories",
      value: advisories.length,
      note: "On the public page",
      icon: Newspaper,
      live: true,
    },
    {
      label: "Published requirements",
      value: requirements.length,
      note: "Entry, exit, transit and airline",
      icon: ListChecks,
      live: true,
    },
    {
      label: "Official sources",
      value: sources.length,
      note: "In the source register",
      icon: Landmark,
      live: true,
    },
  ];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-overline">Travel Risk Intelligence</p>
          <h1>Travel advisories</h1>
          <p className="admin-lede">
            Review official-source notices and publish travel requirements for the public Travel
            Advisory page.
          </p>
        </div>
        <div className="admin-head-actions">
          <a
            className="admin-button is-ghost"
            href={travelAdvisoryPage}
            target="_blank"
            rel="noreferrer"
          >
            View public page <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button
            type="button"
            className="admin-button"
            onClick={() => {
              setDraft(null);
              setTab("prepare");
            }}
          >
            <FilePlus2 size={15} aria-hidden="true" /> Prepare a record
          </button>
        </div>
      </div>

      <p className="admin-notice">
        <Info size={16} aria-hidden="true" />
        <span>
          <strong>Editorial workspace preview.</strong> WHO reports load live from WHO, and
          published figures are counted from the website. The CDC feed, saving and the activity log
          connect once an advisory service is set up.
        </span>
      </p>

      <section className="admin-stats" aria-label="Travel advisory figures">
        {stats.map(({ label, value, note, icon: Icon, live }) => (
          <div className="admin-stat" key={label}>
            <div className="admin-stat-top">
              <span className="admin-stat-icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              {live ? (
                <span className="admin-tag is-live">
                  <Database size={11} aria-hidden="true" /> Live
                </span>
              ) : (
                <span className="admin-tag is-sample">
                  {who.state.status === "loading" ? "Checking" : "Unavailable"}
                </span>
              )}
            </div>
            <p className="admin-stat-value">{value}</p>
            <p className="admin-stat-label">{label}</p>
            <p className="admin-stat-note">{note}</p>
          </div>
        ))}
      </section>

      <div className="admin-tabs" role="tablist" aria-label="Travel advisory workspace">
        {tabs.map(({ id, label, icon: Icon }, index) => (
          <button
            key={id}
            id={`travel-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-controls={`travel-panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onClick={() => setTab(id)}
            onKeyDown={(event) => onTabKey(event, index)}
          >
            <Icon size={16} aria-hidden="true" /> {label}
          </button>
        ))}
      </div>

      <div
        id={`travel-panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`travel-tab-${tab}`}
        className="admin-tab-panel"
      >
        {tab === "queue" && (
          <section className="admin-card" aria-labelledby="queue-title">
            <div className="admin-card-head">
              <div>
                <h2 id="queue-title">Review queue</h2>
                <p>
                  WHO reports arrive here automatically. None reach travellers as Sentinel Africa
                  advisories until an editor publishes a reviewed summary.
                </p>
              </div>
            </div>
            <ol className="admin-workflow">
              {workflow.map(({ icon: Icon, title, text }, index) => (
                <li key={title}>
                  <span className="admin-workflow-icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="admin-workflow-step">Step {index + 1}</span>
                  <strong>{title}</strong>
                  <span className="admin-muted">{text}</span>
                </li>
              ))}
            </ol>
            <WhoQueue state={who.state} reload={who.reload} onPrepare={prepareFrom} />
          </section>
        )}

        {tab === "published" && (
          <div className="admin-stack">
            <section className="admin-card" aria-labelledby="published-advisories-title">
              <div className="admin-card-head">
                <div>
                  <h2 id="published-advisories-title">Advisory summaries</h2>
                  <p>Shown in the Advisory library and on matching routes.</p>
                </div>
                <span className="admin-tag is-live">
                  <Database size={11} aria-hidden="true" /> Live
                </span>
              </div>
              {advisories.length ? (
                <RecordsTable
                  caption="Published advisory summaries"
                  headers={["Country", "Title", "Source", "Published", "Reviewed"]}
                  rows={advisories.map((advisory) => [
                    advisory.country,
                    advisory.title,
                    advisory.sourceName,
                    advisory.publishedDate,
                    advisory.reviewedAt,
                  ])}
                />
              ) : (
                <EmptyState icon={Newspaper} title="No advisory summaries published">
                  Travellers see “No editor-approved advisory” for every country until one is added.
                </EmptyState>
              )}
            </section>
            <section className="admin-card" aria-labelledby="published-requirements-title">
              <div className="admin-card-head">
                <div>
                  <h2 id="published-requirements-title">Travel requirements</h2>
                  <p>Matched by country, direction, airline and the dates they are in force.</p>
                </div>
                <span className="admin-tag is-live">
                  <Database size={11} aria-hidden="true" /> Live
                </span>
              </div>
              {requirements.length ? (
                <RecordsTable
                  caption="Published travel requirements"
                  headers={["Country", "Applies on", "Category", "Title", "Reviewed"]}
                  rows={requirements.map((requirement) => [
                    requirement.country,
                    requirement.direction,
                    requirement.category,
                    requirement.title,
                    requirement.reviewedAt,
                  ])}
                />
              ) : (
                <EmptyState icon={ListChecks} title="No travel requirements published">
                  Every check on the public page shows “Not verified” until a sourced requirement is
                  added.
                </EmptyState>
              )}
            </section>
          </div>
        )}

        {tab === "prepare" && <PrepareRecord key={draft?.report.donId ?? "blank"} draft={draft} />}

        {tab === "sources" && (
          <section className="admin-card" aria-labelledby="sources-title">
            <div className="admin-card-head">
              <div>
                <h2 id="sources-title">Official source register</h2>
                <p>
                  The only sources records may come from. Shown publicly on the Travel Advisory
                  page.
                </p>
              </div>
            </div>
            <ul className="admin-source-list">
              {sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer">
                    <span>
                      <strong>{source.name}</strong>
                      <span className="admin-muted">{source.publisher}</span>
                    </span>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "activity" && (
          <section className="admin-card" aria-labelledby="activity-title">
            <div className="admin-card-head">
              <div>
                <h2 id="activity-title">Activity log</h2>
                <p>Every detection, publication and withdrawal, with the editor who acted.</p>
              </div>
            </div>
            <EmptyState icon={UserCheck} title="No activity recorded yet">
              Editorial actions are recorded here with each editor’s name once staff accounts and
              the advisory service are connected.
            </EmptyState>
          </section>
        )}
      </div>
    </>
  );
}
