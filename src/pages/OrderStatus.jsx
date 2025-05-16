import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiBox, FiPackage } from "react-icons/fi";
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
      className="min-h-screen py-10"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center mb-8 px-4 py-2 rounded-full hover:bg-white/80 transition-all duration-200"
            style={{ color: "var(--brand-primary)" }}
          >
            <FiArrowLeft className="mr-2" />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <div className="flex items-center mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                  style={{
                    backgroundColor: "var(--bg-accent-light)",
                    color: "var(--brand-primary)",
                  }}
                >
                  <FiPackage size={20} />
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    My Orders
                  </h1>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Track your recent orders and see their status in real-time.
                  </p>
                </div>
              </div>

              <div
                className="bg-gray-50 rounded-lg p-3 mb-4 flex items-center"
                style={{ backgroundColor: "var(--bg-accent-light)" }}
              >
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  <strong>Tip:</strong> Click on any order to view detailed
                  tracking information.
                </span>
              </div>
            </div>
            <div className="p-6">
              {orders.length > 0 ? (
                <OrderStatusList orders={orders} />
              ) : (
                <div
                  className="text-center py-12"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FiBox className="mx-auto mb-4" size={40} />
                  <p className="font-medium">You don't have any orders yet</p>
                  <Link
                    to="/products"
                    className="mt-3 inline-block px-4 py-2 rounded-md"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                      color: "var(--text-on-brand)",
                    }}
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatusPage;
