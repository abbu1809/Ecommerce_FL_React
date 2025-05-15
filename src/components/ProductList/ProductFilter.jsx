import React from "react";
import { FiFilter, FiXCircle, FiSliders } from "react-icons/fi";
import Button from "../../components/UI/Button";

const ProductFilter = ({
  showFilters,
  setShowFilters,
  brands,
  selectedBrands,
  toggleBrandFilter,
  priceRange,
  handlePriceChange,
  setPriceRange,
  setSelectedBrands,
}) => {
  return (
    <>
      {/* Mobile Filter Button */}
      <div className="w-full md:hidden mb-4">
        <Button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 py-2.5"
          variant="outline"
          icon={<FiFilter size={18} />}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      {/* Filter Sidebar */}
      <div
        className={`
          ${showFilters ? "block" : "hidden md:block"}
          w-full md:w-1/4 rounded-xl p-6 sticky top-4 transition-all duration-300
        `}
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "var(--shadow-medium)",
          borderLeft: "4px solid var(--brand-primary)",
        }}
      >
        <div className="flex items-center justify-between mb-7">
          <h2
            className="text-lg font-bold flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <FiSliders
              className="text-lg"
              style={{ color: "var(--brand-primary)" }}
            />
            Filters
          </h2>
          <button
            onClick={() => {
              setSelectedBrands([]);
              setPriceRange({ min: 0, max: 150000 });
            }}
            className="text-sm font-medium hover:underline transition-all duration-200 flex items-center gap-1"
            style={{ color: "var(--brand-primary)" }}
          >
            <FiXCircle size={16} />
            Clear All
          </button>
        </div>

        {/* Brand Filter */}
        <div className="mb-8">
          <h3
            className="text-base font-semibold mb-4 pb-2"
            style={{
              color: "var(--text-primary)",
              borderBottom: "1px solid var(--border-primary)",
            }}
          >
            Brand
          </h3>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center">
                <input
                  type="checkbox"
                  id={`brand-${brand}`}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrandFilter(brand)}
                  className="h-5 w-5 rounded border-gray-300 cursor-pointer transition-all duration-200"
                  style={{
                    accentColor: "var(--brand-primary)",
                  }}
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="ml-3 cursor-pointer text-sm font-medium hover:text-brand-primary transition-colors duration-200"
                  style={{
                    color: selectedBrands.includes(brand)
                      ? "var(--brand-primary)"
                      : "var(--text-primary)",
                  }}
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-8">
          <h3
            className="text-base font-semibold mb-4 pb-2"
            style={{
              color: "var(--text-primary)",
              borderBottom: "1px solid var(--border-primary)",
            }}
          >
            Price Range
          </h3>
          <div className="flex items-center justify-between mb-3 px-1">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--brand-primary)" }}
            >
              ₹{priceRange.min.toLocaleString()}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--brand-primary)" }}
            >
              ₹{priceRange.max.toLocaleString()}
            </span>
          </div>
          <div className="mb-5 mt-4">
            <input
              type="range"
              min="0"
              max="150000"
              value={priceRange.min}
              onChange={(e) => handlePriceChange(e, "min")}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background:
                  "linear-gradient(to right, var(--border-primary) 0%, var(--brand-primary) 100%)",
              }}
            />
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="150000"
              value={priceRange.max}
              onChange={(e) => handlePriceChange(e, "max")}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background:
                  "linear-gradient(to right, var(--brand-primary) 0%, var(--border-primary) 100%)",
              }}
            />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="min-price"
                className="block text-sm mb-1.5 font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Min Price
              </label>
              <input
                type="number"
                id="min-price"
                value={priceRange.min}
                onChange={(e) => handlePriceChange(e, "min")}
                className="w-full rounded-lg px-3 py-2.5 text-sm border transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:outline-none"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  focusRingColor: "var(--brand-primary)",
                }}
              />
            </div>
            <div>
              <label
                htmlFor="max-price"
                className="block text-sm mb-1.5 font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Max Price
              </label>
              <input
                type="number"
                id="max-price"
                value={priceRange.max}
                onChange={(e) => handlePriceChange(e, "max")}
                className="w-full rounded-lg px-3 py-2.5 text-sm border transition-all duration-200 focus:ring-2 focus:ring-offset-0 focus:outline-none"
                style={{
                  borderColor: "var(--border-primary)",
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  focusRingColor: "var(--brand-primary)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Apply Filters Button (Mobile Only) */}
        <div className="md:hidden">
          <Button
            onClick={() => setShowFilters(false)}
            fullWidth={true}
            variant="primary"
            className="py-2.5 text-sm font-medium"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProductFilter;
