import React from "react";
import { FiStar, FiCheck, FiAward, FiTruck, FiShield } from "react-icons/fi";

const ProductInfo = ({ product, selectedVariant }) => {
  // Ensure reviews property exists
  const reviews = product.reviews || 0;
  // Get current price based on selected variant or default
  const currentPrice =
    selectedVariant?.discounted_price ||
    selectedVariant?.price ||
    product.discountPrice ||
    product.price ||
    0;
  const originalPrice = selectedVariant?.price || product.price || 0;
  const currentStock = selectedVariant?.stock || product.stock || 0;

  // Calculate discount percentage for current variant
  const hasDiscount =
    currentPrice && originalPrice && currentPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Brand badge */}
      <div
        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: "var(--bg-accent-light)",
          color: "var(--brand-primary)",
        }}
      >
        {product.brand}
      </div>
      {/* Product title */}
      <h1
        className="text-3xl font-bold"
        style={{ color: "var(--text-primary)" }}
      >
        {product.name}
      </h1>
      {/* Ratings */}
      <div className="flex items-center space-x-2">
        <div
          className="flex items-center"
          style={{ color: "var(--brand-primary)" }}
        >
          {[...Array(5)].map((_, index) => (
            <FiStar
              key={index}
              className={`${
                index < Math.floor(product.rating) ? "fill-current" : ""
              } ${
                index === Math.floor(product.rating) && product.rating % 1 > 0
                  ? "fill-current opacity-50"
                  : ""
              }`}
              size={18}
            />
          ))}
        </div>
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {product.rating} ({reviews} ratings)
        </span>
      </div>
      {/* Price section with modern styling */}
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="flex items-baseline flex-wrap gap-2">
          <span
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            ₹{currentPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <>
              <span
                className="text-lg line-through"
                style={{ color: "var(--text-secondary)" }}
              >
                ₹{originalPrice.toLocaleString()}
              </span>
              <span
                className="px-2 py-1 text-xs font-bold rounded-md"
                style={{
                  backgroundColor: "var(--success-color)",
                  color: "white",
                }}
              >
                {discountPercentage}% off
              </span>
            </>
          )}
        </div>
        {/* Availability badge */}
        <div className="flex items-center mt-3">
          <div
            className={`flex items-center ${
              currentStock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            <FiCheck className="mr-1" />
            <span className="font-medium">
              {currentStock > 0
                ? `In Stock (${currentStock} available)`
                : "Out of Stock"}
            </span>
          </div>
          <span
            className="text-sm ml-2"
            style={{ color: "var(--text-secondary)" }}
          >
            ({currentStock} available)
          </span>
        </div>

        {/* Selected variant info */}
        {selectedVariant && (
          <div
            className="mt-3 p-2 rounded-md"
            style={{ backgroundColor: "var(--bg-accent-light)" }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: "var(--brand-primary)" }}
            >
              Selected: {selectedVariant.colors}
            </span>
          </div>
        )}
      </div>
      {/* Product Variants */}
      {(product.colors?.length > 0 ||
        product.ramOptions?.length > 0 ||
        product.storageOptions?.length > 0) && (
        <div className="space-y-4">
          {/* Color variants */}
          {product.colors?.length > 0 && (
            <div>
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Available Colors:
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium rounded-full border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                      borderColor: "var(--border-primary)",
                    }}
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* RAM variants */}
          {product.ramOptions?.length > 0 && (
            <div>
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                RAM Options:
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.ramOptions.map((ram, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium rounded-full border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                      borderColor: "var(--border-primary)",
                    }}
                  >
                    {ram}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Storage variants */}
          {product.storageOptions?.length > 0 && (
            <div>
              <h4
                className="text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Storage Options:
              </h4>
              <div className="flex flex-wrap gap-2">
                {product.storageOptions.map((storage, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium rounded-full border"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-secondary)",
                      borderColor: "var(--border-primary)",
                    }}
                  >
                    {storage}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* Additional info badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div
          className="flex items-center p-3 rounded-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
          }}
        >
          <FiAward className="mr-2" style={{ color: "var(--brand-primary)" }} />
          <span className="text-sm">Authentic Product</span>
        </div>
        <div
          className="flex items-center p-3 rounded-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
          }}
        >
          <FiTruck className="mr-2" style={{ color: "var(--brand-primary)" }} />
          <span className="text-sm">Fast Delivery</span>
        </div>
        <div
          className="flex items-center p-3 rounded-lg"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
          }}
        >
          <FiShield
            className="mr-2"
            style={{ color: "var(--brand-primary)" }}
          />
          <span className="text-sm">Secure Payment</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
