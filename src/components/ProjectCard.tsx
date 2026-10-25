import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const href = project.externalLink ?? `/projects/${project.slug}`;
  const year = project.startDate
    ? new Date(project.startDate).getFullYear()
    : undefined;

  return (
    <Link
      href={href}
      target={project.externalLink ? "_blank" : undefined}
      rel={project.externalLink ? "noopener noreferrer" : undefined}
      className="group block no-underline"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-rule bg-well mb-3">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.75,0.2,1)] group-hover:-translate-y-1"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted text-xs">
            {project.name}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3 mb-1">
        <h3 className="text-sm font-medium text-ink truncate">{project.name}</h3>
        {year && (
          <span className="text-xs text-faint tabular-nums">{year}</span>
        )}
      </div>

      <p className="text-sm text-muted line-clamp-2 mb-2">{project.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {project.skills.slice(0, 4).map((skill) => (
          <span
            key={skill}
            className="text-[11px] text-muted bg-rule/60 px-1.5 py-0.5 rounded"
          >
            {skill}
          </span>
        ))}
      </div>
    </Link>
  );
}
