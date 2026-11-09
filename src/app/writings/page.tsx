import type { Metadata } from "next";
import { Rail, TopNav } from "@/components/Nav";
import { getAllWritings } from "@/lib/writings";
import { PeekList } from "@/components/PeekList";

export const metadata: Metadata = {
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
              Writings<span> · {writings.length}</span>
            </h1>
          </div>
          <p className="statement">
            Some stuff I need to write down and let others see.
          </p>
        </header>

        {writings.length > 0 ? (
          <PeekList
            items={writings.map((w) => ({
              href: `/writings/${w.slug}`,
              title: w.title,
              note: `${w.date} · ${w.readTime}`,
              html: w.html,
            }))}
          />
        ) : (
          <p className="statement">Nothing here yet.</p>
        )}
      </main>
    </div>
  );
}
