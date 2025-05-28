import { create } from "zustand";
import api from "../services/api";
import { useCartStore } from "./useCart";
import { showToast } from "../utils/toast";

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  isProcessingPayment: false,
  error: null,

  // Fetch all orders for the current user
  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get("/users/orders/");
      const orders = response.data.orders || [];

      set({
        orders,
        isLoading: false,
      });

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to fetch orders",
      });
      return [];
    }
  },

  // Place an order from the cart
  placeOrderFromCart: async (addressId) => {
    try {
      set({ isProcessingPayment: true, error: null });

      // Get cart items from cart store
      const cartItems = useCartStore.getState().items;

      if (!cartItems || cartItems.length === 0) {
        showToast.error("Your cart is empty");
        set({ isProcessingPayment: false });
        return null;
      }

      const orderData = {
        address_id: addressId,
        payment_method: "Razorpay", // Default payment method
        items: cartItems.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.post("/users/orders/create/", orderData);
      const newOrder = response.data.order;

      // Clear the cart after successful order
      await useCartStore.getState().clearCart();

      // Add the new order to the orders list
      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isProcessingPayment: false,
      }));

      showToast.success("Order placed successfully!");

      return newOrder;
    } catch (error) {
      console.error("Error placing order:", error);
      set({
        isProcessingPayment: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to place order",
      });
      showToast.error("Failed to place order. Please try again.");
      return null;
    }
  },

  // Place an order for a single product
  placeSingleProductOrder: async (product, quantity, addressId) => {
    try {
      set({ isProcessingPayment: true, error: null });

      if (!product) {
        showToast.error("Product information is missing");
        set({ isProcessingPayment: false });
        return null;
      }

      const orderData = {
        address_id: addressId,
        payment_method: "Razorpay", // Default payment method
        items: [
          {
            product_id: product.id,
            quantity: quantity,
          },
        ],
      };

      const response = await api.post("/users/orders/create/", orderData);
      const newOrder = response.data.order;

      // Add the new order to the orders list
      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isProcessingPayment: false,
      }));

      showToast.success("Order placed successfully!");

      return newOrder;
    } catch (error) {
      console.error("Error placing order:", error);
      set({
        isProcessingPayment: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to place order",
      });
      showToast.error("Failed to place order. Please try again.");
      return null;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await api.get(`/users/orders/${orderId}/`);
      const order = response.data.order;

      set({
        currentOrder: order,
        isLoading: false,
      });

      return order;
    } catch (error) {
      console.error("Error fetching order:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to fetch order",
      });
      return null;
    }
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    try {
      set({ isLoading: true, error: null });

      await api.post(`/users/orders/${orderId}/cancel/`);

      // Update the order in the orders list
      set((state) => ({
        orders: state.orders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        ),
        isLoading: false,
      }));

      showToast.success("Order cancelled successfully");

      return true;
    } catch (error) {
      console.error("Error cancelling order:", error);
      set({
        isLoading: false,
        error:
          error.response?.data?.detail ||
          error.response?.data?.error ||
          "Failed to cancel order",
      });
      showToast.error("Failed to cancel order");
      return false;
    }
  },

  // Clear any error
  clearError: () => set({ error: null }),
}));

export default useOrderStore;
