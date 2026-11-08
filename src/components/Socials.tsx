import { Github, Linkedin, Mail } from "lucide-react";

const socials = [
  { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
];

/** The three social icons shown in the masthead. */
export function Socials() {
  return (
    <ul className="social">
      {socials.map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target={s.label !== "Email" ? "_blank" : undefined}
            rel={s.label !== "Email" ? "noopener noreferrer" : undefined}
            aria-label={s.label}
          >
            <s.icon size={14} />
          </a>
        </li>
      ))}
    </ul>
  );
}
