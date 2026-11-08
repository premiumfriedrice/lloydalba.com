"use client";

import { useEffect, useState } from "react";
import type { TocEntry } from "@/lib/markdown";

const Chevron = () => (
  <svg className="toc-chevron" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M3.5 2 6.5 5 3.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** "On this page" list for a thought, with the section you're reading marked. */
export function PostToc({ toc }: { toc: TocEntry[] }) {
  const [here, setHere] = useState<{ section: string | null; sub: string | null }>({
    section: null,
    sub: null,
  });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      const atEnd =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      let section: string | null = null;
      for (const entry of toc) {
        const el = document.getElementById(entry.id);
        if (el && el.getBoundingClientRect().top <= line) section = entry.id;
      }
      if (atEnd && toc.length) section = toc[toc.length - 1].id;

      let sub: string | null = null;
      const entry = toc.find((e) => e.id === section);
      for (const child of entry?.children ?? []) {
        const el = document.getElementById(child.id);
        if (el && el.getBoundingClientRect().top <= line) sub = child.id;
      }

      setHere((prev) => (prev.section === section && prev.sub === sub ? prev : { section, sub }));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [toc]);

  if (!toc.length) return null;

  return (
    <ol aria-label="On this page" className="toc">
      {toc.map((entry, i) => {
        const active = here.section === entry.id;
        if (!entry.children.length) {
          return (
            <li key={entry.id} style={{ "--i": i } as React.CSSProperties}>
              <a href={`#${entry.id}`} aria-current={active ? "location" : undefined}>
                {entry.title}
              </a>
            </li>
          );
        }
        return (
          <li
            key={entry.id}
            className="toc-item"
            data-open={active ? "" : undefined}
            data-here={active ? "" : undefined}
            style={{ "--i": i } as React.CSSProperties}
          >
            <a
              className="toc-head"
              href={`#${entry.id}`}
              aria-current={active && !here.sub ? "location" : undefined}
            >
              <span>{entry.title}</span>
              <Chevron />
            </a>
            <div className="toc-group">
              <div>
                <ul className="toc-children">
                  {entry.children.map((child, j) => (
                    <li key={child.id} style={{ "--j": j } as React.CSSProperties}>
                      <a
                        href={`#${child.id}`}
                        aria-current={here.sub === child.id ? "location" : undefined}
                        tabIndex={active ? undefined : -1}
                      >
                        {child.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
