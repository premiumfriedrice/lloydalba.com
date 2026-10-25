"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

const SECTIONS = ["home", "projects", "thoughts", "misc"] as const;
type Section = (typeof SECTIONS)[number];

const N = SECTIONS.length;
const STEP = 90;
const SNAP_MS = 480;
const EASE = "cubic-bezier(.22,.75,.2,1)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const mod = (a: number, n: number) => ((a % n) + n) % n;
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(REDUCED_QUERY).matches;

export default function DialSite() {
  const [section, setSection] = useState(0); // content shown
  const [labelSel, setLabelSel] = useState(0); // label under the needle (live)

  const dialRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLDivElement>(null);
  const rotation = useRef(0); // face rotation, degrees (may accumulate)
  const current = useRef(-1); // settled section index
  const drag = useRef({
    active: false,
    moved: false,
    suppressClick: false,
    lastA: 0,
    lastDetent: 0,
    downX: 0,
    downY: 0,
    downLabel: -1,
  });

  const visualRotation = useCallback(() => {
    const face = faceRef.current;
    if (!face) return 0;
    const t = getComputedStyle(face).transform;
    const m =
      t && t !== "none"
        ? new DOMMatrixReadOnly(t)
        : new DOMMatrixReadOnly();
    return (Math.atan2(m.b, m.a) * 180) / Math.PI;
  }, []);

  const apply = useCallback((r: number, animate: boolean) => {
    const face = faceRef.current;
    if (!face) return;
    rotation.current = r;
    face.style.transition =
      animate && !prefersReducedMotion()
        ? `transform ${SNAP_MS}ms ${EASE}`
        : "none";
    face.style.transform = `rotate(${r}deg)`;
  }, []);

  const sectionFor = useCallback(
    (r: number) => mod(Math.round(-r / STEP), N),
    []
  );

  const show = useCallback((i: number) => {
    if (i !== current.current) {
      current.current = i;
      setSection(i);
      setLabelSel(i);
      window.scrollTo(0, 0);
    }
    history.replaceState(null, "", `#${SECTIONS[i]}`);
  }, []);

  /* shortest-path turn to section i */
  const turnTo = useCallback(
    (i: number) => {
      if (!drag.current.active) {
        rotation.current = Math.round(visualRotation() * 1000) / 1000;
      }
      const target = -i * STEP;
      let delta = mod(target - rotation.current, 360);
      if (delta > 180) delta -= 360;
      apply(rotation.current + delta, true);
      show(i);
    },
    [apply, show, visualRotation]
  );

  /* --- drag --- */
  const angleOf = (e: ReactPointerEvent) => {
    const r = dialRef.current!.getBoundingClientRect();
    return (
      (Math.atan2(
        e.clientY - (r.top + r.height / 2),
        e.clientX - (r.left + r.width / 2)
      ) *
        180) /
      Math.PI
    );
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const d = drag.current;
    d.active = true;
    d.moved = false;
    d.suppressClick = false;
    d.downX = e.clientX;
    d.downY = e.clientY;
    const label = (e.target as HTMLElement).closest(".label");
    d.downLabel = label
      ? Number((label as HTMLElement).dataset.i)
      : -1;
    rotation.current = Math.round(visualRotation() * 1000) / 1000;
    d.lastA = angleOf(e);
    d.lastDetent = Math.round(rotation.current / STEP);
    faceRef.current!.style.transition = "none";
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    e.preventDefault();
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    if (
      !d.moved &&
      Math.hypot(e.clientX - d.downX, e.clientY - d.downY) > 8
    ) {
      d.moved = true;
    }
    const a = angleOf(e);
    const delta = mod(a - d.lastA + 180, 360) - 180;
    rotation.current += delta;
    d.lastA = a;
    faceRef.current!.style.transform = `rotate(${rotation.current}deg)`;
    const det = Math.round(rotation.current / STEP);
    if (det !== d.lastDetent) {
      d.lastDetent = det;
      if ("vibrate" in navigator) navigator.vibrate(6);
    }
    setLabelSel((prev) => (prev === sectionFor(rotation.current) ? prev : sectionFor(rotation.current)));
  };

  const endDrag = () => {
    const d = drag.current;
    if (!d.active) return;
    d.active = false;
    if (d.moved) {
      d.suppressClick = true;
      const snapped = Math.round(rotation.current / STEP) * STEP;
      apply(snapped, true);
      show(sectionFor(snapped));
    } else if (d.downLabel >= 0) {
      d.suppressClick = true; // handled here; swallow the follow-up click
      turnTo(d.downLabel);
    }
  };

  /* keep the rotation number small once a snap settles */
  useEffect(() => {
    const face = faceRef.current;
    if (!face) return;
    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName !== "transform" || drag.current.active) return;
      const n = mod(Math.round(rotation.current), 360);
      rotation.current = n;
      face.style.transition = "none";
      face.style.transform = `rotate(${n}deg)`;
    };
    face.addEventListener("transitionend", onEnd);
    return () => face.removeEventListener("transitionend", onEnd);
  }, []);

  /* --- keyboard + manual hash edits --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      drag.current.suppressClick = false;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        turnTo(
          mod(current.current + (e.key === "ArrowRight" ? 1 : -1), N)
        );
      }
    };
    const onHash = () => {
      const i = SECTIONS.indexOf(
        location.hash.slice(1) as Section
      );
      if (i >= 0 && i !== current.current) turnTo(i);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("hashchange", onHash);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("hashchange", onHash);
    };
  }, [turnTo]);

  /* --- init from location.hash, before paint --- */
  useLayoutEffect(() => {
    const i0 = Math.max(
      0,
      SECTIONS.indexOf(location.hash.slice(1) as Section)
    );
    apply(-i0 * STEP, false);
    // Syncing state from the URL — an external system — on first paint,
    // before the browser paints, to avoid a flash of the wrong section.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    show(i0);
  }, [apply, show]);

  return (
    <>
      <main>
        {section === 0 && (
          <section className="sec" key="home">
            <h1>Lloyd Alba</h1>
            <p className="sub">
              Software engineer — AI agents, iOS, and tooling that makes
              engineers faster.
            </p>
            <p className="sub dim">
              Texas A&amp;M, class of 2027 · College Station, Texas
            </p>
            <nav className="pills" aria-label="Links">
              <a
                className="pill"
                href="https://github.com/premiumfriedrice"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a
                className="pill"
                href="https://www.linkedin.com/in/lloydalba/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a className="pill" href="mailto:lloyddalba@gmail.com">
                Email
              </a>
            </nav>
          </section>
        )}

        {section === 1 && (
          <section className="sec" key="projects">
            <h2>Projects</h2>
            <article className="entry">
              <h3>Pupil</h3>
              <p>
                Agentic AI framework that shadows engineers during live
                workflows, learns patterns through observation, and executes
                learned tasks on its own.
              </p>
            </article>
            <article className="entry">
              <h3>AggieDine</h3>
              <p>
                Social dining platform for Texas A&amp;M students —
                microservices backend, AWS Cognito, leading a team of six.
              </p>
            </article>
            <article className="entry">
              <h3>ima</h3>
              <p>
                Habit and task tracking for iOS, built in SwiftUI as an
                alternative to subscription productivity tools.
              </p>
            </article>
            <article className="entry">
              <h3>findMoto</h3>
              <p>
                Facebook Marketplace scraper tuned for finding the best
                motorcycle deals.
              </p>
            </article>
          </section>
        )}

        {section === 2 && (
          <section className="sec" key="thoughts">
            <h2>Thoughts</h2>
            <ul className="rows">
              <li className="row">
                <span>On building in public</span>
                <span className="note">Mar 2026</span>
              </li>
              <li className="row">
                <span>Notes from shipping Pupil</span>
                <span className="note">Feb 2026</span>
              </li>
              <li className="row">
                <span>Why I keep rewriting side projects</span>
                <span className="note">Jan 2026</span>
              </li>
              <li className="row">
                <span>Hello, world</span>
                <span className="note">Dec 2025</span>
              </li>
            </ul>
          </section>
        )}

        {section === 3 && (
          <section className="sec" key="misc">
            <h2>Misc</h2>
            <ul className="rows">
              <li className="row">
                <span>Editor</span>
                <span className="note">Cursor</span>
              </li>
              <li className="row">
                <span>Terminal</span>
                <span className="note">zsh · tmux</span>
              </li>
              <li className="row">
                <span>Keyboard</span>
                <span className="note">HHKB Studio</span>
              </li>
              <li className="row">
                <span>Currently</span>
                <span className="note">Shipping Pupil</span>
              </li>
              <li className="row">
                <span>Status</span>
                <span className="note">Open to internships</span>
              </li>
            </ul>
          </section>
        )}
      </main>

      <div
        className="dial"
        ref={dialRef}
        role="group"
        aria-label="Section dial"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onContextMenu={(e) => e.preventDefault()}
      >
        <div className="face" ref={faceRef}>
          {Array.from({ length: 60 }, (_, i) => (
            <i
              key={i}
              className={`tick ${i % 5 === 0 ? "major" : "minor"}`}
              style={{ transform: `rotate(${i * 6}deg)` }}
            />
          ))}
          {SECTIONS.map((name, i) => (
            <button
              key={name}
              type="button"
              data-i={i}
              className={`label${i === labelSel ? " on" : ""}`}
              style={{ "--th": `${i * STEP}deg` } as CSSProperties}
              aria-current={i === labelSel ? "true" : undefined}
              onClick={() => {
                if (drag.current.suppressClick) return;
                turnTo(i);
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <div className="needle" aria-hidden="true" />
        <div className="hub" aria-hidden="true" />
      </div>
    </>
  );
}
