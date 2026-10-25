import { Github, Linkedin, Mail } from "lucide-react";

const socials = [
  { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
];

export default function Masthead() {
  return (
    <header className="masthead">
      <div className="title-row">
        <h1 className="title">
          Lloyd Alba<span> · Software Engineer</span>
        </h1>
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
      </div>
      <p className="statement">
        I build systems and products at the intersection of AI and human-centered design.
      </p>
    </header>
  );
}
