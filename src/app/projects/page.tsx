import type { Metadata } from "next";
import Link from "next/link";
import Side from "@/components/Side";
import Credit from "@/components/Credit";
import { projects } from "@/lib/projects";
import type { Project } from "@/types";

export const metadata: Metadata = {
  title: "Projects - Lloyd Alba",
  description:
    "Selected projects — what I'm building now, and what has shipped.",
};

function List({ items }: { items: Project[] }) {
  return (
    <ul className="list">
      {items.map((project) => {
        const href = project.externalLink ?? `/projects/${project.slug}`;
        const year = project.startDate
          ? new Date(project.startDate).getFullYear()
          : null;

        return (
          <li key={project.slug}>
            <span className="k">
              <Link
                href={href}
                target={project.externalLink ? "_blank" : undefined}
                rel={
                  project.externalLink ? "noopener noreferrer" : undefined
                }
                className="link"
              >
                {project.name}
              </Link>
            </span>
            <span className="v">{project.description}</span>
            {year && <span className="n">{year}</span>}
          </li>
        );
      })}
    </ul>
  );
}

export default function ProjectsIndexPage() {
  const current = projects.filter((p) => p.status === "current");
  const past = projects.filter((p) => p.status !== "current");

  return (
    <div className="shell">
      <Side page="Projects" />
      <main className="content">
        <p className="bio">
          <strong>Projects</strong> — what I&apos;m building now, and what has
          shipped.
        </p>

        <p className="label">Current</p>
        <List items={current} />

        <p className="label">Past</p>
        <List items={past} />
      </main>
      <Credit />
    </div>
  );
}
