"use client";

import { useEffect } from "react";

/** Flips a system diagram between its light and black styles. */
export function DiagramToggle() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest(".diagram-toggle");
      const figure = button?.closest<HTMLElement>(".diagram");
      if (!figure) return;
      figure.dataset.theme = figure.dataset.theme === "dark" ? "light" : "dark";
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);
  return null;
}
