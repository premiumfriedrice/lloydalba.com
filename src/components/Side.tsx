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

  const sectionIds = SECTIONS.map((s) => s.id);
  const subIds = SECTIONS.flatMap((s) => s.subs.map((sub) => sub.id));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (sectionIds.includes(entry.target.id)) {
            setActive(entry.target.id);
          } else if (subIds.includes(entry.target.id)) {
            setActiveSub(entry.target.id);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const id of [...sectionIds, ...subIds]) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* keep the active title pinned at the center of the sidebar */
  useLayoutEffect(() => {
    const stack = stackRef.current;
    const el = activeRef.current;
    if (!stack || !el) return;
    stack.style.transform = desktop
      ? `translateY(${stack.offsetHeight / 2 - el.offsetTop - 22}px)` // 22 = half of 44px title
      : "none";
  }, [active, desktop]);

  return (
    <aside className="side">
      <nav
        className="stack"
        ref={stackRef}
        aria-label="Sections"
      >
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
