import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  items: string[];
  addToWatchlist: (titleId: string) => void;
  removeFromWatchlist: (titleId: string) => void;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      items: [],
      addToWatchlist: (titleId) =>
        set((state) => ({ items: [...state.items, titleId] })),
      removeFromWatchlist: (titleId) =>
        set((state) => ({ items: state.items.filter((id) => id !== titleId) })),
      clearWatchlist: () => set({ items: [] }),
    }),
    {
      name: "watchlist-storage",
    }
  )
);
