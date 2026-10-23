import postIndex from "@/content/blog-index.json";
import { alliances, clients, sectors } from "@/content/brands";
import { directors } from "@/content/board";
import { homepage } from "@/content/homepage";
import { offices } from "@/content/offices";
import { members } from "@/content/team";
import { roles } from "../../site/careers";
import { headerNavigation, servicePages, toolPages, toolsPage } from "../../site/navigation";
import { courseAreas } from "../../site/trainingCourses";
import type { Block, ContentEditorDef, Field, Values } from "./types";
import { extendedEditors } from "./extendedEditors";
import { populatePageContexts } from "./pageContext";

const values = (data: object) => data as unknown as Values;

// Fields reused across editors.
const text = (key: string, label: string, hint?: string): Field => ({
  key,
  label,
  type: "text",
  ...(hint && { hint }),
});
const long = (key: string, label: string, hint?: string): Field => ({
  key,
  label,
  type: "textarea",
  wide: true,
  ...(hint && { hint }),
});
const image = (key: string, label: string): Field => ({ key, label, type: "image", wide: true });
const headingFields: Field[] = [
  text("eyebrow", "Eyebrow", "The small label above the heading."),
  text("title", "Heading"),
  text("accent", "Heading, highlighted line", "Shown on a second line in brand blue."),
  long("intro", "Introduction"),
];

/** The opening section every inner page shares: breadcrumb, eyebrow, title and lead. */
const pageHeader = (url: string, eyebrow: string, title: string, lead = ""): Block => ({
  id: "header",
  label: "Page header",
  description: "The opening section: eyebrow, title, introduction and search engine details.",
  view: url,
  source: lead ? "live" : "layout",
  fields: [
    text("eyebrow", "Eyebrow"),
    text("title", "Page title"),
    long("lead", "Introduction"),
    text("seoTitle", "Browser tab and search title"),
    long("seoDescription", "Search and link-preview description"),
  ],
  values: {
    eyebrow,
    title,
    lead,
    seoTitle: `${title} — Sentinel Africa Consulting`,
    seoDescription: "",
  },
});

/** A section whose fields are defined but whose content still lives in the page code. */
const layout = (id: string, label: string, description: string, fields: Field[]): Block => ({
  id,
  label,
  description,
  source: "layout",
  fields,
  values: {},
});

const listOf = (
  key: string,
  label: string,
  itemLabel: string,
  fields: Field[],
  titleKey?: string,
): Field => ({
  key,
  label,
  type: "list",
  itemLabel,
  fields,
  wide: true,
  ...(titleKey && { titleKey }),
});

const cards = (key: string, label: string, itemLabel: string) =>
  listOf(key, label, itemLabel, [text("title", "Title"), long("text", "Description")], "title");

// ---------------------------------------------------------------- Website pages

