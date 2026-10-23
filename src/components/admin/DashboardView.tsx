import {
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  CircleDot,
  Clock3,
  Database,
  GraduationCap,
  ImagePlus,
  Inbox,
  Info,
  Newspaper,
  PenLine,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import postIndex from "@/content/blog-index.json";
import { courseAreas } from "../site/trainingCourses";
import { blogPost, blogPage } from "../site/navigation";

const courseCount = courseAreas.reduce(
  (total, area) => total + area.groups.reduce((sum, group) => sum + group.courses.length, 0),
  0,
);
const latestArticles = [...postIndex].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

/** A figure is either placeholder ("sample") or counted from the website's own content ("live"). */
type Source = "sample" | "live";

const stats: {
  label: string;
  value: number;
  note: string;
  icon: LucideIcon;
  source: Source;
  href: string;
}[] = [
  {
    label: "Open enquiries",
    value: 12,
    note: "4 received this week",
    icon: Inbox,
    source: "sample",
    href: "#enquiries",
  },
  {
    label: "Training bookings",
    value: 38,
    note: "Sessions in the next 30 days",
    icon: CalendarCheck,
    source: "sample",
    href: "#bookings",
  },
  {
    label: "Published articles",
    value: postIndex.length,
    note: "Live on the blog",
    icon: Newspaper,
    source: "live",
    href: "#articles",
  },
  {
    label: "Certification courses",
    value: courseCount,
    note: `Across ${courseAreas.length} training areas`,
    icon: GraduationCap,
    source: "live",
    href: "#courses",
  },
];

type Status = "new" | "progress" | "done";
const statusStyle: Record<Status, { label: string; icon: LucideIcon }> = {
  new: { label: "New", icon: CircleDot },
  progress: { label: "In progress", icon: Clock3 },
  done: { label: "Responded", icon: CheckCircle2 },
};

const enquiries: { organisation: string; service: string; received: string; status: Status }[] = [
  {
    organisation: "Commercial bank",
    service: "Information Security",
    received: "Today, 09:42",
    status: "new",
  },
  {
    organisation: "County government",
    service: "Data Protection & Privacy",
    received: "Today, 08:15",
    status: "new",
  },
  {
    organisation: "Insurance group",
    service: "Training",
    received: "Yesterday",
    status: "progress",
  },
  {
    organisation: "Telecoms operator",
    service: "Cybershield",
    received: "2 days ago",
    status: "progress",
  },
  {
    organisation: "Regional NGO",
    service: "Business Continuity",
    received: "3 days ago",
    status: "done",
  },
];

const quickActions = [
  {
    label: "Write an article",
    note: "Draft a post for the blog",
    icon: PenLine,
    href: "#articles",
  },
  {
    label: "Add a course session",
    note: "Schedule public training",
    icon: CalendarCheck,
    href: "#bookings",
  },
  { label: "Upload media", note: "Photos, videos, documents", icon: ImagePlus, href: "#media" },
  {
    label: "Invite a colleague",
    note: "Give staff console access",
    icon: UserPlus,
    href: "#staff",
  },
];

function SourceTag({ source }: { source: Source }) {
  return source === "sample" ? (
    <span className="admin-tag is-sample" title="Placeholder figure until live data is connected">
      Sample
    </span>
  ) : (
    <span className="admin-tag is-live" title="Counted from the website’s published content">
      <Database size={11} aria-hidden="true" /> Live
    </span>
  );
}

const greeting = (hour: number) =>
  hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export function DashboardView() {
  const now = new Date();
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-overline">
            {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <h1>{greeting(now.getHours())}, Administrator</h1>
          <p className="admin-lede">Here’s what’s happening across the Sentinel Africa website.</p>
        </div>
        <div className="admin-head-actions">
          <a className="admin-button is-ghost" href="/" target="_blank" rel="noreferrer">
            View website <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a className="admin-button" href="#articles">
            <PenLine size={15} aria-hidden="true" /> New article
          </a>
        </div>
      </div>

      <p className="admin-notice">
        <Info size={16} aria-hidden="true" />
        <span>
          <strong>Layout preview.</strong> Figures marked “Sample” are placeholders until the
          console is connected to live data. Figures marked “Live” are counted from the website.
        </span>
      </p>

      <section className="admin-stats" aria-label="Key figures">
        {stats.map(({ label, value, note, icon: Icon, source, href }) => (
          <a className="admin-stat" href={href} key={label}>
            <div className="admin-stat-top">
              <span className="admin-stat-icon">
                <Icon size={18} aria-hidden="true" />
              </span>
              <SourceTag source={source} />
            </div>
            <p className="admin-stat-value">{value}</p>
            <p className="admin-stat-label">{label}</p>
            <p className="admin-stat-note">{note}</p>
          </a>
        ))}
      </section>

      <div className="admin-grid">
        <section className="admin-card admin-span-2" aria-labelledby="recent-enquiries">
          <div className="admin-card-head">
            <div>
              <h2 id="recent-enquiries">Recent enquiries</h2>
              <p>Callback requests sent from the website.</p>
            </div>
            <div className="admin-card-tools">
              <SourceTag source="sample" />
              <a className="admin-link" href="#enquiries">
                View all
              </a>
            </div>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th scope="col">Organisation</th>
                  <th scope="col">Service</th>
                  <th scope="col">Received</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((row) => {
                  const { label, icon: StatusIcon } = statusStyle[row.status];
                  return (
                    <tr key={row.organisation}>
                      <td>
                        <span className="admin-org">
                          <span aria-hidden="true">{row.organisation.charAt(0)}</span>
                          {row.organisation}
                        </span>
                      </td>
                      <td>{row.service}</td>
                      <td className="admin-muted">{row.received}</td>
                      <td>
                        <span className={`admin-status is-${row.status}`}>
                          <StatusIcon size={13} aria-hidden="true" /> {label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card" aria-labelledby="latest-articles">
          <div className="admin-card-head">
            <div>
              <h2 id="latest-articles">Latest articles</h2>
              <p>Most recently published on the blog.</p>
            </div>
            <SourceTag source="live" />
          </div>
          <ol className="admin-articles">
            {latestArticles.map((post) => (
              <li key={post.slug}>
                <a href={blogPost(post.slug)} target="_blank" rel="noreferrer">
                  <span className="admin-article-title">{post.title}</span>
                  <span className="admin-muted">
                    {formatDate(post.date)} · {post.categories[0] ?? "Article"}
                  </span>
                </a>
              </li>
            ))}
          </ol>
          <a
            className="admin-link admin-card-foot"
            href={blogPage}
            target="_blank"
            rel="noreferrer"
          >
            Open the blog <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </section>

        <section className="admin-card admin-span-3" aria-labelledby="quick-actions">
          <div className="admin-card-head">
            <div>
              <h2 id="quick-actions">Quick actions</h2>
              <p>Shortcuts to the tasks staff do most often.</p>
            </div>
          </div>
          <div className="admin-actions">
            {quickActions.map(({ label, note, icon: Icon, href }) => (
              <a className="admin-action" href={href} key={label}>
                <span className="admin-action-icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <span>
                  <strong>{label}</strong>
                  <span className="admin-muted">{note}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
