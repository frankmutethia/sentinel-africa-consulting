// Certification Readiness & Implementation Planner: questions and scoring.
// Ported from the Sentinel Africa ISO self-checker (version 4). The questions, weights and
// formulas are unchanged; only the presentation moved into the website.

export interface StandardDef {
  id: string;
  name: string;
  area: string;
}

export const standards: StandardDef[] = [
  { id: "27001", name: "ISO/IEC 27001:2022", area: "Information security" },
  { id: "22301", name: "ISO 22301:2019", area: "Business continuity" },
  { id: "9001", name: "ISO 9001:2026", area: "Quality management" },
  { id: "20000", name: "ISO/IEC 20000-1:2018", area: "IT service management" },
  { id: "27701", name: "ISO/IEC 27701:2025", area: "Privacy information" },
  { id: "42001", name: "ISO/IEC 42001:2023", area: "AI management" },
  { id: "37301", name: "ISO 37301:2021", area: "Compliance management" },
  { id: "14001", name: "ISO 14001:2026", area: "Environmental management" },
];

type Item = [title: string, detail: string];

const general: Item[] = [
  [
    "Context & scope",
    "The intended management system scope, processes, sites and external dependencies are defined.",
  ],
  [
    "Leadership",
    "Top management has approved policy, objectives, ownership and an accountable sponsor.",
  ],
  [
    "Legal & stakeholder obligations",
    "Relevant customer, regulatory, contractual and interested-party requirements are identified.",
  ],
  [
    "Risks & opportunities",
    "A documented method identifies, evaluates and addresses material risks and opportunities.",
  ],
  [
    "Competence & awareness",
    "Relevant staff understand their responsibilities and have completed role-based awareness or training.",
  ],
  [
    "Documented information",
    "Controlled policies, procedures and records are available, current and accessible.",
  ],
  [
    "Operational execution",
    "Defined processes and controls are consistently followed in daily operations.",
  ],
  [
    "Monitoring & measurement",
    "Management system objectives, indicators and outcomes are periodically measured.",
  ],
  [
    "Internal audit",
    "A management system internal audit has been completed, with findings recorded and tracked.",
  ],
  [
    "Management review",
    "Top management has reviewed system performance and approved decisions/actions.",
  ],
  [
    "Corrective action",
    "Issues, nonconformities and root causes are corrected, and actions are checked for effectiveness.",
  ],
];

const specific: Record<string, Item[]> = {
  "27001": [
    [
      "Information security risk treatment",
      "Information security risks are assessed and treated, with owners and acceptance decisions.",
    ],
    [
      "Applicability of security controls",
      "A Statement of Applicability identifies relevant controls and reasons for inclusion/exclusion.",
    ],
    [
      "Security operations",
      "Access, incident, vulnerability, supplier and continuity controls operate with records.",
    ],
  ],
  "22301": [
    [
      "Business impact analysis",
      "A BIA identifies critical products/services, impact over time and recovery requirements.",
    ],
    [
      "Continuity risk assessment",
      "Disruption scenarios, dependencies and continuity risks are assessed.",
    ],
    [
      "BC plans & exercises",
      "Continuity strategies, procedures, exercise results and improvement actions are evidenced.",
    ],
  ],
  "9001": [
    [
      "Process and customer requirements",
      "Key processes, service/product requirements and acceptance criteria are controlled.",
    ],
    [
      "Product/service quality",
      "Operational delivery, supplier controls and conformity records are maintained.",
    ],
    [
      "Quality performance",
      "Customer feedback, nonconformities and quality outcomes are analysed and acted upon.",
    ],
  ],
  "20000": [
    [
      "Service portfolio & agreements",
      "Services, service owners, customers and service level agreements are defined.",
    ],
    [
      "Service lifecycle practices",
      "Incident, change, configuration, problem and request processes are operational.",
    ],
    [
      "Service assurance",
      "Service availability, capacity, continuity and supplier performance are measured.",
    ],
  ],
  "27701": [
    [
      "Personal information inventory",
      "Personal data processing activities, roles, purposes and data flows are mapped.",
    ],
    [
      "Privacy risk & rights",
      "Privacy risk assessments and individual rights handling are operational.",
    ],
    [
      "Privacy controls",
      "Notices, retention, processors, transfers and incident handling have evidence.",
    ],
  ],
  "42001": [
    [
      "AI system inventory & purpose",
      "AI systems, intended uses, owners, stakeholders and boundaries are documented.",
    ],
    [
      "AI impact and risk assessment",
      "Potential impacts, risks and treatments are analysed across the AI lifecycle.",
    ],
    [
      "AI lifecycle governance",
      "Data, validation, monitoring, human oversight and third-party controls have records.",
    ],
  ],
  "37301": [
    [
      "Compliance obligation register",
      "Applicable obligations, owners and changes are centrally tracked.",
    ],
    ["Compliance evaluation", "Compliance performance is assessed, with escalation and reporting."],
    [
      "Speak-up and investigations",
      "Reporting, investigations and corrective responses are documented and understood.",
    ],
  ],
  "14001": [
    [
      "Environmental aspects",
      "Significant environmental aspects and lifecycle impacts are evaluated.",
    ],
    [
      "Compliance & operational controls",
      "Environmental obligations, operational controls and emergency arrangements are maintained.",
    ],
    [
      "Environmental performance",
      "Relevant environmental measures, incidents and improvements are monitored.",
    ],
  ],
};

