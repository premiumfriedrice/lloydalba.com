import { describe, it, expect } from "vitest";
import { homeLists } from "@/lib/home";

describe("homeLists", () => {
  it("takes three of each", () =>
    expect(homeLists([1, 2, 3, 4], ["a", "b", "c", "d"])).toEqual({ projects: [1, 2, 3], writings: ["a", "b", "c"] }));
  it("shows writings as soon as one is published, hides them when there are none", () => {
    expect(homeLists([1], ["a"]).writings).toEqual(["a"]);
    expect(homeLists([1], []).writings).toBeNull();
    expect(homeLists([], ["a", "b"]).projects).toEqual([]);
  });
});
