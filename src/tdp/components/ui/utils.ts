// @ts-nocheck -- ported from tdp-prototype (Vite, never tsc-checked); not type-maintained here
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to filter out Figma inspector props
export function filterFigmaProps<T extends Record<string, any>>(props: T): T {
  if (!props || typeof props !== 'object') {
    return {} as T;
  }
  
  const filtered: Record<string, any> = {};
  for (const key in props) {
    // Skip Figma inspector props that start with _fg
    if (!key.startsWith('_fg')) {
      filtered[key] = props[key];
    }
  }
  return filtered as T;
}