import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";
import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/lib/projects";

export default function ProjectGrid() {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <section className="py-12 animate-fade-up delay-2">
      <SectionHeader index="01" title="Selected Work" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 mb-8">
        {featured.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink no-underline group"
      >
        View all projects
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </section>
  );
}
