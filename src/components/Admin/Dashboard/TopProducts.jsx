import React, { useState } from "react";
import { FiPackage, FiEye } from "react-icons/fi";

const TopProducts = () => {
  const [period, setPeriod] = useState("monthly");

  // Mock data for top products
  const products = [
    {
      id: 1,
      name: "Apple iPhone 13 Pro",
      image: "https://via.placeholder.com/50",
      sales: 42,
      revenue: 3780000,
      growth: "+12.5%",
    },
    {
      id: 2,
      name: "Samsung Galaxy S22",
      image: "https://via.placeholder.com/50",
      sales: 38,
      revenue: 2850000,
      growth: "+8.3%",
    },
    {
      id: 3,
      name: "OnePlus 10 Pro",
      image: "https://via.placeholder.com/50",
      sales: 31,
      revenue: 1860000,
      growth: "+15.7%",
    },
    {
      id: 4,
      name: "Xiaomi 12 Pro",
      image: "https://via.placeholder.com/50",
      sales: 27,
      revenue: 1485000,
      growth: "+6.2%",
    },
  ];

  return (
    <div
      className="p-6 rounded-lg h-full"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-medium)",
        borderRadius: "var(--rounded-lg)",
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Top Products
        </h2>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 text-xs rounded-full transition-all ${
              period === "weekly" ? "font-medium" : ""
            }`}
            style={{
              backgroundColor:
                period === "weekly"
                  ? "var(--bg-accent-light)"
                  : "var(--bg-secondary)",
              color:
                period === "weekly"
                  ? "var(--brand-primary)"
                  : "var(--text-secondary)",
            }}
            onClick={() => setPeriod("weekly")}
          >
            Weekly
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-full transition-all ${
              period === "monthly" ? "font-medium" : ""
            }`}
            style={{
              backgroundColor:
                period === "monthly"
                  ? "var(--bg-accent-light)"
                  : "var(--bg-secondary)",
              color:
                period === "monthly"
                  ? "var(--brand-primary)"
                  : "var(--text-secondary)",
            }}
            onClick={() => setPeriod("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
            style={{ borderRadius: "var(--rounded-md)" }}
          >
            <div
              className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 flex items-center justify-center shadow-sm"
              style={{ borderRadius: "var(--rounded-md)" }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="ml-3 flex-1">
              <h3
                className="font-medium text-sm line-clamp-1"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </h3>
              <div className="flex items-center mt-1">
                <div
                  className="flex items-center text-xs mr-4"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FiPackage size={12} className="mr-1" />
                  <span>{product.sales} sold</span>
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: "var(--success-color)" }}
                >
                  {product.growth}
                </div>
              </div>
            </div>

            <button
              className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
              style={{ color: "var(--brand-primary)" }}
            >
              <FiEye size={18} />
            </button>
          </div>
        ))}
      </div>

      <button
        className="w-full mt-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center"
        style={{
          backgroundColor: "var(--bg-secondary)",
          color: "var(--brand-primary)",
        }}
      >
        View All Products
      </button>
    </div>
  );
};

export default TopProducts;
