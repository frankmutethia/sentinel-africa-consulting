// Career opportunities shown on the Join our Team page. Add a role here to publish it; it
// is listed as open until the end of its deadline day, then moves to "Recently closed".
// The Outsourced Marketing Consultant role is transcribed from the published careers page.

export interface RoleSection {
  heading: string;
  /** Paragraphs shown before any list. */
  text?: string[];
  list?: string[];
  /** Numbered sub-headings, each with its own points. */
  groups?: { title: string; items: string[] }[];
  /** Whether `list` is numbered rather than bulleted. */
  numbered?: boolean;
}

export interface Role {
  slug: string;
  title: string;
  /** For example "Consultancy" or "Full time". */
  type: string;
  location: string;
  /** Length of the engagement, when fixed. */
  term?: string;
  /** Last day to apply, YYYY-MM-DD. */
  deadline: string;
  /** Where applications are sent. */
  applyTo: string;
  summary: string;
  sections: RoleSection[];
  /** Documents applicants are asked to include. */
  submit: string[];
}

export const roles: Role[] = [
  {
    slug: "outsourced-marketing-consultant",
    title: "Outsourced Marketing Consultant",
    type: "Consultancy",
    location: "Nairobi, Kenya · regional",
    term: "1 year",
    deadline: "2025-01-31",
    applyTo: "marketing@sentinelafrica.co.ke",
    summary:
      "Partner with us to design and execute a comprehensive marketing plan that grows our brand across Kenya, Uganda and Rwanda and into new regions.",
    sections: [
      {
        heading: "Terms of reference",
        text: [
          "Sentinel Africa Consulting is a leading Risk consultancy firm headquartered in Nairobi, Kenya, with operational branches in Uganda and Rwanda. Our primary focus is on Risk Management, serving clients across all sectors. As part of our 2025 strategic objectives, we aim to enhance our brand visibility and market share within our current markets and expand our influence in Ethiopia, Djibouti, Tanzania, and Botswana.",
          "We are seeking a skilled Marketing Consultant to partner with us to design and execute a comprehensive marketing plan that aligns with our business objectives and accelerates our growth.",
        ],
      },
      {
        heading: "Objectives",
        text: ["The primary objectives of this engagement include:"],
        numbered: true,
        list: [
          "Enhancing the Company’s brand visibility across Kenya, Uganda, and Rwanda.",
          "Growing market share within these markets and entering new regions: Ethiopia, Djibouti, Tanzania, and Botswana.",
          "Developing and implementing a robust 2025 marketing plan.",
          "Managing and optimizing the Company’s social media presence.",
          "Providing actionable market insights and trends to inform business development activities.",
        ],
      },
      {
        heading: "Scope of work",
        text: ["The Marketing Consultant will be responsible for the following activities:"],
        groups: [
          {
            title: "Brand Growth and Market Expansion",
            items: [
              "Develop a strategic branding initiative to enhance the Company’s market presence.",
              "Identify and implement strategies for market penetration in new regions (Ethiopia, Djibouti, Tanzania, and Botswana).",
            ],
          },
          {
            title: "2025 Marketing Plan",
            items: [
              "Draft a comprehensive marketing plan for 2025, including campaigns, timelines, and budgets.",
              "Align marketing initiatives with business development and sales objectives.",
            ],
          },
          {
            title: "Social Media Management",
            items: [
              "Develop a content calendar and manage daily posts across platforms including LinkedIn, Twitter, Facebook, and Instagram.",
              "Run targeted social media campaigns to engage audiences and generate leads.",
              "Monitor social media metrics and provide Monthly and quarterly reports.",
            ],
          },
          {
            title: "Market Insights and Trends",
            items: [
              "Conduct market research to gather insights on competitors, customer preferences, and emerging trends.",
              "Provide quarterly reports on market dynamics to guide strategic decision-making.",
            ],
          },
        ],
      },
      {
        heading: "Deliverables",
        text: ["The Consultant is expected to deliver the following:"],
        numbered: true,
        list: [
          "A detailed 2025 marketing plan, including an implementation roadmap.",
          "Monthly social media performance reports and actionable recommendations.",
          "Quarterly market insights reports with tailored business development suggestions.",
        ],
      },
      {
        heading: "Duration and timeline",
        text: [
          "The consultancy engagement will run for a period of 1 year. Milestones and deadlines will be agreed upon during the contract initiation phase.",
        ],
      },
      {
        heading: "Requirements",
        text: ["The ideal consultant should possess:"],
        list: [
          "Proven experience in marketing within the consulting or professional services industry.",
          "Expertise in social media management, content creation, and analytics.",
          "Strong knowledge of market dynamics in Kenya, Uganda, Rwanda, Ethiopia, Djibouti, Tanzania, and Botswana.",
          "Excellent strategic planning and execution skills.",
          "Strong communication and reporting abilities.",
        ],
      },
      {
        heading: "Reporting and coordination",
        text: [
          "The Consultant will report directly to the CEO. Regular updates will be provided through:",
        ],
        list: [
          "Bi-weekly progress meetings.",
          "Monthly reports on activities and outcomes.",
          "Ad hoc consultations as required.",
        ],
      },
    ],
    submit: [
      "A detailed proposal outlining your approach, methodology, and timelines.",
      "A financial proposal including fee structure.",
      "References and case studies of similar past engagements.",
    ],
  },
];

/** Where general applications and expressions of interest are sent. */
export const careersEmail = "info@sentinelafricaconsulting.com";

/** Today in the visitor's time zone, as YYYY-MM-DD. */
const today = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

/** A role stays open through the whole of its deadline day. */
export const isOpen = (role: Role, on = today()) => on <= role.deadline;

export const formatDeadline = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
