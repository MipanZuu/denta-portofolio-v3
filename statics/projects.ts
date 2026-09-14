export type Project = {
  title: string;
  description: string;
  image: string | null;
  stack: string[];
  preview?: string;
  source?: string;
};

export const projects: Project[] = [
  {
    title: "AI Smart Parking Search",
    image: null,
    description:
      "An AI-powered search tool for ParkMundo that helps customers find the most suitable airport parking based on their travel dates, selected options, preferences, and available parking services.",
    stack: ["Next JS", "qwen30b AI Model"],
  },
  {
    title: "Lokamer",
    image: null,
    description:
      "A housing management platform that helps Indonesian landlords manage and maintain their properties, with automated payments and AI-assisted operations.",
    stack: [
      "Next JS",
      "Nest JS",
      "qwen30b AI Model",
      "PostgreSQL",
      "Tailwind CSS",
      "Prisma 9",
    ],
  },
  {
    title: "Content Management System",
    image: null,
    description:
      "An AI-powered workspace for creating social media content around current trends, with a focus on stronger audience engagement.",
    stack: ["Next JS", "qwen8b AI Model", "PostgreSQL", "Tailwind CSS"],
  },
  {
    title: "Smart Class Management",
    image: null,
    description:
      "A classroom reservation and attendance system for teachers and students, using image recognition to check room availability and record attendance.",
    stack: [
      "Laravel",
      "Vue.js",
      "Tailwind CSS",
      "PostgreSQL",
      "Python",
      "YOLOv8",
    ],
  },
  {
    title: "PWEB E-commerce",
    image: null,
    description:
      "A course capstone exploring a simple e-commerce journey, from browsing products through checkout.",
    stack: ["HTML", "CSS", "jQuery", "MySQL", "Bootstrap"],
    preview: "https://github.com/MipanZuu/FP-Pweb-IUP-",
    source: "https://github.com/MipanZuu/FP-Pweb-IUP-",
  },
  {
    title: "SawadiKap",
    image: null,
    description:
      "A language-learning platform inspired by Duolingo for Javanese, Sundanese, Malay, and Indonesian.",
    stack: ["Laravel", "Tailwind CSS", "MySQL"],
    preview: "https://github.com/MipanZuu/MPPL-SawadiKap",
    source: "https://github.com/MipanZuu/MPPL-SawadiKap",
  },
  {
    title: "Cerebrum FK UNAIR",
    image: null,
    description:
      "An assessment platform built with a three-person team to help a student organization evaluate first-semester students.",
    stack: ["Laravel", "Tailwind CSS", "MySQL"],
    preview: "http://raporkaderisasicerebrum.pro/",
  },
  {
    title: "Laundry Management",
    image: null,
    description:
      "A full-stack database management capstone for handling customers, services, orders, and operations.",
    stack: ["PHP", "MySQL", "Bootstrap"],
    source: "https://github.com/MipanZuu/LaundryMBDfinal",
  },
  {
    title: "Portfolio V2",
    image: null,
    description:
      "My second portfolio iteration, created while learning component-driven interface development with React.",
    stack: ["React", "Tailwind CSS"],
    source: "https://github.com/MipanZuu/react-portofolio",
  },
  {
    title: "Portfolio V1",
    image: null,
    description:
      "The first version of my personal portfolio and an early exploration of responsive web programming.",
    stack: ["HTML", "Bootstrap", "JavaScript"],
    preview: "http://dentabramasta.xyz",
  },
  {
    title: "Basic Media Schooling",
    image: null,
    description:
      "An event website made collaboratively during the Basic Media Schooling seminar.",
    stack: ["HTML", "CSS", "JavaScript"],
    source: "https://github.com/MipanZuu/BMS-Website/tree/main/BMS",
  },
  {
    title: "Discover Bromo",
    image: null,
    description:
      "A visual travel page celebrating Mount Bromo, made as a Dicoding basic web programming capstone.",
    stack: ["HTML", "CSS", "JavaScript"],
    source: "https://github.com/MipanZuu/Bromo-Website/tree/main/bromo%202",
  },
];
