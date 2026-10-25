import type { LucideIcon } from "lucide-react";

interface IconLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}

export default function IconLink({
  href,
  icon: Icon,
  label,
  external = href.startsWith("http") || href.startsWith("mailto:"),
}: IconLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="inline-flex items-center justify-center text-muted hover:text-ink transition-colors"
      aria-label={label}
    >
      <Icon size={18} strokeWidth={1.5} />
    </a>
  );
}
