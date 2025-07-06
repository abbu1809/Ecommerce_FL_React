import { useEffect, useState } from "react";
import { ROUTES } from "../utils/constants";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import EmptyCart from "../components/Cart/EmptyCart";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import Checkout from "../components/Checkout/Checkout";
import { useCartStore } from "../store/useCart";
import { useAuthStore } from "../store/useAuth";
import { useOrderStore } from "../store/useOrder";

const Cart = () => {
  const {
    items: cartItems,
    totalAmount,
    fetchCart,
    updateQuantity,
    removeItem,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { paymentSuccessful } = useOrderStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  useEffect(() => {
    // Load cart data when component mounts or auth state changes
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  // Listen for successful payment and refetch cart
  useEffect(() => {
    if (paymentSuccessful) {
      console.log("Payment successful, refetching cart data");
      // Add a short delay to ensure backend has processed the order
      setTimeout(() => {
        fetchCart();
        console.log("Cart data refetched after successful payment");
      }, 500);
    }
  }, [paymentSuccessful]); // eslint-disable-line react-hooks/exhaustive-deps

  // Calculate cart totals
  const subtotal = totalAmount;
  const tax = 0; // 18% GST
  const shipping = 0; // Free shipping for orders above ₹50,000
  const total = subtotal + tax + shipping;

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };
  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
    // Refetch cart data after checkout closes
    // This ensures the cart is up to date whether payment was successful or canceled
    fetchCart();
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", link: ROUTES.HOME },
    { label: "Shopping Cart" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CartItemList
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeItem={removeItem}
            />
            <CartSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              onCheckout={handleOpenCheckout}
            />
          </div>
        )}

        {/* Checkout Modal */}
        <Checkout isOpen={checkoutOpen} onClose={handleCloseCheckout} />
      </div>
    </div>
  );
};

export default Cart;
