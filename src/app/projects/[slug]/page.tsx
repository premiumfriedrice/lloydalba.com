import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Rail, TopNav } from "@/components/Nav";
import { PostToc } from "@/components/PostToc";
import { CodeCopy } from "@/components/CodeCopy";
import { DiagramToggle } from "@/components/DiagramToggle";
import { getAllProjects, getProjectBySlug, withDiagram } from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project ? `${project.title} — Lloyd Alba` : "Lloyd Alba" };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const toc = project.diagramSvg
    ? [{ id: "system", title: "System", children: [] }, ...project.toc]
    : project.toc;

  return (
    <div className="page">
      <Rail current="projects">
        <PostToc toc={toc} />
      </Rail>
      <main className="column">
        <TopNav current="projects" />

        <header className="masthead">
          <Link href="/projects" className="back">
            ← Projects
          </Link>
          <div className="title-row">
            <h1 className="title">{project.title}</h1>
          </div>
          <ul className="masthead-line">
            {project.period && <li>{project.period}</li>}
            {project.stack.length > 0 && <li>{project.stack.join(", ")}</li>}
            {Object.entries(project.links).map(([label, href]) => (
              <li key={label}>
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </header>

        <article
          className="writing post-body"
          dangerouslySetInnerHTML={{ __html: withDiagram(project) }}
        />
        <CodeCopy />
        <DiagramToggle />
      </main>
    </div>
  );
}