const homepageEditor: ContentEditorDef = {
  id: "homepage",
  overline: "Website pages",
  title: "Homepage",
  description: "Every section of the homepage, in the order visitors see them.",
  pages: [
    {
      id: "home",
      label: "Homepage",
      url: "/",
      blocks: [
        {
          id: "hero",
          label: "Hero",
          description: "The first screen: headline, introduction, buttons, photograph and badges.",
          view: "/#top",
          source: "live",
          values: values(homepage.hero),
          fields: [
            text("eyebrow", "Eyebrow"),
            text("headline", "Headline", "First line, for example “Expertise across sectors.”"),
            text("highlight", "Highlighted word", "Shown in brand blue on its own line."),
            text("headlineEnd", "Closing line"),
            long("intro", "Introduction"),
            text("primaryButton", "Main button"),
            text("primaryHref", "Main button destination"),
            text("secondaryButton", "Second link"),
            text("secondaryHref", "Second link destination"),
            {
              key: "mediaType",
              label: "Hero media",
              type: "select",
              options: [
                { value: "image", label: "Photograph" },
                { value: "video", label: "Background video" },
              ],
            },
            text(
              "videoUrl",
              "Video file URL",
              "Prepare a media URL; video rendering and shared uploads are not connected yet.",
            ),
            image("videoPoster", "Video poster / reduced-motion image"),
            text("statValue", "Figure", "A number, shown with a plus sign."),
            text("statLabel", "Figure label"),
            text("statStrong", "Figure tagline"),
            image("image", "Photograph"),
            text(
              "imageAlt",
              "Photograph description",
              "Read aloud to visitors using screen readers.",
            ),
            text("imageCaption", "Photograph caption"),
            text("sideLabel", "Vertical side label"),
            text("certificationTitle", "Certification badge title"),
            listOf(
              "certifications",
              "Certifications",
              "Certification",
              [text("standard", "Standard"), text("system", "System")],
              "standard",
            ),
            text("certificationNote", "Certification note"),
            text("bottomLine", "Line under the hero"),
          ],
        },
        {
          id: "alliances",
          label: "Our alliances",
          description: "The moving strip of accreditation and alliance logos.",
          view: "/#alliances",
          source: "live",
          values: values(homepage.alliances),
          fields: [text("title", "Heading"), text("intro", "Line under the heading")],
          collection: {
            editor: "partners",
            page: "alliances",
            label: "Alliance logos",
            count: alliances.length,
          },
        },
        {
          id: "about",
          label: "Who we are",
          description: "A heading and a short introduction to Sentinel Africa.",
          view: "/#about",
          source: "live",
          values: values({
            ...homepage.about,
            title: `${homepage.about.title} ${homepage.about.accent}`,
            body: [homepage.about.lead, ...homepage.about.paragraphs].join("\n\n"),
            accent: "",
          }),
          fields: [
            text("title", "Heading"),
            { key: "body", label: "Paragraph", type: "richtext", wide: true },
          ],
        },
        {
          id: "services",
          label: "Our services",
          description: "The four practice areas, each with its standard and a callback link.",
          view: "/#services",
          source: "live",
          values: values(homepage.services),
          fields: [
            ...headingFields,
            listOf(
              "items",
              "Services",
              "Service",
              [
                text("title", "Service"),
                text("standard", "Standard", "For example ISO 27001."),
                {
                  key: "icon",
                  label: "Icon",
                  type: "select",
                  options: [
                    { value: "shield", label: "Shield" },
                    { value: "lock", label: "Padlock" },
                    { value: "refresh", label: "Continuity arrows" },
                    { value: "target", label: "Target" },
                  ],
                },
                long("description", "Description"),
                text("detail", "Detail line", "Short topics separated by “·”."),
              ],
              "title",
            ),
            text("linkLabel", "Card link label"),
            text("stripLabel", "Ways-to-work strip label"),
          ],
        },
        {
          id: "contact",
          label: "Contact us",
          description: "The free callback request form and direct phone line.",
          view: "/#contact",
          source: "live",
          values: values(homepage.contact),
          fields: [
            text("eyebrow", "Eyebrow"),
            text("title", "Heading"),
            text("accent", "Highlighted closing word"),
            long("intro", "Introduction"),
            { key: "reassurances", label: "Reassurance points", type: "tags", wide: true },
            text("phoneLabel", "Phone label"),
            text("phone", "Phone number"),
            text("formTitle", "Form heading"),
            text("formIntro", "Form introduction"),
            {
              key: "recipient",
              label: "Send callback requests to",
              type: "email",
              hint: "Requests also appear in Inbox › Enquiries once the form service is connected.",
            },
          ],
        },
        {
          id: "clients",
          label: "Our clients",
          description: "Client logos, filterable by sector.",
          view: "/#clients",
          source: "live",
          values: values(homepage.clients),
          fields: headingFields,
          collection: {
            editor: "partners",
            page: "clients",
            label: "Client logos",
            count: clients.length,
          },
        },
        {
          id: "testimonials",
          label: "Testimonials",
          description: "Feedback from clients and training delegates.",
          view: "/#testimonials",
          source: "live",
          values: values({
            eyebrow: homepage.testimonials.eyebrow,
            title: homepage.testimonials.title,
            accent: homepage.testimonials.accent,
            intro: homepage.testimonials.intro,
          }),
          fields: headingFields,
          collection: {
            editor: "testimonials",
            label: "Testimonials",
            count: homepage.testimonials.items.length,
          },
        },
      ],
    },
  ],
};

