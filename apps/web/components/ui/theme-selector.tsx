import React from "react";
import { useUIStore } from "@/stores/ui.store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react"; // Assuming you have these icons

const ThemeSelector = () => {
  const { theme, setTheme } = useUIStore();

  const handleThemeChange = (newTheme: "light" | "dark" | "oceanic") => {
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme); // Update the HTML attribute for styling
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {theme === "light" ? (
            <Sun className="h-5 w-5" />
          ) : theme === "dark" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => handleThemeChange("light")}
          className={theme === "light" ? "bg-muted" : ""}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("dark")}
          className={theme === "dark" ? "bg-muted" : ""}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleThemeChange("oceanic")}
          className={theme === "oceanic" ? "bg-muted" : ""}
        >
          Oceanic
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSelector;
