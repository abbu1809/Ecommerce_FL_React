import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiBox } from "react-icons/fi";
import OrderStatusList from "../components/OrderStatus/OrderStatusList";

const OrderStatusPage = () => {
  // Example orders (replace with real data from backend/store)
  const orders = [
    {
      id: "ORD123456",
      status: "Out for Delivery",
      date: "2025-05-10T10:00:00Z",
    },
    {
      id: "ORD123457",
      status: "Delivered",
      date: "2025-05-08T12:00:00Z",
    },
    {
      id: "ORD123458",
      status: "Shipped",
      date: "2025-05-09T15:00:00Z",
    },
  ];

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="container mx-auto px-4">
        <Link
          to="/account"
          className="inline-flex items-center text-orange-500 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Account
        </Link>
        <div
          className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto"
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
            My Orders
          </h1>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Track your recent orders and see their status in real-time.
          </p>
          <OrderStatusList orders={orders} />
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
