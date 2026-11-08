"use client";

import { useEffect } from "react";

/** Wires up the copy buttons on code cards rendered from markdown. */
export function CodeCopy() {
  useEffect(() => {
    const timers = new Set<number>();
    const onClick = async (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest<HTMLButtonElement>(".code .copy");
      if (!button) return;
      const pre = button.closest(".code")?.querySelector("pre");
      if (!pre) return;
      try {
        await navigator.clipboard.writeText(pre.textContent?.replace(/\n$/, "") ?? "");
      } catch {
        return;
      }
      const icon = button.querySelector(".copy-icon");
      button.setAttribute("data-done", "");
      icon?.setAttribute("data-done", "");
      button.setAttribute("aria-label", "Copied");
      const t = window.setTimeout(() => {
        button.removeAttribute("data-done");
        icon?.removeAttribute("data-done");
        button.setAttribute("aria-label", "Copy");
        timers.delete(t);
      }, 1400);
      timers.add(t);
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      timers.forEach((t) => clearTimeout(t));
    };
  }, []);
  return null;
}
