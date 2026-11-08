import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdown, renderInlineMarkdown, type TocEntry } from "@/lib/markdown";

export interface Project {
  slug: string;
  title: string;
  /** One line of markdown; `*em*` marks the metric. */
  tagline: string;
  taglineHtml: string;
  period: string;
  start: string; // YYYY-MM
  end: string | null; // YYYY-MM, null = present
  stack: string[];
  links: Record<string, string>;
  diagramSvg: string | null;
  diagramCaption: string;
  bullets: string[];
  html: string;
  toc: TocEntry[];
}

const projectsDir = path.join(process.cwd(), "content", "projects");

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function readDiagram(dir: string, file: unknown): string | null {
  if (!file) return null;
  const p = path.join(dir, String(file));
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8").trim() : null;
}

/** Newest start first; on a tie, the one still running (end null) first, then later end first. */
function compare(a: Project, b: Project): number {
  if (a.start !== b.start) return b.start.localeCompare(a.start);
  return (b.end ?? "9999").localeCompare(a.end ?? "9999");
}

export function loadProjects(dir: string): Project[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file): Project => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf8"));
      const { html, toc } = renderMarkdown(content);
      const tagline = str(data.tagline);
      return {
        slug,
        title: str(data.title) || slug,
        tagline,
        taglineHtml: renderInlineMarkdown(tagline),
        period: str(data.period),
        start: str(data.start),
        end: data.end ? String(data.end) : null,
        stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
        links: data.links && typeof data.links === "object" ? (data.links as Record<string, string>) : {},
        diagramSvg: readDiagram(dir, data.diagram),
        diagramCaption: str(data.diagramCaption),
        bullets: Array.isArray(data.bullets) ? data.bullets.map(String) : [],
        html,
        toc,
      };
    })
    .sort(compare);
}

export function getAllProjects(): Project[] {
  return loadProjects(projectsDir);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

/** The post HTML with the system diagram inserted before the first section. */
export function withDiagram(project: Project): string {
  if (!project.diagramSvg) return project.html;
  const figure =
    `<figure id="system" class="diagram">${project.diagramSvg}` +
    `<figcaption class="diagram-cap">Fig. 1 · ${project.diagramCaption}</figcaption></figure>`;
  const i = project.html.indexOf("<section");
  return i === -1 ? project.html + figure : project.html.slice(0, i) + figure + project.html.slice(i);
}
