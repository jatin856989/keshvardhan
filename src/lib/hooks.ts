"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True after hydration, false during SSR and the first client render.
 * Lets persisted client state (the cart) render without a hydration mismatch.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
