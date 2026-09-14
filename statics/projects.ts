export type Project = {
  title: string;
  description: string;
  image: string;
  stack: string[];
  preview?: string;
  source?: string;
};

export const projects: Project[] = [
  { title: "PWEB E-commerce", image: "/images/projects/Project8.png", description: "A course capstone exploring a simple e-commerce journey, from browsing products through checkout.", stack: ["HTML", "CSS", "jQuery", "MySQL", "Bootstrap"], preview: "https://github.com/MipanZuu/FP-Pweb-IUP-", source: "https://github.com/MipanZuu/FP-Pweb-IUP-" },
  { title: "SawadiKap", image: "/images/projects/Project7.png", description: "A language-learning platform inspired by Duolingo for Javanese, Sundanese, Malay, and Indonesian.", stack: ["Laravel", "Tailwind CSS", "MySQL"], preview: "https://github.com/MipanZuu/MPPL-SawadiKap", source: "https://github.com/MipanZuu/MPPL-SawadiKap" },
  { title: "Cerebrum FK UNAIR", image: "/images/projects/Project1.png", description: "An assessment platform built with a three-person team to help a student organization evaluate first-semester students.", stack: ["Laravel", "Tailwind CSS", "MySQL"], preview: "http://raporkaderisasicerebrum.pro/" },
  { title: "Laundry Management", image: "/images/projects/Project2.png", description: "A full-stack database management capstone for handling customers, services, orders, and operations.", stack: ["PHP", "MySQL", "Bootstrap"], source: "https://github.com/MipanZuu/LaundryMBDfinal" },
  { title: "Portfolio V2", image: "/images/projects/Project3.png", description: "My second portfolio iteration, created while learning component-driven interface development with React.", stack: ["React", "Tailwind CSS"], source: "https://github.com/MipanZuu/react-portofolio" },
  { title: "Portfolio V1", image: "/images/projects/Project4.png", description: "The first version of my personal portfolio and an early exploration of responsive web programming.", stack: ["HTML", "Bootstrap", "JavaScript"], preview: "http://dentabramasta.xyz" },
  { title: "Basic Media Schooling", image: "/images/projects/Project5.png", description: "An event website made collaboratively during the Basic Media Schooling seminar.", stack: ["HTML", "CSS", "JavaScript"], source: "https://github.com/MipanZuu/BMS-Website/tree/main/BMS" },
  { title: "Discover Bromo", image: "/images/projects/Project6.png", description: "A visual travel page celebrating Mount Bromo, made as a Dicoding basic web programming capstone.", stack: ["HTML", "CSS", "JavaScript"], source: "https://github.com/MipanZuu/Bromo-Website/tree/main/bromo%202" },
];
