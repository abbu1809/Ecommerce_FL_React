import React, { useState, useEffect } from "react";
import { FiX, FiStar, FiPackage } from "react-icons/fi";
import toast from "react-hot-toast";
import { useProductStore } from "../../store/useProduct";
import { useAuthStore } from "../../store/useAuth";

const ReviewModal = ({ isOpen, onClose, product }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);

  const { addReview, reviewLoading, reviewError, clearReviewError } =
    useProductStore();
  const { isAuthenticated, user } = useAuthStore();

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setComment("");
      setHoveredRating(0);
      clearReviewError();
    }
  }, [isOpen, clearReviewError]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to write a review");
      return;
    }

    if (!product) {
      toast.error("Product information not available");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    clearReviewError();

    const reviewData = {
      rating: rating,
      comment: comment.trim(),
      // Additional context for order-based reviews
      verified_purchase: true,
      order_id: product.orderId,
      purchase_date: product.orderDate,
    };

    const result = await addReview(product.id, reviewData);
    if (result.success) {
      // Reset form
      setRating(0);
      setComment("");
      setHoveredRating(0);

      toast.success("Review submitted successfully!");
      onClose();
    } else {
      toast.error(result.error || "Failed to submit review. Please try again.");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "var(--bg-overlay)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-slideIn"
        style={{
          backgroundColor: "var(--bg-primary)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              <FiStar size={20} />
            </div>
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Write a Review
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Share your experience with this product
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Product Info */}
        <div
          className="p-4 border-b"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border-primary)",
          }}
        >
          <div className="flex items-center">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg mr-3"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <div className="flex-1">
              <h3
                className="font-semibold text-base"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                From Order #{product.orderId}
              </p>
              <div className="flex items-center mt-1">
                <FiPackage
                  size={12}
                  className="mr-1"
                  style={{ color: "var(--success-color)" }}
                />
                <span
                  className="text-xs"
                  style={{ color: "var(--success-color)" }}
                >
                  Verified Purchase
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {reviewError && (
            <div
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4"
              style={{
                backgroundColor: "var(--error-bg)",
                borderColor: "var(--error-border)",
                color: "var(--error-color)",
              }}
            >
              {reviewError}
            </div>
          )}

          {/* Rating Selection */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Rating *
            </label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform duration-200 hover:scale-110"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <FiStar
                    className={`w-8 h-8 transition-colors duration-200 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p
                className="text-sm mt-2"
                style={{ color: "var(--text-secondary)" }}
              >
                {rating} out of 5 stars
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product... What did you like or dislike about it?"
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200"
              style={{
                borderColor: "var(--border-primary)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                focusRingColor: "var(--brand-primary)",
              }}
              maxLength={1000}
            />
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {comment.length}/1000 characters
              </p>
              {user && (
                <p
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Reviewing as {user.name || user.email}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md font-medium transition-colors duration-200 hover:bg-gray-100"
              style={{
                color: "var(--text-secondary)",
                border: "1px solid var(--border-primary)",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={reviewLoading || rating === 0}
              className="px-6 py-2 rounded-md font-medium transition-all duration-200 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
              }}
            >
              {reviewLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Review"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