const extended: Record<string, Item[]> = {
  "27001": [
    [
      "Risk assessment repeatability",
      "The security risk assessment method is repeatable, risk owners approve treatment and outcomes are reviewed.",
    ],
    [
      "Asset and information inventory",
      "Assets and information are identified, classified where relevant and assigned owners.",
    ],
    [
      "Supplier security",
      "Supplier relationships are risk-assessed, contractually governed and periodically evaluated.",
    ],
    [
      "Security incident learning",
      "Security incidents are logged, responded to and used to improve controls.",
    ],
    [
      "Continuity of information security",
      "Security requirements under disruption are assessed, tested and reviewed.",
    ],
  ],
  "22301": [
    [
      "Business continuity scope",
      "Critical services, external dependencies and locations are explicitly covered by BCMS scope.",
    ],
    [
      "Recovery objectives",
      "Recovery time priorities and minimum acceptable operating levels are approved.",
    ],
    [
      "Response arrangements",
      "Crisis response, communications and command responsibilities are established.",
    ],
    ["Supplier continuity", "Key suppliers and outsourced activities have continuity assurances."],
    [
      "Exercise programme",
      "Exercises test stated recovery objectives and actions are tracked to closure.",
    ],
  ],
  "9001": [
    [
      "Customer communication",
      "Customer-facing requirements and changes are reviewed, agreed and communicated.",
    ],
    [
      "Design and development",
      "Where applicable, design and development is planned, reviewed and validated.",
    ],
    ["External providers", "Suppliers and outsourced processes are evaluated and controlled."],
    [
      "Release and nonconforming outputs",
      "Release criteria and the handling of nonconforming products or services are defined.",
    ],
    ["Change control", "Changes affecting quality are reviewed and authorised."],
  ],
  "20000": [
    [
      "Service design and transition",
      "New or changed services pass through defined design, build and transition controls.",
    ],
    [
      "Configuration management",
      "Configuration information and dependencies are verified and maintained.",
    ],
    [
      "Supplier and third-party services",
      "External service performance is monitored and controlled.",
    ],
    [
      "Availability and capacity",
      "Service performance and availability/capacity needs are planned and evaluated.",
    ],
    [
      "Information security within SMS",
      "Information security requirements are integrated into service management.",
    ],
  ],
  "27701": [
    [
      "Controller and processor roles",
      "Organisational privacy roles and relevant processing responsibilities are established.",
    ],
    [
      "Individual rights requests",
      "Requests to exercise privacy rights are handled within defined processes and timelines.",
    ],
    ["Privacy by design", "Privacy review is embedded in new or changed processing."],
    ["Retention and disposal", "Retention schedules and secure deletion/disposal are operational."],
    [
      "Cross-border disclosures",
      "Transfers and sharing are assessed against applicable privacy obligations.",
    ],
  ],
  "42001": [
    [
      "AI policies and accountable roles",
      "AI policy, responsibilities and decision authorities are approved.",
    ],
    [
      "AI impact assessment records",
      "Impacts on individuals, groups and society are evaluated where applicable.",
    ],
    [
      "AI data governance",
      "Datasets, data quality, provenance and usage restrictions are evaluated.",
    ],
    [
      "AI testing and validation",
      "Performance, robustness and other relevant quality criteria are validated.",
    ],
    [
      "AI deployment monitoring",
      "Post-deployment monitoring, incident escalation and change control operate.",
    ],
  ],
  "37301": [
    [
      "Compliance culture",
      "Staff understand escalation routes and leadership demonstrates commitment to compliance.",
    ],
    [
      "Obligation changes",
      "Changing legal and contractual obligations are tracked to implementation.",
    ],
    ["Compliance controls", "Control ownership, operation and monitoring are documented."],
    [
      "Protected reporting",
      "Confidential reporting and non-retaliation arrangements are operational.",
    ],
    ["Third-party compliance", "Relevant third-party compliance risks are assessed and managed."],
  ],
  "14001": [
    [
      "Lifecycle considerations",
      "Relevant upstream and downstream environmental impacts have been considered.",
    ],
    [
      "Environmental objectives",
      "Environmental objectives have measures, owners and action plans.",
    ],
    ["Emergency preparedness", "Environmental emergency scenarios are planned and tested."],
    [
      "Operational influence",
      "Relevant suppliers and outsourced processes are subject to suitable controls.",
    ],
    [
      "Compliance evaluation evidence",
      "Environmental legal compliance is evaluated periodically with records.",
    ],
  ],
};

