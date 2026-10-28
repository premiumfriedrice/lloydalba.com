import type { Metadata } from "next";
import Link from "next/link";
import { Rail, TopNav } from "@/components/Nav";
import { getAllThoughts } from "@/lib/thoughts";

export const metadata: Metadata = {
  title: "Thoughts — Lloyd Alba",
  description: "Notes on building things and taking them apart.",
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
              Thoughts<span> · Lloyd Alba</span>
            </h1>
          </div>
          <p className="statement">
            Notes on <em>building things and taking them apart</em>.
          </p>
        </header>

        {thoughts.length > 0 ? (
          <ul className="rows">
            {thoughts.map((thought) => (
              <li key={thought.slug}>
                <Link href={`/thoughts/${thought.slug}`}>{thought.title}</Link>
                <span className="note">{thought.date}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="statement">Nothing here yet.</p>
        )}
      </main>
    </div>
  );
}
