import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { renderMarkdown, type TocEntry } from "@/lib/markdown";

export interface Thought {
  slug: string;
  title: string;
  date: string;
  html: string;
  toc: TocEntry[];
  readTime: string;
}

const WORDS_PER_MINUTE = 220;
const SECONDS_PER_MEDIA = 12;

const thoughtsDir = path.join(process.cwd(), "content", "thoughts");

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

export function getAllThoughts(): Thought[] {
  if (!fs.existsSync(thoughtsDir)) return [];

  return fs
    .readdirSync(thoughtsDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(thoughtsDir, file), "utf8");
      const { data, content } = matter(raw);
      const { html, toc } = renderMarkdown(content);

      return {
        slug,
        title: data.title || slug,
        date: data.date ?? "",
        html,
        toc,
        readTime: readTimeFor(content),
      };
    })
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getThoughtBySlug(slug: string): Thought | undefined {
  return getAllThoughts().find((t) => t.slug === slug);
}
