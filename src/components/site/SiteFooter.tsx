import { ArrowUpRight, Globe2 } from "lucide-react";
import sentinelLogo from "@/assets/logos/SENTINEL-AFRICA-LOGO-2023.png";
import { careersPage, homeSection, travelAdvisoryPage, whoWeArePage } from "./navigation";
import { offices } from "@/content/offices";

/** `base` is "" on the homepage and "/" on other pages, so section links reach the homepage. */
export function SiteFooter({ base = "" }: { base?: string }) {
  const navigation = [
    { label: "Home", href: homeSection(base, "top") },
    { label: "Who we are", href: whoWeArePage },
    { label: "Services", href: homeSection(base, "services") },
    { label: "Clients", href: homeSection(base, "clients") },
    { label: "Testimonials", href: homeSection(base, "testimonials") },
    { label: "Travel Advisory", href: travelAdvisoryPage },
    { label: "Careers", href: careersPage },
    { label: "Contact us", href: homeSection(base, "contact") },
  ];
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <div>
            <a
              href={homeSection(base, "top")}
              aria-label="Sentinel Africa Consulting home"
              className="official-wordmark footer-wordmark"
            >
              <img src={sentinelLogo} alt="Sentinel Africa Consulting" width="361" height="79" />
            </a>
            <p>
              Helping organizations navigate uncertainty.
              <br />
              In Africa and beyond.
            </p>
          </div>
          <a className="footer-invitation" href={homeSection(base, "contact")}>
            Let’s build what’s next.
            <ArrowUpRight size={30} strokeWidth={1.2} />
          </a>
        </div>
        <div className="office-grid">
          {offices.map((office) => (
            <address key={office.name}>
              <p className="office-label">
                <Globe2 size={16} />
                {office.label}
              </p>
              <h3>{office.name}</h3>
              <p>{office.address}</p>
              <div>
                {office.phones.map((phone) => (
                  <a key={phone} href={`tel:${phone.replaceAll(" ", "")}`}>
                    {phone}
                  </a>
                ))}
              </div>
              <a href={`mailto:${office.email}`}>{office.email}</a>
            </address>
          ))}
        </div>
        <div className="footer-navigation">
          <nav aria-label="Footer navigation">
            {navigation.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a href="#top">
            Back to top <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Sentinel Africa Consulting Ltd. All rights reserved.</p>
          <span>Perspective. Partnership. Progress.</span>
        </div>
      </div>
    </footer>
  );
}
