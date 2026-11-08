import { describe, it, expect } from "vitest";
import { renderInlineMarkdown } from "@/lib/markdown";

describe("renderInlineMarkdown", () => {
  it("drops the paragraph wrapper and keeps em", () =>
    expect(renderInlineMarkdown("AR + CV. *1st overall*")).toBe("AR + CV. <em>1st overall</em>"));
  it("escapes ampersands", () => expect(renderInlineMarkdown("Texas A&M")).toBe("Texas A&#x26;M"));
  it("keeps links", () =>
    expect(renderInlineMarkdown("see [x](/writings/a)")).toBe('see <a href="/writings/a">x</a>'));
});
