import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "About - Lloyd Alba",
  description: "Software engineer portfolio. About page coming soon.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 pt-32 pb-24">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink no-underline mb-12"
      >
        <ArrowLeft size={14} /> Back
      </Link>

      <h1 className="text-[32px] leading-tight tracking-tight font-medium text-ink mb-4">
        About
      </h1>
      <p className="text-muted max-w-md mb-8">
        A refreshed about page is on the way. In the meantime, you can view my
        work on the homepage or download my resume.
      </p>

      <a
        href="/documents/LloydAlba_Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink no-underline"
      >
        View resume
      </a>
    </div>
  );
}
