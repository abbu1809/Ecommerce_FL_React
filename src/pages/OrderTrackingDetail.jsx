import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiTruck,
  FiLoader,
  FiCheckCircle,
  FiClock,
  FiExternalLink,
  FiPhone,
  FiUser,
  FiCreditCard,
  FiInfo,
  FiShoppingBag,
  FiNavigation,
  FiTarget,
  FiShield,
  FiStar,
  FiAward,
  FiZap,
  FiActivity,
  FiTrendingUp,
  FiRefreshCw,
  FiBox,
  FiMail,
  FiGift,
  FiHeart,
  FiThumbsUp,
  FiX,
} from "react-icons/fi";
import OrderTrackingTimeline from "../components/OrderTracking/OrderTrackingTimeline";
import useOrderStore from "../store/useOrder";

// This page is for /order-tracking/:orderId
const OrderTrackingDetail = () => {
  const { id: orderId } = useParams();
  console.log("OrderTrackingDetail rendered with orderId:", orderId); // Debug log
  const { getOrderById, currentOrder, isLoading, error } = useOrderStore();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        console.log("Fetching order details for:", orderId); // Debug log
        try {
          await getOrderById(orderId);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
    };
    fetchOrderDetails();
  }, [orderId, getOrderById]);

  console.log("Order fetched successfully:", currentOrder); //
  // Transform the current order data to match component expectations
  const transformOrderData = (orderData) => {
    if (!orderData) return null; // Enhanced: Get appropriate description for each status
    const getStatusDescription = (status, isCompleted) => {
      const descriptions = {
        Ordered: isCompleted
          ? "Order confirmed and being processed"
          : "Order will be confirmed",
        Processing: isCompleted
          ? "Payment processed successfully, preparing your order"
          : "Order processing pending",
        Packed: isCompleted
          ? "Items packed and ready for dispatch"
          : "Items will be packed soon",
        Shipped: isCompleted
          ? "Order dispatched from warehouse"
          : "Order will be shipped soon",
        "Out for Delivery": isCompleted
          ? "Package is out for delivery"
          : "Package will be out for delivery",
        Delivered: isCompleted
          ? "Order successfully delivered"
          : "Order will be delivered soon",
      };
      return (
        descriptions[status] ||
        `${status} - ${isCompleted ? "completed" : "pending"}`
      );
    };

    // Map status to display-friendly format
    const getDisplayStatus = (status) => {
      const statusMap = {
        pending_payment: "Ordered",
        payment_successful: "Processing", // Enhanced: Shows "Processing" for successful payments
        processing: "Processing",
        packed: "Packed",
        shipped: "Shipped",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
      };
      return statusMap[status] || status;
    }; // Transform tracking status history to timeline format
    const timeline =
      orderData.tracking_info?.status_history?.map((history) => ({
        status: getDisplayStatus(history.status),
        date: history.timestamp,
        description:
          history.description ||
          `Status updated to ${getDisplayStatus(history.status)}`,
      })) || [];

    // Enhanced timeline with better status progression and descriptions
    const allStatuses = [
      "Ordered",
      "Processing", // Enhanced: Using Processing for consistent flow
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];
    const existingStatuses = timeline.map((t) => t.status);

    // Add missing statuses up to the current status and beyond
    const currentStatusIndex = allStatuses.indexOf(
      getDisplayStatus(orderData.status)
    );

    allStatuses.forEach((status, index) => {
      if (!existingStatuses.includes(status)) {
        // Add completed statuses before current status
        if (index <= currentStatusIndex) {
          timeline.push({
            status,
            date: null, // Will be marked as completed but without specific timestamp
            description: getStatusDescription(status, true),
          });
        } else {
          // Add pending future statuses
          timeline.push({
            status,
            date: null,
            description: getStatusDescription(status, false),
          });
        }
      }
    }); // Sort timeline by expected order
    const statusOrder = [
      "Ordered",
      "Processing", // Updated to match new status flow
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];
    timeline.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    );

    // Format shipping address properly
    const formatShippingAddress = (address) => {
      if (!address) return null;
      return `${address.street_address}, ${address.city}, ${address.state} - ${address.postal_code}`;
    };

    return {
      id: orderData.razorpay_order_id || orderId,
      order_id: orderData.razorpay_order_id || orderId,
      status: getDisplayStatus(orderData.status),
      timeline: timeline,
      estimatedDelivery: orderData.estimated_delivery,
      estimatedDeliveryFormatted: orderData.estimated_delivery_formatted,
      shippingAddress: formatShippingAddress(orderData.address),
      carrier: orderData.tracking_info?.carrier || "Pending",
      trackingNumber: orderData.tracking_info?.tracking_number,
      trackingUrl: orderData.tracking_info?.tracking_url,
      orderItems: orderData.order_items || [],
      totalAmount: orderData.total_amount || orderData.total_amount_calculated,
      currency: orderData.currency || "INR",
      paymentDetails: orderData.payment_details,
      createdAt: orderData.created_at,
      createdAtFormatted: orderData.created_at_formatted,
    };
  };

  // Use the transformed current order data or fall back to mock data
  const displayOrder = currentOrder
    ? transformOrderData(currentOrder)
    : {
        id: orderId,
        order_id: orderId,
        status: "Out for Delivery",
        timeline: [
          { status: "Ordered", date: "2025-05-10T10:00:00Z" },
          { status: "Packed", date: "2025-05-11T09:00:00Z" },
          { status: "Shipped", date: "2025-05-12T14:00:00Z" },
          { status: "Out for Delivery", date: "2025-05-13T08:00:00Z" },
          { status: "Delivered", date: null },
        ],
        estimatedDelivery: "2025-05-14",
        shippingAddress: "123 Main St, Anytown, State 12345",
        carrier: "FastShip Express",
        trackingNumber: "FS78291782X",
      };
  console.log("Order data being used:", displayOrder); // Debug log

  // Show a visible debug indicator on the page
  const isUsingMockData = !currentOrder;
  // Enhanced: Calculate the progress percentage based on current status
  const getProgressPercentage = () => {
    const totalSteps = displayOrder.timeline?.length || 5;
    const currentStepIndex =
      displayOrder.timeline?.findIndex(
        (step) => step.status === displayOrder.status
      ) || 0;
    return Math.min(((currentStepIndex + 1) / totalSteps) * 100, 100);
  };

  // Enhanced: Get status icon based on status
  const getStatusIcon = (status) => {
    const statusIcons = {
      Ordered: <FiShoppingBag />,
      Processing: <FiActivity />,
      Packed: <FiBox />,
      Shipped: <FiTruck />,
      "Out for Delivery": <FiTarget />,
      Delivered: <FiCheckCircle />,
      Cancelled: <FiX />,
    };
    return statusIcons[status] || <FiPackage />;
  };

  // Enhanced: Get status color based on status
  const getStatusColor = (status) => {
    const statusColors = {
      Ordered: "var(--brand-primary)",
      Processing: "var(--info-color)",
      Packed: "var(--brand-secondary)",
      Shipped: "var(--warning-color)",
      "Out for Delivery": "var(--error-color)",
      Delivered: "var(--success-color)",
      Cancelled: "var(--text-secondary)",
    };
    return statusColors[status] || "var(--brand-primary)";
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        className="min-h-screen py-10 flex items-center justify-center"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="text-center">
          <FiLoader
            className="animate-spin h-8 w-8 mx-auto mb-4"
            style={{ color: "var(--brand-primary)" }}
          />
          <p style={{ color: "var(--text-secondary)" }}>
            Loading order details...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className="min-h-screen py-10"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Link
              to="/orders"
              className="inline-flex items-center mb-8 px-4 py-2 rounded-full hover:bg-white/80 transition-all duration-200"
              style={{ color: "var(--brand-primary)" }}
            >
              <FiArrowLeft className="mr-2" />
              <span className="font-medium">Back to Orders</span>
            </Link>
            <div
              className="bg-white rounded-xl shadow-md p-8"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              <FiPackage
                className="h-16 w-16 mx-auto mb-4"
                style={{ color: "var(--error-color)" }}
              />
              <h1
                className="text-2xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Order Not Found
              </h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link
                to="/orders"
                className="inline-block px-6 py-2 rounded-lg"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                }}
              >
                View All Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          </Link>{" "}
          <div
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-6 animate-fadeIn"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-large)",
              background:
                "linear-gradient(135deg, var(--bg-primary) 0%, rgba(99, 102, 241, 0.02) 100%)",
            }}
          >
            {/* Enhanced Header with gradient progress bar */}
            <div className="relative h-3 w-full bg-gradient-to-r from-gray-200 to-gray-100 overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600"
                style={{
                  width: `${getProgressPercentage()}%`,
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
            </div>
            {/* Enhanced Order header info with gradient */}
            <div
              className="p-8 border-b bg-gradient-to-r from-transparent to-blue-50/30"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                <div className="flex items-start space-x-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-lg"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))",
                      color: "white",
                    }}
                  >
                    <FiShoppingBag size={28} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h1
                        className="text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Order #{displayOrder.id || displayOrder.order_id}
                      </h1>
                      <div className="flex items-center space-x-3">
                        {" "}
                        <div
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
                          style={{
                            backgroundColor: `${getStatusColor(
                              displayOrder.status
                            )}15`,
                            color: getStatusColor(displayOrder.status),
                            border: `1px solid ${getStatusColor(
                              displayOrder.status
                            )}30`,
                          }}
                        >
                          {getStatusIcon(displayOrder.status)}
                          <span className="ml-2">{displayOrder.status}</span>
                        </div>
                        {displayOrder.totalAmount && (
                          <div
                            className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium"
                            style={{
                              backgroundColor: "var(--bg-secondary)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <FiCreditCard className="mr-1" size={14} />₹
                            {displayOrder.totalAmount}
                          </div>
                        )}
                      </div>
                    </div>
                    {displayOrder.createdAtFormatted && (
                      <div
                        className="flex items-center text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <FiClock className="mr-2" size={14} />
                        Ordered on {displayOrder.createdAtFormatted}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  className="flex items-center p-4 rounded-xl shadow-sm border"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    borderColor: "var(--border-primary)",
                    background:
                      "linear-gradient(135deg, var(--bg-primary) 0%, rgba(59, 130, 246, 0.05) 100%)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{
                      backgroundColor: "var(--brand-primary)15",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <FiCalendar size={20} />
                  </div>
                  <div>
                    <div
                      className="text-xs font-medium uppercase tracking-wide mb-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Estimated Delivery
                    </div>
                    <div
                      className="font-bold text-lg"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {displayOrder.estimatedDeliveryFormatted ||
                        (displayOrder.estimatedDelivery
                          ? new Date(
                              displayOrder.estimatedDelivery
                            ).toLocaleDateString("en-IN", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            })
                          : "Pending")}
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            {/* Enhanced shipping info cards */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Shipping address card */}
              <div
                className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
                style={{
                  borderColor: "var(--border-primary)",
                  background:
                    "linear-gradient(135deg, var(--bg-primary) 0%, rgba(34, 197, 94, 0.02) 100%)",
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{
                      backgroundColor: "var(--success-color)15",
                      color: "var(--success-color)",
                    }}
                  >
                    <FiMapPin size={18} />
                  </div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Delivery Address
                  </h3>
                </div>
                <div className="ml-13">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {displayOrder.shippingAddress || "Address not available"}
                  </p>
                  <div
                    className="flex items-center mt-3 text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <FiNavigation className="mr-1" size={12} />
                    <span>Primary delivery location</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Carrier info card */}
              <div
                className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
                style={{
                  borderColor: "var(--border-primary)",
                  background:
                    "linear-gradient(135deg, var(--bg-primary) 0%, rgba(59, 130, 246, 0.02) 100%)",
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{
                      backgroundColor: "var(--brand-primary)15",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <FiTruck size={18} />
                  </div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Shipping Details
                  </h3>
                </div>
                <div className="ml-13 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Carrier:
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {displayOrder.carrier || "TBD"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Tracking ID:
                    </span>
                    <div className="flex items-center">
                      {displayOrder.trackingNumber ? (
                        displayOrder.trackingUrl ? (
                          <a
                            href={displayOrder.trackingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center font-mono bg-gray-100 px-3 py-1.5 rounded-lg text-xs hover:bg-gray-200 transition-colors shadow-sm"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            {displayOrder.trackingNumber}
                            <FiExternalLink className="ml-1" size={12} />
                          </a>
                        ) : (
                          <span
                            className="font-mono bg-gray-100 px-3 py-1.5 rounded-lg text-xs"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {displayOrder.trackingNumber}
                          </span>
                        )
                      ) : (
                        <span
                          className="font-mono bg-gray-100 px-3 py-1.5 rounded-lg text-xs"
                          style={{ color: "var(--text-tertiary)" }}
                        >
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                  {displayOrder.carrier && (
                    <div
                      className="flex items-center text-xs pt-2"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      <FiInfo className="mr-1" size={12} />
                      <span>Professional courier service</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Order Items Preview (if available) */}
            {displayOrder.orderItems && displayOrder.orderItems.length > 0 && (
              <div className="px-8 pb-6">
                <div
                  className="p-6 rounded-xl border"
                  style={{
                    borderColor: "var(--border-primary)",
                    background:
                      "linear-gradient(135deg, var(--bg-primary) 0%, rgba(168, 85, 247, 0.02) 100%)",
                  }}
                >
                  <div className="flex items-center mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{
                        backgroundColor: "var(--brand-secondary)15",
                        color: "var(--brand-secondary)",
                      }}
                    >
                      <FiPackage size={18} />
                    </div>
                    <h3
                      className="font-semibold text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Order Items ({displayOrder.orderItems.length})
                    </h3>
                  </div>
                  <div className="ml-13 space-y-2">
                    {displayOrder.orderItems.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2"
                      >
                        <span
                          className="text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {item.product_name ||
                            item.name ||
                            `Item ${index + 1}`}
                        </span>
                        <span
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          Qty: {item.quantity || 1}
                        </span>
                      </div>
                    ))}
                    {displayOrder.orderItems.length > 3 && (
                      <div
                        className="text-xs pt-2"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        +{displayOrder.orderItems.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Timeline section */}
          <div
            className="bg-white rounded-xl shadow-md p-6 animate-fadeIn"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
              animationDelay: "200ms",
            }}
          >
            {" "}
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Delivery Progress
              {isUsingMockData && (
                <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Using Mock Data
                </span>
              )}
            </h2>
            <OrderTrackingTimeline
              timeline={displayOrder.timeline}
              currentStatus={displayOrder.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingDetail;
