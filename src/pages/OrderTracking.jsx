import React from "react";
import OrderTrackingTimeline from "../components/OrderTracking/OrderTrackingTimeline";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const OrderTracking = () => {
  // Example order status data (replace with real data from backend/store)
  const order = {
    id: "ORD123456",
    status: "Out for Delivery",
    timeline: [
      { status: "Ordered", date: "2025-05-10T10:00:00Z" },
      { status: "Packed", date: "2025-05-11T09:00:00Z" },
      { status: "Shipped", date: "2025-05-12T14:00:00Z" },
      { status: "Out for Delivery", date: "2025-05-13T08:00:00Z" },
      { status: "Delivered", date: null },
    ],
    estimatedDelivery: "2025-05-14",
  };

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="container mx-auto px-4">
        <Link
          to="/orders"
          className="inline-flex items-center text-orange-500 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Orders
        </Link>
        <div
          className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto"
          style={{
            backgroundColor: "var(--bg-primary)",
            color: "var(--text-primary)",
            borderRadius: "var(--rounded-lg)",
            boxShadow: "var(--shadow-medium)",
          }}
        >
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Track Your Order
          </h1>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Order ID: <span className="font-mono">{order.id}</span>
          </p>
          <OrderTrackingTimeline
            timeline={order.timeline}
            currentStatus={order.status}
          />
          <div
            className="mt-6 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Estimated Delivery:{" "}
            <span
              className="font-semibold"
              style={{ color: "var(--brand-primary)" }}
            >
              {order.estimatedDelivery}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
