export type Education = {
  school: string;
  subject: string;
  location: string;
  type: string;
  duration: string;
  grade?: string | null;
};

export const education: Education[] = [
  { school: "Fontys University of Applied Sciences", subject: "ICT — Software Engineering", location: "Eindhoven", type: "Graduate · Double degree", duration: "2023 — 2025", grade: null },
  { school: "Institut Teknologi Sepuluh Nopember", subject: "Informatics", location: "Surabaya", type: "Graduate · Bachelor of Informatics", duration: "2020 — 2025", grade: null },
  { school: "SMAN 1 Bangkalan", subject: "Science", location: "Bangkalan", type: "Student", duration: "July 2017 — June 2020" },
  { school: "SMPN 2 Bangkalan", subject: "Science", location: "Bangkalan", type: "Student", duration: "July 2014 — June 2017" },
];
