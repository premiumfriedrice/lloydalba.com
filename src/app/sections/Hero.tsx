import { Github, Linkedin, Mail, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import IconLink from "@/components/IconLink";
import { getActiveStatus } from "@/lib/status";
import { projects } from "@/lib/projects";

const links = [
  { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
  { href: "/documents/LloydAlba_Resume.pdf", icon: FileText, label: "Resume" },
];

export default async function Hero() {
  let status = { slug: "lloydalba-dev", pushedAt: null as string | null };
  try {
    status = await getActiveStatus();
  } catch {
    // keep fallback
  }

  const project = projects.find((p) => p.slug === status.slug);
  const projectName = project?.name ?? status.slug;
  const timeAgo = status.pushedAt
    ? formatDistanceToNow(new Date(status.pushedAt), { addSuffix: true })
    : null;

  return (
    <section className="pt-32 pb-16 md:pt-44 md:pb-24 animate-fade-up">
      <h1 className="text-[44px] leading-[0.95] tracking-tight font-medium text-ink mb-4">
        Lloyd Alba
      </h1>
      <p className="text-muted max-w-md mb-6">
        Software engineer building systems at the intersection of AI and human-centered design.
      </p>

      <div className="flex items-center gap-3 text-sm text-muted mb-8">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
        </span>
        <span>
          {timeAgo
            ? `Last shipped ${timeAgo} on ${projectName}`
            : "Currently shipping"}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {links.map((link) => (
          <IconLink key={link.label} {...link} />
        ))}
      </div>
    </section>
  );
}