const aboutEditor: ContentEditorDef = {
  id: "about-pages",
  overline: "Website pages",
  title: "About Us",
  description: "Who We Are, How We Do It, Why We Do It, Our Board and Our Team.",
  pages: [
    {
      id: "who-we-are",
      label: "Who We Are",
      url: "/who-we-are/",
      blocks: [
        pageHeader(
          "/who-we-are/",
          "About Sentinel Africa",
          "Who We Are",
          "A premier risk management consultancy firm, operating throughout Africa and beyond.",
        ),
        {
          id: "facts",
          label: "Key facts",
          description: "The facts card beside the header.",
          source: "live",
          fields: [
            listOf(
              "items",
              "Facts",
              "Fact",
              [text("label", "Label"), text("value", "Value")],
              "label",
            ),
          ],
          values: {
            items: [
              { label: "Certified", value: "ISO/IEC 27001 ISMS · ISO/IEC 27701 PIMS" },
              { label: "Headquarters", value: "Nairobi, Kenya" },
              { label: "Subsidiaries", value: "Rwanda and Uganda" },
              { label: "Sectors", value: "Private and public domains" },
            ],
          },
        },
        layout("story", "Our story", "The story video and the text beside it.", [
          text("videoId", "YouTube video ID"),
          image("poster", "Video preview image"),
          { key: "paragraphs", label: "Story", type: "paragraphs", wide: true },
        ]),
        {
          id: "values",
          label: "Core values",
          description: "The four values cards.",
          source: "live",
          fields: [{ key: "items", label: "Values", type: "tags", wide: true }],
          values: {
            items: [
              "Integrity & Ethics",
              "Speed & Flexibility",
              "Building Meaningful Relationships",
              "Working in the Trenches",
            ],
          },
        },
      ],
    },
    {
      id: "how-we-do-it",
      label: "How We Do It",
      url: "/how-we-do-it/",
      blocks: [
        pageHeader("/how-we-do-it/", "Our methodology", "How We Do It"),
        layout("steps", "Understand, Tailor, Embed", "The three steps of the methodology.", [
          cards("items", "Steps", "Step"),
        ]),
        layout("commitment", "Our commitment", "The closing commitment statement.", [
          text("title", "Heading"),
          { key: "paragraphs", label: "Text", type: "paragraphs", wide: true },
        ]),
      ],
    },
    {
      id: "why-we-do-it",
      label: "Why We Do It",
      url: "/why-we-do-it/",
      blocks: [
        pageHeader("/why-we-do-it/", "Our purpose", "Why We Do It"),
        layout("story", "Our story", "Why Sentinel Africa exists.", [
          { key: "paragraphs", label: "Story", type: "paragraphs", wide: true },
          image("photo", "Team photograph"),
        ]),
        layout("mission", "Mission and vision", "The mission and vision statements.", [
          long("mission", "Mission"),
          long("vision", "Vision"),
        ]),
      ],
    },
    {
      id: "board",
      label: "Our Board",
      url: "/board/",
      blocks: [
        pageHeader("/board/", "Leadership", "Our Board"),
        {
          id: "directors",
          label: "Directors",
          description: "Board members, chair first.",
          source: "live",
          collection: {
            editor: "people",
            page: "board",
            label: "Board members",
            count: directors.length,
          },
        },
      ],
    },
    {
      id: "team",
      label: "Our Team",
      url: "/team/",
      blocks: [
        pageHeader("/team/", "Our people", "Our Team"),
        {
          id: "members",
          label: "Team members",
          description: "Profiles in published order.",
          source: "live",
          collection: {
            editor: "people",
            page: "team",
            label: "Team members",
            count: members.length,
          },
        },
      ],
    },
  ],
};

const serviceSections: Record<string, Block[]> = {
  consultancy: [
    layout("standards", "What we implement", "The standards Sentinel implements.", [
      cards("items", "Standards", "Standard"),
    ]),
    layout("method", "Our modus operandi", "Understand, tailor and embed.", [
      cards("items", "Steps", "Step"),
    ]),
    layout("documents", "Documents we deliver", "Grouped implementation documents.", [
      listOf(
        "groups",
        "Groups",
        "Group",
        [text("title", "Group"), { key: "items", label: "Documents", type: "tags", wide: true }],
        "title",
      ),
    ]),
  ],
  "managed-services": [
    layout("benefits", "Benefits", "Why retain Sentinel long term.", [
      cards("items", "Benefits", "Benefit"),
    ]),
    layout("capabilities", "Capabilities", "Unique capabilities.", [
      cards("items", "Capabilities", "Capability"),
    ]),
    layout("cyber-shield", "Cyber Shield panel", "The panel linking to Cybershield.", [
      text("title", "Heading"),
      long("text", "Text"),
    ]),
  ],
  training: [
    {
      id: "courses",
      label: "Certification programmes",
      description: "Course areas, standards and courses.",
      source: "live",
      collection: { editor: "courses", label: "Course areas", count: courseAreas.length },
    },
    layout("calendar", "Training calendar", "The downloadable calendar.", [
      text("title", "Heading"),
      {
        key: "file",
        label: "Calendar PDF",
        type: "image",
        wide: true,
        hint: "Upload the PDF calendar.",
      },
    ]),
    layout("formats", "Training formats", "Public, in-house and self-study.", [
      cards("items", "Formats", "Format"),
    ]),
  ],
  cybershield: [
    layout("soc", "Security operations cycle", "The SOC cycle steps.", [
      cards("items", "Steps", "Step"),
    ]),
    layout("services", "Managed security services", "Service cards.", [
      cards("items", "Services", "Service"),
    ]),
    layout("assessments", "Vulnerability assessments", "The six assessment types.", [
      cards("items", "Assessments", "Assessment"),
    ]),
  ],
  "software-products": [
    layout("products", "Software products", "The products shown on the page.", [
      listOf(
        "items",
        "Tools",
        "Tool",
        [
          text("name", "Name"),
          text("category", "Category"),
          text("tagline", "Tagline"),
          long("text", "Description"),
          { key: "features", label: "Features", type: "tags", wide: true },
          { key: "url", label: "Website", type: "url" },
          image("shot", "Screenshot"),
        ],
        "name",
      ),
    ]),
  ],
  "rwanda-dpp-registration": [
    layout("who", "Who must register", "Controllers and processors required to register.", [
      long("text", "Text"),
    ]),
    layout("steps", "How we help", "Registration steps.", [cards("items", "Steps", "Step")]),
    layout("documents", "Documents", "Documents prepared, with templates marked.", [
      listOf(
        "items",
        "Documents",
        "Document",
        [text("text", "Document"), { key: "template", label: "Templated", type: "toggle" }],
        "text",
      ),
    ]),
  ],
};

