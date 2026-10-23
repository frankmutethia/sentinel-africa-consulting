import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "@/App";
import BoardPage from "@/components/site/BoardPage";
import HowWeDoItPage from "@/components/site/HowWeDoItPage";
import TeamPage from "@/components/site/TeamPage";
import WhyWeDoItPage from "@/components/site/WhyWeDoItPage";
import WhoWeArePage from "@/components/site/WhoWeArePage";
import BlogPage from "@/components/site/BlogPage";
import SdgPage from "@/components/site/SdgPage";
import SoftwareProductsPage from "@/components/site/SoftwareProductsPage";
import ConsultancyPage from "@/components/site/ConsultancyPage";
import CybershieldPage from "@/components/site/CybershieldPage";
import ManagedServicesPage from "@/components/site/ManagedServicesPage";
import RwandaDppPage from "@/components/site/RwandaDppPage";
import TrainingPage from "@/components/site/TrainingPage";
import StaffLoginPage from "@/components/staff/StaffLoginPage";
import ForgotPasswordPage from "@/components/staff/ForgotPasswordPage";
import AdminPage from "@/components/admin/AdminPage";
import TravelAdvisoryPage from "@/components/travel/TravelAdvisoryPage";
import CareersPage from "@/components/site/CareersPage";
import ToolsPage from "@/components/site/ToolsPage";
import CertificationPlannerPage from "@/components/tools/CertificationPlannerPage";
import {
  buildQuestions,
  computeReport,
  durationQuestions,
} from "@/components/tools/certificationPlanner";
import TalentShieldPage from "@/components/site/TalentShieldPage";
import { buildReport, travelData, type Requirement } from "@/components/travel/travelAdvisory";
import { goTo } from "@/components/staff/session";
import { clearWhoCache } from "@/components/travel/whoOutbreakNews";

// The staff pages are a layout only: page changes and request delays are replaced here.
vi.mock("@/components/staff/session", () => ({
  goTo: vi.fn(),
  simulatedRequest: () => Promise.resolve(),
}));

