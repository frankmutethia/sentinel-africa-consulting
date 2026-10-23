import heroPhoto from "@/assets/sentinel-conference.jpg";
import speakerPhoto from "@/assets/sentinel-speaker.jpg";
import awardPhoto from "@/assets/sentinel-award.jpg";

// Everything the homepage says, section by section, in the order it appears. The staff
// console's Homepage editor uses this same structure, so when a content service is
// connected it only has to supply data in this shape.

/** Icons a homepage service can use; the editor offers the same choices. */
export type ServiceIcon = "shield" | "lock" | "refresh" | "target";

export interface HomepageContent {
  hero: {
    eyebrow: string;
    /** Headline: lead line, highlighted word and closing line. */
    headline: string;
    highlight: string;
    headlineEnd: string;
    intro: string;
    primaryHref?: string;
    secondaryHref?: string;
    mediaType?: string;
    videoUrl?: string;
    videoPoster?: string;
    primaryButton: string;
    secondaryButton: string;
    statValue: string;
    statLabel: string;
    statStrong: string;
    image: string;
    imageAlt: string;
    imageCaption: string;
    sideLabel: string;
    certificationTitle: string;
    certifications: { standard: string; system: string }[];
    certificationNote: string;
    bottomLine: string;
  };
  alliances: { title: string; intro: string };
  about: {
    body?: string;
    eyebrow: string;
    title: string;
    accent: string;
    lead: string;
    paragraphs: string[];
    principles: string[];
    closing: string;
    linkLabel: string;
    photo: string;
    photoAlt: string;
    inset: string;
    insetAlt: string;
    insetCaption: string;
  };
  services: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    items: {
      title: string;
      standard: string;
      icon: ServiceIcon;
      description: string;
      detail: string;
    }[];
    linkLabel: string;
    stripLabel: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    reassurances: string[];
    phoneLabel: string;
    phone: string;
    formTitle: string;
    formIntro: string;
    /** Where callback requests are sent. */
    recipient: string;
  };
  clients: { eyebrow: string; title: string; accent: string; intro: string };
  testimonials: {
    eyebrow: string;
    title: string;
    accent: string;
    intro: string;
    items: { name: string; role: string; quote: string }[];
  };
}

