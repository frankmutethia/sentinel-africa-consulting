import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronDown,
  LockKeyhole,
  Menu,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";
import sentinelLogo from "@/assets/logos/SENTINEL-AFRICA-LOGO-2023.png";
import {
  headerNavigation,
  homeSection,
  serviceNavigation,
  shopPage,
  staffLoginPage,
  type NavigationLink,
} from "./navigation";
import "./header.css";

/** `base` is "" on the homepage and "/" on other pages, so section links reach the homepage. */
/** A page that is not built yet: shown in place, never linked away from the site. */
function SoonItem({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span className={`nav-soon ${className}`} aria-disabled="true" title="Coming soon">
      {label}
      <small>Soon</small>
    </span>
  );
}

export function SiteHeader({ base = "" }: { base?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const activeTrigger = useRef<HTMLButtonElement | null>(null);
  const closeMenus = () => {
    setActive(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const pointerDown = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) {
        setActive(null);
        setMobileOpen(false);
      }
    };
    const keyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (active) {
        setActive(null);
        activeTrigger.current?.focus();
      } else if (mobileOpen) {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("pointerdown", pointerDown);
    document.addEventListener("keydown", keyDown);
    return () => {
      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("keydown", keyDown);
    };
  }, [active, mobileOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1121px)");
    const changed = () => {
      setActive(null);
      setMobileOpen(false);
    };
    desktop.addEventListener("change", changed);
    return () => desktop.removeEventListener("change", changed);
  }, []);

  // Highlights the menu and link for the page being viewed.
  const currentPath = window.location.pathname;
  const isCurrent = (href?: string) =>
    !!href && href.startsWith("/") && href.split(/[?#]/)[0] === currentPath && currentPath !== "/";

  const renderNavigation = (mode: "desktop" | "mobile") =>
    headerNavigation(base).map((item, index) => {
      if (!("children" in item))
        return item.href ? (
          <a
            className="nav-direct-link"
            key={item.label}
            href={item.href}
            onClick={closeMenus}
            aria-current={isCurrent(item.href) ? "page" : undefined}
          >
            {item.label}
            {item.badge && <small className="nav-badge">{item.badge}</small>}
          </a>
        ) : (
          <SoonItem key={item.label} label={item.label} className="nav-direct-link" />
        );
      const id = `${mode}-dropdown-${index}`;
      const expanded = active === id;
      const containsCurrent = item.children.some((link) => isCurrent(link.href));
      return (
        <div
          className={`nav-dropdown ${expanded ? "is-open" : ""} ${containsCurrent ? "is-current" : ""}`}
          key={item.label}
          onMouseLeave={(event) => {
            if (mode === "desktop" && !event.currentTarget.contains(document.activeElement))
              setActive((current) => (current === id ? null : current));
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node))
              setActive((current) => (current === id ? null : current));
          }}
        >
          <button
            type="button"
            className="nav-dropdown-trigger"
            id={`${id}-trigger`}
            aria-expanded={expanded}
            aria-controls={id}
            onClick={(event) => {
              activeTrigger.current = event.currentTarget;
              setActive(expanded ? null : id);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                activeTrigger.current = event.currentTarget;
                setActive(id);
                requestAnimationFrame(() =>
                  document.getElementById(id)?.querySelector("a")?.focus(),
                );
              }
            }}
          >
            {item.label}
            <ChevronDown size={13} aria-hidden="true" />
          </button>
          <div
            className="nav-dropdown-panel"
            id={id}
            aria-labelledby={`${id}-trigger`}
            hidden={!expanded}
          >
            {item.children.map((link: NavigationLink) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenus}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                >
                  {link.label}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              ) : (
                <SoonItem key={link.label} label={link.label} />
              ),
            )}
          </div>
        </div>
      );
    });

  return (
    <header ref={header} className={`site-header restored-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="header-utility">
        <div className="site-container utility-inner">
          <span className="utility-mobile-tagline">Risk management · Africa &amp; beyond</span>
          <nav aria-label="Specialist services" className="utility-services">
            {serviceNavigation(base).map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <nav className="utility-commerce" aria-label="Shop and account">
            <a href={shopPage}>Shop</a>
            <span aria-disabled="true" aria-label="Shopping cart (coming soon)" title="Coming soon">
              <ShoppingCart size={14} />
            </span>
            <span aria-disabled="true" aria-label="My account (coming soon)" title="Coming soon">
              <UserRound size={14} />
            </span>
            <a className="staff-login" href={staffLoginPage}>
              <LockKeyhole size={12} aria-hidden="true" />
              Staff Login
            </a>
          </nav>
        </div>
      </div>
      <div className="site-container nav-inner">
        <a
          href={homeSection(base, "top")}
          className="official-wordmark"
          aria-label="Sentinel Africa Consulting home"
          onClick={closeMenus}
        >
          <img src={sentinelLogo} alt="Sentinel Africa Consulting" width="361" height="79" />
        </a>
        <nav aria-label="Main navigation" className="desktop-nav">
          {renderNavigation("desktop")}
        </nav>
        <a className="button button-small nav-contact" href={homeSection(base, "contact")}>
          Let’s talk <ArrowUpRight size={16} />
        </a>
        <button
          ref={menuButton}
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setActive(null);
          }}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        className="mobile-nav"
        hidden={!mobileOpen}
      >
        {renderNavigation("mobile")}
        <a className="mobile-contact" href={homeSection(base, "contact")} onClick={closeMenus}>
          Contact us <ArrowUpRight size={16} />
        </a>
      </nav>
    </header>
  );
}