describe("Sentinel website", () => {
  it("renders the homepage without a router and resolves every section link", () => {
    const { container } = render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Expertise across sectors.",
    );
    for (const link of container.querySelectorAll('a[href^="#"]')) {
      const id = link.getAttribute("href")!.slice(1);
      expect(document.getElementById(id)).not.toBeNull();
    }
    expect(screen.getAllByAltText("Sentinel Africa Consulting")).toHaveLength(2);
    for (const image of container.querySelectorAll("img")) {
      expect(image.getAttribute("src")).toBeTruthy();
      expect(image.getAttribute("src")).not.toMatch(/^https?:/);
    }
  });

  it("filters client logos by sector and restores the full gallery", () => {
    render(<App />);
    const gallery = screen.getByRole("list", { name: "Client logos" });
    const initialCount = within(gallery).getAllByRole("listitem").length;
    fireEvent.click(screen.getByRole("button", { name: "Finance" }));
    expect(within(gallery).getByAltText("CRDB Bank")).toBeInTheDocument();
    expect(within(gallery).queryByAltText("KEMRI")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Finance" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "All clients" }));
    expect(within(gallery).getAllByRole("listitem")).toHaveLength(initialCount);
    expect(within(gallery).getByAltText("KEMRI")).toBeInTheDocument();
  });

  it("opens the mobile navigation and closes it after choosing a section", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "Toggle menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    fireEvent.click(within(mobileNav).getByRole("button", { name: "About Us" }));
    const whoWeAre = within(mobileNav).getByRole("link", { name: "Who We Are" });
    expect(whoWeAre).toHaveAttribute("href", "/who-we-are/");
    fireEvent.click(whoWeAre);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps every link inside this project, apart from social profiles, the DPP questionnaire and our software products", () => {
    for (const page of [
      <App key="home" />,
      <WhoWeArePage key="who" />,
      <HowWeDoItPage key="how" />,
      <WhyWeDoItPage key="why" />,
      <BoardPage key="board" />,
      <TeamPage key="team" />,
      <ConsultancyPage key="consultancy" />,
      <ManagedServicesPage key="managed" />,
      <TrainingPage key="training" />,
      <CybershieldPage key="cybershield" />,
      <SoftwareProductsPage key="software" />,
      <RwandaDppPage key="dpp" />,
      <BlogPage key="blog" />,
      <SdgPage key="sdg" />,
      <CareersPage key="careers" />,
      <ToolsPage key="tools" />,
      <CertificationPlannerPage key="planner" />,
      <TalentShieldPage key="talent" />,
      <StaffLoginPage key="login" />,
      <ForgotPasswordPage key="forgot" />,
      <AdminPage key="admin" />,
    ]) {
      const { container, unmount } = render(page);
      for (const link of container.querySelectorAll("a[href]"))
        expect(link.getAttribute("href")).toMatch(
          /^(#|\/|mailto:|tel:|https:\/\/(www\.linkedin\.com|twitter\.com|forms\.zohopublic\.com\/SentinelAfrica|wa\.me|strataone\.tech|isms\.rodelatech\.com|gap-assessment\.rodelatech\.com)\/)/,
        );
      unmount();
    }
    // Rendering every page in turn needs longer than the default 5 seconds.
  }, 15_000);

  it("opens the header dropdowns, links within the site, and dismisses with Escape", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    const trigger = within(nav).getByRole("button", { name: "Our Services" });
    expect(within(nav).queryByRole("link", { name: "Cybershield" })).not.toBeInTheDocument();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(nav).getByRole("link", { name: "Cybershield" })).toHaveAttribute(
      "href",
      "/cybershield/",
    );
    expect(within(nav).queryByRole("link", { name: "Rwanda DPP Registration" })).toBeNull();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
    expect(within(nav).queryByRole("link", { name: /Upcoming/ })).not.toBeInTheDocument();
    expect(within(nav).getByText("Upcoming")).toHaveAttribute("aria-disabled", "true");
  });

  it("shows only one desktop dropdown and closes it on an outside click", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    fireEvent.click(within(nav).getByRole("button", { name: "About Us" }));
    fireEvent.click(within(nav).getByRole("button", { name: "Careers" }));
    expect(within(nav).getByRole("button", { name: "About Us" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(within(nav).getByRole("link", { name: "SAC Talent Shield" })).toHaveAttribute(
      "href",
      "/talent-shield/",
    );
    fireEvent.pointerDown(document.body);
    expect(within(nav).getByRole("button", { name: "Careers" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("uses the requested section order and allows the alliance animation to pause", () => {
    const { container } = render(<App />);
    expect([...container.querySelectorAll("main > section")].map((section) => section.id)).toEqual([
      "top",
      "alliances",
      "about",
      "services",
      "contact",
      "clients",
      "testimonials",
    ]);
    fireEvent.click(screen.getByRole("button", { name: "Pause alliance animation" }));
    expect(screen.getByRole("button", { name: "Play alliance animation" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(container.querySelector(".alliance-track")).toHaveAttribute("data-paused", "true");
  });

  it("carries training and service choices into the callback form", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", { name: "Start training" }));
    expect(screen.getByRole("combobox")).toHaveValue("Training");
    fireEvent.click(screen.getByRole("link", { name: "Discuss Data Protection & Privacy" }));
    expect(screen.getByRole("combobox")).toHaveValue("Data Protection & Privacy");
  });
});

describe("Who We Are page", () => {
  it("links to the local page from the About Us menu", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    fireEvent.click(within(nav).getByRole("button", { name: "About Us" }));
    expect(within(nav).getByRole("link", { name: "Who We Are" })).toHaveAttribute(
      "href",
      "/who-we-are/",
    );
  });

  it("renders the published copy, video and core values, with links back to the homepage", () => {
    const { container } = render(<WhoWeArePage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Who We Are");
    for (const heading of ["Our Approach to Risk Management", "Our Compass"])
      expect(screen.getByRole("heading", { level: 2, name: heading })).toBeInTheDocument();
    for (const value of ["Integrity & Ethics", "Working in the Trenches"])
      expect(screen.getByText(value)).toBeInTheDocument();
    for (const image of container.querySelectorAll("img"))
      expect(image.getAttribute("src")).not.toMatch(/^https?:/);
    expect(screen.getByText(/premier Risk Management Consultancy firm/)).toBeInTheDocument();
    expect(screen.getByAltText(/Our core values/)).toBeInTheDocument();
    const video = container.querySelector("video source");
    expect(video?.getAttribute("src")).not.toMatch(/^https?:/);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/#top");
    expect(screen.getByRole("link", { name: /Let’s talk/ })).toHaveAttribute("href", "/#contact");
    for (const link of container.querySelectorAll('a[href^="#"]')) {
      const id = link.getAttribute("href")!.slice(1);
      expect(document.getElementById(id)).not.toBeNull();
    }
  });
});

describe("How We Do It page", () => {
  it("is linked from the About Us menu", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    fireEvent.click(within(nav).getByRole("button", { name: "About Us" }));
    expect(within(nav).getByRole("link", { name: "How We Do It" })).toHaveAttribute(
      "href",
      "/how-we-do-it/",
    );
  });

  it("renders the diagram, the three steps and the published copy", () => {
    const { container } = render(<HowWeDoItPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("How We Do It");
    expect(screen.getByRole("img", { name: /How we do it/ })).toBeInTheDocument();
    for (const step of ["Understand", "Tailor", "Embed"])
      expect(screen.getByRole("heading", { level: 3, name: step })).toBeInTheDocument();
    expect(screen.getByText(/excel in delivering customized solutions/)).toBeInTheDocument();
    expect(screen.getByText(/safeguard data privacy & protection/)).toBeInTheDocument();
    for (const link of container.querySelectorAll('a[href^="#"]')) {
      const id = link.getAttribute("href")!.slice(1);
      expect(document.getElementById(id)).not.toBeNull();
    }
  });
});

describe("Why We Do It and Our Board pages", () => {
  it("are linked from the About Us menu", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    fireEvent.click(within(nav).getByRole("button", { name: "About Us" }));
    expect(within(nav).getByRole("link", { name: "Why We Do It" })).toHaveAttribute(
      "href",
      "/why-we-do-it/",
    );
    expect(within(nav).getByRole("link", { name: "Our Board" })).toHaveAttribute("href", "/board/");
  });

  it("renders the story, mission, vision and team photo", () => {
    const { container } = render(<WhyWeDoItPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Why We Do It");
    expect(screen.getByText(/born out of a fervent desire/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "To be the Advisor of Choice" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/To make our clients win!/)).toBeInTheDocument();
    expect(screen.getByAltText("The Sentinel Africa Consulting team")).toBeInTheDocument();
    for (const image of container.querySelectorAll("img"))
      expect(image.getAttribute("src")).not.toMatch(/^https?:/);
  });

  it("lists all six directors with their titles, chair first", () => {
    const { container } = render(<BoardPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Our Board");
    const names = [...container.querySelectorAll(".board-info h3")].map((h) => h.textContent);
    expect(names).toEqual([
      "Musa Wesutsa",
      "Catherine Nyagah",
      "Muthoni Ranji-Pertet",
      "Benson Maina",
      "Faith Mulwa",
      "Stella Simiyu",
    ]);
    expect(screen.getByText("Non-Executive Director and Company Secretary")).toBeInTheDocument();
    for (const image of container.querySelectorAll("img"))
      expect(image.getAttribute("src")).not.toMatch(/^https?:/);
  });
});

describe("Our Team page", () => {
  it("is linked from the About Us menu", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    fireEvent.click(within(nav).getByRole("button", { name: "About Us" }));
    expect(within(nav).getByRole("link", { name: "Our Team" })).toHaveAttribute("href", "/team/");
  });

  it("shows the four members in published order with profiles and contact links", () => {
    const { container } = render(<TeamPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Our Team");
    const cards = [...container.querySelectorAll(".team-info")].map((info) => [
      info.querySelector("h3")?.textContent,
      info.querySelector("p")?.textContent,
    ]);
    expect(cards).toEqual([
      ["Faith Mueni", "Head of Operations"],
      ["Faith Mulwa", "Deputy CEO"],
      ["Stella Simiyu", "Head of Managed Services"],
      ["Musa Wesutsa", "CEO"],
    ]);
    for (const id of ["faith-mueni", "faith-mulwa", "stella-simiyu", "musa-wesutsa"])
      expect(document.getElementById(id)).not.toBeNull();
    expect(screen.getByText(/Chairlady of the Business Continuity Institute/)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Email Faith Mueni" })[0]).toHaveAttribute(
      "href",
      "mailto:faith.mueni@sentinelafrica.co.ke",
    );
    for (const link of container.querySelectorAll('a[target="_blank"]'))
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    for (const image of container.querySelectorAll("img"))
      expect(image.getAttribute("src")).not.toMatch(/^https?:/);
  });
});

describe("Our Services pages", () => {
  it("lists the five services under the renamed menu", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).queryByRole("button", { name: "What we do" })).not.toBeInTheDocument();
    fireEvent.click(within(nav).getByRole("button", { name: "Our Services" }));
    const links = within(nav)
      .getAllByRole("link")
      .filter((link) => link.closest(".nav-dropdown.is-open"));
    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Consultancy", "/consultancy/"],
      ["Managed Services", "/managed-services/"],
      ["Training", "/training/"],
      ["Cybershield", "/cybershield/"],
      ["Our Software Products", "/software-products/"],
    ]);
  });

  it.each([
    [ConsultancyPage, "Consultancy", /obsessively going about making our clients and partners win/],
    [ManagedServicesPage, "Managed Services", /80% of SMEs lack sufficient capacity/],
    [TrainingPage, "Training", /affiliated training center with renowned certification bodies/],
    [CybershieldPage, "Cybershield", /24\/7” monitoring, detection, analysis/],
    [SoftwareProductsPage, "Our Software Products", /first ISO 27001 gap assessment/],
    [RwandaDppPage, "Rwanda DPP Registration", /Article 29 of Rwanda’s Personal Data Protection/],
  ])("renders the %#th service page with its published copy", (Page, title, copy) => {
    const { container } = render(<Page />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(title);
    expect(screen.getAllByText(copy).length).toBeGreaterThan(0);
    for (const image of container.querySelectorAll("img"))
      expect(image.getAttribute("src")).not.toMatch(/^https?:/);
    for (const link of container.querySelectorAll('a[href^="#"]'))
      expect(document.getElementById(link.getAttribute("href")!.slice(1))).not.toBeNull();
  });

  it("sends each page's callback request to the homepage form with the service chosen", () => {
    render(<TrainingPage />);
    const callback = screen.getByRole("link", { name: /Request a free callback/ });
    expect(callback).toHaveAttribute("href", "/?interest=Training#contact");
  });

  it("shows the vulnerability assessment comparison as a readable table", () => {
    render(<CybershieldPage />);
    const table = screen.getByRole("table");
    expect(
      within(table).getByRole("columnheader", { name: "Penetration Testing" }),
    ).toBeInTheDocument();
    expect(within(table).getByRole("rowheader", { name: /Business Value/ })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: "Social Engineering" }),
    ).toBeInTheDocument();
  });

  it("offers the 2026 training calendar as a local download", () => {
    render(<TrainingPage />);
    const download = screen.getAllByRole("link", { name: /2026 Training Calendar/ })[0]!;
    expect(download.getAttribute("href")).not.toMatch(/^https?:/);
    expect(download).toHaveAttribute("download");
  });
});

describe("WhatsApp customer support", () => {
  it("opens the support card, composes a message and hands it to WhatsApp", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<App />);
    const toggle = screen.getByRole("button", { name: "WhatsApp" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(toggle);
    const panel = screen.getByRole("dialog", { name: "WhatsApp customer support" });
    expect(within(panel).getByText(/Thank you for contacting Sentinel Africa/)).toBeInTheDocument();
    expect(within(panel).getByText("Customer Support")).toBeInTheDocument();
    expect(within(panel).getByRole("link", { name: /Sentinel Africa Consulting/ })).toHaveAttribute(
      "href",
      expect.stringMatching(/^https:\/\/wa\.me\/254715484888\?text=/),
    );

    fireEvent.click(within(panel).getByRole("button", { name: /Customer Support/ }));
    fireEvent.change(within(panel).getByLabelText("Your message"), {
      target: { value: "I need ISO 27001 training" },
    });
    fireEvent.click(within(panel).getByRole("button", { name: "Send on WhatsApp" }));
    expect(open).toHaveBeenCalledWith(
      "https://wa.me/254715484888?text=I%20need%20ISO%2027001%20training",
      "_blank",
      "noopener,noreferrer",
    );
    open.mockRestore();
  });

  it("closes with Escape and returns focus to the button", () => {
    render(<App />);
    const toggle = screen.getByRole("button", { name: "WhatsApp" });
    fireEvent.click(toggle);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });
});

describe("Training and Managed Services pages", () => {
  it("switches course areas with tabs and the arrow keys", () => {
    render(<TrainingPage />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(4);
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("ISO/IEC 27001 Lead Implementer");

    fireEvent.click(tabs[3]!);
    expect(tabs[3]).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("CDPO");

    fireEvent.keyDown(tabs[3]!, { key: "ArrowRight" });
    expect(tabs[0]).toHaveAttribute("aria-selected", "true");
    expect(tabs[0]).toHaveFocus();
  });

  it("loads YouTube only after the visitor presses play", () => {
    const { container } = render(<TrainingPage />);
    expect(container.querySelector("iframe")).toBeNull();
    fireEvent.click(
      screen.getByRole("button", { name: /Play video: Learn the Data protection act/ }),
    );
    expect(container.querySelector("iframe")?.getAttribute("src")).toMatch(
      /^https:\/\/www\.youtube-nocookie\.com\/embed\/GgjLCbkVYB4/,
    );
  });

  it("features Cyber Shield and links it to the Cybershield page", () => {
    render(<ManagedServicesPage />);
    expect(screen.getByRole("heading", { level: 3, name: "Cyber Shield" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Explore Cybershield/ })).toHaveAttribute(
      "href",
      "/cybershield/",
    );
    for (const benefit of ["Expertise", "Stability", "Visibility", "Cost Control"])
      expect(screen.getByRole("heading", { level: 3, name: benefit })).toBeInTheDocument();
  });
});

describe("Cybershield and Rwanda DPP pages", () => {
  it("shows the SOC cycle and all six assessment types", () => {
    render(<CybershieldPage />);
    const cycle = screen.getByRole("list", { name: "How the SOC works around the clock" });
    expect(
      within(cycle)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["01Monitoring", "02Detection", "03Analysis", "04Response"]);
    for (const name of ["External Assessment", "Application & Database"])
      expect(screen.getByRole("heading", { level: 3, name })).toBeInTheDocument();
  });

  it("plays the banner video from local files and marks templated documents", () => {
    const { container } = render(<RwandaDppPage />);
    const video = container.querySelector("video")!;
    expect(video.getAttribute("src")).not.toMatch(/^https?:/);
    expect(video).toHaveAttribute("poster");
    expect(screen.getAllByText("We will provide a template")).toHaveLength(2);
    expect(
      screen.getByText(
        /Operating without a registration certificate is an administrative misconduct/,
      ),
    ).toBeInTheDocument();
  });
});

describe("Resources pages", () => {
  it("links Blog and Our SDG’s Commitment from the Resources menu, with no shop anywhere", () => {
    const { container } = render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    fireEvent.click(within(nav).getByRole("button", { name: "Resources" }));
    const resources = within(nav)
      .getAllByRole("link")
      .filter((link) => link.closest(".nav-dropdown.is-open"))
      .map((link) => link.textContent);
    expect(resources).toEqual(["Blog", "Our SDG’s Commitment"]);
    const topBar = screen.getByRole("navigation", { name: "Staff access" });
    expect(
      within(topBar)
        .getAllByRole("link")
        .map((link) => link.textContent),
    ).toEqual(["Staff Login"]);
    expect(container.querySelector('a[href^="/shop"]')).toBeNull();
    expect(screen.queryByLabelText(/Shopping cart/)).toBeNull();
  });

  it("shows the Rwanda office at YYUSSA City Center", () => {
    render(<App />);
    expect(
      screen.getByText(
        "YYUSSA City Center, Tower A, 9th Floor, KN 4 Avenue, Kiyovu, Nyarugenge, Kigali, Rwanda",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(/KG688/)).toBeNull();
  });

  it("shows the three goals with the published gender split and commitments", () => {
    render(<SdgPage />);
    for (const goal of ["Sentinel Talent Shield", "Gender Equality", "Reduced Inequalities"])
      expect(screen.getByRole("heading", { level: 2, name: goal })).toBeInTheDocument();
    expect(screen.getByText("67% women, 33% men")).toBeInTheDocument();
    expect(screen.getByText(/Maternity Leave Days – 90 days/)).toBeInTheDocument();
  });

  it("lists 30 articles and filters them by search", () => {
    render(<BlogPage />);
    expect(screen.getByText("30 articles")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Search articles"), { target: { value: "phishing" } });
    expect(screen.getByText(/articles? matching “phishing”/)).toBeInTheDocument();
    for (const link of screen.getAllByRole("link", { name: /phishing/i }))
      expect(link.getAttribute("href")).toMatch(/^\/blog\/\?post=/);
  });

  it("opens an article from this site with local images and no links to the old site", async () => {
    window.history.pushState({}, "", "/blog/?post=bank-phishing-scams");
    try {
      const { container } = render(<BlogPage />);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Looks Like Your Bank/);
      await screen.findByText(/Back to all articles/);
      await waitFor(() => expect(container.querySelector(".blog-prose")).not.toBeNull());
      for (const image of container.querySelectorAll("img"))
        expect(image.getAttribute("src")).not.toMatch(/^https?:/);
      for (const link of container.querySelectorAll("a[href]")) {
        expect(link.getAttribute("href")).not.toMatch(/^https?:\/\/(www\.)?sentinelafrica/);
        if (link.getAttribute("href")!.startsWith("http"))
          expect(link).toHaveAttribute("rel", "noopener noreferrer");
      }
    } finally {
      window.history.pushState({}, "", "/");
    }
  });
});

describe("Navigation aids", () => {
  it("marks the current page and its menu in the header", () => {
    window.history.pushState({}, "", "/training/");
    try {
      render(<TrainingPage />);
      const nav = screen.getByRole("navigation", { name: "Main navigation" });
      const trigger = within(nav).getByRole("button", { name: "Our Services" });
      expect(trigger.parentElement).toHaveClass("is-current");
      fireEvent.click(trigger);
      expect(within(nav).getByRole("link", { name: "Training" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(within(nav).getByRole("link", { name: "Cybershield" })).not.toHaveAttribute(
        "aria-current",
      );
    } finally {
      window.history.pushState({}, "", "/");
    }
  });

  it("ends each service page with links to the other four services", () => {
    render(<CybershieldPage />);
    const strip = screen.getByRole("region", { name: "Explore our other services" });
    const links = within(strip).getAllByRole("link");
    expect(links).toHaveLength(4);
    expect(links.map((link) => link.textContent)).not.toContain("Cybershield");
  });
});

describe("Staff area", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset["theme"];
    window.history.pushState({}, "", "/");
  });

  it("links Staff Login in the header to the sign-in page", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: "Staff Login" })).toHaveAttribute(
      "href",
      "/staff-login/",
    );
  });

  it("validates the sign-in form, then opens the admin console", async () => {
    const { container } = render(<StaffLoginPage />);
    expect(container.querySelector(".auth-visual-photo")?.getAttribute("src")).toMatch(
      /amani-nation/,
    );
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("Enter your work email address.")).toBeInTheDocument();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
    expect(screen.getByLabelText("Work email")).toHaveFocus();

    fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "not-an-email" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(goTo).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Work email"), {
      target: { value: "staff@sentinelafricaconsulting.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    await waitFor(() => expect(goTo).toHaveBeenCalledWith("/admin/"));
    expect(screen.getByRole("link", { name: "Forgot password?" })).toHaveAttribute(
      "href",
      "/forgot-password/",
    );
  });

  it("confirms a password reset request", async () => {
    render(<ForgotPasswordPage />);
    fireEvent.change(screen.getByLabelText("Work email"), {
      target: { value: "staff@sentinelafricaconsulting.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send reset link" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "staff@sentinelafricaconsulting.com",
    );
    expect(screen.getByRole("link", { name: "Back to sign in" })).toHaveAttribute(
      "href",
      "/staff-login/",
    );
  });

  it("opens the console sections, the navigation drawer and the header menus", () => {
    render(<AdminPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Administrator");

    const toggle = screen.getByRole("button", { name: "Open navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    window.location.hash = "#enquiries";
    fireEvent(window, new HashChangeEvent("hashchange"));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Enquiries");
    expect(screen.getByRole("link", { name: "Enquiries" })).toHaveAttribute("aria-current", "page");

    fireEvent.click(screen.getByRole("button", { name: "Help" }));
    expect(screen.getByRole("dialog", { name: "Help and support" })).toBeVisible();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Help and support" })).toBeNull();
    expect(screen.getByRole("button", { name: "Help" })).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Account menu" }));
    // Sign out is offered both in the account menu and at the foot of the sidebar.
    const signOutLinks = screen.getAllByRole("link", { name: "Sign out" });
    expect(signOutLinks).toHaveLength(2);
    for (const link of signOutLinks) expect(link).toHaveAttribute("href", "/staff-login/");
    expect(
      within(screen.getByRole("complementary", { name: "Console navigation" })).getByRole("link", {
        name: "Sign out",
      }),
    ).toBeInTheDocument();
  });

  it("switches between light and dark mode and remembers the choice", () => {
    render(<AdminPage />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark mode" }));
    expect(document.documentElement.dataset["theme"]).toBe("dark");
    expect(localStorage.getItem("sentinel-admin-theme")).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Switch to light mode" }));
    expect(document.documentElement.dataset["theme"]).toBe("light");
  });

  it("collapses the sidebar to icons on wide screens and remembers it", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({ ...original(query), matches: true })) as never;
    try {
      const { container } = render(<AdminPage />);
      fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }));
      expect(container.querySelector(".admin-app")).toHaveClass("is-collapsed");
      expect(screen.getByRole("button", { name: "Expand sidebar" })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
      expect(localStorage.getItem("sentinel-admin-sidebar")).toBe("collapsed");
    } finally {
      window.matchMedia = original;
    }
  });
});

describe("Travel Advisory", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  const requirement = (overrides: Partial<Requirement>): Requirement => ({
    id: "r",
    country: "Kenya",
    direction: "entry",
    category: "restriction",
    title: "Sample requirement",
    detail: "Sample detail for a test record.",
    sourceName: "Official source",
    sourceUrl: "https://example.org/",
    publishedDate: "2026-10-01",
    reviewedAt: "2026-10-02",
    ...overrides,
  });

  it("is listed under the Tools menu with its New badge", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    fireEvent.click(within(nav).getByRole("button", { name: "Tools" }));
    const link = within(nav).getByRole("link", { name: /^Travel Advisory/ });
    expect(link).toHaveAttribute("href", "/travel-advisory/");
    expect(link).toHaveTextContent("New");
  });

  it("marks Tools as the current menu on the Travel Advisory page", () => {
    window.history.pushState({}, "", "/travel-advisory/");
    render(<TravelAdvisoryPage />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    const tools = within(nav).getByRole("button", { name: "Tools" });
    expect(tools.parentElement).toHaveClass("is-current");
    fireEvent.click(tools);
    expect(within(nav).getByRole("link", { name: /^Travel Advisory/ })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("validates the journey, then marks every check without a reviewed record as not verified", () => {
    render(<TravelAdvisoryPage />);
    const submit = screen.getByRole("button", { name: "Check journey requirements" });
    fireEvent.click(submit);
    expect(screen.getByText("Choose where you are travelling from.")).toBeInTheDocument();
    expect(screen.getByLabelText("Travelling from")).toHaveFocus();

    fireEvent.change(screen.getByLabelText("Travelling from"), { target: { value: "Rwanda" } });
    fireEvent.change(screen.getByLabelText("Travelling to"), { target: { value: "Rwanda" } });
    fireEvent.click(submit);
    expect(
      screen.getByText("Choose a destination different from your departure country."),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Travelling to"), {
      target: { value: "Democratic Republic of the Congo" },
    });
    fireEvent.change(screen.getByLabelText(/Transit or recent presence/), {
      target: { value: "Uganda" },
    });
    fireEvent.change(screen.getByLabelText(/Airline/), { target: { value: "RwandAir" } });
    const area = screen.getByLabelText(/Destination city or region/);
    // Browsers must not autofill an email address into this field, as they did in the portal.
    expect(area).toHaveAttribute("autocomplete", "off");
    fireEvent.change(area, { target: { value: "Goma, North Kivu" } });
    fireEvent.click(submit);

    const results = screen.getByRole("region", { name: /Rwanda → Uganda → Democratic Republic/ });
    expect(within(results).getByText("Goma, North Kivu")).toBeInTheDocument();
    expect(within(results).getByRole("status")).toHaveTextContent("0 of 8");
    expect(within(results).getByRole("status")).toHaveTextContent("Not a travel clearance");
    expect(within(results).getAllByText("Not verified")).toHaveLength(8);
    expect(within(results).queryByText("Verified")).toBeNull();
    expect(
      within(results).getByRole("link", { name: /RwandAir official website/ }),
    ).toHaveAttribute("href", "https://www.rwandair.com/travel-requirements-page/");
    expect(window.location.search).toContain("from=Rwanda");
    expect(window.location.search).not.toContain("nationality");
    expect(window.location.search).not.toContain("Goma");
  });

  it("gives editors a review workspace in the staff console", async () => {
    window.history.pushState({}, "", "/admin/#travel");
    render(<AdminPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Travel advisories");
    const queue = screen.getByRole("tab", { name: "Review queue" });
    expect(queue).toHaveAttribute("aria-selected", "true");
    // Tests are offline, so the live WHO queue explains that it could not be reached.
    expect(await screen.findByText("WHO’s reports couldn’t be loaded")).toBeInTheDocument();

    fireEvent.keyDown(queue, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Published records" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("No travel requirements published")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Prepare a record" }));
    const prepare = screen.getByRole("button", { name: "Check and prepare" });
    fireEvent.click(prepare);
    expect(screen.getByText("Choose the country this record applies to.")).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toHaveFocus();

    fireEvent.change(screen.getByLabelText("Country"), { target: { value: "Rwanda" } });
    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: "Arrival health screening" },
    });
    fireEvent.change(screen.getByLabelText("Requirement detail"), {
      target: { value: "Arriving travellers complete a health screening at the airport." },
    });
    fireEvent.change(screen.getByLabelText("Source name"), {
      target: { value: "Rwanda Biomedical Centre" },
    });
    fireEvent.change(screen.getByLabelText("Source link"), {
      target: { value: "http://rbc.gov.rw/" },
    });
    fireEvent.click(prepare);
    expect(
      screen.getByText("Link the official source with an https:// address."),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Source link"), {
      target: { value: "https://rbc.gov.rw/info-note-for-travelers" },
    });
    fireEvent.click(prepare);
    expect(screen.getByRole("status")).toHaveTextContent("Passed every check");
    const record = JSON.parse(screen.getByText(/"direction": "entry"/).textContent ?? "{}");
    expect(record).toMatchObject({
      country: "Rwanda",
      direction: "entry",
      category: "restriction",
      sourceUrl: "https://rbc.gov.rw/info-note-for-travelers",
    });
    expect(record.airline).toBeUndefined();
  });

  it("opens the results for a shared journey link", () => {
    window.history.pushState({}, "", "/travel-advisory/?from=Kenya&to=Uganda&date=2026-11-02");
    render(<TravelAdvisoryPage />);
    expect(screen.getByRole("heading", { name: "Kenya → Uganda" })).toBeInTheDocument();
    expect(screen.getByLabelText("Travelling from")).toHaveValue("Kenya");
  });

  it("matches requirements by country, direction, airline and date", () => {
    const data = {
      ...travelData,
      requirements: [
        requirement({ id: "entry-kenya" }),
        requirement({ id: "exit-kenya", direction: "exit" }),
        requirement({ id: "entry-uganda", country: "Uganda" }),
        requirement({ id: "expired", country: "Uganda", effectiveUntil: "2026-01-31" }),
        requirement({
          id: "kq-only",
          country: "Uganda",
          category: "airline",
          airline: "Kenya Airways",
        }),
      ],
    };
    const journey = { from: "Kenya", to: "Uganda", via: "", date: "2026-11-02", flight: "" };
    const ids = (report: ReturnType<typeof buildReport>) =>
      report.stops.map((stop) =>
        stop.checks.flatMap((check) => check.records.map((record) => record.id)),
      );

    const withoutAirline = buildReport({ ...journey, airline: "" }, data);
    // Leaving Kenya only shows its exit rule; arriving in Uganda only its live entry rule.
    expect(ids(withoutAirline)).toEqual([["exit-kenya"], ["entry-uganda"]]);
    expect(withoutAirline.airline).toBeNull();
    expect(withoutAirline.verified).toBe(2);

    const withAirline = buildReport({ ...journey, airline: "Kenya Airways" }, data);
    expect(withAirline.airline?.records.map((record) => record.id)).toEqual(["kq-only"]);
    expect(buildReport({ ...journey, airline: "RwandAir" }, data).airline?.records).toEqual([]);
  });

  it("sends organisations to the callback form and opens official sources safely", () => {
    const { container } = render(<TravelAdvisoryPage />);
    expect(screen.getByRole("link", { name: /Talk to our team/ })).toHaveAttribute(
      "href",
      "/?interest=Travel%20Risk%20Intelligence#contact",
    );
    const external = [...container.querySelectorAll("a[href^=http]")];
    const hrefs = external.map((link) => link.getAttribute("href"));
    for (const source of travelData.sources) expect(hrefs).toContain(source.url);
    for (const link of external) {
      expect(link.getAttribute("href")).toMatch(/^https:\/\//);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
  });

  it("pre-selects Travel Risk Intelligence in the homepage callback form", () => {
    window.history.pushState({}, "", "/?interest=Travel%20Risk%20Intelligence");
    render(<App />);
    expect(screen.getByLabelText("I’m interested in")).toHaveValue("Travel Risk Intelligence");
  });
});

