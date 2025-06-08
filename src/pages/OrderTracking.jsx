import OrderTrackingTimeline from "../components/OrderTracking/OrderTrackingTimeline";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiPackage, FiCalendar, FiInfo } from "react-icons/fi";

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
            className="bg-white rounded-xl shadow-md overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            {/* Header section with order info */}
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
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
                      Track Your Order
                    </h1>
                    <p
                      className="text-sm flex items-center"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span className="font-medium mr-1">Order ID:</span>
                      <span
                        className="font-mono bg-gray-100 px-2 py-1 rounded"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {order.id}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  className="hidden md:block text-right"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <div className="text-xs">Current Status</div>
                  <div
                    className="font-semibold mt-1 px-3 py-1 rounded-full text-sm inline-block"
                    style={{
                      backgroundColor:
                        order.status === "Out for Delivery"
                          ? "var(--warning-color)20"
                          : "var(--success-color)20",
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

              {/* Estimated delivery banner */}
              <div
                className="mt-6 p-4 rounded-lg flex items-center"
                style={{
                  backgroundColor: "var(--bg-accent-light)",
                  color: "var(--text-primary)",
                }}
              >
                <FiCalendar
                  className="mr-3"
                  size={20}
                  style={{ color: "var(--brand-primary)" }}
                />
                <div>
                  <div className="text-sm font-medium">Estimated Delivery</div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {new Date(order.estimatedDelivery).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline section */}
            <div className="p-6">
              <div
                className="mb-6 p-3 border-l-4 rounded-r-lg flex items-center"
                style={{
                  borderColor: "var(--info-color)",
                  backgroundColor: "var(--info-color)10",
                }}
              >
                <FiInfo
                  className="mr-2"
                  style={{ color: "var(--info-color)" }}
                />
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  We'll update this page as your order progresses.
                </p>
              </div>

              <OrderTrackingTimeline
                timeline={order.timeline}
                currentStatus={order.status}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
