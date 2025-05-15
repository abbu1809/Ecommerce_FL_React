import React from "react";
import { FiArrowDown, FiArrowUp, FiGrid } from "react-icons/fi";

const ProductSorting = ({ sortBy, setSortBy }) => {
  return (
    <div
      className="rounded-xl p-6 mb-6 backdrop-blur-sm"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-medium)",
        borderBottom: "2px solid var(--brand-primary)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0 flex items-center">
          <div
            className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
            style={{ backgroundColor: "var(--bg-accent-light)" }}
          >
            <FiGrid size={16} style={{ color: "var(--brand-primary)" }} />
          </div>
          <div>
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Products Found
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Showing all available products
            </p>
          </div>
        </div>
        <div
          className="flex items-center bg-gray-50 rounded-lg p-1 border transition-all duration-200 hover:border-gray-300"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <label
            htmlFor="sort-by"
            className="text-sm mx-3 font-medium whitespace-nowrap"
            style={{ color: "var(--text-secondary)" }}
          >
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none border-0 bg-transparent rounded px-4 py-2 pr-8 text-sm font-medium focus:outline-none focus:ring-0"
              style={{
                color: "var(--text-primary)",
              }}
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
              {sortBy === "price-low" ? (
                <FiArrowUp
                  size={14}
                  style={{ color: "var(--brand-primary)" }}
                />
              ) : sortBy === "price-high" ? (
                <FiArrowDown
                  size={14}
                  style={{ color: "var(--brand-primary)" }}
                />
              ) : (
                <span
                  className="text-xs font-medium px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: "var(--bg-accent-light)",
                    color: "var(--brand-primary)",
                  }}
                >
                  {sortBy.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSorting;
