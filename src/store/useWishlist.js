import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import { useAuthStore } from "./useAuth";
import toast from "react-hot-toast";

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,

      // Fetch wishlist from server (for authenticated users)
      fetchWishlist: async () => {
        try {
          set({ isLoading: true, error: null });

          // Check if user is authenticated
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          if (isAuthenticated) {
            const response = await api.get("/users/wishlist/");
            const wishlistItems = response.data.wishlist.map((item) => ({
              id: item.product_id,
              item_id: item.item_id,
              name: item.name,
              price: item.price,
              image: item.image_url,
              stock: item.stock || 1, // Default to 1 if not provided by API
              category: item.category || "Product",
              added_at: item.added_at,
            }));

            set({
              items: wishlistItems,
              isLoading: false,
            });

            return wishlistItems;
          } else {
            // For guests, just return items from localStorage
            set({ isLoading: false });
            return get().items;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to fetch wishlist",
          });
          return get().items;
        }
      },

      // Add an item to the wishlist
      addItem: async (product) => {
        try {
          set({ isLoading: true, error: null });
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          // Check if item already exists to prevent redundant API calls
          const { items } = get();
          const existingItem = items.find((item) => item.id === product.id);

          if (existingItem) {
            set({ isLoading: false });
            return true; // Item already in wishlist
          }

          if (isAuthenticated) {
            // Send to server first
            await api.post(`/users/wishlist/add/${product.id}/`);
          }

          // Then update local state
          set({
            items: [...items, product],
            isLoading: false,
          });
          toast.success("Item added to wishlist");
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error.response?.data?.error || "Failed to add item to wishlist",
          });
          return false;
        }
      },

      // Remove an item from the wishlist
      removeItem: async (productId) => {
        try {
          set({ isLoading: true, error: null });
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          if (isAuthenticated) {
            // Remove from server first
            await api.delete(`/users/wishlist/remove/${productId}/`);
          }

          // Then update local state
          const { items } = get();
          set({
            items: items.filter((item) => item.id !== productId),
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error.response?.data?.error ||
              "Failed to remove item from wishlist",
          });
          return false;
        }
      },

      // Check if an item is in the wishlist
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some((item) => item.id === productId);
      },

      // Clear the entire wishlist
      clearWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          if (isAuthenticated) {
            // Clear server wishlist by removing each item
            const { items } = get();
            const deletePromises = items.map((item) =>
              api.delete(`/users/wishlist/remove/${item.id}/`)
            );
            await Promise.all(deletePromises);
          }

          // Clear local state
          set({
            items: [],
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to clear wishlist",
          });
          return false;
        }
      },

      // Clear any errors
      clearError: () => set({ error: null }),
    }),
    {
      name: "wishlist-storage", // unique name for localStorage
    }
  )
);
