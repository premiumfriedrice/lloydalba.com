"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Shrimp } from "@/components/Shrimp";

/** "y": beside the side rail's links (desktop). "x": above the top nav's links (phones). */
type Axis = "x" | "y";

type Saved = { v: number; page: string };

const key = (axis: Axis) => `shrimp-${axis}`;

/** The section being read (from the page's side links), else the current page in the nav. */
function activeLink(box: HTMLElement): HTMLElement | null {
  return (
    box.querySelector<HTMLElement>('.toc a[aria-current="location"]') ??
    box.querySelector<HTMLElement>('.nav a[aria-current="page"]')
  );
}

/** Where the shrimp should sit, relative to its container, to line up with the active link. */
function target(el: HTMLElement, axis: Axis): number | null {
  const box = el.parentElement;
  const link = box && activeLink(box);
  if (!box || !link) return null;
  const r = link.getBoundingClientRect();
  const b = box.getBoundingClientRect();
  return axis === "y"
    ? Math.round(r.top + r.height / 2 - b.top - el.offsetHeight / 2)
    : Math.round(r.left + r.width / 2 - b.left - el.offsetWidth / 2);
}

/** The nav item for this page, e.g. "/projects" on /projects and on /projects/apted. */
function navPage(el: HTMLElement): string {
  return el.parentElement?.querySelector('.nav a[aria-current="page"]')?.getAttribute("href") ?? "";
}

function move(el: HTMLElement, axis: Axis, v: number) {
  el.style.transform = axis === "y" ? `translateY(${v}px)` : `translateX(${v}px)`;
}

function place(el: HTMLElement, axis: Axis, v: number) {
  move(el, axis, v);
  try {
    sessionStorage.setItem(key(axis), JSON.stringify({ v, page: navPage(el) } satisfies Saved));
  } catch {}
}

/**
 * Sits beside whatever is active in the side rail: the current page, or on a post
 * or project page, the section being read. The rail remounts on every page, so the
 * last position is kept in sessionStorage and the shrimp slides on from there.
 */
export function ShrimpIndicator({ axis = "y" }: { axis?: Axis }) {
  const ref = useRef<HTMLDivElement>(null);

  // First placement: if the last page was under a different nav item, start where the
  // shrimp was and slide over. Within the same nav item (a project and the Projects
  // list, say) it is already home, so it just appears.
  useLayoutEffect(() => {
    const el = ref.current;
    const to = el && target(el, axis);
    if (!el || to === null) return;
    let prev: Saved | null = null;
    try {
      prev = JSON.parse(sessionStorage.getItem(key(axis)) ?? "null") as Saved | null;
    } catch {}
    el.dataset.ready = "";
    if (!prev || typeof prev.v !== "number" || prev.page === navPage(el) || prev.v === to) {
      place(el, axis, to);
      // Turn sliding on only after this position has been painted, or the browser animates the placement itself.
      const frame = requestAnimationFrame(() => (el.dataset.moving = ""));
      return () => cancelAnimationFrame(frame);
    }
    move(el, axis, prev.v);
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.dataset.moving = "";
        place(el, axis, to);
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, [axis]);

  // Follow the side links as the reader scrolls and sections open and close.
  useEffect(() => {
    const rail = ref.current?.parentElement;
    if (!rail) return;
    const timers = new Set<number>();
    const follow = () => {
      const el = ref.current;
      if (!el || el.dataset.moving === undefined) return;
      const v = target(el, axis);
      if (v !== null) place(el, axis, v);
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
  }, [axis]);

  return (
    <div ref={ref} className="shrimp" aria-hidden="true">
      <Shrimp />
    </div>
  );
}
