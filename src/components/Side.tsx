"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SECTIONS = [
  {
    id: "/",
    label: "Lloyd Alba",
    subs: [] as { id: string; label: string }[],
  },
  {
    id: "/projects",
    label: "Projects",
    subs: [
      { id: "current", label: "Current" },
      { id: "past", label: "Past" },
    ],
  },
  {
    id: "/about",
    label: "About",
    subs: [
      { id: "experience", label: "Experience" },
      { id: "education", label: "Education" },
      { id: "skills", label: "Skills" },
      { id: "recognition", label: "Recognition" },
    ],
  },
];

export default function Side() {
  const pathname = usePathname();
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [desktop, setDesktop] = useState(false);

  const active = SECTIONS.some((s) => s.id === pathname) ? pathname : "/";
  const activeSection = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  const stackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const tabsRowRef = useRef<HTMLDivElement>(null);
  const tabsActiveRef = useRef<HTMLAnchorElement>(null);
  const subsRowRef = useRef<HTMLDivElement>(null);
  const subsActiveRef = useRef<HTMLAnchorElement>(null);

  /* scroll-spy for the current page's subsections */
  useEffect(() => {
    const subs = activeSection.subs;
    if (subs.length === 0) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY + window.innerHeight * 0.425;

      let sub: string | null = null;
      for (const s of subs) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= y) sub = s.id;
        else break;
      }
      /* the first subsection is active from the top of the page */
      if (!sub || !subs.some((s) => s.id === sub)) {
        sub = subs[0].id;
      }

      setActiveSub((prev) => (prev === sub ? prev : sub));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [activeSection]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* pin the active name at the center of a horizontal row */
  const pinRow = (row: HTMLElement | null, el: HTMLElement | null) => {
    if (!row) return;
    if (!el) {
      row.style.transform = "translateX(0)";
      return;
    }
    const center = row.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2);
    row.style.transform = `translateX(${center}px)`;
  };

  useLayoutEffect(() => {
    const stack = stackRef.current;
    const el = activeRef.current;

    if (desktop) {
      if (stack && el) {
        stack.style.transform = `translateY(${
          stack.offsetHeight / 2 - el.offsetTop - 22
        }px)`;
      }
      pinRow(tabsRowRef.current, null);
      pinRow(subsRowRef.current, null);
    } else {
      if (stack) stack.style.transform = "none";
      pinRow(tabsRowRef.current, tabsActiveRef.current);
      pinRow(subsRowRef.current, subsActiveRef.current);
    }
  }, [active, activeSub, desktop]);

  return (
    <aside className="side">
      {/* Mobile — horizontal tabs, active pinned center, names slide past */}
      <nav className="tabs" aria-label="Pages">
        <div className="tabs-row" ref={tabsRowRef}>
          {SECTIONS.map(({ id, label }) => (
            <Link
              key={id}
              href={id}
              ref={active === id ? tabsActiveRef : undefined}
              className={active === id ? "tab on" : "tab"}
              aria-current={active === id ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </div>
        {activeSection.subs.length > 0 && (
          <div className="tabs-subs" ref={subsRowRef}>
            {activeSection.subs.map((sub) => (
              <a
                key={sub.id}
                ref={activeSub === sub.id ? subsActiveRef : undefined}
                href={`#${sub.id}`}
                className={activeSub === sub.id ? "sub on" : "sub"}
              >
                {sub.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Desktop — vertical stack, active pinned center */}
      <nav className="stack" ref={stackRef} aria-label="Pages">
        {SECTIONS.map(({ id, label, subs }) => (
          <div key={id} className="group">
            <Link
              href={id}
              ref={active === id ? activeRef : undefined}
              className={active === id ? "title on" : "title"}
              aria-current={active === id ? "page" : undefined}
            >
              {label}
            </Link>
            {active === id && subs.length > 0 && (
              <div className="subs">
                {subs.map((sub) => (
                  <a
                    key={sub.id}
                    href={`#${sub.id}`}
                    className={activeSub === sub.id ? "sub on" : "sub"}
                  >
                    {sub.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
