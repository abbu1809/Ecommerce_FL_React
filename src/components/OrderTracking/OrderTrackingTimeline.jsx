import React from "react";
import {
  FiCheckCircle,
  FiBox,
  FiTruck,
  FiPackage,
  FiMapPin,
} from "react-icons/fi";

const statusIcons = {
  Ordered: <FiBox size={18} />,
  Packed: <FiPackage size={18} />,
  Shipped: <FiTruck size={18} />,
  "Out for Delivery": <FiMapPin size={18} />,
  Delivered: <FiCheckCircle size={18} />,
};

const statusColors = {
  Ordered: "var(--brand-primary)",
  Packed: "var(--info-color)",
  Shipped: "var(--brand-secondary)",
  "Out for Delivery": "var(--warning-color)",
  Delivered: "var(--success-color)",
};

const OrderTrackingTimeline = ({ timeline, currentStatus }) => {
  const currentStatusIndex = timeline.findIndex(
    (s) => s.status === currentStatus
  );

  return (
    <div className="relative">
      {/* Vertical line connecting timeline points */}
      <div
        className="absolute left-5 top-5 bottom-5 w-0.5"
        style={{
          background: "var(--border-primary)",
        }}
      ></div>

      <div className="space-y-8">
        {timeline.map((step, idx) => {
          const isActive = step.status === currentStatus;
          const isCompleted = currentStatusIndex >= idx;
          const isPending = !isCompleted;

          return (
            <div
              key={step.status}
              className="flex items-start relative animate-fadeIn"
              style={{
                animationDelay: `${idx * 100}ms`,
                animationFillMode: "both",
              }}
            >
              {/* Timeline dot */}
              <div
                className="flex items-center justify-center h-10 w-10 rounded-full z-10 transition-all duration-300"
                style={{
                  backgroundColor: isCompleted
                    ? statusColors[step.status]
                    : "var(--bg-primary)",
                  color: isCompleted
                    ? "var(--text-on-brand)"
                    : "var(--text-secondary)",
                  border: isPending
                    ? "2px solid var(--border-primary)"
                    : "none",
                  boxShadow: isActive
                    ? "var(--shadow-medium)"
                    : "var(--shadow-small)",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              >
                {statusIcons[step.status]}
              </div>

              {/* Content */}
              <div className="ml-6 pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <div
                    className="font-semibold text-base"
                    style={{
                      color: isActive
                        ? statusColors[step.status]
                        : isCompleted
                        ? "var(--text-primary)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {step.status}
                  </div>

                  {isCompleted && step.date && (
                    <div
                      className="text-xs mt-1 sm:mt-0 sm:ml-3 sm:pl-3 sm:border-l"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>
                        {new Date(step.date).toLocaleDateString()} at{" "}
                        {new Date(step.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status badge for active status */}
                {isActive && (
                  <div
                    className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${statusColors[step.status]}20`,
                      color: statusColors[step.status],
                    }}
                  >
                    Current Status
                  </div>
                )}

                {/* Pending message for future statuses */}
                {!isCompleted && step.status === "Delivered" && (
                  <div
                    className="mt-1 text-xs font-medium italic"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Pending delivery
                  </div>
                )}

                {/* Additional description based on status */}
                <div
                  className="mt-2 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.status === "Ordered" &&
                    isCompleted &&
                    "Your order has been received and is being processed."}
                  {step.status === "Packed" &&
                    isCompleted &&
                    "Your items have been carefully packed and are ready for shipping."}
                  {step.status === "Shipped" &&
                    isCompleted &&
                    "Your package is on its way to you."}
                  {step.status === "Out for Delivery" &&
                    isCompleted &&
                    "Your package will be delivered today."}
                  {step.status === "Delivered" &&
                    isCompleted &&
                    "Your package has been delivered. Enjoy!"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTrackingTimeline;