const serviceEyebrows: Record<string, string> = {
  consultancy: "Short-term Implementations Advisory",
  "managed-services": "Retainers – Long-term Managed Consultancy Services",
  training: "Book Both Public and In-house – Physical, Virtual, or Self Study",
  cybershield: "24/7 monitoring, detection, analysis and response",
  "software-products": "Compliance software",
  "rwanda-dpp-registration": "Your Fast-Track to Compliance!",
};

const servicesEditor: ContentEditorDef = {
  id: "service-pages",
  overline: "Website pages",
  title: "Our Services",
  description: "The service pages listed under Our Services.",
  pages: servicePages.map((page) => {
    const id = page.href.replaceAll("/", "");
    return {
      id,
      label: page.label,
      url: page.href,
      blocks: [
        pageHeader(page.href, serviceEyebrows[id] ?? "", page.label),
        ...(serviceSections[id] ?? []),
      ],
    };
  }),
};

const resourcesEditor: ContentEditorDef = {
  id: "resource-pages",
  overline: "Website pages",
  title: "Resources",
  description: "Blog and Our SDG’s Commitment pages.",
  pages: [
    {
      id: "blog",
      label: "Blog",
      url: "/blog/",
      blocks: [
        pageHeader("/blog/", "Insights", "Blog"),
        {
          id: "articles",
          label: "Articles",
          description: "Published articles, newest first.",
          source: "live",
          collection: { editor: "articles", label: "Articles", count: postIndex.length },
        },
      ],
    },
    {
      id: "sdg",
      label: "Our SDG’s Commitment",
      url: "/our-sdgs-commitment/",
      blocks: [
        pageHeader(
          "/our-sdgs-commitment/",
          "Our commitment to sustainability",
          "Our SDG’s Commitment",
        ),
        layout("goals", "Goals", "The three Sustainable Development Goals.", [
          listOf(
            "items",
            "Goals",
            "Goal",
            [
              text("number", "Goal number"),
              text("name", "Name"),
              long("text", "Text"),
              image("photo", "Photograph"),
            ],
            "name",
          ),
        ]),
        layout("gender", "Gender split", "Share of men and women by team.", [
          listOf(
            "items",
            "Teams",
            "Team",
            [text("team", "Team"), text("men", "Men %"), text("women", "Women %")],
            "team",
          ),
        ]),
      ],
    },
  ],
};

const toolsEditor: ContentEditorDef = {
  id: "tool-pages",
  overline: "Website pages",
  title: "Tools",
  description: "The Tools page and every self-service tool listed under the Tools menu.",
  pages: [
    {
      id: "tools",
      label: "Tools page",
      url: toolsPage,
      blocks: [
        pageHeader(
          toolsPage,
          "Practical tools",
          "Tools",
          "Self-service tools from Sentinel Africa that help you check, prepare and act on risk and compliance requirements, backed by our consultants when you need them.",
        ),
        {
          id: "tools",
          label: "Tools listed",
          description:
            "Shown in the Tools menu, on the Tools page and in “Explore our other tools”.",
          source: "live",
          fields: [
            listOf(
              "items",
              "Tools",
              "Tool",
              [
                text("label", "Tool name"),
                text("category", "Category", "For example “Travel risk”."),
                long("summary", "Summary"),
                text("href", "Page address", "The tool’s page, for example /travel-advisory/."),
                text("interest", "Callback form option"),
                text("badge", "Badge", "For example “New”. Leave empty for none."),
              ],
              "label",
            ),
          ],
          values: { items: toolPages.map((tool) => ({ badge: "", ...tool })) },
        },
      ],
    },
    {
      id: "travel",
      label: "Travel Advisory",
      url: "/travel-advisory/",
      blocks: [
        pageHeader("/travel-advisory/", "Travel Risk Intelligence", "Travel Advisory"),
        {
          id: "records",
          label: "Advisories and requirements",
          description: "Reviewed records and the WHO review queue.",
          source: "live",
          collection: { editor: "travel", label: "Travel advisories workspace", count: 0 },
        },
      ],
    },
    {
      id: "rwanda-dpp-registration",
      label: "Rwanda DPP Registration",
      url: "/rwanda-dpp-registration/",
      blocks: [
        pageHeader(
          "/rwanda-dpp-registration/",
          serviceEyebrows["rwanda-dpp-registration"] ?? "",
          "Rwanda DPP Registration",
        ),
        ...(serviceSections["rwanda-dpp-registration"] ?? []),
      ],
    },
    {
      id: "certification-planner",
      label: "Certification Planner",
      url: "/certification-planner/",
      blocks: [
        pageHeader(
          "/certification-planner/",
          "How ready are you for ISO certification?",
          "Certification Readiness & Implementation Planner",
          "Understand your management system’s current maturity, identify priority gaps and estimate the people, effort and time needed to implement an effective ISO management system.",
        ),
        layout(
          "standards",
          "Standards and questions",
          "The standards visitors can assess and the readiness questions for each.",
          [
            listOf(
              "items",
              "Standards",
              "Standard",
              [
                text("name", "Standard and edition"),
                text("area", "Area"),
                { key: "questions", label: "Readiness questions", type: "paragraphs", wide: true },
              ],
              "name",
            ),
          ],
        ),
        layout("quotation", "Quotation requests", "Where quotation requests are sent.", [
          { key: "email", label: "Send requests to", type: "email" },
        ]),
      ],
    },
  ],
};

