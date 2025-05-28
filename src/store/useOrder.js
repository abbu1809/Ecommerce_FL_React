import { create } from "zustand";
import api from "../services/api";
import { useCartStore } from "./useCart";
import toast from "react-hot-toast";

// Declare razorpay payment function
const initiateRazorpayPayment = (razorpayData, onSuccess, onFailure) => {
  // Check if Razorpay is available
  if (!window.Razorpay) {
    console.error("Razorpay SDK is not loaded");
    toast.error("Payment gateway not available. Please try again later.");
    return Promise.reject("Razorpay SDK not loaded");
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: razorpayData.key_id,
      amount: razorpayData.amount,
      currency: razorpayData.currency,
      order_id: razorpayData.razorpay_order_id,
      name: "Your E-Commerce Store",
      description: "Purchase of products",
      image: "/logo.jpg",
      handler: function (response) {
        // Handle successful payment
        const paymentData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order_id: razorpayData.app_order_id,
        };

        // Verify payment on backend
        api
          .post("/users/orders/verify-payment/", paymentData)
          .then((verifyResponse) => {
            if (onSuccess) onSuccess(verifyResponse.data);
            resolve(verifyResponse.data);
          })
          .catch((error) => {
            console.error("Payment verification failed:", error);
            if (onFailure) onFailure(error);
            reject(error);
          });
      },
      prefill: {
        // You can prefill user information if available
        // name: "Customer Name",
        // email: "customer@example.com",
        // contact: "9999999999"
      },
      notes: {
        order_id: razorpayData.app_order_id,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal dismissed");
          if (onFailure) onFailure({ message: "Payment cancelled by user" });
          reject({ message: "Payment cancelled by user" });
        },
      },
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating Razorpay:", error);
      if (onFailure) onFailure(error);
      reject(error);
    }
  });
};

export const useOrderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  isProcessingPayment: false,
  error: null,

  // Initialize Razorpay payment
  initiatePayment: (razorpayData) => {
    return initiateRazorpayPayment(
      razorpayData,
      (data) => {
        // Update order status on successful payment
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === razorpayData.app_order_id
              ? { ...order, status: "paid", payment_details: data }
              : order
          ),
        }));
        toast.success("Payment successful!");
      },
      (error) => {
        toast.error("Payment failed. Please try again.");
        console.error("Payment error:", error);
      }
    );
  },

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
        toast.error("Your cart is empty");
        set({ isProcessingPayment: false });
        return null;
      }

      // Calculate total amount in paise (assuming item.price is in rupees)
      const totalAmountInPaise = Math.round(
        cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ) * 100
      );

      const orderData = {
        address_id: addressId,
        amount: totalAmountInPaise,
        currency: "INR",
        product_ids: cartItems.map((item) => item.id),
      };

      // Use POST method for order creation to match API requirements
      const response = await api.post("/users/orders/create/", orderData);

      // The response now contains Razorpay order details
      const razorpayData = response.data;

      // You would typically initiate Razorpay payment here with the returned data
      // For example:
      // await initiateRazorpayPayment(razorpayData);

      // For now, we'll just handle the successful order creation
      const newOrder = {
        id: razorpayData.app_order_id,
        razorpay_order_id: razorpayData.razorpay_order_id,
        status: "pending_payment",
        // Add other order details as needed
      };

      // Clear the cart after successful order creation
      await useCartStore.getState().clearCart();

      // Add the new order to the orders list
      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isProcessingPayment: false,
      }));

      toast.success("Order created successfully! Proceed with payment.");

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
      toast.error("Failed to place order. Please try again.");
      return null;
    }
  },

  // Place an order for a single product
  placeSingleProductOrder: async (product, quantity, addressId) => {
    try {
      set({ isProcessingPayment: true, error: null });

      if (!product) {
        toast.error("Product information is missing");
        set({ isProcessingPayment: false });
        return null;
      }

      // Calculate total amount in paise (assuming product.price is in rupees)
      const totalAmountInPaise = Math.round(product.price * quantity * 100);

      const orderData = {
        address_id: addressId,
        amount: totalAmountInPaise,
        currency: "INR",
        product_ids: [product.id],
      };

      const response = await api.post("/users/orders/create/", orderData);

      // The response now contains Razorpay order details
      const razorpayData = response.data;

      // You would typically initiate Razorpay payment here with the returned data
      // For example:
      // await initiateRazorpayPayment(razorpayData);

      // For now, we'll just handle the successful order creation
      const newOrder = {
        id: razorpayData.app_order_id,
        razorpay_order_id: razorpayData.razorpay_order_id,
        status: "pending_payment",
        // Add other order details as needed
      };

      // Add the new order to the orders list
      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isProcessingPayment: false,
      }));

      toast.success("Order created successfully! Proceed with payment.");

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
      toast.error("Failed to place order. Please try again.");
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

      toast.success("Order cancelled successfully");

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
      toast.error("Failed to cancel order");
      return false;
    }
  },

  // Clear any error
  clearError: () => set({ error: null }),
}));

export default useOrderStore;
