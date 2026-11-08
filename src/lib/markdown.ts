/**
 * Markdown → HTML in the Anatomy doc system.
 *
 *   intro paragraphs            → <div class="lede">
 *   ## Heading                  → numbered <section> with a ruled head, listed in the side TOC
 *   ### Heading                 → sub-entry under its section in the side TOC
 *   ```lang title="file.ext"    → code card with a filename head and copy button
 *   > quote  /  > — Source      → serif pull quote with a cite line
 *   text[^1] … [^1]: note       → margin note on wide screens, notes list on mobile
 *   ![alt](/media/x.jpg "cap")  → figure (images, video files, YouTube/Vimeo)
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { visit, SKIP } from "unist-util-visit";
import { toString } from "hast-util-to-string";
import type { Root as HRoot, Element, ElementContent, RootContent, Properties } from "hast";
import type { Root as MRoot } from "mdast";
import type { VFile } from "vfile";

export interface TocEntry {
  id: string;
  title: string;
  children: { id: string; title: string }[];
}

/* ---------- helpers ---------- */

function h(tagName: string, properties: Properties = {}, children: ElementContent[] = []): Element {
  return { type: "element", tagName, properties, children };
}
const text = (value: string) => ({ type: "text" as const, value });
const isEl = (n: RootContent | ElementContent | undefined, tag?: string): n is Element =>
  !!n && n.type === "element" && (!tag || n.tagName === tag);
const isBlank = (n: RootContent | ElementContent) => n.type === "text" && !n.value.trim();
const classes = (el: Element): string[] => {
  const c = el.properties?.className;
  return Array.isArray(c) ? c.map(String) : typeof c === "string" ? c.split(" ") : [];
};

function slugger() {
  const seen = new Map<string, number>();
  return (value: string) => {
    const base =
      value
        .toLowerCase()
        .replace(/<[^>]+>/g, "")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-") || "section";
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n ? `${base}-${n}` : base;
  };
}

const COPY_ICON: Element = h("span", { className: ["copy-icon"], ariaHidden: "true" }, [
  h(
    "svg",
    { className: ["copy-icon-copy"], viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.3", strokeLinecap: "round", strokeLinejoin: "round" },
    [
      h("rect", { x: "5.5", y: "5.5", width: "8", height: "8", rx: "2" }),
      h("path", { d: "M10.5 3.5v-.5a1.5 1.5 0 0 0-1.5-1.5H4A1.5 1.5 0 0 0 2.5 3v5A1.5 1.5 0 0 0 4 9.5h.5" }),
    ],
  ),
  h(
    "svg",
    { className: ["copy-icon-check"], viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" },
    [h("path", { d: "M3.5 8.5 6.5 11.5 12.5 4.5", pathLength: "1" })],
  ),
]);
const copyButton = () =>
  h("button", { type: "button", className: ["copy"], ariaLabel: "Copy" }, [structuredClone(COPY_ICON)]);

/* ---------- remark: keep the code fence's meta (title="…") through raw HTML parsing ---------- */

function remarkCodeMeta() {
  return (tree: MRoot) => {
    visit(tree, "code", (node) => {
      if (!node.meta) return;
      node.data = { ...node.data, hProperties: { ...(node.data?.hProperties ?? {}), dataMeta: node.meta } };
    });
  };
}

/* ---------- media ---------- */

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

function embedUrl(src: string): string | null {
  const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

function toMedia(img: Element): Element {
  const src = String(img.properties?.src ?? "");
  const alt = String(img.properties?.alt ?? "");
  const embed = embedUrl(src);
  if (embed) {
    return h("div", { className: ["embed"] }, [
      h("iframe", {
        src: embed,
        title: alt || "Embedded video",
        loading: "lazy",
        allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
        allowFullScreen: true,
      }),
    ]);
  }
  if (VIDEO_EXT.test(src)) {
    return h("video", { src, controls: true, playsInline: true, preload: "metadata", ariaLabel: alt || undefined });
  }
  return h("img", { src, alt, loading: "lazy", decoding: "async" });
}

function rehypeMedia() {
  return (tree: HRoot) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === undefined) return;
      if (node.tagName === "p") {
        const kids = node.children.filter((c) => !isBlank(c));
        if (kids.length === 1 && isEl(kids[0], "img")) {
          const img = kids[0];
          const caption = img.properties?.title ? String(img.properties.title) : "";
          const figure = h("figure", {}, [toMedia(img)]);
          if (caption) figure.children.push(h("figcaption", {}, [text(caption)]));
          parent.children[index] = figure;
          return SKIP;
        }
        return;
      }
      if (node.tagName === "img") parent.children[index] = toMedia(node);
    });
  };
}

