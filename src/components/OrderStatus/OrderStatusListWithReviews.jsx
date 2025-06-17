import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiBox,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiPackage,
  FiClock,
  FiXCircle,
  FiEye,
  FiCreditCard,
  FiStar,
  FiEdit3,
} from "react-icons/fi";
import OrderDetailModal from "./OrderDetailModal";
import ReviewModal from "./ReviewModal";
import useOrderStore from "../../store/useOrder";
import toast from "react-hot-toast";
import { formatDateTime } from "../../utils/dateUtils";

const statusIcons = {
  pending_payment: <FiClock />,
  payment_successful: <FiCheckCircle />,
  order_confirmed: <FiPackage />,
  processing: <FiPackage />,
  packed: <FiBox />,
  shipped: <FiTruck />,
  out_for_delivery: <FiMapPin />,
  delivered: <FiCheckCircle />,
  cancelled: <FiXCircle />,
  // Legacy status support
  Ordered: <FiBox />,
  Packed: <FiPackage />,
  Shipped: <FiTruck />,
  "Out for Delivery": <FiMapPin />,
  Delivered: <FiCheckCircle />,
};

const statusColors = {
  pending_payment: "var(--warning-color)",
  payment_successful: "var(--success-color)",
  order_confirmed: "var(--brand-primary)",
  processing: "var(--info-color)",
  packed: "var(--info-color)",
  shipped: "var(--brand-secondary)",
  out_for_delivery: "var(--warning-color)",
  delivered: "var(--success-color)",
  cancelled: "var(--error-color)",
  // Legacy status support
  Ordered: "var(--brand-primary)",
  Packed: "var(--info-color)",
  Shipped: "var(--brand-secondary)",
  "Out for Delivery": "var(--warning-color)",
  Delivered: "var(--success-color)",
};

