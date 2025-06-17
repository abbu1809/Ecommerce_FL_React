import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import {
  FiPackage,
  FiSearch,
  FiClock,
  FiTruck,
  FiCheck,
  FiCalendar,
} from "react-icons/fi";
import { toast } from "react-hot-toast";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  const breadcrumbs = [
    { label: "Home", link: ROUTES.HOME },
    { label: "Track Order", link: ROUTES.TRACK_ORDER },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock API call - replace with actual tracking API
    setTimeout(() => {
      // Mock response data
      if (orderId && email) {
        setOrderResult({
          orderId: orderId,
          date: "2023-08-15",
          status: "In Transit",
          estimatedDelivery: "2023-08-20",
          items: [
            { id: 1, name: "iPhone 14 Pro", quantity: 1, price: 119900 },
            { id: 2, name: "iPhone 14 Pro Case", quantity: 1, price: 2499 },
          ],
          trackingNumber: "IND12345678910",
          trackingHistory: [
            {
              date: "2023-08-15",
              time: "10:30 AM",
              status: "Order Placed",
              location: "Online",
            },
            {
              date: "2023-08-16",
              time: "09:15 AM",
              status: "Order Processed",
              location: "Delhi Warehouse",
            },
            {
              date: "2023-08-17",
              time: "02:45 PM",
              status: "Shipped",
              location: "Delhi Hub",
            },
            {
              date: "2023-08-18",
              time: "11:20 AM",
              status: "In Transit",
              location: "Mumbai Distribution Center",
            },
          ],
        });
      } else {
        toast.error(
          "Order not found. Please check your order ID and email address."
        );
        setOrderResult(null);
      }
      setLoading(false);
    }, 1500);
  };

  const clearSearch = () => {
    setOrderId("");
    setEmail("");
    setOrderResult(null);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="text-gray-500">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium">{crumb.label}</span>
                ) : (
                  <Link
                    to={crumb.link}
                    className="text-gray-500 hover:text-primary"
                  >
                    {crumb.label}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "white",
                }}
              >
                <FiPackage className="text-2xl" />
              </div>
            </div>
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Track Your Order
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Enter your order ID and email address to track your order's
              current status and delivery progress.
            </p>
          </div>
        </div>
      </section>

      {/* Track Order Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
              <h2 className="text-2xl font-semibold mb-6">Order Tracking</h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label
                      htmlFor="orderId"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Order ID
                    </label>
                    <input
                      type="text"
                      id="orderId"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                      style={{ focusRing: "var(--brand-primary)" }}
                      placeholder="Enter your order ID"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:outline-none"
                      style={{ focusRing: "var(--brand-primary)" }}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-6 py-3 rounded-md text-white font-medium transition duration-300"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Tracking...
                      </span>
                    ) : (
                      <>
                        <FiSearch className="mr-2" /> Track Order
                      </>
                    )}
                  </button>
                  {orderResult && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="flex-1 flex items-center justify-center px-6 py-3 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition duration-300"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Order Result */}
            {orderResult && (
              <div className="mt-8">
                <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">
                      Order #{orderResult.orderId}
                    </h2>
                    <span
                      className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{
                        backgroundColor:
                          orderResult.status === "Delivered"
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(59, 130, 246, 0.1)",
                        color:
                          orderResult.status === "Delivered"
                            ? "#10B981"
                            : "#3B82F6",
                      }}
                    >
                      {orderResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">
                        Order Date
                      </span>
                      <div className="flex items-center">
                        <FiCalendar className="mr-2 text-gray-500" />
                        <span className="font-medium">{orderResult.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">
                        Tracking Number
                      </span>
                      <span className="font-medium">
                        {orderResult.trackingNumber}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500 mb-1">
                        Estimated Delivery
                      </span>
                      <div className="flex items-center">
                        <FiClock className="mr-2 text-gray-500" />
                        <span className="font-medium">
                          {orderResult.estimatedDelivery}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {orderResult.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between py-3 border-b border-gray-200 last:border-0"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <p className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">
                              ₹{item.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Tracking History
                    </h3>
                    <div className="relative">
                      {/* Vertical Line */}
                      <div className="absolute top-0 left-6 w-0.5 h-full bg-gray-200"></div>

                      {orderResult.trackingHistory.map((event, index) => (
                        <div
                          key={index}
                          className="relative flex items-start mb-6 last:mb-0"
                        >
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                              index === 0
                                ? "bg-green-500"
                                : index ===
                                  orderResult.trackingHistory.length - 1
                                ? event.status === "Delivered"
                                  ? "bg-green-500"
                                  : "bg-blue-500"
                                : "bg-blue-500"
                            }`}
                          >
                            {index === 0 ? (
                              <FiCheck className="text-white text-lg" />
                            ) : index ===
                              orderResult.trackingHistory.length - 1 ? (
                              event.status === "Delivered" ? (
                                <FiCheck className="text-white text-lg" />
                              ) : (
                                <FiTruck className="text-white text-lg" />
                              )
                            ) : (
                              <FiTruck className="text-white text-lg" />
                            )}
                          </div>
                          <div className="ml-6">
                            <h4 className="font-medium">{event.status}</h4>
                            <p className="text-sm text-gray-500">
                              {event.location}
                            </p>
                            <p className="text-xs text-gray-500">
                              {event.date} at {event.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-6">
              Need Help with Your Order?
            </h2>
            <p className="text-gray-700 mb-8">
              If you're having trouble finding your order or have any other
              questions, please don't hesitate to contact our customer service
              team.
            </p>
            <Link
              to={ROUTES.CONTACT}
              className="inline-flex items-center px-6 py-3 rounded-md text-white font-medium transition duration-300"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrackOrder;
