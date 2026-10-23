import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  ChevronDown,
  CircleAlert,
  ExternalLink,
  FileSearch,
  Info,
  Landmark,
  LockKeyhole,
  MapPinned,
  Pencil,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Printer,
  Route,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { InnerPage, PageCta, PageHero } from "../site/InnerPage";
import { contactLink, staffLoginPage, toolsPage, travelInterest } from "../site/navigation";
import { Reveal } from "../site/Reveal";
import { OtherTools } from "../site/ServiceBlocks";
import {
  buildReport,
  formatDate,
  today,
  travelData,
  unmatchedAirline,
  unmatchedCountry,
  type Journey,
  type JourneyReport,
  type Requirement,
  type StopRole,
} from "./travelAdvisory";
import { useWhoReports, type WhoState } from "./whoOutbreakNews";
import { WhoLatestSection, WhoRouteReports, WhoStatusLine } from "./WhoReports";
import "../site/services.css";
import "./travel.css";

const nationalities = [
  ...travelData.countries.filter((country) => country !== unmatchedCountry),
  "Other nationality",
];
const travellerStatuses = ["Citizen", "Resident", "Visitor"];

type Fields = Journey & { nationality: string; status: string; area: string };
type Checked = { journey: Journey; traveller: string; area: string };
type Errors = Partial<Record<"from" | "to" | "via" | "date", string>>;

const emptyFields = (): Fields => ({
  from: "",
  to: "",
  via: "",
  date: today(),
  airline: "",
  flight: "",
  nationality: "",
  status: "",
  area: "",
});

const isoDate = /^\d{4}-\d{2}-\d{2}$/;

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.from) errors.from = "Choose where you are travelling from.";
  if (!fields.to) errors.to = "Choose where you are travelling to.";
  else if (fields.to === fields.from && fields.to !== unmatchedCountry)
    errors.to = "Choose a destination different from your departure country.";
  if (fields.via && (fields.via === fields.from || fields.via === fields.to))
    errors.via = "A transit country must differ from your departure and destination.";
  if (!isoDate.test(fields.date)) errors.date = "Choose your departure date.";
  return errors;
}

/** A journey shared as /travel-advisory/?from=…&to=… opens with its results. */
function journeyFromUrl(): Fields | null {
  const params = new URLSearchParams(window.location.search);
  const pick = (key: string, allowed: string[]) => {
    const value = params.get(key) ?? "";
    return allowed.includes(value) ? value : "";
  };
  const fields: Fields = {
    ...emptyFields(),
    from: pick("from", travelData.countries),
    to: pick("to", travelData.countries),
    via: pick("via", travelData.countries),
    date: params.get("date") ?? "",
    airline: pick(
      "airline",
      travelData.airlines.map((airline) => airline.name),
    ),
    flight: (params.get("flight") ?? "").slice(0, 12),
  };
  return Object.keys(validate(fields)).length ? null : fields;
}

/** Keeps the address bar in step with the checked journey so it can be bookmarked or shared. */
function saveJourneyToUrl(journey: Journey) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(journey)) if (value) params.set(key, value);
  window.history.replaceState(null, "", `${window.location.pathname}?${params}#results`);
}

