import React from "react";
import {
  FiPackage,
  FiMapPin,
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";

const statusColors = {
  Pending: "var(--warning-color)",
  "Out for Delivery": "var(--brand-secondary)",
  Delivered: "var(--success-color)",
  Failed: "var(--error-color)",
};

const statusIcons = {
  Pending: <FiPackage size={16} />,
  "Out for Delivery": <FiClock size={16} />,
  Delivered: <FiCheckCircle size={16} />,
  Failed: <FiX size={16} />,
};

const DeliveryHistoryItem = ({ delivery }) => {
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
                backgroundColor: `${statusColors[delivery.status]}20`,
                color: statusColors[delivery.status],
              }}
            >
              {statusIcons[delivery.status]}
              <span className="ml-1">{delivery.status}</span>
            </span>
          </div>
          <div
            className="text-xs mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Completed on {new Date(delivery.completedDate).toLocaleDateString()}{" "}
            at{" "}
            {new Date(delivery.completedDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
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
            ₹{delivery.amount.toFixed(2)}
          </div>
          <div className="text-xs" style={{ color: "var(--brand-primary)" }}>
            {delivery.paymentMethod}
          </div>
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
              {delivery.address}
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
              Expected:{" "}
              {new Date(delivery.expectedDelivery).toLocaleDateString()}
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
                  Actual:{" "}
                  {new Date(delivery.completedDate).toLocaleDateString()}
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
