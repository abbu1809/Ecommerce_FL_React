import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowUp, FiArrowDown, FiX, FiInfo } from "react-icons/fi";

// Stats Details Modal Component
const StatsDetailsModal = ({ isOpen, onClose, stat }) => {
  if (!isOpen || !stat) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatDescription = (title) => {
    switch (title.toLowerCase()) {
      case "total sales":
        return {
          description: "Total revenue generated from all completed orders",
          details: [
            "Includes all successful transactions",
            "Excludes cancelled and pending orders",
            "Updated in real-time",
          ],
        };
      case "new orders":
        return {
          description: "Number of new orders received in the last 24 hours",
          details: [
            "Includes all order statuses",
            "Refreshed every hour",
            "Peak hours typically 10am-8pm",
          ],
        };
      case "new customers":
        return {
          description:
            "Number of new customer registrations in the last 24 hours",
          details: [
            "Counts verified accounts only",
            "Includes both email and social logins",
            "Conversion rate tracking available",
          ],
        };
      case "low stock items":
        return {
          description: "Products with stock levels below 10 units",
          details: [
            "Requires immediate attention",
            "Includes all product variants",
            "Auto-reorder recommendations available",
          ],
        };
      default:
        return {
          description:
            "Statistical information about your business performance",
          details: ["Data updated regularly", "Historical trends available"],
        };
    }
  };

  const statInfo = getStatDescription(stat.title);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      style={{
        backgroundColor: "var(--bg-overlay)",
        backdropFilter: "blur(4px)",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-md max-h-[90vh] overflow-hidden rounded-lg shadow-xl transform transition-all"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderRadius: "var(--rounded-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{
                backgroundColor: `${stat.color}15`,
                color: stat.color,
              }}
            >
              {stat.icon}
            </div>
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.title}
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Detailed Information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            style={{ color: "var(--text-secondary)" }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Current Value */}
            <div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div
                className="text-3xl font-bold mb-2"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div
                className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded-full ${
                  stat.isPositive ? "bg-green-100" : "bg-red-100"
                }`}
                style={{
                  color: stat.isPositive
                    ? "var(--success-color)"
                    : "var(--error-color)",
                }}
              >
                {stat.isPositive ? (
                  <FiArrowUp className="mr-1" size={14} />
                ) : (
                  <FiArrowDown className="mr-1" size={14} />
                )}
                {stat.change} from last period
              </div>
            </div>

            {/* Description */}
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h3
                className="text-lg font-semibold mb-3 flex items-center"
                style={{ color: "var(--text-primary)" }}
              >
                <FiInfo className="mr-2" />
                About This Metric
              </h3>
              <p
                className="text-sm mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                {statInfo.description}
              </p>
              <ul className="text-sm space-y-1">
                {statInfo.details.map((detail, index) => (
                  <li
                    key={index}
                    className="flex items-start"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span className="mr-2">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 border-t flex justify-end"
          style={{ borderColor: "var(--border-primary)" }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardStats = ({ title, value, icon, change, isPositive, color }) => {
  const navigate = useNavigate();
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleClick = () => {
    // Show modal for more details
    setShowDetailsModal(true);
  };

  const getNavigationPath = (title) => {
    switch (title.toLowerCase()) {
      case "new orders":
        return "/admin/orders";
      case "new customers":
        return "/admin/users";
      case "low stock items":
        return "/admin/inventory";
      default:
        return "/admin/dashboard";
    }
  };

  const handleDoubleClick = () => {
    // Navigate to relevant page on double click
    const path = getNavigationPath(title);
    if (path !== "/admin/dashboard") {
      navigate(path);
    }
  };

  return (
    <>
      <div
        className="p-6 rounded-lg transition-all duration-300 hover:shadow-lg relative overflow-hidden cursor-pointer hover:scale-105 transform"
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "var(--shadow-medium)",
          borderRadius: "var(--rounded-lg)",
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        title={`Click for details, double-click to navigate to ${getNavigationPath(
          title
        )
          .split("/")
          .pop()}`}
      >
        {/* Background decorative element */}
        <div
          className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: color }}
        ></div>

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div
            className="p-3 rounded-full transition-transform duration-200 hover:scale-110"
            style={{
              backgroundColor: `${color}15`, // Using hex with transparency
              color: color,
            }}
          >
            {icon}
          </div>
          <div
            className={`flex items-center text-sm font-medium px-2.5 py-1 rounded-full ${
              isPositive ? "bg-green-100" : "bg-red-100"
            }`}
            style={{
              color: isPositive ? "var(--success-color)" : "var(--error-color)",
            }}
          >
            {isPositive ? (
              <FiArrowUp className="mr-1" size={14} />
            ) : (
              <FiArrowDown className="mr-1" size={14} />
            )}
            {change}
          </div>
        </div>

        <div className="relative z-10">
          <h3
            className="text-sm font-medium mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            {title}
          </h3>
          <p
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {value}
          </p>
        </div>

        {/* Hover indicator */}
        <div
          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ color: "var(--text-secondary)" }}
        >
          <FiInfo size={16} />
        </div>
      </div>

      {/* Stats Details Modal */}
      <StatsDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        stat={{ title, value, icon, change, isPositive, color }}
      />
    </>
  );
};

export default DashboardStats;
