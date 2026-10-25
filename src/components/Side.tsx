"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const SECTIONS = [
  {
    id: "home",
    label: "Lloyd Alba",
    subs: [] as { id: string; label: string }[],
  },
  {
    id: "projects",
    label: "Projects",
    subs: [
      { id: "current", label: "Current" },
      { id: "past", label: "Past" },
    ],
  },
  {
    id: "about",
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
  const [active, setActive] = useState("home");
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [desktop, setDesktop] = useState(false);

  const stackRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const tabsRowRef = useRef<HTMLDivElement>(null);
  const tabsActiveRef = useRef<HTMLAnchorElement>(null);
  const subsRowRef = useRef<HTMLDivElement>(null);
  const subsActiveRef = useRef<HTMLAnchorElement>(null);

  const sectionIds = SECTIONS.map((s) => s.id);
  const subIds = SECTIONS.flatMap((s) => s.subs.map((sub) => sub.id));

  /* Track the active section and subsection from scroll position —
     deterministic, works for instant anchor jumps too */
  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY + window.innerHeight * 0.425;

      let section: string = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) section = id;
        else break;
      }

      let sub: string | null = null;
      for (const id of subIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) sub = id;
        else break;
      }

      setActive((prev) => (prev === section ? prev : section));
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
  }, []);

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
    const center =
      row.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2);
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

  const activeSection =
    SECTIONS.find((s) => s.id === active) ?? SECTIONS[0];

  return (
    <aside className="side">
      {/* Mobile — horizontal tabs, active pinned center, names slide past */}
      <nav className="tabs" aria-label="Sections">
        <div className="tabs-row" ref={tabsRowRef}>
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              ref={active === id ? tabsActiveRef : undefined}
              href={`#${id}`}
              className={active === id ? "tab on" : "tab"}
              aria-current={active === id ? "true" : undefined}
            >
              {label}
            </a>
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
      <nav className="stack" ref={stackRef} aria-label="Sections">
        {SECTIONS.map(({ id, label, subs }) => (
          <div key={id} className="group">
            <a
              ref={active === id ? activeRef : undefined}
              href={`#${id}`}
              className={active === id ? "title on" : "title"}
              aria-current={active === id ? "true" : undefined}
            >
              {label}
            </a>
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
