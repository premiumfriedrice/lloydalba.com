import type { Metadata } from "next";
import { Rail, TopNav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Thoughts — Lloyd Alba",
  description: "Notes on building things and taking them apart.",
};

const thoughts = [
  { title: "On building in public", date: "Mar 2026" },
  { title: "Notes from shipping Pupil", date: "Feb 2026" },
  { title: "Why I keep rewriting side projects", date: "Jan 2026" },
  { title: "Hello, world", date: "Dec 2025" },
];

export default function ThoughtsPage() {
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

        <ul className="rows">
          {thoughts.map((thought) => (
            <li key={thought.title}>
              <span>{thought.title}</span>
              <span className="note">{thought.date}</span>
            </li>
          ))}
        </ul>

        <footer className="colophon">
          <p>© 2026 Lloyd Alba · College Station, Texas</p>
        </footer>
      </main>
    </div>
  );
}
