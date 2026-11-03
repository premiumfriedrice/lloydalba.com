import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export interface Thought {
  slug: string;
  title: string;
  date: string;
  html: string;
  readTime: string;
}

const WORDS_PER_MINUTE = 220;

function readTimeFor(markdown: string): string {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`;
}

const thoughtsDir = path.join(process.cwd(), "content", "thoughts");

export function getAllThoughts(): Thought[] {
  if (!fs.existsSync(thoughtsDir)) return [];

  return fs
    .readdirSync(thoughtsDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(thoughtsDir, file), "utf8");
      const { data, content } = matter(raw);
      const processed = remark().use(html).processSync(content);

      return {
        slug,
        title: data.title || slug,
        date: data.date ?? "",
        html: processed.toString(),
        readTime: readTimeFor(content),
      };
    })
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getThoughtBySlug(slug: string): Thought | undefined {
  return getAllThoughts().find((t) => t.slug === slug);
}
