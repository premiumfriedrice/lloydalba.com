import { describe, it, expect } from "vitest";
import { toISODate, sortWritings, type Writing } from "@/lib/writings";

const w = (slug: string, date: string): Writing => ({
  slug,
  title: slug,
  date,
  dateISO: toISODate(date),
  html: "",
  toc: [],
  readTime: "1 min read",
});

describe("toISODate", () => {
  it("parses the site's date format", () => expect(toISODate("Nov 5, 2026")).toBe("2026-11-05"));
  it("returns empty for garbage", () => expect(toISODate("soon")).toBe(""));
  it("returns empty for empty", () => expect(toISODate("")).toBe(""));
});

describe("sortWritings", () => {
  it("newest first, undated last, ties by slug desc", () => {
    const out = sortWritings([w("a", "Oct 1, 2026"), w("b", "soon"), w("c", "Nov 5, 2026"), w("d", "Nov 5, 2026")]);
    expect(out.map((x) => x.slug)).toEqual(["d", "c", "a", "b"]);
  });
});
