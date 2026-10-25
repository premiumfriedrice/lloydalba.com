const CONTACT_EMAIL = "lloyddalba@gmail.com";

const CONTACT_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/premiumfriedrice",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lloydalba/",
  },
  {
    label: "Resume",
    href: "/documents/LloydAlba_Resume.pdf",
  },
];

export { CONTACT_EMAIL, CONTACT_LINKS };

export default function ContactLinks() {
  return (
    <>
      {CONTACT_LINKS.map((link, i) => (
        <span key={link.label}>
          {i > 0 && " · "}
          <a
            className="link"
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        </span>
      ))}
    </>
  );
}
