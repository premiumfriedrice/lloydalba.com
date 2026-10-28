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
}

const thoughtsDir = path.join(process.cwd(), "content", "thoughts");

export function getAllThoughts(): Thought[] {
  if (!fs.existsSync(thoughtsDir)) return [];

  return fs
    .readdirSync(thoughtsDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(thoughtsDir, file), "utf8");
      const { data, content } = matter(raw);
      const processed = remark().use(html).processSync(content);

      return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        html: processed.toString(),
      };
    })
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getThoughtBySlug(slug: string): Thought | undefined {
  return getAllThoughts().find((t) => t.slug === slug);
}
