import React from "react";
import { Link } from "react-router-dom";
import Button from "./UI/Button";

const FeaturedProductList = ({ products }) => {
  return (
    <div className="featured-products">
      <h2
        className="text-3xl font-bold mb-10 text-center"
        style={{ color: "var(--text-primary)" }}
      >
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative rounded-lg overflow-hidden transition-all duration-300 transform hover:translate-y-[-5px]"
            style={{
              backgroundColor: "var(--bg-primary)",
              boxShadow: "var(--shadow-small)",
              borderRadius: "var(--rounded-lg)",
            }}
          >
            {/* Sale Tag - Add conditionally when needed */}
            {product.onSale && (
              <div
                className="absolute top-4 left-4 z-10 px-2 py-1 text-xs font-semibold rounded"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                }}
              >
                SALE
              </div>
            )}

            <Link to={`/product/${product.id}`} className="block">
              <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                  loading="lazy"
                />

                {/* Quick Actions Overlay */}
                <div
                  className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  onClick={(e) => e.preventDefault()}
                >
                  <div className="flex space-x-2">
                    <button
                      className="p-2 rounded-full transform hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--brand-primary)",
                      }}
                      aria-label="Quick view"
                      onClick={(e) => {
                        e.preventDefault();
                        // Quick view functionality would go here
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </button>
                    <button
                      className="p-2 rounded-full transform hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--brand-primary)",
                      }}
                      aria-label="Add to wishlist"
                      onClick={(e) => {
                        e.preventDefault();
                        // Add to wishlist functionality would go here
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <h3
                    className="text-lg font-semibold mb-1 line-clamp-2 transition-colors group-hover:text-brand-primary"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.name}
                  </h3>
                </div>

                <div
                  className="text-sm mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {product.category}
                </div>

                <div className="flex items-center mb-3">
                  {/* Star Rating - Add when you have rating data */}
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    ))}
                  </div>
                  <span
                    className="text-xs ml-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    (24 reviews)
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <p
                    className="text-xl font-bold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>
                  {product.originalPrice && (
                    <p
                      className="text-sm line-through"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      ₹{product.originalPrice.toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                <Button
                  variant="primary"
                  fullWidth={true}
                  className="mt-2 group-hover:shadow-md transition-shadow"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "var(--text-on-brand)",
                    borderRadius: "var(--rounded-md)",
                  }}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent navigation
                    // Add to cart functionality would go here
                  }}
                >
                  Add to Cart
                </Button>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProductList;
