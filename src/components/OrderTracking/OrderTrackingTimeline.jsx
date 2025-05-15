import React from "react";
import {
  FiCheckCircle,
  FiBox,
  FiTruck,
  FiPackage,
  FiMapPin,
} from "react-icons/fi";

const statusIcons = {
  Ordered: <FiBox />,
  Packed: <FiPackage />,
  Shipped: <FiTruck />,
  "Out for Delivery": <FiMapPin />,
  Delivered: <FiCheckCircle />,
};

const statusColors = {
  Ordered: "var(--brand-primary)",
  Packed: "var(--info-color)",
  Shipped: "var(--brand-secondary)",
  "Out for Delivery": "var(--warning-color)",
  Delivered: "var(--success-color)",
};

const OrderTrackingTimeline = ({ timeline, currentStatus }) => {
  return (
    <div className="flex flex-col gap-6">
      {timeline.map((step, idx) => {
        const isActive = step.status === currentStatus;
        const isCompleted =
          timeline.findIndex((s) => s.status === currentStatus) > idx;
        return (
          <div key={step.status} className="flex items-center">
            <div
              className="flex items-center justify-center h-10 w-10 rounded-full mr-4"
              style={{
                backgroundColor:
                  isActive || isCompleted
                    ? statusColors[step.status]
                    : "var(--bg-accent-light)",
                color:
                  isActive || isCompleted ? "#fff" : statusColors[step.status],
                fontSize: 22,
                boxShadow: isActive ? "var(--shadow-medium)" : "none",
                border: isActive
                  ? `2px solid ${statusColors[step.status]}`
                  : "none",
              }}
            >
              {statusIcons[step.status]}
            </div>
            <div>
              <div
                className="font-semibold text-base"
                style={{
                  color: isActive
                    ? statusColors[step.status]
                    : "var(--text-primary)",
                }}
              >
                {step.status}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {step.date
                  ? new Date(step.date).toLocaleString()
                  : step.status === "Delivered"
                  ? "Pending"
                  : ""}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTrackingTimeline;
