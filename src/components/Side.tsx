import Link from "next/link";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export default function Side({ page }: { page: string }) {
  return (
    <aside className="side">
      <p className="name">Lloyd Alba</p>
      <p className="page">{page}</p>
      <nav aria-label="Site">
        {PAGES.filter((p) => p.label !== page).map((p) => (
          <Link key={p.href} href={p.href} className="link">
            {p.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
