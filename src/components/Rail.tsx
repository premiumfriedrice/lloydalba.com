import Link from "next/link";

const siteLinks = [
  { href: "/", label: "Lloyd Alba" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

const defaultToc = [
  { href: "#projects", label: "What I build" },
  { href: "#experience", label: "Where I've worked" },
  { href: "#about", label: "About" },
  { href: "#recognition", label: "Recognition" },
  { href: "#contact", label: "Contact" },
];

export default function Rail({
  toc = defaultToc,
}: {
  toc?: { href: string; label: string }[];
}) {
  return (
    <aside className="rail">
      <nav aria-label="Site">
        <ul className="nav">
          {siteLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <ol aria-label="On this page" className="toc">
        {toc.map((link, i) => (
          <li key={link.href} style={{ ["--i" as string]: i }}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
