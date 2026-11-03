import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";

export interface Thought {
  slug: string;
  title: string;
  date: string;
  html: string;
  readTime: string;
}

const WORDS_PER_MINUTE = 220;
const SECONDS_PER_MEDIA = 12;

const thoughtsDir = path.join(process.cwd(), "content", "thoughts");

/* ---------- media ---------- */

type Node = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
};

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function embedUrl(src: string): string | null {
  const yt = src.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function el(tagName: string, properties: Record<string, unknown>, children: Node[] = []): Node {
  return { type: "element", tagName, properties, children };
}

/** Turn an <img> node into the right media element for its source. */
function toMedia(img: Node): Node {
  const src = String(img.properties?.src ?? "");
  const alt = String(img.properties?.alt ?? "");
  const embed = embedUrl(src);
  if (embed) {
    return el("div", { className: ["embed"] }, [
      el("iframe", {
        src: embed,
        title: alt || "Embedded video",
        loading: "lazy",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowFullScreen: true,
      }),
    ]);
  }
  if (VIDEO_EXT.test(src)) {
    return el("video", {
      src,
      controls: true,
      playsInline: true,
      preload: "metadata",
      ariaLabel: alt || undefined,
    });
  }
  return el("img", { src, alt, loading: "lazy", decoding: "async" });
}

/**
 * Markdown images become media:
 *   ![alt](/media/photo.jpg)              image
 *   ![alt](/media/clip.mp4)               video player
 *   ![alt](https://youtu.be/ID)           YouTube embed (Vimeo too)
 *   ![alt](/media/photo.jpg "A caption")  any of the above, with a caption
 * An image on its own line becomes a full-width <figure>.
 */
function rehypeMedia() {
  return (tree: Node) => {
    visit(tree as never, "element", (node: Node, index, parent: Node | undefined) => {
      if (!parent || index === undefined) return;

      // A paragraph holding a single image becomes a figure.
      if (node.tagName === "p") {
        const kids = (node.children ?? []).filter(
          (c) => !(c.type === "text" && !c.value?.trim()),
        );
        if (kids.length === 1 && kids[0].tagName === "img") {
          const img = kids[0];
          const caption = img.properties?.title ? String(img.properties.title) : "";
          const figure = el("figure", {}, [toMedia(img)]);
          if (caption) figure.children!.push(el("figcaption", {}, [{ type: "text", value: caption }]));
          parent.children![index] = figure;
          return "skip";
        }
        return;
      }

      // Inline images that sit inside text still get video/embed handling.
      if (node.tagName === "img") {
        parent.children![index] = toMedia(node);
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeMedia)
  .use(rehypeStringify);

/* ---------- read time ---------- */

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

/* ---------- loading ---------- */

export function getAllThoughts(): Thought[] {
  if (!fs.existsSync(thoughtsDir)) return [];

  return fs
    .readdirSync(thoughtsDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md")
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(thoughtsDir, file), "utf8");
      const { data, content } = matter(raw);

      return {
        slug,
        title: data.title || slug,
        date: data.date ?? "",
        html: processor.processSync(content).toString(),
        readTime: readTimeFor(content),
      };
    })
    .sort((a, b) => b.slug.localeCompare(a.slug));
}

export function getThoughtBySlug(slug: string): Thought | undefined {
  return getAllThoughts().find((t) => t.slug === slug);
}
