"use client";

import { useUIStore } from "@/stores/ui.store";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
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

  const themeName = theme === "light" ? "light" : "dark";

  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={themeName}
      value={{
        light: "light",
        dark: "dark",
        oceanic: "dark",
      }}
      // enableSystem
    >
      <ThemeSync />
      {children}
    </NextThemeProvider>
  );
}
// Separate component to handle theme synchronization
function ThemeSync() {
  const { theme } = useTheme();
  const { setTheme } = useUIStore();

  useEffect(() => {
    if (theme) {
      setTheme(theme as "light" | "dark" | "oceanic");
    }
  }, [theme, setTheme]);

  return null;
}
