import { useState, type ReactNode } from "react";
import { ArrowUpRight, Info, Search, type LucideIcon } from "lucide-react";

// Lists of what visitors send through the website: callback requests, job applications,
// course bookings and shop orders. They fill in once a form service stores submissions.

export interface InboxDef {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  /** Where on the website these come from. */
  source: { label: string; url: string };
  /** Where submissions go today, before the form service is connected. */
  today: string;
  columns: string[];
  statuses: string[];
  /** Rows to show, for lists that already have entries (such as staff accounts). */
  rows?: ReactNode[][];
  action?: { label: string; icon: LucideIcon };
}

export function InboxView({ inbox }: { inbox: InboxDef }) {
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const Icon = inbox.icon;
  const rows = inbox.rows ?? [];
  const Action = inbox.action?.icon;
  const contentLinks: Record<string, { href: string; label: string }> = {
    enquiries: { href: "#homepage/home/contact", label: "Edit contact section" },
    feedback: { href: "#testimonials", label: "Manage public testimonials" },
    applications: { href: "#jobs", label: "Manage job openings" },
    "talent-applications": {
      href: "#career-pages/talent-shield/status",
      label: "Edit Talent Shield programme",
    },
    bookings: { href: "#courses", label: "Manage training courses" },
    orders: { href: "#products", label: "Manage shop products" },
  };
  const related = contentLinks[inbox.id];

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-overline">{inbox.rows ? "Administration" : "Inbox"}</p>
          <h1>{inbox.title}</h1>
          <p className="admin-lede">{inbox.description}</p>
        </div>
        <div className="admin-head-actions">
          {related && (
            <a className="admin-button" href={related.href}>
              {related.label}
            </a>
          )}
          <a
            className="admin-button is-ghost"
            href={inbox.source.url}
            target="_blank"
            rel="noreferrer"
          >
            {inbox.source.label} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          {inbox.action && Action && (
            <button
              type="button"
              className="admin-button"
              disabled
              title="Available when staff accounts are connected"
            >
              <Action size={15} aria-hidden="true" /> {inbox.action.label}
            </button>
          )}
        </div>
      </div>

      <p className="admin-notice">
        <Info size={16} aria-hidden="true" />
        <span>{inbox.today}</span>
      </p>

      <section className="admin-card" aria-label={inbox.title}>
        <div className="cms-inbox-tools">
          <div className="admin-segmented" role="group" aria-label="Filter by status">
            {["All", ...inbox.statuses].map((entry) => (
              <button
                key={entry}
                type="button"
                aria-pressed={status === entry}
                onClick={() => setStatus(entry)}
              >
                {entry}
              </button>
            ))}
          </div>
          <label className="cms-search">
            <Search size={15} aria-hidden="true" />
            <span className="admin-sr-only">Search {inbox.title.toLowerCase()}</span>
            <input
              type="search"
              placeholder="Search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <caption className="admin-sr-only">{inbox.title}</caption>
            <thead>
              <tr>
                {inbox.columns.map((column) => (
                  <th key={column} scope="col">
                    {column}
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
        {!rows.length && (
          <div className="admin-panel-empty">
            <span>
              <Icon size={22} aria-hidden="true" />
            </span>
            <p className="admin-panel-empty-title">Nothing here yet</p>
            <p>
              New {inbox.title.toLowerCase()} will appear here, newest first, with their status.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
