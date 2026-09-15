export type Education = {
  school: string;
  subject: string;
  location: string;
  type: string;
  duration: string;
  grade?: string | null;
};

export const education: Education[] = [
  {
    school: "Fontys University of Applied Sciences",
    subject: "ICT — Software Engineering",
    location: "Eindhoven",
    type: "Graduate · Bachelor of Science",
    duration: "2023 — 2025",
    grade: "8.9/10",
  },
  {
    school: "Institut Teknologi Sepuluh Nopember",
    subject: "Informatics",
    location: "Surabaya",
    type: "Graduate · Sarjana Komputer",
    duration: "2020 — 2025",
    grade: "3.79/4.00",
  },
  {
    school: "SMAN 1 Bangkalan",
    subject: "Science",
    location: "Bangkalan",
    type: "Graduate · Student",
    duration: "July 2017 — June 2020",
  },
  {
    school: "SMPN 2 Bangkalan",
    subject: "Science",
    location: "Bangkalan",
    type: "Graduate · Student",
    duration: "July 2014 — June 2017",
  },
];
