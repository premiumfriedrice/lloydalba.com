import { describe, it, expect } from "vitest";
import { homeLists } from "@/lib/home";

describe("homeLists", () => {
  it("takes three of each", () =>
    expect(homeLists([1, 2, 3, 4], ["a", "b", "c", "d"])).toEqual({ projects: [1, 2, 3], writings: ["a", "b", "c"] }));
  it("hides writing when fewer than two", () => {
    expect(homeLists([1], ["a"]).writings).toBeNull();
    expect(homeLists([1], []).writings).toBeNull();
    expect(homeLists([], ["a", "b"]).projects).toEqual([]);
  });
});
