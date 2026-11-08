import { SITE_URL } from "@/lib/site";

export interface Experience {
  title: string;
  company: string;
  start: string; // YYYY-MM
  end: string | null; // YYYY-MM, null = present
  period: string;
  bullets: string[];
}

export interface Education {
  school: string;
  location: string;
  degree: string;
  expected: string;
  coursework: string[];
}

export interface Resume {
  name: string;
  title: string;
  email: string;
  links: { github: string; linkedin: string; site: string };
  /** One paragraph of markdown; may contain links. */
  summary: string;
  education: Education;
  skills: string[];
  experience: Experience[];
}

export const resume: Resume = {
  name: "Lloyd Alba",
  title: "software engineer",
  email: "lloyddalba@gmail.com",
  links: {
    github: "https://github.com/premiumfriedrice",
    linkedin: "https://www.linkedin.com/in/lloydalba/",
    site: SITE_URL,
  },
  summary:
    "CS at Texas A&M, graduating December 2027. Right now I'm an agentic AI engineer intern at Fable Innovations, where I [built and run an on-prem inference server](/writings/2026-11-05-on-prem-inference-what-we-built) for a team of twelve. Before that I shipped sales automations at K2United and fixed CI/CD at Arrive Logistics across three summers.",
  education: {
    school: "Texas A&M University",
    location: "College Station, Texas",
    degree: "Bachelor of Science in Computer Science",
    expected: "December 2027",
    coursework: [
      "Data Structures & Algorithms",
      "Design & Analysis of Algorithms",
      "Database Systems",
      "Computer Systems",
      "Software Engineering",
      "Computer Organization",
      "Programming Languages",
      "Linear Algebra",
      "Statistics",
    ],
  },
  skills: [
    "Python",
    "Swift",
    "AWS",
    "Docker",
    "vLLM/LiteLLM",
    "ARKit/CoreML",
    "C++",
    "TypeScript",
    "Azure",
    "Kubernetes",
    "LLM agent harnesses",
    "OpenCV",
    "SQL",
    "React/Next.js",
    "Terraform",
    "Linux/Bash",
    "RAG",
    "Databricks/Spark",
    "Go",
    "REST APIs",
    "CI/CD",
    "Git",
    "LLM Evals",
    "PostgreSQL/Supabase",
  ],
  experience: [
    {
      title: "Agentic AI Engineer Intern",
      company: "Fable Innovations",
      start: "2026-10",
      end: null,
      period: "Oct. 2026 – Present",
      bullets: [
        "Building agentic MSP for 4+ business clients on a skill-based architecture to automate IT service workflows.",
        "Deployed on-prem LLM inference platform (vLLM) with per-user rate limits, eliminating external API spend.",
      ],
    },
    {
      title: "AI Automation Intern",
      company: "K2United",
      start: "2026-05",
      end: "2026-08",
      period: "May 2026 – Aug. 2026",
      bullets: [
        "Saved sales reps 1–2 hrs per account by shipping outreach brief tool backed by 100k-row/day Databricks ETL.",
        "Built AI enablement intake platform turning employee automation requests into tickets, 7 automations shipped.",
      ],
    },
    {
      title: "Software Engineer Intern",
      company: "Arrive Logistics",
      start: "2025-06",
      end: "2025-08",
      period: "Jun. 2025 – Aug. 2025",
      bullets: [
        "Fixed recurring failures across 16 CI/CD pipelines with New Relic tagging and Terraform tagging modules.",
        "Migrated user management service to .NET 8 with New Relic, cutting error detection from days to minutes.",
      ],
    },
    {
      title: "Software Engineer Intern",
      company: "Arrive Logistics",
      start: "2024-06",
      end: "2024-08",
      period: "Jun. 2024 – Aug. 2024",
      bullets: [
        "Migrated 3 services to YAML CI/CD pipelines and developed pipeline templates for 2 git branching strategies.",
        "Delivered milestones two weeks early by mentoring two interns on pipeline debugging and cloud deployment.",
      ],
    },
    {
      title: "Code2College Software Engineer Intern",
      company: "Arrive Logistics",
      start: "2023-06",
      end: "2023-08",
      period: "Jun. 2023 – Aug. 2023",
      bullets: [
        "Cut sprint overhead 14% and saved $38,400/year by automating deployment workflows via a Python CLI feature.",
        "Reduced setup time from 2 days to under 3 minutes for Kubernetes deployed applications by scaffold automation.",
      ],
    },
  ],
};
