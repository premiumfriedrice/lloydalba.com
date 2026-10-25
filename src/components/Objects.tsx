import Link from "next/link";
import { projects } from "@/lib/projects";

export default function Objects() {
  return (
    <div className="objects">
      {projects.map((project) => {
        const href = project.externalLink ?? `/projects/${project.slug}`;
        const label = project.skills.slice(0, 3).join(", ");
        const initials = project.name.slice(0, 2).toUpperCase();

        return (
          <Link
            key={project.slug}
            href={href}
            target={project.externalLink ? "_blank" : undefined}
            rel={project.externalLink ? "noopener noreferrer" : undefined}
            className="object"
          >
            <span className="thumb">
              <span aria-hidden="true">{initials}</span>
            </span>
            <strong>{project.name}</strong>
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
