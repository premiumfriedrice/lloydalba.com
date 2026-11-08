import { SHRIMP_BODY } from "@/components/shrimp-body";

/** The shrimp mark: traced body plus four drawn antennae that sway (see .shrimp in globals.css). */
export function Shrimp() {
  return (
    <svg viewBox="200 0 2240 1430" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <g dangerouslySetInnerHTML={{ __html: SHRIMP_BODY }} />
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path className="ant ant-1" strokeWidth={30} d="M1846 340 C 2000 170, 2260 40, 2420 170" />
        <path className="ant ant-2" strokeWidth={26} d="M1852 356 C 2100 330, 2330 380, 2420 540" />
        <path className="ant ant-3" strokeWidth={28} d="M1850 346 C 1720 120, 1250 10, 650 70" />
        <path className="ant ant-4" strokeWidth={24} d="M1848 342 C 1790 170, 1520 70, 1180 110" />
      </g>
    </svg>
  );
}
