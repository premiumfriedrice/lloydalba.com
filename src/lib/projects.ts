import { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "apted",
    name: "apted",
    description:
      "Resume tailoring Chrome extension with a custom LLM harness, LLM-as-judge validation, and PII scrubbing.",
    skills: ["Next.js", "Supabase", "Fly.io", "Stripe", "LaTeX"],
    period: "May 2026 – Present",
    status: "current",
  },
  {
    slug: "aggiedine",
    name: "AggieDine",
    description:
      "Social dining app for Texas A&M students — scale-to-zero AWS backend serving up to 70k students at $0 idle.",
    skills: ["Python", "AWS", "React Native"],
    period: "Jan. 2026 – May 2026",
    status: "past",
  },
  {
    slug: "cortex",
    name: "CORTEX",
    description:
      "AR + CV airport travel ecosystem — AR anchors to relocate set-down items, CV to detect bags on carousels.",
    skills: ["Swift", "ARKit", "CoreML", "OpenCV", "Node.js"],
    period: "Jan. 2026",
    status: "past",
  },
  {
    slug: "findmoto",
    name: "findMoto",
    description:
      "Selenium scraper that ranks Facebook Marketplace motorcycle listings by price, model year, and recency.",
    skills: ["Python", "Selenium", "Notion API", "Cron"],
    period: "Mar. 2025 – Jun. 2025",
    status: "past",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