const careersEditor: ContentEditorDef = {
  id: "career-pages",
  overline: "Website pages",
  title: "Careers",
  description: "Join our Team and SAC Talent Shield.",
  pages: [
    {
      id: "join-our-team",
      label: "Join our Team",
      url: "/join-our-team/",
      blocks: [
        pageHeader(
          "/join-our-team/",
          "Become a Sentinel",
          "Join our Team",
          "A Sentinel is a guard during peace and a soldier during war. Our team of sentinels are obsessed with guarding our clients against risk as well as shielding them as they pursue opportunities – making them win!",
        ),
        {
          id: "shield",
          label: "Under our shield",
          description: "The card beside the header.",
          source: "live",
          fields: [
            { key: "items", label: "Points", type: "tags", wide: true },
            text("locations", "Locations"),
          ],
          values: {
            items: [
              "Constantly trained",
              "Recognised and rewarded",
              "Challenged with meaningful assignments",
            ],
            locations: "Nairobi · Kampala · Kigali",
          },
        },
        {
          id: "roles",
          label: "Open roles",
          description: "Opportunities and their deadlines.",
          source: "live",
          collection: { editor: "jobs", label: "Job openings", count: roles.length },
        },
        {
          id: "interest",
          label: "Register your interest",
          description: "General applications.",
          source: "live",
          fields: [
            text("title", "Heading"),
            long("intro", "Introduction"),
            { key: "email", label: "Send to", type: "email" },
          ],
          values: {
            title: "Don’t see your role? Register your interest.",
            intro:
              "Send us your details and CV. We maintain a pool of talent and will contact you when a suitable opportunity opens.",
            email: "info@sentinelafricaconsulting.com",
          },
        },
      ],
    },
    {
      id: "talent-shield",
      label: "SAC Talent Shield",
      url: "/talent-shield/",
      blocks: [
        pageHeader(
          "/talent-shield/",
          "Sentinel Talent Shield Program",
          "SAC Talent Shield",
          "Empowering Dreams & Shaping Futures. Tuition scholarships, mentorship and internships for gifted but underprivileged students joining Kenyan universities.",
        ),
        {
          id: "status",
          label: "Applications",
          description: "Whether a cohort is open, and how to reach the programme.",
          source: "live",
          fields: [
            { key: "open", label: "Applications are open", type: "toggle" },
            text("whatsapp", "WhatsApp number"),
            { key: "email", label: "Enquiries email", type: "email" },
            text("videoId", "YouTube video ID"),
          ],
          values: {
            open: false,
            whatsapp: "+254715484888",
            email: "talentshield@sentinelafrica.co.ke",
            videoId: "6MunfAi8ehg",
          },
        },
        {
          id: "testimonial",
          label: "Scholar testimonial",
          description: "The quote under the header.",
          source: "live",
          fields: [long("quote", "Quote"), text("name", "Name"), text("detail", "Cohort")],
          values: {
            quote:
              "As a proud alumni of the Talent Shield program, I can confidently say that it has exceeded my expectations in every way. It has been a beacon of hope, a catalyst for growth, and a promise of a brighter future. Sentinel Africa has truly redefined sponsorship with Talent Shield, and I am excited to witness the positive impact it will continue to have on the lives of countless young individuals like me.",
            name: "Vivian Wairimu",
            detail: "Talent Shield Beneficiary, Cohort I",
          },
        },
        {
          id: "eligibility",
          label: "Eligibility and stages",
          description: "Who can apply and the four application stages.",
          source: "live",
          fields: [
            { key: "eligibility", label: "Eligibility criteria", type: "paragraphs", wide: true },
            { key: "stages", label: "Application stages", type: "paragraphs", wide: true },
          ],
          values: {
            eligibility: [
              "You must have been admitted to a Kenyan University through KUCCPS.",
              "You should either be joining your first year at the university or currently in your first year of study.",
              "Ability to provide consent to share your information. For those under the age of 18 years, a guardian will have to assist in filling in the application form.",
              "Be available for contact and provide references available for contact.",
            ],
            stages: [
              "This will involve filling in the assessment on the basic criteria for shortlisting. The shortlisted applicant will proceed to Stage Two.",
              "You shall be contacted through the contact details provided in Stage One to request supporting documents for review. The successful applicants shall proceed to Stage Three.",
              "Applicants will be invited to an interview session. Interviews shall be conducted through videoconferencing.",
              "A final round of checks will be conducted, and the award decision made. The successful applicant will be notified of the award.",
            ],
          },
        },
      ],
    },
  ],
};

