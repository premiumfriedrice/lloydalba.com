import { MANTIS_BODY, MANTIS_CLAW, MANTIS_CLAW_PAD } from "@/components/mantis-body";

/** The mantis shrimp mark: bobs like a boxer, and on a punch swings its club forward from the joint (see .mantis in globals.css). */
export function Mantis() {
  const [x, y, w, h] = MANTIS_CLAW_PAD;
  return (
    <svg className="mantis" viewBox="300 120 2260 1000" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g className="m-body" fill="currentColor">
        <g dangerouslySetInnerHTML={{ __html: MANTIS_BODY }} />
        <g className="m-claw">
          <rect x={x} y={y} width={w} height={h} fill="none" />
          <g dangerouslySetInnerHTML={{ __html: MANTIS_CLAW }} />
        </g>
      </g>
    </svg>
  );
}
