const links = [
  {
    label: "GitHub",
    href: "https://github.com/premiumfriedrice",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lloydalba/",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:lloyddalba@gmail.com",
    external: false,
  },
  {
    label: "Resume",
    href: "/documents/LloydAlba_Resume.pdf",
    external: true,
  },
];

export default function Masthead() {
  return (
    <header className="masthead">
      <h1 className="title">Lloyd Alba</h1>
      <nav className="pills" aria-label="Contact">
        {links.map((link) => (
          <a
            key={link.label}
            className="pill"
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
