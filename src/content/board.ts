import catherine from "@/assets/people/catherine-nyagah.jpg";
import muthoni from "@/assets/people/muthoni-ranji-pertet.jpg";
import benson from "@/assets/people/benson-maina.jpg";
import faith from "@/assets/people/faith-mulwa.jpg";
import stella from "@/assets/people/stella-simiyu.jpg";
import musa from "@/assets/people/musa-wesutsa.jpg";

// Board of directors in published order; the chair leads the grid.

export type BoardRole = "Chair" | "Non-executive" | "Executive";

export const directors: { name: string; title: string; role: BoardRole; photo: string }[] = [
  { name: "Musa Wesutsa", title: "Board Chair", role: "Chair", photo: musa },
  {
    name: "Catherine Nyagah",
    title: "Non-Executive Director",
    role: "Non-executive",
    photo: catherine,
  },
  {
    name: "Muthoni Ranji-Pertet",
    title: "Non-Executive Director and Company Secretary",
    role: "Non-executive",
    photo: muthoni,
  },
  { name: "Benson Maina", title: "Non-Executive Director", role: "Non-executive", photo: benson },
  { name: "Faith Mulwa", title: "Executive Director", role: "Executive", photo: faith },
  { name: "Stella Simiyu", title: "Executive Director", role: "Executive", photo: stella },
];
