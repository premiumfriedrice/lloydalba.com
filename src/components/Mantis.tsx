import { MANTIS_BODY, MANTIS_PARTS } from "@/components/mantis-body";

/**
 * The mantis shrimp mark. It bobs like a boxer; its antennae sway, walking legs step, the paddles
 * under its tail beat, and its tail fan flicks. On a punch the club swings forward from its joint.
 * Parts are cut by scripts/mantis-build.py; motion lives in .mantis in globals.css.
 */
export function Mantis() {
  return (
    <svg className="mantis" viewBox="300 120 2260 1000" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g className="m-body" fill="currentColor">
        <g dangerouslySetInnerHTML={{ __html: MANTIS_BODY }} />
        {MANTIS_PARTS.map((part) => (
          <g key={part.name} className={part.name === "claw" ? "m-claw" : `m-part m-${part.name}`}>
            <rect x={part.pad[0]} y={part.pad[1]} width={part.pad[2]} height={part.pad[3]} fill="none" />
            <g dangerouslySetInnerHTML={{ __html: part.svg }} />
          </g>
        ))}
      </g>
    </svg>
  );
}
