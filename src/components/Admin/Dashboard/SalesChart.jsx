import React, { useState } from "react";
import { FiCalendar, FiChevronDown, FiDownload } from "react-icons/fi";

// In a real application, you'd use a chart library like Chart.js, Recharts, or Nivo
const SalesChart = () => {
  const [period, setPeriod] = useState("yearly");

  return (
    <div
      className="p-6 rounded-lg h-full"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-medium)",
        borderRadius: "var(--rounded-lg)",
      }}
    >
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Sales Overview
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total sales and revenue
          </p>
        </div>

        <div className="flex space-x-2 mt-2 sm:mt-0">
          <div
            className="border rounded-md flex items-center px-3 py-1.5"
            style={{
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            <FiCalendar size={14} className="mr-2" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="text-sm bg-transparent border-none outline-none appearance-none pr-6"
              style={{ color: "var(--text-primary)" }}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <FiChevronDown size={14} className="ml-1" />
          </div>

          <button
            className="border rounded-md px-3 py-1.5 flex items-center text-sm"
            style={{
              borderColor: "var(--border-primary)",
              color: "var(--text-primary)",
            }}
          >
            <FiDownload size={14} className="mr-2" />
            Export
          </button>
        </div>
      </div>

      <div className="h-64 flex items-center justify-center mb-4">
        {/* Placeholder for chart */}
        <div className="text-center">
          <div
            className="w-full h-48 rounded-lg mb-4 overflow-hidden relative"
            style={{ backgroundColor: "var(--bg-secondary)" }}
          >
            <div className="flex justify-between absolute left-0 right-0 bottom-0 px-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-12 rounded-t-lg"
                  style={{
                    height: `${Math.random() * 100 + 20}px`,
                    backgroundColor: "var(--brand-primary)",
                    opacity: 0.8,
                  }}
                ></div>
              ))}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i + 6}
                  className="w-12 rounded-t-lg"
                  style={{
                    height: `${Math.random() * 80 + 40}px`,
                    backgroundColor: "var(--brand-secondary)",
                    opacity: 0.7,
                  }}
                ></div>
              ))}
            </div>
          </div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            (This is a placeholder for an actual chart component)
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total Sales
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            ₹425,652
          </p>
          <div
            className="text-xs font-medium mt-1"
            style={{ color: "var(--success-color)" }}
          >
            +8.5% vs last period
          </div>
        </div>
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Total Orders
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            1,482
          </p>
          <div
            className="text-xs font-medium mt-1"
            style={{ color: "var(--success-color)" }}
          >
            +5.2% vs last period
          </div>
        </div>
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Average Order
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            ₹28,720
          </p>
          <div
            className="text-xs font-medium mt-1"
            style={{ color: "var(--success-color)" }}
          >
            +2.8% vs last period
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
