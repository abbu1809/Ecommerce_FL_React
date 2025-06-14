import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiEye,
  FiX,
  FiTrendingUp,
  FiDollarSign,
} from "react-icons/fi";
import useAdminStore from "../../../store/Admin/useAdminStore";

// Product Details Modal Component
const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
                backgroundColor: "var(--bg-accent-light)",
                color: "var(--brand-primary)",
              }}
            >
              <FiPackage size={20} />
            </div>
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Product Details
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Sales Information
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
            {/* Product Basic Info */}
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {product.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Product ID
                  </span>
                  <span style={{ color: "var(--text-primary)" }}>
                    #{product.id?.slice(-8) || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sales Statistics */}
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h3
                className="text-lg font-semibold mb-3 flex items-center"
                style={{ color: "var(--text-primary)" }}
              >
                <FiTrendingUp className="mr-2" />
                Sales Performance
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    {product.sales || 0}
                  </div>
                  <p style={{ color: "var(--text-secondary)" }}>Units Sold</p>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold mb-1"
                    style={{ color: "var(--success-color)" }}
                  >
                    ₹{(product.revenue || 0).toLocaleString()}
                  </div>
                  <p style={{ color: "var(--text-secondary)" }}>
                    Total Revenue
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div
              className="p-4 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <h3
                className="text-lg font-semibold mb-3 flex items-center"
                style={{ color: "var(--text-primary)" }}
              >
                <FiDollarSign className="mr-2" />
                Metrics
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Average Order Value
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₹
                    {product.sales > 0
                      ? Math.round(
                          (product.revenue || 0) / product.sales
                        ).toLocaleString()
                      : "0"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Performance Rank
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--brand-primary)" }}
                  >
                    Top Seller
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--text-secondary)" }}>
                    Sales Trend
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--success-color)" }}
                  >
                    Trending Up
                  </span>
                </div>
              </div>
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

const TopProducts = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("monthly");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { dashboard } = useAdminStore();
  const { topProducts } = dashboard;

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowDetailsModal(true);
  };

  const handleViewAllProducts = () => {
    navigate("/admin/products");
  };

  return (
    <>
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
          {topProducts && topProducts.length > 0 ? (
            topProducts.map((product, index) => (
              <div
                key={product.id || index}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
                style={{ borderRadius: "var(--rounded-md)" }}
              >
                <div
                  className="w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0 flex items-center justify-center shadow-sm"
                  style={{ borderRadius: "var(--rounded-md)" }}
                >
                  <FiPackage
                    size={24}
                    style={{ color: "var(--brand-primary)" }}
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
                      ₹{product.revenue?.toLocaleString()}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleViewDetails(product)}
                  className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-all duration-200"
                  style={{ color: "var(--brand-primary)" }}
                >
                  <FiEye size={18} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <FiPackage
                size={32}
                className="mx-auto mb-2"
                style={{ color: "var(--text-secondary)" }}
              />
              <p style={{ color: "var(--text-secondary)" }}>
                No product data available
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleViewAllProducts}
          className="w-full mt-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center hover:shadow-md"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--brand-primary)",
          }}
        >
          View All Products
        </button>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default TopProducts;
