import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Rail, TopNav } from "@/components/Nav";
import { PostToc } from "@/components/PostToc";
import { CodeCopy } from "@/components/CodeCopy";
import { PrintLink } from "@/components/PrintLink";
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
      <Rail current="thoughts">
        <PostToc toc={thought.toc} />
      </Rail>
      <main className="column">
        <TopNav current="thoughts" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">{thought.title}</h1>
          </div>
          <ul className="masthead-line">
            {thought.date && <li>{thought.date}</li>}
            <li>{thought.readTime}</li>
            <li className="print-only-hide">
              <PrintLink />
            </li>
          </ul>
        </header>

        <article
          className="thought post-body"
          dangerouslySetInnerHTML={{ __html: thought.html }}
        />
        <CodeCopy />
      </main>
    </div>
  );
}
