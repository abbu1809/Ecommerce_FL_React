import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Add an item to the wishlist
      addItem: (product) => {
        const { items } = get();
        const existingItem = items.find((item) => item.id === product.id);

        if (!existingItem) {
          set({
            items: [...items, product],
          });
        }
      },

      // Remove an item from the wishlist
      removeItem: (productId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== productId),
        });
      },

      // Check if an item is in the wishlist
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      // Clear the entire wishlist
      clearWishlist: () => {
        set({
          items: [],
        });
      },
    }),
    {
      name: "wishlist-storage", // unique name for localStorage
    }
  )
);
