import { SHRIMP_BODY } from "@/components/shrimp-body";

/** The shrimp mark: traced body plus two drawn antennae that sway (see .shrimp in globals.css). */
export function Shrimp() {
  return (
    <svg viewBox="200 100 2230 1330" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g dangerouslySetInnerHTML={{ __html: SHRIMP_BODY }} />
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path className="ant ant-a" strokeWidth={56} d="M1846 346 C 2050 250, 2300 120, 2390 300" />
        <path className="ant ant-b" strokeWidth={48} d="M1852 360 C 2080 360, 2300 420, 2370 620" />
      </g>
    </svg>
  );
}
