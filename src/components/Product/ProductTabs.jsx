import React from "react";
import { FiStar, FiMessageSquare, FiInfo } from "react-icons/fi";
import Button from "../../components/UI/Button";
import ProductReviews from "./ProductReviews";

const ProductTabs = ({ product, activeTab, setActiveTab }) => {
  // Use API reviews data if available, otherwise fall back to product.reviews
  const reviewsCount =
    product.reviewsData && Array.isArray(product.reviewsData)
      ? product.reviewsData.length
      : product.reviews || 0;

  return (
    <div
      className="mt-10 rounded-lg overflow-hidden"
      style={{
        boxShadow: "var(--shadow-medium)",
        border: "1px solid var(--border-primary)",
      }}
    >
      {/* Tab navigation */}
      <div
        className="flex flex-nowrap overflow-x-auto"
        style={{
          backgroundColor: "var(--bg-secondary)",
        }}
      >
        <TabButton
          id="description"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<FiInfo />}
          label="Description"
        />
        <TabButton
          id="specifications"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          label="Specifications"
        />{" "}
        <TabButton
          id="reviews"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<FiMessageSquare />}
          label={`Reviews (${reviewsCount})`}
        />
      </div>

      {/* Tab content with animated transitions */}
      <div className="p-6 bg-white">
        {activeTab === "description" && (
          <div className="animate-fadeIn">
            <p
              className="mb-6 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {product.description}
            </p>

            <h3
              className="font-semibold text-lg mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Key Features:
            </h3>

            <ul className="space-y-3">
              {(product.features || []).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span
                    className="inline-flex items-center justify-center h-5 w-5 rounded-full mr-2 mt-0.5"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "var(--text-on-brand)",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {feature}
                  </span>
                </li>
              ))}

              {/* If no features provided, show placeholder */}
              {(!product.features || product.features.length === 0) && (
                <li className="flex items-start">
                  <span
                    className="inline-flex items-center justify-center h-5 w-5 rounded-full mr-2 mt-0.5"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "var(--text-on-brand)",
                    }}
                  >
                    1
                  </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    High-quality materials and construction
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}
        {activeTab === "specifications" && (
          <div className="animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              {Object.entries(product.specifications || {}).map(
                ([key, value]) => (
                  <div key={key} className="group">
                    <div
                      className="flex flex-col pb-4 border-b-2 transition-colors duration-300 group-hover:border-orange-500"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <span
                        className="text-sm mb-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {key}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {value}
                      </span>
                    </div>
                  </div>
                )
              )}

              {/* Show placeholder if no specifications */}
              {(!product.specifications ||
                Object.keys(product.specifications).length === 0) && (
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Product specifications not available
                </div>
              )}
            </div>
          </div>
        )}{" "}
        {activeTab === "reviews" && (
          <div className="animate-fadeIn">
            <ProductReviews productId={product.id} product={product} />
          </div>
        )}
      </div>
    </div>
  );
};

// Tab button component for cleaner code
const TabButton = ({ id, activeTab, setActiveTab, icon, label }) => {
  const isActive = activeTab === id;

  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-6 py-4 text-sm font-medium flex items-center transition-all duration-300 whitespace-nowrap ${
        isActive ? "border-b-2" : "hover:bg-white/50"
      }`}
      style={{
        borderColor: isActive ? "var(--brand-primary)" : "transparent",
        color: isActive ? "var(--brand-primary)" : "var(--text-secondary)",
        backgroundColor: isActive ? "white" : "transparent",
      }}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
};

export default ProductTabs;
