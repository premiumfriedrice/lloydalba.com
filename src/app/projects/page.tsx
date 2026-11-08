import type { Metadata } from "next";
import { Rail, TopNav } from "@/components/Nav";
import { getAllProjects } from "@/lib/projects";
import { PeekList } from "@/components/PeekList";

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
          <PeekList
            items={projects.map((p) => ({
              href: `/projects/${p.slug}`,
              title: p.title,
              note: p.period,
              subHtml: p.taglineHtml,
              html: p.html,
            }))}
          />
        ) : (
          <p className="statement">Nothing here yet.</p>
        )}
      </main>
    </div>
  );
}
