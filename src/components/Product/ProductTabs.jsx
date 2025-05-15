import React from "react";
import {
  FiStar,
  FiMessageSquare,
  FiThumbsUp,
  FiUserCheck,
  FiInfo,
} from "react-icons/fi";
import Button from "../../components/UI/Button";

const ProductTabs = ({ product, activeTab, setActiveTab }) => {
  // Ensure reviews property exists
  const reviews = product.reviews || 0;

  // Mock review data for display purposes
  const mockReviews = [
    {
      id: 1,
      user: "Rahul S.",
      rating: 5,
      date: "2 weeks ago",
      title: "Excellent product, worth every penny!",
      comment:
        "This is by far the best product I've purchased this year. The quality exceeds what I expected for the price point.",
      helpful: 12,
    },
    {
      id: 2,
      user: "Priya M.",
      rating: 4,
      date: "1 month ago",
      title: "Good but could be better",
      comment:
        "I like most aspects of this product. It works well overall, but I wish the battery life was a bit better. Otherwise, no complaints!",
      helpful: 8,
    },
  ];

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

        <TabButton
          id="reviews"
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          icon={<FiMessageSquare />}
          label={`Reviews (${reviews})`}
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
        )}

        {activeTab === "reviews" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Rating summary */}
            <div
              className="flex items-center justify-between p-4 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div>
                <div className="flex items-center">
                  <span
                    className="text-4xl font-bold mr-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.rating}
                  </span>
                  <div className="flex flex-col">
                    <div
                      className="flex items-center"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {[...Array(5)].map((_, index) => (
                        <FiStar
                          key={index}
                          size={16}
                          className={`${
                            index < Math.floor(product.rating)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span
                      className="text-sm mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Based on {reviews} reviews
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                fullWidth={false}
                className="group"
                style={{
                  borderColor: "var(--brand-primary)",
                  color: "var(--brand-primary)",
                }}
              >
                <FiUserCheck className="mr-2 group-hover:animate-bounce" />
                Write a Review
              </Button>
            </div>

            {/* Review list */}
            <div className="space-y-6">
              <h3
                className="font-medium text-lg"
                style={{ color: "var(--text-primary)" }}
              >
                Customer Reviews
              </h3>

              {mockReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border transition-shadow hover:shadow-md"
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {review.title}
                      </p>
                      <div className="flex items-center mt-1">
                        <div
                          className="flex"
                          style={{ color: "var(--brand-primary)" }}
                        >
                          {[...Array(5)].map((_, idx) => (
                            <FiStar
                              key={idx}
                              size={14}
                              className={`${
                                idx < review.rating ? "fill-current" : ""
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className="ml-2 text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {review.date}
                        </span>
                      </div>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-accent-light)",
                        color: "var(--brand-primary)",
                      }}
                    >
                      Verified Purchase
                    </span>
                  </div>

                  <p
                    className="my-3 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {review.comment}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div
                      className="flex items-center text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {review.user}
                      </span>
                    </div>

                    <button
                      className="flex items-center text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <FiThumbsUp className="mr-1" />
                      Helpful ({review.helpful})
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
