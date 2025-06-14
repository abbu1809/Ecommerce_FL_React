import OrderTrackingTimeline from "../components/OrderTracking/OrderTrackingTimeline";
import ReviewModal from "../components/OrderStatus/ReviewModal";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiCalendar,
  FiInfo,
  FiStar,
} from "react-icons/fi";
import { useState } from "react";

const OrderTracking = () => {
  // State for review modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState(null);

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
        name: "iPhone 15 Pro",
        brand: "Apple",
        model: "A3101",
        image: "/mobile1.png",
        price: 99999,
        quantity: 1,
        orderId: "ORD123456",
        orderDate: "2025-05-10T10:00:00Z",
      },
      {
        id: 2,
        name: "AirPods Pro",
        brand: "Apple",
        model: "A2931",
        image: "/accessories.png",
        price: 24999,
        quantity: 1,
        orderId: "ORD123456",
        orderDate: "2025-05-10T10:00:00Z",
      },
    ],
  };

  // Handle opening review modal for a specific product
  const handleWriteReview = (product) => {
    setSelectedProductForReview(product);
    setIsReviewModalOpen(true);
  };

  // Handle closing review modal
  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setSelectedProductForReview(null);
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
              </div>{" "}
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Review Modal */}
          <ReviewModal
            isOpen={isReviewModalOpen}
            onClose={handleCloseReviewModal}
            product={selectedProductForReview}
          />
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
