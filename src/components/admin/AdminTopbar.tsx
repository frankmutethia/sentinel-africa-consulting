import { useEffect, useRef, useState, type RefObject } from "react";
import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Phone,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { staffLoginPage } from "../site/navigation";
import type { AdminSection } from "./adminSections";

export type Theme = "light" | "dark";
type OpenMenu = "help" | "profile" | null;

const helpTips = [
  "Use the sidebar to move between sections. Collapse it to give tables more room.",
  "Figures tagged “Live” are counted from the website; “Sample” figures are placeholders.",
  "Your theme and sidebar choices are remembered on this device.",
];

export function AdminTopbar({
  section,
  desktop,
  collapsed,
  drawerOpen,
  toggleRef,
  onToggleSidebar,
  theme,
  onToggleTheme,
}: {
  section: AdminSection;
  desktop: boolean;
  collapsed: boolean;
  drawerOpen: boolean;
  toggleRef: RefObject<HTMLButtonElement | null>;
  onToggleSidebar: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}) {
  const [menu, setMenu] = useState<OpenMenu>(null);
  const actions = useRef<HTMLDivElement>(null);
  // The button that opened the current menu, so Escape can return focus to it.
  const opener = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menu) return;
    const pointerDown = (event: PointerEvent) => {
      if (!actions.current?.contains(event.target as Node)) setMenu(null);
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      opener.current?.focus();
      setMenu(null);
    };
    document.addEventListener("pointerdown", pointerDown);
    document.addEventListener("keydown", keyDown);
    return () => {
      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("keydown", keyDown);
    };
  }, [menu]);

  const toggleMenu = (name: Exclude<OpenMenu, null>, button: HTMLButtonElement) => {
    opener.current = button;
    setMenu(menu === name ? null : name);
  };
  const sidebarLabel = desktop
    ? collapsed
      ? "Expand sidebar"
      : "Collapse sidebar"
    : drawerOpen
      ? "Close navigation"
      : "Open navigation";
  const SidebarIcon = desktop ? (collapsed ? PanelLeftOpen : PanelLeftClose) : Menu;
  const dark = theme === "dark";

  return (
    <header className="admin-topbar">
      <button
        ref={toggleRef}
        type="button"
        className="admin-icon-button"
        aria-label={sidebarLabel}
        title={sidebarLabel}
        aria-controls="admin-sidebar"
        aria-expanded={desktop ? !collapsed : drawerOpen}
        onClick={onToggleSidebar}
      >
        <SidebarIcon size={19} />
      </button>
      <nav className="admin-crumbs" aria-label="Breadcrumb">
        <a href="#dashboard">
          <LayoutDashboard size={14} aria-hidden="true" />
          <span>Console</span>
        </a>
        <ChevronRight size={14} aria-hidden="true" />
        <span aria-current="page">{section.label}</span>
      </nav>

      <div className="admin-topbar-actions" ref={actions}>
        <button
          type="button"
          className="admin-icon-button admin-theme-toggle"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
          onClick={onToggleTheme}
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="admin-menu-wrap">
          <button
            type="button"
            className="admin-icon-button"
            aria-label="Help"
            title="Help"
            aria-expanded={menu === "help"}
            aria-controls="admin-help"
            onClick={(event) => toggleMenu("help", event.currentTarget)}
          >
            <CircleHelp size={19} />
          </button>
          <div
            id="admin-help"
            className="admin-popover admin-help"
            role="dialog"
            aria-label="Help and support"
            hidden={menu !== "help"}
          >
            <p className="admin-popover-title">Help &amp; support</p>
            <ul className="admin-help-tips">
              {helpTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
            <div className="admin-help-contact">
              <p>Need a hand? Contact the head office.</p>
              <a href="mailto:info@sentinelafricaconsulting.com">
                <Mail size={15} aria-hidden="true" /> info@sentinelafricaconsulting.com
              </a>
              <a href="tel:+254202484888">
                <Phone size={15} aria-hidden="true" /> +254 20 2484888
              </a>
            </div>
          </div>
        </div>

        <span className="admin-topbar-divider" aria-hidden="true" />

        <div className="admin-menu-wrap">
          <button
            type="button"
            className="admin-profile-button"
            aria-label="Account menu"
            aria-expanded={menu === "profile"}
            aria-controls="admin-profile"
            onClick={(event) => toggleMenu("profile", event.currentTarget)}
          >
            <span className="admin-avatar" aria-hidden="true">
              AD
            </span>
            <span className="admin-profile-name">
              Administrator
              <small>Staff console</small>
            </span>
            <ChevronDown size={15} aria-hidden="true" className="admin-profile-chevron" />
          </button>
          <div
            id="admin-profile"
            className="admin-popover admin-profile-menu"
            hidden={menu !== "profile"}
          >
            <div className="admin-profile-card">
              <span className="admin-avatar is-large" aria-hidden="true">
                AD
              </span>
              <span>
                <strong>Administrator</strong>
                <span className="admin-muted">Sentinel Africa Consulting</span>
              </span>
            </div>
            <ul>
              <li>
                <a href="#profile" onClick={() => setMenu(null)}>
                  <UserRound size={16} aria-hidden="true" /> My profile
                </a>
              </li>
              <li>
                <a href="#settings" onClick={() => setMenu(null)}>
                  <Settings size={16} aria-hidden="true" /> Settings
                </a>
              </li>
              <li>
                <a href="/" target="_blank" rel="noreferrer">
                  <Globe size={16} aria-hidden="true" /> View website
                </a>
              </li>
            </ul>
            <a className="admin-sign-out" href={staffLoginPage}>
              <LogOut size={16} aria-hidden="true" /> Sign out
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
