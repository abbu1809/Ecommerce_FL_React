import React from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiGift,
  FiInfo,
} from "react-icons/fi";
import Button from "../../components/UI/Button";

const ProductActions = ({ addToCart, addToWishlist, price }) => {
  // Calculate GST and delivery
  const gst = price * 0.18; // 18% GST
  const shipping = price > 50000 ? 0 : 99;
  const totalPrice = price + gst + shipping;

  return (
    <div
      className="rounded-lg p-4 space-y-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        boxShadow: "var(--shadow-small)",
      }}
    >
      {/* Price details with GST and Delivery */}
      <div
        className="p-4 rounded-lg mb-2"
        style={{ backgroundColor: "var(--bg-accent-light)" }}
      >
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: "var(--text-secondary)" }}>Price:</span>
          <span style={{ color: "var(--text-primary)" }}>
            ₹{price.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: "var(--text-secondary)" }}>GST (18%):</span>
          <span style={{ color: "var(--text-primary)" }}>
            ₹{gst.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span style={{ color: "var(--text-secondary)" }}>Delivery:</span>
          <span
            style={
              shipping === 0
                ? { color: "var(--success-color)" }
                : { color: "var(--text-primary)" }
            }
          >
            {shipping > 0 ? `₹${shipping.toLocaleString()}` : "Free"}
          </span>
        </div>
        <hr
          style={{
            borderColor: "var(--border-primary)",
            margin: "8px 0",
          }}
        />
        <div className="flex justify-between items-center font-bold">
          <span style={{ color: "var(--text-primary)" }}>Total:</span>
          <span style={{ color: "var(--brand-primary)" }}>
            ₹{totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Primary action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={addToCart}
          className="transition-transform hover:scale-105 duration-300"
          style={{
            backgroundColor: "var(--brand-primary)",
            color: "var(--text-on-brand)",
          }}
        >
          <FiShoppingCart className="mr-2" />
          Add to Cart
        </Button>

        <Button
          onClick={addToWishlist}
          variant="outline"
          className="transition-transform hover:scale-105 duration-300"
          style={{
            borderColor: "var(--brand-primary)",
            color: "var(--brand-primary)",
          }}
        >
          <FiHeart className="mr-2" />
          Add to Wishlist
        </Button>
      </div>

      {/* Share button */}
      <div className="flex justify-end">
        <button
          className="inline-flex items-center px-3 py-1 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
            borderWidth: "1px",
            borderColor: "var(--border-primary)",
          }}
        >
          <FiShare2 className="mr-1" />
          <span>Share</span>
        </button>
      </div>

      {/* Divider */}
      <hr style={{ borderColor: "var(--border-primary)" }} />

      {/* Delivery and payment options */}
      <div className="space-y-4">
        <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>
          Delivery & Payment Options
        </h3>

        <div className="space-y-3">
          <div className="flex items-center p-2.5 rounded-md hover:bg-white transition-colors duration-300">
            <div
              className="h-8 w-8 flex items-center justify-center rounded-full mr-3"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              <FiTruck />
            </div>
            <div>
              <p
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Free & Fast Delivery
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Orders ship within 24 hours
              </p>
            </div>
          </div>

          <div className="flex items-center p-2.5 rounded-md hover:bg-white transition-colors duration-300">
            <div
              className="h-8 w-8 flex items-center justify-center rounded-full mr-3"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              <FiCreditCard />
            </div>
            <div>
              <p
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Easy EMI Options
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                3, 6, 9 & 12 months available
              </p>
            </div>
          </div>

          <div className="flex items-center p-2.5 rounded-md hover:bg-white transition-colors duration-300">
            <div
              className="h-8 w-8 flex items-center justify-center rounded-full mr-3"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              <FiGift />
            </div>
            <div>
              <p
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Gift Wrapping
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                Available at additional cost
              </p>
            </div>
          </div>

          <div className="flex items-center p-2.5 rounded-md hover:bg-white transition-colors duration-300">
            <div
              className="h-8 w-8 flex items-center justify-center rounded-full mr-3"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              <FiShield />
            </div>
            <div>
              <p
                className="font-medium text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                Warranty Protection
              </p>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                All products come with warranty
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductActions;
