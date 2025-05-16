import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiCalendar,
  FiMapPin,
  FiTruck,
} from "react-icons/fi";
import OrderTrackingTimeline from "../components/OrderTracking/OrderTrackingTimeline";

// This page is for /order-tracking/:orderId
const OrderTrackingDetail = () => {
  const { orderId } = useParams();
  // Example order data (replace with real fetch logic)
  const order = {
    id: orderId,
    status: "Out for Delivery",
    timeline: [
      { status: "Ordered", date: "2025-05-10T10:00:00Z" },
      { status: "Packed", date: "2025-05-11T09:00:00Z" },
      { status: "Shipped", date: "2025-05-12T14:00:00Z" },
      { status: "Out for Delivery", date: "2025-05-13T08:00:00Z" },
      { status: "Delivered", date: null },
    ],
    estimatedDelivery: "2025-05-14",
    shippingAddress: "123 Main St, Anytown, State 12345",
    carrier: "FastShip Express",
    trackingNumber: "FS78291782X",
  };

  // Calculate the progress percentage based on current status
  const getProgressPercentage = () => {
    const totalSteps = order.timeline.length;
    const currentStepIndex = order.timeline.findIndex(
      (step) => step.status === order.status
    );
    return ((currentStepIndex + 1) / totalSteps) * 100;
  };

  return (
    <div
      className="min-h-screen py-10"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/orders"
            className="inline-flex items-center mb-8 px-4 py-2 rounded-full hover:bg-white/80 transition-all duration-200"
            style={{ color: "var(--brand-primary)" }}
          >
            <FiArrowLeft className="mr-2" />
            <span className="font-medium">Back to Orders</span>
          </Link>

          <div
            className="bg-white rounded-xl shadow-md overflow-hidden mb-6 animate-fadeIn"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            {/* Header with progress bar */}
            <div
              className="relative h-2 w-full"
              style={{ backgroundColor: "var(--border-primary)" }}
            >
              <div
                className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
                style={{
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: "var(--brand-primary)",
                }}
              ></div>
            </div>

            {/* Order header info */}
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-4 md:mb-0">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4 shrink-0"
                    style={{
                      backgroundColor: "var(--bg-accent-light)",
                      color: "var(--brand-primary)",
                    }}
                  >
                    <FiPackage size={24} />
                  </div>
                  <div>
                    <h1
                      className="text-2xl font-bold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Track Order #{order.id}
                    </h1>
                    <div
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor: `${
                          order.status === "Out for Delivery"
                            ? "var(--warning-color)"
                            : "var(--success-color)"
                        }20`,
                        color:
                          order.status === "Out for Delivery"
                            ? "var(--warning-color)"
                            : "var(--success-color)",
                      }}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>

                <div
                  className="flex items-center p-3 rounded-lg self-start"
                  style={{ backgroundColor: "var(--bg-secondary)" }}
                >
                  <FiCalendar
                    className="mr-2 shrink-0"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  <div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Estimated Delivery
                    </div>
                    <div
                      className="font-semibold"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping info cards */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping address card */}
              <div
                className="p-4 rounded-lg border"
                style={{ borderColor: "var(--border-primary)" }}
              >
                <div className="flex items-center mb-3">
                  <FiMapPin style={{ color: "var(--brand-primary)" }} />
                  <h3
                    className="font-medium ml-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Shipping Address
                  </h3>
                </div>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {order.shippingAddress}
                </p>
              </div>

              {/* Carrier info card */}
              <div
                className="p-4 rounded-lg border"
                style={{ borderColor: "var(--border-primary)" }}
              >
                <div className="flex items-center mb-3">
                  <FiTruck style={{ color: "var(--brand-primary)" }} />
                  <h3
                    className="font-medium ml-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Shipping Details
                  </h3>
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div className="mb-1">
                    <span className="font-medium">Carrier:</span>{" "}
                    {order.carrier}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Tracking #:</span>
                    <span
                      className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {order.trackingNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline section */}
          <div
            className="bg-white rounded-xl shadow-md p-6 animate-fadeIn"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
              animationDelay: "200ms",
            }}
          >
            <h2
              className="text-xl font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Delivery Progress
            </h2>
            <OrderTrackingTimeline
              timeline={order.timeline}
              currentStatus={order.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingDetail;