export interface DurationQuestion {
  id: string;
  label: string;
  choices: [value: string, label: string][];
  /** Asked only in the detailed diagnostic. */
  detailed?: boolean;
}

export const durationQuestions: DurationQuestion[] = [
  {
    id: "functions",
    label: "How many departments or functions are in the certification scope?",
    choices: [
      ["few", "1–2"],
      ["medium", "3–5"],
      ["many", "6–10"],
      ["verymany", "More than 10"],
    ],
  },
  {
    id: "countries",
    label: "How many countries are included in scope?",
    choices: [
      ["one", "1"],
      ["two", "2–3"],
      ["many", "More than 3"],
    ],
  },
  {
    id: "process",
    label: "How consistently are management system processes followed?",
    choices: [
      ["strong", "Consistently"],
      ["mixed", "Mostly"],
      ["weak", "Occasionally"],
      ["none", "Not established"],
    ],
  },
  {
    id: "sponsor",
    label: "Has top management approved the initiative, sponsor and budget?",
    choices: [
      ["yes", "All approved"],
      ["partial", "Some approvals pending"],
      ["no", "Not yet"],
    ],
  },
  {
    id: "coordinator",
    label: "How many hours per week can the internal coordinator dedicate?",
    choices: [
      ["4", "Under 4"],
      ["8", "4–8"],
      ["16", "9–16"],
      ["32", "17–32"],
      ["40", "Over 32"],
    ],
  },
  {
    id: "team",
    label: "How many staff can contribute to implementation activities?",
    choices: [
      ["2", "1–2"],
      ["5", "3–5"],
      ["10", "6–10"],
      ["15", "More than 10"],
    ],
  },
  {
    id: "teamHours",
    label: "On average, how many hours per week can each supporting staff member dedicate?",
    choices: [
      ["2", "Under 2"],
      ["4", "2–4"],
      ["8", "5–8"],
      ["12", "More than 8"],
    ],
  },
  {
    id: "remediation",
    label: "What level of process or technology remediation will implementation need?",
    choices: [
      ["none", "None"],
      ["minor", "Minor"],
      ["moderate", "Moderate"],
      ["major", "Major"],
    ],
  },
  {
    id: "evidence",
    label: "Are there operating records demonstrating the management system works?",
    choices: [
      ["good", "Consistent evidence"],
      ["some", "Some evidence"],
      ["little", "Very little"],
    ],
  },
  {
    id: "deadline",
    label: "When would you like to achieve certification?",
    choices: [
      ["3", "Within 3 months"],
      ["6", "3–6 months"],
      ["9", "6–9 months"],
      ["12", "9–12 months"],
      ["0", "Flexible / no target"],
    ],
  },
  {
    id: "approvals",
    label: "How long do major management approvals typically take?",
    detailed: true,
    choices: [
      ["1", "Within a week"],
      ["3", "2–3 weeks"],
      ["6", "4–6 weeks"],
      ["8", "Longer than 6 weeks"],
    ],
  },
  {
    id: "providers",
    label: "How many critical suppliers or outsourced activities are in scope?",
    detailed: true,
    choices: [
      ["few", "0–5"],
      ["medium", "6–20"],
      ["many", "21–50"],
      ["verymany", "More than 50"],
    ],
  },
  {
    id: "laws",
    label: "How demanding are applicable regulatory or contractual obligations?",
    detailed: true,
    choices: [
      ["few", "Few"],
      ["medium", "Several"],
      ["many", "Extensive"],
      ["unknown", "Not sure"],
    ],
  },
  {
    id: "change",
    label: "How much change to staff working practices is expected?",
    detailed: true,
    choices: [
      ["minimal", "Minimal"],
      ["moderate", "Moderate"],
      ["major", "Significant"],
      ["wide", "Organisation-wide"],
    ],
  },
  {
    id: "auditCompetence",
    label: "Do you have competent internal auditors available?",
    detailed: true,
    choices: [
      ["yes", "Yes"],
      ["some", "Partially"],
      ["no", "No"],
    ],
  },
  {
    id: "auditHistory",
    label: "Have relevant internal audits and management reviews been completed?",
    detailed: true,
    choices: [
      ["both", "Both"],
      ["one", "One of the two"],
      ["none", "Neither"],
    ],
  },
  {
    id: "certBody",
    label: "Have you identified an independent certification body?",
    detailed: true,
    choices: [
      ["contract", "Contracted"],
      ["identified", "Identified"],
      ["no", "Not yet"],
    ],
  },
  {
    id: "dependencies",
    label: "Will other projects or procurement activities affect implementation?",
    detailed: true,
    choices: [
      ["none", "No"],
      ["few", "A few"],
      ["many", "Several"],
      ["major", "Major dependencies"],
    ],
  },
  {
    id: "availability",
    label: "Will holiday, peak-season or other blackout periods affect key staff?",
    detailed: true,
    choices: [
      ["none", "No"],
      ["some", "Some"],
      ["major", "Significant periods"],
    ],
  },
  {
    id: "parallel",
    label: "How many workstreams can be progressed in parallel?",
    detailed: true,
    choices: [
      ["most", "Most"],
      ["some", "Some"],
      ["few", "Very few"],
    ],
  },
];

