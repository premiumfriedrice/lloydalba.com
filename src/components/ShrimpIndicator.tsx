"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Shrimp } from "@/components/Shrimp";

const KEY = "shrimp-y";

/** The section being read (from the page's side links), else the current page in the nav. */
function activeLink(rail: HTMLElement): HTMLElement | null {
  return (
    rail.querySelector<HTMLElement>('.toc a[aria-current="location"]') ??
    rail.querySelector<HTMLElement>('.nav a[aria-current="page"]')
  );
}

/**
 * Sits beside whatever is active in the side rail: the current page, or on a post
 * or project page, the section being read. The rail remounts on every page, so the
 * last position is kept in sessionStorage and the shrimp slides on from there.
 */
export function ShrimpIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  const targetY = () => {
    const el = ref.current;
    const rail = el?.parentElement;
    const link = rail && activeLink(rail);
    if (!el || !rail || !link) return null;
    const r = link.getBoundingClientRect();
    return Math.round(r.top + r.height / 2 - rail.getBoundingClientRect().top - el.offsetHeight / 2);
  };

  const place = (y: number) => {
    if (ref.current) ref.current.style.transform = `translateY(${y}px)`;
    try {
      sessionStorage.setItem(KEY, String(y));
    } catch {}
  };

  // First placement: start where the previous page left the shrimp, then slide.
  useLayoutEffect(() => {
    const el = ref.current;
    const target = targetY();
    if (!el || target === null) return;
    let prev = NaN;
    try {
      prev = Number(sessionStorage.getItem(KEY) ?? NaN);
    } catch {}
    el.dataset.ready = "";
    if (Number.isNaN(prev) || prev === target) {
      place(target);
      el.dataset.moving = "";
      return;
    }
    el.style.transform = `translateY(${prev}px)`;
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.dataset.moving = "";
        place(target);
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
      const y = targetY();
      if (y !== null && ref.current?.dataset.moving !== undefined) place(y);
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