// ---------------------------------------------------------------- Content library

const collection = (
  id: string,
  title: string,
  description: string,
  url: string,
  field: Field,
  items: object[],
): ContentEditorDef => ({
  id,
  overline: "Content library",
  title,
  description,
  pages: [
    {
      id,
      label: title,
      url,
      blocks: [
        {
          id: "items",
          label: title,
          description,
          source: "live",
          fields: [field],
          values: { [field.key]: items as unknown as Values[string] },
        },
      ],
    },
  ],
});

const articlesEditor = collection(
  "articles",
  "Blog articles",
  "Articles on the Blog page, newest first.",
  "/blog/",
  listOf(
    "items",
    "Articles",
    "Article",
    [
      text("title", "Title"),
      text("slug", "Web address", "Used in the article link: /blog/?post=…"),
      { key: "date", label: "Publication date", type: "date" },
      text("author", "Author"),
      { key: "categories", label: "Categories", type: "tags", wide: true },
      long("excerpt", "Summary"),
      image("cover", "Cover image"),
      { key: "body", label: "Article text", type: "paragraphs", wide: true },
    ],
    "title",
  ),
  [...postIndex].sort((a, b) => b.date.localeCompare(a.date)),
);

const coursesEditor = collection(
  "courses",
  "Training courses",
  "The certification catalogue on the Training page.",
  "/training/#courses",
  listOf(
    "items",
    "Training areas",
    "Training area",
    [
      text("title", "Area"),
      text("short", "Short name"),
      image("image", "Illustration"),
      listOf(
        "groups",
        "Standards",
        "Standard",
        [
          text("standard", "Standard"),
          { key: "courses", label: "Courses", type: "tags", wide: true },
        ],
        "standard",
      ),
    ],
    "title",
  ),
  courseAreas,
);

const peopleEditor: ContentEditorDef = {
  id: "people",
  overline: "Content library",
  title: "Team & board",
  description: "Profiles and portraits on the Our Team and Our Board pages.",
  pages: [
    {
      id: "team",
      label: "Team members",
      url: "/team/",
      blocks: [
        {
          id: "members",
          label: "Team members",
          description: "Shown on Our Team in this order.",
          source: "live",
          fields: [
            listOf(
              "items",
              "Members",
              "Member",
              [
                text("name", "Name"),
                text("title", "Job title"),
                image("photo", "Portrait"),
                { key: "email", label: "Email", type: "email" },
                { key: "linkedin", label: "LinkedIn", type: "url" },
                { key: "bio", label: "Biography", type: "paragraphs", wide: true },
              ],
              "name",
            ),
          ],
          values: { items: members as unknown as Values[string] },
        },
      ],
    },
    {
      id: "board",
      label: "Board members",
      url: "/board/",
      blocks: [
        {
          id: "directors",
          label: "Board members",
          description: "The chair is shown first.",
          source: "live",
          fields: [
            listOf(
              "items",
              "Directors",
              "Director",
              [
                text("name", "Name"),
                text("title", "Title"),
                {
                  key: "role",
                  label: "Role",
                  type: "select",
                  options: ["Chair", "Non-executive", "Executive"].map((value) => ({
                    value,
                    label: value,
                  })),
                },
                image("photo", "Portrait"),
              ],
              "name",
            ),
          ],
          values: { items: directors as unknown as Values[string] },
        },
      ],
    },
  ],
};

const testimonialsEditor = collection(
  "testimonials",
  "Testimonials",
  "Client and delegate feedback on the homepage.",
  "/#testimonials",
  listOf(
    "items",
    "Testimonials",
    "Testimonial",
    [text("name", "Name"), text("role", "Role and organisation"), long("quote", "Feedback")],
    "name",
  ),
  homepage.testimonials.items,
);

