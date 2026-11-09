import { describe, it, expect } from "vitest";
import path from "path";
import { withDiagram } from "@/lib/diagram";
import { loadWritings } from "@/lib/writings";
import { loadProjects } from "@/lib/projects";

const writings = loadWritings(path.join(__dirname, "fixtures/writings"));
const w = (slug: string) => writings.find((x) => x.slug === slug)!;

describe("writings with a diagram", () => {
  it("reads the svg and caption from frontmatter", () => {
    expect(w("2026-01-02-with-diagram")).toMatchObject({ diagramCaption: "The layers" });
    expect(w("2026-01-02-with-diagram").diagramSvg).toMatch(/^<svg/);
    expect(w("2026-01-01-plain").diagramSvg).toBeNull();
  });
  it("inserts the figure before the first section, with no style switch", () => {
    const html = withDiagram(w("2026-01-02-with-diagram"));
    expect(html).toMatch(/<\/div><figure id="system" class="diagram"><svg/);
    expect(html).not.toMatch(/diagram-toggle|data-theme/);
    expect(html).toMatch(/Fig\. 1 · The layers<\/figcaption><\/figure><section/);
  });
  it("leaves a post without a diagram alone", () =>
    expect(withDiagram(w("2026-01-01-plain"))).toBe(w("2026-01-01-plain").html));
});

describe("project figures", () => {
  it("use the same plain figure", () => {
    const ok = loadProjects(path.join(__dirname, "fixtures/projects")).find((p) => p.slug === "ok")!;
    expect(withDiagram(ok)).toContain('<figure id="system" class="diagram"><svg');
  });
});
