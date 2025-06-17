import OrderTrackingTimeline from "../components/OrderTracking/OrderTrackingTimeline";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiCalendar,
  FiInfo,
  FiStar,
  FiX,
} from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import { useProductStore } from "../store/useProduct";
import { useAuthStore } from "../store/useAuth";

const OrderTracking = () => {
  // State for review functionality
  const [showReviewCard, setShowReviewCard] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());

  // Store hooks
  const { addReview, reviewLoading, reviewError, clearReviewError } =
    useProductStore();
  const { isAuthenticated, user } = useAuthStore();

  // Example order status data (replace with real data from backend/store)
  const order = {
    id: "ORD123456",
    status: "Delivered", // Changed to "Delivered" to demonstrate review functionality
    timeline: [
      { status: "Ordered", date: "2025-05-10T10:00:00Z" },
      { status: "Packed", date: "2025-05-11T09:00:00Z" },
      { status: "Shipped", date: "2025-05-12T14:00:00Z" },
      { status: "Out for Delivery", date: "2025-05-13T08:00:00Z" },
      { status: "Delivered", date: "2025-05-14T14:30:00Z" },
    ],
    estimatedDelivery: "2025-05-14",
    // Add order items for review functionality
    orderItems: [
      {
        id: 1,
        productId: 1, // Add productId for proper review linking
        name: "iPhone 15 Pro",
        brand: "Apple",
        model: "A3101",
        image: "/mobile1.png",
        price: 99999,
        quantity: 1,
        orderId: "ORD123456",
        orderDate: "2025-05-10T10:00:00Z",
        hasReviewed: false, // Track if user has already reviewed this product
      },
      {
        id: 2,
        productId: 2, // Add productId for proper review linking
        name: "AirPods Pro",
        brand: "Apple",
        model: "A2931",
        image: "/accessories.png",
        price: 24999,
        quantity: 1,
        orderId: "ORD123456",
        orderDate: "2025-05-10T10:00:00Z",
        hasReviewed: false, // Track if user has already reviewed this product
      },
    ],
  }; // Handle opening review card for a specific product
  const handleWriteReview = (product) => {
    const productId = product.productId || product.id;

    // Check if user has already reviewed this product
    if (reviewedProducts.has(productId) || product.hasReviewed) {
      toast.info("You have already reviewed this product");
      return;
    }

    setSelectedProductForReview(product);
    setShowReviewCard(true);
    setRating(0);
    setComment("");
    setHoveredRating(0);
    clearReviewError();
  };

  // Handle closing review card
  const handleCloseReview = () => {
    setShowReviewCard(false);
    setSelectedProductForReview(null);
    setRating(0);
    setComment("");
    setHoveredRating(0);
  };
  // Handle review submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please log in to write a review");
      return;
    }

    if (!selectedProductForReview) {
      toast.error("Product information not available");
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    const productIdToUse =
      selectedProductForReview.productId || selectedProductForReview.id;

    // Double-check if user has already reviewed this product
    if (
      reviewedProducts.has(productIdToUse) ||
      selectedProductForReview.hasReviewed
    ) {
      toast.error("You have already reviewed this product");
      handleCloseReview();
      return;
    }

    clearReviewError();

    const reviewData = {
      rating: rating,
      comment: comment.trim(),
      verified_purchase: true,
      order_id: selectedProductForReview.orderId,
      purchase_date: selectedProductForReview.orderDate,
    };

    const result = await addReview(productIdToUse, reviewData);

    if (result.success) {
      toast.success("Review submitted successfully!");

      // Update the reviewed products set
      setReviewedProducts((prev) => new Set([...prev, productIdToUse]));

      handleCloseReview();
      // Update the order item to show it has been reviewed
      // In a real app, you would refresh the order data from the server
    } else {
      toast.error(result.error || "Failed to submit review. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen py-10"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/orders"
            className="inline-flex items-center mb-8 px-4 py-2 rounded-full hover:bg-white/80 transition-all duration-200"
            style={{ color: "var(--brand-primary)" }}
          >
            <FiArrowLeft className="mr-2" />
            <span className="font-medium">Back to Orders</span>
          </Link>

          <div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            {/* Header section with order info */}
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{
                      backgroundColor: "var(--bg-accent-light)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <FiPackage size={24} />
                  </div>
                  <div>
                    <h1
                      className="text-2xl font-bold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Track Your Order
                    </h1>
                    <p
                      className="text-sm flex items-center"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span className="font-medium mr-1">Order ID:</span>
                      <span
                        className="font-mono bg-gray-100 px-2 py-1 rounded"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.id}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  className="hidden md:block text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div className="text-xs">Current Status</div>
                  <div
                    className="font-semibold mt-1 px-3 py-1 rounded-full text-sm inline-block"
                    style={{
                      backgroundColor:
                        order.status === "Out for Delivery"
                          ? "var(--warning-color)20"
                          : "var(--success-color)20",
                      color:
                        order.status === "Out for Delivery"
                          ? "var(--warning-color)"
                          : "var(--success-color)",
                    }}
                  >
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Estimated delivery banner */}
              <div
                className="mt-6 p-4 rounded-lg flex items-center"
                style={{
                  backgroundColor: "var(--bg-accent-light)",
                  color: "var(--text-primary)",
                }}
              >
                <FiCalendar
                  className="mr-3"
                  size={20}
                  style={{ color: "var(--brand-primary)" }}
                />
                <div>
                  <div className="text-sm font-medium">Estimated Delivery</div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {new Date(order.estimatedDelivery).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline section */}
            <div className="p-6">
              <div
                className="mb-6 p-3 border-l-4 rounded-r-lg flex items-center"
                style={{
                  borderColor: "var(--info-color)",
                  backgroundColor: "var(--info-color)10",
                }}
              >
                <FiInfo
                  className="mr-2"
                  style={{ color: "var(--info-color)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  We'll update this page as your order progresses.
                </p>
              </div>
              <OrderTrackingTimeline
                timeline={order.timeline}
                currentStatus={order.status}
              />
              {/* Order Items Section - Show only when delivered */}
              {order.status === "Delivered" &&
                order.orderItems &&
                order.orderItems.length > 0 && (
                  <div className="mt-8">
                    <h3
                      className="text-lg font-semibold mb-4 flex items-center"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <FiPackage className="mr-2" size={20} />
                      Order Items ({order.orderItems.length})
                    </h3>

                    <div className="space-y-4">
                      {order.orderItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 rounded-lg border"
                          style={{
                            backgroundColor: "var(--bg-secondary)",
                            borderColor: "var(--border-secondary)",
                          }}
                        >
                          <div className="flex items-center space-x-4">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            ) : (
                              <div
                                className="w-16 h-16 rounded-lg flex items-center justify-center"
                                style={{
                                  backgroundColor: "var(--brand-primary)15",
                                  color: "var(--brand-primary)",
                                }}
                              >
                                <FiPackage size={24} />
                              </div>
                            )}

                            <div>
                              <h4
                                className="font-medium text-base"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {item.name}
                              </h4>
                              {item.brand && (
                                <p
                                  className="text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Brand: {item.brand}
                                </p>
                              )}
                              {item.model && (
                                <p
                                  className="text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Model: {item.model}
                                </p>
                              )}
                              <p
                                className="text-sm"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div
                                className="text-lg font-bold"
                                style={{ color: "var(--brand-primary)" }}
                              >
                                ₹{item.price.toLocaleString()}
                              </div>
                            </div>
                            {/* Review button for delivered items */}
                            {item.hasReviewed ||
                            reviewedProducts.has(item.productId || item.id) ? (
                              <div className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-green-50 border border-green-200">
                                <FiStar
                                  size={16}
                                  className="mr-2 text-green-600"
                                />
                                <span className="text-green-700">Reviewed</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleWriteReview(item)}
                                className="flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-orange-100"
                                style={{
                                  color: "var(--brand-primary)",
                                  border: "1px solid var(--brand-primary)",
                                }}
                                title="Write Review"
                              >
                                <FiStar size={16} className="mr-2" />
                                Write Review
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              {/* Review Card - Show when writing review */}
              {showReviewCard && selectedProductForReview && (
                <div className="mt-8">
                  <div
                    className="p-6 rounded-xl border-2 border-dashed animate-fadeIn"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderColor: "var(--brand-primary)",
                      boxShadow: "var(--shadow-medium)",
                    }}
                  >
                    {/* Review Card Header */}
                    <div className="flex items-center justify-between mb-6">
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
                          <h3
                            className="text-xl font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            Write a Review
                          </h3>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Share your experience with this product
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleCloseReview}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <FiX size={20} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div
                      className="p-4 mb-6 rounded-lg border"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-primary)",
                      }}
                    >
                      <div className="flex items-center">
                        {selectedProductForReview.image && (
                          <img
                            src={selectedProductForReview.image}
                            alt={selectedProductForReview.name}
                            className="w-16 h-16 object-cover rounded-lg mr-3"
                          />
                        )}
                        <div className="flex-1">
                          <h4
                            className="font-semibold text-base"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {selectedProductForReview.name}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            From Order #{selectedProductForReview.orderId}
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
                    <form onSubmit={handleSubmitReview}>
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
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
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
                        <div
                          className="mt-2 p-2 rounded-md"
                          style={{ backgroundColor: "var(--success-color)15" }}
                        >
                          <p
                            className="text-xs flex items-center"
                            style={{ color: "var(--success-color)" }}
                          >
                            <FiPackage size={12} className="mr-1" />
                            This review will be marked as a verified purchase
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={handleCloseReview}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
