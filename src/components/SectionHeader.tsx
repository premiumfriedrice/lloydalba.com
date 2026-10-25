interface SectionHeaderProps {
  index: string;
  title: string;
}

export default function SectionHeader({ index, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <h2 className="text-sm font-medium text-ink whitespace-nowrap">{title}</h2>
      <span className="flex-1 h-px bg-rule" />
      <span className="font-serif italic text-accent text-base">{index}</span>
    </div>
  );
}
