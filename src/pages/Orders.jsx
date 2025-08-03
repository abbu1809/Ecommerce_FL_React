import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
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
  FiEye,
  FiArrowLeft,
  FiFilter,
  FiSearch,
} from "react-icons/fi";
import useOrderStore from "../store/useOrder";

const Orders = () => {
  const { orders, getAllOrders, isLoading, error } = useOrderStore();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        await getAllOrders();
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
  // Get current delivery status from tracking history
  const getCurrentDeliveryStatus = (order) => {
    console.log("Getting status for order:", order.order_id, order);

    if (
      !order.tracking_info?.status_history ||
      !Array.isArray(order.tracking_info.status_history)
    ) {
      console.log("No tracking history, using order status:", order.status);
      return order.status;
    }

    // Get the latest status from tracking history
    const statusHistory = order.tracking_info.status_history;
    console.log("Status history:", statusHistory);

    if (statusHistory.length === 0) {
      console.log("Empty status history, using order status:", order.status);
      return order.status;
    }

    const latestStatus = statusHistory[statusHistory.length - 1];
    console.log("Latest status entry:", latestStatus);

    const status = latestStatus?.status || order.status;
    console.log("Final status:", status);

    return status;
  };

  // Get assigned partner name from tracking history
  const getAssignedPartnerName = (order) => {
    if (!order.tracking_info?.status_history) return null;

    const assignmentEntry = order.tracking_info.status_history.find(
      (entry) => entry.assigned_partner_name
    );
    return assignmentEntry?.assigned_partner_name || null;
  };

  // Filter orders based on selected filter and search term
  useEffect(() => {
    let filtered = orders || [];

    // Apply status filter
    if (selectedFilter !== "all") {
      filtered = filtered.filter((order) => {
        const currentStatus = getCurrentDeliveryStatus(order);
        return currentStatus === selectedFilter;
      });
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((order) => {
        const searchLower = searchTerm.toLowerCase();
        const partnerName = getAssignedPartnerName(order);
        return (
          order.order_id?.toLowerCase().includes(searchLower) ||
          partnerName?.toLowerCase().includes(searchLower)
        );
      });
    }

    setFilteredOrders(filtered);
  }, [orders, selectedFilter, searchTerm]);

  // Get display status
  const getDisplayStatus = (status) => {
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
  };

  // Get status icon
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

  // Get status color
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
  }; // Get unique statuses for filter
  const getUniqueStatuses = () => {
    const statuses = new Set();
    orders?.forEach((order) => {
      const currentStatus = getCurrentDeliveryStatus(order);
      console.log("Order", order.order_id, "Current Status:", currentStatus);
      if (currentStatus) {
        statuses.add(currentStatus);
      }
    });
    console.log("All unique statuses:", Array.from(statuses));
    return Array.from(statuses);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
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
            Loading your orders...
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
                Error Loading Orders
              </h1>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-6 py-2 rounded-lg"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                }}
              >
                Try Again
              </button>
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1
              className="text-3xl font-bold mb-2"
              style={{ color: "var(--text-primary)" }}
            >
              My Orders
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Track and manage your orders
            </p>
          </div>

          {/* Filters and Search */}
          <div
            className="bg-white rounded-xl shadow-md p-6 mb-6"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: "var(--text-secondary)" }}
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    focusRingColor: "var(--brand-primary)",
                  }}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <FiFilter
                    className="mr-2"
                    style={{ color: "var(--text-secondary)" }}
                    size={18}
                  />
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Filter by status:
                  </span>
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-primary)",
                    color: "var(--text-primary)",
                    focusRingColor: "var(--brand-primary)",
                  }}
                >
                  <option value="all">All Orders</option>
                  {getUniqueStatuses().map((status) => (
                    <option key={status} value={status}>
                      {getDisplayStatus(status)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {!filteredOrders || filteredOrders.length === 0 ? (
            <div
              className="bg-white rounded-xl shadow-md p-8 text-center"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderRadius: "var(--rounded-lg)",
                boxShadow: "var(--shadow-medium)",
              }}
            >
              <FiPackage
                className="h-16 w-16 mx-auto mb-4"
                style={{ color: "var(--text-secondary)" }}
              />
              <h2
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                No Orders Found
              </h2>
              <p style={{ color: "var(--text-secondary)" }}>
                {searchTerm || selectedFilter !== "all"
                  ? "No orders match your current filters."
                  : "You haven't placed any orders yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const currentDeliveryStatus = getCurrentDeliveryStatus(order);
                const displayStatus = getDisplayStatus(currentDeliveryStatus);
                const overallStatus = getDisplayStatus(order.status);
                const partnerName = getAssignedPartnerName(order);

                return (
                  <div
                    key={order.order_id}
                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      borderRadius: "var(--rounded-lg)",
                      boxShadow: "var(--shadow-medium)",
                    }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Order Info */}
                        <div className="flex items-start space-x-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: `${getStatusColor(
                                displayStatus
                              )}15`,
                              color: getStatusColor(displayStatus),
                            }}
                          >
                            {getStatusIcon(displayStatus)}
                          </div>
                          <div className="space-y-2">
                            {/* Order ID */}
                            <div>
                              <h3
                                className="font-bold text-lg"
                                style={{ color: "var(--text-primary)" }}
                              >
                                Order #{order.order_id}
                              </h3>
                              <div className="flex items-center space-x-3 mt-1">
                                {/* Main Status */}
                                <div
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                                  style={{
                                    backgroundColor: `${getStatusColor(
                                      displayStatus
                                    )}15`,
                                    color: getStatusColor(displayStatus),
                                    border: `1px solid ${getStatusColor(
                                      displayStatus
                                    )}30`,
                                  }}
                                >
                                  {getStatusIcon(displayStatus)}
                                  <span className="ml-1">{displayStatus}</span>
                                </div>

                                {/* Overall Status (if different) */}
                                {currentDeliveryStatus !== order.status && (
                                  <div
                                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                                    style={{
                                      backgroundColor: `${getStatusColor(
                                        overallStatus
                                      )}10`,
                                      color: getStatusColor(overallStatus),
                                      border: `1px solid ${getStatusColor(
                                        overallStatus
                                      )}20`,
                                    }}
                                  >
                                    Overall: {overallStatus}
                                  </div>
                                )}

                                {/* Amount */}
                                <div
                                  className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: "var(--bg-secondary)",
                                    color: "var(--text-secondary)",
                                  }}
                                >
                                  <FiCreditCard className="mr-1" size={10} />₹
                                  {order.total_amount}
                                </div>
                              </div>
                            </div>

                            {/* Order Details */}
                            <div className="space-y-1">
                              {/* Date */}
                              <div
                                className="flex items-center text-sm"
                                style={{ color: "var(--text-secondary)" }}
                              >
                                <FiCalendar className="mr-2" size={14} />
                                Ordered on {formatDate(order.created_at)}
                              </div>
                              {/* Partner */}
                              {partnerName && (
                                <div
                                  className="flex items-center text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <FiUser className="mr-2" size={14} />
                                  Partner: {partnerName}
                                </div>
                              )}
                              {/* Items Count */}
                              {order.item_count && (
                                <div
                                  className="flex items-center text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <FiPackage className="mr-2" size={14} />
                                  {order.item_count} item
                                  {order.item_count > 1 ? "s" : ""}
                                </div>
                              )}
                              {/* Estimated Delivery */}
                              {order.estimated_delivery && (
                                <div
                                  className="flex items-center text-sm"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  <FiTruck className="mr-2" size={14} />
                                  Expected by
                                  {formatDate(order.estimated_delivery)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                          {/* Preview Image */}
                          {order.preview_image && (
                            <div className="flex items-center">
                              <img
                                src={order.preview_image}
                                alt="Order preview"
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                            </div>
                          )}

                          {/* Track Order */}
                          <Link
                            to={`/order-tracking/${order.order_id}`}
                            className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md"
                            style={{
                              backgroundColor: "var(--brand-primary)",
                              color: "white",
                              textDecoration: "none",
                            }}
                          >
                            <FiEye className="mr-2" size={14} />
                            Track Order
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
