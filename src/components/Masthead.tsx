import Image from "next/image";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { projects } from "@/lib/projects";

const socials = [
  { href: "https://github.com/premiumfriedrice", icon: Github, label: "GitHub" },
  { href: "https://www.linkedin.com/in/lloydalba/", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:lloyddalba@gmail.com", icon: Mail, label: "Email" },
];

const strip = [
  { title: "lloydalba.dev", href: "/projects/lloydalba-dev", image: "/images/PersonalWebsite.png" },
  { title: "findMoto", href: "/projects/findmoto", image: "/images/findMoto_demo.gif" },
  { title: "Surge New", href: "/projects/surge-new", image: "/images/surge_new.png" },
  { title: "BSMC", href: "/about", image: "/images/bsmc.png" },
  { title: "Anvil", href: "/about", image: "/images/Anvil.png" },
];

export default function Masthead() {
  return (
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
        I build products and systems — mostly <em>AI, iOS, and tooling that
        makes engineers faster</em>.
      </p>
      <div className="masthead-strip">
        {strip.map((item) => (
          <Link key={item.title} href={item.href} title={item.title}>
            <Image
              src={item.image}
              alt={item.title}
              width={800}
              height={600}
              unoptimized={item.image.endsWith(".gif")}
            />
          </Link>
        ))}
      </div>
      <ul className="masthead-line">
        <li>lloydalba.com</li>
        <li>
          <Link href="/projects">{projects.length} selected projects</Link>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/lloydalba/">by Lloyd Alba</a>
        </li>
        <li>Class of 2027 · Texas A&amp;M</li>
        <li>
          <a href="#contact">Contact ↓</a>
        </li>
      </ul>
    </header>
  );
}
