import { useState } from "react";
import { ROUTES } from "../utils/constants";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import EmptyCart from "../components/Cart/EmptyCart";
import CartItemList from "../components/Cart/CartItemList";
import CartSummary from "../components/Cart/CartSummary";

const Cart = () => {
  // In a real app, this would come from a context or store
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Samsung Galaxy S25 Edge",
      price: 84999,
      image: "https://via.placeholder.com/150x150?text=Samsung+S25",
      quantity: 1,
    },
    {
      id: 3,
      name: "Xiaomi Redmi Note 13 Pro",
      price: 26999,
      image: "https://via.placeholder.com/150x150?text=Redmi+Note+13",
      quantity: 2,
    },
  ]);

  const updateQuantity = (id, change) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.18; // 18% GST
  const shipping = subtotal > 0 ? (subtotal > 50000 ? 0 : 99) : 0;
  const total = subtotal + tax + shipping;

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
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
