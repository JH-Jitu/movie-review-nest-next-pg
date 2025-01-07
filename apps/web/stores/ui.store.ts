import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isSearchOpen: boolean;
  theme: "light" | "dark" | "oceanic";
  toggleSidebar: () => void;
  toggleSearch: () => void;
  setTheme: (theme: "light" | "dark" | "oceanic") => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isSearchOpen: false,
  theme:
    (localStorage.getItem("theme") as "light" | "dark" | "oceanic") ||
    "oceanic",
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));
