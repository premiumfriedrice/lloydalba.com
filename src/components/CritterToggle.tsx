"use client";

import { setCritter, useCritter, type Critter } from "@/lib/critter";

const OPTIONS: { id: Critter; label: string }[] = [
  { id: "shrimp", label: "Shrimp" },
  { id: "mantis", label: "Mantis" },
];

/** Picks which animal marks the active link in the side rail. */
export function CritterToggle() {
  const current = useCritter();
  return (
    <div className="critter-toggle" role="group" aria-label="Sidebar animal">
      {OPTIONS.map((o) => (
        <button key={o.id} type="button" aria-pressed={current === o.id} onClick={() => setCritter(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