/** Answers to the readiness questions, 0 to 3. */
export const ratingLabels = [
  "Not started",
  "Planned",
  "Partly implemented",
  "Implemented, evidence available",
];

export const sectors = [
  ["service", "Professional services / office-based"],
  ["financial", "Financial services / regulated"],
  ["technology", "Technology / telecoms"],
  ["public", "Public sector"],
  ["manufacturing", "Manufacturing / industrial"],
  ["health", "Healthcare"],
  ["other", "Other"],
] as const;
export const countries = ["Kenya", "Rwanda", "Uganda", "Tanzania", "Somaliland", "Other"];
export const complexities = [
  ["low", "Low — few processes, single location"],
  ["medium", "Medium — several functions / dependencies"],
  ["high", "High — complex delivery, outsourcing or regulation"],
] as const;
export const maturities = [
  ["none", "None / mostly informal"],
  ["partial", "Documented processes / some controls"],
  ["mature", "Mature or certified related management system"],
] as const;
export const depths = [
  ["quick", "Quick check — headline maturity"],
  ["detailed", "Detailed diagnostic — expanded controls and evidence"],
] as const;
export const goals = [
  "First certification",
  "Transition to new edition",
  "Re-certification readiness",
  "Integrate multiple standards",
  "Internal improvement / benchmarking",
];

