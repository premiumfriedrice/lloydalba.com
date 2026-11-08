import { describe, it, expect } from "vitest";
import path from "path";
import { withDiagram } from "@/lib/diagram";
import { loadWritings } from "@/lib/writings";
import { loadProjects } from "@/lib/projects";

const writings = loadWritings(path.join(__dirname, "fixtures/writings"));
const w = (slug: string) => writings.find((x) => x.slug === slug)!;

describe("writings with a diagram", () => {
  it("reads the svg, caption and theme from frontmatter", () => {
    expect(w("2026-01-02-with-diagram")).toMatchObject({ diagramCaption: "The layers", diagramTheme: "dark" });
    expect(w("2026-01-02-with-diagram").diagramSvg).toMatch(/^<svg/);
    expect(w("2026-01-01-plain").diagramSvg).toBeNull();
    expect(w("2026-01-01-plain").diagramTheme).toBe("light");
  });
  it("inserts a themed figure before the first section", () => {
    const html = withDiagram(w("2026-01-02-with-diagram"));
    expect(html).toMatch(/<\/div><figure id="system" class="diagram" data-theme="dark"><svg/);
    expect(html).toMatch(/Fig\. 1 · The layers<\/figcaption><\/figure><section/);
  });
  it("leaves a post without a diagram alone", () =>
    expect(withDiagram(w("2026-01-01-plain"))).toBe(w("2026-01-01-plain").html));
});

describe("projects default to the light theme", () => {
  it("marks project figures light unless told otherwise", () => {
    const ok = loadProjects(path.join(__dirname, "fixtures/projects")).find((p) => p.slug === "ok")!;
    expect(ok.diagramTheme).toBe("light");
    expect(withDiagram(ok)).toContain('<figure id="system" class="diagram" data-theme="light">');
  });
});
