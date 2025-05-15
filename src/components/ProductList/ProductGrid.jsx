import React from "react";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-3"
          style={{ borderColor: "var(--brand-primary)" }}
        ></div>
        <p
          className="text-sm font-medium mt-3"
          style={{ color: "var(--text-secondary)" }}
        >
          Loading products...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return null; // NoResultsFound component will be rendered by the parent
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="opacity-0 animate-fadeIn"
          style={{
            animation: "fadeIn 0.5s forwards",
            animationFillMode: "forwards",
          }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