/* ---------- code cards ---------- */

function titleFromMeta(meta: string): string {
  const quoted = meta.match(/title=["']([^"']+)["']/);
  if (quoted) return quoted[1];
  return meta.trim().split(/\s+/)[0] ?? "";
}

function rehypeCodeCards() {
  return (tree: HRoot) => {
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === undefined || node.tagName !== "pre") return;
      const code = node.children.find((c) => isEl(c, "code")) as Element | undefined;
      if (!code) return;

      const meta = String(code.properties?.dataMeta ?? "");
      delete code.properties.dataMeta;
      const title = meta ? titleFromMeta(meta) : "";
      const multiline = toString(code).replace(/\n$/, "").includes("\n");

      const props: Properties = { className: ["code"] };
      if (title) props.dataHead = "";
      if (multiline) props.dataMulti = "";

      const card = h("div", props, []);
      if (title) {
        card.children.push(h("div", { className: ["code-head"] }, [h("span", {}, [text(title)]), copyButton()]));
        card.children.push(h("pre", {}, [code]));
      } else {
        card.children.push(h("pre", {}, [code]), copyButton());
      }
      parent.children[index] = card;
      return SKIP;
    });
  };
}

/* ---------- pull quotes ---------- */

function rehypePullQuotes() {
  return (tree: HRoot) => {
    visit(tree, "element", (node) => {
      if (node.tagName !== "blockquote") return;
      const paras = node.children.filter((c): c is Element => isEl(c, "p"));
      if (!paras.length) return;

      // A last line starting with "—" or "--" becomes the cite.
      let cite: Element | null = null;
      const last = paras[paras.length - 1];
      const first = last.children[0];
      if (first?.type === "text" && /^\s*(—|--)\s*/.test(first.value)) {
        first.value = first.value.replace(/^\s*(—|--)\s*/, "");
        cite = h("cite", {}, last.children);
        paras.pop();
      }

      const body: ElementContent[] = [];
      paras.forEach((p, i) => {
        if (i) body.push(h("br"), h("br"));
        body.push(...p.children);
      });
      if (cite) body.push(cite);
      node.properties = { ...node.properties, className: ["pull"] };
      node.children = body;
    });
  };
}

/* ---------- footnotes → margin notes ---------- */

