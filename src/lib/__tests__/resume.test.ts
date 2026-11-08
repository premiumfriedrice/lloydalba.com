import { describe, it, expect } from "vitest";
import { resume } from "@/lib/resume";

const all = JSON.stringify(resume);

describe("resume data", () => {
  it("has five jobs, three bullets for the current one and two for the rest", () => {
    expect(resume.experience).toHaveLength(5);
    expect(resume.experience[0].bullets).toHaveLength(3);
    expect(resume.experience[0].bullets[0]).toMatch(/^Deployed on-prem vLLM inference server/);
    for (const e of resume.experience.slice(1)) expect(e.bullets).toHaveLength(2);
  });
  it("current role has end null and YYYY-MM start", () => {
    expect(resume.experience[0]).toMatchObject({ company: "Fable Innovations", start: "2026-10", end: null });
  });
  it("carries no phone or personal location", () => {
    expect(all).not.toMatch(/512-|Round Rock/);
    expect(all.split("College Station").length - 1).toBe(1);
  });
  it("has contact essentials", () => {
    expect(resume.email).toBe("lloyddalba@gmail.com");
    expect(resume.links.site).toBe("https://www.lloydalba.com");
    expect(resume.skills[0]).toBe("Python");
    expect(resume.education.coursework).toContain("Database Systems");
  });
});
