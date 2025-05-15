import React from "react";
import { FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";
import Button from "../../components/UI/Button";

const NoResultsFound = ({ resetFilters }) => {
  return (
    <div
      className="rounded-xl p-10 text-center transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-medium)",
      }}
    >
      <div className="flex flex-col items-center">
        <div
          className="flex items-center justify-center w-20 h-20 mb-6 rounded-full"
          style={{ backgroundColor: "var(--bg-accent-light)" }}
        >
          <FiSearch size={32} style={{ color: "var(--brand-primary)" }} />
        </div>

        <h2
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          No products found
        </h2>

        <p
          className="text-base mb-6 max-w-md mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          We couldn't find any products matching your current filters. Try
          adjusting your filters or search criteria.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={resetFilters}
            variant="primary"
            fullWidth={false}
            className="px-5 py-2.5 font-medium flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
            }}
            icon={<FiRefreshCw size={16} />}
          >
            Reset Filters
          </Button>

          <Button
            onClick={resetFilters}
            variant="outline"
            fullWidth={false}
            className="px-5 py-2.5 font-medium flex items-center justify-center gap-2"
            icon={<FiFilter size={16} />}
          >
            Modify Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoResultsFound;
