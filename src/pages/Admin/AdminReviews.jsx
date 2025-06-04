import React, { useState, useEffect } from "react";
import {
  FiStar,
  FiBarChart2,
  FiFlag,
  FiCheckCircle,
  FiFilter,
} from "react-icons/fi";
import ReviewTable from "../../components/Admin/Reviews/ReviewTable";
import useAdminReviews from "../../store/Admin/useAdminReviews";

const AdminReviews = () => {
  const [activeTab, setActiveTab] = useState("all"); // all, pending, flagged
  const { reviews, pendingReviews, flaggedReviews, fetchReviews } =
    useAdminReviews();
  useEffect(() => {
    // Fetch reviews if we don't have any yet
    if (reviews.list.length === 0) {
      fetchReviews();
    }
  }, [reviews.list.length, fetchReviews]); // Calculate review statistics
  const approvedReviews = reviews.list.filter(
    (review) => review.status === "approved"
  );
  const rejectedReviews = reviews.list.filter(
    (review) => review.status === "rejected"
  );
  const verifiedPurchaseReviews = reviews.list.filter(
    (review) => review.is_verified === true
  );
  const totalRating = reviews.list.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating =
    reviews.list.length > 0
      ? (totalRating / reviews.list.length).toFixed(1)
      : 0;
  // Review statistics data
  const reviewStats = {
    total: reviews.list.length,
    pending: pendingReviews.length,
    approved: approvedReviews.length,
    rejected: rejectedReviews.length,
    flagged: flaggedReviews.length,
    averageRating: parseFloat(averageRating),
    verifiedPurchases: verifiedPurchaseReviews.length,
  };

  // Statistics cards
  const statsCards = [
    {
      title: "Total Reviews",
      value: reviewStats.total,
      icon: <FiBarChart2 size={20} />,
      color: "var(--brand-primary)",
    },
    {
      title: "Pending Reviews",
      value: reviewStats.pending,
      icon: <FiFilter size={20} />,
      color: "var(--warning-color)",
    },
    {
      title: "Flagged Reviews",
      value: reviewStats.flagged,
      icon: <FiFlag size={20} />,
      color: "var(--error-color)",
    },
    {
      title: "Avg. Rating",
      value: reviewStats.averageRating.toFixed(1),
      icon: <FiStar size={20} />,
      color: "var(--success-color)",
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fadeIn">
      <div className="mb-6">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Review Management
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>
          Manage customer reviews, approve pending reviews, and address flagged
          content
        </p>
      </div>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className="p-4 rounded-lg flex items-center"
            style={{
              backgroundColor: "var(--bg-primary)",
              boxShadow: "var(--shadow-sm)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <div
              className="rounded-full p-3 mr-4"
              style={{
                backgroundColor: `${card.color}15`, // 15% opacity
                color: card.color,
              }}
            >
              {card.icon}
            </div>
            <div>
              <div
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                {card.title}
              </div>
              <div
                className="text-xl font-bold mt-1"
                style={{ color: "var(--text-primary)" }}
              >
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Additional stats */}
      <div
        className="mb-8 p-5 rounded-lg flex flex-wrap gap-6 justify-between"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border-secondary)",
        }}
      >
        <div className="flex items-center">
          <div
            className="mr-3 p-2 rounded-full"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "var(--success-color)",
            }}
          >
            <FiCheckCircle size={18} />
          </div>
          <div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Approved Reviews
            </div>
            <div
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {reviewStats.approved}
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--text-secondary)" }}
              >
                ({Math.round((reviewStats.approved / reviewStats.total) * 100)}
                %)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className="mr-3 p-2 rounded-full"
            style={{
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              color: "var(--success-color)",
            }}
          >
            <FiCheckCircle size={18} />
          </div>
          <div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Verified Purchase Reviews
            </div>
            <div
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {reviewStats.verifiedPurchases}
              <span
                className="ml-2 text-sm font-normal"
                style={{ color: "var(--text-secondary)" }}
              >
                (
                {Math.round(
                  (reviewStats.verifiedPurchases / reviewStats.total) * 100
                )}
                %)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div
            className="mr-3 p-2 rounded-full"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.1)",
              color: "var(--warning-color)",
            }}
          >
            <FiBarChart2 size={18} />
          </div>
          <div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Rating Distribution
            </div>
            <div className="flex items-center mt-1">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex flex-col items-center mx-1">
                  <div
                    className="h-10 w-4 rounded-t-sm"
                    style={{
                      backgroundColor:
                        rating > 3
                          ? "var(--success-color)"
                          : rating > 1
                          ? "var(--warning-color)"
                          : "var(--error-color)",
                      opacity: 0.7,
                      height: `${25 + rating * 8}px`,
                    }}
                  />
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {rating}★
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Tab navigation */}
      <div
        className="mb-6 border-b"
        style={{ borderColor: "var(--border-secondary)" }}
      >
        <div className="flex space-x-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "all" ? "border-opacity-100" : "border-transparent"
            }`}
            style={{
              borderColor: "var(--brand-primary)",
              color:
                activeTab === "all"
                  ? "var(--brand-primary)"
                  : "var(--text-secondary)",
            }}
          >
            All Reviews
          </button>

          <button
            onClick={() => setActiveTab("pending")}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "pending"
                ? "border-opacity-100"
                : "border-transparent"
            }`}
            style={{
              borderColor: "var(--warning-color)",
              color:
                activeTab === "pending"
                  ? "var(--warning-color)"
                  : "var(--text-secondary)",
            }}
          >
            Pending Reviews
            <span
              className="ml-2 px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor:
                  activeTab === "pending"
                    ? "var(--warning-color)"
                    : "rgba(245, 158, 11, 0.1)",
                color:
                  activeTab === "pending" ? "white" : "var(--warning-color)",
              }}
            >
              {reviewStats.pending}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("flagged")}
            className={`py-3 px-1 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "flagged"
                ? "border-opacity-100"
                : "border-transparent"
            }`}
            style={{
              borderColor: "var(--error-color)",
              color:
                activeTab === "flagged"
                  ? "var(--error-color)"
                  : "var(--text-secondary)",
            }}
          >
            Flagged Reviews
            <span
              className="ml-2 px-2 py-0.5 rounded-full text-xs"
              style={{
                backgroundColor:
                  activeTab === "flagged"
                    ? "var(--error-color)"
                    : "rgba(239, 68, 68, 0.1)",
                color: activeTab === "flagged" ? "white" : "var(--error-color)",
              }}
            >
              {reviewStats.flagged}
            </span>
          </button>
        </div>
      </div>{" "}
      {/* Review table */}
      <ReviewTable activeTab={activeTab} />
    </div>
  );
};

export default AdminReviews;
