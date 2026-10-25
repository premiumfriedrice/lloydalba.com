"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "home", label: "Lloyd Alba" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
];

const PITCH = 24; // row height + gap

export default function Side() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const index = Math.max(
    0,
    SECTIONS.findIndex((s) => s.id === active)
  );

  return (
    <aside className="side">
      <nav
        className="stack"
        aria-label="Sections"
        style={{ transform: `translateY(${(1 - index) * PITCH}px)` }}
      >
        {SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={active === id ? "title on" : "title"}
            aria-current={active === id ? "true" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