const partnersEditor: ContentEditorDef = {
  id: "partners",
  overline: "Content library",
  title: "Partners & clients",
  description: "Alliance and client logos on the homepage.",
  pages: [
    {
      id: "alliances",
      label: "Alliances",
      url: "/#alliances",
      blocks: [
        {
          id: "alliances",
          label: "Alliance logos",
          description: "Shown in the moving logo strip.",
          source: "live",
          fields: [
            listOf(
              "items",
              "Alliances",
              "Alliance",
              [text("name", "Organisation"), image("logo", "Logo")],
              "name",
            ),
          ],
          values: { items: alliances as unknown as Values[string] },
        },
      ],
    },
    {
      id: "clients",
      label: "Clients",
      url: "/#clients",
      blocks: [
        {
          id: "clients",
          label: "Client logos",
          description: "Visitors can filter them by sector.",
          source: "live",
          fields: [
            { key: "sectors", label: "Sector filters", type: "tags", wide: true },
            listOf(
              "items",
              "Clients",
              "Client",
              [
                text("name", "Organisation"),
                image("logo", "Logo"),
                {
                  key: "sector",
                  label: "Sector",
                  type: "select",
                  options: sectors.slice(1).map((value) => ({ value, label: value })),
                },
                {
                  key: "compact",
                  label: "Compact logo (wide logos shown smaller)",
                  type: "toggle",
                },
              ],
              "name",
            ),
          ],
          values: {
            sectors: sectors.slice(1),
            items: clients.map((client) => ({ ...client, compact: !!client.compact })),
          },
        },
      ],
    },
  ],
};

const jobsEditor = collection(
  "jobs",
  "Job openings",
  "Roles on the Join our Team page. A role closes after its deadline day.",
  "/join-our-team/",
  listOf(
    "items",
    "Roles",
    "Role",
    [
      text("title", "Job title"),
      text("type", "Type", "For example Consultancy or Full time."),
      text("location", "Location"),
      text("term", "Term"),
      { key: "deadline", label: "Application deadline", type: "date" },
      { key: "applyTo", label: "Applications go to", type: "email" },
      long("summary", "Summary"),
      { key: "submit", label: "Documents to include", type: "paragraphs", wide: true },
    ],
    "title",
  ),
  roles.map(({ sections: _sections, ...role }) => role),
);

// ---------------------------------------------------------------- Administration

const siteEditor: ContentEditorDef = {
  id: "site",
  overline: "Administration",
  title: "Header & footer",
  description: "Menus, offices and contact details shared by every page.",
  pages: [
    {
      id: "header",
      label: "Header",
      url: "/",
      blocks: [
        {
          id: "menu",
          label: "Main menu",
          description: "Top-level menu items. Dropdown links come from each section’s pages.",
          source: "live",
          fields: [
            listOf(
              "items",
              "Menu items",
              "Menu item",
              [
                text("label", "Label"),
                text("href", "Link", "Leave empty to show “Soon”."),
                text("badge", "Badge", "For example “New”."),
                listOf(
                  "children",
                  "Dropdown links",
                  "Link",
                  [text("label", "Label"), text("href", "Destination"), text("badge", "Badge")],
                  "label",
                ),
              ],
              "label",
            ),
          ],
          values: {
            items: headerNavigation("/").map((item) => ({
              label: item.label,
              href: "href" in item ? (item.href ?? "") : "",
              badge: "badge" in item ? (item.badge ?? "") : "",
              children:
                "children" in item
                  ? item.children.map((child) => ({
                      label: child.label,
                      href: child.href ?? "",
                      badge: child.badge ?? "",
                    }))
                  : [],
            })),
          },
        },
        {
          id: "top-bar",
          label: "Top bar",
          description: "The green bar above the menu.",
          source: "live",
          fields: [{ key: "links", label: "Specialist service links", type: "tags", wide: true }],
          values: {
            links: [
              "Information Security Management",
              "Data Protection & Privacy",
              "Business Continuity",
              "Enterprise Risk Management",
            ],
          },
        },
      ],
    },
    {
      id: "footer",
      label: "Footer",
      url: "/#top",
      blocks: [
        {
          id: "offices",
          label: "Offices & contacts",
          description: "Shown in the footer of every page.",
          source: "live",
          fields: [
            listOf(
              "items",
              "Offices",
              "Office",
              [
                text("name", "Country"),
                text("label", "Label", "For example Head office."),
                long("address", "Address"),
                { key: "phones", label: "Phone numbers", type: "tags", wide: true },
                { key: "email", label: "Email", type: "email" },
              ],
              "name",
            ),
          ],
          values: { items: offices as unknown as Values[string] },
        },
        {
          id: "footer-text",
          label: "Footer text",
          description: "Tagline, invitation and closing line.",
          source: "live",
          fields: [
            text("tagline", "Tagline"),
            text("invitation", "Invitation link"),
            text("motto", "Motto"),
          ],
          values: {
            tagline: "Helping organizations navigate uncertainty. In Africa and beyond.",
            invitation: "Let’s build what’s next.",
            motto: "Perspective. Partnership. Progress.",
          },
        },
        {
          id: "whatsapp",
          label: "WhatsApp support",
          description: "The chat button on the homepage.",
          source: "layout",
          fields: [text("number", "WhatsApp number"), long("greeting", "Greeting")],
          values: { number: "+254715484888" },
        },
      ],
    },
  ],
};

