import React from "react";
import {
  FiPackage,
  FiMapPin,
  FiPhone,
  FiCalendar,
  FiClock,
  FiChevronRight,
  FiTruck,
} from "react-icons/fi";

// Status colors similar to order status
const statusColors = {
  Pending: "var(--warning-color)",
  "Out for Delivery": "var(--brand-secondary)",
  Delivered: "var(--success-color)",
  Failed: "var(--error-color)",
};

// Status icons similar to order status
const statusIcons = {
  Pending: <FiPackage />,
  "Out for Delivery": <FiTruck />,
  Delivered: <FiPackage />,
  Failed: <FiPackage />,
};

const DeliveryCard = ({ delivery, onAccept }) => {
  return (
    <div
      className="flex flex-col md:flex-row justify-between p-4 group hover:bg-gray-50 rounded-lg transition-all duration-200 animate-fadeIn transform hover:translate-y-[-2px] border border-transparent hover:border-gray-100 mb-4"
      style={{
        textDecoration: "none",
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-small)",
      }}
    >
      <div className="flex items-start flex-grow">
        <div
          className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full mr-4 transition-all duration-300"
          style={{
            backgroundColor: statusColors[delivery.status],
            color: "var(--text-on-brand)",
            fontSize: 22,
            boxShadow: "var(--shadow-small)",
            transform: "scale(1)",
          }}
        >
          {statusIcons[delivery.status]}
        </div>

        <div className="flex-grow">
          <div
            className="font-semibold text-base mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            Order #{delivery.orderId}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-3">
            <div className="flex items-start">
              <FiMapPin
                className="mt-1 mr-2 flex-shrink-0"
                style={{ color: "var(--text-secondary)" }}
              />
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Delivery Address
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {delivery.address}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FiPhone
                className="mt-1 mr-2 flex-shrink-0"
                style={{ color: "var(--text-secondary)" }}
              />
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Customer Contact
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {delivery.customerPhone}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FiCalendar
                className="mt-1 mr-2 flex-shrink-0"
                style={{ color: "var(--text-secondary)" }}
              />
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Expected Delivery
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {new Date(delivery.expectedDelivery).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FiClock
                className="mt-1 mr-2 flex-shrink-0"
                style={{ color: "var(--text-secondary)" }}
              />
              <div>
                <p
                  className="text-xs font-medium mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Assigned On
                </p>
                <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                  {new Date(delivery.assignedDate).toLocaleDateString()}{" "}
                  {new Date(delivery.assignedDate).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex md:flex-col justify-between items-end mt-4 md:mt-0 md:ml-4">
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: `${statusColors[delivery.status]}20`,
            color: statusColors[delivery.status],
          }}
        >
          {delivery.status}
        </div>{" "}
        <button
          onClick={() => onAccept(delivery.id)}
          className="flex items-center mt-4 font-medium text-sm hover:underline transition-colors"
          style={{ color: "var(--brand-primary)" }}
        >
          Update Status
          <FiChevronRight className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default DeliveryCard;
