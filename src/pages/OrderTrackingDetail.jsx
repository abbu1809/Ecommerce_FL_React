import React, { useEffect, useState } from "react";
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
  FiDownload,
} from "react-icons/fi";
import OrderTrackingTimeline from "../components/OrderTracking/OrderTrackingTimeline";
import useOrderStore from "../store/useOrder";
import toast from "react-hot-toast";
import { useProductStore } from "../store/useProduct";
import { useAuthStore } from "../store/useAuth";

// This page is for /order-tracking/:orderId
const OrderTrackingDetail = () => {
  const { id: orderId } = useParams();
  console.log("OrderTrackingDetail rendered with orderId:", orderId); // Debug log
  const { getOrderById, currentOrder, isLoading, error } = useOrderStore();
  // State for review functionality
  const [showReviewCard, setShowReviewCard] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] =
    useState(null);
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [comment, setComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewedProducts, setReviewedProducts] = useState(new Set());
  // Store hooks for review functionality
  const {
    addReview,
    reviewLoading,
    reviewError,
    clearReviewError,
    checkExistingReview,
  } = useProductStore();
  const { isAuthenticated, user } = useAuthStore();

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

  console.log("Order fetched successfully:", currentOrder); //  // Handle opening review card for a specific product
  const handleWriteReview = (product) => {
    const productId = product.product_id || product.id;

    // Check if user has already reviewed this product
    if (reviewedProducts.has(productId)) {
      toast.info("You have already reviewed this product");
      return;
    }

    setSelectedProductForReview(product);
    setShowReviewCard(true);
    setRating(0);
    setReviewTitle("");
    setComment("");
    setHoveredRating(0);
    clearReviewError();
  };
  // Handle closing review card
  const handleCloseReview = () => {
    setShowReviewCard(false);
    setSelectedProductForReview(null);
    setRating(0);
    setReviewTitle("");
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

    if (!reviewTitle.trim()) {
      toast.error("Please enter a review title");
      return;
    }

    const productIdToUse =
      selectedProductForReview.product_id || selectedProductForReview.id;

    // Double-check if user has already reviewed this product
    if (reviewedProducts.has(productIdToUse)) {
      toast.error("You have already reviewed this product");
      handleCloseReview();
      return;
    }
    clearReviewError();
    const reviewData = {
      rating: rating,
      title: reviewTitle.trim(),
      comment: comment.trim(),
      verified_purchase: true,
      order_id:
        currentOrder?.invoice_id || currentOrder?.razorpay_order_id || orderId,
      purchase_date: currentOrder?.created_at,
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
  }; // Load review status for all products in the order
  useEffect(() => {
    const loadReviewStatuses = async () => {
      const orderItems = currentOrder?.order_items || currentOrder?.orderItems;
      console.log("Loading review statuses for items:", orderItems); // Debug log

      if (orderItems && orderItems.length > 0 && isAuthenticated && user) {
        const reviewedSet = new Set();

        for (const item of orderItems) {
          const productId = item.product_id || item.id;
          console.log(
            "Checking review for product:",
            productId,
            "Item data:",
            item
          ); // Debug log

          if (productId) {
            try {
              const result = await checkExistingReview(productId);
              console.log(`Review check result for ${productId}:`, result); // Debug log

              if (result.success && result.has_reviewed) {
                reviewedSet.add(productId);
                console.log(`Product ${productId} has been reviewed`); // Debug log
              }
            } catch (error) {
              console.error(
                `Error checking review for product ${productId}:`,
                error
              );
            }
          }
        }

        console.log("Final reviewed products set:", Array.from(reviewedSet)); // Debug log
        setReviewedProducts(reviewedSet);
      } else {
        console.log("Review status loading skipped:", {
          orderItems: !!orderItems,
          orderItemsLength: orderItems?.length,
          isAuthenticated,
          user: !!user,
        });
      }
    };

    // Only run this if we have the current order loaded
    if (currentOrder) {
      loadReviewStatuses();
    }
  }, [currentOrder, isAuthenticated, user, checkExistingReview]);

  // Transform the current order data to match component expectations
  const transformOrderData = (orderData) => {
    if (!orderData) return null; // Enhanced: Get appropriate description for each status
    const getStatusDescription = (status, isCompleted) => {
      const descriptions = {
        "Pending Payment": isCompleted
          ? "Awaiting payment confirmation"
          : "Payment will be processed",
        "Payment Successful": isCompleted
          ? "Payment received successfully"
          : "Payment confirmation pending",
        Assigned: isCompleted
          ? "Order assigned to delivery partner"
          : "Order will be assigned to partner",
        Processing: isCompleted
          ? "Order is being processed"
          : "Order processing will begin",
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
        "Failed Delivery Attempt": isCompleted
          ? "Delivery attempt was unsuccessful"
          : "Delivery will be retried",
        "Returning to Warehouse": isCompleted
          ? "Package is being returned to warehouse"
          : "Package may need to be returned",
        Cancelled: isCompleted
          ? "Order has been cancelled"
          : "Order cancellation pending",
      };
      return (
        descriptions[status] ||
        `${status} - ${isCompleted ? "completed" : "pending"}`
      );
    }; // Map status to display-friendly format
    const getDisplayStatus = (status) => {
      console.log("Mapping status:", status); // Debug log
      const statusMap = {
        pending_payment: "Pending Payment",
        payment_successful: "Payment Successful",
        assigned: "Assigned",
        processing: "Processing",
        packed: "Packed",
        shipped: "Shipped",
        out_for_delivery: "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
        failed_attempt: "Failed Delivery Attempt",
        returning_to_warehouse: "Returning to Warehouse",
        other: "Other Status",
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
      })) || []; // Enhanced timeline with better status progression and descriptions
    const allStatuses = [
      "Pending Payment",
      "Payment Successful",
      "Assigned",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];
    const existingStatuses = timeline.map((t) => t.status);

    // Add missing statuses up to the current status and beyond
    const currentStatusIndex = allStatuses.indexOf(
      getDisplayStatus(orderData.delivery_status || orderData.status)
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
      "Pending Payment",
      "Payment Successful",
      "Assigned",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];
    timeline.sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
    ); // Format shipping address properly
    const formatShippingAddress = (address) => {
      if (!address) return null;
      return `${address.street_address}, ${address.city}, ${address.state} - ${address.postal_code}`;
    };

    // Format phone number display
    const formatPhoneNumber = (phone) => {
      if (!phone) return null;
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    };

    return {
      id: orderData.invoice_id || orderData.razorpay_order_id || orderId,
      order_id: orderData.invoice_id || orderData.razorpay_order_id || orderId,
      status: getDisplayStatus(orderData.delivery_status || orderData.status),
      delivery_status: getDisplayStatus(orderData.delivery_status),
      overall_status: getDisplayStatus(orderData.status),
      timeline: timeline,
      estimatedDelivery: orderData.estimated_delivery,
      estimatedDeliveryFormatted: orderData.estimated_delivery
        ? new Date(orderData.estimated_delivery).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : null,
      shippingAddress: formatShippingAddress(orderData.address),
      phoneNumber: formatPhoneNumber(orderData.address?.phone_number),
      addressType: orderData.address?.type,
      carrier: orderData.tracking_info?.carrier || "Pending",
      trackingNumber: orderData.tracking_info?.tracking_number,
      trackingUrl: orderData.tracking_info?.tracking_url,
      orderItems: orderData.orderItems || orderData.order_items || [],
      totalAmount: orderData.total_amount || orderData.total_amount_calculated,
      currency: orderData.currency || "INR",
      paymentDetails: orderData.payment_details,
      createdAt: orderData.created_at,
      createdAtFormatted: orderData.created_at_formatted,
      invoice: orderData.invoice,
      assigned_partner_name: orderData.assigned_partner_name,
      assigned_at: orderData.assigned_at,
      last_updated_by_admin_at: orderData.last_updated_by_admin_at,
      last_updated_by_partner_at: orderData.last_updated_by_partner_at,
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
  console.log(
    "Order status:",
    displayOrder.status,
    "Delivery status:",
    displayOrder.delivery_status
  );
  console.log("Order items:", displayOrder.orderItems);

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
      "Pending Payment": <FiClock />,
      "Payment Successful": <FiCheckCircle />,
      Assigned: <FiUser />,
      Processing: <FiActivity />,
      Packed: <FiBox />,
      Shipped: <FiTruck />,
      "Out for Delivery": <FiTarget />,
      Delivered: <FiCheckCircle />,
      Cancelled: <FiX />,
      "Failed Delivery Attempt": <FiRefreshCw />,
      "Returning to Warehouse": <FiArrowLeft />,
      "Other Status": <FiInfo />,
    };
    return statusIcons[status] || <FiPackage />;
  };
  // Enhanced: Get status color based on status
  const getStatusColor = (status) => {
    const statusColors = {
      "Pending Payment": "var(--warning-color)",
      "Payment Successful": "var(--success-color)",
      Assigned: "var(--info-color)",
      Processing: "var(--brand-primary)",
      Packed: "var(--brand-secondary)",
      Shipped: "var(--info-color)",
      "Out for Delivery": "var(--warning-color)",
      Delivered: "var(--success-color)",
      Cancelled: "var(--error-color)",
      "Failed Delivery Attempt": "var(--error-color)",
      "Returning to Warehouse": "var(--warning-color)",
      "Other Status": "var(--text-secondary)",
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
          </Link>
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
                        {displayOrder.delivery_status &&
                          displayOrder.delivery_status !==
                            displayOrder.overall_status && (
                            <div
                              className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium"
                              style={{
                                backgroundColor: `${getStatusColor(
                                  displayOrder.delivery_status
                                )}10`,
                                color: getStatusColor(
                                  displayOrder.delivery_status
                                ),
                                border: `1px solid ${getStatusColor(
                                  displayOrder.delivery_status
                                )}20`,
                              }}
                            >
                              <FiTruck className="mr-1" size={12} />
                              Delivery: {displayOrder.delivery_status}
                            </div>
                          )}
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
            </div>
            {/* Enhanced shipping info cards */}
            <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <div className="ml-13 space-y-2">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {displayOrder.shippingAddress || "Address not available"}
                  </p>
                  {displayOrder.phoneNumber && (
                    <div className="flex items-center text-sm">
                      <FiPhone className="mr-2" size={14} />
                      <span style={{ color: "var(--text-secondary)" }}>
                        {displayOrder.phoneNumber}
                      </span>
                    </div>
                  )}
                  {displayOrder.addressType && (
                    <div
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: "var(--success-color)15",
                        color: "var(--success-color)",
                      }}
                    >
                      <FiNavigation className="mr-1" size={10} />
                      {displayOrder.addressType}
                    </div>
                  )}
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
                    Delivery Partner
                  </h3>
                </div>
                <div className="ml-13 space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Partner:
                    </span>
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {displayOrder.assigned_partner_name || "Not Assigned"}
                    </span>
                  </div>
                  {displayOrder.trackingNumber && (
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Tracking:
                      </span>
                      <span
                        className="text-sm font-mono"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        {displayOrder.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>
                {displayOrder.assigned_at && (
                  <div
                    className="flex items-center text-xs pt-2"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <FiClock className="mr-1" size={12} />
                    <span>
                      Assigned on
                      {new Date(displayOrder.assigned_at).toLocaleDateString(
                        "en-IN"
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* Payment Details Card */}
              {displayOrder.paymentDetails && (
                <div
                  className="p-6 rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
                  style={{
                    borderColor: "var(--border-primary)",
                    background:
                      "linear-gradient(135deg, var(--bg-primary) 0%, rgba(16, 185, 129, 0.02) 100%)",
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
                      <FiCreditCard size={18} />
                    </div>
                    <h3
                      className="font-semibold text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Payment Details
                    </h3>
                  </div>
                  <div className="ml-13 space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Method:
                      </span>
                      <span
                        className="text-sm font-semibold capitalize"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {displayOrder.paymentDetails.method || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Status:
                      </span>
                      <span
                        className="text-sm font-semibold capitalize"
                        style={{
                          color:
                            displayOrder.paymentDetails.status === "captured"
                              ? "var(--success-color)"
                              : "var(--warning-color)",
                        }}
                      >
                        {displayOrder.paymentDetails.status || "N/A"}
                      </span>
                    </div>
                    {displayOrder.paymentDetails.captured_at_formatted && (
                      <div
                        className="flex items-center text-xs pt-2"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        <FiCheckCircle className="mr-1" size={12} />
                        <span>
                          Paid on
                          {displayOrder.paymentDetails.captured_at_formatted}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
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
                    <div
                      className="ml-auto text-lg font-bold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      ₹{displayOrder.totalAmount}
                    </div>
                  </div>
                  <div className="ml-13 space-y-4">
                    {displayOrder.orderItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg border"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          borderColor: "var(--border-secondary)",
                        }}
                      >
                        <div className="flex items-center space-x-4">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: "var(--brand-primary)15",
                                color: "var(--brand-primary)",
                              }}
                            >
                              <FiPackage size={20} />
                            </div>
                          )}
                          <div>
                            <h4
                              className="font-medium text-sm"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {item.name || `Item ${index + 1}`}
                            </h4>
                            {item.brand && (
                              <p
                                className="text-xs"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Brand: {item.brand}
                              </p>
                            )}
                            {item.model && (
                              <p
                                className="text-xs"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Model: {item.model}
                              </p>
                            )}
                            {item.color && (
                              <p
                                className="text-xs"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                Color: {item.color}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-sm font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            Qty: {item.quantity || 1}
                          </div>
                          <div
                            className="text-lg font-bold"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            ₹{item.price_at_purchase || item.total_item_price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Invoice Download Section */}
          {displayOrder.invoice && displayOrder.invoice.invoice_pdf_url && (
            <div
              className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fadeIn"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
                animationDelay: "100ms",
              }}
            >
              <div
                className="p-6 rounded-xl border"
                style={{
                  borderColor: "var(--border-primary)",
                  background:
                    "linear-gradient(135deg, var(--bg-primary) 0%, rgba(16, 185, 129, 0.02) 100%)",
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
                    <FiDownload size={18} />
                  </div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Invoice Available
                  </h3>
                </div>
                <div className="ml-13 flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Invoice #{displayOrder.invoice.invoice_id}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Download your order invoice for records
                    </p>
                  </div>
                  <a
                    href={displayOrder.invoice.invoice_pdf_url}
                    download={`Invoice_${displayOrder.invoice.invoice_id}.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
                    style={{
                      backgroundColor: "var(--success-color)",
                      color: "white",
                      textDecoration: "none",
                    }}
                    onClick={() => {
                      console.log("Invoice download initiated");
                    }}
                  >
                    <FiDownload className="mr-2" size={16} />
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          )}
          {/* Order Items Section - Show only when delivered */}
          {(displayOrder.status === "Delivered" ||
            displayOrder.delivery_status === "Delivered") &&
            displayOrder.orderItems &&
            displayOrder.orderItems.length > 0 && (
              <div
                className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fadeIn"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  borderRadius: "var(--rounded-lg)",
                  boxShadow: "var(--shadow-medium)",
                  animationDelay: "120ms",
                }}
              >
                <h3
                  className="text-lg font-semibold mb-4 flex items-center"
                  style={{ color: "var(--text-primary)" }}
                >
                  <FiPackage className="mr-2" size={20} />
                  Order Items ({displayOrder.orderItems.length})
                </h3>

                <div className="space-y-4">
                  {displayOrder.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg border"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-secondary)",
                      }}
                    >
                      <div className="flex items-center space-x-4">
                        {item.image || item.image_url ? (
                          <img
                            src={item.image || item.image_url}
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
                            {item.name || item.product_name}
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
                            ₹
                            {(
                              item.price ||
                              item.price_at_purchase ||
                              item.total_amount ||
                              item.total_item_price ||
                              0
                            ).toLocaleString()}
                          </div>
                        </div>
                        {/* Review button for delivered items */}
                        {(() => {
                          const productId = item.product_id || item.id;
                          const hasReviewed = reviewedProducts.has(productId);
                          console.log(`Review check for item:`, {
                            productId,
                            hasReviewed,
                            reviewedProducts: Array.from(reviewedProducts),
                            reviewedProductsSize: reviewedProducts.size,
                            item,
                          });

                          // Temporary debug: show the raw check
                          console.log(
                            `Direct check: reviewedProducts.has("${productId}") =`,
                            reviewedProducts.has(productId)
                          );

                          return hasReviewed;
                        })() ? (
                          <div className="flex items-center px-3 py-2 rounded-lg text-sm font-medium bg-green-50 border border-green-200">
                            <FiCheckCircle
                              size={16}
                              className="mr-2 text-green-600"
                            />
                            <span className="text-green-700">Reviewed</span>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleWriteReview({
                                ...item,
                                productId: item.product_id || item.id,
                                orderId: displayOrder.id,
                                orderDate: displayOrder.createdAt,
                              })
                            }
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
            <div
              className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fadeIn"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
                animationDelay: "140ms",
              }}
            >
              <div
                className="p-6 rounded-xl border-2 border-dashed"
                style={{
                  borderColor: "var(--brand-primary)",
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
                        alt={
                          selectedProductForReview.name ||
                          selectedProductForReview.product_name
                        }
                        className="w-16 h-16 object-cover rounded-lg mr-3"
                      />
                    )}
                    <div className="flex-1">
                      <h4
                        className="font-semibold text-base"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {selectedProductForReview.name ||
                          selectedProductForReview.product_name}
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

                  {/* Review Title */}
                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Review Title *
                    </label>
                    <input
                      type="text"
                      value={reviewTitle}
                      onChange={(e) => setReviewTitle(e.target.value)}
                      placeholder="Write a brief title for your review"
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      style={{
                        borderColor: "var(--border-primary)",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
                      }}
                      maxLength={100}
                    />
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {reviewTitle.length}/100 characters
                    </p>
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
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      style={{
                        borderColor: "var(--border-primary)",
                        backgroundColor: "var(--bg-primary)",
                        color: "var(--text-primary)",
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
                      disabled={
                        reviewLoading || rating === 0 || !reviewTitle.trim()
                      }
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
          {/* Tracking URL Section */}
          {displayOrder.trackingUrl && (
            <div
              className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fadeIn"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
                animationDelay: "150ms",
              }}
            >
              <div
                className="p-6 rounded-xl border"
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
                    <FiExternalLink size={18} />
                  </div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    External Tracking
                  </h3>
                </div>
                <div className="ml-13 flex items-center justify-between">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Track with carrier
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Get real-time updates from delivery partner
                    </p>
                  </div>
                  <a
                    href={displayOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "white",
                      textDecoration: "none",
                    }}
                  >
                    <FiExternalLink className="mr-2" size={16} />
                    Track Now
                  </a>
                </div>
              </div>
            </div>
          )}
          {/* Recent Updates Section */}
          {displayOrder.last_updated_by_partner_at ||
          displayOrder.last_updated_by_admin_at ? (
            <div
              className="bg-white rounded-xl shadow-md p-6 mb-6 animate-fadeIn"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
                animationDelay: "180ms",
              }}
            >
              <div
                className="p-6 rounded-xl border"
                style={{
                  borderColor: "var(--border-primary)",
                  background:
                    "linear-gradient(135deg, var(--bg-primary) 0%, rgba(245, 158, 11, 0.02) 100%)",
                }}
              >
                <div className="flex items-center mb-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{
                      backgroundColor: "var(--warning-color)15",
                      color: "var(--warning-color)",
                    }}
                  >
                    <FiActivity size={18} />
                  </div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Recent Updates
                  </h3>
                </div>
                <div className="ml-13 space-y-3">
                  {displayOrder.last_updated_by_partner_at && (
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Last partner update:
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {new Date(
                          displayOrder.last_updated_by_partner_at
                        ).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                  {displayOrder.last_updated_by_admin_at && (
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Last admin update:
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {new Date(
                          displayOrder.last_updated_by_admin_at
                        ).toLocaleDateString("en-IN", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
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
