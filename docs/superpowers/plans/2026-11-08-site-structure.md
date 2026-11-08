# Site Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn lloydalba.com into a short index front page, per-project pages with system diagrams, a full Resume page, and machine-readable resume files, with thoughts renamed to writings.

**Architecture:** All content stays static and file-based. `src/lib/resume.ts` becomes the typed source of truth for the person; `content/projects/*.md` (+ `.svg`) and `content/writings/*.md` are loaded by sibling loaders that share `renderMarkdown`. Pages render slices of that data; three static route handlers serialize the same data as markdown, JSON, and `llms.txt`.

**Tech Stack:** Next.js 16.1.6 App Router (static generation, route handlers with `force-static`), React 19, TypeScript, gray-matter, unified/remark/rehype (existing `src/lib/markdown.ts`), Vitest for unit tests (added in Task 1), headless Chrome via the existing `scratchpad/cdp.mjs` flow for visual checks.

**Spec:** `docs/superpowers/specs/2026-11-08-site-structure-design.md`

## Global Constraints

- Static output only; route handlers must export `dynamic = "force-static"` and do no request-time work.
- Visual language unchanged: 550px column, left rail, uppercase `.label`, hairline `--rule` borders, Inter + EB Garamond, no motion, no new fonts, no color in diagrams.
- Absolute URLs in machine files use exactly `https://www.lloydalba.com`.
- No phone number, street address, or personal location anywhere in `src/`, `content/`, or build output. Only the school's "College Station, Texas" may appear, inside the education entry.
- Public links only: apted → `https://github.com/premiumfriedrice/apted`, CORTEX → `https://github.com/premiumfriedrice/CortexiOSApp`. AggieDine and findMoto get no links (the FindMotoV2 repo is empty at HEAD, so the spec's "v2 repo" link is dropped; report this to Lloyd).
- Content written from code states only what the code shows. Where the resume PDF claims something the code does not contain, the body omits it and the hand-over lists it.
- Do not touch, delete, rename, or push `content/*/2026-11-2-setting-up-an-inference-server.md` or `content/*/2026-11-3-on-prem-llm-inference-server-setup.md` beyond moving them with the folder rename. They must remain untracked.
- Rail labels: `Lloyd Alba`, `Projects`, `Writing`, `Resume`. URLs: `/`, `/projects`, `/writings`, `/resume`.
- Every commit message ends with `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`.
- Verify with `npm run lint && npm run build` before each commit that touches `src/`.

## Review Focus

1. A writing whose `date` frontmatter does not parse (empty, typo) must still list and sort (falls to slug order) rather than crash the build or sort to the top. Test in Task 1.
2. A project with no `diagram` field, or whose `.svg` file is missing, must render without the figure and without a "System" rail link, not 500. Test in Task 3.
3. With fewer than two writings the front page must omit the Recent writing section entirely, and with zero projects the Recent projects section. Test in Task 8.
4. A tagline or summary containing `*em*`, `&`, or a markdown link must render inline (no wrapping `<p>`) with HTML escaped and the link kept. Test in Task 2.
5. `resume.json` and `resume.md` must contain every experience bullet, `end: null` for current roles, every writing URL on the www host, and no "Round Rock", "512-", or "College Station" outside education. Test in Task 6.

---

### Task 1: Rename thoughts → writings, add date sorting, add Vitest

**Files:**
- Rename: `content/thoughts/` → `content/writings/` (git mv the tracked files; plain `mv` the two untracked files)
- Rename: `src/lib/thoughts.ts` → `src/lib/writings.ts`
- Rename: `src/app/thoughts/` → `src/app/writings/`
- Modify: `src/components/Nav.tsx` (LINKS), `src/app/globals.css` (`.thought` → `.writing`, comments), `content/writings/README.md` (URL and folder), `next.config.ts` (redirects)
- Modify: `package.json` (vitest devDependency, `"test": "vitest run"`)
- Create: `vitest.config.ts`, `src/lib/__tests__/writings.test.ts`

**Interfaces:**
- Produces: `src/lib/writings.ts`
  ```ts
  export interface Writing { slug: string; title: string; date: string; dateISO: string; html: string; toc: TocEntry[]; readTime: string }
  export function toISODate(date: string): string   // "Nov 5, 2026" → "2026-11-05"; unparseable → ""
  export function sortWritings(items: Writing[]): Writing[]  // dateISO desc, then slug desc; "" sorts last
  export function getAllWritings(): Writing[]
  export function getWritingBySlug(slug: string): Writing | undefined
  ```
- Produces: `Nav.tsx` LINKS entry `{ href: "/writings", label: "Writing", id: "writings" }` replacing the thoughts entry.

- [ ] **Step 1: Install Vitest and add config**

Run: `npm i -D vitest@^3`
Create `vitest.config.ts` with `test: { include: ["src/**/*.test.ts"] }` and `resolve.alias["@"] = "./src"`. Add `"test": "vitest run"` to `package.json` scripts.

- [ ] **Step 2: Write the failing tests**

`src/lib/__tests__/writings.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { toISODate, sortWritings, type Writing } from "@/lib/writings";

const w = (slug: string, date: string): Writing =>
  ({ slug, title: slug, date, dateISO: toISODate(date), html: "", toc: [], readTime: "1 min read" });

describe("toISODate", () => {
  it("parses the site's date format", () => expect(toISODate("Nov 5, 2026")).toBe("2026-11-05"));
  it("returns empty for garbage", () => expect(toISODate("soon")).toBe(""));
  it("returns empty for empty", () => expect(toISODate("")).toBe(""));
});

describe("sortWritings", () => {
  it("newest first, undated last, ties by slug desc", () => {
    const out = sortWritings([w("a", "Oct 1, 2026"), w("b", "soon"), w("c", "Nov 5, 2026"), w("d", "Nov 5, 2026")]);
    expect(out.map((x) => x.slug)).toEqual(["d", "c", "a", "b"]);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, cannot resolve `@/lib/writings`.

- [ ] **Step 4: Do the rename**

```bash
git mv content/thoughts content/writings
git mv src/lib/thoughts.ts src/lib/writings.ts
git mv src/app/thoughts src/app/writings
```
Confirm the two untracked `2026-11-2-*` and `2026-11-3-*` files moved with the folder and are still untracked (`git status --short` shows them as `??` under `content/writings/`).

In `src/lib/writings.ts`: rename `Thought` → `Writing`, `getAllThoughts` → `getAllWritings`, `getThoughtBySlug` → `getWritingBySlug`, `thoughtsDir` → `content/writings`; add `dateISO`, `toISODate`, `sortWritings` per the Interfaces block. `toISODate` uses `new Date(date)`; return `""` when `isNaN(getTime())`; format with `toISOString().slice(0, 10)`.

In `src/app/writings/page.tsx` and `src/app/writings/[slug]/page.tsx`: update imports and identifiers; `current="writings"`; list title `Writing`; link hrefs `/writings/...`; `className="writing post-body"` and `"writing preview-body"`; metadata title `Writing — Lloyd Alba`.

In `src/app/globals.css`: replace every `.thought` selector with `.writing`; update the comments that say Thoughts.

In `src/components/Nav.tsx`: LINKS second entry becomes `{ href: "/writings", label: "Writing", id: "writings" }`.

In `content/writings/README.md`: title `# Writing`, folder and URL `/writings/YYYY-MM-DD-your-title`, "Writing list" wording.

In `next.config.ts` add:
```ts
async redirects() {
  return [
    { source: "/thoughts", destination: "/writings", permanent: true },
    { source: "/thoughts/:slug", destination: "/writings/:slug", permanent: true },
  ];
},
```

- [ ] **Step 5: Run tests, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: tests PASS; build lists `/writings` and `/writings/2026-11-05-on-prem-inference-what-we-built` (plus the two untracked posts). `grep -rn "thought" src content/writings/README.md` returns nothing.

- [ ] **Step 6: Verify the redirect**

Run: `npx next start -p 3456 &` then `curl -sI http://localhost:3456/thoughts/2026-11-05-on-prem-inference-what-we-built | head -3`
Expected: `HTTP/1.1 308` with `location: /writings/2026-11-05-on-prem-inference-what-we-built`. Kill the server.

- [ ] **Step 7: Commit**

```bash
git add -A content/writings/README.md content/writings/2026-11-05-on-prem-inference-what-we-built.md src next.config.ts package.json package-lock.json vitest.config.ts
git status --short   # the two 2026-11-2/3 files must still show as ??
git commit -m "refactor: rename thoughts to writings, redirect old URLs, add vitest"
```

---

### Task 2: Resume data model and inline markdown

**Files:**
- Rewrite: `src/lib/resume.ts`
- Create: `src/lib/site.ts`
- Modify: `src/lib/markdown.ts` (add `renderInlineMarkdown`)
- Create: `src/lib/__tests__/resume.test.ts`, `src/lib/__tests__/markdown-inline.test.ts`

**Interfaces:**
- Produces `src/lib/site.ts`: `export const SITE_URL = "https://www.lloydalba.com";`
- Produces `src/lib/resume.ts`:
  ```ts
  export interface Experience { title: string; company: string; start: string; end: string | null; period: string; bullets: string[] }
  export interface Education { school: string; location: string; degree: string; expected: string; coursework: string[] }
  export interface Resume {
    name: string; title: string; email: string;
    links: { github: string; linkedin: string; site: string };
    summary: string;            // one paragraph of markdown, may contain links
    education: Education; skills: string[]; experience: Experience[];
  }
  export const resume: Resume;
  ```
- Produces `src/lib/markdown.ts`: `export function renderInlineMarkdown(markdown: string): string` — inline HTML, no `<p>` wrapper, `&` escaped, `*x*` → `<em>x</em>`, links kept.
- The old named exports `education`, `skills`, `experience`, `projects` are removed; `src/app/page.tsx` is left importing them (it breaks the build) until Task 8 rewrites it. To keep the build green in between, Task 2 temporarily changes `page.tsx` imports to `resume.education`, `resume.skills`, `resume.experience` and drops the Projects table. That interim front page is replaced in Task 8.

- [ ] **Step 1: Write the failing tests**

`src/lib/__tests__/resume.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { resume } from "@/lib/resume";

const all = JSON.stringify(resume);
describe("resume data", () => {
  it("has five jobs with two bullets each", () => {
    expect(resume.experience).toHaveLength(5);
    for (const e of resume.experience) expect(e.bullets).toHaveLength(2);
  });
  it("current role has end null and YYYY-MM start", () => {
    expect(resume.experience[0]).toMatchObject({ company: "Fable Innovations", start: "2026-10", end: null });
  });
  it("carries no phone or personal location", () => {
    expect(all).not.toMatch(/512-|Round Rock/);
    expect(all.split("College Station").length - 1).toBe(1); // only education.location
  });
  it("has contact essentials", () => {
    expect(resume.email).toBe("lloyddalba@gmail.com");
    expect(resume.links.site).toBe("https://www.lloydalba.com");
    expect(resume.skills[0]).toBe("Python");
    expect(resume.education.coursework).toContain("Database Systems");
  });
});
```

`src/lib/__tests__/markdown-inline.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { renderInlineMarkdown } from "@/lib/markdown";

describe("renderInlineMarkdown", () => {
  it("drops the paragraph wrapper and keeps em", () =>
    expect(renderInlineMarkdown("AR + CV. *1st overall*")).toBe("AR + CV. <em>1st overall</em>"));
  it("escapes ampersands", () => expect(renderInlineMarkdown("Texas A&M")).toBe("Texas A&#x26;M"));
  it("keeps links", () =>
    expect(renderInlineMarkdown("see [x](/writings/a)")).toBe('see <a href="/writings/a">x</a>'));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL (`resume` export missing, `renderInlineMarkdown` missing).

- [ ] **Step 3: Implement `src/lib/site.ts`, `renderInlineMarkdown`, and `resume`**

`renderInlineMarkdown`: run the same unified chain as `renderMarkdown` minus the custom rehype plugins (remark-parse, remark-gfm, remark-rehype, rehype-stringify), then strip a single outer `^<p>` / `</p>\s*$`.

`resume`: transcribe from `public/documents/LloydAlba_Resume.pdf` (text already extracted in the spec's source session; re-extract with `python3 -c "import fitz..."` or `pdftotext` if needed). Values:
- `name: "Lloyd Alba"`, `title: "software engineer"`, `email: "lloyddalba@gmail.com"`, `links: { github: "https://github.com/premiumfriedrice", linkedin: "https://www.linkedin.com/in/lloydalba/", site: SITE_URL }`.
- `summary`: `"CS at Texas A&M, graduating December 2027. Right now I'm an agentic AI engineer intern at Fable Innovations, where I [built and run an on-prem inference server](/writings/2026-11-05-on-prem-inference-what-we-built) for a team of twelve. Before that I shipped sales automations at K2United and fixed CI/CD at Arrive Logistics across three summers."`
- `education`: school "Texas A&M University", location "College Station, Texas", degree "Bachelor of Science in Computer Science", expected "December 2027", coursework as the 9-item array from the PDF (split the current string on ", ").
- `skills`: the existing 24-item array, same order.
- `experience` (period strings verbatim, bullets verbatim from the PDF, two each):
  1. Agentic AI Engineer Intern · Fable Innovations · 2026-10 → null · "Oct. 2026 – Present"
  2. AI Automation Intern · K2United · 2026-05 → 2026-08 · "May 2026 – Aug. 2026"
  3. Software Engineer Intern · Arrive Logistics · 2025-06 → 2025-08 · "Jun. 2025 – Aug. 2025"
  4. Software Engineer Intern · Arrive Logistics · 2024-06 → 2024-08 · "Jun. 2024 – Aug. 2024"
  5. Code2College Software Engineer Intern · Arrive Logistics · 2023-06 → 2023-08 · "Jun. 2023 – Aug. 2023"

Interim edit to `src/app/page.tsx`: import `{ resume }` and read `resume.education` / `resume.skills` / `resume.experience`; render `exp.bullets[0]` where `highlight` was; delete the Projects block. (Replaced wholesale in Task 8.)

- [ ] **Step 4: Run tests, lint, build**

Run: `npm test && npm run lint && npm run build`
Expected: all PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/site.ts src/lib/resume.ts src/lib/markdown.ts src/lib/__tests__ src/app/page.tsx
git commit -m "feat: typed resume source of truth with full bullets, inline markdown renderer"
```

---

### Task 3: Projects loader, README, and the apted project (content + diagram)

**Files:**
- Create: `src/lib/projects.ts`, `src/lib/__tests__/projects.test.ts`
- Create: `content/projects/README.md`, `content/projects/apted.md`, `content/projects/apted.svg`
- Create (test fixtures): `src/lib/__tests__/fixtures/projects/ok.md`, `.../ok.svg`, `.../nodiagram.md`, `.../missingsvg.md`

**Interfaces:**
- Produces `src/lib/projects.ts`:
  ```ts
  export interface Project {
    slug: string; title: string;
    tagline: string; taglineHtml: string;
    period: string; start: string; end: string | null;
    stack: string[]; links: Record<string, string>;
    diagramSvg: string | null; diagramCaption: string;
    bullets: string[];
    html: string; toc: TocEntry[];
  }
  export function loadProjects(dir: string): Project[]        // sorted by start desc, then end desc (null = newest)
  export function getAllProjects(): Project[]                  // loadProjects(content/projects)
  export function getProjectBySlug(slug: string): Project | undefined
  export function withDiagram(project: Project): string        // html with the <figure id="system"> inserted before the first <section, or unchanged when diagramSvg is null
  ```
- Consumes: `renderMarkdown`, `renderInlineMarkdown` from Task 2.

- [ ] **Step 1: Write fixtures and failing tests**

Fixtures: `ok.md` with full frontmatter (`title: Ok`, `tagline: "Does a thing. *2x faster*"`, `period`, `start: 2026-01`, `end: 2026-05`, `stack: [A, B]`, `links: { github: https://example.com }`, `diagram: ok.svg`, `diagramCaption: How it flows`, `bullets: [one, two]`) and a body with `## What it does`; `ok.svg` any minimal `<svg viewBox="0 0 10 10"></svg>`; `nodiagram.md` same minus `diagram`/`diagramCaption`, `start: 2026-03`, no `end`; `missingsvg.md` with `diagram: nope.svg`, `start: 2025-01`.

`src/lib/__tests__/projects.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import path from "path";
import { loadProjects } from "@/lib/projects";

const dir = path.join(__dirname, "fixtures/projects");
const all = loadProjects(dir);
const by = (s: string) => all.find((p) => p.slug === s)!;

describe("loadProjects", () => {
  it("sorts by start desc with present (end null) first on ties", () =>
    expect(all.map((p) => p.slug)).toEqual(["nodiagram", "ok", "missingsvg"]));
  it("reads frontmatter and inlines the svg", () => {
    expect(by("ok")).toMatchObject({ title: "Ok", stack: ["A", "B"], end: "2026-05", bullets: ["one", "two"], diagramCaption: "How it flows" });
    expect(by("ok").diagramSvg).toMatch(/^<svg/);
    expect(by("ok").taglineHtml).toBe("Does a thing. <em>2x faster</em>");
    expect(by("ok").toc[0].title).toBe("What it does");
  });
  it("tolerates no diagram and a missing svg file", () => {
    expect(by("nodiagram").diagramSvg).toBeNull();
    expect(by("nodiagram").end).toBeNull();
    expect(by("missingsvg").diagramSvg).toBeNull();
  });
  it("skips README.md", () => expect(all.some((p) => p.slug === "README")).toBe(false));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, cannot resolve `@/lib/projects`.

- [ ] **Step 3: Implement `src/lib/projects.ts`**

Mirror `writings.ts`: read `*.md` except README, gray-matter, `renderMarkdown(content)`, `renderInlineMarkdown(data.tagline ?? "")`. `end` is `data.end ? String(data.end) : null` (YAML may parse `2026-05` as a string; coerce with `String`). `start` likewise. `diagramSvg`: if `data.diagram` and `fs.existsSync(path.join(dir, data.diagram))` read as utf8, else `null`. `links`: `data.links ?? {}`. Sort comparator: `b.start.localeCompare(a.start)`, then treat `null` end as `"9999"` and compare desc.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test` → PASS.

- [ ] **Step 5: Write `content/projects/README.md`**

Mirror `content/writings/README.md`: filename is the slug (`apted.md` → `/projects/apted`); the full frontmatter field list with one-line meanings; the section template (`## What it does`, `## How it's built`, `## Decisions`, `## Results`, footnotes for margin notes); the SVG style rules copied from the spec ("content/projects/<slug>.svg" section) verbatim; "commit and push; Vercel publishes it." Not published.

- [ ] **Step 6: Write `content/projects/apted.md` from the code**

Source: `~/code/apted` at commit `16ce95c` (README, `src/lib/structure.ts`, `relevance.ts`, `redact.ts`, `render/`, `compile.ts`, `compile-service/server.js` + `fly.toml`, `extension/src/{scrapers,background,drawer,inject,autofill,pipeline}.ts`, `src/app/api/{tailor,edit}`). Facts the code supports, which the body must be built from and limited to:
- Next.js web app; Postgres on Supabase holds the master resume as one JSON record (the only source of truth), saved tailored versions with outcomes, and applications.
- `POST /api/tailor` is two-phase: a cheap model reads the JD and the master's skeleton and returns a keep/drop filter per section and item; a stronger model then tailors the filtered master against the JD plus the top-K most relevant prior versions (ranked by keyword overlap, optionally embeddings).
- `POST /api/edit` refines a draft from chat instructions; the draft is the state, with a 20-step undo stack.
- PII redaction: contact info and org names are replaced with placeholders before anything is stored or sent to a model, and restored only at render.
- Rendering: Resume JSON → `.tex` using Jake Gutierrez's template macros → a small Node HTTP service that runs Tectonic in a container on Fly.io and returns a PDF.
- Browser extension: vanilla TypeScript content-script drawer in a shadow DOM on LinkedIn, Greenhouse, Lever, Workday, Ashby; per-site scrapers pull the JD; a background service worker owns every network call to the web app; the drawer previews the PDF and injects it into the application's file input, autofills form fields from the profile, and tracks the application's status in sync with the web app.
- Not in the code: "LLM-as-judge validation" (resume bullet). Omit from body and diagram; list in hand-over.

Frontmatter: `title: apted`; `tagline: "Tailors my resume to the job page I'm on and drops the PDF into the application. *10 min → 30 s.*"`; `period: May 2026 – Present`; `start: "2026-05"`; `stack: [Next.js, TypeScript, Postgres, LaTeX, Chrome extension]`; `links: { github: https://github.com/premiumfriedrice/apted }`; `diagram: apted.svg`; `diagramCaption: From a job page to a tailored PDF`; `bullets:` the two PDF bullets verbatim.

Body: lede of two or three sentences, then the four template sections, one to three short paragraphs each, in Lloyd's register (model it on `content/writings/2026-11-05-on-prem-inference-what-we-built.md`: first person, plain, "One sentence version:", "This is what makes X actually true"). Put one to three footnotes (`[^id]`) for details that read as asides (the undo stack, the redaction placeholders, why a separate compile service). No product names beyond the frontmatter stack except where the code is literally that product (Tectonic, Supabase, Fly.io are fine; this is Lloyd's own project, not the employer's).

- [ ] **Step 7: Draw `content/projects/apted.svg`**

Follow the README style rules. Nodes (≤ 8): `Job site` (dashed, external) → `Extension` (sub: scrape JD · inject PDF) → `Web app` (sub: Next.js) ↔ `Postgres` (sub: master resume · versions); `Web app` → `Select` (sub: cheap model · keep/drop) → `Tailor` (sub: strong model); `Web app` → `Compile service` (sub: LaTeX → PDF) → `PDF` (dashed, output) with an arrow back to `Extension`. `viewBox="0 0 520 H"`, shared `<marker>` arrowhead, labels `font-family="inherit"`.

- [ ] **Step 8: Verify the content loads**

Run: `node -e "require('tsx')"` is not available; instead add a one-off assertion to the test file temporarily or run `npm run build` after Task 4 wires the page. For now: `npx tsx -e "import {getAllProjects} from './src/lib/projects'; const p=getAllProjects(); console.log(p.map(x=>[x.slug,x.start,!!x.diagramSvg,x.toc.length]))"` (install tsx with `npx -y tsx` if prompted).
Expected: `[['apted','2026-05',true,4]]`.

- [ ] **Step 9: Commit**

```bash
git add src/lib/projects.ts src/lib/__tests__ content/projects
git commit -m "feat: projects loader, authoring README, apted write-up and diagram"
```

---

### Task 4: Remaining project content (AggieDine, CORTEX, findMoto)

**Files:**
- Create: `content/projects/aggiedine.md`, `aggiedine.svg`, `cortex.md`, `cortex.svg`, `findmoto.md`, `findmoto.svg`

**Interfaces:**
- Consumes: the README rules and frontmatter shape from Task 3.
- Produces: slugs `aggiedine`, `cortex`, `findmoto` used by Tasks 5–8.

- [ ] **Step 1: CORTEX from the code**

Source: `https://github.com/premiumfriedrice/CortexiOSApp` (SwiftUI app "Cortech"). Facts the code supports:
- SwiftUI iOS app with a home map (MapKit, region centered on CLL), a bags-and-items list, chat page, and a "find my" sheet.
- Flight info comes from the AviationStack API with built-in fallback data when the API returns nothing.
- Checked bags: photos are compressed on-device and POSTed to a backend at `aa-cortex.vercel.app` (`/api/upload`, `/api/user-baggage`) with a bearer token; bags are fetched back per user.
- Lost-object tracking: the app polls `/api/object/status/:id` every 5 seconds and, when the status is "lost", pushes the phone's coordinates to `/api/object/lost`.
- AR relocation: `ARBackgroundView` uses RealityKit with a world anchor, a marker entity, a 3D text label, and a guide line to the saved position. Note: at HEAD this file is entirely commented out; say so in a footnote rather than hide it.
- Backend (Next.js API on Vercel) and the bag-detection models are not in a public repo. The body attributes bag detection to the backend "per the resume", in one sentence, and the diagram draws it dashed.
- Hand-over item for Lloyd, not for the site: `AirportServiceAPI.swift` and `UploadPictureAPI.swift` contain a hardcoded third-party API key and a bearer token in the public repo. Recommend rotating them and moving them to config.

Frontmatter: `title: CORTEX`; `tagline: "AR + computer vision airport ecosystem. *1st overall* at TAMUhack 2026."`; `period: Jan. 2026`; `start: "2026-01"`; `end: "2026-01"`; `stack: [Swift, SwiftUI, RealityKit, MapKit, Node.js]`; `links: { github: https://github.com/premiumfriedrice/CortexiOSApp }`; `diagram: cortex.svg`; `diagramCaption: The iOS app and what it talks to`; `bullets:` three PDF bullets verbatim.

Diagram nodes: `iOS app` (sub: SwiftUI) → `AR relocation` (sub: RealityKit anchor); `iOS app` → `Bag photos` (sub: compressed on device) → `Backend API` (dashed; sub: Vercel) → `Bag detection` (dashed; sub: CV, per resume); `iOS app` ↔ `Object status` (dashed; sub: poll every 5 s); `iOS app` → `Flight data` (dashed; sub: AviationStack).

- [ ] **Step 2: AggieDine from the resume only**

No repo under Lloyd's account. Body built from the two PDF bullets: scale-to-zero AWS backend serving up to 70k students at $0 idle and under $25/month at capacity; led six backend engineers and ran sprint planning. Stack from the PDF: Python, AWS, React Native. First line of the body is an HTML comment: `<!-- Lloyd: no repo was available when this was written. Point me at it and I'll rewrite from the code. -->`. Keep every section to one short paragraph; do not invent services. Diagram nodes, generic: `App` (sub: React Native) → `API` (sub: scale to zero) → `Functions` (sub: Python) → `Store` (dashed). Frontmatter: `title: AggieDine`; `tagline: "Social dining app for Texas A&M. Scale-to-zero backend, *$0 idle*, 70k students."`; `period: Jan. 2026 – May 2026`; `start: "2026-01"`; `end: "2026-05"`; `stack: [Python, AWS, React Native]`; `links: {}`; `diagram: aggiedine.svg`; `diagramCaption: Request path, drawn from the resume, not the code`; two PDF bullets.

- [ ] **Step 3: findMoto from the resume only**

`FindMotoV2` on GitHub contains only a README at HEAD, so there is no code to read; same HTML comment as AggieDine. Facts from the PDF: Selenium scraper ranks Facebook Marketplace motorcycle listings by price, model year, recency; cron processes 40–80 listings a day into a Notion dashboard; 1st Place Notion API Challenge at TAMU Build4Good over 13 teams; used to buy two motorcycles. Frontmatter: `title: findMoto`; `tagline: "Scraper that ranks Marketplace motorcycle listings into Notion. *1st*, Notion API Challenge."`; `period: Mar. 2025 – Jun. 2025`; `start: "2025-03"`; `end: "2025-06"`; `stack: [Python, Selenium, Notion API, cron]`; `links: {}`; `diagram: findmoto.svg`; `diagramCaption: Nightly run, from listings to the dashboard`; three PDF bullets. Diagram nodes: `Cron` → `Scraper` (sub: Python · Selenium) ↔ `Marketplace` (dashed) ; `Scraper` → `Ranker` (sub: price · year · recency) → `Notion API` → `Dashboard` (dashed).

- [ ] **Step 4: Verify all four load and sort**

Run the `npx tsx -e` one-liner from Task 3 Step 8.
Expected order: `apted, aggiedine, cortex, findmoto`, all with `true` for diagram and `4` sections.

- [ ] **Step 5: Commit**

```bash
git add content/projects
git commit -m "content: AggieDine, CORTEX, findMoto project pages and diagrams"
```

---

### Task 5: Projects index and project pages

**Files:**
- Create: `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`
- Modify: `src/components/Nav.tsx` (add Projects), `src/app/globals.css` (`.index*`, `.diagram*`, print rules)

**Interfaces:**
- Consumes: `getAllProjects`, `getProjectBySlug`, `Project` (Task 3); `PostToc`, `CodeCopy`, `Rail`, `TopNav`.
- Produces CSS classes used again by Tasks 7 and 8:
  - `.index` (ul): rows `li` as `grid-template-columns:120px 1fr; gap:16px; padding:8px 0; border-top:1px solid var(--rule)`, last child also `border-bottom`; children `.k` (bold 550, or `.k.t` muted tabular), `.v` (`--text-2`). Under 640px: one column, `gap:2px`.
  - `.index-label`: `.label` plus `display:flex; justify-content:space-between; align-items:baseline`; `.index-label a { font-size:12.5px; color:var(--muted) }`.
  - `.diagram` (figure, `id="system"`): `margin:20px 0 0; padding:16px; background:#fff; border-radius:12px; box-shadow:var(--card-shadow); scroll-margin-top:48px`; `.diagram svg { display:block; width:100%; height:auto }`; `.diagram-cap { margin:8px 0 0; color:var(--muted); font-size:12px }`. Print: `.diagram { box-shadow:none; border:1px solid var(--rule); break-inside:avoid }`.
- Nav LINKS becomes `[home, { href: "/projects", label: "Projects", id: "projects" }, writings]` (Resume added in Task 7).

- [ ] **Step 1: Build `/projects`**

Same shell as `src/app/writings/page.tsx`: `Rail current="projects"`, `TopNav`, masthead title `Projects<span> · {n}</span>`, no statement. Then `<ul className="index">` with one `li` per project: `.k` = `<Link href={/projects/${slug}}>{title}</Link>`, `.v` = `dangerouslySetInnerHTML={{__html: taglineHtml}}`, followed by a `<span className="s-note">` with `period` (reuse the existing muted note style). Metadata title `Projects — Lloyd Alba`.

- [ ] **Step 2: Build `/projects/[slug]`**

Copy `src/app/writings/[slug]/page.tsx` and change: `generateStaticParams` from `getAllProjects`; `current="projects"`; masthead title `project.title`; `masthead-line` items: `period`, `stack.join(", ")`, then one `<li><a href target=_blank rel=noopener noreferrer>` per entry of `links` with the key capitalized as the text; no read time, no `PrintLink`. TOC passed to `PostToc` is `project.diagramSvg ? [{ id: "system", title: "System", children: [] }, ...project.toc] : project.toc`. Body: `<article className="writing post-body">` rendered from one HTML string. `renderMarkdown` emits an optional `<div class="lede">` first and then `<section id=… class="section" data-section>` blocks, so insert the figure before the first `<section ` occurrence (append at the end if there is none), only when `diagramSvg` is set. Put this in `src/lib/projects.ts` as `export function withDiagram(project: Project): string` and test it in the Task 3 test file (`expect(withDiagram(by("ok"))).toMatch(/<\/div><figure id="system"/)` and `expect(withDiagram(by("nodiagram"))).toBe(by("nodiagram").html)`); `figureHtml` is `<figure id="system" class="diagram">${svg}<figcaption class="diagram-cap">Fig. 1 · ${caption}</figcaption></figure>`. Keep `<CodeCopy />`.

- [ ] **Step 3: Add CSS and Nav entry**

Append the Interfaces CSS to `globals.css` under a `/* Projects */` comment, and the print override inside the existing `@media print` block. Add the Projects LINKS entry.

- [ ] **Step 4: Lint, build, look**

Run: `npm run lint && npm run build && (npx next start -p 3456 &) && sleep 2`
Then with the existing `scratchpad/cdp.mjs` flow (or `chrome --headless --screenshot`), capture `http://localhost:3456/projects/apted` at 1280×900 and 390×844.
Expected: figure directly under the lede, rail shows "System" then the four sections, no horizontal scroll on mobile. Print: `chrome --headless --print-to-pdf=... http://localhost:3456/projects/apted` produces a PDF whose first page contains the diagram (rasterize page 1 and look).

- [ ] **Step 5: Commit**

```bash
git add src/app/projects src/components/Nav.tsx src/app/globals.css
git commit -m "feat: projects index and project pages with system diagrams"
```

---

### Task 6: Resume export (markdown, JSON, llms.txt) and route handlers

**Files:**
- Create: `src/lib/resume-export.ts`, `src/lib/__tests__/resume-export.test.ts`
- Create: `src/app/resume.md/route.ts`, `src/app/resume.json/route.ts`, `src/app/llms.txt/route.ts`

**Interfaces:**
- Produces `src/lib/resume-export.ts`:
  ```ts
  export interface ExportInput { resume: Resume; projects: Project[]; writings: Writing[] }
  export interface ResumeJson {
    name: string; title: string; email: string; links: Resume["links"]; summary: string;
    education: Omit<Education, "coursework"> & { coursework: string[] };
    skills: string[];
    experience: Experience[];
    projects: { slug: string; name: string; tagline: string; stack: string[]; start: string; end: string | null; period: string; url: string; links: Record<string, string>; bullets: string[] }[];
    writing: { slug: string; title: string; date: string; url: string }[];   // date = dateISO
  }
  export function resumeJson(input: ExportInput): ResumeJson
  export function resumeMarkdown(input: ExportInput): string
  export function llmsTxt(input: ExportInput): string
  ```
- Consumes: `SITE_URL`; `resume`; `getAllProjects`; `getAllWritings`.

- [ ] **Step 1: Write the failing tests**

```ts
import { describe, it, expect } from "vitest";
import { resumeJson, resumeMarkdown, llmsTxt } from "@/lib/resume-export";
import { resume } from "@/lib/resume";
import type { Project } from "@/lib/projects";
import type { Writing } from "@/lib/writings";

const project: Project = { slug: "apted", title: "apted", tagline: "T", taglineHtml: "T", period: "May 2026 – Present", start: "2026-05", end: null, stack: ["A"], links: { github: "https://g" }, diagramSvg: null, diagramCaption: "", bullets: ["b1"], html: "", toc: [] };
const writing: Writing = { slug: "2026-11-05-x", title: "X", date: "Nov 5, 2026", dateISO: "2026-11-05", html: "", toc: [], readTime: "1 min read" };
const input = { resume, projects: [project], writings: [writing] };

describe("resumeJson", () => {
  it("mirrors the data and builds www urls", () => {
    const j = resumeJson(input);
    expect(j.experience).toEqual(resume.experience);
    expect(j.projects[0].url).toBe("https://www.lloydalba.com/projects/apted");
    expect(j.writing[0]).toEqual({ slug: "2026-11-05-x", title: "X", date: "2026-11-05", url: "https://www.lloydalba.com/writings/2026-11-05-x" });
    expect(JSON.stringify(j)).not.toMatch(/512-|Round Rock|location":"(?!College)/);
  });
});
describe("resumeMarkdown", () => {
  it("has every bullet, heading order, and no location line", () => {
    const md = resumeMarkdown(input);
    for (const e of resume.experience) for (const b of e.bullets) expect(md).toContain(`- ${b}`);
    expect(md.indexOf("## Summary")).toBeLessThan(md.indexOf("## Education"));
    expect(md).toContain("### Agentic AI Engineer Intern · Fable Innovations\nOct. 2026 – Present");
    expect(md).toContain("- 2026-11-05 · X · https://www.lloydalba.com/writings/2026-11-05-x");
    expect(md.split("\n")[1]).toBe("software engineer");
  });
});
describe("llmsTxt", () => {
  it("links the three resume forms, every project, every writing", () => {
    const t = llmsTxt(input);
    expect(t.startsWith("# Lloyd Alba\n")).toBe(true);
    for (const p of ["/resume.md", "/resume.json", "/resume", "/projects/apted", "/writings/2026-11-05-x"])
      expect(t).toContain(`https://www.lloydalba.com${p}`);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail** → `npm test` FAIL (module missing).

- [ ] **Step 3: Implement `resume-export.ts`**

Markdown shape exactly as the spec's `/resume.md` block: H1 name; line 2 title; line 3 `email · github.com/premiumfriedrice · linkedin.com/in/lloydalba · www.lloydalba.com`; sections Summary, Education, Technical skills (comma list), Experience (`### title · company` / period / bullets), Projects (`### name · stack` / `period · url` / bullets), Writing (`- date · title · url`). `llmsTxt`: `# Lloyd Alba`, one blurb line, then `## Resume`, `## Projects`, `## Writing` sections of `- [title](url): one line`. Prefer `/resume.md` for agents in the blurb. Omit the ".md appended" sentence.

- [ ] **Step 4: Route handlers**

Each file:
```ts
export const dynamic = "force-static";
export function GET() { return new Response(body, { headers: { "content-type": "<type>" } }); }
```
with `body` from the export function over `{ resume, projects: getAllProjects(), writings: getAllWritings() }`. Types: `text/markdown; charset=utf-8`, `application/json; charset=utf-8`, `text/plain; charset=utf-8`.

- [ ] **Step 5: Tests, lint, build, curl**

Run: `npm test && npm run lint && npm run build`, then `npx next start -p 3456 &` and
`curl -s localhost:3456/resume.md | head -5; curl -s localhost:3456/resume.json | python3 -c "import json,sys; d=json.load(sys.stdin); print(len(d['experience']), d['projects'][0]['url'])"; curl -s localhost:3456/llms.txt | head -4`
Expected: markdown header lines; `5 https://www.lloydalba.com/projects/apted`; llms header. Build output lists the three routes as static (○).

- [ ] **Step 6: Commit**

```bash
git add src/lib/resume-export.ts src/lib/__tests__/resume-export.test.ts src/app/resume.md src/app/resume.json src/app/llms.txt
git commit -m "feat: resume.md, resume.json, llms.txt static exports"
```

---

### Task 7: Resume page

**Files:**
- Create: `src/app/resume/page.tsx`
- Modify: `src/components/Nav.tsx` (add Resume), `src/app/globals.css` (`.cv-*`)

**Interfaces:**
- Consumes: `resume`, `renderInlineMarkdown`, `getAllProjects`, `.rules`, `.skills`, `.label`, `.social` markup from the current `page.tsx`.
- Produces CSS: `.cv-head { display:flex; justify-content:space-between; gap:16px; padding:9px 0; border-top:1px solid var(--rule) }`, `.cv-head .t { color:var(--muted); white-space:nowrap; font-variant-numeric:tabular-nums }`, `.cv-head strong { font-weight:550 }`, `.cv-bullets { margin:6px 0 14px; padding-left:18px; color:var(--text-2) }`, `.foot { margin-top:30px; color:var(--muted); font-size:13px }`.
- Nav LINKS final: home, projects, writings, `{ href: "/resume", label: "Resume", id: "resume" }`.

- [ ] **Step 1: Build the page**

Shell with `current="resume"`. Masthead: title "Lloyd Alba" + the three social icons (move the `socials` array into `src/components/Socials.tsx` exporting `<Socials />` so Task 8 reuses it); `masthead-line` with one `li` containing the email as a `mailto:` link. Then `<p className="statement" dangerouslySetInnerHTML={{__html: renderInlineMarkdown(resume.summary)}} />`. Then, in order, labels and blocks: Education (`dl.rules` as today, coursework joined with ", "); Technical Skills (`ul.skills`); Experience (per job: `<div class="cv-head"><span><strong>{title}</strong> · {company}</span><span class="t">{period}</span></div><ul class="cv-bullets">…`); Projects (same shape, name linking to `/projects/{slug}`, ` · {stack.join(", ")}`); foot paragraph `.foot`: "Also as [resume.md](/resume.md), [resume.json](/resume.json), and [PDF](/documents/LloydAlba_Resume.pdf)." Metadata title `Resume — Lloyd Alba`.

- [ ] **Step 2: CSS and Nav** — append `.cv-*`/`.foot` under `/* Resume */`; add Resume LINKS entry.

- [ ] **Step 3: Lint, build, screenshot** at 1280 and 390 widths. Expected: hairline blocks, no overflow, `grep -c "Round Rock" .next/server/app/resume.html` → 0.

- [ ] **Step 4: Commit**

```bash
git add src/app/resume src/components/Socials.tsx src/components/Nav.tsx src/app/globals.css
git commit -m "feat: resume page with full bullets and machine-file links"
```

---

### Task 8: Front page

**Files:**
- Create: `src/lib/home.ts`, `src/lib/__tests__/home.test.ts`
- Rewrite: `src/app/page.tsx`

**Interfaces:**
- Produces `src/lib/home.ts`:
  ```ts
  export function homeLists<P, W>(projects: P[], writings: W[], n = 3): { projects: P[]; writings: W[] | null }
  // projects: first n (already sorted); writings: first n, or null when writings.length < 2
  ```
- Consumes: `getAllProjects`, `getAllWritings`, `resume`, `renderInlineMarkdown`, `<Socials />`, `.index`, `.index-label`, `.foot`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from "vitest";
import { homeLists } from "@/lib/home";
describe("homeLists", () => {
  it("takes three of each", () =>
    expect(homeLists([1, 2, 3, 4], ["a", "b", "c", "d"])).toEqual({ projects: [1, 2, 3], writings: ["a", "b", "c"] }));
  it("hides writing when fewer than two", () => {
    expect(homeLists([1], ["a"]).writings).toBeNull();
    expect(homeLists([1], []).writings).toBeNull();
    expect(homeLists([], ["a", "b"]).projects).toEqual([]);
  });
});
```

- [ ] **Step 2: Run to verify it fails** → FAIL.

- [ ] **Step 3: Implement `home.ts`** and run → PASS.

- [ ] **Step 4: Rewrite `src/app/page.tsx`**

Shell `current="home"`. Masthead: `title-row` with `<h1 className="title">Lloyd Alba<span> · software engineer</span></h1>` and `<Socials />` (unchanged look). `<p className="statement" dangerouslySetInnerHTML={{__html: renderInlineMarkdown(resume.summary)}} />`. Then, if `projects.length`: `<p className="label index-label"><span>Recent projects</span><Link href="/projects">all projects →</Link></p>` and `<ul className="index">` rows: `.k` = Link to `/projects/{slug}` with title, `.v` = taglineHtml. Then, if `writings`: label "Recent writing" with `all writing →` to `/writings`, rows `.k.t` = `date`, `.v` = Link to `/writings/{slug}` with title. Then `<p className="foot">Full resume → <Link href="/resume">Resume</Link>. Also as <a href="/resume.md">resume.md</a> and <a href="/resume.json">resume.json</a> for agents.</p>`. Nothing else: no Education, Skills, Experience, Projects table.

- [ ] **Step 5: Lint, build, screenshots, no-scroll check**

Run lint and build; start on 3456; screenshot `/` at 1280×800 and 390×844. With CDP (or `--dump-dom` + a JS eval), check `document.documentElement.scrollHeight <= 800` at 1280×800.
Expected: no scrollbar on desktop; on mobile rows stack; the summary link points at `/writings/2026-11-05-...`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/home.ts src/lib/__tests__/home.test.ts src/app/page.tsx
git commit -m "feat: index front page with recent projects and writing"
```

---

### Task 9: Whole-site verification and ship

**Files:** none new (fixes only, if the checks find any).

- [ ] **Step 1: Full checks**

Run: `npm test && npm run lint && npm run build`
Then `grep -rl "Round Rock\|512-992" .next/server/app src content || echo clean` → `clean`.
Then `grep -rn "thoughts" src content/writings/README.md content/projects/README.md next.config.ts` → only the two redirect `source` strings.

- [ ] **Step 2: Visual pass**

Start on 3456 and screenshot: `/`, `/projects`, `/projects/apted`, `/projects/cortex`, `/writings`, `/writings/2026-11-05-on-prem-inference-what-we-built`, `/resume`, each at 1280 and 390. Print `/projects/apted` to PDF and rasterize page 1. Fix anything off (overflow, missing rail entry, figure spacing) and commit as `fix:`.

- [ ] **Step 3: Confirm nothing unapproved will ship**

Run: `git status --short`
Expected: exactly the two untracked `content/writings/2026-11-2-*` and `2026-11-3-*` files, nothing else. If anything else is uncommitted, stop and commit or discard deliberately.

- [ ] **Step 4: Push and verify live**

Run: `git push`
Wait for Vercel (≈ 1–2 min), then:
`curl -sI https://www.lloydalba.com/thoughts | grep -i location`; `curl -s https://www.lloydalba.com/resume.md | head -3`; `curl -s https://www.lloydalba.com/llms.txt | head -3`; open `https://www.lloydalba.com/` and `/projects/apted` in headless Chrome at 390 width.
Expected: redirect to `/writings`; markdown header; llms header; pages render. Tell Lloyd to hard-refresh on the phone.

- [ ] **Step 5: Hand-over notes for Lloyd**

Report, in plain words: (a) code-vs-resume differences: apted has no LLM-as-judge in the code; CORTEX's AR view is commented out at HEAD and bag detection lives in a backend that is not public; FindMotoV2 is an empty repo, so findMoto and AggieDine were written from the resume only and carry an HTML comment asking for repos. (b) Security: the public CORTEX repo contains a live third-party API key and a bearer token in source; rotate and move to config. (c) The two Nov 2/3 writings are still untracked and unpublished.
