"use client";

/** Opens the browser's print dialog, where "Save as PDF" keeps the page layout. */
export function PrintLink() {
  return (
    <a
      href="#print"
      className="print-link"
      onClick={(event) => {
        event.preventDefault();
        window.print();
      }}
    >
      Export PDF ↓
    </a>
  );
}
