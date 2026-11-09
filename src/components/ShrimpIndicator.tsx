"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { Shrimp } from "@/components/Shrimp";
import { Mantis } from "@/components/Mantis";
import { setCritter, useCritter } from "@/lib/critter";

/** "y": beside the side rail's links (desktop). "x": above the top nav's links (phones). */
type Axis = "x" | "y";

type Saved = { v: number; page: string };

const key = (axis: Axis) => `shrimp-${axis}`;
const SLIDE_MS = 500; // matches .shrimp[data-moving] transition
const IMPACT_MS = 250; // when the club lands, as a share of the 500ms punch

/** The section being read (from the page's side links), else the current page in the nav. */
function activeLink(box: HTMLElement): HTMLElement | null {
  return (
    box.querySelector<HTMLElement>('.toc a[aria-current="location"]') ??
    box.querySelector<HTMLElement>('.nav a[aria-current="page"]')
  );
}

/** Where the critter should sit, relative to its container, to line up with a link. */
function offsetFor(el: HTMLElement, link: HTMLElement, axis: Axis): number {
  const r = link.getBoundingClientRect();
  const b = el.parentElement!.getBoundingClientRect();
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

/** Restart a CSS animation that is keyed off an attribute or class. */
function restart(node: HTMLElement, on: () => void, off: () => void) {
  off();
  void node.offsetWidth;
  on();
}

/**
 * Sits beside whatever is active in the side rail: the current page, or on a post
 * or project page, the section being read. The rail remounts on every page, so the
 * last position is kept in sessionStorage and the critter slides on from there.
 * As the mantis shrimp, it punches each new section it arrives at and the link wobbles.
 */
export function ShrimpIndicator({ axis = "y" }: { axis?: Axis }) {
  const ref = useRef<HTMLDivElement>(null);
  const critter = useCritter();
  const critterRef = useRef(critter);
  critterRef.current = critter;
  const lastLink = useRef<HTMLElement | null>(null);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  /** After the slide lands, swing at the link and make it wobble. */
  const punchAt = (link: HTMLElement, delay: number) => {
    clearTimers();
    if (critterRef.current !== "mantis") return;
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timers.current.push(
      window.setTimeout(() => {
        restart(el, () => (el.dataset.punch = ""), () => delete el.dataset.punch);
        timers.current.push(
          window.setTimeout(() => {
            restart(link, () => link.classList.add("wobble"), () => link.classList.remove("wobble"));
            link.addEventListener("animationend", () => link.classList.remove("wobble"), { once: true });
          }, IMPACT_MS),
          window.setTimeout(() => delete el.dataset.punch, 520),
        );
      }, delay),
    );
  };

  // First placement: if the last page was under a different nav item, start where the
  // critter was and slide over. Within the same nav item it is already home, so it just appears.
  useLayoutEffect(() => {
    const el = ref.current;
    const link = el?.parentElement && activeLink(el.parentElement);
    if (!el || !link) return;
    const to = offsetFor(el, link, axis);
    lastLink.current = link;
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
        punchAt(link, SLIDE_MS);
      }),
    );
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axis]);

  // Follow the side links as the reader scrolls and sections open and close.
  useEffect(() => {
    const box = ref.current?.parentElement;
    if (!box) return;
    const pending = new Set<number>();
    const follow = () => {
      const el = ref.current;
      if (!el || el.dataset.moving === undefined) return;
      const link = activeLink(box);
      if (!link) return;
      place(el, axis, offsetFor(el, link, axis));
      if (link !== lastLink.current) {
        lastLink.current = link;
        punchAt(link, SLIDE_MS);
      }
    };
    const schedule = () => {
      requestAnimationFrame(follow);
      const t = window.setTimeout(() => {
        follow();
        pending.delete(t);
      }, 340); // after a section's sub-links finish opening
      pending.add(t);
    };
    const observer = new MutationObserver(schedule);
    observer.observe(box, { subtree: true, attributes: true, attributeFilter: ["aria-current", "data-open"] });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", schedule);
      pending.forEach(clearTimeout);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axis]);

  // Swapping animals changes the width, so re-centre on the same link (no punch).
  useEffect(() => {
    const el = ref.current;
    const link = lastLink.current;
    if (el && link && el.dataset.ready !== undefined) place(el, axis, offsetFor(el, link, axis));
  }, [critter, axis]);

  return (
    <div
      ref={ref}
      className="shrimp"
      data-critter={critter}
      aria-hidden="true"
      onClick={() => setCritter(critter === "shrimp" ? "mantis" : "shrimp")}
    >
      {critter === "mantis" ? <Mantis /> : <Shrimp />}
    </div>
  );
}
