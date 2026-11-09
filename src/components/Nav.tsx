import Link from "next/link";
import { ShrimpIndicator } from "@/components/ShrimpIndicator";
import { CritterToggle } from "@/components/CritterToggle";

const LINKS = [
  { href: "/", label: "Lloyd Alba", id: "home" },
  { href: "/projects", label: "Projects", id: "projects" },
  { href: "/writings", label: "Writings", id: "writings" },
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
      <CritterToggle />
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
