import { Github, Linkedin, Mail } from "lucide-react";
import IconLink from "@/components/IconLink";
import SectionHeader from "@/components/SectionHeader";

const socials = [
  { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
];

export default function ContactColophon() {
  return (
    <section className="py-12 animate-fade-up delay-4">
      <SectionHeader index="03" title="Contact" />

      <p className="text-muted max-w-md mb-4">
        Open to interesting projects, collaborations, and conversations about tools
        that make building software more humane.
      </p>

      <a
        href="mailto:lloyddalba@gmail.com"
        className="inline-block text-ink font-medium text-lg mb-6 no-underline hover:text-accent transition-colors"
      >
        lloyddalba@gmail.com
      </a>

      <div className="flex items-center gap-4">
        {socials.map((s) => (
          <IconLink key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
