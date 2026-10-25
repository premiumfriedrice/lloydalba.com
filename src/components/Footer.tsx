import { Github, Linkedin, Mail } from "lucide-react";

const socials = [
  { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule py-8">
      <div className="max-w-2xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted">
          © {year} Lloyd Alba. Built with Next.js & Tailwind.
        </p>

        <div className="flex items-center gap-4">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.label !== "Email" ? "_blank" : undefined}
              rel={s.label !== "Email" ? "noopener noreferrer" : undefined}
              className="text-muted hover:text-ink transition-colors"
              aria-label={s.label}
            >
              <s.icon size={16} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
