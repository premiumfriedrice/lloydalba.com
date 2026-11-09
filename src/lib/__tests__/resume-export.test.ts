import { describe, it, expect } from "vitest";
import { resumeJson, resumeMarkdown, llmsTxt } from "@/lib/resume-export";
import { resume } from "@/lib/resume";
import type { Project } from "@/lib/projects";
import type { Writing } from "@/lib/writings";

const project: Project = {
  slug: "apted",
  title: "apted",
  tagline: "T",
  taglineHtml: "T",
  period: "May 2026 – Present",
  start: "2026-05",
  end: null,
  stack: ["A"],
  links: { github: "https://g" },
  diagramSvg: null,
  diagramCaption: "",
  bullets: ["b1"],
  html: "",
  toc: [],
};
const writing: Writing = {
  slug: "2026-11-05-x",
  title: "X",
  date: "Nov 5, 2026",
  dateISO: "2026-11-05",
  html: "",
  toc: [],
  readTime: "1 min read",
};
// A summary with a root-relative link, so the link-absolutizing checks don't depend on the real summary's wording.
const linked = { ...resume, summary: "See [the server](/writings/2026-11-05-on-prem-inference-what-we-built)." };
const input = { resume: linked, projects: [project], writings: [writing] };

describe("resumeJson", () => {
  it("mirrors the data and builds www urls", () => {
    const j = resumeJson(input);
    expect(j.experience).toEqual(resume.experience);
    expect(j.projects[0].url).toBe("https://www.lloydalba.com/projects/apted");
    expect(j.projects[0]).toMatchObject({ name: "apted", end: null, bullets: ["b1"], links: { github: "https://g" } });
    expect(j.writing[0]).toEqual({
      slug: "2026-11-05-x",
      title: "X",
      date: "2026-11-05",
      url: "https://www.lloydalba.com/writings/2026-11-05-x",
    });
    expect(JSON.stringify(j)).not.toMatch(/512-|Round Rock|location":"(?!College)/);
    expect(j.summary).toContain("](https://www.lloydalba.com/writings/");
  });
});

describe("resumeMarkdown", () => {
  it("has every bullet, heading order, and no location line", () => {
    const md = resumeMarkdown(input);
    for (const e of resume.experience) for (const b of e.bullets) expect(md).toContain(`- ${b}`);
    expect(md.indexOf("## Summary")).toBeLessThan(md.indexOf("## Education"));
    expect(md).toContain("### Agentic AI Engineer Intern · Fable Innovations\nOct. 2026 – Present");
    expect(md).toContain("### apted · A\nMay 2026 – Present · https://www.lloydalba.com/projects/apted\n- b1");
    expect(md).toContain("- 2026-11-05 · X · https://www.lloydalba.com/writings/2026-11-05-x");
    expect(md.split("\n")[0]).toBe("# Lloyd Alba");
    expect(md.split("\n")[1]).toBe("software engineer");
    expect(md).toContain("](https://www.lloydalba.com/writings/2026-11-05-on-prem-inference-what-we-built)");
    expect(md).not.toContain("](/writings/");
    expect(md).not.toMatch(/Round Rock/);
  });
});

describe("llmsTxt", () => {
  it("links the three resume forms, every project, every writing", () => {
    const t = llmsTxt(input);
    expect(t.startsWith("# Lloyd Alba\n")).toBe(true);
    for (const p of ["/resume.md", "/resume.json", "/resume", "/projects/apted", "/writings/2026-11-05-x"])
      expect(t).toContain(`https://www.lloydalba.com${p}`);
  });
});
