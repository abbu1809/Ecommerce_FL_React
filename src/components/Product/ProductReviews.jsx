import React, { useEffect } from "react";
import ReviewList from "../../components/Reviews/ReviewList";
import ReviewForm from "./ReviewForm";
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

  // Handle review submitted from ReviewForm
  const handleReviewSubmitted = (reviewData) => {
    // You can refresh the reviews or update local state here
    console.log("Review submitted successfully:", reviewData);
    // Optionally refetch reviews or update the current product
    fetchReviews();
  };

  // Handle adding a new review (for the existing local review system)
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

  // Use API reviews data if available, otherwise fall back to local reviews
  const displayReviews = product.reviewsData && product.reviewsData.length > 0 
    ? product.reviewsData 
    : productReviews[productId] || [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Customer Reviews
      </h2>

      {/* API-based Review Form */}
      <div className="mb-8">
        <ReviewForm
          productId={productId}
          onReviewSubmitted={handleReviewSubmitted}
        />
      </div>      {/* Existing Review List */}
      <ReviewList
        productId={productId}
        reviews={displayReviews}
        onAddReview={handleAddReview}
        canAddReview={canAddReview}
        showFilters={true}
      />
    </div>
  );
};

export default ProductReviews;
