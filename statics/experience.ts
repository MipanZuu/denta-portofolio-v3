export type Experience = {
  position: string;
  company: string;
  companyUrl?: string;
  location: string;
  type: string;
  duration: string;
  highlights?: string[];
};

export const experiences: Experience[] = [
  {
    position: "Software Engineer",
    company: "ParkMundo",
    companyUrl: "https://www.parkmundo.nl/",
    location: "Eindhoven, Netherlands",
    type: "Full-time",
    duration: "February 2025 — Present",
    highlights: [
      "Developing scalable multilingual and multi-domain applications with Next.js, React, and Express.",
      "Contributing to a microservices architecture, GraphQL data flows, content management, analytics, and payment integrations.",
      "Collaborating across disciplines to improve product quality, performance, and developer experience.",
    ],
  },
  {
    position: "Full-stack Developer Intern",
    company: "ParkMundo",
    companyUrl: "https://www.parkmundo.nl/",
    location: "Eindhoven, Netherlands",
    type: "Graduation internship",
    duration: "September 2024 — February 2025",
    highlights: [
      "Built a Google Maps-based airport parking navigation feature using real-time traffic data.",
      "Modernized the company website for multilingual and multi-domain use while improving maintainability and performance.",
      "Completed the internship with an Advanced evaluation score of 10/10.",
    ],
  },
  { position: "Lab Administrator", company: "Algorithms and Programming Laboratory", location: "ITS, Surabaya", type: "Part-time", duration: "May 2022 — March 2025" },
  { position: "Teaching Assistant of Data Structure IUP 2023", company: "Department of Informatics", location: "ITS, Surabaya", type: "Part-time", duration: "February 2023 — December 2023" },
  { position: "Researcher and Full-stack Developer of Tower 2 ITS", company: "Institut Teknologi Sepuluh Nopember", location: "Surabaya", type: "Internship", duration: "December 2022 — November 2023" },
  { position: "Website Developer", company: "IMT Atlantique", location: "Nantes, France", type: "Internship", duration: "October 2022 — January 2023" },
  { position: "Full-stack Developer", company: "FK UNAIR", location: "Surabaya", type: "Freelance", duration: "July 2022 — January 2023" },
  { position: "Community Service", company: "Algorithms and Programming Laboratory", location: "SMAN 2 Surabaya", type: "Part-time", duration: "August 2022" },
  { position: "Teaching Assistant of Basic Programming IUP 2022", company: "Department of Informatics", location: "ITS, Surabaya", type: "Part-time", duration: "September 2022 — December 2022" },
  { position: "Teaching Assistant of Data Structure IUP 2021", company: "Department of Informatics", location: "ITS, Surabaya", type: "Part-time", duration: "February 2022 — August 2022" },
  { position: "Teaching Assistant of Basic Programming IUP 2021", company: "Department of Informatics", location: "ITS, Surabaya", type: "Part-time", duration: "August 2021 — January 2022" },
];
