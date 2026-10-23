import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, Globe, LogOut, X } from "lucide-react";
import shield from "@/assets/logos/sentinel-shield.png";
import { staffLoginPage } from "../site/navigation";
import { adminNavigation, allSections, type AdminSection } from "./adminSections";
import { AdminTopbar, type Theme } from "./AdminTopbar";
import { DashboardView } from "./DashboardView";
import { TravelAdvisoriesView } from "./TravelAdvisoriesView";
import { ContentEditor } from "./cms/ContentEditor";
import { editorFor } from "./cms/editors";
import { navigateAdmin, useAdminLocation } from "./adminLocation";
import { InboxView } from "./cms/InboxView";
import { inboxFor } from "./cms/inboxes";
import { MediaView } from "./cms/MediaView";
import { ContentMapView } from "./cms/ContentMapView";
import "./admin.css";
import "./cms/cms.css";

const desktopQuery = "(min-width: 1024px)";
const sidebarKey = "sentinel-admin-sidebar";
const themeKey = "sentinel-admin-theme";

// Browser storage can be unavailable (private windows, blocked site data); the console
// then simply starts with its defaults.
const readSetting = (key: string) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
const saveSetting = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Not saved; the choice still applies until the page is closed.
  }
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const list = window.matchMedia(query);
    const changed = () => setMatches(list.matches);
    list.addEventListener("change", changed);
    return () => list.removeEventListener("change", changed);
  }, [query]);
  return matches;
}

/** Shown for sections whose screens are still to be designed. */
function SectionPreview({ section }: { section: AdminSection }) {
  const Icon = section.icon;
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-overline">Staff console</p>
          <h1>{section.label}</h1>
          <p className="admin-lede">{section.summary}</p>
        </div>
      </div>
      <div className="admin-card admin-empty">
        <span className="admin-empty-icon">
          <Icon size={26} aria-hidden="true" />
        </span>
        <h2>This section is being designed</h2>
        <p>
          The {section.label.toLowerCase()} screens will appear here once their layout is agreed.
        </p>
        <a className="admin-button is-ghost" href="#dashboard">
          <ArrowLeft size={15} aria-hidden="true" /> Back to dashboard
        </a>
      </div>
    </>
  );
}

/** Picks the screen for a sidebar section. */
function SectionView({ section }: { section: AdminSection }) {
  if (section.id === "content-map") return <ContentMapView />;
  if (section.id === "dashboard") return <DashboardView />;
  if (section.id === "travel") return <TravelAdvisoriesView />;
  if (section.id === "media") return <MediaView />;
  const editor = editorFor(section.id);
  if (editor) return <ContentEditor key={editor.id} editor={editor} />;
  const inbox = inboxFor(section.id);
  if (inbox) return <InboxView key={inbox.id} inbox={inbox} />;
  return <SectionPreview section={section} />;
}

export default function AdminPage() {
  const location = useAdminLocation();
  const section = allSections.find((entry) => entry.id === location.section) ?? {
    id: "not-found",
    label: "Workspace not found",
    icon: Globe,
    summary: "Choose a workspace from the sidebar to continue.",
  };
  const [collapsed, setCollapsed] = useState(() => readSetting(sidebarKey) === "collapsed");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset["theme"] === "dark" ? "dark" : "light",
  );
  const desktop = useMediaQuery(desktopQuery);
  const sidebarToggle = useRef<HTMLButtonElement>(null);
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    setDrawerOpen(false);
    main.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [location.section]);

  useEffect(() => {
    document.title = `${section.label} — Sentinel Africa Staff Console`;
  }, [section.label]);

  useEffect(() => {
    document.documentElement.dataset["theme"] = theme;
  }, [theme]);

  // The drawer belongs to small screens only; leaving them closes it.
  useEffect(() => {
    if (desktop) setDrawerOpen(false);
  }, [desktop]);

  useEffect(() => {
    if (!drawerOpen) return;
    const keyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDrawerOpen(false);
      sidebarToggle.current?.focus();
    };
    document.addEventListener("keydown", keyDown);
    document.querySelector<HTMLElement>("#admin-sidebar a")?.focus();
    return () => document.removeEventListener("keydown", keyDown);
  }, [drawerOpen]);

  const toggleSidebar = useCallback(() => {
    if (!desktop) return setDrawerOpen((open) => !open);
    setCollapsed((current) => {
      saveSetting(sidebarKey, current ? "expanded" : "collapsed");
      return !current;
    });
  }, [desktop]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    saveSetting(themeKey, next);
    setTheme(next);
  };

  const isCollapsed = desktop && collapsed;

  return (
    <div
      className={`admin-app ${isCollapsed ? "is-collapsed" : ""} ${drawerOpen ? "drawer-open" : ""}`}
      onClick={(event) => {
        if (
          event.defaultPrevented ||
          event.ctrlKey ||
          event.metaKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        )
          return;
        const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
        const hash = link?.getAttribute("href");
        if (!hash || hash === "#admin-main") return;
        event.preventDefault();
        navigateAdmin(hash);
      }}
    >
      <a className="admin-skip" href="#admin-main">
        Skip to content
      </a>
      <aside
        id="admin-sidebar"
        className="admin-sidebar"
        aria-label="Console navigation"
        inert={!desktop && !drawerOpen}
      >
        <div className="admin-brand">
          <a href="#dashboard" aria-label="Staff console dashboard">
            <img src={shield} alt="" width="34" height="34" />
            <span className="admin-brand-text">
              Sentinel Africa
              <small>Staff console</small>
            </span>
          </a>
          <button
            type="button"
            className="admin-drawer-close"
            aria-label="Close navigation"
            onClick={() => {
              setDrawerOpen(false);
              sidebarToggle.current?.focus();
            }}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="admin-nav">
          {adminNavigation.map((group) => (
            <div className="admin-nav-group" key={group.heading}>
              <p className="admin-nav-heading">{group.heading}</p>
              <ul>
                {group.sections.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      data-tooltip={label}
                      aria-current={section.id === id ? "page" : undefined}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span className="admin-nav-label">{label}</span>
                    </a>
                    {!isCollapsed &&
                      section.id === id &&
                      (editorFor(id)?.pages.length ?? 0) > 1 && (
                        <ul className="admin-page-links" aria-label={`${label} pages`}>
                          {editorFor(id)!.pages.map((page) => (
                            <li key={page.id}>
                              <a
                                href={`#${id}/${page.id}`}
                                aria-current={location.page === page.id ? "page" : undefined}
                              >
                                {page.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <a href="/" data-tooltip="View website">
            <Globe size={18} aria-hidden="true" />
            <span className="admin-nav-label">View website</span>
          </a>
          <a className="admin-sidebar-sign-out" href={staffLoginPage} data-tooltip="Sign out">
            <LogOut size={18} aria-hidden="true" />
            <span className="admin-nav-label">Sign out</span>
          </a>
        </div>
      </aside>
      <button
        type="button"
        className="admin-scrim"
        aria-label="Close navigation"
        tabIndex={-1}
        hidden={!drawerOpen}
        onClick={() => setDrawerOpen(false)}
      />
      <div className="admin-body">
        <AdminTopbar
          section={section}
          desktop={desktop}
          collapsed={isCollapsed}
          drawerOpen={drawerOpen}
          toggleRef={sidebarToggle}
          onToggleSidebar={toggleSidebar}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <main id="admin-main" ref={main} tabIndex={-1} className="admin-main">
          <SectionView section={section} />
        </main>
      </div>
    </div>
  );
}