function rehypeSideNotes() {
  return (tree: HRoot) => {
    const sectionIdx = tree.children.findIndex((c) => isEl(c, "section") && c.properties?.dataFootnotes !== undefined);
    if (sectionIdx < 0) return;
    const section = tree.children[sectionIdx] as Element;

    const notes = new Map<string, ElementContent[]>();
    visit(section, "element", (li) => {
      if (li.tagName !== "li" || !li.properties?.id) return;
      const content: ElementContent[] = [];
      li.children.forEach((c) => {
        if (!isEl(c)) return;
        const inline = c.tagName === "p" ? c.children : [c];
        if (content.length) content.push(text(" "));
        content.push(...inline);
      });
      // Drop the "↩" back-links GFM adds.
      const cleaned = content.filter((c) => !(isEl(c, "a") && c.properties?.dataFootnoteBackref !== undefined));
      const tail = cleaned[cleaned.length - 1];
      if (tail?.type === "text") tail.value = tail.value.trimEnd();
      notes.set(String(li.properties.id), cleaned);
      return SKIP;
    });
    tree.children.splice(sectionIdx, 1);

    const order: string[] = [];
    visit(tree, "element", (node, index, parent) => {
      if (!parent || index === undefined || node.tagName !== "sup") return;
      const a = node.children.find((c) => isEl(c, "a") && c.properties?.dataFootnoteRef !== undefined) as Element | undefined;
      if (!a) return;
      const target = String(a.properties.href ?? "").replace(/^#/, "");
      const content = notes.get(target);
      if (!content) return;
      if (!order.includes(target)) order.push(target);
      const n = String(order.indexOf(target) + 1);
      parent.children.splice(
        index,
        1,
        h("a", { className: ["ref"], href: `#note-${n}`, id: `ref-${n}`, ariaLabel: `Note ${n}` }, [text(n)]),
        h("span", { className: ["side"], role: "note" }, [h("span", { ariaHidden: "true" }, [text(n)]), ...structuredClone(content)]),
      );
      return index + 2;
    });

    if (order.length) {
      tree.children.push(
        h(
          "ol",
          { className: ["notes"], ariaLabel: "Notes" },
          order.map((id, i) =>
            h("li", { id: `note-${i + 1}` }, [h("span", {}, [text(String(i + 1))]), h("span", {}, structuredClone(notes.get(id)!))]),
          ),
        ),
      );
    }
  };
}

/* ---------- tables ---------- */

function rehypeTables() {
  return (tree: HRoot) => {
    visit(tree, "element", (node) => {
      if (node.tagName === "table") node.properties = { ...node.properties, className: ["table"] };
    });
  };
}

/* ---------- sections + TOC ---------- */

function rehypeSections() {
  return (tree: HRoot, file: VFile) => {
    const slug = slugger();
    const toc: TocEntry[] = [];
    const out: RootContent[] = [];
    const lede = h("div", { className: ["lede"] });
    let current: Element | null = null;
    let notes: RootContent | null = null;

    for (const node of tree.children) {
      const el = node.type === "element" ? (node as Element) : null;
      if (el?.tagName === "ol" && classes(el).includes("notes")) {
        notes = node;
        continue;
      }
      if (el?.tagName === "h2") {
        const title = toString(el).trim();
        const id = slug(title);
        toc.push({ id, title, children: [] });
        el.properties = {};
        current = h("section", { id, className: ["section"], dataSection: "" }, [
          h("div", { className: ["section-head"] }, [
            el,
            h("span", { className: ["section-index"], ariaHidden: "true" }, [text(String(toc.length).padStart(2, "0"))]),
          ]),
        ]);
        out.push(current);
        continue;
      }
      if (el && (el.tagName === "h3" || el.tagName === "h4")) {
        const title = toString(el).trim();
        const id = slug(title);
        el.properties = { ...el.properties, id };
        if (el.tagName === "h3" && current) toc[toc.length - 1].children.push({ id, title });
      }
      if (current) current.children.push(node as ElementContent);
      else if (!isBlank(node as ElementContent)) lede.children.push(node as ElementContent);
    }

    if (lede.children.length) out.unshift(lede);
    if (notes) out.push(notes);
    tree.children = out;
    file.data.toc = toc;
  };
}

/* ---------- pipeline ---------- */

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkCodeMeta)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeRaw)
  .use(rehypeHighlight, { detect: false })
  .use(rehypeCodeCards)
  .use(rehypePullQuotes)
  .use(rehypeSideNotes)
  .use(rehypeMedia)
  .use(rehypeTables)
  .use(rehypeSections)
  .use(rehypeStringify);

export function renderMarkdown(markdown: string): { html: string; toc: TocEntry[] } {
  const file = processor.processSync(markdown);
  return { html: String(file), toc: (file.data.toc as TocEntry[]) ?? [] };
}

const inlineProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeStringify);

/** One line of markdown (a tagline, a summary) → inline HTML with no <p> wrapper. */
export function renderInlineMarkdown(markdown: string): string {
  const html = String(inlineProcessor.processSync(markdown)).trim();
  return html.replace(/^<p>([\s\S]*)<\/p>$/, "$1");
}

/** Post HTML for a hover preview inside a row link: nested <a> is invalid, so links become spans. */
export function peekHtml(html: string): string {
  return html.replace(/<a\b[^>]*>/g, "<span>").replace(/<\/a>/g, "</span>");
}
