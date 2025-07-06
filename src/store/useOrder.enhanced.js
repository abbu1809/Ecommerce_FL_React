import { create } from "zustand";
import api from "../services/api";
import { useCartStore } from "./useCart";
import toast from "react-hot-toast";

// Enhanced payment validation
const validatePaymentData = (razorpayData) => {
  const required = ['key_id', 'amount', 'razorpay_order_id', 'app_order_id'];
  const missing = required.filter(field => !razorpayData[field]);
  
  if (missing.length > 0) {
    console.error("Missing required payment fields:", missing);
    return false;
  }
  
  // Validate amount is positive number
  if (razorpayData.amount <= 0) {
    console.error("Invalid payment amount:", razorpayData.amount);
    return false;
  }
  
  return true;
};

// Enhanced Razorpay payment function with security
const initiateRazorpayPayment = (razorpayData, onSuccess, onFailure) => {
  console.log("Initiating secure Razorpay payment");

  // Validate Razorpay SDK
  if (!window.Razorpay) {
    console.error("Razorpay SDK is not loaded");
    toast.error("Payment gateway not available. Please refresh and try again.");
    return Promise.reject("Razorpay SDK not loaded");
  }

  // Validate payment data
  if (!validatePaymentData(razorpayData)) {
    toast.error("Invalid payment configuration. Please try again.");
    return Promise.reject("Invalid payment data");
  }

  return new Promise((resolve, reject) => {
    const options = {
      key: razorpayData.key_id,
      amount: razorpayData.amount,
      currency: razorpayData.currency || "INR",
      order_id: razorpayData.razorpay_order_id,
      name: "Anand Mobiles",
      description: "Purchase of products",
      image: "/logo.jpg",
      
      // Enhanced success handler
      handler: function (response) {
        console.log("Payment successful, verifying...");

        const paymentData = {
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature,
          order_id: razorpayData.app_order_id,
          // Add timestamp for security
          timestamp: Date.now()
        };

        // Verify payment with retry mechanism
        const verifyPayment = async (retryCount = 0) => {
          try {
            const verifyResponse = await api.post("/users/order/razorpay/verify/", paymentData);
            console.log("Payment verified successfully:", verifyResponse.data);
            
            if (onSuccess) onSuccess(verifyResponse.data);
            resolve(verifyResponse.data);
          } catch (error) {
            console.error(`Payment verification failed (attempt ${retryCount + 1}):`, error);
            
            // Retry up to 3 times for network errors
            if (retryCount < 2 && error.code === 'NETWORK_ERROR') {
              setTimeout(() => verifyPayment(retryCount + 1), 2000);
            } else {
              toast.error("Payment verification failed. Please contact support.");
              if (onFailure) onFailure(error);
              reject(error);
            }
          }
        };

        verifyPayment();
      },

      // Enhanced prefill with user data if available
      prefill: {
        name: razorpayData.customer_name || "",
        email: razorpayData.customer_email || "",
        contact: razorpayData.customer_phone || ""
      },

      notes: {
        order_id: razorpayData.app_order_id,
        customer_id: razorpayData.customer_id || "",
        source: "web_checkout"
      },

      theme: {
        color: "#4F46E5", // Your brand primary color
      },

      // Enhanced modal settings
      modal: {
        ondismiss: function () {
          console.log("Payment modal dismissed by user");
          toast.info("Payment cancelled. You can try again anytime.");
          if (onFailure) onFailure({ message: "Payment cancelled by user" });
          reject({ message: "Payment cancelled by user" });
        },
        confirm_close: true, // Ask confirmation before closing
        escape: false, // Disable escape key to close
      },

      // Timeout settings
      timeout: 300, // 5 minutes timeout

      // Additional security options
      readonly: {
        email: true,
        name: true,
        contact: true
      }
    };

    console.log("Opening Razorpay modal with enhanced security");

    try {
      const rzp = new window.Razorpay(options);
      
      // Enhanced error handling
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description || 'Unknown error'}`);
        if (onFailure) onFailure(response.error);
        reject(response.error);
      });

      rzp.open();
      console.log("Secure Razorpay modal opened successfully");
    } catch (error) {
      console.error("Error initiating Razorpay:", error);
      toast.error("Failed to open payment gateway. Please try again.");
      if (onFailure) onFailure(error);
      reject(error);
    }
  });
};

export const useOrderStore = create((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  isProcessingPayment: false,
  paymentSuccessful: false,
  error: null,
  
  // Payment retry state
  paymentRetryCount: 0,
  maxRetries: 3,

  // Enhanced payment initiation
  initiatePayment: (razorpayData) => {
    set({ isProcessingPayment: true, error: null });
    
    return initiateRazorpayPayment(
      razorpayData,
      (data) => {
        // Success handler
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === razorpayData.app_order_id
              ? { ...order, status: "payment_successful", payment_details: data }
              : order
          ),
          paymentSuccessful: true,
          isProcessingPayment: false,
          paymentRetryCount: 0
        }));
        
        toast.success("Payment successful! Order confirmed.");

        // Reset payment success flag after delay
        setTimeout(() => {
          set({ paymentSuccessful: false });
        }, 3000);
      },
      (error) => {
        // Failure handler
        set((state) => ({
          isProcessingPayment: false,
          paymentRetryCount: state.paymentRetryCount + 1,
          error: error.message || "Payment failed"
        }));
        
        console.error("Payment error:", error);
      }
    );
  },

  // Retry payment functionality
  retryPayment: () => {
    const state = get();
    if (state.paymentRetryCount < state.maxRetries) {
      // Allow retry
      return true;
    } else {
      toast.error("Maximum payment attempts reached. Please try again later.");
      return false;
    }
  },

  // Rest of your existing methods...
  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get("/users/orders/");
      const orders = response.data.orders || [];
      set({ orders, isLoading: false });
      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      set({
        isLoading: false,
        error: error.response?.data?.detail || "Failed to fetch orders",
      });
      return [];
    }
  },

  // Enhanced order placement with validation
  placeOrderFromCart: async (addressId) => {
    try {
      set({ isProcessingPayment: true, error: null });
      
      // Validate inputs
      if (!addressId) {
        throw new Error("Delivery address is required");
      }

      const cartItems = useCartStore.getState().items;
      if (!cartItems || cartItems.length === 0) {
        throw new Error("Cart is empty");
      }

      console.log("Placing order from cart with addressId:", addressId);

      const response = await api.post("/users/order/place/", {
        address_id: addressId,
        payment_method: "razorpay"
      });

      if (response.data.success) {
        console.log("Order placed successfully:", response.data);
        
        // Set current order for tracking
        set({ 
          currentOrder: response.data.order,
          isProcessingPayment: false 
        });

        // Initiate payment if Razorpay data is provided
        if (response.data.razorpay_data) {
          return get().initiatePayment(response.data.razorpay_data);
        }
        
        return response.data;
      } else {
        throw new Error(response.data.error || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      set({
        isProcessingPayment: false,
        error: error.response?.data?.error || error.message || "Failed to place order",
      });
      toast.error(error.message || "Failed to place order");
      throw error;
    }
  },

  // Add other methods as needed...
  clearError: () => set({ error: null, paymentRetryCount: 0 }),
}));
