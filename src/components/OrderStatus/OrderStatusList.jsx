import React from "react";
import { Link } from "react-router-dom";
import {
  FiChevronRight,
  FiBox,
  FiTruck,
  FiMapPin,
  FiCheckCircle,
  FiPackage,
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

const OrderStatusList = ({ orders }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link
          to={`/order-tracking/${order.id}`}
          key={order.id}
          className="flex items-center justify-between p-4 group hover:bg-gray-50 rounded-lg transition-all duration-200 animate-fadeIn transform hover:translate-y-[-2px] border border-transparent hover:border-gray-100"
          style={{
            textDecoration: "none",
            backgroundColor: "var(--bg-primary)",
            boxShadow: "var(--shadow-small)",
          }}
        >
          <div className="flex items-center">
            <div
              className="h-12 w-12 flex items-center justify-center rounded-full mr-4 transition-all duration-300"
              style={{
                backgroundColor: statusColors[order.status],
                color: "var(--text-on-brand)",
                fontSize: 22,
                boxShadow: "var(--shadow-small)",
                transform: "scale(1)",
              }}
            >
              {statusIcons[order.status]}
            </div>
            <div>
              <div
                className="font-semibold text-base mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Order #{order.id}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div
                  className="text-sm flex items-center"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="mr-1">Status:</span>
                  <span
                    className="px-2 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: `${statusColors[order.status]}20`,
                      color: statusColors[order.status],
                      fontWeight: 600,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <span className="hidden sm:inline mx-2">•</span>
                  Placed: {new Date(order.date).toLocaleDateString()} at{" "}
                  {new Date(order.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span
              className="mr-2 text-sm font-medium hidden md:block"
              style={{ color: "var(--brand-primary)" }}
            >
              Track Order
            </span>
            <div
              className="bg-gray-100 p-2 rounded-full group-hover:bg-orange-100 transition-colors duration-200"
              style={{ color: "var(--brand-primary)" }}
            >
              <FiChevronRight className="text-lg" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrderStatusList;
