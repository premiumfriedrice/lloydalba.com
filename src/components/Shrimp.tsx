import { SHRIMP_BODY } from "@/components/shrimp-body";
import { SHRIMP_WHISKERS } from "@/components/shrimp-whiskers";

/** The shrimp mark: traced body plus four tapered whiskers that sway (see .shrimp in globals.css). */
export function Shrimp() {
  return (
    <svg viewBox="200 -60 2260 1490" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g dangerouslySetInnerHTML={{ __html: SHRIMP_BODY }} />
      <g fill="currentColor">
        {SHRIMP_WHISKERS.map((w) => (
          <g key={w.name} transform={`translate(${w.x} ${w.y})`}>
            <g className={`ant ${w.name}`}>
              <rect x={w.pad[0]} y={w.pad[1]} width={w.pad[2]} height={w.pad[3]} fill="none" />
              <path d={w.d} />
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
}
