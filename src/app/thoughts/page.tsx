import type { Metadata } from "next";
import { Rail, TopNav } from "@/components/Nav";
import { getAllThoughts } from "@/lib/thoughts";

export const metadata: Metadata = {
  title: "Thoughts — Lloyd Alba",
  description: "Some stuff I need to write down and let others see.",
};

export default function ThoughtsPage() {
  const thoughts = getAllThoughts();

  return (
    <div className="page">
      <Rail current="thoughts" />
      <main className="column">
        <TopNav current="thoughts" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              Thoughts<span> · {thoughts.length}</span>
            </h1>
          </div>
          <p className="statement">
            Some stuff I need to write down and let others see.
          </p>
        </header>

        {thoughts.length > 0 ? (
          <div className="faq">
            {thoughts.map((thought) => (
              <details key={thought.slug}>
                <summary>
                  <span className="s-title">{thought.title}</span>
                  <span className="s-note">{thought.date}</span>
                </summary>
                <div
                  className="thought"
                  dangerouslySetInnerHTML={{ __html: thought.html }}
                />
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
