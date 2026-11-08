import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Rail, TopNav } from "@/components/Nav";
import { PostToc } from "@/components/PostToc";
import { CodeCopy } from "@/components/CodeCopy";
import { PrintLink } from "@/components/PrintLink";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWritings().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);
  return { title: writing ? `${writing.title} — Lloyd Alba` : "Lloyd Alba" };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const writing = getWritingBySlug(slug);
  if (!writing) notFound();

  return (
    <div className="page">
      <Rail current="writings">
        <PostToc toc={writing.toc} />
      </Rail>
      <main className="column">
        <TopNav current="writings" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">{writing.title}</h1>
          </div>
          <ul className="masthead-line">
            {writing.date && <li>{writing.date}</li>}
            <li>{writing.readTime}</li>
            <li className="print-only-hide">
              <PrintLink />
            </li>
          </ul>
        </header>

        <article
          className="writing post-body"
          dangerouslySetInnerHTML={{ __html: writing.html }}
        />
        <CodeCopy />
      </main>
    </div>
  );
}
