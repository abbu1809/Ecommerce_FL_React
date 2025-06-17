import React from "react";
import {
  FiCheckCircle,
  FiBox,
  FiTruck,
  FiPackage,
  FiMapPin,
  FiClock,
  FiUser,
  FiActivity,
  FiCreditCard,
} from "react-icons/fi";

const statusIcons = {
  "Pending Payment": <FiClock size={18} />,
  "Payment Successful": <FiCreditCard size={18} />,
  Assigned: <FiUser size={18} />,
  Processing: <FiActivity size={18} />,
  Ordered: <FiBox size={18} />,
  Packed: <FiPackage size={18} />,
  Shipped: <FiTruck size={18} />,
  "Out for Delivery": <FiMapPin size={18} />,
  Delivered: <FiCheckCircle size={18} />,
};

const statusColors = {
  "Pending Payment": "var(--warning-color)",
  "Payment Successful": "var(--success-color)",
  Assigned: "var(--info-color)",
  Processing: "var(--brand-primary)",
  Ordered: "var(--brand-primary)",
  Packed: "var(--info-color)",
  Shipped: "var(--brand-secondary)",
  "Out for Delivery": "var(--warning-color)",
  Delivered: "var(--success-color)",
};

const OrderTrackingTimeline = ({ timeline, currentStatus }) => {
  // Define the standard order of statuses
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
  return (
    <div className="relative">
      {/* Vertical line connecting timeline points */}
      <div
        className="absolute left-5 top-5 bottom-5 w-0.5"
        style={{
          background: "var(--border-primary)",
        }}
      ></div>

      {/* Completed progress line */}
      <div
        className="absolute left-5 top-5 w-0.5 transition-all duration-1000 ease-out"
        style={{
          background:
            "linear-gradient(to bottom, var(--success-color), var(--brand-primary))",
          height: `${Math.min(
            (timeline.filter((_, idx) => {
              const stepStatusOrderIndex = statusOrder.indexOf(
                timeline[idx].status
              );
              const currentStatusOrderIndex =
                statusOrder.indexOf(currentStatus);
              return (
                stepStatusOrderIndex < currentStatusOrderIndex ||
                timeline[idx].date
              );
            }).length /
              timeline.length) *
              100,
            100
          )}%`,
        }}
      ></div>

      <div className="space-y-8">
        {timeline.map((step, idx) => {
          const isActive = step.status === currentStatus;

          // Determine if status is completed based on step having a date or being before current status
          const currentStatusOrderIndex = statusOrder.indexOf(currentStatus);
          const stepStatusOrderIndex = statusOrder.indexOf(step.status);

          // Status is completed if:
          // 1. It has a date (actual completion timestamp)
          // 2. OR it comes before the current status in the standard order
          const isCompleted =
            step.date ||
            (stepStatusOrderIndex < currentStatusOrderIndex &&
              currentStatusOrderIndex !== -1);
          const isPending = !isCompleted && !isActive;

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
                  backgroundColor:
                    isCompleted || isActive
                      ? statusColors[step.status] || "var(--success-color)"
                      : "var(--bg-primary)",
                  color:
                    isCompleted || isActive
                      ? "var(--text-on-brand)"
                      : "var(--text-secondary)",
                  border: isPending
                    ? "2px solid var(--border-primary)"
                    : "none",
                  boxShadow: isActive
                    ? "0 0 0 4px rgba(99, 102, 241, 0.1), var(--shadow-medium)"
                    : isCompleted
                    ? "0 0 0 2px rgba(34, 197, 94, 0.1), var(--shadow-small)"
                    : "var(--shadow-small)",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                }}
              >
                {/* Show checkmark for completed statuses, regular icon for active/pending */}
                {isCompleted && !isActive ? (
                  <FiCheckCircle size={18} />
                ) : (
                  statusIcons[step.status] || <FiPackage size={18} />
                )}
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
                  {step.date ? (
                    <div
                      className="text-xs mt-1 sm:mt-0 sm:ml-3 sm:pl-3 sm:border-l"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>
                        {new Date(step.date).toLocaleDateString()} at
                        {new Date(step.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ) : isCompleted ? (
                    <div
                      className="text-xs mt-1 sm:mt-0 sm:ml-3 sm:pl-3 sm:border-l"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>
                        Completed
                      </span>
                    </div>
                  ) : null}
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
                {isPending && (
                  <div
                    className="mt-1 text-xs font-medium italic"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Pending
                  </div>
                )}
                {/* Additional description based on status */}
                <div
                  className="mt-2 text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {/* Show description from step data if available, otherwise use default descriptions */}
                  {step.description ? (
                    step.description
                  ) : (
                    <>
                      {step.status === "Pending Payment" &&
                        isCompleted &&
                        "Payment confirmation is being processed."}
                      {step.status === "Payment Successful" &&
                        isCompleted &&
                        "Payment has been received and confirmed."}
                      {step.status === "Assigned" &&
                        isCompleted &&
                        "Order has been assigned to a delivery partner."}
                      {step.status === "Processing" &&
                        isCompleted &&
                        "Your order is being prepared for shipping."}
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
                    </>
                  )}
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
