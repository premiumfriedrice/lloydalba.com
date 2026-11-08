import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdown, type TocEntry } from "@/lib/markdown";

export interface Writing {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  html: string;
  toc: TocEntry[];
  readTime: string;
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

/** "Nov 5, 2026" → "2026-11-05"; anything unparseable → "". */
export function toISODate(date: string): string {
  const t = new Date(date);
  return isNaN(t.getTime()) ? "" : t.toISOString().slice(0, 10);
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
  if (!fs.existsSync(writingsDir)) return [];

  const items = fs
    .readdirSync(writingsDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(writingsDir, file), "utf8");
      const { data, content } = matter(raw);
      const { html, toc } = renderMarkdown(content);

      return {
        slug,
        title: data.title || slug,
        date: data.date ?? "",
        dateISO: toISODate(String(data.date ?? "")),
        html,
        toc,
        readTime: readTimeFor(content),
      };
    });
  return sortWritings(items);
}

export function getWritingBySlug(slug: string): Writing | undefined {
  return getAllWritings().find((w) => w.slug === slug);
}
