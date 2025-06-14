import React from "react";
import { Link } from "react-router-dom";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

const CartItem = ({ item, updateQuantity, removeItem }) => {
  return (
    <tr
      className="group transition-all duration-200 hover:bg-opacity-50"
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
            </Link>{" "}
            <span
              className="text-sm block mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              ₹{(item.price || 0).toLocaleString()} each
            </span>
          </div>
        </div>
      </td>
      <td className="py-6 px-4">
        <div className="flex items-center justify-center">
          {" "}
          <button
            onClick={() => updateQuantity(item.item_id, -1)}
            className="flex items-center justify-center w-8 h-8 rounded-md focus:outline-none transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-accent-light)",
              color: "var(--brand-primary)",
            }}
            aria-label="Decrease quantity"
          >
            <FiMinus size={16} />
          </button>
          <span
            className="mx-4 w-8 text-center font-medium text-base"
            style={{ color: "var(--text-primary)" }}
          >
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.item_id, 1)}
            className="flex items-center justify-center w-8 h-8 rounded-md focus:outline-none transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-accent-light)",
              color: "var(--brand-primary)",
            }}
            aria-label="Increase quantity"
          >
            <FiPlus size={16} />
          </button>
        </div>
      </td>{" "}
      <td
        className="py-6 px-4 text-right text-lg font-semibold"
        style={{ color: "var(--brand-primary)" }}
      >
        ₹{((item.price || 0) * item.quantity).toLocaleString()}
      </td>
      <td className="py-6 px-4 text-center">
        {" "}
        <button
          onClick={() => removeItem(item.item_id)}
          className="p-2.5 rounded-full hover:bg-red-50 transition-all duration-200 focus:outline-none"
          style={{
            color: "var(--error-color)",
            backgroundColor: "var(--bg-secondary)",
          }}
          aria-label="Remove item"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  );
};

export default CartItem;
