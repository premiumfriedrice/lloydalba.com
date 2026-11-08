"use client";

import { useLayoutEffect, useRef } from "react";
import { Shrimp } from "@/components/Shrimp";

const KEY = "shrimp-y";

/**
 * Sits beside the active link in the side nav. The rail remounts on every page,
 * so the last position is kept in sessionStorage and the shrimp slides from there.
 */
export function ShrimpIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const nav = el?.parentElement;
    const active = nav?.querySelector<HTMLElement>('a[aria-current="page"]');
    if (!el || !nav || !active) return;

    const target = active.getBoundingClientRect().top - nav.getBoundingClientRect().top;
    let prev: number | null = null;
    try {
      const v = sessionStorage.getItem(KEY);
      prev = v === null ? null : Number(v);
    } catch {}
    try {
      sessionStorage.setItem(KEY, String(target));
    } catch {}

    const place = (y: number) => (el.style.transform = `translateY(${y}px)`);
    if (prev === null || prev === target || Number.isNaN(prev)) {
      place(target);
      el.dataset.ready = "";
      return;
    }
    place(prev);
    el.dataset.ready = "";
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        el.dataset.moving = "";
        place(target);
      }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div ref={ref} className="shrimp" aria-hidden="true">
      <Shrimp />
    </div>
  );
}
