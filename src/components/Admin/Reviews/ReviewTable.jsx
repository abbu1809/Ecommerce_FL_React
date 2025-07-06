import React, { useState, useEffect } from "react";
import {
  FiStar,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheck,
  FiX,
  FiFlag,
} from "react-icons/fi";
import useAdminReviews from "../../../store/Admin/useAdminReviews";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import ConfirmModal from "../../ui/ConfirmModal";
import ReviewDetailModal from "./ReviewDetailModal";
import { toast } from "../../../utils/toast";

const ReviewTable = ({ activeTab = "all" }) => {
  const { reviews, updateReviewStatus, deleteReview, fetchReviews } =
    useAdminReviews();

  const {
    isOpen: confirmModalIsOpen,
    modalConfig,
    isLoading: confirmLoading,
    showConfirm,
    hideConfirm,
    handleConfirm,
  } = useConfirmModal();

  // State for review detail modal
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Open review detail modal
  const openDetailModal = (review) => {
    setSelectedReview(review);
    setIsDetailModalOpen(true);
  };

  // Close review detail modal
  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedReview(null);
  };

  useEffect(() => {
    // Fetch reviews if we don't have any yet
    if (reviews.list.length === 0) {
      fetchReviews();
    }

    // Set the status filter based on the activeTab
    if (activeTab === "pending") {
      setStatusFilter("pending");
    } else if (activeTab === "flagged") {
      setFlaggedFilter(true);
      setStatusFilter("all");
    } else {
      setFlaggedFilter(false);
      setStatusFilter("all");
    }
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all"); // all, approved, pending, rejected
  const [flaggedFilter, setFlaggedFilter] = useState(false);
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [ratingFilter, setRatingFilter] = useState(0); // 0 means all ratings
  // Handle delete review
  const handleDeleteReview = (productId, reviewId) => {
    showConfirm({
      title: "Delete Review",
      message:
        "Are you sure you want to delete this review? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: async () => {
        try {
          const result = await deleteReview(productId, reviewId);
          if (result.success) {
            toast.success(result.message || "Review deleted successfully");
          } else {
            toast.error(result.error || "Failed to delete review");
          }
        } catch (error) {
          console.error("Error deleting review:", error);
          toast.error("Failed to delete review");
        }
      },
    });
  }; // Handle status change is now handled by the ReviewDetailModal// Handle flagged state change

  const filteredReviews = reviews.list.filter((review) => {
    // Status filter
    if (statusFilter !== "all" && review.status !== statusFilter) return false; // Flagged filter
    if (flaggedFilter && review.reported_count <= 0) return false;

    // Verified filter
    if (verifiedFilter && !review.is_verified) return false;

    // Rating filter
    if (ratingFilter !== 0 && review.rating !== ratingFilter) return false;

    return true;
  });

  // Render status badge
  const renderStatusBadge = (status) => {
    let style = {};
    let label = "";

    switch (status) {
      case "approved":
        style = {
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          color: "var(--success-color)",
        };
        label = "Approved";
        break;
      case "pending":
        style = {
          backgroundColor: "rgba(245, 158, 11, 0.1)",
          color: "var(--warning-color)",
        };
        label = "Pending";
        break;
      case "rejected":
        style = {
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "var(--error-color)",
        };
        label = "Rejected";
        break;
      default:
        style = {
          backgroundColor: "rgba(107, 114, 128, 0.1)",
          color: "var(--text-secondary)",
        };
        label = "Unknown";
    }

    return (
      <span
        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
        style={style}
      >
        {label}
      </span>
    );
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <FiStar
          key={i}
          size={12}
          className={i < rating ? "fill-current" : ""}
          style={{ color: "var(--brand-primary)" }}
        />
      );
    }
    return <div className="flex items-center">{stars}</div>;
  };

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label
            htmlFor="status-filter"
            className="block text-xs mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Status
          </label>
          <select
            id="status-filter"
            className="rounded-md text-sm px-3 py-2 border"
            style={{
              borderColor: "var(--border-primary)",
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="rating-filter"
            className="block text-xs mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Rating
          </label>
          <select
            id="rating-filter"
            className="rounded-md text-sm px-3 py-2 border"
            style={{
              borderColor: "var(--border-primary)",
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
            value={ratingFilter}
            onChange={(e) => setRatingFilter(parseInt(e.target.value))}
          >
            <option value="0">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="flex items-end space-x-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 mr-2"
              style={{ color: "var(--brand-primary)" }}
              checked={flaggedFilter}
              onChange={() => setFlaggedFilter(!flaggedFilter)}
            />
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>
              Flagged Reviews
            </span>
          </label>

          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 mr-2"
              style={{ color: "var(--brand-primary)" }}
              checked={verifiedFilter}
              onChange={() => setVerifiedFilter(!verifiedFilter)}
            />
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>
              Verified Purchases
            </span>
          </label>
        </div>
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto rounded-lg shadow"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRadius: "var(--rounded-lg)",
        }}
      >
        <table
          className="min-w-full divide-y"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <thead>
            <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
              <th
                className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Product
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                User
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Rating
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Review
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Date
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: "var(--border-primary)" }}
          >
            {filteredReviews.map((review) => (
              <tr
                key={review.id}
                className="hover:bg-gray-50 transition-colors duration-150"
                style={{
                  backgroundColor:
                    review.reported_count > 0
                      ? "rgba(239, 68, 68, 0.05)"
                      : "transparent",
                }}
              >
                {/* Product */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100 border"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <img
                        src={review.productImage || "/public/logo.jpg"}
                        alt={review.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {review.product_name}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Product ID: {review.product_id}
                      </div>
                    </div>
                  </div>
                </td>
                {/* User */}
                <td className="px-6 py-4 whitespace-nowrap">
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
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {review.email}
                  </div>
                </td>
                {/* Rating */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderRating(review.rating)}
                </td>
                {/* Review */}
                <td className="px-6 py-4">
                  <div
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {review.title || "No Title"}
                  </div>
                  <div
                    className="text-xs line-clamp-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {review.comment}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span
                      className="font-medium"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {review.helpful_users?.length || 0}
                    </span>
                    found helpful
                  </div>
                </td>
                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderStatusBadge(review.status)}
                </td>
                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {new Date(review.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {new Date(review.created_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>
                </td>
                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      style={{ color: "var(--text-secondary)" }}
                      title="View Review"
                      onClick={() => openDetailModal(review)}
                    >
                      <FiEye size={16} />
                    </button>
                    {review.status === "pending" && (
                      <>
                        <button
                          onClick={() => {
                            showConfirm({
                              title: "Approve Review",
                              message:
                                "Are you sure you want to approve this review?",
                              confirmText: "Approve",
                              cancelText: "Cancel",
                              type: "success",
                              onConfirm: async () => {
                                try {
                                  const result = await updateReviewStatus(
                                    review.product_id,
                                    review.id,
                                    "approved"
                                  );
                                  if (result.success) {
                                    toast.success(
                                      result.message ||
                                        "Review approved successfully"
                                    );
                                  } else {
                                    toast.error(
                                      result.error || "Failed to approve review"
                                    );
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error approving review:",
                                    error
                                  );
                                  toast.error("Failed to approve review");
                                }
                              },
                            });
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          style={{ color: "var(--success-color)" }}
                          title="Approve Review"
                        >
                          <FiCheck size={16} />
                        </button>
                        <button
                          onClick={() => {
                            showConfirm({
                              title: "Reject Review",
                              message:
                                "Are you sure you want to reject this review?",
                              confirmText: "Reject",
                              cancelText: "Cancel",
                              type: "warning",
                              onConfirm: async () => {
                                try {
                                  const result = await updateReviewStatus(
                                    review.product_id,
                                    review.id,
                                    "rejected"
                                  );
                                  if (result.success) {
                                    toast.success(
                                      result.message ||
                                        "Review rejected successfully"
                                    );
                                  } else {
                                    toast.error(
                                      result.error || "Failed to reject review"
                                    );
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error rejecting review:",
                                    error
                                  );
                                  toast.error("Failed to reject review");
                                }
                              },
                            });
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                          style={{ color: "var(--error-color)" }}
                          title="Reject Review"
                        >
                          <FiX size={16} />
                        </button>
                      </>
                    )}
                    <button
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      style={{ color: "var(--error-color)" }}
                      title="Delete Review"
                      onClick={() =>
                        handleDeleteReview(review.product_id, review.id)
                      }
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredReviews.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-10 text-center text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div className="font-medium mb-1">No reviews found</div>
                  <div className="text-xs">Try adjusting your filters</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table footer with pagination (simplified) */}
        <div
          className="px-6 py-3 flex items-center justify-between border-t"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Showing {filteredReviews.length} of {reviews.list.length} reviews
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className="px-3 py-1 text-sm rounded-md"
                style={{
                  backgroundColor:
                    page === 1 ? "var(--brand-primary)" : "var(--bg-secondary)",
                  color:
                    page === 1
                      ? "var(--text-on-brand)"
                      : "var(--text-secondary)",
                }}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModalIsOpen}
        onClose={hideConfirm}
        onConfirm={handleConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        cancelText={modalConfig.cancelText}
        type={modalConfig.type}
        isLoading={confirmLoading}
      />

      {/* Review Detail Modal */}
      <ReviewDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        review={selectedReview}
      />
    </div>
  );
};

export default ReviewTable;