describe("WHO Disease Outbreak News", () => {
  const offline = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = offline;
    clearWhoCache();
    window.history.pushState({}, "", "/");
  });

  // Shaped like WHO's answers; the last report is malformed and must be left out.
  const countryIds = {
    "11111111-1111-1111-1111-111111111111": "Democratic Republic of the Congo",
    "22222222-2222-2222-2222-222222222222": "Uganda",
    "33333333-3333-3333-3333-333333333333": "France",
  };
  const [drc, uganda, france] = Object.keys(countryIds);
  const reports = [
    {
      DonId: "2026-DON621",
      Title: "Ebola disease caused by Bundibugyo virus - Democratic Republic of the Congo",
      OverrideTitle: "",
      UseOverrideTitle: false,
      PublicationDate: "2026-09-25T15:30:18Z",
      LastModified: "2026-10-22T08:00:35Z",
      UrlName: "2026-DON621",
      regionscountries: [drc],
    },
    {
      DonId: "2026-DON613",
      Title: "Ebola disease caused by Bundibugyo virus - multi-country",
      OverrideTitle: "",
      UseOverrideTitle: false,
      PublicationDate: "2026-07-17T10:00:00Z",
      LastModified: "2026-07-17T12:00:00Z",
      UrlName: "2026-DON613",
      regionscountries: [drc, uganda, france],
    },
    { DonId: "2026-BAD", Title: "Broken report", PublicationDate: "not a date", UrlName: "../x" },
  ];

  const stubWho = () => {
    const calls: string[] = [];
    globalThis.fetch = (async (input: RequestInfo | URL) => {
      const url = String(input);
      // Query strings carry spaces as "+", which WHO reads as spaces.
      calls.push(decodeURIComponent(url.replaceAll("+", " ")));
      const id = /hierarchy-taxa\(([^)]+)\)/.exec(url)?.[1] ?? "";
      const body = url.includes("diseaseoutbreaknews")
        ? { value: reports }
        : { Title: countryIds[id as keyof typeof countryIds] };
      return { ok: true, status: 200, json: async () => body } as Response;
    }) as typeof fetch;
    return calls;
  };

  it("lists WHO's Ebola reports on the travel page, labelled as not reviewed", async () => {
    const calls = stubWho();
    render(<TravelAdvisoryPage />);
    const section = screen.getByRole("region", { name: "Latest WHO outbreak reports" });
    expect(await within(section).findByText("2026-DON613")).toBeInTheDocument();
    expect(calls[0]).toContain("contains(Title,'Ebola')");
    expect(calls[0]).toContain("$orderby=PublicationDate desc");

    expect(within(section).getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(within(section).queryByText("Broken report")).toBeNull();
    expect(within(section).getAllByText(/Updated by WHO/)).toHaveLength(1);
    expect(within(section).getByText("France")).toBeInTheDocument();
    expect(within(section).getByText(/not yet reviewed by Sentinel Africa/)).toBeInTheDocument();
    for (const link of within(section).getAllByRole("link", { name: /Read on who.int/ })) {
      expect(link.getAttribute("href")).toMatch(
        /^https:\/\/www\.who\.int\/emergencies\/disease-outbreak-news\/item\/2026-DON6\d\d$/,
      );
      expect(link).toHaveAttribute("rel", "noreferrer");
    }
    expect(screen.getByText(/Latest WHO report/)).toHaveTextContent("2026-DON621");
  });

  it("shows the WHO reports that name each country on a checked route", async () => {
    stubWho();
    window.history.pushState({}, "", "/travel-advisory/?from=Kenya&to=Uganda&date=2026-11-02");
    render(<TravelAdvisoryPage />);
    const stop = (country: string) =>
      screen
        .getAllByRole("heading", { name: country })
        .map((heading) => heading.closest<HTMLElement>(".ta-stop"))
        .find(Boolean)!;
    const uganda = stop("Uganda");
    expect(
      await within(uganda).findByText("Ebola disease caused by Bundibugyo virus - multi-country"),
    ).toBeInTheDocument();
    const kenya = stop("Kenya");
    expect(
      within(kenya).getByText(/No WHO Ebola outbreak report in the past 12 months names/),
    ).toBeInTheDocument();
    // WHO's reports never count as Sentinel Africa verified checks.
    expect(screen.getByRole("status")).toHaveTextContent("0 of 5");
  });

  it("explains when WHO cannot be reached and tries again on request", async () => {
    render(<TravelAdvisoryPage />);
    expect(
      await screen.findByText("WHO’s reports couldn’t be loaded right now"),
    ).toBeInTheDocument();
    stubWho();
    fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
    const section = screen.getByRole("region", { name: "Latest WHO outbreak reports" });
    expect(await within(section).findByText("2026-DON621")).toBeInTheDocument();
  });

  it("fills the console's review queue from WHO and starts a record from a report", async () => {
    stubWho();
    window.history.pushState({}, "", "/admin/#travel");
    render(<AdminPage />);
    const table = await screen.findByRole("table", {
      name: "WHO Ebola reports awaiting editorial review",
    });
    expect(within(table).getAllByText("Awaiting review")).toHaveLength(2);
    expect(screen.getByText("WHO reports not yet published here").parentElement).toHaveTextContent(
      "2",
    );

    fireEvent.click(screen.getByRole("button", { name: "Prepare a record from 2026-DON613" }));
    expect(screen.getByRole("tab", { name: "Prepare a record" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText(/Started from WHO report/)).toBeInTheDocument();
    expect(screen.getByLabelText("Country")).toHaveValue("Democratic Republic of the Congo");
    expect(screen.getByLabelText("Title")).toHaveValue(
      "Ebola disease caused by Bundibugyo virus - multi-country",
    );
    expect(screen.getByLabelText("Source link")).toHaveValue(
      "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON613",
    );
    expect(screen.getByLabelText("Published by the source")).toHaveValue("2026-07-17");
  });
});

describe("Our Software Products page", () => {
  it("presents the three products in order, each opening its own site safely", () => {
    const { container } = render(<SoftwareProductsPage />);
    expect(container).not.toHaveTextContent(/KnowBe4|Isorobot/i);
    const path = container.querySelector<HTMLElement>(".tools-path")!;
    expect(
      within(path)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual(["#gapassess", "#isms-platform", "#strataone"]);

    for (const [name, url] of [
      ["GapAssess", "https://gap-assessment.rodelatech.com/login"],
      ["Sentinel Africa ISMS Platform", "https://isms.rodelatech.com/"],
      ["StrataOne", "https://strataone.tech/"],
    ] as const) {
      const section = screen.getByRole("region", { name });
      const visit = within(section).getByRole("link", { name: /^(Open|Visit)/ });
      expect(visit).toHaveAttribute("href", url);
      expect(visit).toHaveAttribute("target", "_blank");
      expect(visit).toHaveAttribute("rel", "noreferrer");
      expect(within(section).getByRole("link", { name: /Request a demo/ })).toHaveAttribute(
        "href",
        "/?interest=Our%20Software%20Products#contact",
      );
      expect(within(section).getByText("Who it’s for")).toBeInTheDocument();
    }
    // The products are presented as Sentinel Africa’s own; only their link targets name a host.
    expect(container).not.toHaveTextContent(/Rodela/i);
    expect(container.querySelector('img[alt*="Rodela" i]')).toBeNull();
    expect(
      screen.getByRole("heading", { name: /Software is only part of the answer/ }),
    ).toBeInTheDocument();
  });

  it("is listed under Our Services and selectable in the callback form", () => {
    window.history.pushState({}, "", "/?interest=Our%20Software%20Products");
    render(<App />);
    expect(screen.getByLabelText("I’m interested in")).toHaveValue("Our Software Products");
    window.history.pushState({}, "", "/");
  });
});

describe("Careers pages", () => {
  afterEach(() => {
    vi.useRealTimers();
    window.history.pushState({}, "", "/");
  });

  it("links Join our Team and SAC Talent Shield from the Careers menu and the footer", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    fireEvent.click(within(nav).getByRole("button", { name: "Careers" }));
    expect(within(nav).getByRole("link", { name: "Join our Team" })).toHaveAttribute(
      "href",
      "/join-our-team/",
    );
    expect(within(nav).getByRole("link", { name: "SAC Talent Shield" })).toHaveAttribute(
      "href",
      "/talent-shield/",
    );
    const footer = screen.getByRole("navigation", { name: "Footer navigation" });
    expect(within(footer).getByRole("link", { name: "Careers" })).toHaveAttribute(
      "href",
      "/join-our-team/",
    );
  });

  it("never lists a role past its deadline as open", () => {
    render(<CareersPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Join our Team");
    expect(screen.getByText(/A Sentinel is a guard during peace/)).toBeInTheDocument();
    expect(screen.getByText("There are no open roles right now")).toBeInTheDocument();
    const closed = screen.getByRole("heading", { name: "Recently closed" }).parentElement!;
    expect(within(closed).getByText("Outsourced Marketing Consultant")).toBeInTheDocument();
    expect(within(closed).getByText("Closed 31 January 2025")).toBeInTheDocument();
    expect(within(closed).getByRole("link", { name: /View role/ })).toHaveAttribute(
      "href",
      "/join-our-team/?role=outsourced-marketing-consultant",
    );
  });

  it("shows a closed role in full, pointing applicants to register their interest", () => {
    window.history.pushState({}, "", "/join-our-team/?role=outsourced-marketing-consultant");
    render(<CareersPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Outsourced Marketing Consultant",
    );
    for (const heading of ["Objectives", "Scope of work", "Deliverables", "Requirements"])
      expect(screen.getByRole("heading", { name: heading })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "2025 Marketing Plan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Applications closed" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Prepare my application/ })).toBeNull();
    expect(screen.getByRole("link", { name: /Register your interest/ })).toHaveAttribute(
      "href",
      "/join-our-team/#register-interest",
    );
  });

  it("checks an application to an open role and prepares it for the role's address", () => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2025-01-15T10:00:00"));
    window.history.pushState({}, "", "/join-our-team/?role=outsourced-marketing-consultant");
    render(<CareersPage />);
    expect(screen.getByRole("heading", { name: "Apply for this role" })).toBeInTheDocument();
    expect(screen.getByText("A financial proposal including fee structure.")).toBeInTheDocument();

    const submit = screen.getByRole("button", { name: /Prepare my application/ });
    fireEvent.click(submit);
    expect(screen.getByText("Enter your full name.")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toHaveFocus();

    fireEvent.change(screen.getByLabelText("Full name"), { target: { value: "Amina Otieno" } });
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "amina@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Phone number"), {
      target: { value: "+254 700 000000" },
    });
    fireEvent.change(screen.getByLabelText("Why you’re a fit"), {
      target: { value: "Eight years leading marketing for professional services firms." },
    });
    fireEvent.click(submit);
    expect(screen.getByRole("status")).toHaveTextContent("marketing@sentinelafrica.co.ke");
  });

  it("takes general applications from people who don't see a matching role", () => {
    render(<CareersPage />);
    const section = screen.getByRole("region", { name: /Don’t see your role/ });
    fireEvent.change(within(section).getByLabelText("Full name"), {
      target: { value: "Brian Mugisha" },
    });
    fireEvent.change(within(section).getByLabelText("Email address"), {
      target: { value: "brian@example.com" },
    });
    fireEvent.change(within(section).getByLabelText("Phone number"), {
      target: { value: "+256 700 000000" },
    });
    fireEvent.change(within(section).getByLabelText("Kind of role"), {
      target: { value: "Information security consultant" },
    });
    fireEvent.change(within(section).getByLabelText("About you"), {
      target: { value: "ISO 27001 Lead Implementer with five years in audit." },
    });
    fireEvent.click(within(section).getByRole("button", { name: /Send my details/ }));
    expect(within(section).getByRole("status")).toHaveTextContent(
      "info@sentinelafricaconsulting.com",
    );
  });

  it("presents the Talent Shield programme with its stages, status and contacts", () => {
    render(<TalentShieldPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("SAC Talent Shield");
    expect(screen.getAllByText("Applications are currently closed").length).toBeGreaterThan(0);
    expect(screen.getByText(/Vivian Wairimu/)).toBeInTheDocument();
    expect(screen.getByText(/admitted to a Kenyan University through KUCCPS/)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "From application to award" }).nextElementSibling!
        .children,
    ).toHaveLength(4);
    expect(screen.getByRole("link", { name: /\+254715484888/ })).toHaveAttribute(
      "href",
      "https://wa.me/254715484888",
    );
    expect(
      screen.getByRole("link", { name: /talentshield@sentinelafrica\.co\.ke/ }),
    ).toHaveAttribute("href", "mailto:talentshield@sentinelafrica.co.ke");
    expect(screen.getByRole("link", { name: /quality education/ })).toHaveAttribute(
      "href",
      "/our-sdgs-commitment/#quality-education",
    );
  });
});