export interface Profile {
  organisation: string;
  sector: string;
  country: string;
  staff: number;
  sites: number;
  complexity: string;
  existing: string;
  depth: "quick" | "detailed";
  goal: string;
  standards: string[];
}

export interface Question {
  id: string;
  title: string;
  detail: string;
  /** A standard ID, or "Common" for shared governance. */
  standard: string;
  critical: boolean;
}

export const standardName = (id: string) => standards.find((s) => s.id === id)?.name ?? id;

export function buildQuestions(profile: Profile): Question[] {
  const questions: Question[] = general.map(([title, detail], i) => ({
    id: `g${i}`,
    title,
    detail,
    standard: "Common",
    critical: i === 8 || i === 9,
  }));
  for (const id of profile.standards) {
    (specific[id] ?? []).forEach(([title, detail], i) =>
      questions.push({ id: `${id}_${i}`, title, detail, standard: id, critical: i === 0 }),
    );
    if (profile.depth === "detailed")
      (extended[id] ?? []).forEach(([title, detail], i) =>
        questions.push({ id: `${id}_x${i}`, title, detail, standard: id, critical: false }),
      );
  }
  return questions;
}

export const activeDurationQuestions = (depth: Profile["depth"]) =>
  durationQuestions.filter((q) => !q.detailed || depth === "detailed");

export interface Recommendation {
  name: string;
  text: string;
  href: string;
}

export interface Report {
  date: string;
  profile: Profile;
  score: number;
  status: string;
  level: "good" | "mid" | "low";
  standards: { id: string; name: string; score: number }[];
  criticalGaps: string[];
  priorities: { question: Question; rating: number; note: string }[];
  implementationMonths: [number, number];
  readinessMonths: [number, number];
  certificationMonths: [number, number];
  feasibility: string;
  capacityDaysPerMonth: number;
  scheduleDriver: string;
  internalDays: [number, number];
  externalDays: [number, number];
  workingGroup: number;
  recommendations: Recommendation[];
  answers: { standard: string; question: string; rating: number; note: string }[];
  duration: Record<string, string | null>;
}

const average = (values: number[]) =>
  values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1);

export function interpretScore(score: number) {
  return score >= 85
    ? "High self-reported maturity"
    : score >= 65
      ? "Most foundations exist"
      : score >= 40
        ? "Significant gaps"
        : "Limited implementation evidence";
}

