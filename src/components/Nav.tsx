import Link from "next/link";
import { ShrimpIndicator } from "@/components/ShrimpIndicator";

const LINKS = [
  { href: "/", label: "Lloyd Alba", id: "home" },
  { href: "/projects", label: "Projects", id: "projects" },
  { href: "/writings", label: "Writing", id: "writings" },
  { href: "/resume", label: "Resume", id: "resume" },
];

export function Rail({
  current,
  children,
}: {
  current: string;
  children?: React.ReactNode;
}) {
  return (
    <aside className="rail">
      <ShrimpIndicator />
      <nav aria-label="Site">
        <ul className="nav">
          {LINKS.map((link) => (
            <li key={link.id}>
              <Link
                href={link.href}
                aria-current={current === link.id ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {children}
    </aside>
  );
}

export function TopNav({ current }: { current: string }) {
  return (
    <nav className="top" aria-label="Site">
      <ShrimpIndicator axis="x" />
      <ul className="nav">
        {LINKS.map((link) => (
          <li key={link.id}>
            <Link
              href={link.href}
              aria-current={current === link.id ? "page" : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
