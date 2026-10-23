import type { ReactNode } from "react";
import { ArrowLeft, FileText, Inbox, MapPin, Users } from "lucide-react";
import shield from "@/assets/logos/sentinel-shield.png";
import skyline from "@/assets/amani-nation-LTh5pGyvKAM-unsplash.jpg";
import "./staff.css";

const consoleTasks = [
  { icon: Inbox, label: "Respond to enquiries and training bookings" },
  { icon: FileText, label: "Publish articles, courses and service updates" },
  { icon: Users, label: "Keep team, board and media up to date" },
];

/** Split screen shared by the staff sign-in pages: photograph left, form right. */
export function AuthLayout({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <div className="auth-page">
      <aside className="auth-visual" aria-label="Sentinel Africa staff portal">
        <img className="auth-visual-photo" src={skyline} alt="" />
        <div className="auth-visual-content">
          <a className="auth-brand" href="/" aria-label="Sentinel Africa Consulting home">
            <img src={shield} alt="" width="40" height="40" />
            <span>
              Sentinel Africa
              <small>Staff portal</small>
            </span>
          </a>
          <div className="auth-visual-copy">
            <p className="auth-kicker">Risk management advisory</p>
            <p className="auth-statement">
              Steering the conversations that build better-run organizations.
            </p>
            <ul className="auth-tasks">
              {consoleTasks.map(({ icon: Icon, label }) => (
                <li key={label}>
                  <span>
                    <Icon size={15} aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <p className="auth-location">
            <MapPin size={13} aria-hidden="true" /> Head office · Nairobi, Kenya
          </p>
        </div>
      </aside>
      <main className="auth-panel">
        <a className="auth-back" href="/">
          <ArrowLeft size={15} aria-hidden="true" /> Back to website
        </a>
        <div className="auth-card">
          <img className="auth-card-mark" src={shield} alt="" width="44" height="44" />
          <h1>{title}</h1>
          <p className="auth-intro">{intro}</p>
          {children}
        </div>
        <p className="auth-footer">
          © {new Date().getFullYear()} Sentinel Africa Consulting. Authorised staff only.
        </p>
      </main>
    </div>
  );
}
