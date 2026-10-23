import { StrictMode } from "react";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContentEditor } from "@/components/admin/cms/ContentEditor";
import { editorFor } from "@/components/admin/cms/editors";
import AdminPage from "@/components/admin/AdminPage";
import { adminNavigation } from "@/components/admin/adminSections";
import { resolveHomepage } from "@/content/homepageDemo";
import { publishedBlock } from "@/components/admin/cms/prototypeStore";

describe("CMS draft workspaces", () => {
  afterEach(() => {
    localStorage.clear();
    window.history.replaceState(null, "", "/admin/");
    vi.restoreAllMocks();
  });

  it("previews unsaved homepage edits in the actual page without publishing them", () => {
    window.history.replaceState(null, "", "/admin/#homepage/home/hero");
    render(
      <StrictMode>
        <ContentEditor editor={editorFor("homepage")!} />
      </StrictMode>,
    );
    fireEvent.change(screen.getByLabelText("Headline"), {
      target: { value: "A new homepage headline" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Preview homepage" }));
    const frame = screen.getByTitle("Homepage with your changes") as HTMLIFrameElement;
    const token = new URL(frame.src).searchParams.get("homePreview");
    const snapshot = JSON.parse(sessionStorage.getItem(`home-preview:${token}`)!);
    expect(resolveHomepage(snapshot).homepage.hero.headline).toBe("A new homepage headline");
    expect(frame.src).toContain("#top");
    expect(publishedBlock("homepage", "home", "hero")).toBeUndefined();
  });

  it("creates a testimonial inside the homepage section and publishes its shared content", () => {
    window.history.replaceState(null, "", "/admin/#homepage/home/testimonials");
    render(<ContentEditor editor={editorFor("homepage")!} />);
    fireEvent.click(screen.getByRole("button", { name: "Create testimonial" }));
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "New client" } });
    fireEvent.change(screen.getByLabelText("Feedback"), {
      target: { value: "Helpful and practical." },
    });
    const save = screen
      .getAllByRole("button", { name: "Save draft" })
      .find((button) => !(button as HTMLButtonElement).disabled)!;
    fireEvent.click(save);
    fireEvent.click(screen.getByRole("button", { name: /^Publish/ }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm prototype publish" }));
    const revision = publishedBlock("testimonials", "testimonials", "items")!;
    expect(
      resolveHomepage({
        "testimonials/testimonials/items": revision.values,
      }).homepage.testimonials.items.at(-1)?.name,
    ).toBe("New client");
  });

  it("keeps Who we are to a heading and paragraph editor", () => {
    window.history.replaceState(null, "", "/admin/#homepage/home/about");
    render(<ContentEditor editor={editorFor("homepage")!} />);
    expect(screen.getByLabelText("Heading")).toBeInTheDocument();
    expect(screen.getByLabelText("Paragraph")).toBeInTheDocument();
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
    expect(screen.getByRole("toolbar", { name: "Text formatting" })).toBeInTheDocument();
  });

  it("keeps a planned FAQ draft after reopening without offering a broken public link", () => {
    const editor = editorFor("faq")!;
    const view = render(<ContentEditor editor={editor} />);
    expect(screen.queryByRole("link", { name: /view on website/i })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Heading"), { target: { value: "How can we help?" } });
    fireEvent.click(screen.getByRole("button", { name: /^save draft$/i }));
    view.unmount();
    render(<ContentEditor editor={editor} />);
    expect(screen.getByLabelText("Heading")).toHaveValue("How can we help?");
    expect(screen.getByRole("button", { name: /^publish/i })).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: /^publish/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /confirm prototype publish/i }));
    expect(publishedBlock("faq", "faq", "intro")?.values["title"]).toBe("How can we help?");
    expect(screen.getByRole("button", { name: /^publish/i })).toBeDisabled();
  });

  it("preserves existing dropdown destinations in the menu editor", () => {
    const menu = editorFor("site")!.pages[0]!.blocks[0]!;
    const items = menu.values!["items"] as {
      label: string;
      children: { label: string; href: string }[];
    }[];
    expect(items.find((item) => item.label === "About Us")!.children).toContainEqual(
      expect.objectContaining({ label: "Who We Are", href: "/who-we-are/" }),
    );
  });

  it("opens each sidebar workspace on click without leaving stale dashboard content", () => {
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);
    render(<AdminPage />);
    const nav = screen.getByRole("complementary", { name: "Console navigation" });
    for (const section of adminNavigation.flatMap((group) => group.sections)) {
      fireEvent.click(within(nav).getByRole("link", { name: section.label }));
      expect(window.location.hash).toBe(`#${section.id}`);
      const expected = editorFor(section.id)?.pages[0]?.label ?? section.label;
      if (section.id !== "dashboard")
        expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(expected);
      expect(within(nav).getByRole("link", { name: section.label })).toHaveAttribute(
        "aria-current",
        "page",
      );
    }
  }, 60000);

  it("opens and restores a specific inner page through the address and browser history", () => {
    window.history.replaceState(null, "", "/admin/#service-pages/cybershield/header");
    render(<AdminPage />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Cybershield");
    expect(screen.getByLabelText("Page title")).toHaveValue("Cybershield");
    act(() => {
      window.history.replaceState(null, "", "/admin/#about-pages/who-we-are/header");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Who We Are");
    expect(screen.getByLabelText("Introduction")).toHaveValue(
      "A premier risk management consultancy firm, operating throughout Africa and beyond.",
    );
  });
});
