import type { ColorMode } from "@/styles/colors";
import { useSyncExternalStore } from "react";

const COLOR_SCHEME_QUERY = "(prefers-color-scheme: dark)";

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

function getSnapshot(): ColorMode {
  return window.matchMedia(COLOR_SCHEME_QUERY).matches ? "dark" : "light";
}

function getServerSnapshot(): ColorMode {
  return "light";
}

export function usePreferredColorMode(): ColorMode {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
