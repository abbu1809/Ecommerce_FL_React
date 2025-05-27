import React, { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaCheck } from "react-icons/fa";
import { toast } from "../../utils/toast";

const ReviewRatings = ({
  rating = 0,
  readOnly = false,
  onRatingChange = () => {},
  reviewText = "",
  onReviewTextChange = () => {},
  onSubmit = () => {},
  isVerifiedPurchase = false,
}) => {
  const [hover, setHover] = useState(0);

  // Function to render star ratings (reused from ProductCard.jsx)
  const renderStarRating = (rating, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (interactive) {
        // For interactive rating
        stars.push(
          <span
            key={i}
            className="cursor-pointer text-xl"
            onClick={() => !readOnly && onRatingChange(i + 1)}
            onMouseEnter={() => !readOnly && setHover(i + 1)}
            onMouseLeave={() => !readOnly && setHover(0)}
          >
            {(hover || rating) > i ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-yellow-400" />
            )}
          </span>
        );
      } else {
        // For display only (non-interactive)
        if (i < fullStars) {
          stars.push(<FaStar key={i} className="text-yellow-400" />);
        } else if (i === fullStars && hasHalfStar) {
          stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
        } else {
          stars.push(<FaRegStar key={i} className="text-yellow-400" />);
        }
      }
    }

    return stars;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.warning("Please select a rating");
      return;
    }

    onSubmit({ rating, reviewText });
  };

  return (
    <div className="w-full animate-fadeIn">
      {readOnly ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <div className="flex mr-2">{renderStarRating(rating)}</div>
            <span
              className="text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {rating.toFixed(1)}
            </span>

            {isVerifiedPurchase && (
              <div
                className="ml-3 flex items-center text-xs px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--success-color)",
                  color: "white",
                }}
              >
                <FaCheck className="mr-1" size={10} />
                <span>Verified Purchase</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block mb-2 font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Your Rating
            </label>
            <div className="flex gap-1">{renderStarRating(rating, true)}</div>
          </div>

          <div>
            <label
              className="block mb-2 font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Your Review
            </label>
            <textarea
              value={reviewText}
              onChange={(e) => onReviewTextChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg min-h-[120px]"
              style={{
                border: "1px solid var(--border-primary)",
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
              }}
              placeholder="Share your experience with this product..."
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-medium"
              style={{
                backgroundColor: "var(--brand-primary)",
                color: "var(--text-on-brand)",
              }}
            >
              Submit Review
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewRatings;
