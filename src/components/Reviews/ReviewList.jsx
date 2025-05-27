import React, { useState } from "react";
import {
  FiThumbsUp,
  FiFilter,
  FiStar,
  FiChevronDown,
  FiFlag,
} from "react-icons/fi";
import ReviewRatings from "./ReviewRatings";

const ReviewList = ({
  productId,
  reviews = [],
  onAddReview = () => {},
  canAddReview = false,
  showFilters = true,
}) => {
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [filterRating, setFilterRating] = useState(0);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, reviewText: "" });
  const [sortOrder, setSortOrder] = useState("newest"); // newest, highest, lowest, helpful

  // Calculate average rating
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, review) => acc + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  // Filter and sort reviews
  const handleFilterChange = (rating) => {
    setFilterRating(rating);

    if (rating === 0) {
      setFilteredReviews(reviews);
    } else {
      setFilteredReviews(reviews.filter((review) => review.rating === rating));
    }
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
    let sorted = [...filteredReviews];    switch (order) {
      case "newest":
        sorted.sort((a, b) => new Date(b.date || b.created_at) - new Date(a.date || a.created_at));
        break;
      case "highest":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "helpful":
        sorted.sort((a, b) => (b.helpful || 0) - (a.helpful || 0));
        break;
      default:
        break;
    }

    setFilteredReviews(sorted);
  };

  // Handle new review submission
  const handleSubmitReview = (reviewData) => {
    // In a real app, this would call an API
    onAddReview({
      ...reviewData,
      productId,
      date: new Date().toISOString(),
      verified: true, // Assuming the user purchased the product
      helpful: 0,
    });

    setIsAddingReview(false);
    setNewReview({ rating: 0, reviewText: "" });
  };
  // Mark review as helpful
  const handleHelpful = (reviewId) => {
    setFilteredReviews(
      filteredReviews.map((review) =>
        review.id === reviewId
          ? { ...review, helpful: (review.helpful || 0) + 1 }
          : review
      )
    );
  };

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <div className="space-y-8">
      {/* Rating summary */}
      <div
        className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 p-5 rounded-lg"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        {/* Left: Rating overview */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <span
                className="text-4xl font-bold mr-2"
                style={{ color: "var(--text-primary)" }}
              >
                {avgRating}
              </span>
              <div className="flex flex-col">
                <div className="flex">
                  <ReviewRatings
                    rating={parseFloat(avgRating)}
                    readOnly={true}
                  />
                </div>
                <span
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Based on {reviews.length}{" "}
                  {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xs">
            {ratingDistribution.map((dist) => (
              <div key={dist.rating} className="flex items-center mb-1">
                <div className="flex items-center w-16">
                  <span
                    className="text-xs font-medium mr-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {dist.rating}{" "}
                    <FiStar className="inline-block ml-1" size={12} />
                  </span>
                </div>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${dist.percentage}%`,
                      backgroundColor: "var(--brand-primary)",
                    }}
                  ></div>
                </div>
                <span
                  className="text-xs ml-2 w-8"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {dist.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Add review button */}
        {canAddReview && (
          <div className="flex justify-center md:justify-end">
            <button
              onClick={() => setIsAddingReview(true)}
              className="px-6 py-3 rounded-lg font-medium flex items-center"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
              }}
            >
              <FiStar className="mr-2" />
              Write a Review
            </button>
          </div>
        )}
      </div>

      {/* Add review form */}
      {isAddingReview && (
        <div
          className="p-5 rounded-lg animate-fadeIn"
          style={{
            border: "1px solid var(--border-primary)",
            backgroundColor: "var(--bg-primary)",
          }}
        >
          <h3
            className="text-lg font-medium mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Write Your Review
          </h3>

          <ReviewRatings
            rating={newReview.rating}
            readOnly={false}
            reviewText={newReview.reviewText}
            onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
            onReviewTextChange={(text) =>
              setNewReview({ ...newReview, reviewText: text })
            }
            onSubmit={handleSubmitReview}
          />

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsAddingReview(false)}
              className="px-4 py-2 mr-2 rounded-lg font-medium"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Review filters */}
      {showFilters && filteredReviews.length > 0 && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b"
          style={{ borderColor: "var(--border-secondary)" }}
        >
          <div className="flex items-center">
            <FiFilter
              className="mr-2"
              style={{ color: "var(--text-secondary)" }}
            />
            <span
              className="mr-3 text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Filter:
            </span>
            <div className="flex flex-wrap gap-2">
              {[0, 5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleFilterChange(rating)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    filterRating === rating ? "font-semibold" : ""
                  }`}
                  style={{
                    backgroundColor:
                      filterRating === rating
                        ? "var(--brand-primary)"
                        : "var(--bg-secondary)",
                    color:
                      filterRating === rating
                        ? "var(--text-on-brand)"
                        : "var(--text-secondary)",
                  }}
                >
                  {rating === 0 ? "All Ratings" : `${rating} Stars`}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm focus:outline-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-secondary)",
              }}
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
            <FiChevronDown
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              style={{ color: "var(--text-secondary)" }}
            />
          </div>
        </div>
      )}

      {/* Review list */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="p-5 rounded-lg transition-shadow hover:shadow-md"
              style={{
                border: "1px solid var(--border-primary)",
                backgroundColor: "var(--bg-primary)",
              }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {review.title || "Review"}
                  </p>
                  <div className="flex items-center mt-1">
                    <ReviewRatings rating={review.rating} readOnly={true} />                    <span
                      className="ml-2 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {(() => {
                        const dateStr = review.date || review.created_at;
                        if (typeof dateStr === "string") {
                          return new Date(dateStr).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          });
                        }
                        return dateStr;
                      })()}
                    </span>
                  </div>
                </div>

                {review.verified && (
                  <div className="flex items-center">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full"
                      style={{
                        backgroundColor: "var(--bg-accent-light)",
                        color: "var(--success-color)",
                      }}
                    >
                      Verified Purchase
                    </span>
                  </div>
                )}
              </div>

              <p
                className="my-3 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {review.comment || review.reviewText}
              </p>

              <div className="flex items-center justify-between mt-4">
                <div
                  className="flex items-center text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {review.user || "Anonymous"}
                  </span>
                </div>

                <div className="flex items-center space-x-3">                  <button
                    onClick={() => handleHelpful(review.id)}
                    className="flex items-center text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <FiThumbsUp className="mr-1" />
                    Helpful ({review.helpful || 0})
                  </button>

                  <button
                    className="flex items-center text-xs"
                    style={{ color: "var(--text-secondary)" }}
                    title="Report review"
                  >
                    <FiFlag className="mr-1" />
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="p-8 text-center rounded-lg"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
            }}
          >
            <div className="text-lg font-medium mb-2">No reviews yet</div>
            <p>Be the first to share your experience with this product</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
