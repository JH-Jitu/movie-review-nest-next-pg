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
        oceanic: "oceanic",
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
  const { theme: nextTheme } = useTheme();
  const { setTheme } = useUIStore();

  useEffect(() => {
    if (nextTheme) {
      setTheme(nextTheme as "light" | "dark" | "oceanic");
    }
  }, [nextTheme, setTheme]);

  return null;
}
