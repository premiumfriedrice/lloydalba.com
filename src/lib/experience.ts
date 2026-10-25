import { Experience, Education, Achievement } from "@/types";

export const experiences: Experience[] = [
  {
    time: "Oct. 2026 – Present",
    position: "Agentic AI Engineer Intern",
    company: "Fable Innovations",
    bullets: [
      "Building agentic MSP for 4+ business clients on a skill-based architecture to automate IT service workflows.",
      "Deployed on-prem LLM inference platform (vLLM) with per-user rate limits, eliminating external API spend.",
    ],
    skills: ["Python", "vLLM", "LLM agents"],
  },
  {
    time: "May 2026 – Aug. 2026",
    position: "AI Automation Intern",
    company: "K2United",
    bullets: [
      "Saved sales reps 1–2 hrs per account by shipping outreach brief tool backed by 100k-row/day Databricks ETL.",
      "Built AI enablement intake platform turning employee automation requests into tickets, 7 automations shipped.",
    ],
    skills: ["Databricks", "Python", "ETL"],
  },
  {
    time: "Jun. 2025 – Aug. 2025",
    position: "Software Engineer Intern",
    company: "Arrive Logistics",
    companyUrl: "https://www.arrivelogistics.com/",
    bullets: [
      "Fixed recurring failures across 16 CI/CD pipelines with New Relic tagging and Terraform tagging modules.",
      "Migrated user management service to .NET 8 with New Relic, cutting error detection from days to minutes.",
    ],
    skills: ["Terraform", ".NET", "New Relic", "CI/CD"],
  },
  {
    time: "Jun. 2024 – Aug. 2024",
    position: "Software Engineer Intern",
    company: "Arrive Logistics",
    companyUrl: "https://www.arrivelogistics.com/",
    bullets: [
      "Migrated 3 services to YAML CI/CD pipelines and developed pipeline templates for 2 git branching strategies.",
      "Delivered milestones two weeks early by mentoring two interns on pipeline debugging and cloud deployment.",
    ],
    skills: ["YAML", "CI/CD", "Azure DevOps"],
  },
  {
    time: "Jun. 2023 – Aug. 2023",
    position: "Code2College Software Engineer Intern",
    company: "Arrive Logistics",
    companyUrl: "https://www.arrivelogistics.com/",
    bullets: [
      "Cut sprint overhead 14% and saved $38,400/year by automating deployment workflows via a Python CLI feature.",
      "Reduced setup time from 2 days to under 3 minutes for Kubernetes deployed applications by scaffold automation.",
    ],
    skills: ["Python", "Automation", "Kubernetes"],
  },
];

export const education: Education = {
  time: "Anticipated Dec. 2027",
  degree: "B.S. in Computer Science",
  school: "Texas A&M University",
  schoolUrl: "https://www.tamu.edu/",
};

export const achievements: Achievement[] = [
  {
    title: "1st Place Overall",
    event: "TAMUHack 2026 (650+ competitors)",
  },
  {
    title: "1st Place Notion-API",
    event: "Texas A&M Computing Society Build4Good 2025 Hackathon",
  },
  {
    title: "2nd Place arm-challenge",
    event: "TAMUHack 2025 Hackathon",
  },
];

export const skills = {
  languages: ["Python", "Swift", "TypeScript", "Go", "C++", "SQL"],
  platforms: [
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Terraform",
    "CI/CD",
    "React/Next.js",
    "PostgreSQL/Supabase",
  ],
  ai: [
    "LLM agent harnesses",
    "RAG",
    "LLM Evals",
    "vLLM/LiteLLM",
    "ARKit/CoreML",
    "OpenCV",
    "Databricks/Spark",
  ],
};
