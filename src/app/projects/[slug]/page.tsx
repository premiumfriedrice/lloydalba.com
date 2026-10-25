import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Side from "@/components/Side";
import Credit from "@/components/Credit";
import { projects, getProjectBySlug } from "@/lib/projects";
import { getThoughtsByProject } from "@/lib/thoughts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Not Found" };
  return {
    title: `${project.name} - Lloyd Alba`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const relatedThoughts = await getThoughtsByProject(project.slug);
  const year = project.startDate
    ? new Date(project.startDate).getFullYear()
    : null;
  const repoUrl = project.githubRepo
    ? `https://github.com/${project.githubRepo}`
    : null;

  return (
    <div className="shell">
      <Side page="Projects" />
      <main className="content">
        <p className="line">
          <Link className="link" href="/projects">
            All projects
          </Link>
        </p>

        <p className="bio">
          <strong>{project.name}</strong> — {project.description}
        </p>

        <p className="line">{project.skills.join(" · ")}</p>

        <p className="line">
          {repoUrl && (
            <a
              className="link"
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Repository
            </a>
          )}
          {repoUrl && project.externalLink && " · "}
          {project.externalLink && (
            <a
              className="link"
              href={project.externalLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Demo
            </a>
          )}
          {year && ` · ${year}`}
        </p>

        {relatedThoughts.length > 0 && (
          <>
            <p className="label">Notes</p>
            <ul className="list">
              {relatedThoughts.map((thought) => (
                <li key={thought.slug}>
                  <span className="k">{thought.title}</span>
                  <span className="v">{thought.tags.join(", ")}</span>
                  <span className="n">{thought.date}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
      <Credit />
    </div>
  );
}
