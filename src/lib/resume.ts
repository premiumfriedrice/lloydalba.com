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
    "My name is Lloyd. I study Computer Science at Texas A&M University with an anticipated graduation of December 2027. I like making things, and I am interested in AI and Distributed Systems, and the intersection of the two. I love to eat shrimp, and I love combat sports, so I put a mantis shrimp on this website because I feel like it combines two things I enjoy very much.",
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
        "Deployed on-prem vLLM inference server (FP8 Qwen3-8B) serving 16 engineers’ workloads at zero marginal cost.",
        "Secured with per-app API keys, VPN-only access, ufw, and Caddy TLS via internal CA; no public exposure.",
        "Built OpenTelemetry pipeline and FastAPI/PostgreSQL dashboard for latency, GPU health, and per-key usage.",
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
