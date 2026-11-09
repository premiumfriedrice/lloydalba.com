import { SITE_URL } from "@/lib/site";
import type { Resume, Education, Experience } from "@/lib/resume";
import type { Project } from "@/lib/projects";
import type { Writing } from "@/lib/writings";

export interface ExportInput {
  resume: Resume;
  projects: Project[];
  writings: Writing[];
}

export interface ResumeJson {
  name: string;
  title: string;
  email: string;
  links: Resume["links"];
  summary: string;
  education: Education;
  skills: string[];
  experience: Experience[];
  projects: {
    slug: string;
    name: string;
    tagline: string;
    stack: string[];
    start: string;
    end: string | null;
    period: string;
    url: string;
    links: Record<string, string>;
    bullets: string[];
  }[];
  writing: { slug: string; title: string; date: string; url: string }[];
}

const projectUrl = (slug: string) => `${SITE_URL}/projects/${slug}`;
const writingUrl = (slug: string) => `${SITE_URL}/writings/${slug}`;
const host = SITE_URL.replace(/^https?:\/\//, "");
/** Root-relative markdown links become absolute so the file reads correctly off-site. */
const absolutize = (markdown: string) => markdown.replace(/\]\(\//g, `](${SITE_URL}/`);

export function resumeJson({ resume, projects, writings }: ExportInput): ResumeJson {
  return {
    name: resume.name,
    title: resume.title,
    email: resume.email,
    links: resume.links,
    summary: absolutize(resume.summary),
    education: resume.education,
    skills: resume.skills,
    experience: resume.experience,
    projects: projects.map((p) => ({
      slug: p.slug,
      name: p.title,
      tagline: p.tagline,
      stack: p.stack,
      start: p.start,
      end: p.end,
      period: p.period,
      url: projectUrl(p.slug),
      links: p.links,
      bullets: p.bullets,
    })),
    writing: writings.map((w) => ({
      slug: w.slug,
      title: w.title,
      date: w.dateISO,
      url: writingUrl(w.slug),
    })),
  };
}

export function resumeMarkdown({ resume, projects, writings }: ExportInput): string {
  const { education: ed } = resume;
  const out: string[] = [
    `# ${resume.name}`,
    resume.title,
    [
      resume.email,
      resume.links.github.replace(/^https?:\/\//, ""),
      resume.links.linkedin.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      host,
    ].join(" · "),
    "",
    "## Summary",
    absolutize(resume.summary),
    "",
    "## Education",
    `**${ed.school}**, ${ed.location}`,
    `${ed.degree}, expected ${ed.expected}`,
    `Coursework: ${ed.coursework.join(", ")}`,
    "",
    "## Technical skills",
    resume.skills.join(", "),
    "",
    "## Experience",
  ];
  for (const e of resume.experience) {
    out.push(`### ${e.title} · ${e.company}`, e.period, ...e.bullets.map((b) => `- ${b}`), "");
  }
  out.push("## Projects");
  for (const p of projects) {
    out.push(
      `### ${p.title}${p.stack.length ? ` · ${p.stack.join(", ")}` : ""}`,
      `${p.period} · ${projectUrl(p.slug)}`,
      ...p.bullets.map((b) => `- ${b}`),
      "",
    );
  }
  out.push("## Writings");
  for (const w of writings) out.push(`- ${w.dateISO || w.date} · ${w.title} · ${writingUrl(w.slug)}`);
  out.push("");
  return out.join("\n");
}

export function llmsTxt({ resume, projects, writings }: ExportInput): string {
  const out: string[] = [
    `# ${resume.name}`,
    "",
    `> ${resume.title}. This site is the source of truth about me: resume, projects with system diagrams, and writing. Agents should start with the markdown resume.`,
    "",
    "## Resume",
    "",
    `- [resume.md](${SITE_URL}/resume.md): full resume as markdown, preferred for agents`,
    `- [resume.json](${SITE_URL}/resume.json): the same data as JSON`,
    `- [Resume](${SITE_URL}/resume): the HTML page`,
    "",
    "## Projects",
    "",
    ...projects.map((p) => `- [${p.title}](${projectUrl(p.slug)}): ${p.tagline.replace(/\*/g, "")}`),
    "",
    "## Writings",
    "",
    ...writings.map((w) => `- [${w.title}](${writingUrl(w.slug)}): ${w.dateISO || w.date}`),
    "",
  ];
  return out.join("\n");
}
