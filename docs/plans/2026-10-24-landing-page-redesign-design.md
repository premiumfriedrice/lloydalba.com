# Landing Page Redesign — Design Document

## Goal

Completely restart the personal site with a fresh landing page that blends the clean editorial system of [Anatomy](https://skills.wheresryan.sh/anatomy) with the functional, object-focused language of a Braun/Dieter Rams tribute. The old dark theme, animated background, graph-heavy hero, and existing components are discarded.

## Site Map

- `/` — Landing page (this document)
- `/projects` — Project index/detail (to be redesigned separately)
- `/about` — About / experience page (to be redesigned separately)

`/thoughts` is removed as a separate page. Writing may be folded into the landing page later if needed.

## Visual System

**Palette**
- Ground: `#f8f7f4` — warm museum-paper white
- Ink: `#171717` — near-black
- Secondary text: `#6f6d69` — warm grey
- Rules / cards: `#e8e6e1`
- Accent: `#c06a35` — warm ochre, used sparingly for active states, section numbers, and the live-status dot

**Typography**
- Body / UI: `Bricolage Grotesque` (distinctive sans with character)
- Accents / serif: `EB Garamond` italic for section index numbers, captions, and pull quotes
- Body size: `15px / 1.55`
- Labels: `12px`
- Hero name: `44px` with tight tracking

**Texture**
- Faint paper-grain overlay at ~3% opacity
- Hairline horizontal rules between sections
- No gradients, glassmorphism, or animated backgrounds

## Landing Page Sections

1. **Top bar** — fixed, minimal. Left: “Lloyd Alba.” Right: “About,” “Projects.” Collapses to a menu button on mobile.
2. **Hero** — large but quiet. Name, one-line description, live status readout, icon links (GitHub, LinkedIn, email, resume).
3. **Featured object** — a single project card treated as a museum exhibit: screenshot, title, one-line description, and a spec line (`Role · Stack · Year · Link`). This replaces the old graph as the centerpiece.
4. **Selected work** — tight grid of project cards. Each card has a 4:3 thumbnail, title, short description, year, and tags. Hover lifts the image slightly.
5. **About teaser** — short paragraph plus “More about me” link. Optional current focus facts.
6. **Contact / colophon** — email CTA, social links, built-with note, last-updated date.

## Motion & Responsive Behavior

- Page load: CSS-only staggered fade-up (masthead → hero → sections).
- Hover: links underline; nav shifts to ink; card images lift `3px`; transitions under `250ms`.
- Desktop: fixed top bar; large screens show a sticky left rail with section anchors and reading-progress indicator.
- Mobile: single-column layout; nav becomes a simple bottom sheet or inline dropdown.
- Respect `prefers-reduced-motion`.

## Tech Notes

- Stack: Next.js 16 App Router, Tailwind 4, React 19, TypeScript.
- Theme tokens live in CSS variables.
- No new dependencies unless a component strictly requires one.
- Existing reusable data helpers (`lib/projects.ts`, etc.) may be reused only if they fit the new design; otherwise rewrite.

## Out of Scope

- Redesign of `/projects` and `/about` pages (covered in separate plans).
- Dark mode toggle.
- Reuse of `GraphExplorer`, `FlowField`, GitHub heatmap, or status indicator in their current form.
