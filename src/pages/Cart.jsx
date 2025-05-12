import React, { useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiShoppingCart, FiTrash2, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";

const Cart = () => {
  const { items, removeItem, updateQuantity, clearCart, total } =
    useCartStore();

  useEffect(() => {
    // Animation when cart is mounted
    const loadedToast = () => {
      if (items.length > 0) {
        toast.success("Cart loaded successfully!");
      }
    };
    loadedToast();
  }, [items.length]);

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
    toast.error("Item removed from cart");
  };

  const handleClearCart = () => {
    clearCart();
    toast.error("Cart cleared");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1
        className="text-4xl font-bold text-center mb-8"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <FiShoppingCart className="inline-block mr-2 mb-1" />
        Your Shopping Cart
      </motion.h1>

      {items.length === 0 ? (
        <motion.div
          className="bg-white rounded-lg shadow p-6"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-gray-500 text-center">Your cart is empty</p>
          <motion.div
            className="flex justify-center mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/products"
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FiArrowLeft className="mr-2" /> Continue Shopping
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row items-center justify-between"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="flex items-center mb-4 md:mb-0">
                <img
                  src={
                    item.image ||
                    item.images?.[0] ||
                    "https://via.placeholder.com/100"
                  }
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {item.selectedColor && `Color: ${item.selectedColor}`}
                  </p>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center border rounded">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-2 py-1"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </motion.button>
                  <span className="px-4">{item.quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-2 py-1"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <FiTrash2 size={20} />
                </motion.button>
              </div>
            </motion.div>
          ))}

          <motion.div
            className="bg-white rounded-lg shadow p-4 mt-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex justify-between items-center border-b pb-4">
              <span className="font-medium">Subtotal:</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="font-bold">Total:</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>

            <div className="mt-6 flex flex-col md:flex-row md:justify-between space-y-3 md:space-y-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-600 text-white px-4 py-2 rounded flex items-center justify-center"
                onClick={handleClearCart}
              >
                <FiTrash2 className="mr-2" /> Clear Cart
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center"
                onClick={() => toast.success("Thank you for your order!")}
              >
                Proceed to Checkout
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
