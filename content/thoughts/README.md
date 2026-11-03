# Thoughts

Drop a markdown file in this folder to publish a thought.

- Filename: `YYYY-MM-DD-your-title.md` (becomes the URL slug)
- Frontmatter: `title` and `date`
- Body: any markdown, including tables, checklists, ~~strikethrough~~, and raw HTML

Example:

    ---
    title: On building in public
    date: Mar 2026
    ---

    The body of the thought.

## Images and videos

Put files in `public/media/` and reference them from `/media/`.
Markdown image syntax handles all media types:

    ![Alt text](/media/photo.jpg)                    image
    ![Alt text](/media/clip.mp4)                     video player (mp4, webm, mov, m4v)
    ![Alt text](https://youtu.be/VIDEO_ID)           YouTube embed (Vimeo links work too)
    ![Alt text](/media/photo.jpg "Caption here")     add a caption to any of the above

Media on its own line is shown as a full-width figure on the post page.
The preview on the Thoughts list only shows text.

Keep videos small (under ~20 MB). For anything longer, upload to YouTube and embed it.

This README is not published.
