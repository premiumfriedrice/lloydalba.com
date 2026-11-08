import type { Metadata } from "next";
import Link from "next/link";
import { Rail, TopNav } from "@/components/Nav";
import { getAllWritings } from "@/lib/writings";

export const metadata: Metadata = {
  title: "Writing — Lloyd Alba",
  description: "Some stuff I need to write down and let others see.",
};

export default function WritingsPage() {
  const writings = getAllWritings();

  return (
    <div className="page">
      <Rail current="writings" />
      <main className="column">
        <TopNav current="writings" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              Writing<span> · {writings.length}</span>
            </h1>
          </div>
          <p className="statement">
            Some stuff I need to write down and let others see.
          </p>
        </header>

        {writings.length > 0 ? (
          <div className="faq">
            {writings.map((writing) => (
              <details key={writing.slug}>
                <summary>
                  <span className="s-title">{writing.title}</span>
                  <span className="s-note">
                    {writing.date} · {writing.readTime}
                  </span>
                </summary>
                <Link
                  href={`/writings/${writing.slug}`}
                  className="preview"
                  aria-label={`Read ${writing.title}`}
                >
                  <div
                    className="writing preview-body"
                    dangerouslySetInnerHTML={{ __html: writing.html }}
                  />
                  <span className="preview-more">Read →</span>
                </Link>
              </details>
            ))}
          </div>
        ) : (
          <p className="statement">Nothing here yet.</p>
        )}
      </main>
    </div>
  );
}
