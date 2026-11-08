"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Shrimp } from "@/components/Shrimp";

const KEY = "shrimp";

type Saved = { y: number; page: string };

/** The section being read (from the page's side links), else the current page in the nav. */
function activeLink(rail: HTMLElement): HTMLElement | null {
  return (
    rail.querySelector<HTMLElement>('.toc a[aria-current="location"]') ??
    rail.querySelector<HTMLElement>('.nav a[aria-current="page"]')
  );
}

/** Where the shrimp should sit, relative to the rail, to line up with the active link. */
function targetY(el: HTMLElement): number | null {
  const rail = el.parentElement;
  const link = rail && activeLink(rail);
  if (!rail || !link) return null;
  const r = link.getBoundingClientRect();
  return Math.round(r.top + r.height / 2 - rail.getBoundingClientRect().top - el.offsetHeight / 2);
}

/** The nav item for this page, e.g. "/projects" on /projects and on /projects/apted. */
function navPage(el: HTMLElement): string {
  return el.parentElement?.querySelector('.nav a[aria-current="page"]')?.getAttribute("href") ?? "";
}

function place(el: HTMLElement, y: number) {
  el.style.transform = `translateY(${y}px)`;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ y, page: navPage(el) } satisfies Saved));
  } catch {}
}

/**
 * Sits beside whatever is active in the side rail: the current page, or on a post
 * or project page, the section being read. The rail remounts on every page, so the
 * last position is kept in sessionStorage and the shrimp slides on from there.
 */
export function ShrimpIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  // First placement: if the last page was under a different nav item, start where the
  // shrimp was and slide over. Within the same nav item (a project and the Projects
  // list, say) it is already home, so it just appears.
  useLayoutEffect(() => {
    const el = ref.current;
    const target = el && targetY(el);
    if (!el || target === null) return;
    let prev: Saved | null = null;
    try {
      prev = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as Saved | null;
    } catch {}
    el.dataset.ready = "";
    if (!prev || typeof prev.y !== "number" || prev.page === navPage(el) || prev.y === target) {
      place(el, target);
      // Turn sliding on only after this position has been painted, or the browser animates the placement itself.
      const frame = requestAnimationFrame(() => (el.dataset.moving = ""));
      return () => cancelAnimationFrame(frame);
    }
    el.style.transform = `translateY(${prev.y}px)`;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.dataset.moving = "";
        place(el, target);
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  // Follow the side links as the reader scrolls and sections open and close.
  useEffect(() => {
    const rail = ref.current?.parentElement;
    if (!rail) return;
    const timers = new Set<number>();
    const follow = () => {
      const el = ref.current;
      if (!el || el.dataset.moving === undefined) return;
      const y = targetY(el);
      if (y !== null) place(el, y);
    };
    const schedule = () => {
      requestAnimationFrame(follow);
      const t = window.setTimeout(() => {
        follow();
        timers.delete(t);
      }, 340); // after a section's sub-links finish opening
      timers.add(t);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(rail, { subtree: true, attributes: true, attributeFilter: ["aria-current", "data-open"] });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div ref={ref} className="shrimp" aria-hidden="true">
      <Shrimp />
    </div>
  );
}
