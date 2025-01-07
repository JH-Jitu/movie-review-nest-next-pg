"use client";
import { useUIStore } from "@/stores/ui.store";
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
    <html className={theme === "light" ? "" : "dark"}>
      <body>{children}</body>
    </html>
  );
}