describe("Content management in the staff console", () => {
  const open = (id: string) => {
    window.history.pushState({}, "", `/admin/#${id}`);
    return render(<AdminPage />);
  };
  afterEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("opens a working screen for every sidebar section", async () => {
    const { adminNavigation } = await import("@/components/admin/adminSections");
    for (const section of adminNavigation.flatMap((group) => group.sections)) {
      const { unmount } = open(section.id);
      expect(screen.queryByText("This section is being designed")).toBeNull();
      unmount();
    }
  }, 60000);

  it("lists the homepage sections in the order visitors see them, filled with live content", () => {
    open("homepage");
    const outline = screen.getByRole("navigation", { name: "Homepage sections" });
    expect(
      within(outline)
        .getAllByRole("button")
        .map((button) => button.textContent),
    ).toEqual([
      "01Hero",
      "02Our alliances",
      "03Who we are",
      "04Our services",
      "05Contact us",
      "06Our clients",
      "07Testimonials",
    ]);
    expect(screen.getByLabelText("Headline")).toHaveValue("Expertise across sectors.");
    expect(screen.getByLabelText("Highlighted word")).toHaveValue("Confidence");
  });

  it("saves a draft, marks the section as edited and can discard it", () => {
    open("homepage");
    const save = screen.getByRole("button", { name: "Save draft" });
    expect(save).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Headline"), {
      target: { value: "Risk, managed across Africa." },
    });
    expect(screen.getByText("Unsaved changes")).toBeInTheDocument();
    fireEvent.click(save);
    expect(screen.getByText("Draft saved in this browser.")).toBeInTheDocument();
    const outline = screen.getByRole("navigation", { name: "Homepage sections" });
    expect(within(outline).getByText("Edited")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Publish \(1\)/ })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Discard draft" }));
    expect(screen.getByLabelText("Headline")).toHaveValue("Expertise across sectors.");
    expect(within(outline).queryByText("Edited")).toBeNull();
  });

  it("edits repeatable items and links shared sections to their library", () => {
    open("homepage");
    const outline = screen.getByRole("navigation", { name: "Homepage sections" });
    fireEvent.click(within(outline).getByRole("button", { name: /Our services/ }));
    fireEvent.click(
      screen.getByRole("button", { name: "Move Information Security Management up" }),
    );
    const titles = [...document.querySelectorAll(".cms-list-title")].map((el) => el.textContent);
    expect(titles[0]).toBe("Information Security Management");
    fireEvent.click(screen.getByRole("button", { name: "Add service" }));
    expect(screen.getByText("5 services")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));

    fireEvent.click(within(outline).getByRole("button", { name: /Testimonials/ }));
    expect(screen.getByRole("link", { name: /Testimonials\s*4 items/ })).toHaveAttribute(
      "href",
      "#testimonials",
    );
  });

  it("switches between the pages of a group", () => {
    open("service-pages");
    const tabs = screen.getByRole("tablist", { name: "Our Services pages" });
    expect(within(tabs).getAllByRole("tab")).toHaveLength(5);
    fireEvent.click(within(tabs).getByRole("tab", { name: "Cybershield" }));
    expect(screen.getByLabelText("Page title")).toHaveValue("Cybershield");
  });

  it("shows inboxes with status filters and the media library", () => {
    const { unmount } = open("applications");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Job applications");
    expect(screen.getByRole("button", { name: "Shortlisted" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
    unmount();

    open("media");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Media library");
    expect(document.querySelectorAll(".cms-media-item").length).toBeGreaterThan(20);
  });
});

describe("Testimonial submission", () => {
  afterEach(() => localStorage.clear());

  it("opens the form, keeps the email private and confirms receipt", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Share your experience/ }));
    const dialog = screen.getByRole("dialog", { name: "Share your experience" });
    expect(within(dialog).getByText("Your email is never displayed")).toBeInTheDocument();
    fireEvent.change(within(dialog).getByLabelText("Your name"), {
      target: { value: "Amina Otieno" },
    });
    fireEvent.change(within(dialog).getByLabelText("Email address"), {
      target: { value: "amina@example.com" },
    });
    fireEvent.change(within(dialog).getByLabelText("Your experience"), {
      target: { value: "Practical, well-run ISO 27001 training." },
    });
    fireEvent.click(within(dialog).getByRole("checkbox"));
    fireEvent.submit(
      within(dialog)
        .getByRole("button", { name: /Submit testimonial/ })
        .closest("form")!,
    );
    expect(within(dialog).getByRole("status")).toHaveTextContent("Testimonial received");
    fireEvent.click(within(dialog).getByRole("button", { name: "Close testimonial form" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});

describe("Tools", () => {
  afterEach(() => window.history.pushState({}, "", "/"));

  it("groups every tool under one Tools menu, starting with the Tools page", () => {
    render(<App />);
    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(within(nav).queryByRole("link", { name: /^Travel Advisory/ })).toBeNull();
    fireEvent.click(within(nav).getByRole("button", { name: "Tools" }));
    const links = within(nav)
      .getAllByRole("link")
      .filter((link) => link.closest(".nav-dropdown.is-open"))
      .map((link) => [link.textContent, link.getAttribute("href")]);
    expect(links).toEqual([
      ["All tools", "/tools/"],
      ["Travel AdvisoryNew", "/travel-advisory/"],
      ["Rwanda DPP Registration", "/rwanda-dpp-registration/"],
      ["Certification Readiness & Implementation PlannerNew", "/certification-planner/"],
    ]);
    const footer = screen.getByRole("navigation", { name: "Footer navigation" });
    expect(within(footer).getByRole("link", { name: "Tools" })).toHaveAttribute("href", "/tools/");
  });

  it("lists each tool on the Tools page with a way to open it and to ask an expert", () => {
    render(<ToolsPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Tools");
    const section = screen.getByRole("region", { name: /tools, one place/ });
    expect(within(section).getByRole("link", { name: /Open Travel Advisory/ })).toHaveAttribute(
      "href",
      "/travel-advisory/",
    );
    expect(
      within(section).getByRole("link", { name: /Open Rwanda DPP Registration/ }),
    ).toHaveAttribute("href", "/rwanda-dpp-registration/");
    expect(within(section).getByText("More tools on the way")).toBeInTheDocument();
  });

  it("files each tool page under Tools and links to the other tools", () => {
    render(<RwandaDppPage />);
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(crumbs).getByRole("link", { name: "Tools" })).toHaveAttribute("href", "/tools/");
    const strip = screen.getByRole("region", { name: "Explore our other tools" });
    expect(within(strip).getByRole("link", { name: /Travel Advisory/ })).toHaveAttribute(
      "href",
      "/travel-advisory/",
    );
    expect(screen.queryByRole("region", { name: "Explore our other services" })).toBeNull();
  });

  it("keeps each tool selectable in the homepage callback form", () => {
    window.history.pushState({}, "", "/?interest=Rwanda%20DPP%20Registration");
    render(<App />);
    expect(screen.getByLabelText("I’m interested in")).toHaveValue("Rwanda DPP Registration");
  });

  it("gives the tools their own workspace in the staff console", () => {
    window.history.pushState({}, "", "/admin/#tool-pages");
    render(<AdminPage />);
    const tabs = screen.getByRole("tablist", { name: "Tools pages" });
    expect(
      within(tabs)
        .getAllByRole("tab")
        .map((tab) => tab.textContent),
    ).toEqual([
      "Tools page",
      "Travel Advisory",
      "Rwanda DPP Registration",
      "Certification Planner",
    ]);
  });
});

describe("Certification Readiness & Implementation Planner", () => {
  const profile = {
    organisation: "Acme",
    sector: "service",
    country: "Kenya",
    staff: 100,
    sites: 1,
    complexity: "medium",
    existing: "none",
    depth: "quick" as const,
    goal: "First certification",
    standards: ["27001"],
  };
  const firstChoices = Object.fromEntries(
    durationQuestions.filter((q) => !q.detailed).map((q) => [q.id, q.choices[0]![0]]),
  );

  it("asks the shared and standard-specific questions for the chosen depth", () => {
    expect(buildQuestions(profile)).toHaveLength(14);
    expect(buildQuestions({ ...profile, depth: "detailed" })).toHaveLength(19);
    expect(buildQuestions({ ...profile, standards: ["27001", "22301"] })).toHaveLength(17);
  });

  it("scores full evidence as advanced and no evidence as foundational", () => {
    const all = (rating: number) =>
      Object.fromEntries(buildQuestions(profile).map((q) => [q.id, rating]));
    const best = computeReport(profile, all(3), firstChoices);
    expect(best.score).toBe(100);
    expect(best.status).toBe("Advanced: seek formal audit readiness review");
    expect(best.priorities).toHaveLength(0);
    const worst = computeReport(profile, all(0), firstChoices);
    expect(worst.score).toBe(0);
    expect(worst.status).toBe("Foundational: build core system");
    expect(worst.priorities).toHaveLength(8);
    expect(worst.internalDays[1]).toBeGreaterThan(best.internalDays[1]);
    expect(worst.readinessMonths[0]).toBeGreaterThanOrEqual(2);
  });

  it("walks from organisation details to a readiness report", () => {
    const { container } = render(<CertificationPlannerPage />);
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(crumbs).getByRole("link", { name: "Tools" })).toHaveAttribute("href", "/tools/");

    fireEvent.click(screen.getByRole("checkbox", { name: /ISO\/IEC 27001:2022/ }));
    fireEvent.click(screen.getByRole("button", { name: /Start assessment/ }));
    expect(screen.getByRole("alert")).toHaveTextContent("Select at least one standard.");
    fireEvent.click(screen.getByRole("checkbox", { name: /ISO 22301:2019/ }));
    fireEvent.click(screen.getByRole("button", { name: /Start assessment/ }));

    const generate = screen.getByRole("button", { name: /Generate readiness report/ });
    expect(generate).toBeDisabled();
    expect(screen.getByText("0 / 24 answered")).toBeInTheDocument();
    for (const group of container.querySelectorAll("fieldset.cp-question"))
      fireEvent.click(group.querySelector("input")!);
    expect(generate).toBeEnabled();
    fireEvent.click(generate);

    expect(
      screen.getByRole("heading", { name: "Management system readiness report" }),
    ).toBeInTheDocument();
    expect(container.querySelector(".cp-metrics .is-primary dd")).toHaveTextContent("0%");
    expect(screen.getByRole("status")).toHaveTextContent("Foundational: build core system");
    expect(screen.getAllByText("Critical readiness check").length).toBeGreaterThan(0);

    const quote = screen.getByRole("region", { name: "Request a tailored quotation" });
    fireEvent.click(within(quote).getByRole("button", { name: /Prepare quotation request/ }));
    expect(within(quote).getByRole("alert")).toHaveTextContent("Enter your organisation name.");
  }, 15_000);
});
