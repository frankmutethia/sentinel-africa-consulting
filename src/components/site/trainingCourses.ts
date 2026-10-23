import ismArt from "@/assets/services/training-ism.png";
import bcmArt from "@/assets/services/training-bcm.png";
import ermArt from "@/assets/services/training-erm.png";
import privacyArt from "@/assets/services/training-privacy.png";

/** Certification courses by training area, shown on the Training page. */
export const courseAreas = [
  {
    id: "ism",
    short: "ISM",
    title: "Information Security Management Training (ISM)",
    image: ismArt,
    groups: [
      {
        standard: "ISO/IEC 27001 Information Security",
        courses: [
          "ISO/IEC 27001 Foundation",
          "ISO/IEC 27001 Lead Implementer",
          "ISO/IEC 27001 Lead Auditor",
        ],
      },
      {
        standard: "ISO/IEC 27032 Cyber Security",
        courses: ["Lead Cyber Security Manager", "Cyber Security Auditor"],
      },
    ],
  },
  {
    id: "bcm",
    short: "BCM",
    title: "Business Continuity, Resilience, and Recovery Training (BCM)",
    image: bcmArt,
    groups: [
      {
        standard: "ISO 22301 Business Continuity",
        courses: ["Foundation", "Lead Implementer", "Lead Auditor"],
      },
    ],
  },
  {
    id: "erm",
    short: "ERM",
    title: "Enterprise Risk Management Training (ERM)",
    image: ermArt,
    groups: [
      {
        standard: "ISO 31000 Risk Management",
        courses: ["ISO 31000 Foundation", "ISO 31000 Risk Manager", "ISO 31000 Lead Risk Manager"],
      },
      {
        standard: "ISO/IEC 27005 Information Security Risk Management",
        courses: ["ISO 27005 Lead Risk Manager"],
      },
    ],
  },
  {
    id: "privacy",
    short: "Privacy",
    title: "Data Protection and Privacy Information Management",
    image: privacyArt,
    groups: [
      {
        standard: "ISO 27701 Privacy Information Management",
        courses: ["ISO 27701 Foundation", "ISO 27701 Lead Implementer", "ISO 27701 Lead Auditor"],
      },
      {
        standard: "GDPR – Certified Data Protection Officer",
        courses: ["CDPO"],
      },
    ],
  },
];