export function computeReport(
  profile: Profile,
  answers: Record<string, number>,
  duration: Record<string, string | null>,
  notes: Record<string, string> = {},
): Report {
  const questions = buildQuestions(profile);
  const rating = (q: Question) => answers[q.id] ?? 0;
  const common = questions.filter((q) => q.standard === "Common");

  const scores = profile.standards.map((id) => {
    const values = [...common, ...questions.filter((q) => q.standard === id)].map(rating);
    return { id, name: standardName(id), score: Math.round((average(values) / 3) * 100) };
  });
  const score = Math.round(average(scores.map((s) => s.score)));
  const critical = questions.filter((q) => q.critical && rating(q) < 3);
  const auditGate = questions.filter((q) => ["g8", "g9", "g10"].includes(q.id) && rating(q) < 3);
  const advanced = score >= 85 && !critical.length && !auditGate.length;
  const status = advanced
    ? "Advanced: seek formal audit readiness review"
    : score >= 65
      ? "Developing: targeted remediation required"
      : score >= 40
        ? "Emerging: substantial implementation work"
        : "Foundational: build core system";

  // Effort
  const { staff, sites } = profile;
  const cFactor =
    ({ low: 0.85, medium: 1, high: 1.35 } as Record<string, number>)[profile.complexity] ?? 1;
  const siteFactor = 1 + Math.min(0.55, (sites - 1) * 0.075);
  const sizeFactor = Math.max(
    0.75,
    Math.min(2.3, 0.75 + 0.19 * Math.log2(Math.max(staff, 10) / 10)),
  );
  const sectorFactor =
    (
      {
        service: 1,
        financial: 1.18,
        technology: 1.1,
        public: 1.15,
        manufacturing: 1.18,
        health: 1.2,
        other: 1.1,
      } as Record<string, number>
    )[profile.sector] ?? 1.1;
  const standardFactor = 1 + (profile.standards.length - 1) * 0.62;
  const maturityFactor =
    ({ none: 1.2, partial: 1, mature: 0.8 } as Record<string, number>)[profile.existing] ?? 1;
  const gapFactor = Math.max(0.28, 1.25 - score / 100);
  const central =
    35 *
    cFactor *
    siteFactor *
    sizeFactor *
    sectorFactor *
    standardFactor *
    maturityFactor *
    gapFactor;

  const d = duration;
  const f = (map: Record<string, number>, key: string, fallback = 1) =>
    map[d[key] ?? ""] ?? fallback;
  const scopeFactor =
    f({ few: 0.94, medium: 1, many: 1.12, verymany: 1.24 }, "functions") *
    f({ one: 1, two: 1.1, many: 1.23 }, "countries");
  const readinessFactor =
    f({ strong: 0.87, mixed: 1, weak: 1.13, none: 1.25 }, "process") *
    f({ good: 0.88, some: 1, little: 1.19 }, "evidence");
  const remediationFactor = f({ none: 0.82, minor: 1, moderate: 1.25, major: 1.7 }, "remediation");
  const detailedFactor =
    f({ few: 1, medium: 1.04, many: 1.1, verymany: 1.18 }, "providers") *
    f({ few: 0.96, medium: 1, many: 1.12, unknown: 1.09 }, "laws") *
    f({ minimal: 0.94, moderate: 1, major: 1.12, wide: 1.2 }, "change");
  const adjusted = central * scopeFactor * readinessFactor * remediationFactor * detailedFactor;
  const internalDays: [number, number] = [Math.ceil(adjusted * 0.8), Math.ceil(adjusted * 1.35)];
  const externalDays: [number, number] = [Math.ceil(adjusted * 0.3), Math.ceil(adjusted * 0.7)];

  // Duration: supporting staff are pooled capacity, discounted for coordination and other work.
  const coordinatorHours = Number(d["coordinator"] ?? 8);
  const teamCount = Number(d["team"] ?? 5);
  const teamHours = Number(d["teamHours"] ?? 4);
  const capacity = Math.max(1.5, ((coordinatorHours + teamCount * teamHours * 0.45) * 4.33) / 8);
  const resourceMonths = internalDays[1] / capacity;
  const workstreamFloor = 2.2 + (profile.standards.length - 1) * 0.65;
  const approvalDelay =
    f({ yes: 0, partial: 1, no: 2.5 }, "sponsor") +
    f({ "1": 0, "3": 0.3, "6": 0.7, "8": 1.3 }, "approvals", 0);
  const blockers =
    f({ none: 0, few: 0.3, many: 1, major: 2 }, "dependencies", 0) +
    f({ none: 0, some: 0.3, major: 0.9 }, "availability", 0);
  const parallelFactor = f({ most: 0.88, some: 1, few: 1.2 }, "parallel", 1);
  const auditGap =
    (d["auditHistory"] === "none" ? 0.7 : d["auditHistory"] === "one" ? 0.3 : 0) +
    (d["auditCompetence"] === "no" ? 0.4 : 0);
  const implMid =
    Math.max(workstreamFloor, resourceMonths * 0.72) * parallelFactor + approvalDelay + blockers;
  const readinessMid = implMid + Math.max(0.8, auditGap + 0.6);
  const certMonths = f({ contract: 0.8, identified: 1.2, no: 1.8 }, "certBody", 1.5);
  const monthsLow = Math.max(2, Math.ceil(readinessMid * 0.8));
  const monthsHigh = Math.max(monthsLow + 1, Math.ceil(readinessMid * 1.22 + 0.5));
  const implementationMonths: [number, number] = [
    Math.max(1, Math.floor(implMid * 0.8)),
    Math.ceil(implMid * 1.22),
  ];
  const certificationMonths: [number, number] = [
    monthsLow + Math.max(1, Math.floor(certMonths * 0.6)),
    monthsHigh + Math.ceil(certMonths * 1.5),
  ];
  const deadline = Number(d["deadline"] ?? 0);
  const feasibility =
    deadline === 0
      ? "No deadline supplied"
      : certificationMonths[0] > deadline
        ? "Target is earlier than the optimistic estimate"
        : certificationMonths[1] <= deadline
          ? "Target falls beyond the upper estimate"
          : "Target is possible but schedule risk remains";

  const priorities = questions
    .filter((q) => rating(q) < 3)
    .sort((a, b) => Number(b.critical) - Number(a.critical) || rating(a) - rating(b))
    .slice(0, 8)
    .map((question) => ({ question, rating: rating(question), note: notes[question.id] ?? "" }));

  const recommendations: Recommendation[] = [];
  if (score < 70)
    recommendations.push({
      name: "Management system implementation consultancy",
      text: "Design and implement the core management system, responsibilities, controls and evidence.",
      href: "/consultancy/",
    });
  if (priorities.some((p) => /audit|review|corrective/i.test(p.question.title)))
    recommendations.push({
      name: "Internal audit and certification readiness review",
      text: "Build an audit programme, close findings and verify operational evidence.",
      href: "/consultancy/",
    });
  if (priorities.some((p) => /competence|awareness|training/i.test(p.question.title)))
    recommendations.push({
      name: "Sentinel Africa Training Institute",
      text: "Build competence through role-based awareness, implementer and internal auditor training.",
      href: "/training/",
    });
  if (profile.standards.length > 1)
    recommendations.push({
      name: "Integrated management system design",
      text: "Coordinate shared governance, documentation, internal audits and management reviews across standards.",
      href: "/managed-services/",
    });
  if (profile.standards.some((id) => ["27001", "20000", "42001"].includes(id)))
    recommendations.push({
      name: "Specialist technical and governance advisory",
      text: "Assess applicable controls, implementation dependencies and control remediation needs.",
      href: "/consultancy/",
    });
  if (!recommendations.length)
    recommendations.push({
      name: "Independent gap verification",
      text: "Validate self-reported evidence and prepare for a formal certification audit.",
      href: "/consultancy/",
    });

  return {
    date: new Date().toISOString(),
    profile,
    score,
    status,
    level: advanced ? "good" : score < 40 ? "low" : "mid",
    standards: scores,
    criticalGaps: critical.map((q) => q.title),
    priorities,
    implementationMonths,
    readinessMonths: [monthsLow, monthsHigh],
    certificationMonths,
    feasibility,
    capacityDaysPerMonth: Math.round(capacity * 10) / 10,
    scheduleDriver:
      resourceMonths > workstreamFloor
        ? "limited staff availability"
        : "process sequencing and evidence generation",
    internalDays,
    externalDays,
    workingGroup: Math.max(3, Math.min(12, Math.ceil(Math.log2(staff) + profile.standards.length))),
    recommendations: recommendations.slice(0, 4),
    answers: questions.map((q) => ({
      standard: q.standard,
      question: q.title,
      rating: rating(q),
      note: notes[q.id] ?? "",
    })),
    duration,
  };
}

const count = (n: number) => Math.round(n).toLocaleString("en-GB");
export const range = ([a, b]: [number, number]) => `${count(a)}–${count(b)}`;

/** Plain-text summary for copying or for a quotation enquiry. */
export function reportSummary(r: Report) {
  return [
    "Sentinel Africa Certification Readiness & Implementation Planner",
    `${r.profile.organisation || "Organisation"} | ${r.profile.country}`,
    `Standards: ${r.standards.map((s) => s.name).join(", ")}`,
    `Overall readiness: ${r.score}%`,
    r.status,
    `Certification readiness: ${range(r.readinessMonths)} months`,
    `Including certification: ${range(r.certificationMonths)} months`,
    `Internal effort: ${range(r.internalDays)} person-days`,
    `External advisory: ${range(r.externalDays)} person-days`,
    "Preliminary self-reported diagnostic; not a certification decision or quotation.",
  ].join("\n");
}
