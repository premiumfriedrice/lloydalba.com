# Landing Page Redesign Implementation Plan

> **REQUIRED SUB-SKILL:** Use the executing-plans skill to implement this plan task-by-task.

**Goal:** Build a clean-slate landing page that blends Anatomy’s editorial layout with Braun/Dieter Rams object-focused minimalism.

**Architecture:** Replace the dark, animation-heavy landing page with a light-theme, type-driven layout. Keep Next.js 16 App Router, Tailwind 4, and React 19. Reuse existing project data helpers; discard old visual components.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Lucide React, Google Fonts (Bricolage Grotesque + EB Garamond).

---

### Task 1: Theme tokens and layout shell

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Steps:**
1. Replace `globals.css` with a light-theme stylesheet using CSS variables:
   - `--ground: #f8f7f4`, `--ink: #171717`, `--muted: #6f6d69`, `--rule: #e8e6e1`, `--accent: #c06a35`, `--well: #ffffff`.
   - Add faint paper-grain overlay.
   - Add fade-up keyframes and `.animate-fade-up` utility with stagger delays.
2. Update `layout.tsx`:
   - Load `Bricolage Grotesque` (400, 500, 600) and `EB Garamond` (400 italic, 500 italic) via `next/font/google`.
   - Remove `FlowField`, old `Nav`, and old `Footer` imports.
   - Render a minimal shell: top bar placeholder, `<main>{children}</main>`, footer placeholder.

**Verification:**
- Run: `npm run lint`
- Expected: no new errors in modified files

**Commit:** `git add src/app/globals.css src/app/layout.tsx && git commit -m "feat: add light theme tokens and layout shell"`

---

### Task 2: Top navigation and footer

**Files:**
- Create: `src/components/Nav.tsx`
- Create: `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx`

**Steps:**
1. Create `Nav.tsx`:
   - Fixed top bar with left name and right links (About, Projects).
   - Mobile: menu button that reveals a dropdown/sheet with the same links.
   - Use Lucide `Menu` and `X` icons.
2. Create `Footer.tsx`:
   - Simple colophon: email link, social icons, built-with note, copyright year.
3. Wire both into `layout.tsx`.

**Verification:**
- Run: `npm run lint`
- Expected: passes

**Commit:** `git add src/components/Nav.tsx src/components/Footer.tsx src/app/layout.tsx && git commit -m "feat: add nav and footer"`

---

### Task 3: Shared landing components

**Files:**
- Create: `src/components/SectionHeader.tsx`
- Create: `src/components/ProjectCard.tsx`
- Create: `src/components/IconLink.tsx`

**Steps:**
1. `SectionHeader`: displays `index` number (EB Garamond italic), `title`, and a hairline rule.
2. `ProjectCard`: 4:3 thumbnail, title, description, year, skills tags. Hover lifts the image.
3. `IconLink`: accessible external/internal icon link.

**Verification:**
- Run: `npm run lint`
- Expected: passes

**Commit:** `git add src/components/SectionHeader.tsx src/components/ProjectCard.tsx src/components/IconLink.tsx && git commit -m "feat: add shared landing components"`

---

### Task 4: Landing page sections

**Files:**
- Create: `src/app/sections/Hero.tsx`
- Create: `src/app/sections/FeaturedObject.tsx`
- Create: `src/app/sections/ProjectGrid.tsx`
- Create: `src/app/sections/AboutTeaser.tsx`
- Create: `src/app/sections/ContactColophon.tsx`

**Steps:**
1. `Hero`: name, one-line statement, live status readout, icon links (GitHub, LinkedIn, email, resume).
2. `FeaturedObject`: picks the first project with an image (fallback to first project). Renders a museum-style card with screenshot, title, description, and spec line.
3. `ProjectGrid`: renders up to 4 featured project cards; includes a “View all projects” link.
4. `AboutTeaser`: short paragraph + “More about me” link.
5. `ContactColophon`: email CTA, social links, built-with note.

**Verification:**
- Run: `npm run lint`
- Expected: passes

**Commit:** `git add src/app/sections && git commit -m "feat: add landing page sections"`

---

### Task 5: Assemble landing page

**Files:**
- Modify: `src/app/page.tsx`

**Steps:**
1. Replace `page.tsx` with the assembled landing page:
   - Wrap in a centered column (`max-w-2xl mx-auto` or similar).
   - Import and render Nav is already in layout; render Hero, FeaturedObject, ProjectGrid, AboutTeaser, ContactColophon.
   - Apply fade-up animation classes with stagger delays.

**Verification:**
- Run: `npm run lint`
- Run: `npm run build`
- Expected: both pass

**Commit:** `git add src/app/page.tsx && git commit -m "feat: assemble new landing page"`

---

### Task 6: Clean up old unused files

**Files:**
- Delete: `src/components/FlowField.tsx`
- Delete: `src/components/StatusIndicator.tsx`
- Delete: `src/components/ExperienceCard.tsx`
- Delete: `src/components/ThoughtCard.tsx`
- Delete: `src/components/GitHubHeatmap.tsx`
- Delete: `src/components/ProjectCard.tsx`
- Delete: `src/components/graph/` directory
- Replace: `src/app/about/page.tsx` with a minimal placeholder
- Create: `src/app/projects/page.tsx` minimal placeholder

**Steps:**
1. Delete old components that are no longer imported.
2. Replace `/about` with a placeholder page that links back home.
3. Create `/projects` placeholder page that links back home.

**Verification:**
- Run: `npm run lint`
- Run: `npm run build`
- Expected: both pass

**Commit:** `git add -A && git commit -m "chore: remove old components and add page placeholders"`

---

### Task 7: Run dev server and open in browser

**Files:** none

**Steps:**
1. Start the dev server: `npm run dev`
2. Wait for it to be ready on `http://localhost:3000`.
3. Open the browser: `open http://localhost:3000`.

**Verification:**
- Browser loads without errors.
- Landing page renders the new light theme, navigation, hero, featured object, project grid, about teaser, and contact colophon.

**Commit:** none (dev server is runtime only)
