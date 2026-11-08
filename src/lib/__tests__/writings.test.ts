import { describe, it, expect } from "vitest";
import { toISODate, normalizeDate, sortWritings, type Writing } from "@/lib/writings";

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
  it("does not shift the day on UTC-positive build hosts", () => {
    // Run under TZ=Asia/Tokyo this fails for a toISOString()-based implementation.
    expect(toISODate("Jan 1, 2026")).toBe("2026-01-01");
    expect(toISODate("Dec 31, 2026")).toBe("2026-12-31");
  });
  it("returns empty for garbage", () => expect(toISODate("soon")).toBe(""));
  it("returns empty for empty", () => expect(toISODate("")).toBe(""));
});

describe("normalizeDate", () => {
  it("turns an unquoted ISO frontmatter date (a Date object) into the site's string form", () =>
    expect(normalizeDate(new Date(Date.UTC(2026, 10, 5)))).toEqual({ date: "Nov 5, 2026", dateISO: "2026-11-05" }));
  it("passes strings through", () =>
    expect(normalizeDate("Nov 5, 2026")).toEqual({ date: "Nov 5, 2026", dateISO: "2026-11-05" }));
  it("handles missing", () => expect(normalizeDate(undefined)).toEqual({ date: "", dateISO: "" }));
});

describe("sortWritings", () => {
  it("newest first, undated last, ties by slug desc", () => {
    const out = sortWritings([w("a", "Oct 1, 2026"), w("b", "soon"), w("c", "Nov 5, 2026"), w("d", "Nov 5, 2026")]);
    expect(out.map((x) => x.slug)).toEqual(["d", "c", "a", "b"]);
  });
});
