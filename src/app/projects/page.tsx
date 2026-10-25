import type { Metadata } from "next";
import Link from "next/link";
import Rail from "@/components/Rail";
import TopBar from "@/components/TopBar";
import Section from "@/components/Section";
import Colophon from "@/components/Colophon";
import { projects } from "@/lib/projects";
import type { Project } from "@/types";

export const metadata: Metadata = {
  title: "Projects - Lloyd Alba",
  description:
    "Selected projects — what I'm building now, and what has shipped.",
};

function rows(list: Project[]) {
  return list.map((project) => {
    const href = project.externalLink ?? `/projects/${project.slug}`;
    const year = project.startDate
      ? new Date(project.startDate).getFullYear()
      : null;

    return (
      <tr key={project.slug}>
        <th scope="row">
          <Link
            href={href}
            target={project.externalLink ? "_blank" : undefined}
            rel={project.externalLink ? "noopener noreferrer" : undefined}
          >
            {project.name}
          </Link>
        </th>
        <td>{project.description}</td>
        <td className="num">{year}</td>
      </tr>
    );
  });
}

export default function ProjectsIndexPage() {
  const current = projects.filter((p) => p.status === "current");
  const past = projects.filter((p) => p.status !== "current");

  return (
    <div className="page">
      <Rail
        toc={[
          { href: "#current", label: "Current" },
          { href: "#past", label: "Past" },
        ]}
      />
      <main className="column">
        <TopBar />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              Projects<span> · Lloyd Alba</span>
            </h1>
          </div>
          <p className="statement">
            Selected work — what I&apos;m building now, and what has shipped.
          </p>
        </header>

        <Section id="current">
          <p>Active projects I&apos;m building and maintaining.</p>
          <table className="table">
            <tbody>{rows(current)}</tbody>
          </table>
        </Section>

        <Section id="past">
          <p>Shipped and archived.</p>
          <table className="table">
            <tbody>{rows(past)}</tbody>
          </table>
        </Section>

        <Colophon />
      </main>
    </div>
  );
}
