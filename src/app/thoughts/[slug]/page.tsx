import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Rail, TopNav } from "@/components/Nav";
import { getAllThoughts, getThoughtBySlug } from "@/lib/thoughts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllThoughts().map((thought) => ({ slug: thought.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const thought = getThoughtBySlug(slug);
  if (!thought) return { title: "Not Found" };
  return { title: `${thought.title} — Lloyd Alba` };
}

export default async function ThoughtPage({ params }: Props) {
  const { slug } = await params;
  const thought = getThoughtBySlug(slug);
  if (!thought) notFound();

  return (
    <div className="page">
      <Rail current="thoughts" />
      <main className="column">
        <TopNav current="thoughts" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              {thought.title}
              <span> · {thought.date}</span>
            </h1>
          </div>
        </header>

        <div
          className="thought"
          dangerouslySetInnerHTML={{ __html: thought.html }}
        />

        <p className="label">
          <Link href="/thoughts">All thoughts</Link>
        </p>
      </main>
    </div>
  );
}
