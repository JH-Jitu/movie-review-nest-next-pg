// ui.store.ts
import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  theme: "light" | "dark" | "oceanic";
  toggleSidebar: () => void;
  toggleSearch: () => void;
  setTheme: (theme: "light" | "dark" | "oceanic") => void;
}

// Helper to safely access localStorage
const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    return (
      (localStorage.getItem("theme") as "light" | "dark" | "oceanic") ||
      "oceanic"
    );
  }
  return "oceanic";
};

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSearchOpen: false,
  theme: getInitialTheme(),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
    set({ theme });
  },
}));
