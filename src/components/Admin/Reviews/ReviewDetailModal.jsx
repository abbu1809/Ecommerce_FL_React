import React from "react";
import { FiStar, FiCheck, FiX, FiFlag, FiTrash2 } from "react-icons/fi";
import Modal from "../../ui/Modal";
import useAdminReviews from "../../../store/Admin/useAdminReviews";
import { toast } from "../../../utils/toast";

const ReviewDetailModal = ({ isOpen, onClose, review }) => {
  const { updateReviewStatus, deleteReview, toggleFlaggedStatus } =
    useAdminReviews();

  if (!review) return null;
  // Format date
  const formattedDate = new Date(review.created_at).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );

  // Handle delete review
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const result = await deleteReview(review.product_id, review.id);
      if (result.success) {
        toast.success(result.message || "Review deleted successfully");
        onClose();
      } else {
        toast.error(result.error || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    try {
      const result = await updateReviewStatus(
        review.product_id,
        review.id,
        newStatus
      );
      if (result.success) {
        toast.success(result.message || `Review ${newStatus} successfully`);
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Handle flag toggle
  const handleToggleFlag = async () => {
    try {
      const result = await toggleFlaggedStatus(review.product_id, review.id);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error || "Failed to update flag status");
      }
    } catch (error) {
      console.error("Error updating flag status:", error);
      toast.error("Failed to update flag status");
    }
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FiStar
          key={i}
          size={16}
          className={i < rating ? "fill-current" : ""}
          style={{ color: "var(--brand-primary)" }}
        />
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Details"
      size="lg"
      actions={
        <div className="flex space-x-2">
          {review.status === "pending" && (
            <>
              <button
                onClick={() => handleStatusUpdate("approved")}
                className="px-4 py-2 rounded text-white text-sm font-medium"
                style={{ backgroundColor: "var(--success-color)" }}
              >
                <FiCheck className="inline-block mr-1" /> Approve
              </button>
              <button
                onClick={() => handleStatusUpdate("rejected")}
                className="px-4 py-2 rounded text-white text-sm font-medium"
                style={{ backgroundColor: "var(--error-color)" }}
              >
                <FiX className="inline-block mr-1" /> Reject
              </button>
            </>
          )}
          <button
            onClick={handleToggleFlag}
            className="px-4 py-2 rounded text-sm font-medium"
            style={{
              backgroundColor:
                review.reported_count > 0
                  ? "var(--error-color)"
                  : "transparent",
              color: review.reported_count > 0 ? "white" : "var(--error-color)",
              border:
                review.reported_count > 0
                  ? "none"
                  : "1px solid var(--error-color)",
            }}
          >
            <FiFlag className="inline-block mr-1" />
            {review.reported_count > 0 ? "Remove Flag" : "Flag Review"}
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded text-sm font-medium"
            style={{
              backgroundColor: "transparent",
              color: "var(--error-color)",
              border: "1px solid var(--error-color)",
            }}
          >
            <FiTrash2 className="inline-block mr-1" /> Delete
          </button>
        </div>
      }
    >
      <div className="p-4">
        {/* Product and Review Info */}
        <div className="flex items-start mb-6">
          <div
            className="flex-shrink-0 w-20 h-20 rounded overflow-hidden bg-gray-100 border"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <img
              src={review.productImage || "/public/logo.jpg"}
              alt={review.product_name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4 flex-grow">
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {review.product_name}
            </h3>
            <div className="flex items-center mt-1">
              {renderRating(review.rating)}
              <span
                className="ml-2 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                {review.rating}/5
              </span>
            </div>
            <div
              className="mt-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Product ID: {review.product_id}
            </div>
          </div>
        </div>
        {/* Review Content */}
        <div
          className="p-4 mb-6 rounded"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderLeft: `3px solid var(--brand-primary)`,
          }}
        >
          <h4
            className="text-md font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {review.title || "Review"}
          </h4>
          <p className="text-sm mb-3" style={{ color: "var(--text-primary)" }}>
            {review.comment}
          </p>
          <div
            className="flex items-center justify-between text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>
              {formattedDate}
              {review.edited && <span className="ml-2 italic">(edited)</span>}
            </span>
            <span>
              {review.helpful_users?.length || 0} people found this helpful
            </span>
          </div>
        </div>
        {/* User Info */}
        <div
          className="border-t pt-4 mb-4"
          style={{ borderColor: "var(--border-secondary)" }}
        >
          <h4
            className="text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Reviewer Information
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div
                className="text-xs mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Username
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                {review.email?.split("@")[0] || "Unknown User"}
                {review.is_verified && (
                  <span
                    className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: "var(--success-color)",
                      color: "white",
                    }}
                  >
                    <FiCheck size={10} className="mr-1" />
                    Verified
                  </span>
                )}
              </div>
            </div>
            <div>
              <div
                className="text-xs mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </div>
              <div className="text-sm" style={{ color: "var(--text-primary)" }}>
                {review.email}
              </div>
            </div>
          </div>
        </div>
        {/* Review Status */}
        <div
          className="border-t pt-4"
          style={{ borderColor: "var(--border-secondary)" }}
        >
          <h4
            className="text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Review Status
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div
                className="text-xs mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Status
              </div>
              <div>
                <span
                  className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  style={{
                    backgroundColor:
                      review.status === "approved"
                        ? "rgba(16, 185, 129, 0.1)"
                        : review.status === "pending"
                        ? "rgba(245, 158, 11, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                    color:
                      review.status === "approved"
                        ? "var(--success-color)"
                        : review.status === "pending"
                        ? "var(--warning-color)"
                        : "var(--error-color)",
                  }}
                >
                  {review?.status?.charAt(0)?.toUpperCase() +
                    review?.status?.slice(1)}
                </span>
              </div>
            </div>
            <div>
              <div
                className="text-xs mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Flagged
              </div>
              <div>
                {review.reported_count > 0 ? (
                  <span
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={{
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      color: "var(--error-color)",
                    }}
                  >
                    Yes ({review.reported_count}
                    {review.reported_count === 1 ? "report" : "reports"})
                  </span>
                ) : (
                  <span
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={{
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      color: "var(--success-color)",
                    }}
                  >
                    No
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ReviewDetailModal;
