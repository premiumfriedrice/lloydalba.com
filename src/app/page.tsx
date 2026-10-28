import { Github, Linkedin, Mail } from "lucide-react";
import { Rail, TopNav } from "@/components/Nav";

const socials = [
  { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
];

export default function Home() {
  return (
    <div className="page">
      <Rail current="home" />
      <main className="column">
        <TopNav current="home" />

        <header className="masthead">
          <div className="title-row">
            <h1 className="title">
              Lloyd Alba<span> · software engineer</span>
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
            I build <em>AI agents, iOS apps, and tools that make engineers
            faster</em>.
          </p>
        </header>

        <div className="lede">
          <p>
            <a href="mailto:lloyddalba@gmail.com">lloyddalba@gmail.com</a>
            {" · "}
            <a
              href="https://github.com/premiumfriedrice"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            {" · "}
            <a
              href="https://www.linkedin.com/in/lloydalba/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>
          </p>
        </div>

        <p className="label">Resume</p>
        <div className="film">
          <iframe
            src="/documents/LloydAlba_Resume.pdf"
            title="Resume — Lloyd Alba"
            loading="lazy"
          />
        </div>
      </main>
    </div>
  );
}
