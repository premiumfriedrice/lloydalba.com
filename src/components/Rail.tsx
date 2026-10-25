import Link from "next/link";

const siteLinks = [
  { href: "/", label: "Lloyd Alba" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

const toc = [
  { href: "#projects", label: "Projects" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export default function Rail() {
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
        {toc.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
