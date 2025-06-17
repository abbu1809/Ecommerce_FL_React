import React from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";
import useAdminInventory from "../../../store/Admin/useAdminInventory";

const LowStockNotification = ({ products }) => {
  const { getProductTotalStock, getProductStockStatus } = useAdminInventory();
  if (!products || products.length === 0) {
    return (
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: "var(--bg-primary)",
          borderColor: "var(--border-primary)",
        }}
      >
        <div className="flex items-center">
          <div
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <FiRefreshCw size={16} style={{ color: "#16A34A" }} />
          </div>
          <div className="ml-3">
            <h3
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              All Good!
            </h3>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No products are currently low on stock.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: "#FFFBEB",
        borderColor: "#FDE68A",
      }}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <FiAlertTriangle size={20} style={{ color: "#D97706" }} />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium" style={{ color: "#92400E" }}>
            Low Stock Alert
          </h3>
          <div className="mt-2 text-sm" style={{ color: "#B45309" }}>
            <p>
              {products.length} product{products.length > 1 ? "s" : ""} running
              low on stock:
            </p>
            <ul className="mt-2 space-y-1">
              {products.slice(0, 3).map((product) => {
                const stockStatus = getProductStockStatus(product);
                const totalStock = getProductTotalStock(product);

                return (
                  <li key={product.id} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{product.name}</span>
                      <span className="font-medium">{totalStock} total</span>
                    </div>
                    {stockStatus.details.length > 0 && (
                      <div
                        className="text-xs ml-2"
                        style={{ color: "#92400E" }}
                      >
                        • {stockStatus.details.join(", ")}
                      </div>
                    )}
                    {(stockStatus.lowStockVariants.length > 0 ||
                      stockStatus.outOfStockVariants.length > 0) && (
                      <div className="text-xs ml-2 space-y-0.5">
                        {stockStatus.outOfStockVariants.map((variant, idx) => (
                          <div key={`out-${idx}`} style={{ color: "#DC2626" }}>
                            •
                            {variant.colors ||
                              variant.storage ||
                              variant.ram ||
                              `Variant ${variant.id}`}
                            : Out of stock
                          </div>
                        ))}
                        {stockStatus.lowStockVariants.map((variant, idx) => (
                          <div key={`low-${idx}`} style={{ color: "#D97706" }}>
                            •
                            {variant.colors ||
                              variant.storage ||
                              variant.ram ||
                              `Variant ${variant.id}`}
                            : {variant.stock} left
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
              {products.length > 3 && (
                <li className="font-medium">
                  ...and {products.length - 3} more
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockNotification;
