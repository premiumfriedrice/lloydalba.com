import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/projects";

export default function Objects() {
  return (
    <div className="objects">
      {projects.map((project) => {
        const href = project.externalLink ?? `/projects/${project.slug}`;
        const label = project.skills.slice(0, 3).join(", ");

        return (
          <Link
            key={project.slug}
            href={href}
            target={project.externalLink ? "_blank" : undefined}
            rel={project.externalLink ? "noopener noreferrer" : undefined}
            className="object"
          >
            <div className="relative w-full aspect-[4/3] mb-1.5 overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 20vw"
                  unoptimized={project.image.endsWith(".gif")}
                />
              ) : (
                <div className="w-full h-full bg-well" />
              )}
            </div>
            <strong>{project.name}</strong>
            <span>{label}</span>
          </Link>
        );
      })}
    </div>
  );
}
