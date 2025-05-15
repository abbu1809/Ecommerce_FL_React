import React from "react";
import { FiMinus, FiPlus } from "react-icons/fi";

const ProductQuantitySelector = ({
  quantity,
  stock,
  handleQuantityChange,
  incrementQuantity,
  decrementQuantity,
}) => {
  return (
    <div className="flex flex-wrap items-center mb-6">
      <span
        className="font-medium mr-4 text-sm"
        style={{ color: "var(--text-primary)" }}
      >
        Quantity:
      </span>
      <div
        className="flex items-center rounded-lg overflow-hidden"
        style={{
          borderColor: "var(--border-primary)",
          boxShadow: "var(--shadow-small)",
        }}
      >
        <button
          onClick={decrementQuantity}
          className="px-3 py-2 transition-all duration-200 flex items-center justify-center h-full"
          disabled={quantity <= 1}
          style={{
            backgroundColor:
              quantity <= 1 ? "#f5f5f5" : "var(--bg-accent-light)",
            color:
              quantity <= 1 ? "var(--text-secondary)" : "var(--brand-primary)",
            opacity: quantity <= 1 ? 0.7 : 1,
          }}
          aria-label="Decrease quantity"
        >
          <FiMinus size={16} />
        </button>
        <input
          type="number"
          min="1"
          max={stock}
          value={quantity}
          onChange={handleQuantityChange}
          className="w-14 text-center py-2 focus:outline-none font-medium text-sm"
          style={{
            borderLeft: "1px solid var(--border-primary)",
            borderRight: "1px solid var(--border-primary)",
            color: "var(--text-primary)",
          }}
        />
        <button
          onClick={incrementQuantity}
          className="px-3 py-2 transition-all duration-200 flex items-center justify-center h-full"
          disabled={quantity >= stock}
          style={{
            backgroundColor:
              quantity >= stock ? "#f5f5f5" : "var(--bg-accent-light)",
            color:
              quantity >= stock
                ? "var(--text-secondary)"
                : "var(--brand-primary)",
            opacity: quantity >= stock ? 0.7 : 1,
          }}
          aria-label="Increase quantity"
        >
          <FiPlus size={16} />
        </button>
      </div>
      {stock && (
        <span
          className="text-xs ml-4 mt-1 md:mt-0"
          style={{ color: "var(--text-secondary)" }}
        >
          {stock} items available
        </span>
      )}
    </div>
  );
};

export default ProductQuantitySelector;
