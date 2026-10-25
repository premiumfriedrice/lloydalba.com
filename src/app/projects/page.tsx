import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Projects - Lloyd Alba",
  description: "Selected projects. Full project index coming soon.",
};

export default function ProjectsIndexPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink no-underline mb-12"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <h1 className="text-[32px] leading-tight tracking-tight font-medium text-ink mb-4">
        Projects
      </h1>
      <p className="text-muted max-w-md">
        A redesigned project index is on the way. You can still open individual
        project pages from the homepage.
      </p>
    </div>
  );
}
