import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SectionHeader from "@/components/SectionHeader";

export default function AboutTeaser() {
  return (
    <section className="py-12 animate-fade-up delay-3">
      <SectionHeader index="02" title="About" />

      <p className="text-muted max-w-xl mb-6 leading-relaxed">
        I’m a software engineer who likes to work close to the product: shipping
        features, refining interactions, and building systems that stay maintainable
        as they grow. Right now I’m especially interested in agentic AI, iOS craft,
        and tools that make engineering teams more effective.
      </p>

      <Link
        href="/about"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink no-underline group"
      >
        More about me
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </Link>
    </section>
  );
}
