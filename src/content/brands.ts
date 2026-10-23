import msecb from "@/assets/logos/msecb-logo.png";
import certitrust from "@/assets/logos/HD_Certi-Trust_Logo-Squared-Transparent-1_opt-3.png";
import bsi from "@/assets/logos/BSI-Core-Logo-Black-and-Red-Dot-CMYK.png";
import isaca from "@/assets/logos/ISACA_logo.png";
import bci from "@/assets/logos/bci-1.png";
import irm from "@/assets/logos/iRM-logo.png";
import odpc from "@/assets/logos/ODPC.png";
import ict from "@/assets/logos/ICT-Authority.png";
import nita from "@/assets/logos/NITA-U.png";
import knowbe4 from "@/assets/logos/KNOWBE4.png";
import excelledia from "@/assets/logos/excelledia.png";
import pecb from "@/assets/logos/PECB.png";
import kemri from "@/assets/logos/clients/KEMRI.png";
import ipsl from "@/assets/logos/clients/IPSL-2.png";
import techhouse from "@/assets/logos/clients/BK-techhouse.jpeg";
import rssb from "@/assets/logos/clients/RSSB.jpeg";
import crdb from "@/assets/logos/clients/CRDB-Bank.png";
import stanbic from "@/assets/logos/clients/stanbic-bank.jpg";
import icea from "@/assets/logos/clients/ICEA.png";
import cellulant from "@/assets/logos/clients/CELLULANT.png";
import hormuud from "@/assets/logos/clients/Hormuud_logo.png";
import golis from "@/assets/logos/clients/golis.png";
import telesom from "@/assets/logos/clients/telesom-logo.png";
import kcaa from "@/assets/logos/clients/KCAA.png";
import rra from "@/assets/logos/clients/rra.png";
import nitaClient from "@/assets/logos/clients/NITA-U.png";
import nse from "@/assets/logos/clients/NSE-Nigeria.png";
import palladium from "@/assets/logos/clients/palladium.png";
import siginon from "@/assets/logos/clients/SIGINON.png";

// Alliance logos and client logos for the homepage.

export const alliances = [
  { name: "MSECB", logo: msecb },
  { name: "CertiTrust", logo: certitrust },
  { name: "BSI", logo: bsi },
  { name: "ISACA", logo: isaca },
  { name: "BCI", logo: bci },
  { name: "Institute of Risk Management", logo: irm },
  { name: "Office of the Data Protection Commissioner", logo: odpc },
  { name: "ICT Authority", logo: ict },
  { name: "NITA Uganda", logo: nita },
  { name: "KnowBe4", logo: knowbe4 },
  { name: "Excelledia", logo: excelledia },
  { name: "PECB", logo: pecb },
];

export const sectors = [
  "All clients",
  "Finance",
  "Technology & telecoms",
  "Public sector",
  "Enterprise",
] as const;
export type Sector = (typeof sectors)[number];

export const clients: { name: string; logo: string; sector: Sector; compact?: boolean }[] = [
  { name: "KEMRI", logo: kemri, sector: "Public sector", compact: true },
  { name: "IPSL · Integrated Payment Services Limited", logo: ipsl, sector: "Finance" },
  { name: "BK TechHouse", logo: techhouse, sector: "Technology & telecoms" },
  { name: "Rwanda Social Security Board", logo: rssb, sector: "Public sector" },
  { name: "CRDB Bank", logo: crdb, sector: "Finance", compact: true },
  { name: "Stanbic Bank", logo: stanbic, sector: "Finance", compact: true },
  { name: "ICEA LION Group", logo: icea, sector: "Finance" },
  { name: "Cellulant", logo: cellulant, sector: "Technology & telecoms" },
  { name: "Hormuud Telecom", logo: hormuud, sector: "Technology & telecoms" },
  { name: "Golis Telecom", logo: golis, sector: "Technology & telecoms" },
  { name: "Telesom", logo: telesom, sector: "Technology & telecoms", compact: true },
  { name: "Kenya Civil Aviation Authority", logo: kcaa, sector: "Public sector" },
  { name: "Rwanda Revenue Authority", logo: rra, sector: "Public sector", compact: true },
  { name: "NITA Uganda", logo: nitaClient, sector: "Public sector" },
  { name: "The Nigerian Stock Exchange", logo: nse, sector: "Finance" },
  { name: "Palladium", logo: palladium, sector: "Enterprise" },
  { name: "Siginon Group", logo: siginon, sector: "Enterprise" },
];