const settingsEditor: ContentEditorDef = {
  id: "settings",
  overline: "Administration",
  title: "Settings",
  description: "Organisation details, search defaults and console preferences.",
  pages: [
    {
      id: "settings",
      label: "Settings",
      url: "/",
      blocks: [
        {
          id: "organisation",
          label: "Organisation",
          description: "Used across the website and in emails.",
          source: "live",
          fields: [
            text("name", "Organisation name"),
            { key: "email", label: "Main email", type: "email" },
            text("phone", "Main phone"),
            image("logo", "Logo"),
          ],
          values: {
            name: "Sentinel Africa Consulting Ltd",
            email: "info@sentinelafricaconsulting.com",
            phone: "+254 20 2484888",
          },
        },
        layout("seo", "Search and sharing", "Defaults when a page has none.", [
          text("title", "Default title"),
          long("description", "Default description"),
          image("shareImage", "Link-preview image"),
        ]),
        layout("social", "Social profiles", "Links in the footer and team profiles.", [
          { key: "linkedin", label: "LinkedIn", type: "url" },
          { key: "twitter", label: "X (Twitter)", type: "url" },
          { key: "youtube", label: "YouTube", type: "url" },
        ]),
      ],
    },
  ],
};

// Keep each page outline aligned with its public sections. These additional fields are
// intentionally drafts until the page content is migrated to a shared publishing service.
const supplementalSections: Record<string, Block[]> = {
  "who-we-are": [
    layout(
      "approach",
      "Our approach & compass",
      "The two editorial sections below the company story.",
      [long("approach", "Our approach to risk management"), long("compass", "Our compass")],
    ),
  ],
  "why-we-do-it": [
    layout("commitment", "Our commitment", "The closing commitment and supporting image.", [
      long("text", "Commitment"),
      image("image", "Photograph"),
      text("imageAlt", "Image description"),
    ]),
  ],
  consultancy: [
    layout("risk-view", "Our view on risk", "Protecting and creating value.", [
      long("text", "Introduction"),
      cards("items", "Points", "Point"),
    ]),
    layout("change", "Change management", "The final change-management section.", [
      text("title", "Heading"),
      long("text", "Body"),
    ]),
  ],
  "managed-services": [
    layout("challenges", "Client challenges", "The challenges section following the hero.", [
      text("title", "Heading"),
      long("text", "Body"),
    ]),
    layout("outcomes", "We help you", "Outcomes delivered through managed services.", [
      cards("items", "Outcomes", "Outcome"),
    ]),
  ],
  training: [
    layout("featured-programme", "Featured programme", "The featured training programme panel.", [
      text("title", "Heading"),
      long("text", "Description"),
      text("href", "Enquiry destination"),
    ]),
    layout("commitment", "Our commitment", "The closing training statement.", [
      long("text", "Body"),
    ]),
  ],
  cybershield: [
    layout("comparison", "Know the difference", "Explain assessment and testing approaches.", [
      cards("items", "Approaches", "Approach"),
    ]),
  ],
  "rwanda-dpp-registration": [
    layout("why-register", "Why register", "Registration context and supporting explanation.", [
      long("text", "Body"),
    ]),
    layout(
      "assessment",
      "Controller or processor assessment",
      "Assessment invitation and destination.",
      [text("title", "Heading"), long("text", "Body"), text("href", "Assessment destination")],
    ),
  ],
  "talent-shield": [
    layout("programme", "About the programme", "Programme introduction and pillars.", [
      long("text", "Introduction"),
      cards("items", "Pillars", "Pillar"),
    ]),
    layout(
      "privacy",
      "Applicant privacy information",
      "Information displayed beside the application journey.",
      [long("text", "Privacy information"), text("href", "Privacy notice destination")],
    ),
  ],
};
for (const editor of [aboutEditor, servicesEditor, careersEditor]) {
  for (const page of editor.pages) {
    page.blocks.push(...(supplementalSections[page.id] ?? []));
    page.blocks.push(
      layout(
        "closing-cta",
        "Closing invitation",
        "The call to action at the end of this page, where used.",
        [
          text("title", "Heading"),
          long("text", "Supporting text"),
          text("label", "Button label"),
          text("href", "Button destination"),
        ],
      ),
    );
  }
}

populatePageContexts([aboutEditor, servicesEditor, resourcesEditor, toolsEditor, careersEditor]);

export const contentEditors: ContentEditorDef[] = [
  ...extendedEditors,
  homepageEditor,
  aboutEditor,
  servicesEditor,
  resourcesEditor,
  toolsEditor,
  careersEditor,
  articlesEditor,
  coursesEditor,
  peopleEditor,
  testimonialsEditor,
  partnersEditor,
  jobsEditor,
  siteEditor,
  settingsEditor,
];

export const editorFor = (id: string) => contentEditors.find((editor) => editor.id === id);
