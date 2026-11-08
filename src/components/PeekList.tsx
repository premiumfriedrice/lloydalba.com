import Link from "next/link";
import { peekHtml } from "@/lib/markdown";

export interface PeekItem {
  href: string;
  title: string;
  note?: string;
  /** Inline HTML shown under the title, always visible. */
  subHtml?: string;
  /** Post HTML; its first lines fade in on hover. */
  html: string;
}

/** Rows that are whole links; hovering one opens a faded peek into the content. */
export function PeekList({ items }: { items: PeekItem[] }) {
  return (
    <ul className="faq peek">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className="peek-link">
            <div className="peek-head">
              <span className="s-title">{item.title}</span>
              {item.note && <span className="s-note">{item.note}</span>}
            </div>
            {item.subHtml && (
              <div className="peek-sub" dangerouslySetInnerHTML={{ __html: item.subHtml }} />
            )}
            <div className="peek-body" aria-hidden="true">
              <div className="peek-inner">
                <div
                  className="writing preview-body"
                  dangerouslySetInnerHTML={{ __html: peekHtml(item.html) }}
                />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
