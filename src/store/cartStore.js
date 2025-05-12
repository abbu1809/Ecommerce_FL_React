import { create } from "zustand";

// Create a store for cart functionality
const useCartStore = create((set) => ({
  items: [],

  // Add item to cart
  addItem: (product) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        // Increase quantity if item already exists
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      } else {
        // Add new item with quantity 1
        return {
          items: [...state.items, { ...product, quantity: 1 }],
        };
      }
    }),

  // Remove item from cart
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    })),

  // Update item quantity
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ),
    })),

  // Clear cart
  clearCart: () => set({ items: [] }),

  // Get cart total
  get total() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  },
}));

export default useCartStore;
