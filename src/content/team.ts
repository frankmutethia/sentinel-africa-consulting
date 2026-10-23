import mueni from "@/assets/people/faith-mueni.jpg";
import mulwa from "@/assets/people/faith-mulwa.jpg";
import stella from "@/assets/people/stella-simiyu.jpg";
import musa from "@/assets/people/musa-wesutsa.jpg";

// Staff profiles in published order, with titles, contact details and biographies.

export interface Member {
  id: string;
  name: string;
  title: string;
  photo: string;
  email: string;
  linkedin?: string;
  twitter?: string;
  bio: string[];
}

export const members: Member[] = [
  {
    id: "faith-mueni",
    name: "Faith Mueni",
    title: "Head of Operations",
    photo: mueni,
    email: "faith.mueni@sentinelafrica.co.ke",
    bio: [
      "Faith Mueni is a result-driven professional with an aspiring progressive career, with over 5 years of experience having the ability to identify and capitalize on business opportunities through effective risk and control based internal and information systems audit and compliance assessments. She is skilled at developing innovative solutions to improve business processes, ensuring business resilience and continuity, ensuring compliance and cost cutting measures and connecting business requirements to audit needs.",
      "In addition to more than five years in the field of risk management, Faith is also a natural leader. She maintains a role as the Head of Projects at Sentinel Africa. She is passionate about working with people to bring in new opportunities and taking up new challenges.",
    ],
  },
  {
    id: "faith-mulwa",
    name: "Faith Mulwa",
    title: "Deputy CEO",
    photo: mulwa,
    email: "faith.mulwa@sentinelafrica.co.ke",
    bio: [
      "A seasoned leader in Corporate Strategy and Planning, Faith Mulwa has extensive experience in defining and implementing Strategic Plans. A unique blend of Financial Consulting and Corporate Strategy where she has led corporate-wide initiatives. She has extensive experience in driving Change, leading Transformation programs, and building high-performing teams.",
      "Faith has 10 years of industry experience across Risk Management Consulting, Management Accounting domain among others. She has worked closely with Senior Management Teams, Partners, and Boards of organizations in building teams and driving outcomes as a part of the advisory, planning, and strategy offices for strategic governance and organization-wide changes.",
      "Specialties: corporate planning, monitoring & evaluation, personnel management, risk management, information security, financial management, quality management, HR, coaching, and mentoring.",
    ],
  },
  {
    id: "stella-simiyu",
    name: "Stella Simiyu",
    title: "Head of Managed Services",
    photo: stella,
    email: "stella.simiyu@sentinelafrica.co.ke",
    linkedin: "https://www.linkedin.com/in/stella-makona-simiyu-48313215/",
    twitter: "https://twitter.com/steshmak",
    bio: [
      "Stella is a change agent with over 11 year’s work experience in developing, implementing, and training on different disciplines related to Risk Management and Process Improvement.",
      "She a co-founder and currently the Head of Managed services and at Sentinel Africa where she leads the implementation of ISO standards as well as an audit of the same standards. Through her consultancy, she has successfully trained and consulted for several industries and institutions in banking, manufacturing, hospitality, insurance, and government institutions both in Kenya and abroad.",
      "She is the Chairlady of the Business Continuity Institute Forum East Africa. She has a wealth of experience and certifications such as Certified Enterprise Risk Manager CERM, ISO 31000 Lead Risk Manager, ISO 27001 Lead Implementer and Auditor, ISO 22301 Lead Implementer, and Auditor among many others.",
    ],
  },
  {
    id: "musa-wesutsa",
    name: "Musa Wesutsa",
    title: "CEO",
    photo: musa,
    // Spelling as published; see the note to the site owner before changing it.
    email: "musa.wesusta@sentinelafrica.co.ke",
    linkedin: "https://www.linkedin.com/in/musawesutsa/",
    twitter: "https://twitter.com/wesutsamusa",
    bio: [
      "Musa Wesutsa is a professional risk practitioner, passionate about information security with a focus on implementation, maintenance, and auditing of information security management systems based on ISO 27001",
      "As a Co-Founder and the Chief Executive Officer of Sentinel Africa Consulting and a Certified BSI and PECB trainer, he champions the training and implementation of Information Security and Business Continuity Management Systems.",
      "Moreover, he is among the first worldwide to achieve ISO 27701 Senior Lead Implementer, ISO27001 Master, ISO21500 Project Management, and ISO22301 Lead Implementer and Auditor.",
    ],
  },
];
