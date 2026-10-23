import { useState } from "react";
import { ArrowUpRight, Globe2, History, LoaderCircle, RefreshCw, WifiOff } from "lucide-react";
import {
  formatWhoDate,
  reportsFor,
  whoNewsPage,
  type WhoReport,
  type WhoState,
} from "./whoOutbreakNews";

const time = (date: Date) =>
  date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

/** One line in the hero status card: the newest WHO report, or why there is none. */
export function WhoStatusLine({ state }: { state: WhoState }) {
  if (state.status === "loading")
    return (
      <p className="ta-who-line">
        <LoaderCircle className="ta-spin" size={15} aria-hidden="true" /> Checking WHO outbreak
        reports…
      </p>
    );
  if (state.status === "error")
    return (
      <p className="ta-who-line">
        <WifiOff size={15} aria-hidden="true" /> WHO reports are unavailable right now
      </p>
    );
  const latest = state.reports[0];
  return (
    <p className="ta-who-line">
      <Globe2 size={15} aria-hidden="true" />
      {latest ? (
        <span>
          Latest WHO report{" "}
          <a href={latest.url} target="_blank" rel="noreferrer">
            {latest.donId}
          </a>{" "}
          · {formatWhoDate(latest.published)}
        </span>
      ) : (
        "No WHO Ebola report in the past 12 months"
      )}
    </p>
  );
}

function ReportLink({ report }: { report: WhoReport }) {
  return (
    <a className="ta-who-route-link" href={report.url} target="_blank" rel="noreferrer">
      <span className="ta-who-route-title">{report.title}</span>
      <span className="ta-who-route-meta">
        {report.donId} · {formatWhoDate(report.published)}
        {report.updated && ` · updated ${formatWhoDate(report.modified)}`}
        <ArrowUpRight size={13} aria-hidden="true" />
      </span>
    </a>
  );
}

/** The WHO reports naming one country of a checked route. */
export function WhoRouteReports({ state, country }: { state: WhoState; country: string }) {
  if (state.status === "loading")
    return (
      <p className="ta-who-route-note">
        <LoaderCircle className="ta-spin" size={14} aria-hidden="true" /> Checking WHO…
      </p>
    );
  if (state.status === "error")
    return (
      <p className="ta-who-route-note">
        WHO reports couldn’t be loaded.{" "}
        <a href={whoNewsPage} target="_blank" rel="noreferrer">
          Check who.int directly
        </a>
        .
      </p>
    );
  const matches = reportsFor(state.reports, country);
  if (!matches.length)
    return (
      <p className="ta-who-route-note">
        No WHO Ebola outbreak report in the past 12 months names this country. This is not
        confirmation that there is no risk.
      </p>
    );
  return (
    <ul className="ta-who-route">
      {matches.slice(0, 3).map((report) => (
        <li key={report.donId}>
          <ReportLink report={report} />
        </li>
      ))}
      {matches.length > 3 && (
        <li className="ta-who-route-more">
          {matches.length - 3} earlier {matches.length - 3 === 1 ? "report" : "reports"} in the
          Latest WHO outbreak reports section below
        </li>
      )}
    </ul>
  );
}

const shownAtFirst = 6;

/** Section listing WHO's Ebola reports of the past year, straight from WHO. */
export function WhoLatestSection({ state, reload }: { state: WhoState; reload: () => void }) {
  const [showAll, setShowAll] = useState(false);
  const reports = state.status === "ready" ? state.reports : [];
  const visible = showAll ? reports : reports.slice(0, shownAtFirst);

  return (
    <section id="who-reports" className="svc-section" aria-labelledby="who-title">
      <div className="site-container">
        <div className="ta-library-head">
          <div className="ta-section-head">
            <p className="eyebrow">Live from the World Health Organization</p>
            <h2 id="who-title">Latest WHO outbreak reports</h2>
            <p className="svc-body">
              Ebola Disease Outbreak News from the past 12 months, straight from WHO. These are
              WHO’s own reports, not yet reviewed by Sentinel Africa. Open each one on who.int for
              the full assessment and WHO’s travel advice.
            </p>
          </div>
          <div className="ta-library-tools">
            <span className="ta-reviewed-chip" aria-live="polite">
              {state.status === "ready" ? (
                <>
                  <span className="ta-live-dot" aria-hidden="true" /> Live · checked{" "}
                  {time(state.checkedAt)}
                </>
              ) : state.status === "loading" ? (
                <>
                  <LoaderCircle className="ta-spin" size={14} aria-hidden="true" /> Checking WHO…
                </>
              ) : (
                <>
                  <WifiOff size={14} aria-hidden="true" /> Not available
                </>
              )}
            </span>
            <button
              type="button"
              className="ta-ghost-button"
              onClick={reload}
              disabled={state.status === "loading"}
            >
              <RefreshCw size={15} aria-hidden="true" /> Refresh
            </button>
          </div>
        </div>

        {state.status === "loading" && (
          <ul className="ta-who-grid" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index} className="ta-who-card is-skeleton">
                <span />
                <span />
                <span />
              </li>
            ))}
          </ul>
        )}

        {state.status === "error" && (
          <div className="ta-empty">
            <span className="ta-empty-icon">
              <WifiOff size={24} aria-hidden="true" />
            </span>
            <div>
              <h3>WHO’s reports couldn’t be loaded right now</h3>
              <p>
                Your connection or WHO’s service may be unavailable. Try again, or read the reports
                on{" "}
                <a href={whoNewsPage} target="_blank" rel="noreferrer">
                  who.int
                </a>
                .
              </p>
            </div>
          </div>
        )}

        {state.status === "ready" &&
          (reports.length ? (
            <>
              <ul className="ta-who-grid">
                {visible.map((report) => (
                  <li key={report.donId} className="ta-who-card">
                    <div className="ta-who-card-top">
                      <span className="ta-who-id">{report.donId}</span>
                      <span>{formatWhoDate(report.published)}</span>
                    </div>
                    <h3>{report.title}</h3>
                    {report.countries.length > 0 && (
                      <ul className="ta-who-countries" aria-label="Countries named by WHO">
                        {report.countries.map((country) => (
                          <li key={country.name}>{country.name}</li>
                        ))}
                      </ul>
                    )}
                    <div className="ta-who-card-foot">
                      {report.updated ? (
                        <span className="ta-who-updated">
                          <History size={13} aria-hidden="true" /> Updated by WHO{" "}
                          {formatWhoDate(report.modified)}
                        </span>
                      ) : (
                        <span />
                      )}
                      <a href={report.url} target="_blank" rel="noreferrer">
                        Read on who.int <ArrowUpRight size={14} aria-hidden="true" />
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
              {reports.length > shownAtFirst && (
                <button
                  type="button"
                  className="ta-ghost-button ta-who-more"
                  onClick={() => setShowAll(!showAll)}
                  aria-expanded={showAll}
                >
                  {showAll ? "Show fewer reports" : `Show all ${reports.length} reports`}
                </button>
              )}
            </>
          ) : (
            <div className="ta-empty">
              <span className="ta-empty-icon">
                <Globe2 size={24} aria-hidden="true" />
              </span>
              <div>
                <h3>No WHO Ebola reports in the past 12 months</h3>
                <p>
                  WHO has published no Ebola Disease Outbreak News in this period. Always check the
                  official sources before you travel.
                </p>
              </div>
            </div>
          ))}
        <p className="ta-editor-note">
          Source: WHO Disease Outbreak News. Content © World Health Organization, shown as titles,
          dates and links only.
        </p>
      </div>
    </section>
  );
}
