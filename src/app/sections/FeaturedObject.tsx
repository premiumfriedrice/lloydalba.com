import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import { projects } from "@/lib/projects";

export default function FeaturedObject() {
  const project = projects.find((p) => p.image) ?? projects[0];
  const href = project.externalLink ?? `/projects/${project.slug}`;
  const year = project.startDate
    ? new Date(project.startDate).getFullYear()
    : undefined;

  return (
    <section className="py-12 animate-fade-up delay-1">
      <SectionHeader index="00" title="Featured" />

      <Link
        href={href}
        target={project.externalLink ? "_blank" : undefined}
        rel={project.externalLink ? "noopener noreferrer" : undefined}
        className="group block border border-rule rounded-xl overflow-hidden bg-well no-underline card-hover"
      >
        <div className="relative aspect-video overflow-hidden border-b border-rule">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.75,0.2,1)] group-hover:-translate-y-1"
              sizes="(max-width: 768px) 100vw, 560px"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted text-xs">
              {project.name}
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="text-base font-medium text-ink">{project.name}</h3>
            <ArrowUpRight
              size={16}
              className="text-faint group-hover:text-ink transition-colors"
            />
          </div>
          <p className="text-sm text-muted mb-4">{project.description}</p>
          <p className="text-xs text-faint">
            {project.skills.slice(0, 5).join(" · ")}
            {year && <span className="mx-2 text-rule">|</span>}
            {year}
          </p>
        </div>
      </Link>
    </section>
  );
}
