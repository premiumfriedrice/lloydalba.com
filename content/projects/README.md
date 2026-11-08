# Projects

Drop a markdown file and an SVG in this folder to publish a project. It gets
its own page at `/projects/<slug>` in the same document layout as a writing
(numbered sections, side links, margin notes), with the system diagram as
Figure 1 right under the intro. The three newest show on the front page.

- Filename: `<slug>.md`. The slug is the URL: `apted.md` → `/projects/apted`.
- Diagram: `<slug>.svg` next to it, named in the frontmatter.
- Commit and push; Vercel publishes it.

This README is not published.

## Frontmatter

    ---
    title: apted
    tagline: "One plain line for the lists."
    period: May 2026 – Present
    start: "2026-05"        # YYYY-MM, used for sorting (quote it)
    end: "2026-08"          # YYYY-MM, or leave out when still running
    stack: [Next.js, TypeScript, Postgres]
    links:                  # only public URLs; leave out what isn't
      github: https://github.com/...
    diagram: apted.svg
    diagramCaption: From a job page to a tailored PDF
    bullets:                # the resume bullets, verbatim; these feed /resume and resume.json
      - First bullet.
      - Second bullet.
    ---

## Body template

    One to three intro sentences. This is the lede; the diagram follows it.

    ## What it does

    ## How it's built

    ## Decisions

    ## Results

Every markdown feature from `content/writings/README.md` works here too:
`##` sections become numbered and jump-linked, `###` nest under them, code
fences with `title="file"` become titled cards, `> — source` becomes a pull
quote, and footnotes (`[^id]` in the text, `[^id]: note` at the bottom)
become margin notes. Use margin notes for the trouble you ran into.

## Diagram rules

Hand-written SVG, boxes and arrows, nothing else.

- `viewBox="0 0 520 H"`, no `width`/`height` attributes. The page sets the width.
- Nodes: `<rect>` with `rx="3"`, `fill="#fff"`, `stroke="#525252"`, `stroke-width="1"`. At least 84×34.
- External systems and the final output: same rect with `stroke-dasharray="3 3"`.
- Labels: `font-family="inherit"`. Main label 12px `#171717`, centered. Optional sub-label 10.5px `#8f8f8f` on a second line.
- Arrows: `stroke="#8f8f8f"`, `stroke-width="1"`, one shared `<marker>` arrowhead, straight or single-elbow paths only. Feedback or retry edges use `stroke-dasharray="2 3"` with a 9px label.
- No fills other than white, no shadows, no icons, no color.
- Eight nodes or fewer. If a system needs more, split it into two figures.
