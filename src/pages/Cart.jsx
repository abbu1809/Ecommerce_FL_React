import { useEffect, useState } from "react";
import { ROUTES } from "../utils/constants";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import EmptyCart from "../components/Cart/EmptyCart";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";
import Checkout from "../components/Checkout/Checkout";
import { useCartStore } from "../store/useCart";
import { useAuthStore } from "../store/useAuth";

const Cart = () => {
  const {
    items: cartItems,
    totalAmount,
    fetchCart,
    updateQuantity,
    removeItem,
  } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    // Load cart data when component mounts or auth state changes
    fetchCart();
  }, [fetchCart, isAuthenticated]);

  // Calculate cart totals
  const subtotal = totalAmount;
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 0 ? (subtotal > 50000 ? 0 : 99) : 0; // Free shipping for orders above ₹50,000
  const total = subtotal + tax + shipping;

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
  };

  const handleCloseCheckout = () => {
    setCheckoutOpen(false);
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
