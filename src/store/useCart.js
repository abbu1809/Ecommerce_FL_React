import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      totalAmount: 0,

      // Add an item to the cart
      addItem: (product, quantity = 1) => {
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
          });
        } else {
          // Add new item
          set({
            items: [...items, { ...product, quantity }],
          });
        }

        // Update cart totals
        updateTotals();
      },

      // Remove an item from the cart
      removeItem: (productId) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.id !== productId),
        });

        // Update cart totals
        updateTotals();
      },

      // Update item quantity
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          // Remove item if quantity is zero or negative
          set({
            items: items.filter((item) => item.id !== productId),
          });
        } else {
          // Update quantity
          set({
            items: items.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          });
        }

        // Update cart totals
        updateTotals();
      },

      // Clear the entire cart
      clearCart: () => {
        set({
          items: [],
          itemCount: 0,
          totalAmount: 0,
        });
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
