"use client";

/**
 * Theme (including `variantColorResolver`, a function) must be constructed
 * client-side: functions can't cross the Server→Client Component
 * serialization boundary, so `layout.tsx` (a Server Component) can't pass
 * `theme` directly to `MantineProvider` itself.
 */
import { MantineProvider } from "@mantine/core";
import { prodigyFoundationTheme } from "@/theme/prodigyFoundation";

export default function AppMantineProvider({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={prodigyFoundationTheme}>{children}</MantineProvider>;
}
