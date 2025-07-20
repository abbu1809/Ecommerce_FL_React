import React, { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from "react-icons/fi";
import Button from "../../ui/Button";

const SmartPagination = ({ 
  currentPage = 1, 
  totalItems = 0, 
  itemsPerPage = 25,
  onPageChange,
  onLoadMore,
  hasMore = false,
  loading = false,
  showLoadMore = false,
  maxVisiblePages = 5
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [visiblePages, setVisiblePages] = useState([]);

  // Calculate visible page numbers
  useEffect(() => {
    const calculateVisiblePages = () => {
      const pages = [];
      const half = Math.floor(maxVisiblePages / 2);
      
      let start = Math.max(currentPage - half, 1);
      let end = Math.min(start + maxVisiblePages - 1, totalPages);
      
      // Adjust start if we're near the end
      if (end - start + 1 < maxVisiblePages) {
        start = Math.max(end - maxVisiblePages + 1, 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    };

    setVisiblePages(calculateVisiblePages());
  }, [currentPage, totalPages, maxVisiblePages]);

  const handlePageChange = useCallback((page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  }, [currentPage, totalPages, onPageChange]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loading) {
      onLoadMore?.();
    }
  }, [hasMore, loading, onLoadMore]);

  // Don't render if no pagination needed
  if (totalItems <= itemsPerPage && !showLoadMore) {
    return null;
  }

  return (
    <div className="flex items-center justify-between mt-6 p-4 bg-white border-t">
      {/* Items Info */}
      <div className="text-sm text-gray-600">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        {/* Load More Button (Alternative to pagination) */}
        {showLoadMore && hasMore && (
          <Button
            variant="secondary"
            size="sm"
            onClick={handleLoadMore}
            isLoading={loading}
            disabled={!hasMore}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        )}

        {/* Traditional Pagination */}
        {!showLoadMore && totalPages > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className={`p-2 rounded-md border ${
                currentPage === 1 || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
              }`}
            >
              <FiChevronLeft size={16} />
            </button>

            {/* First Page */}
            {visiblePages[0] > 1 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className={`px-3 py-2 rounded-md border text-sm ${
                    currentPage === 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  1
                </button>
                {visiblePages[0] > 2 && (
                  <span className="px-2 text-gray-400">
                    <FiMoreHorizontal size={16} />
                  </span>
                )}
              </>
            )}

            {/* Visible Pages */}
            {visiblePages.map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className={`px-3 py-2 rounded-md border text-sm ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {page}
              </button>
            ))}

            {/* Last Page */}
            {visiblePages[visiblePages.length - 1] < totalPages && (
              <>
                {visiblePages[visiblePages.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-gray-400">
                    <FiMoreHorizontal size={16} />
                  </span>
                )}
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className={`px-3 py-2 rounded-md border text-sm ${
                    currentPage === totalPages
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className={`p-2 rounded-md border ${
                currentPage === totalPages || loading
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
              }`}
            >
              <FiChevronRight size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SmartPagination;
