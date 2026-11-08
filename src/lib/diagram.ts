import fs from "fs";
import path from "path";

export type DiagramTheme = "light" | "dark";

export interface HasDiagram {
  html: string;
  diagramSvg: string | null;
  diagramCaption: string;
  diagramTheme: DiagramTheme;
}

/** Frontmatter `diagram`, `diagramCaption`, `diagramTheme` → the fields above (minus html). */
export function readDiagram(dir: string, data: Record<string, unknown>): Omit<HasDiagram, "html"> {
  const file = data.diagram ? path.join(dir, String(data.diagram)) : null;
  return {
    diagramSvg: file && fs.existsSync(file) ? fs.readFileSync(file, "utf8").trim() : null,
    diagramCaption: data.diagramCaption == null ? "" : String(data.diagramCaption),
    diagramTheme: data.diagramTheme === "dark" ? "dark" : "light",
  };
}

/** The post HTML with the system diagram inserted before the first section. */
export function withDiagram(item: HasDiagram): string {
  if (!item.diagramSvg) return item.html;
  const figure =
    `<figure id="system" class="diagram" data-theme="${item.diagramTheme}">${item.diagramSvg}` +
    `<button type="button" class="diagram-toggle" aria-label="Switch diagram style">` +
    `<span class="to-dark">Dark</span><span class="to-light">Light</span></button>` +
    `<figcaption class="diagram-cap">Fig. 1 · ${item.diagramCaption}</figcaption></figure>`;
  const i = item.html.indexOf("<section");
  return i === -1 ? item.html + figure : item.html.slice(0, i) + figure + item.html.slice(i);
}
