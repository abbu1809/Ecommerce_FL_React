import React, { useEffect, useMemo } from "react";
import ReviewList from "../../components/Reviews/ReviewList";
import useReviewStore from "../../store/useReviewStore";
import { useAuthStore } from "../../store/useAuth";

const ProductReviews = ({ productId, product }) => {
  const { reviews, productReviews, addReview, fetchReviews } = useReviewStore();

  const { user } = useAuthStore();

  useEffect(() => {
    // Fetch reviews if we don't have any yet
    if (reviews.length === 0) {
      fetchReviews();
    }
  }, [reviews.length, fetchReviews]);

  // Get reviews for this product
  const productSpecificReviews = useMemo(() => {
    return productReviews[productId] || [];
  }, [productId, productReviews]);

  // Handle adding a new review
  const handleAddReview = (reviewData) => {
    addReview({
      productId,
      productName: product.name,
      user: user?.name || "Anonymous User",
      userEmail: user?.email || "anonymous@example.com",
      ...reviewData,
    });
  };

  // Check if user can add a review (simplified - in a real app this would check purchase history)
  const canAddReview = !!user;
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Customer Reviews
      </h2>

      <ReviewList
        productId={productId}
        reviews={productReviews[productId] || []}
        onAddReview={handleAddReview}
        canAddReview={canAddReview}
        showFilters={true}
      />
    </div>
  );
};

export default ProductReviews;
