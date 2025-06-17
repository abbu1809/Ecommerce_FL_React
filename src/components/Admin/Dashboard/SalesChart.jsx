import React, { useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiDownload,
  FiTrendingUp,
} from "react-icons/fi";
import useAdminStore from "../../../store/Admin/useAdminStore";

// In a real application, you'd use a chart library like Chart.js, Recharts, or Nivo
const SalesChart = () => {
  const [period, setPeriod] = useState("yearly");
  const { dashboard } = useAdminStore();
  const { salesData } = dashboard;

  // Calculate total sales from the data
  const totalSales =
    salesData?.reduce((sum, data) => sum + (data.sales || 0), 0) || 0;

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
        {/* Placeholder for chart with real data visualization */}
        <div className="text-center w-full">
          {salesData && salesData.length > 0 ? (
            <div
              className="w-full h-48 rounded-lg mb-4 overflow-hidden relative flex items-end justify-between p-4"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              {salesData.map((data, i) => {
                const maxSales = Math.max(
                  ...salesData.map((d) => d.sales || 0)
                );
                const height =
                  maxSales > 0
                    ? Math.max((data.sales / maxSales) * 120, 20)
                    : 20;

                return (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-8 rounded-t-lg transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${height}px`,
                        backgroundColor: "var(--brand-primary)",
                        opacity: 0.9,
                      }}
                      title={`${data.month}: ₹${
                        data.sales?.toLocaleString() || 0
                      }`}
                    ></div>
                    <span
                      className="text-xs mt-2 font-medium"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="w-full h-48 rounded-lg mb-4 flex items-center justify-center"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="text-center">
                <FiTrendingUp
                  size={32}
                  className="mx-auto mb-2"
                  style={{ color: "var(--text-secondary)" }}
                />
                <p style={{ color: "var(--text-secondary)" }}>
                  No sales data available
                </p>
              </div>
            </div>
          )}
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Monthly sales overview ({salesData?.length || 0} months)
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
            ₹{totalSales.toLocaleString()}
          </p>
          <div
            className="text-xs font-medium mt-1"
            style={{ color: "var(--success-color)" }}
          >
            Current year total
          </div>
        </div>
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Peak Month
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {salesData && salesData.length > 0
              ? salesData.reduce(
                  (max, data) => (data.sales > max.sales ? data : max),
                  salesData[0]
                ).month
              : "N/A"}
          </p>
          <div
            className="text-xs font-medium mt-1"
            style={{ color: "var(--success-color)" }}
          >
            Highest sales month
          </div>
        </div>
        <div>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Average Monthly
          </p>
          <p
            className="text-xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            ₹
            {salesData && salesData.length > 0
              ? Math.round(totalSales / salesData.length).toLocaleString()
              : "0"}
          </p>
          <div
            className="text-xs font-medium mt-1"
            style={{ color: "var(--success-color)" }}
          >
            Monthly average
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesChart;
