import React, { useState, useEffect } from "react";
import {
  FiEdit2,
  FiSave,
  FiAlertTriangle,
  FiCheckCircle,
} from "react-icons/fi";

const StockTable = ({ categoryFilter, stockFilter, searchQuery }) => {
  // Mock products data
  const initialProducts = [
    {
      id: 1,
      name: "iPhone 13 Pro Max",
      image: "https://via.placeholder.com/50",
      category: "smartphones",
      sku: "IP13PM-256-GR",
      stock: 24,
      minStockLevel: 5,
      lastUpdated: "2023-05-10",
    },
    {
      id: 2,
      name: "Samsung Galaxy S22 Ultra",
      image: "https://via.placeholder.com/50",
      category: "smartphones",
      sku: "SGS22U-256-BK",
      stock: 18,
      minStockLevel: 5,
      lastUpdated: "2023-05-12",
    },
    {
      id: 3,
      name: "Apple MacBook Pro M1",
      image: "https://via.placeholder.com/50",
      category: "laptops",
      sku: "AMBPM1-512-SG",
      stock: 3,
      minStockLevel: 5,
      lastUpdated: "2023-05-05",
    },
    {
      id: 4,
      name: "Dell XPS 13",
      image: "https://via.placeholder.com/50",
      category: "laptops",
      sku: "DXPS13-512-SL",
      stock: 2,
      minStockLevel: 5,
      lastUpdated: "2023-05-08",
    },
    {
      id: 5,
      name: "Samsung Galaxy Tab S8",
      image: "https://via.placeholder.com/50",
      category: "tablets",
      sku: "SGTS8-128-SL",
      stock: 0,
      minStockLevel: 5,
      lastUpdated: "2023-04-28",
    },
    {
      id: 6,
      name: "Apple AirPods Pro",
      image: "https://via.placeholder.com/50",
      category: "accessories",
      sku: "AAPP-WH",
      stock: 42,
      minStockLevel: 10,
      lastUpdated: "2023-05-14",
    },
    {
      id: 7,
      name: "Logitech MX Master 3",
      image: "https://via.placeholder.com/50",
      category: "accessories",
      sku: "LMM3-GR",
      stock: 31,
      minStockLevel: 8,
      lastUpdated: "2023-05-13",
    },
  ];

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Apply filters
  useEffect(() => {
    let filtered = [...initialProducts];

    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.category === categoryFilter
      );
    }

    // Apply stock filter
    if (stockFilter === "low-stock") {
      filtered = filtered.filter(
        (product) => product.stock > 0 && product.stock <= product.minStockLevel
      );
    } else if (stockFilter === "out-of-stock") {
      filtered = filtered.filter((product) => product.stock === 0);
    } else if (stockFilter === "in-stock") {
      filtered = filtered.filter(
        (product) => product.stock > product.minStockLevel
      );
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query)
      );
    }

    setProducts(filtered);
  }, [categoryFilter, stockFilter, searchQuery]);

  const startEditing = (id, currentValue) => {
    setEditingId(id);
    setEditValue(currentValue.toString());
  };

  const saveEdit = (id) => {
    const newValue = parseInt(editValue, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      setProducts(
        products.map((product) =>
          product.id === id
            ? {
                ...product,
                stock: newValue,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : product
        )
      );
    }
    setEditingId(null);
  };

  const getStockStatusStyles = (stock, minStock) => {
    if (stock === 0) {
      return {
        bgColor: "rgba(239, 68, 68, 0.1)",
        textColor: "var(--error-color)",
        icon: <FiAlertTriangle size={14} />,
        text: "Out of Stock",
      };
    } else if (stock <= minStock) {
      return {
        bgColor: "rgba(245, 158, 11, 0.1)",
        textColor: "var(--warning-color)",
        icon: <FiAlertTriangle size={14} />,
        text: "Low Stock",
      };
    } else {
      return {
        bgColor: "rgba(16, 185, 129, 0.1)",
        textColor: "var(--success-color)",
        icon: <FiCheckCircle size={14} />,
        text: "In Stock",
      };
    }
  };

  return (
    <div
      className="overflow-x-auto rounded-lg shadow"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderRadius: "var(--rounded-lg)",
      }}
    >
      <table
        className="min-w-full divide-y"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <thead>
          <tr style={{ backgroundColor: "var(--bg-secondary)" }}>
            <th
              className="px-6 py-3 text-left text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Product
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              SKU
            </th>
            <th
              className="px-6 py-3 text-center text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Current Stock
            </th>
            <th
              className="px-6 py-3 text-center text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Status
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: "var(--border-primary)" }}
        >
          {products.map((product) => {
            const stockStatus = getStockStatusStyles(
              product.stock,
              product.minStockLevel
            );

            return (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0 w-10 h-10 rounded overflow-hidden bg-gray-100 border"
                      style={{ borderColor: "var(--border-primary)" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div
                        className="text-sm font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {product.name}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {product.category.charAt(0).toUpperCase() +
                          product.category.slice(1)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {product.sku}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {editingId === product.id ? (
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        min="0"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-16 text-center p-1 border rounded-md text-sm"
                        style={{
                          borderColor: "var(--border-primary)",
                          borderRadius: "var(--rounded-sm)",
                        }}
                        autoFocus
                      />
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="ml-2 p-1 rounded-md"
                        style={{
                          backgroundColor: "var(--success-color)",
                          color: "white",
                        }}
                      >
                        <FiSave size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <div
                        className="text-sm font-medium mr-2"
                        style={{
                          color:
                            product.stock === 0
                              ? "var(--error-color)"
                              : product.stock <= product.minStockLevel
                              ? "var(--warning-color)"
                              : "var(--text-primary)",
                        }}
                      >
                        {product.stock}
                      </div>
                      <button
                        onClick={() => startEditing(product.id, product.stock)}
                        className="p-1 rounded-md hover:bg-gray-100"
                        title="Edit stock level"
                      >
                        <FiEdit2
                          size={14}
                          style={{ color: "var(--brand-primary)" }}
                        />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex justify-center">
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: stockStatus.bgColor,
                        color: stockStatus.textColor,
                      }}
                    >
                      <span className="mr-1">{stockStatus.icon}</span>
                      {stockStatus.text}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {new Date(product.lastUpdated).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <div
          className="p-8 text-center"
          style={{ color: "var(--text-secondary)" }}
        >
          No products matching your filters
        </div>
      )}

      <div
        className="px-6 py-4 flex items-center justify-between border-t"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Showing {products.length} products
        </div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              borderRadius: "var(--rounded-md)",
            }}
            disabled
          >
            Previous
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-md"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            1
          </button>
          <button
            className="px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50"
            style={{
              backgroundColor: "var(--bg-secondary)",
              color: "var(--text-secondary)",
              borderRadius: "var(--rounded-md)",
            }}
            disabled
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockTable;
