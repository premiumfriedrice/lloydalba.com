import type { Metadata } from "next";
import Link from "next/link";
import { Rail, TopNav } from "@/components/Nav";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Lloyd Alba",
  description: "Things I've built, each with a system diagram.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="page">
      <Rail current="projects" />
      <main className="column">
        <TopNav current="projects" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              Projects<span> · {projects.length}</span>
            </h1>
          </div>
        </header>

        {projects.length > 0 ? (
          <ul className="index">
            {projects.map((project) => (
              <li key={project.slug}>
                <span className="k">
                  <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                </span>
                <span className="v" dangerouslySetInnerHTML={{ __html: project.taglineHtml }} />
                <span className="n">{project.period}</span>
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
