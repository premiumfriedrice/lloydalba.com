# Site structure: front page, project pages, resume as source of truth

Date: 2026-11-08
Status: draft for Lloyd's approval

## Intent

lloydalba.com should leave a visitor with the impression that Lloyd is straightforward and thoughtful. Straightforward: the front page says little and every item on it is a deliberate pointer. Thoughtful: depth is one click away in project write-ups with system diagrams and in the writing. The site also becomes the single source of truth about Lloyd that an external agent (Lloyd's own apted tool, or any LLM) can read to produce a tailored resume.

## Goals

1. Front page fits on a laptop screen without scrolling: masthead, one specific paragraph, three recent projects, three recent writings, a foot line.
2. Every project has its own page with a system diagram at the top, in the same document layout the thought posts use (numbered sections, rail jump links, margin notes).
3. A Resume page holds everything: contact, education, coursework, skills, every job with full bullets, every project with bullets.
4. The same resume data is served as `/resume.md` and `/resume.json`, and `/llms.txt` tells an agent where everything is.
5. The visual language stays exactly the current Anatomy copy: 550px column, left rail, uppercase labels, hairline rules, Inter + EB Garamond, no motion.

## Non-goals

- No on-site agent, chat, form, or login. Resume generation happens outside the site.
- No phone number, street address, or location of any kind in any public file, even though they are on the PDF. Lloyd's decision: no location.
- No project page for the Fable inference server. It is covered by the Nov 5 thought and is subject to the boss's rule about not exposing the stack. Work projects stay out of the Projects section unless Lloyd adds one deliberately.
- No change to the writing post layout, the writings list, or the PDF export already built, beyond the thoughts → writings rename.
- No dark mode, no animations, no new fonts.

## Anti-goals (what would make it a failure even if it works)

- A front page that looks padded: a section with one item, a bio that could be anyone's, a skills cloud.
- Diagrams that look like they came from a diagram tool: colored fills, drop shadows, rounded blobs, icons.
- Two copies of any fact. If the Resume page and `resume.json` can disagree, the design is wrong.

## Current state

- Next.js 16 App Router, static output, deployed on Vercel. Routes: `/` and `/thoughts`, `/thoughts/[slug]` (to be renamed to `/writings`).
- `src/lib/resume.ts` holds education, a flat skills array, experience (one highlight per job), and projects (one description each). This is the seed of the source of truth and is too thin for tailoring.
- `content/thoughts/*.md` are rendered by `src/lib/markdown.ts` into the Anatomy document layout with TOC, code cards, pull quotes, and footnotes as margin notes. `content/thoughts/README.md` documents the authoring format.
- Uncommitted work exists (Anatomy post layout, margin notes, PDF export, the Nov 5 post). It must be committed before this work starts. The detailed Nov 3 post must not ship until the boss approves; the builder should leave it alone and not push it.
- The full resume bullets exist in `public/documents/LloydAlba_Resume.pdf` (Oct 28 version). They are the content for the Resume page.

## Decisions Lloyd made

These came from the brainstorm and are not open:

- Front page sections are exactly: masthead, one paragraph, Recent projects, Recent writing, foot line. Experience, education, and skills leave the front page.
- Projects and their diagrams live on their own pages, not on the front page.
- Diagram style is boxes and arrows (option 1 of the three shown): hairline rectangles, grey arrows, short label plus muted sub-label per node, dashed border for external systems or final outputs. Not layers, not numbered callouts.
- The agent view is static files, not an on-site feature.
- The agent needs full bullets per job and contact info. apted consumes markdown.

## Decisions made by the designer (Claude), reversible

- Rail labels become `Lloyd Alba · Projects · Writing · Resume`. Lloyd's decision (after approval): thoughts are renamed to writings everywhere. The URL becomes `/writings` and `/writings/[slug]`, the content folder becomes `content/writings/`, and code identifiers (`thoughts.ts`, `Thought`, `.thought` CSS class, `getThoughts`, etc.) are renamed to match. Old `/thoughts` and `/thoughts/[slug]` URLs 308-redirect to the new ones via `next.config.ts` redirects so links already out in the world keep working.
- Contact info in public files is email, GitHub, LinkedIn, and the site URL. Nothing else, and no location.
- Recency is by project start date and post date, newest first. Front page shows three of each. If there are fewer than two writings, the Recent writing section is omitted rather than shown with one row.
- Projects are authored as markdown files with frontmatter, exactly like thoughts, so the one authoring format covers both. The diagram is a hand-written SVG file next to the markdown.
- The front-page paragraph is a field in the resume data, so it is editable without touching components and appears in `resume.md` as the summary.
- Absolute URLs in the machine files use `https://www.lloydalba.com`, because the apex domain currently 308-redirects to www and some agent fetchers do not follow redirects.
- Project links: only URLs that are verifiably public go in frontmatter and `resume.json`. Known today: apted `github.com/premiumfriedrice/apted`, CORTEX `github.com/premiumfriedrice/CortexiOSApp`. findMoto's public repo (`FindMotoV2`) is a later rewrite, not the hackathon version the bullets describe, so it is linked with the label "v2 repo". AggieDine has no public repo and gets no link. Lloyd adds store listings or org repos later by editing frontmatter.

## The pages

### `/` Front page

Rail: Lloyd Alba (current), Projects, Writing, Resume. Column:

1. Masthead, unchanged: "Lloyd Alba · software engineer" with the three social icons.
2. One paragraph, from `resume.summary`. Draft text (Lloyd edits freely):

   > CS at Texas A&M, graduating December 2027. Right now I'm an agentic AI engineer intern at Fable Innovations, where I [built and run an on-prem inference server](/writings/2026-11-05-on-prem-inference-what-we-built) for a team of twelve. Before that I shipped sales automations at K2United and fixed CI/CD at Arrive Logistics across three summers.

   The paragraph may contain one or two links. Markdown links in the summary field are rendered.
3. Label row "Recent projects" with a right-aligned quiet link "all projects →" to `/projects`. Three rows: project name (bold, links to the project page) in a 120px left cell, one-line tagline in the right cell. Inside the tagline, the single number that matters is wrapped in `<em>` so it renders in the italic serif the site already uses for `em`. Example: "Chrome extension that tailors a resume to the job page you're on. *10 min → 30 s.*"
4. Label row "Recent writing" with "all writing →" to `/writings`. Three rows: date (muted, tabular numerals) left, title right, linking to the post.
5. Foot line, muted 13px: "Full resume → Resume. Also as resume.md and resume.json for agents." with the three links.

Rows reuse the existing `.rules` / `.table` hairline styling: 1px `--rule` top border per row, bottom border on the last. No hover effects beyond the existing link underline.

Mobile (below the rail breakpoint): the existing top nav takes over, rows stack the left cell above the right cell, the "all →" link stays on the label row.

### `/projects` Index

Same shell. Label "Projects". One row per project, every project, newest first: name (link), tagline, period in a third muted cell on wide screens. No previews, no diagrams on the index.

### `/projects/[slug]` Project page

Same shell and stylesheet as `/writings/[slug]`, so it inherits numbered sections, TOC rail, code cards, pull quotes, footnote margin notes, and the print stylesheet.

Masthead differences from a thought post:

- Title is the project name.
- Masthead line: period · stack as a short comma list · links (GitHub, store, demo, whatever the frontmatter has), separated by the same " · " used on thought pages. No read time, no PDF link.
- The lede (paragraphs before the first `##`) renders as on thoughts.
- Immediately after the lede, before section 01, a figure: the SVG diagram inline (not an `<img>`, so it inherits the font and prints crisply), inside a white card with the same border/shadow as `.code` cards, 16px padding. Caption below in muted 12px: "Fig. 1 · " followed by the `diagramCaption` frontmatter value.
- The rail's "on this page" list gets a first entry "System" that scrolls to the figure, then the numbered sections as on thoughts.

Body sections are whatever the markdown has. The suggested template in `content/projects/README.md` is: What it does / How it's built / Decisions / Results, with trouble-I-ran-into as footnote margin notes, matching the Nov 5 post's structure.

### `/resume` Resume page

Same shell. Label-driven sections in this order, all rendered from the data file:

1. Masthead: "Lloyd Alba" with the social icons, then one line with the email address.
2. Summary paragraph (same `summary` field).
3. Education: the existing `dl.rules` block (School, Degree, Expected, Coursework).
4. Technical skills: the existing chip list.
5. Experience: one block per job. Header row: title · company on the left, period right-aligned muted. Then a plain bulleted list of every bullet. Bullets are the PDF text verbatim.
6. Projects: one block per project in the same shape as Experience: name (link to the project page) · stack, period right, bullets.
7. Foot: links to `/resume.md`, `/resume.json`, and `public/documents/LloydAlba_Resume.pdf` ("PDF").

### `/resume.md`

Plain markdown, `text/markdown; charset=utf-8`, built at build time from the same data. Shape:

```
# Lloyd Alba
software engineer
lloyddalba@gmail.com · github.com/premiumfriedrice · linkedin.com/in/lloydalba · lloydalba.com

## Summary
<summary paragraph, links as markdown>

## Education
**Texas A&M University**, College Station, Texas
Bachelor of Science in Computer Science, expected December 2027
Coursework: ...

## Technical skills
Python, Swift, AWS, ...

## Experience
### Agentic AI Engineer Intern · Fable Innovations
Oct. 2026 – Present
- bullet
- bullet

### ...

## Projects
### apted · Next.js, Supabase, Fly.io, Stripe, LaTeX
May 2026 – Present · https://www.lloydalba.com/projects/apted
- bullet

## Writing
- 2026-11-05 · What We Built: An On-Prem LLM Inference Server · https://www.lloydalba.com/writings/2026-11-05-on-prem-inference-what-we-built
```

The Writing section lists every published post with its URL so an agent can fetch evidence.

### `/resume.json`

`application/json`. Shape mirrors the data file one to one:

```json
{
  "name": "Lloyd Alba",
  "title": "software engineer",
  "email": "lloyddalba@gmail.com",
  "links": { "github": "...", "linkedin": "...", "site": "https://www.lloydalba.com" },
  "summary": "...",
  "education": { "school": "...", "location": "...", "degree": "...", "expected": "...", "coursework": ["..."] },
  "skills": ["..."],
  "experience": [
    { "title": "...", "company": "...", "start": "2026-10", "end": null, "period": "Oct. 2026 – Present", "bullets": ["..."] }
  ],
  "projects": [
    { "slug": "apted", "name": "apted", "tagline": "...", "stack": ["..."], "start": "2026-05", "end": null, "period": "May 2026 – Present", "url": "https://www.lloydalba.com/projects/apted", "links": { "github": "..." }, "bullets": ["..."] }
  ],
  "writing": [
    { "slug": "...", "title": "...", "date": "2026-11-05", "url": "..." }
  ]
}
```

### `/llms.txt`

Plain text at the site root, following the llms.txt convention: an H1, a one-line blurb, then sections of links with one-line descriptions:

- Resume: `/resume.md` (preferred for agents), `/resume.json`, `/resume` (HTML).
- Projects: one link per project page.
- Writing: one link per post.
- A note: "Markdown source for any page is available by fetching the URL with `.md` appended" only if the builder implements that; otherwise omit the sentence. Implementing `.md` for project and thought pages is left to the builder as optional.

## The data

### `src/lib/resume.ts` (grows)

Becomes the single typed source for everything the Resume page, front page paragraph, and machine files need:

- `name`, `title`, `email`, `links {github, linkedin, site}`
- `summary` (markdown string, one paragraph)
- `education { school, location, degree, expected, coursework: string[] }` (the school's location stays, as on the PDF)
- `skills: string[]` (keep the current order, it is the PDF order)
- `experience[] { title, company, start: "YYYY-MM", end: "YYYY-MM" | null, period, bullets: string[] }`

Experience content is transcribed from the PDF: five entries, two bullets each (the current one-line `highlight` field goes away; the front page no longer needs it).

### `content/projects/<slug>.md` (new)

Frontmatter:

```yaml
title: apted
tagline: "Chrome extension that tailors a resume to the job page you're on. *10 min → 30 s.*"
period: May 2026 – Present
start: 2026-05
end:              # empty or omitted = present
stack: [Next.js, Supabase, Fly.io, Stripe, LaTeX]
links:
  github: https://github.com/...
  store: https://chromewebstore.google.com/...
diagram: apted.svg
diagramCaption: How a tailored resume gets made
bullets:
  - Cut resume tailoring time from 10 minutes to 30 seconds with a custom LLM tailoring harness.
  - Added LLM-as-judge validation and PII scrubbing to catch bad rewrites and protect user data.
---
```

Body: markdown in the thoughts format. `tagline` supports `*em*` for the metric. `bullets` are the resume bullets, taken verbatim from the PDF for the four existing projects. Projects are loaded by a `src/lib/projects.ts` that mirrors `thoughts.ts`.

Four project files ship with this work: apted, AggieDine, CORTEX, findMoto, with frontmatter and resume bullets filled from the PDF. Lloyd's decision: the builder reads the actual code and writes the bodies and diagrams from it. Sources: `~/code/apted` (local checkout) and `github.com/premiumfriedrice/apted`, `github.com/premiumfriedrice/CortexiOSApp`, `github.com/premiumfriedrice/FindMotoV2`. AggieDine has no repo under Lloyd's account; its body comes from the PDF bullets alone and is marked in the file with an HTML comment asking Lloyd to point the builder at the repo. Each body is a lede plus the four template sections (What it does / How it's built / Decisions / Results), written in Lloyd's plain first-person register from the Nov 5 post, stating only what the code shows. Where the code and the PDF disagree (apted's tagline, for instance), the code wins and the builder tells Lloyd what changed. Each project gets a finished diagram drawn from the code (below).

### `content/projects/<slug>.svg` (new)

One hand-written SVG per project, inlined at render. Style rules, written into `content/projects/README.md` and followed for the four shipped diagrams:

- `viewBox="0 0 520 H"`, no fixed width/height; the page sets width 100%.
- Nodes: `rect` with `rx="3"`, `fill="#fff"`, `stroke="#525252"`, `stroke-width="1"`. Minimum 84×34.
- External systems and the final output: same rect with `stroke-dasharray="3 3"`.
- Labels: `font-family="inherit"`, main label 12px `#171717` centered, optional sub-label 10.5px `#8f8f8f` on a second line.
- Arrows: `stroke="#8f8f8f"`, `stroke-width="1"`, one shared `<marker>` arrowhead, straight or single-elbow paths only. Feedback or retry edges use `stroke-dasharray="2 3"` with a tiny 9px label.
- Nothing else: no fills other than white, no shadows, no icons, no color.
- Target eight nodes or fewer. If a system needs more, split into two figures.

The four initial diagrams are drawn from the repositories, not from the brainstorm mockups. The mockup apted flow (extension scrapes the job page and reads resume.md from this site) was a guess and the reviewer found the repo describes a Next.js web app that tailors from a pasted job description, a LaTeX compile service, an LLM-as-judge pass, and a browser extension that drops the rendered PDF onto application forms. Draw that. Same rule for the others: nodes are the real services, clients, stores, and external systems the code talks to, with the PDF bullets used only to pick which parts matter. AggieDine, with no repo available, is drawn from the bullets (clients → scale-to-zero AWS backend → data store) with generic AWS component names and a comment in the SVG saying so.

### `content/projects/README.md` (new)

Mirrors the thoughts README: file naming, frontmatter fields, the section template, the SVG style rules, and "commit and push; Vercel publishes it."

## Navigation

`Nav.tsx` LINKS becomes: Lloyd Alba `/`, Projects `/projects`, Writing `/writings`, Resume `/resume`. `Rail` and `TopNav` both read it, so one change. `current` ids: `home`, `projects`, `writings`, `resume`.

## Constraints for the builder

- Static output only. Route handlers for `.md`, `.json`, and `llms.txt` must be statically generated at build (no request-time work).
- Reuse `renderMarkdown` and the existing post CSS for project pages. Do not fork the stylesheet; add rules only for the figure card, the front-page label row with its right-aligned link, and the resume page's experience blocks.
- Keep `README.md` files in `content/` unpublished, as the thoughts loader already does.
- Mobile must work; Lloyd tests on an iPhone. The rail breakpoint and top nav already exist.
- Verify with the existing headless Chrome flow on `next start`, then on the live site after deploy, and tell Lloyd to hard-refresh.
- Build must pass with the three existing thought files in place. Do not delete or move the Nov 3 or Nov 2 files; do not push them. Lloyd decides when they ship.

## Left to the builder

- Exact SVG coordinates and the pixel layout of each diagram, within the style rules.
- Whether `.md` variants of project and thought pages are served (nice for agents, optional).
- How dates are parsed for sorting (`start` in frontmatter is `YYYY-MM`; thought dates are "Nov 5, 2026" strings).
- Where the figure CSS lives and its exact spacing.
- Whether the Resume page experience blocks use `<table>` or a grid; match the existing hairline look either way.
- Internal file organization (`src/lib/projects.ts`, route handler paths).

## Acceptance

- `/` shows masthead, paragraph, three projects, three writings (or none if fewer than two), foot line, and no scrollbar at 1280×800.
- `/projects/apted` shows the diagram as Figure 1 under the lede, with "System" as the first rail link, and prints to PDF with the diagram intact.
- `/resume` shows every bullet from the PDF; `/resume.md` and `/resume.json` contain the same bullets, the same project list, and every published post URL; `/llms.txt` links to all of them. None of them contains "Round Rock" or "College Station" outside the education entry.
- Each project page's body and diagram match the repository it was read from, and the builder's hand-over lists every place the code contradicted the PDF or the brainstorm.
- `grep -c 512-992` across the build output returns zero.
- Lint and build pass; the live site renders correctly on an iPhone.
