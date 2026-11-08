import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Rail, TopNav } from "@/components/Nav";
import { PostToc } from "@/components/PostToc";
import { CodeCopy } from "@/components/CodeCopy";
import { DiagramToggle } from "@/components/DiagramToggle";
import { PrintLink } from "@/components/PrintLink";
import { getAllWritings, getWritingBySlug } from "@/lib/writings";
import { withDiagram } from "@/lib/diagram";

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

  const toc = writing.diagramSvg
    ? [{ id: "system", title: "System", children: [] }, ...writing.toc]
    : writing.toc;

  return (
    <div className="page">
      <Rail current="writings">
        <PostToc toc={toc} />
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
          dangerouslySetInnerHTML={{ __html: withDiagram(writing) }}
        />
        <CodeCopy />
        <DiagramToggle />
      </main>
    </div>
  );
}
