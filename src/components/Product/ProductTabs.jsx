import React from "react";
import { FiStar, FiMessageSquare, FiInfo } from "react-icons/fi";
import Button from "../../components/ui/Button";
import ProductReviews from "./ProductReviews";

const ProductTabs = ({ product, activeTab, setActiveTab }) => {
  // Ensure reviews property exists
  const reviews = product.reviews || 0;

  // Get attribute keys for dynamic tabs
  const attributeKeys = Object.keys(product.attributes || {});

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
        />

        {/* Dynamic attribute tabs */}
        {attributeKeys.map((attributeKey) => (
          <TabButton
            key={attributeKey}
            id={`attribute-${attributeKey}`}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            label={attributeKey
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          />
        ))}

        <TabButton
          id="reviews"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<FiMessageSquare />}
          label={`Reviews (${reviews})`}
        />
      </div>{" "}
      {/* Tab content with animated transitions */}
      <div className="p-6 bg-white min-h-[400px] max-h-[600px] overflow-y-auto custom-scrollbar">
        {activeTab === "description" && (
          <div className="animate-fadeIn">
            <p
              className="mb-6 leading-relaxed text-base"
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
                    className="inline-flex items-center justify-center h-6 w-6 rounded-full mr-3 mt-0.5 text-sm font-medium"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "var(--text-on-brand)",
                    }}
                  >
                    {index + 1}
                  </span>
                  <span
                    className="text-base leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {feature}
                  </span>
                </li>
              ))}

              {/* If no features provided, show placeholder */}
              {(!product.features || product.features.length === 0) && (
                <li className="flex items-start">
                  <span
                    className="inline-flex items-center justify-center h-6 w-6 rounded-full mr-3 mt-0.5 text-sm font-medium"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "var(--text-on-brand)",
                    }}
                  >
                    1
                  </span>
                  <span
                    className="text-base"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    High-quality materials and construction
                  </span>
                </li>
              )}
            </ul>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="animate-fadeIn">
            <h3
              className="font-semibold text-xl mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Technical Specifications
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(product.specifications || {}).map(
                ([key, value]) => (
                  <div key={key} className="group">
                    <div
                      className="flex flex-col p-4 rounded-lg border-2 transition-all duration-300 group-hover:border-orange-500 group-hover:shadow-md"
                      style={{
                        borderColor: "var(--border-primary)",
                        backgroundColor: "var(--bg-secondary)",
                      }}
                    >
                      <span
                        className="text-sm font-medium mb-2 uppercase tracking-wide"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </span>
                      <span
                        className="font-semibold text-base"
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
                  className="col-span-full p-6 rounded-lg text-center"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <FiInfo className="mx-auto mb-2 text-2xl" />
                  <p>Product specifications not available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dynamic attribute content */}
        {attributeKeys.map(
          (attributeKey) =>
            activeTab === `attribute-${attributeKey}` && (
              <div key={attributeKey} className="animate-fadeIn">
                <h3
                  className="font-semibold text-xl mb-6"
                  style={{ color: "var(--text-primary)" }}
                >
                  {attributeKey
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </h3>

                <div
                  className="p-6 rounded-lg border-2"
                  style={{
                    borderColor: "var(--border-primary)",
                    backgroundColor: "var(--bg-accent-light)",
                  }}
                >
                  <div className="text-center">
                    <span
                      className="text-sm font-medium uppercase tracking-wide block mb-3"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {attributeKey}
                    </span>
                    <span
                      className="text-2xl font-bold break-words"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {product.attributes[attributeKey]}
                    </span>
                  </div>
                </div>
              </div>
            )
        )}

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
