"use client";

import { useEffect, useRef } from "react";

/* A dancing cat that rises from the bottom edge once the page is fully scrolled. */
export function BottomCat() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => el.toggleAttribute("data-in", e.isIntersecting),
      { threshold: 0.95 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="cat" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/cat.gif" alt="" width={100} height={107} loading="lazy" />
    </div>
  );
}
