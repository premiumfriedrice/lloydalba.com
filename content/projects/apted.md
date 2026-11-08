---
title: apted
tagline: "Tailors my resume to the job page I'm on and drops the PDF into the application. 10 min → 30 s."
period: May 2026 – Present
start: "2026-05"
stack: [Next.js, TypeScript, Postgres, LaTeX, Chrome extension]
links:
  github: https://github.com/premiumfriedrice/apted
diagram: apted.svg
diagramCaption: From a job page to a tailored PDF
bullets:
  - Cut resume tailoring time from 10 minutes to 30 seconds with a custom LLM tailoring harness.
  - Added LLM-as-judge validation and PII scrubbing to catch bad rewrites and protect user data.
---

apted is the tool I built so I would stop spending ten minutes per application rewriting my resume by hand. My master resume lives in one place, I point it at a job description, and it hands back a tailored one-page PDF that I can drop straight into the application form.

## What it does

Three pieces work together: a web app, a Chrome extension, and a small service that turns LaTeX into PDFs.

Open a job on LinkedIn, Greenhouse, Lever, Workday, or Ashby and the extension's drawer slides in. It scrapes the job description off the page, sends it to the web app, and the web app tailors a resume from my master copy. The drawer shows the PDF, lets me drag it into the application's file input, and fills the contact fields from my profile. Each application I submit gets tracked with an outcome (applied, interview, offer, rejected), and the web app shows them as a funnel.

One sentence version: one master resume in, one tailored PDF out, in about thirty seconds.

## How it's built

**Web app.** Next.js, with Postgres on Supabase behind it. The master resume is a single JSON record, and it is the only source of truth. The master editor is prose first: I dump raw memories into a textarea, hit generate, and a model turns them into structured bullets that get merged with what's already there.

**Tailoring.** Tailoring runs in two phases. A cheap model reads the job description and a skeleton of the master, and returns keep/drop decisions for every section and item. A stronger model then gets the filtered master, the job description, and the five most relevant prior versions, and writes the tailored resume as JSON with XYZ-formatted bullets.[^rank]

**Editing.** The builder page has a chat panel next to a live PDF preview. Each message calls the edit endpoint with the draft id and the instruction. The draft is the state; chat history is never replayed.[^undo]

**Rendering.** The resume JSON gets serialized to `.tex` using Jake Gutierrez's resume template macros, then posted to the compile service, which runs Tectonic in a container on Fly.io and sends back a PDF.[^compile]

**Extension.** Vanilla TypeScript, no framework. The drawer is a content script in a shadow DOM so the host page's CSS can't reach it. There's one scraper per job site, a background service worker that owns every network call to the web app, a PDF cache, an autofill script that runs inside apply iframes, and a tracker that stays in sync with the web app.

**Redaction.** Before anything is stored or sent to a model, contact info and organization names are swapped for placeholders. They get put back only when the PDF is rendered.[^redact]

## Decisions

**One JSON record is the master.** Everything else is derived from it, so there is no second copy that can drift.

**Two models, not one.** The cheap one decides what is relevant. The expensive one only writes. That keeps the strong model's context small and the bill down.

**The draft is the state, not the chat.** Every edit mutates the draft directly. A long session doesn't get slower, and undo is just popping a stack.

**LaTeX, compiled somewhere else.** Tectonic is a binary that runs as a subprocess. I didn't want that inside the web app's runtime, so it has its own container with a two-route HTTP server in front of it.

**Redact before anything leaves.** The models and the database only ever see `[NAME]`, `[EMAIL]`, `[ORG-0]`. This is what makes "my data doesn't leak into prompts" actually true.

**The extension never touches the network.** The service worker owns every fetch, so auth and CORS live in one place and the content scripts stay dumb.

## Results

- Tailoring a resume went from about ten minutes of hand editing to about thirty seconds.
- Every saved version carries its outcome, so later tailoring runs can lean on the versions that actually got interviews, and the application funnel is real data instead of a spreadsheet.
- Still to do: API key management in settings, more render templates.

[^rank]: Relevance started as plain keyword overlap between the job description and each saved version. I left an embeddings-based ranker behind the same function signature for when overlap gets too brittle.

[^undo]: Every edit pushes the previous JSON onto an undo stack capped at 20 entries.

[^compile]: The compile service is a Node HTTP server with two routes: `POST /compile` takes raw `.tex` and returns a PDF (or the log on failure), and `GET /health`. It caps the body at 1.5 MB, which is plenty for a one-page resume.

[^redact]: Two passes. The first swaps contact info (name, phone, email, links) for `[NAME]`, `[PHONE]`, `[EMAIL]`, `[LINK-n]`. The second swaps organization names (companies, schools, project names) for `[ORG-n]`. Each pass returns the redacted resume and a map that reverses it.
