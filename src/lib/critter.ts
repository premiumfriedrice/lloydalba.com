"use client";

import { useSyncExternalStore } from "react";

/** Which animal marks the active link: the shrimp or the boxing mantis shrimp. Kept per viewer in localStorage. */
export type Critter = "shrimp" | "mantis";

const KEY = "critter";
const EVENT = "critter-change";

function read(): Critter {
  try {
    return localStorage.getItem(KEY) === "mantis" ? "mantis" : "shrimp";
  } catch {
    return "shrimp";
  }
}

export function setCritter(next: Critter) {
  try {
    localStorage.setItem(KEY, next);
  } catch {}
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function useCritter(): Critter {
  return useSyncExternalStore(subscribe, read, () => "shrimp");
}
