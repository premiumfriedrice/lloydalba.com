/**
 * The colour mantis shrimp mark: two images (body, and the folded fist arm) built by
 * scripts/mantis-build.py. It bobs like a boxer and, on a punch, swings the fist forward
 * from where the arm meets the head (see .mantis in globals.css).
 */
const W = 288;
const H = 208;
const PIVOT = [188.8, 53.9]; // where the fist arm meets the head
const HALF = 72; // invisible box centred on the pivot, so CSS rotates the arm about it

export function Mantis() {
  return (
    <svg className="mantis" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g className="m-body">
        <image href="/critters/mantis-body.png" width={W} height={H} />
        <g className="m-claw">
          <rect x={PIVOT[0] - HALF} y={PIVOT[1] - HALF} width={HALF * 2} height={HALF * 2} fill="none" />
          <image href="/critters/mantis-arm.png" width={W} height={H} />
        </g>
      </g>
    </svg>
  );
}
