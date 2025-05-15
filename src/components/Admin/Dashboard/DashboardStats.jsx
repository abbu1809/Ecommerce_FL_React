import React from "react";
import { FiArrowUp, FiArrowDown } from "react-icons/fi";

const DashboardStats = ({ title, value, icon, change, isPositive, color }) => {
  return (
    <div
      className="p-6 rounded-lg transition-all duration-300 hover:shadow-lg relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-medium)",
        borderRadius: "var(--rounded-lg)",
      }}
    >
      {/* Background decorative element */}
      <div
        className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: color }}
      ></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className="p-3 rounded-full"
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
    </div>
  );
};

export default DashboardStats;
