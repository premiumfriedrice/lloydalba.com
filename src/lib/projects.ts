import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdown, renderInlineMarkdown, type TocEntry } from "@/lib/markdown";
import { readDiagram, withDiagram, type DiagramTheme } from "@/lib/diagram";

export { withDiagram };

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
  diagramTheme: DiagramTheme;
  bullets: string[];
  html: string;
  toc: TocEntry[];
}

const projectsDir = path.join(process.cwd(), "content", "projects");

function str(v: unknown): string {
  return v == null ? "" : String(v);
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
        ...readDiagram(dir, data),
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

