import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useCartStore } from "../../store/useCart";
import {
  showRemoveFromCartToast,
  showUpdateCartToast,
  showCartErrorToast,
} from "../../utils/toast";

const CartItemIntegrated = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1 || newQuantity === item.quantity) return;

    setIsUpdating(true);
    try {
      const success = await updateQuantity(item.id, newQuantity);
      if (success) {
        showUpdateCartToast();
      }
    } catch (error) {
      showCartErrorToast(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async () => {
    setIsUpdating(true);
    try {
      const success = await removeItem(item.id);
      if (success) {
        showRemoveFromCartToast();
      }
    } catch (error) {
      showCartErrorToast(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <tr
      className={`group transition-all duration-200 hover:bg-opacity-50 ${
        isUpdating ? "opacity-60" : ""
      }`}
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <td className="py-6 px-4">
        <div className="flex items-center">
          <div
            className="h-20 w-20 rounded-lg flex items-center justify-center overflow-hidden transition-transform duration-200 group-hover:scale-105"
            style={{
              backgroundColor: "var(--bg-secondary)",
              boxShadow: "var(--shadow-small)",
            }}
          >
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 object-contain"
            />
          </div>
          <div className="ml-5 flex-1">
            <Link
              to={`/products/${item.id}`}
              className="font-medium hover:underline transition-all duration-200 block mb-1 text-base"
              style={{ color: "var(--text-primary)" }}
            >
              {item.name}
            </Link>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {item.brand && `${item.brand} • `}
              {item.category || "Electronics"}
            </p>
          </div>
        </div>
      </td>

      {/* Price column */}
      <td
        className="py-6 px-4 text-center font-medium"
        style={{ color: "var(--brand-primary)" }}
      >
        ₹{item.price.toLocaleString()}
      </td>

      {/* Quantity column */}
      <td className="py-6 px-4">
        <div
          className="flex items-center justify-center rounded-md p-1 mx-auto w-28"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-color)",
          }}
        >
          <button
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1 || isUpdating}
            className={`w-8 h-8 rounded-md transition-all duration-200 flex items-center justify-center ${
              item.quantity <= 1
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            style={{ color: "var(--text-primary)" }}
            aria-label="Decrease quantity"
          >
            <FiMinus />
          </button>
          <span
            className="w-10 text-center font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            {item.quantity}
          </span>
          <button
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={isUpdating}
            className="w-8 h-8 rounded-md transition-all duration-200 flex items-center justify-center hover:bg-gray-100"
            style={{ color: "var(--text-primary)" }}
            aria-label="Increase quantity"
          >
            <FiPlus />
          </button>
        </div>
      </td>

      {/* Subtotal column */}
      <td
        className="py-6 px-4 text-right font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        ₹{(item.price * item.quantity).toLocaleString()}
      </td>

      {/* Action column */}
      <td className="py-6 px-4 text-center">
        <button
          onClick={handleRemoveItem}
          disabled={isUpdating}
          className="w-8 h-8 rounded-full transition-all duration-300 hover:bg-gray-100 flex items-center justify-center"
          style={{ color: "var(--error-color)" }}
          aria-label="Remove item"
        >
          <FiTrash2 />
        </button>
      </td>
    </tr>
  );
};

export default CartItemIntegrated;
