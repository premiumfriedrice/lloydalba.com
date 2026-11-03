import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Rail, TopNav } from "@/components/Nav";
import { getAllThoughts, getThoughtBySlug } from "@/lib/thoughts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllThoughts().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const thought = getThoughtBySlug(slug);
  return { title: thought ? `${thought.title} — Lloyd Alba` : "Lloyd Alba" };
}

export default async function ThoughtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thought = getThoughtBySlug(slug);
  if (!thought) notFound();

  return (
    <div className="page">
      <Rail current="thoughts" />
      <main className="column">
        <TopNav current="thoughts" />

        <article className="post">
          <Link href="/thoughts" className="post-back">
            ← Thoughts
          </Link>
          <h1 className="post-title">{thought.title}</h1>
          <p className="post-meta">
            {thought.date} · {thought.readTime}
          </p>
          <div
            className="thought post-body"
            dangerouslySetInnerHTML={{ __html: thought.html }}
          />
        </article>
      </main>
    </div>
  );
}
