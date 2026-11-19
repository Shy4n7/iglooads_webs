"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};
const BUILD_YEAR = new Date().getFullYear();

/** Current year in the visitor's browser, so the footer never goes stale between deploys. */
export default function Year() {
  const year = useSyncExternalStore(
    noop,
    () => new Date().getFullYear(),
    () => BUILD_YEAR,
  );
  return <>{year}</>;
}
