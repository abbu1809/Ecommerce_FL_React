import React, { useState, useEffect } from "react";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiAlertTriangle,
  FiCheckCircle,
  FiEye,
} from "react-icons/fi";
import useAdminProducts from "../../../store/Admin/useAdminProducts";
import useAdminInventory from "../../../store/Admin/useAdminInventory";
import VariantStockModal from "./VariantStockModal";

const StockTable = ({ categoryFilter, stockFilter, searchQuery }) => {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { products, fetchProducts } = useAdminProducts();
  const {
    getFilteredInventory,
    updateProductStock,
    generateSKU,
    getProductStockStatus,
  } = useAdminInventory();
  // Helper function to get display price from product
  const getProductDisplayPrice = (product) => {
    if (!product) return 0;

    // If product has valid_options, use the first option's price
    if (product.valid_options && product.valid_options.length > 0) {
      const firstOption = product.valid_options[0];
      const price = firstOption.discounted_price || firstOption.price;
      return typeof price === "number" ? price : 0;
    }
    // Fallback to top-level price fields
    const price = product.discount_price || product.price;
    return typeof price === "number" ? price : 0;
  };

  // Helper function to get original price from product
  const getProductOriginalPrice = (product) => {
    if (!product) return 0;

    // If product has valid_options, use the first option's original price
    if (product.valid_options && product.valid_options.length > 0) {
      const firstOption = product.valid_options[0];
      const price = firstOption.price;
      return typeof price === "number" ? price : 0;
    }
    // Fallback to top-level price
    const price = product.price;
    return typeof price === "number" ? price : 0;
  }; // Helper function to get total stock from product
  const getProductTotalStock = (product) => {
    if (!product) return 0;

    // If product has valid_options, sum up all stock
    if (product.valid_options && product.valid_options.length > 0) {
      return product.valid_options.reduce((total, option) => {
        const stock = typeof option.stock === "number" ? option.stock : 0;
        return total + stock;
      }, 0);
    }
    // Fallback to top-level stock
    const stock = product.stock;
    return typeof stock === "number" ? stock : 0;
  };

  // Fetch products on component mount
  useEffect(() => {
    if (products.list.length === 0) {
      fetchProducts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Get filtered products based on current filters
  const filteredProducts = getFilteredInventory(
    categoryFilter,
    stockFilter,
    searchQuery
  );

  const startEditing = (id, currentValue) => {
    setEditingId(id);
    setEditValue(currentValue.toString());
  };

  const saveEdit = async (productId) => {
    const newValue = parseInt(editValue, 10);
    if (!isNaN(newValue) && newValue >= 0) {
      const result = await updateProductStock(productId, newValue);
      if (result.success) {
        setEditingId(null);
        setEditValue("");
        // Optionally refresh the data
        fetchProducts();
      } else {
        console.error("Failed to update stock:", result.message);
        // You could show a toast notification here
      }
    }
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const openVariantModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeVariantModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const hasVariants = (product) => {
    return product.valid_options && product.valid_options.length > 0;
  };
  const getStockStatusStyles = (product) => {
    const stockStatus = getProductStockStatus(product);

    // Check for variant-level issues first
    if (stockStatus.status === "out-of-stock") {
      return {
        text: "Out of Stock",
        bgColor: "#FEF2F2",
        textColor: "#DC2626",
        icon: <FiAlertTriangle size={14} />,
      };
    } else if (stockStatus.status === "partial-out-of-stock") {
      return {
        text: "Variants Out",
        bgColor: "#FEF2F2",
        textColor: "#DC2626",
        icon: <FiAlertTriangle size={14} />,
      };
    } else if (stockStatus.status === "low-stock") {
      return {
        text:
          stockStatus.lowStockVariants.length > 0
            ? "Variants Low"
            : "Low Stock",
        bgColor: "#FFFBEB",
        textColor: "#D97706",
        icon: <FiAlertTriangle size={14} />,
      };
    } else {
      return {
        text: "In Stock",
        bgColor: "#F0FDF4",
        textColor: "#16A34A",
        icon: <FiCheckCircle size={14} />,
      };
    }
  };

  // Show loading state
  if (products.loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading inventory data...</div>
      </div>
    );
  }

  // Show error state
  if (products.error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-red-600">Error: {products.error}</div>
      </div>
    );
  }

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
              Price
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Category
            </th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: "var(--border-primary)" }}
        >
          {filteredProducts
            .filter((product) => product && product.id) // Filter out null/undefined products
            .map((product) => {
              const stockStatus = getStockStatusStyles(product);
              const productSKU = generateSKU(product);
              const productImage =
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "https://via.placeholder.com/50";

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
                          src={productImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/50";
                          }}
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
                          {product.brand}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {productSKU}
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
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              saveEdit(product.id);
                            } else if (e.key === "Escape") {
                              cancelEdit();
                            }
                          }}
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
                        <button
                          onClick={cancelEdit}
                          className="ml-1 p-1 rounded-md"
                          style={{
                            backgroundColor: "var(--error-color)",
                            color: "white",
                          }}
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <div
                          className="text-sm font-medium mr-2"
                          style={{
                            color:
                              getProductTotalStock(product) === 0
                                ? "var(--error-color)"
                                : getProductTotalStock(product) <= 5
                                ? "var(--warning-color)"
                                : "var(--text-primary)",
                          }}
                        >
                          {getProductTotalStock(product)}
                        </div>
                        <div className="flex space-x-1">
                          {hasVariants(product) && (
                            <button
                              onClick={() => openVariantModal(product)}
                              className="p-1 rounded-md hover:bg-gray-100"
                              title="View variant stocks"
                              style={{
                                backgroundColor: "var(--bg-secondary)",
                                color: "var(--brand-primary)",
                              }}
                            >
                              <FiEye size={14} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              startEditing(
                                product.id,
                                getProductTotalStock(product)
                              )
                            }
                            className="p-1 rounded-md hover:bg-gray-100"
                            title="Edit total stock level"
                          >
                            <FiEdit2
                              size={14}
                              style={{ color: "var(--brand-primary)" }}
                            />
                          </button>
                        </div>
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
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      ₹{getProductDisplayPrice(product).toLocaleString()}
                    </div>
                    {getProductOriginalPrice(product) !==
                      getProductDisplayPrice(product) && (
                      <div
                        className="text-xs line-through"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        ₹{getProductOriginalPrice(product).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {product.category}
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {filteredProducts.length === 0 && (
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
          Showing {filteredProducts.length} products
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
      <VariantStockModal
        isOpen={isModalOpen}
        onClose={closeVariantModal}
        product={selectedProduct}
      />
    </div>
  );
};

export default StockTable;
