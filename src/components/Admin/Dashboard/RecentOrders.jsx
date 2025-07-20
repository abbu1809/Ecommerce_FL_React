import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
  FiCreditCard,
  FiDollarSign,
  FiEye,
  FiX,
  FiUser,
  FiCalendar,
  FiPackage,
} from "react-icons/fi";
import {useAdminStore} from "../../../store/Admin/useAdminStore";

// Order Details Modal Component
const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  const { getCachedUser } = useAdminStore();
  const [customerData, setCustomerData] = useState(null);
  const [loadingCustomer, setLoadingCustomer] = useState(false);

  React.useEffect(() => {
    if (order?.user_id && isOpen) {
      setLoadingCustomer(true);
      getCachedUser(order.user_id)
        .then((user) => {
          setCustomerData(user);
        })
        .catch((error) => {
          console.error("Failed to fetch customer data:", error);
        })
        .finally(() => {
          setLoadingCustomer(false);
        });
    }
  }, [order?.user_id, isOpen, getCachedUser]);

  if (!isOpen || !order) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "delivered":
        return {
          bgColor: "rgba(16, 185, 129, 0.15)",
          textColor: "var(--success-color)",
          icon: <FiCheckCircle size={16} />,
        };
      case "processing":
      case "payment_successful":
        return {
          bgColor: "rgba(245, 158, 11, 0.15)",
          textColor: "var(--warning-color)",
          icon: <FiClock size={16} />,
        };
      case "shipped":
      case "assigned":
        return {
          bgColor: "rgba(59, 130, 246, 0.15)",
          textColor: "var(--info-color)",
          icon: <FiTruck size={16} />,
        };
      case "cancelled":
        return {
          bgColor: "rgba(239, 68, 68, 0.15)",
          textColor: "var(--error-color)",
          icon: <FiXCircle size={16} />,
        };
      default:
        return {
          bgColor: "rgba(107, 114, 128, 0.15)",
          textColor: "var(--text-secondary)",
          icon: <FiClock size={16} />,
        };
    }
  };

  const statusStyle = getStatusStyles(order.status);
  const totalItems =
    order.order_items?.reduce(
      (total, item) => total + (item.quantity || 1),
      0
    ) || 0;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "var(--bg-overlay)",
        backdropFilter: "blur(4px)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-lg shadow-xl transform transition-all"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRadius: "var(--rounded-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              <FiPackage size={20} />
            </div>
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Order Details
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                #{order.order_id?.slice(-8) || "N/A"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <div className="space-y-6">
            {/* Order Status */}
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Order Status
                </h3>
                <div
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: statusStyle.bgColor,
                    color: statusStyle.textColor,
                  }}
                >
                  <span className="mr-2">{statusStyle.icon}</span>
                  {order.status?.replace("_", " ")?.charAt(0).toUpperCase() +
                    order.status?.replace("_", " ")?.slice(1) || "Unknown"}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p style={{ color: "var(--text-secondary)" }}>Order Date</p>
                  <p style={{ color: "var(--text-primary)" }}>
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div>
                  <p style={{ color: "var(--text-secondary)" }}>Total Amount</p>
                  <p
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₹{(order.total_amount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h3
                className="text-lg font-semibold mb-3 flex items-center"
                style={{ color: "var(--text-primary)" }}
              >
                <FiUser className="mr-2" />
                Customer Information
              </h3>
              {loadingCustomer ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : customerData ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <p style={{ color: "var(--text-secondary)" }}>Name</p>
                    <p style={{ color: "var(--text-primary)" }}>
                      {customerData.name || customerData.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "var(--text-secondary)" }}>Email</p>
                    <p style={{ color: "var(--text-primary)" }}>
                      {customerData.email || "N/A"}
                    </p>
                  </div>
                  {customerData.phone && (
                    <div>
                      <p style={{ color: "var(--text-secondary)" }}>Phone</p>
                      <p style={{ color: "var(--text-primary)" }}>
                        {customerData.phone}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <p style={{ color: "var(--text-secondary)" }}>
                  Customer ID: {order.user_id}
                </p>
              )}
            </div>

            {/* Order Items */}
            {order.order_items && order.order_items.length > 0 && (
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Order Items ({totalItems} items)
                </h3>
                <div className="space-y-3">
                  {order.order_items.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 rounded-md"
                      style={{ backgroundColor: "var(--bg-primary)" }}
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name || "Product"}
                          className="w-12 h-12 object-cover rounded-md mr-3"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <h4
                          className="font-medium text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.name || "Unknown Product"}
                        </h4>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Quantity: {item.quantity || 1} • ₹
                          {(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        ₹
                        {(
                          (item.price || 0) * (item.quantity || 1)
                        ).toLocaleString()}
                      </div>
                    </div>
                  ))}
                  {order.order_items.length > 3 && (
                    <p
                      className="text-sm text-center py-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      +{order.order_items.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex justify-end"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const RecentOrders = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { dashboard } = useAdminStore();
  const { recentOrders } = dashboard;

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };
  // Helper function to get customer name from user_id (simplified)
  const getCustomerName = (userId) => {
    if (!userId) return "Unknown Customer";
    // In a real application, you might want to fetch user details
    // For now, we'll create a simple display name from user_id
    return `Customer ${userId.slice(-4)}`;
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "delivered":
        return {
          bgColor: "rgba(16, 185, 129, 0.15)",
          textColor: "var(--success-color)",
          icon: <FiCheckCircle size={14} />,
        };
      case "processing":
      case "payment_successful":
        return {
          bgColor: "rgba(245, 158, 11, 0.15)",
          textColor: "var(--warning-color)",
          icon: <FiClock size={14} />,
        };
      case "shipped":
      case "assigned":
        return {
          bgColor: "rgba(59, 130, 246, 0.15)",
          textColor: "var(--info-color)",
          icon: <FiTruck size={14} />,
        };
      case "cancelled":
        return {
          bgColor: "rgba(239, 68, 68, 0.15)",
          textColor: "var(--error-color)",
          icon: <FiXCircle size={14} />,
        };
      case "pending_payment":
        return {
          bgColor: "rgba(245, 158, 11, 0.15)",
          textColor: "var(--warning-color)",
          icon: <FiCreditCard size={14} />,
        };
      default:
        return {
          bgColor: "rgba(107, 114, 128, 0.15)",
          textColor: "var(--text-secondary)",
          icon: <FiClock size={14} />,
        };
    }
  };

  const filteredOrders =
    filter === "all"
      ? recentOrders || []
      : (recentOrders || []).filter((order) => order.status === filter);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleViewAllOrders = () => {
    navigate("/admin/orders");
  };

  // Show message if no orders
  if (!recentOrders || recentOrders.length === 0) {
    return (
      <div
        className="p-6 rounded-lg h-full flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "var(--shadow-medium)",
          borderRadius: "var(--rounded-lg)",
        }}
      >
        <div className="text-center">
          <FiClock
            size={32}
            className="mx-auto mb-3"
            style={{ color: "var(--text-secondary)" }}
          />
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No Recent Orders
          </h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Recent orders will appear here once customers start placing orders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="p-6 rounded-lg"
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "var(--shadow-medium)",
          borderRadius: "var(--rounded-lg)",
        }}
      >
        <div className="flex flex-wrap justify-between items-center mb-6">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Orders
          </h2>

          <div className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
            <div
              className="relative rounded-md"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch
                  className="h-4 w-4"
                  style={{ color: "var(--text-secondary)" }}
                />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="py-1.5 pl-9 pr-4 block w-full text-sm focus:outline-none"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  color: "var(--text-primary)",
                  borderRadius: "var(--rounded-md)",
                }}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="py-1.5 px-3 text-sm border rounded-md appearance-none bg-white"
              style={{
                borderColor: "var(--border-primary)",
                color: "var(--text-primary)",
                borderRadius: "var(--rounded-md)",
              }}
            >
              <option value="all">All Orders</option>
              <option value="delivered">Delivered</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table
            className="min-w-full divide-y"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <thead>
              <tr>
                <th
                  className="py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Order ID
                </th>
                <th
                  className="py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Customer
                </th>
                <th
                  className="py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Date
                </th>
                <th
                  className="py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Amount
                </th>
                <th
                  className="py-3 text-left text-xs font-medium tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Status
                </th>
                <th className="py-3 text-left text-xs font-medium tracking-wider"></th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: "var(--border-primary)" }}
            >
              {filteredOrders.map((order) => {
                const statusStyle = getStatusStyles(order.status);

                return (
                  <tr key={order.order_id} className="hover:bg-gray-50">
                    <td
                      className="py-4 text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      #{order.order_id?.slice(-8) || "N/A"}
                    </td>
                    <td
                      className="py-4 text-sm"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {getCustomerName(order.user_id)}
                    </td>
                    <td
                      className="py-4 text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {formatDate(order.created_at)}
                    </td>
                    <td
                      className="py-4 text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ₹{(order.total_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4">
                      <div
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusStyle.bgColor,
                          color: statusStyle.textColor,
                        }}
                      >
                        <span className="mr-1.5">{statusStyle.icon}</span>
                        {order.status
                          ?.replace("_", " ")
                          ?.charAt(0)
                          .toUpperCase() +
                          order.status?.replace("_", " ")?.slice(1) ||
                          "Unknown"}
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => handleViewDetails(order)}
                        className="flex items-center text-xs hover:underline"
                        style={{ color: "var(--brand-primary)" }}
                      >
                        <FiEye size={14} className="mr-1" />
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleViewAllOrders}
            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:shadow-md"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--brand-primary)",
            }}
          >
            View All Orders
            <FiChevronRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        order={selectedOrder}
      />
    </>
  );
};

export default RecentOrders;
