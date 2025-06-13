import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  showItemCount = true,
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePageNumbers();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
      {showItemCount && (
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Showing {startItem} to {endItem} of {totalItems} products
        </div>
      )}

      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
          aria-label="Previous page"
        >
          <FiChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span
                className="flex items-center justify-center w-10 h-10"
                style={{ color: "var(--text-secondary)" }}
              >
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`flex items-center justify-center w-10 h-10 rounded-md border transition-colors ${
                  currentPage === page ? "font-semibold" : "hover:bg-opacity-50"
                }`}
                style={{
                  backgroundColor:
                    currentPage === page
                      ? "var(--brand-primary)"
                      : "var(--bg-primary)",
                  borderColor:
                    currentPage === page
                      ? "var(--brand-primary)"
                      : "var(--border-primary)",
                  color:
                    currentPage === page
                      ? "var(--text-on-brand)"
                      : "var(--text-primary)",
                }}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-md border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--bg-primary)",
            borderColor: "var(--border-primary)",
            color: "var(--text-primary)",
          }}
          aria-label="Next page"
        >
          <FiChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
