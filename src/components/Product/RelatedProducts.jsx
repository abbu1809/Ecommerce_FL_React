import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductList/ProductCard";

const RelatedProducts = ({ products, currentProductId, currentCategory }) => {
  // Filter out the current product from related products
  const relatedProducts = products
    .filter((product) => product.id !== currentProductId)
    .slice(0, 8); // Limit to 8 related products

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ color: "var(--text-primary)" }}
          >
            Related Products
          </h2>
          <div
            className="h-1 w-24 mx-auto rounded-full"
            style={{
              backgroundColor: "var(--brand-primary)",
            }}
          ></div>
          <p
            className="mt-4 text-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            You might also like these products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                id: product.id || product._id,
                name:
                  product.name ||
                  `${product.brand} ${product.model || ""}`.trim(),
                image:
                  product.images && product.images.length > 0
                    ? product.images[0]
                    : product.image ||
                      "https://via.placeholder.com/300x300?text=No+Image",
                discountPrice:
                  product.discount_price ||
                  product.offer_price ||
                  product.price,
                price: product.price,
                discount:
                  product.discount ||
                  (product.price && product.discount_price
                    ? `${Math.round(
                        ((product.price -
                          (product.discount_price || product.offer_price)) /
                          product.price) *
                          100
                      )}%`
                    : null),
                rating: product.rating || 4.0,
                reviews: product.reviews || product.reviews_count || 0,
                brand: product.brand || "Unknown",
                category: product.category || "General",
                stock: product.stock || 0,
              }}
            />
          ))}
        </div>

        {/* Show "View All in Category" button */}
        <div className="text-center mt-8">
          <Link
            to={`/products/${currentCategory
              ?.toLowerCase()
              .replace(/\s+/g, "-")}`}
            className="inline-block px-6 py-3 rounded-lg font-semibold transition-colors duration-300 hover:shadow-lg"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
              border: "2px solid var(--brand-primary)",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "var(--brand-primary)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "var(--brand-primary)";
              e.target.style.color = "var(--text-on-brand)";
            }}
          >
            View All {currentCategory} Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
