"use client";

import { useUIStore } from "@/stores/ui.store";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useUIStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <NextThemeProvider attribute="class" defaultTheme={theme} enableSystem>
      {children}
    </NextThemeProvider>
  );
}
