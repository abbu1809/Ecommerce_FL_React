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
    <div className="divide-y divide-gray-100">
      {orders.map((order) => (
        <Link
          to={`/order-tracking/${order.id}`}
          key={order.id}
          className="flex items-center justify-between py-4 group hover:bg-gray-50 rounded-lg transition-colors"
          style={{ textDecoration: "none" }}
        >
          <div className="flex items-center">
            <div
              className="h-10 w-10 flex items-center justify-center rounded-full mr-4"
              style={{
                backgroundColor: statusColors[order.status],
                color: "#fff",
                fontSize: 22,
              }}
            >
              {statusIcons[order.status]}
            </div>
            <div>
              <div
                className="font-semibold text-base"
                style={{ color: "var(--text-primary)" }}
              >
                Order #{order.id}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Status:{" "}
                <span
                  style={{ color: statusColors[order.status], fontWeight: 600 }}
                >
                  {order.status}
                </span>
              </div>
              <div
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Placed on: {new Date(order.date).toLocaleString()}
              </div>
            </div>
          </div>
          <FiChevronRight
            className="text-xl"
            style={{ color: "var(--brand-primary)" }}
          />
        </Link>
      ))}
    </div>
  );
};

export default OrderStatusList;
