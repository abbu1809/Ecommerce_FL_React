import React from "react";
import { Link } from "react-router-dom";
import Button from "./UI/Button";

const FeaturedProductList = ({ products }) => {
  return (
    <div className="featured-products">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-2xl font-bold text-teal-600 mb-2">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Category: {product.category}
                </p>
                <Button
                  variant="primary"
                  fullWidth={true}
                  className="mt-2"
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
