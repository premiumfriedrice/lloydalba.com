# Thoughts

Drop a markdown file in this folder to publish a thought. It shows up on the
Thoughts list (title, date, read time, a faded preview) and gets its own page
styled like the docs on skills.wheresryan.sh/anatomy.

- Filename: `YYYY-MM-DD-your-title.md`, with a two-digit month and day so posts sort correctly.
  The filename becomes the URL: `/thoughts/YYYY-MM-DD-your-title`.
- Frontmatter: `title` and `date`.
- Commit and push; Vercel publishes it.

This README is not published.

## Template

    ---
    title: Building an inference server
    date: Nov 3, 2026
    ---

    One or two intro paragraphs. These become the lede, and the start of
    this is what the Thoughts list previews.

    ## First section

    Each `##` heading starts a numbered section (01, 02, …) with a ruled
    head, and is listed in the side "on this page" links.

    ### A smaller part

    `###` headings appear nested under their section in the side links.
    `####` headings are styled the same but stay out of the side links.

## What each markdown feature turns into

| Write this | You get |
|---|---|
| Paragraphs before the first `##` | The intro (lede) |
| `## Heading` | Numbered section + side link |
| `### Heading` | Sub-link under its section in the side links |
| ` ```bash ` fenced code | Code card with a copy button, light syntax colour |
| ` ```yaml title="compose.yml" ` | Code card with a filename head |
| `> A line worth quoting.` | Large serif pull quote |
| `> — Where it's from` as the quote's last line | The quote's source line |
| `Some claim.[^1]` and later `[^1]: The note.` | Margin note beside the text on wide screens, numbered list at the end on phones |
| `*italic*` | Serif italic, like Anatomy's emphasis |
| `**bold**`, `` `code` ``, links, lists, `~~strike~~` | Standard formatting |
| `- [x] done` / `- [ ] todo` | Checklist |
| Tables | Ruled tables |
| `---` | A hairline divider |

For code with no language, use `text`: ` ```text title="Caddyfile" `.

## Images and videos

Put files in `public/media/` and reference them from `/media/`.
Markdown image syntax handles all media types:

    ![Alt text](/media/photo.jpg)                    image
    ![Alt text](/media/clip.mp4)                     video player (mp4, webm, mov, m4v)
    ![Alt text](https://youtu.be/VIDEO_ID)           YouTube embed (Vimeo links work too)
    ![Alt text](/media/photo.jpg "Caption here")     add a caption to any of the above

Media on its own line becomes a figure on the post page. The preview on the
Thoughts list only shows text.

Keep videos small (under ~20 MB). For anything longer, upload to YouTube and embed it.