const stopIcon: Record<StopRole, typeof PlaneTakeoff> = {
  departure: PlaneTakeoff,
  transit: Route,
  destination: PlaneLanding,
};
const stopLabel: Record<StopRole, string> = {
  departure: "Departure",
  transit: "Transit",
  destination: "Destination",
};

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  hint,
  optional = false,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  error?: string | undefined;
  optional?: boolean;
}) {
  return (
    <div className="ta-field">
      <label htmlFor={id}>
        {label} {optional && <span className="ta-optional">Optional</span>}
      </label>
      <div className="ta-select">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden="true" />
      </div>
      {hint && !error && (
        <p className="ta-hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ta-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}

function StatusChip({ verified }: { verified: boolean }) {
  return verified ? (
    <span className="ta-chip is-verified">
      <BadgeCheck size={14} aria-hidden="true" /> Verified
    </span>
  ) : (
    <span className="ta-chip is-unverified">
      <CircleAlert size={14} aria-hidden="true" /> Not verified
    </span>
  );
}

function SourceLink({ name, url }: { name: string; url: string }) {
  return (
    <a className="ta-source-link" href={url} target="_blank" rel="noreferrer">
      {name} <ExternalLink size={13} aria-hidden="true" />
    </a>
  );
}

function RequirementRecord({ record }: { record: Requirement }) {
  return (
    <div className="ta-record">
      <p className="ta-record-title">{record.title}</p>
      <p className="ta-record-detail">{record.detail}</p>
      <p className="ta-record-meta">
        <SourceLink name={record.sourceName} url={record.sourceUrl} />
        <span>Published {formatDate(record.publishedDate)}</span>
        {record.effectiveFrom && <span>In force from {formatDate(record.effectiveFrom)}</span>}
        {record.effectiveUntil && <span>Until {formatDate(record.effectiveUntil)}</span>}
        <span>Reviewed {formatDate(record.reviewedAt)}</span>
      </p>
    </div>
  );
}

function CheckRow({ label, records }: { label: string; records: Requirement[] }) {
  return (
    <li className="ta-check">
      <div className="ta-check-head">
        <span>{label}</span>
        <StatusChip verified={records.length > 0} />
      </div>
      {records.length > 0 ? (
        records.map((record) => <RequirementRecord key={record.id} record={record} />)
      ) : (
        <p className="ta-check-empty">
          No reviewed record. Confirm with the official sources before you travel.
        </p>
      )}
    </li>
  );
}

function Results({
  journey,
  report,
  traveller,
  area,
  who,
  onEdit,
}: {
  journey: Journey;
  report: JourneyReport;
  traveller: string;
  area: string;
  who: WhoState;
  onEdit: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, [journey]);

  return (
    <section id="results" className="ta-results" aria-labelledby="results-title">
      <div className="ta-results-head">
        <div>
          <p className="eyebrow">Your journey</p>
          <h2 id="results-title" ref={heading} tabIndex={-1}>
            {[journey.from, journey.via, journey.to].filter(Boolean).join(" → ")}
          </h2>
          <p className="ta-results-meta">
            <span>Departing {formatDate(journey.date)}</span>
            {journey.airline && (
              <span>
                {journey.airline}
                {journey.flight && ` · ${journey.flight.toUpperCase()}`}
              </span>
            )}
            {traveller && <span>{traveller}</span>}
          </p>
        </div>
        <div className="ta-results-actions">
          <button type="button" className="ta-ghost-button" onClick={onEdit}>
            <Pencil size={15} aria-hidden="true" /> Edit journey
          </button>
          <button type="button" className="ta-ghost-button" onClick={() => window.print()}>
            <Printer size={15} aria-hidden="true" /> Print
          </button>
        </div>
      </div>

      <div className="ta-verdict" role="status">
        <span className="ta-verdict-icon">
          <ShieldCheck size={22} aria-hidden="true" />
        </span>
        <div>
          <p className="ta-verdict-title">
            Not a travel clearance <span>Information service</span>
          </p>
          <p>
            <strong>
              {report.verified} of {report.total}
            </strong>{" "}
            checks on this route have a reviewed record from an official source. Anything marked
            “Not verified” means the information is not available here. It does not mean there is no
            requirement or no risk.
          </p>
        </div>
      </div>

      <ol className="ta-route">
        {report.stops.map((stop) => {
          const Icon = stopIcon[stop.role];
          const other = stop.country === unmatchedCountry;
          return (
            <li key={stop.role} className="ta-stop">
              <div className="ta-stop-head">
                <span className="ta-stop-icon">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <div>
                  <p className="ta-stop-role">{stopLabel[stop.role]}</p>
                  <h3>{other ? "Another country" : stop.country}</h3>
                  {stop.role === "destination" && area && (
                    <p className="ta-stop-area">
                      <MapPinned size={13} aria-hidden="true" /> {area}
                    </p>
                  )}
                </div>
              </div>
              <div className="ta-stop-body">
                <p className="ta-subhead">Published advisories</p>
                {stop.advisories.length > 0 ? (
                  <ul className="ta-advisories">
                    {stop.advisories.map((advisory) => (
                      <li key={advisory.id}>
                        <p className="ta-record-title">{advisory.title}</p>
                        {advisory.regions && (
                          <p className="ta-regions">
                            <MapPinned size={14} aria-hidden="true" /> {advisory.regions}
                          </p>
                        )}
                        <p className="ta-record-detail">{advisory.summary}</p>
                        <p className="ta-record-meta">
                          <SourceLink name={advisory.sourceName} url={advisory.sourceUrl} />
                          <span>Published {formatDate(advisory.publishedDate)}</span>
                          <span>Reviewed {formatDate(advisory.reviewedAt)}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="ta-note">
                    <Info size={15} aria-hidden="true" />
                    {other
                      ? "Records are only kept for the listed countries. Check the official sources below."
                      : "No editor-approved advisory for this country. This is not confirmation that there are no Ebola-related notices."}
                  </p>
                )}
                {!other && (
                  <>
                    <p className="ta-subhead ta-subhead-who">
                      WHO outbreak reports <span>Live · not reviewed</span>
                    </p>
                    <WhoRouteReports state={who} country={stop.country} />
                  </>
                )}
                <p className="ta-subhead">Requirements</p>
                <ul className="ta-checks">
                  {stop.checks.map((check) => (
                    <CheckRow key={check.label} label={check.label} records={check.records} />
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="ta-results-grid">
        <div className="ta-panel">
          <div className="ta-panel-head">
            <Plane size={18} aria-hidden="true" />
            <h3>Airline</h3>
          </div>
          {report.airline ? (
            <>
              <ul className="ta-checks">
                <CheckRow label="Airline requirements" records={report.airline.records} />
              </ul>
              {report.airline.url ? (
                <p className="ta-panel-note">
                  <SourceLink
                    name={`${report.airline.name} official website`}
                    url={report.airline.url}
                  />
                  <span>
                    An official landing page, not live confirmation of today’s requirements.
                  </span>
                </p>
              ) : (
                <p className="ta-panel-note">Check requirements directly with your airline.</p>
              )}
            </>
          ) : (
            <p className="ta-panel-note">
              No airline chosen. Edit your journey to add one and see its official website.
            </p>
          )}
        </div>
        <div className="ta-panel">
          <div className="ta-panel-head">
            <BadgeCheck size={18} aria-hidden="true" />
            <h3>Before you travel</h3>
          </div>
          <ul className="svc-checklist ta-checklist">
            {[
              "Read the latest WHO and CDC notices for every country on your route.",
              "Confirm entry, transit and document rules with your airline and the destination’s authorities.",
              "Check again in the 72 hours before departure. Advisories change.",
              "Ask a qualified health professional for medical advice. This service does not give it.",
            ].map((item) => (
              <li key={item}>
                <span>
                  <BadgeCheck size={14} aria-hidden="true" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="ta-disclaimer">
        Sentinel Africa summarises what official health authorities publish. Summaries are
        independent and informational, not government or WHO endorsements. Sentinel Africa does not
        issue travel restrictions, grant clearance to travel or give medical advice. No IATA
        Timatic, airline or immigration system is connected to this page.
      </p>
    </section>
  );
}

function SectionHead({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="ta-section-head">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {children && <p className="svc-body">{children}</p>}
    </div>
  );
}

const steps = [
  {
    icon: Landmark,
    title: "Official sources",
    text: "Records come only from the World Health Organization, the US CDC and national health authorities, each linked to its source and dates.",
  },
  {
    icon: UserCheck,
    title: "Human review",
    text: "A Sentinel Africa editor reviews each notice and writes a faithful summary before anything is published here.",
  },
  {
    icon: Route,
    title: "Your route",
    text: "We match reviewed records to each country on your journey, and clearly mark everything that is not verified.",
  },
];

const faqs = [
  {
    question: "Is this a travel clearance?",
    answer:
      "No. This is an information service. It does not grant permission to travel, replace immigration or airline checks, or give medical advice.",
  },
  {
    question: "Why does a check say “Not verified”?",
    answer:
      "No reviewed record from an official source is available for it yet. Missing information is never presented as “safe” or as “no requirement”. Check the official sources directly.",
  },
  {
    question: "Where does the information come from?",
    answer:
      "Only from official sources, such as the World Health Organization, the US Centers for Disease Control and Prevention and national health authorities. Sentinel Africa editors summarise them and link every record to its source.",
  },
  {
    question: "Do you store my journey?",
    answer:
      "No. Your journey is checked in your browser and is not sent to Sentinel Africa. The address bar keeps your route so you can bookmark or share it, but nationality, traveller status and destination area are never added to it.",
  },
  {
    question: "Can my organisation use this for staff travel?",
    answer:
      "Anyone can use the journey check. For organisations, Sentinel Africa can help build travel risk into your duty of care, enterprise risk and business continuity planning. Request a callback to discuss your needs.",
  },
];

export default function TravelAdvisoryPage() {
  const [fields, setFields] = useState<Fields>(() => journeyFromUrl() ?? emptyFields());
  const [errors, setErrors] = useState<Errors>({});
  const [checked, setChecked] = useState<Checked | null>(() => {
    const shared = journeyFromUrl();
    return shared ? { journey: shared, traveller: "", area: "" } : null;
  });
  const [libraryCountry, setLibraryCountry] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const who = useWhoReports();

  const set = (key: keyof Fields) => (value: string) =>
    setFields((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const firstInvalid = (["from", "to", "via", "date"] as const).find((key) => found[key]);
    if (firstInvalid) {
      document.getElementById(`ta-${firstInvalid}`)?.focus();
      return;
    }
    const journey: Journey = {
      from: fields.from,
      to: fields.to,
      via: fields.via,
      date: fields.date,
      airline: fields.airline,
      flight: fields.flight.trim(),
    };
    const traveller = [
      fields.nationality && `${fields.nationality} passport`,
      fields.status && `${fields.status} at destination`,
    ]
      .filter(Boolean)
      .join(" · ");
    saveJourneyToUrl(journey);
    setChecked({ journey, traveller, area: fields.area.trim() });
  };

  const editJourney = () => {
    formRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    document.getElementById("ta-from")?.focus({ preventScroll: true });
  };

  const report = checked ? buildReport(checked.journey) : null;
  const verifiedRequirements = travelData.requirements.length;
  const libraryCountries = [...new Set(travelData.advisories.map((advisory) => advisory.country))];
  const library = travelData.advisories
    .filter((advisory) => !libraryCountry || advisory.country === libraryCountry)
    .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate));

  return (
    <InnerPage>
      <PageHero
        trail={[{ label: "Tools", href: toolsPage }]}
        eyebrow="Travel Risk Intelligence"
        title="Travel Advisory"
        lead={
          <p>
            <strong>Travel informed. Stay ahead of the advisory.</strong> Explore Ebola travel
            notices and official health sources for your itinerary, and tell outbreak reports,
            location-specific precautions and travel-entry requirements apart.
          </p>
        }
        actions={
          <>
            <a href="#journey-check" className="button">
              Check your journey <ArrowDown size={16} />
            </a>
            <a href="#how-it-works" className="text-link">
              How it works <ArrowRight size={17} />
            </a>
          </>
        }
        aside={
          <div className="ta-status-card" aria-label="Advisory status">
            <div className="ta-status-top">
              <span className="ta-status-icon">
                <ShieldCheck size={22} aria-hidden="true" />
              </span>
              <div>
                <p className="ta-status-title">Advisory status</p>
                <p className="ta-status-sub">Ebola-related travel</p>
              </div>
            </div>
            <dl className="ta-status-figures">
              <div>
                <dt>{travelData.advisories.length}</dt>
                <dd>Editor-approved advisories</dd>
              </div>
              <div>
                <dt>{verifiedRequirements}</dt>
                <dd>Verified travel requirements</dd>
              </div>
              <div>
                <dt>{travelData.sources.length}</dt>
                <dd>Official sources listed</dd>
              </div>
            </dl>
            <p className="ta-status-review">
              <FileSearch size={15} aria-hidden="true" />
              {travelData.lastReviewed
                ? `Last editorial review ${formatDate(travelData.lastReviewed)}`
                : "Awaiting first editorial review"}
            </p>
            <WhoStatusLine state={who.state} />
            <p className="ta-status-note">
              Information service · Not a travel clearance or medical diagnosis
            </p>
          </div>
        }
      />

      <section
        id="journey-check"
        className="svc-section is-pale ta-check-section"
        aria-labelledby="journey-title"
      >
        <div className="site-container">
          <div className="ta-check-layout">
            <Reveal className="ta-form-card">
              <form ref={formRef} onSubmit={submit} noValidate aria-labelledby="journey-title">
                <p className="ta-step">01 · Journey check</p>
                <h2 id="journey-title">Where are you travelling?</h2>
                <p className="ta-form-intro">
                  Choose your route and date. We’ll show every official advisory and requirement we
                  have reviewed for it.
                </p>
                <div className="ta-fields">
                  <SelectField
                    id="ta-from"
                    label="Travelling from"
                    value={fields.from}
                    onChange={set("from")}
                    options={travelData.countries}
                    placeholder="Select a country"
                    error={errors.from}
                  />
                  <SelectField
                    id="ta-to"
                    label="Travelling to"
                    value={fields.to}
                    onChange={set("to")}
                    options={travelData.countries}
                    placeholder="Select a country"
                    error={errors.to}
                  />
                  <SelectField
                    id="ta-via"
                    label="Transit or recent presence"
                    hint="A country you will pass through or have recently been in."
                    value={fields.via}
                    onChange={set("via")}
                    options={travelData.countries.filter((country) => country !== unmatchedCountry)}
                    placeholder="None, direct journey"
                    error={errors.via}
                    optional
                  />
                  <div className="ta-field">
                    <label htmlFor="ta-date">Departure date</label>
                    <input
                      id="ta-date"
                      type="date"
                      value={fields.date}
                      onChange={(event) => set("date")(event.target.value)}
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={errors.date ? "ta-date-error" : undefined}
                    />
                    {errors.date && (
                      <p className="ta-error" id="ta-date-error">
                        {errors.date}
                      </p>
                    )}
                  </div>
                  <SelectField
                    id="ta-airline"
                    label="Airline"
                    value={fields.airline}
                    onChange={set("airline")}
                    options={travelData.airlines.map((airline) => airline.name)}
                    placeholder="Not specified"
                    optional
                  />
                  <div className="ta-field">
                    <label htmlFor="ta-flight">
                      Flight number <span className="ta-optional">Optional</span>
                    </label>
                    <input
                      id="ta-flight"
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      maxLength={12}
                      placeholder="e.g. WB 402"
                      value={fields.flight}
                      onChange={(event) => set("flight")(event.target.value)}
                    />
                  </div>
                  <SelectField
                    id="ta-nationality"
                    label="Passport nationality"
                    value={fields.nationality}
                    onChange={set("nationality")}
                    options={nationalities}
                    placeholder="Not specified"
                    optional
                  />
                  <SelectField
                    id="ta-status"
                    label="Status at destination"
                    value={fields.status}
                    onChange={set("status")}
                    options={travellerStatuses}
                    placeholder="Not specified"
                    optional
                  />
                  <div className="ta-field ta-field-wide">
                    <label htmlFor="ta-area">
                      Destination city or region <span className="ta-optional">Optional</span>
                    </label>
                    <input
                      id="ta-area"
                      name="destination-area"
                      type="text"
                      autoComplete="off"
                      maxLength={80}
                      placeholder="e.g. Goma, North Kivu"
                      value={fields.area}
                      onChange={(event) => set("area")(event.target.value)}
                    />
                  </div>
                </div>
                <div className="ta-form-foot">
                  <button type="submit" className="button">
                    Check journey requirements <ArrowRight size={17} aria-hidden="true" />
                  </button>
                  <p>
                    <ShieldCheck size={14} aria-hidden="true" /> Checked in your browser. We don’t
                    ask for health data or store your journey.
                  </p>
                </div>
              </form>
            </Reveal>
            <Reveal delay={120} className="ta-legend">
              <p className="ta-step">How to read your results</p>
              <ul>
                <li>
                  <StatusChip verified />
                  <span>
                    A Sentinel Africa editor has reviewed an official source for this check.
                  </span>
                </li>
                <li>
                  <StatusChip verified={false} />
                  <span>
                    No reviewed record yet. The information is unavailable here, never “safe to
                    travel”.
                  </span>
                </li>
              </ul>
              <div className="ta-legend-sources">
                <p>Always confirm with</p>
                <span>WHO</span>
                <span>US CDC</span>
                <span>National health authorities</span>
                <span>Your airline</span>
              </div>
            </Reveal>
          </div>
          {checked && report && (
            <Results
              journey={checked.journey}
              report={report}
              traveller={checked.traveller}
              area={checked.area}
              who={who.state}
              onEdit={editJourney}
            />
          )}
        </div>
      </section>

      <section id="how-it-works" className="svc-section" aria-labelledby="how-title">
        <div className="site-container">
          <Reveal>
            <SectionHead
              eyebrow="How it works"
              title={
                <span id="how-title">
                  Official sources, human review, <span className="blue-text">your route.</span>
                </span>
              }
            />
          </Reveal>
          <Reveal delay={90}>
            <ol className="ta-steps">
              {steps.map(({ icon: Icon, title, text }, index) => (
                <li key={title} className="ta-step-card">
                  <span className="ta-step-number">0{index + 1}</span>
                  <span className="ta-step-icon">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section
        id="advisory-library"
        className="svc-section is-pale"
        aria-labelledby="library-title"
      >
        <div className="site-container">
          <div className="ta-library-head">
            <SectionHead
              eyebrow="Advisory library"
              title={<span id="library-title">Published Sentinel Africa summaries</span>}
            >
              Every advisory our editors have approved, newest first. Each links to the official
              source it summarises.
            </SectionHead>
            <div className="ta-library-tools">
              <span className="ta-reviewed-chip">
                <UserCheck size={14} aria-hidden="true" /> Human reviewed only
              </span>
              {libraryCountries.length > 0 && (
                <div className="ta-field ta-library-filter">
                  <label htmlFor="ta-library-country">Country</label>
                  <div className="ta-select">
                    <select
                      id="ta-library-country"
                      value={libraryCountry}
                      onChange={(event) => setLibraryCountry(event.target.value)}
                    >
                      <option value="">All countries</option>
                      {libraryCountries.map((country) => (
                        <option key={country}>{country}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} aria-hidden="true" />
                  </div>
                </div>
              )}
            </div>
          </div>
          {library.length > 0 ? (
            <ul className="ta-library">
              {library.map((advisory) => (
                <li key={advisory.id} className="ta-library-item">
                  <p className="ta-library-country">{advisory.country}</p>
                  <h3>{advisory.title}</h3>
                  <p className="ta-record-detail">{advisory.summary}</p>
                  <p className="ta-record-meta">
                    <SourceLink name={advisory.sourceName} url={advisory.sourceUrl} />
                    <span>Published {formatDate(advisory.publishedDate)}</span>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="ta-empty">
              <span className="ta-empty-icon">
                <FileSearch size={24} aria-hidden="true" />
              </span>
              <div>
                <h3>No editor-approved advisories yet</h3>
                <p>
                  This is not confirmation that there are no Ebola-related notices. Until our
                  editors publish a reviewed summary, refer to the official sources below.
                </p>
              </div>
            </div>
          )}
          <p className="ta-editor-note">
            <LockKeyhole size={14} aria-hidden="true" />
            Sentinel Africa editors review and publish these records in the staff console.
            <a href={staffLoginPage}>
              Staff sign in <ArrowRight size={14} aria-hidden="true" />
            </a>
          </p>
        </div>
      </section>

      <WhoLatestSection state={who.state} reload={who.reload} />

      <section
        id="official-sources"
        className="svc-section is-pale"
        aria-labelledby="sources-title"
      >
        <div className="site-container">
          <Reveal>
            <SectionHead
              eyebrow="Official source register"
              title={<span id="sources-title">Where our information comes from</span>}
            >
              We only publish what these authorities and carriers say. Open them directly for the
              latest guidance.
            </SectionHead>
          </Reveal>
          <Reveal delay={90}>
            <ul className="ta-sources">
              {travelData.sources.map((source) => (
                <li key={source.url}>
                  <a className="ta-source" href={source.url} target="_blank" rel="noreferrer">
                    <span className="ta-source-publisher">{source.publisher}</span>
                    <span className="ta-source-name">{source.name}</span>
                    <span className="ta-source-host">
                      {hostOf(source.url)} <ArrowUpRight size={14} aria-hidden="true" />
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="ta-organisations" aria-labelledby="organisations-title">
        <div className="site-container ta-organisations-layout">
          <Reveal>
            <p className="eyebrow">For organisations</p>
            <h2 id="organisations-title">
              Managing staff travel? <span>Let’s talk duty of care.</span>
            </h2>
            <p className="ta-organisations-lead">
              Sentinel Africa helps employers, NGOs and travel teams build travel risk into their
              enterprise risk management and business continuity programmes.
            </p>
            <a className="button" href={contactLink(travelInterest)}>
              Talk to our team <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal delay={120}>
            <ul className="ta-organisation-points">
              {[
                { icon: Building2, text: "Travel risk built into your enterprise risk framework" },
                {
                  icon: ShieldCheck,
                  text: "Business continuity planning for outbreaks and disruption",
                },
                { icon: UserCheck, text: "Staff briefings grounded in official, reviewed sources" },
              ].map(({ icon: Icon, text }) => (
                <li key={text}>
                  <span>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="travel-faq" className="svc-section" aria-labelledby="faq-title">
        <div className="site-container ta-faq-layout">
          <SectionHead eyebrow="Questions" title={<span id="faq-title">Frequently asked</span>} />
          <div className="ta-faq">
            {faqs.map((faq) => (
              <details key={faq.question}>
                <summary>
                  {faq.question}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <OtherTools current="Travel Advisory" />

      <PageCta interest={travelInterest} />
    </InnerPage>
  );
}
