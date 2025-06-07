import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../services/api";
import { useAuthStore } from "./useAuth";
import toast from "react-hot-toast";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      totalAmount: 0,
      isLoading: false,
      error: null,

      // Fetch cart from server (for authenticated users)
      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null });

          // Check if user is authenticated
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          if (isAuthenticated) {
            const response = await api.get("/users/cart/");
            const cartItems = response.data.cart.map((item) => ({
              id: item.product_id,
              item_id: item.item_id,
              name: item.name,
              price: item.price,
              image: item.image_url,
              quantity: item.quantity,
              stock: item.stock || 10, // Default to 10 if not provided by API
              category: item.category || "Product",
              added_at: item.added_at,
            }));

            set({
              items: cartItems,
              isLoading: false,
            });

            // Update cart totals
            updateTotals();
            return cartItems;
          } else {
            // For guests, just update totals from localStorage
            updateTotals();
            set({ isLoading: false });
            return get().items;
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to fetch cart",
          });
          return get().items;
        }
      },

      // Add an item to the cart
      addItem: async (product, quantity = 1) => {
        try {
          set({ isLoading: true, error: null });
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          if (isAuthenticated) {
            // Send to server first
            await api.post(`/users/cart/add/${product.id}/`, {
              quantity,
            });
          }

          // Then update local state
          const { items } = get();
          const existingItem = items.find((item) => item.id === product.id);

          if (existingItem) {
            // Update quantity if item already exists
            set({
              items: items.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isLoading: false,
            });
          } else {
            // Add new item
            set({
              items: [...items, { ...product, quantity }],
              isLoading: false,
            });
          }

          // Update cart totals
          updateTotals();
          toast.success("Item added to cart");
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to add item to cart",
          });
          return false;
        }
      },

      // Remove an item from the cart
      removeItem: async (productId) => {
        try {
          set({ isLoading: true, error: null });
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          if (isAuthenticated) {
            // Remove from server first
            await api.delete(`/users/cart/remove/${productId}/`);
          }

          // Then update local state
          const { items } = get();
          set({
            items: items.filter((item) => item.id !== productId),
            isLoading: false,
          });

          // Update cart totals
          updateTotals();
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error.response?.data?.error || "Failed to remove item from cart",
          });
          return false;
        }
      },

      // Update item quantity
      updateQuantity: async (productId, quantity) => {
        try {
          set({ isLoading: true, error: null });
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          if (quantity <= 0) {
            // Call removeItem if quantity is zero or negative
            return get().removeItem(productId);
          }

          if (isAuthenticated) {
            // For authenticated users, we need to remove and re-add with new quantity
            // since there's no specific update endpoint
            await api.delete(`/users/cart/remove/${productId}/`);
            await api.post(`/users/cart/add/${productId}/`, { quantity });
          }

          // Update local state
          const { items } = get();
          set({
            items: items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
            isLoading: false,
          });

          // Update cart totals
          updateTotals();
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error.response?.data?.error || "Failed to update item quantity",
          });
          return false;
        }
      },

      // Clear the entire cart
      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const isAuthenticated = useAuthStore.getState().isAuthenticated;

          if (isAuthenticated) {
            // Clear server cart by removing each item
            const { items } = get();
            const deletePromises = items.map((item) =>
              api.delete(`/users/cart/remove/${item.id}/`)
            );
            await Promise.all(deletePromises);
          }

          // Clear local state
          set({
            items: [],
            itemCount: 0,
            totalAmount: 0,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.error || "Failed to clear cart",
          });
          return false;
        }
      },

      // Helper function to update cart totals
      updateTotals: () => {
        const { items } = get();
        const itemCount = items.reduce(
          (total, item) => total + item.quantity,
          0
        );
        const totalAmount = items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );

        set({
          itemCount,
          totalAmount,
        });
      },

      // Clear any errors
      clearError: () => set({ error: null }),
    }),
    {
      name: "cart-storage", // unique name for localStorage
    }
  )
);

// Manually export the update totals function for external use
const updateTotals = () => {
  useCartStore.getState().updateTotals();
};
