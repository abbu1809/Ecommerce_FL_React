import React, { useState } from "react";
import {
  FiSearch,
  FiChevronRight,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiTruck,
} from "react-icons/fi";

const RecentOrders = () => {
  const [filter, setFilter] = useState("all");

  // Mock data for recent orders
  const orders = [
    {
      id: "#ORD-7931",
      customer: "Rahul Sharma",
      date: "2023-05-15",
      amount: 24990,
      status: "delivered",
      items: 3,
    },
    {
      id: "#ORD-7930",
      customer: "Priya Singh",
      date: "2023-05-15",
      amount: 16499,
      status: "processing",
      items: 2,
    },
    {
      id: "#ORD-7929",
      customer: "Amit Kumar",
      date: "2023-05-14",
      amount: 54990,
      status: "shipped",
      items: 1,
    },
    {
      id: "#ORD-7928",
      customer: "Neha Verma",
      date: "2023-05-14",
      amount: 6999,
      status: "cancelled",
      items: 1,
    },
    {
      id: "#ORD-7927",
      customer: "Vivek Gupta",
      date: "2023-05-13",
      amount: 12499,
      status: "delivered",
      items: 4,
    },
  ];

  const getStatusStyles = (status) => {
    switch (status) {
      case "delivered":
        return {
          bgColor: "rgba(16, 185, 129, 0.15)",
          textColor: "var(--success-color)",
          icon: <FiCheckCircle size={14} />,
        };
      case "processing":
        return {
          bgColor: "rgba(245, 158, 11, 0.15)",
          textColor: "var(--warning-color)",
          icon: <FiClock size={14} />,
        };
      case "shipped":
        return {
          bgColor: "rgba(59, 130, 246, 0.15)",
          textColor: "var(--info-color)",
          icon: <FiTruck size={14} />,
        };
      case "cancelled":
        return {
          bgColor: "rgba(239, 68, 68, 0.15)",
          textColor: "var(--error-color)",
          icon: <FiXCircle size={14} />,
        };
      default:
        return {
          bgColor: "rgba(107, 114, 128, 0.15)",
          textColor: "var(--text-secondary)",
          icon: <FiClock size={14} />,
        };
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <div
      className="p-6 rounded-lg"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-medium)",
        borderRadius: "var(--rounded-lg)",
      }}
    >
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Recent Orders
        </h2>

        <div className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
          <div
            className="relative rounded-md"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch
                className="h-4 w-4"
                style={{ color: "var(--text-secondary)" }}
              />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="py-1.5 pl-9 pr-4 block w-full text-sm focus:outline-none"
              style={{
                backgroundColor: "var(--bg-secondary)",
                color: "var(--text-primary)",
                borderRadius: "var(--rounded-md)",
              }}
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="py-1.5 px-3 text-sm border rounded-md appearance-none bg-white"
            style={{
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <option value="all">All Orders</option>
            <option value="delivered">Delivered</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <thead>
            <tr>
              <th
                className="py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Order ID
              </th>
              <th
                className="py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Customer
              </th>
              <th
                className="py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Date
              </th>
              <th
                className="py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Amount
              </th>
              <th
                className="py-3 text-left text-xs font-medium tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                Status
              </th>
              <th className="py-3 text-left text-xs font-medium tracking-wider"></th>
            </tr>
          </thead>
          <tbody
            className="divide-y"
            style={{ borderColor: "var(--border-primary)" }}
          >
            {filteredOrders.map((order) => {
              const statusStyle = getStatusStyles(order.status);

              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td
                    className="py-4 text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {order.id}
                  </td>
                  <td
                    className="py-4 text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {order.customer}
                  </td>
                  <td
                    className="py-4 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {new Date(order.date).toLocaleDateString()}
                  </td>
                  <td
                    className="py-4 text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₹{order.amount.toLocaleString()}
                  </td>
                  <td className="py-4">
                    <div
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: statusStyle.bgColor,
                        color: statusStyle.textColor,
                      }}
                    >
                      <span className="mr-1.5">{statusStyle.icon}</span>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      className="flex items-center text-xs"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      Details
                      <FiChevronRight size={14} className="ml-1" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button
          className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--brand-primary)",
          }}
        >
          View All Orders
          <FiChevronRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default RecentOrders;
