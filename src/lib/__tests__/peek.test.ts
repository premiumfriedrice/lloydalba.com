import { describe, it, expect } from "vitest";
import { peekHtml } from "@/lib/markdown";

describe("peekHtml", () => {
  it("turns links into spans so the preview can sit inside a row link", () =>
    expect(peekHtml('<p>see <a href="/x" class="ref">x</a></p>')).toBe("<p>see <span>x</span></p>"));
  it("leaves other markup alone", () => expect(peekHtml("<p><em>a</em></p>")).toBe("<p><em>a</em></p>"));
});
