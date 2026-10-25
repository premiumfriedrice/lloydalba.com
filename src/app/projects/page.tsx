import type { Metadata } from "next";
import { projects } from "@/lib/projects";
import type { Project } from "@/types";

export const metadata: Metadata = {
  title: "Projects — Lloyd Alba",
  description:
    "Selected projects — what I'm building now, and what has shipped.",
};

function List({ items }: { items: Project[] }) {
  return (
    <ul className="projects">
      {items.map((project) => (
        <li key={project.slug}>
          <span className="k">{project.name}</span>
          <span className="v">{project.skills.join(" · ")}</span>
          {project.period && <span className="n">{project.period}</span>}
        </li>
      ))}
    </ul>
  );
}

export default function ProjectsPage() {
  const current = projects.filter((p) => p.status === "current");
  const past = projects.filter((p) => p.status !== "current");

  return (
    <main className="content">
      <section className="section">
        <div className="inner">
          <p className="line">What I&apos;m building now, and what has shipped.</p>

          <div className="subsec" id="current">
            <p className="label">Current</p>
            <List items={current} />
          </div>

          <div className="subsec" id="past">
            <p className="label">Past</p>
            <List items={past} />
          </div>
        </div>
      </section>
    </main>
  );
}
