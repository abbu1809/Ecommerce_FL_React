import React, { useState, useEffect } from "react";
import {
  FiX,
  FiPackage,
  FiClock,
  FiMapPin,
  FiCreditCard,
} from "react-icons/fi";
import useOrderStore from "../../store/useOrder";

const OrderDetailModal = ({ isOpen, onClose, orderId }) => {
  const { getOrderById, isLoading } = useOrderStore();
  const [orderDetails, setOrderDetails] = useState(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && orderId) {
      console.log("Modal opened for order:", orderId); // Debug log
      const fetchOrderDetails = async () => {
        try {
          const details = await getOrderById(orderId);
          console.log("Fetched order details:", details); // Debug log
          setOrderDetails(details);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };
      fetchOrderDetails();
    }
  }, [isOpen, orderId, getOrderById]);

  console.log("Modal render - isOpen:", isOpen, "orderId:", orderId); // Debug log

  if (!isOpen) return null;

  const formatCurrency = (amount, currency = "INR") => {
    if (currency === "INR") {
      return `₹${amount?.toLocaleString()}`;
    }
    return `${amount} ${currency}`;
  };

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending_payment: "Pending Payment",
      payment_successful: "Payment Successful",
      order_confirmed: "Order Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      out_for_delivery: "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pending_payment: "var(--warning-color)",
      payment_successful: "var(--success-color)",
      order_confirmed: "var(--brand-primary)",
      processing: "var(--info-color)",
      shipped: "var(--brand-secondary)",
      out_for_delivery: "var(--warning-color)",
      delivered: "var(--success-color)",
      cancelled: "var(--error-color)",
    };
    return statusColors[status] || "var(--brand-primary)";
  };
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "var(--bg-overlay)",
        backdropFilter: "blur(4px)",
      }}
      onClick={handleBackdropClick}
    >
      {" "}
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
                Order #{orderId}
              </p>
            </div>
          </div>{" "}
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <FiX size={20} />
          </button>
        </div>{" "}
        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p style={{ color: "var(--text-secondary)" }}>
                Loading order details...
              </p>
            </div>
          ) : orderDetails ? (
            <div className="space-y-6">
              {/* Order Status */}
              <div
                className="p-4 rounded-lg"
                style={{ backgroundColor: "var(--bg-secondary)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiClock
                      className="mr-2"
                      style={{ color: getStatusColor(orderDetails.status) }}
                    />
                    <span
                      className="font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Status:
                    </span>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor: `${getStatusColor(
                        orderDetails.status
                      )}20`,
                      color: getStatusColor(orderDetails.status),
                    }}
                  >
                    {getStatusDisplay(orderDetails.status)}
                  </span>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Order Summary
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Order Date
                    </p>
                    <p style={{ color: "var(--text-primary)" }}>
                      {new Date(orderDetails.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Total Amount
                    </p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(
                        orderDetails.total_amount,
                        orderDetails.currency
                      )}
                    </p>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Payment Method
                    </p>
                    <div className="flex items-center">
                      <FiCreditCard className="mr-1" />
                      <span style={{ color: "var(--text-primary)" }}>
                        {orderDetails.payment_method || "Online Payment"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Items Count
                    </p>
                    <p style={{ color: "var(--text-primary)" }}>
                      {orderDetails.item_count} item(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              {orderDetails.items && orderDetails.items.length > 0 && (
                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Ordered Items
                  </h3>
                  <div className="space-y-3">
                    {orderDetails.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 rounded-lg"
                        style={{
                          backgroundColor: "var(--bg-secondary)",
                          border: "1px solid var(--border-primary)",
                        }}
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-md mr-3"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        )}
                        <div className="flex-1">
                          <h4
                            className="font-medium"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.name}
                          </h4>
                          <p
                            className="text-sm"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            Quantity: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-green-600">
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery Address */}
              {orderDetails.shipping_address && (
                <div>
                  <h3
                    className="text-lg font-semibold mb-3"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Delivery Address
                  </h3>
                  <div
                    className="p-3 rounded-lg flex items-start"
                    style={{ backgroundColor: "var(--bg-secondary)" }}
                  >
                    <FiMapPin
                      className="mr-2 mt-1"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <div>
                      <p style={{ color: "var(--text-primary)" }}>
                        {orderDetails.shipping_address.street_address}
                      </p>
                      <p style={{ color: "var(--text-secondary)" }}>
                        {orderDetails.shipping_address.city},{" "}
                        {orderDetails.shipping_address.state}{" "}
                        {orderDetails.shipping_address.postal_code}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p style={{ color: "var(--text-secondary)" }}>
                Unable to load order details. Please try again.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
