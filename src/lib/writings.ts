import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdown, type TocEntry } from "@/lib/markdown";
import { readDiagram } from "@/lib/diagram";

export interface Writing {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  html: string;
  toc: TocEntry[];
  readTime: string;
  diagramSvg: string | null;
  diagramCaption: string;
}

const WORDS_PER_MINUTE = 220;
const SECONDS_PER_MEDIA = 12;

const writingsDir = path.join(process.cwd(), "content", "writings");

function readTimeFor(markdown: string): string {
  const media = (markdown.match(/!\[[^\]]*\]\([^)]*\)|<(img|video|iframe)\b/g) ?? []).length;
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`[\]()!~|-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = words / WORDS_PER_MINUTE + (media * SECONDS_PER_MEDIA) / 60;
  return `${Math.max(1, Math.round(minutes))} min read`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");

/** "Nov 5, 2026" → "2026-11-05"; anything unparseable → "". Uses local date parts so the build host's timezone cannot shift the day. */
export function toISODate(date: string): string {
  const t = new Date(date);
  if (isNaN(t.getTime())) return "";
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
}

/**
 * Frontmatter `date` as written. A quoted or prose date ("Nov 5, 2026") is a string;
 * an unquoted ISO date (2026-11-05) is parsed by YAML into a Date at UTC midnight.
 * Both become the site's "Mon D, YYYY" string plus an ISO day.
 */
export function normalizeDate(value: unknown): { date: string; dateISO: string } {
  if (value instanceof Date) {
    if (isNaN(value.getTime())) return { date: "", dateISO: "" };
    const y = value.getUTCFullYear();
    const m = value.getUTCMonth();
    const d = value.getUTCDate();
    return { date: `${MONTHS[m]} ${d}, ${y}`, dateISO: `${y}-${pad(m + 1)}-${pad(d)}` };
  }
  const date = value == null ? "" : String(value);
  return { date, dateISO: toISODate(date) };
}

/** Newest first; undated last; ties broken by slug descending. */
export function sortWritings(items: Writing[]): Writing[] {
  return [...items].sort((a, b) => {
    if (a.dateISO !== b.dateISO) {
      if (!a.dateISO) return 1;
      if (!b.dateISO) return -1;
      return b.dateISO.localeCompare(a.dateISO);
    }
    return b.slug.localeCompare(a.slug);
  });
}

export function getAllWritings(): Writing[] {
  return loadWritings(writingsDir);
}

export function loadWritings(dir: string): Writing[] {
  if (!fs.existsSync(dir)) return [];

  const items = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data, content } = matter(raw);
      const { html, toc } = renderMarkdown(content);

      return {
        slug,
        title: data.title || slug,
        ...normalizeDate(data.date),
        html,
        toc,
        readTime: readTimeFor(content),
        ...readDiagram(dir, data),
      };
    });
  return sortWritings(items);
}

export function getWritingBySlug(slug: string): Writing | undefined {
  return getAllWritings().find((w) => w.slug === slug);
}