const getStatusDisplay = (status) => {
  const statusMap = {
    pending_payment: "Pending Payment",
    payment_successful: "Payment Successful",
    order_confirmed: "Order Confirmed",
    processing: "Processing",
    packed: "Packed",
    shipped: "Shipped",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  return statusMap[status] || status;
};

// Helper function to get the latest status from tracking history
const getLatestStatus = (order) => {
  if (
    order.tracking_info &&
    order.tracking_info.status_history &&
    order.tracking_info.status_history.length > 0
  ) {
    const sortedHistory = [...order.tracking_info.status_history].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    return sortedHistory[0].status;
  }
  return order.status;
};

const formatCurrency = (amount, currency = "INR") => {
  if (currency === "INR") {
    return `₹${amount?.toLocaleString()}`;
  }
  return `${amount} ${currency}`;
};

const OrderStatusListWithReviews = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { initiatePayment, isProcessingPayment } = useOrderStore();

  const handleViewDetails = (e, orderId) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening modal for order:", orderId);
    toast.info(`Opening modal for order: ${orderId}`);
    setSelectedOrderId(orderId);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
  };

  const handleWriteReview = (e, product, order) => {
    e.preventDefault();
    e.stopPropagation();

    const latestStatus = getLatestStatus(order);
    if (latestStatus !== "delivered") {
      toast.error("You can only review products from delivered orders");
      return;
    }

    console.log("Opening review modal for product:", product);
    setSelectedProductForReview({
      ...product,
      orderId: order.order_id,
      orderDate: order.created_at,
    });
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProductForReview(null);
  };

  const handleRetryPayment = async (e, order) => {
    e.preventDefault();
    e.stopPropagation();

    const latestStatus = getLatestStatus(order);
    if (latestStatus !== "pending_payment") {
      toast.error("Payment can only be retried for pending payment orders");
      return;
    }

    try {
      if (order.payment_data) {
        await initiatePayment(order.payment_data);
      } else {
        toast.error(
          "Payment information not available. Please contact support."
        );
      }
    } catch (error) {
      console.error("Error retrying payment:", error);
      toast.error("Failed to retry payment. Please try again.");
    }
  };

  return (
    <>
      <div className="space-y-4">
        {orders.map((order) => {
          const latestStatus = getLatestStatus(order);

          return (
            <div
              key={order.order_id}
              className="group hover:bg-gray-50 rounded-lg transition-all duration-200 animate-fadeIn transform hover:translate-y-[-2px] border border-transparent hover:border-gray-100"
              style={{
                backgroundColor: "var(--bg-primary)",
                boxShadow: "var(--shadow-small)",
              }}
            >
              <Link
                to={`/order-tracking/${order.order_id}`}
                className="flex items-center justify-between p-4"
                style={{
                  textDecoration: "none",
                }}
              >
                <div className="flex items-center flex-1">
                  <div
                    className="h-12 w-12 flex items-center justify-center rounded-full mr-4 transition-all duration-300"
                    style={{
                      backgroundColor:
                        statusColors[latestStatus] || "var(--brand-primary)",
                      color: "var(--text-on-brand)",
                      fontSize: 22,
                      boxShadow: "var(--shadow-small)",
                      transform: "scale(1)",
                    }}
                  >
                    {statusIcons[latestStatus] || <FiBox />}
                  </div>
                  <div className="flex-1">
                    <div
                      className="font-semibold text-base mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Order #{order.order_id}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <div
                        className="text-sm flex items-center"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span className="mr-1">Status:</span>
                        <span
                          className="px-2 py-1 rounded-full text-xs"
                          style={{
                            backgroundColor: `${
                              statusColors[latestStatus] ||
                              "var(--brand-primary)"
                            }20`,
                            color:
                              statusColors[latestStatus] ||
                              "var(--brand-primary)",
                            fontWeight: 600,
                          }}
                        >
                          {getStatusDisplay(latestStatus)}
                        </span>
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <span className="hidden sm:inline mx-2">•</span>
                        Placed:
                        {(() => {
                          const dateTime = formatDateTime(order.created_at);
                          return `${dateTime.date} at ${dateTime.time}`;
                        })()}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-4 text-sm">
                      <div style={{ color: "var(--text-secondary)" }}>
                        <span className="font-medium">Amount:</span>
                        <span className="text-green-600 font-semibold">
                          {formatCurrency(order.total_amount, order.currency)}
                        </span>
                      </div>
                      <div style={{ color: "var(--text-secondary)" }}>
                        <span className="font-medium">Items:</span>
                        {order.item_count}
                      </div>
                    </div>

                    {/* Products in order with review options */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded bg-gray-50"
                          >
                            <div className="flex items-center">
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-8 h-8 object-cover rounded mr-2"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              )}
                              <div>
                                <p
                                  className="text-sm font-medium truncate max-w-40"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {item.name}
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  Qty: {item.quantity}
                                </p>
                              </div>
                            </div>

                            {/* Review button for delivered orders */}
                            {latestStatus === "delivered" && (
                              <button
                                onClick={(e) =>
                                  handleWriteReview(e, item, order)
                                }
                                className="flex items-center px-2 py-1 rounded text-xs font-medium transition-colors duration-200 hover:bg-orange-100"
                                style={{
                                  color: "var(--brand-primary)",
                                  border: "1px solid var(--brand-primary)",
                                }}
                                title="Write Review"
                              >
                                <FiStar size={12} className="mr-1" />
                                Review
                              </button>
                            )}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <p
                            className="text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            +{order.items.length - 2} more items...
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {latestStatus === "pending_payment" && (
                    <button
                      onClick={(e) => handleRetryPayment(e, order)}
                      disabled={isProcessingPayment}
                      className="flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 hover:bg-orange-50 disabled:opacity-50"
                      style={{
                        color: "var(--warning-color)",
                        border: "1px solid var(--warning-color)",
                      }}
                      title="Retry Payment"
                    >
                      <FiCreditCard size={12} className="mr-1" />
                      {isProcessingPayment ? "Processing..." : "Retry Payment"}
                    </button>
                  )}

                  <button
                    onClick={(e) => handleViewDetails(e, order.order_id)}
                    className="p-2 rounded-full hover:bg-blue-100 transition-colors duration-200"
                    style={{ color: "var(--brand-primary)" }}
                    title="View Details"
                  >
                    <FiEye size={16} />
                  </button>

                  <div className="flex items-center">
                    <span
                      className="mr-2 text-sm font-medium hidden md:block"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Track Order
                    </span>
                    <div
                      className="bg-gray-100 p-2 rounded-full group-hover:bg-orange-100 transition-colors duration-200"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      <FiChevronRight className="text-lg" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={!!selectedOrderId}
        onClose={closeModal}
        orderId={selectedOrderId}
      />

      {/* Review Modal */}
      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={closeReviewModal}
        product={selectedProductForReview}
      />

      {/* Debug info */}
      {selectedOrderId && (
        <div style={{ display: "none" }}>
          Selected Order ID: {selectedOrderId}
        </div>
      )}
    </>
  );
};

export default OrderStatusListWithReviews;
