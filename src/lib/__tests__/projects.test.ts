import { describe, it, expect } from "vitest";
import path from "path";
import { loadProjects, withDiagram } from "@/lib/projects";

const dir = path.join(__dirname, "fixtures/projects");
const all = loadProjects(dir);
const by = (s: string) => all.find((p) => p.slug === s)!;

describe("loadProjects", () => {
  it("sorts by start desc with present (end null) first on ties", () =>
    expect(all.map((p) => p.slug)).toEqual(["nodiagram", "ok", "missingsvg"]));
  it("reads frontmatter and inlines the svg", () => {
    expect(by("ok")).toMatchObject({
      title: "Ok",
      stack: ["A", "B"],
      end: "2026-05",
      bullets: ["one", "two"],
      diagramCaption: "How it flows",
      links: { github: "https://example.com" },
    });
    expect(by("ok").diagramSvg).toMatch(/^<svg/);
    expect(by("ok").taglineHtml).toBe("Does a thing. <em>2x faster</em>");
    expect(by("ok").toc[0].title).toBe("What it does");
  });
  it("tolerates no diagram and a missing svg file", () => {
    expect(by("nodiagram").diagramSvg).toBeNull();
    expect(by("nodiagram").end).toBeNull();
    expect(by("nodiagram").links).toEqual({});
    expect(by("missingsvg").diagramSvg).toBeNull();
  });
  it("skips README.md", () => expect(all.some((p) => p.slug === "README")).toBe(false));
});

describe("withDiagram", () => {
  it("inserts the figure between the lede and the first section", () => {
    const html = withDiagram(by("ok"));
    expect(html).toMatch(/<\/div><figure id="system" class="diagram"><svg/);
    expect(html).toMatch(/Fig\. 1 · How it flows<\/figcaption><\/figure><section/);
  });
  it("returns the html unchanged without a diagram", () =>
    expect(withDiagram(by("nodiagram"))).toBe(by("nodiagram").html));
});