export const homepage: HomepageContent = {
  hero: {
    eyebrow: "Risk management advisory",
    headline: "Expertise across sectors.",
    highlight: "Confidence",
    headlineEnd: "beyond borders",
    intro:
      "Over a decade of experience across private and public sectors. We help organizations in Africa and beyond embrace risk, build resilience and move forward with confidence.",
    primaryButton: "Start training",
    secondaryButton: "Explore our expertise",
    statValue: "10",
    statLabel: "Years of experience.",
    statStrong: "A forward-looking perspective.",
    image: heroPhoto,
    imageAlt: "Leaders and practitioners attending a Sentinel Africa risk management conference",
    imageCaption: "In Africa. And beyond.",
    sideLabel: "PERSPECTIVE. PARTNERSHIP. PROGRESS.",
    certificationTitle: "Our commitment, certified",
    certifications: [
      { standard: "ISO 27001", system: "ISMS" },
      { standard: "ISO 27701", system: "PIMS" },
    ],
    certificationNote: "A certified firm. A partner you can trust.",
    bottomLine: "Helping you see opportunity in uncertainty.",
  },
  alliances: {
    title: "Our alliances",
    intro: "Global expertise. A shared commitment.",
  },
  about: {
    eyebrow: "Who we are",
    title: "A fresh perspective.",
    accent: "A stronger tomorrow.",
    lead: "A pioneering force in risk management advisory, built on the belief that understanding risk opens the door to opportunity.",
    paragraphs: [
      "Our founders, seasoned risk management practitioners, saw the misunderstandings and untapped potential in this discipline. Driven by a desire to transform organizations, they set out to teach and champion effective risk management. Sentinel Africa was born from that purpose.",
      "We challenge misconceptions and redefine risk management as a strategic enabler of growth and resilience. Our approach is participatory: we explore your unique risk landscape together and develop tailored solutions that empower people to navigate uncertainty with confidence.",
      "Across Africa and beyond, we embed robust frameworks aligned with your organization’s goals. From information security and data privacy to business continuity, we cultivate risk intelligence, informed decisions and lasting progress.",
    ],
    principles: ["Collaborative by design", "Grounded in experience"],
    closing: "An outstanding service provider. An exceptional place to build a career.",
    linkLabel: "Discover how we can help",
    photo: speakerPhoto,
    photoAlt: "A Sentinel Africa representative contributing to a conference panel",
    inset: awardPhoto,
    insetAlt: "Sentinel Africa receiving an award at the CIOs Summit in Lusaka",
    insetCaption: "Expertise that makes a difference.",
  },
  services: {
    eyebrow: "Our services",
    title: "Built around your risks.",
    accent: "Aligned with your ambition.",
    intro:
      "Practical expertise. Internationally recognized frameworks. Solutions shaped around the way your organization works.",
    items: [
      {
        title: "Data Protection & Privacy",
        standard: "ISO 27701",
        icon: "lock",
        description:
          "Build trust into every interaction. Protect personal data with a privacy framework that brings people, processes and accountability together.",
        detail: "Privacy frameworks · Data governance · PIMS",
      },
      {
        title: "Information Security Management",
        standard: "ISO 27001",
        icon: "shield",
        description:
          "Protect what matters most. Strengthen your information security with a structured approach to managing threats and safeguarding your organization.",
        detail: "Security assessments · Risk treatment · ISMS",
      },
      {
        title: "Business Continuity Management",
        standard: "ISO 22301",
        icon: "refresh",
        description:
          "Be ready for what comes next. Prepare your teams, protect critical operations and respond to disruption with clarity and confidence.",
        detail: "Impact analysis · Continuity planning · BCMS",
      },
      {
        title: "Enterprise Risk Management",
        standard: "ISO 31000",
        icon: "target",
        description:
          "See the bigger picture. Connect risk intelligence to strategy and turn uncertainty into informed decisions and sustainable opportunities.",
        detail: "Risk frameworks · Governance · ERM",
      },
    ],
    linkLabel: "Let’s build your framework",
    stripLabel: "How we work with you",
  },
  contact: {
    eyebrow: "Let’s move forward",
    title: "Your next step starts",
    accent: "conversation.",
    intro:
      "Wondering where or how to start? Request a free callback. Our consultants will advise you and help you take the first step.",
    reassurances: ["A real conversation", "Advice for your organization"],
    phoneLabel: "Prefer to speak directly?",
    phone: "+254 715 484888",
    formTitle: "Request a free callback",
    formIntro: "Tell us a little about yourself. Let’s find your starting point.",
    recipient: "info@sentinelafricaconsulting.com",
  },
  clients: {
    eyebrow: "Our clients",
    title: "Different industries.",
    accent: "One shared confidence.",
    intro: "Working alongside the institutions, innovators and enterprises moving Africa forward.",
  },
  testimonials: {
    eyebrow: "Client testimonials",
    title: "Confidence, in their",
    accent: "own words.",
    intro: "The most meaningful measure of our work is what our clients take forward.",
    items: [
      {
        name: "Sam Muiruri Mburu",
        role: "Information security training",
        quote:
          "In today’s information-driven economy, data is the most valuable currency. Protecting and safeguarding this data is paramount for organizations. For me, the ultimate solution is implementing an Information Security Management System (ISMS), and ISO 27001 is the key to achieving that!",
      },
      {
        name: "Anthony Gatura",
        role: "IT Support and System Admin · International School of Kenya",
        quote:
          "I enrolled in Sentinel’s ISO 27001 Lead Implementer course, and I must say it was an incredibly practical and interactive experience. The course provided a clear roadmap for establishing an ISMS from the ground up to completion. I’m currently applying what I learned to set up an ISMS in my workplace.",
      },
      {
        name: "Leonard Kamau",
        role: "ISO 27001 Lead Implementer & Lead Auditor",
        quote:
          "Having been working on my company’s Information Security Management Systems (ISMS) based on ISO 27001/2, I needed to get certified to distinguish myself as an ISO 27001 Lead Implementer and Lead Auditor. Sentinel Africa helped me achieve this and prepared me very well for the certification examinations.",
      },
      {
        name: "Nicholas Mugambi",
        role: "Head Internal IT · MODE",
        quote:
          "I would like to thank Sentinel Africa for successfully taking us through the PECB ISO 27001 Certification. The training was exhaustive thus we were able to get fully certified as Lead Auditors with PECB.",
      },
    ],
  },
};

/** Two-letter initials for a testimonial avatar. */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .filter((letter, index, all) => index === 0 || index === all.length - 1)
    .join("")
    .toUpperCase();
