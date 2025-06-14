import React from "react";
import {
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiX,
  FiTruck,
} from "react-icons/fi";

// Status colors for different delivery statuses
const statusColors = {
  Pending: "var(--warning-color)",
  "Out for Delivery": "var(--brand-secondary)",
  Delivered: "var(--success-color)",
  Failed: "var(--error-color)",
};

// Status icons for different delivery statuses
const statusIcons = {
  Pending: <FiPackage size={16} />,
  "Out for Delivery": <FiTruck size={16} />,
  Delivered: <FiCheckCircle size={16} />,
  Failed: <FiX size={16} />,
};

const DeliveryHistoryItem = ({ delivery, onViewDetails }) => {
  // Safely handle date displays with fallbacks
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (err) {
      console.error("Invalid date format:", dateStr, err);
      return "N/A";
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (err) {
      console.error("Invalid date format:", dateStr, err);
      return "";
    }
  };

  // Helper function to format address objects
  const formatAddress = (addressObj) => {
    if (!addressObj) return "No address provided";

    // If it's already a string, return it
    if (typeof addressObj === "string") return addressObj;

    // If it's an object, extract the address components
    if (typeof addressObj === "object") {
      const { street_address, city, state, postal_code } = addressObj;
      const addressParts = [street_address, city, state, postal_code]
        .filter(Boolean)
        .filter((part) => typeof part === "string" && part.trim() !== "");

      return addressParts.length > 0
        ? addressParts.join(", ")
        : "No address provided";
    }

    return "No address provided";
  };

  // Get the appropriate status color and icon, defaulting if not found
  const statusColor = statusColors[delivery.status] || "var(--warning-color)";
  const statusIcon = statusIcons[delivery.status] || <FiPackage size={16} />;

  // Safely handle amount display
  const amount =
    typeof delivery.amount === "number"
      ? delivery.amount.toFixed(2)
      : parseFloat(delivery.amount || 0).toFixed(2);

  return (
    <div
      className="border rounded-lg overflow-hidden mb-4 transition-all duration-200 hover:shadow-md"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border-primary)",
      }}
    >
      {/* Header */}
      <div
        className="p-4 flex justify-between items-center border-b"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div>
          <div className="flex items-center">
            <span
              className="font-semibold mr-3"
              style={{ color: "var(--text-primary)" }}
            >
              Order #{delivery.orderId}
            </span>
            <span
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${statusColor}20`,
                color: statusColor,
              }}
            >
              {statusIcon}
              <span className="ml-1">{delivery.status}</span>
            </span>
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {delivery.completedDate
              ? `Completed on ${formatDate(
                  delivery.completedDate
                )} at ${formatTime(delivery.completedDate)}`
              : "In progress"}
          </div>
          {/* Item count */}
          {(delivery.order_items?.length > 0 || delivery.items?.length > 0) && (
            <div
              className="text-xs mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {delivery.order_items?.length || delivery.items?.length} items
            </div>
          )}
        </div>
        <div className="text-right">
          <div
            className="text-xs font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Amount
          </div>
          <div
            className="text-lg font-bold"
            style={{
              color:
                delivery.paymentMethod === "COD"
                  ? "var(--success-color)"
                  : "var(--text-primary)",
            }}
          >
            ₹{amount}
          </div>
          <div className="text-xs" style={{ color: "var(--brand-primary)" }}>
            {delivery.payment_details?.method ||
              delivery.paymentMethod ||
              "Online"}
          </div>
          <button
            onClick={onViewDetails}
            className="flex items-center justify-end text-xs font-medium mt-2"
            style={{ color: "var(--brand-primary)" }}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex">
          <FiMapPin
            className="mt-1 mr-3 flex-shrink-0"
            style={{ color: "var(--text-secondary)" }}
          />
          <div>
            <div
              className="text-xs font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Delivery Address
            </div>
            <div className="text-sm" style={{ color: "var(--text-primary)" }}>
              {formatAddress(delivery.address)}
            </div>
          </div>
        </div>

        <div className="flex">
          <FiCalendar
            className="mt-1 mr-3 flex-shrink-0"
            style={{ color: "var(--text-secondary)" }}
          />
          <div>
            <div
              className="text-xs font-medium mb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              Expected vs Actual Delivery
            </div>
            <div className="text-sm" style={{ color: "var(--text-primary)" }}>
              Expected: {formatDate(delivery.expectedDelivery)}
              <br />
              {delivery.status === "Delivered" ? (
                <span
                  style={{
                    color:
                      new Date(delivery.completedDate) <=
                      new Date(delivery.expectedDelivery)
                        ? "var(--success-color)"
                        : "var(--warning-color)",
                  }}
                >
                  Actual: {formatDate(delivery.completedDate)}
                </span>
              ) : (
                <span style={{ color: "var(--error-color)" }}>
                  {delivery.status}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Notes section, if any */}
      {delivery.notes && (
        <div
          className="px-4 py-3 mt-1 border-t"
          style={{
            borderColor: "var(--border-primary)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <div
            className="text-xs font-medium mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Notes
          </div>
          <div className="text-sm" style={{ color: "var(--text-primary)" }}>
            {delivery.notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryHistoryItem;
