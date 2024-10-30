"use client";

import { ThemeProvider } from "next-themes";

export function Providers({
  children,
  theme,
}: {
  children: React.ReactNode;
  theme?: string;
}) {
  return (
    <ThemeProvider attribute="class" forcedTheme={theme} enableSystem>
      {children}
    </ThemeProvider>
  );
}
