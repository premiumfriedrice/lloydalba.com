interface SectionProps {
  index: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}

export default function Section({ index, title, id, children }: SectionProps) {
  return (
    <section id={id} className="section">
      <div className="section-head">
        <h2>{title}</h2>
        <span className="section-index" aria-hidden="true">
          {index}
        </span>
      </div>
      {children}
    </section>
  );
}
