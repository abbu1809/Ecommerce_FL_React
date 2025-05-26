import React, { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiEye,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";
import useAdminProducts from "../../../store/Admin/useAdminProducts";

const ProductTable = ({ onViewProduct, onEditProduct }) => {
  const { products, fetchProducts, deleteProduct, toggleProductFeatured } =
    useAdminProducts();
  const { list: productList, filteredList, loading } = products;

  // Use filteredList when it's been set (even if empty), otherwise fall back to the main list
  const displayedProducts = filteredList !== null ? filteredList : productList;

  // States for confirmation modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Function to open delete confirmation modal
  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };
  // Function to handle delete product (API call)
  const handleDeleteProduct = async () => {
    if (selectedProduct) {
      await deleteProduct(selectedProduct.id);
      setShowDeleteModal(false);
      // Could add toast notification here based on result.success
    }
  };

  // Function to open featured toggle confirmation modal
  const openFeaturedModal = (product) => {
    setSelectedProduct(product);
    setShowFeaturedModal(true);
  };
  // Function to toggle featured status (API call)
  const handleToggleFeatured = async () => {
    if (selectedProduct) {
      await toggleProductFeatured(selectedProduct.id);
      setShowFeaturedModal(false);
      // Could add toast notification here based on result.success
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
              Category
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
              Stock
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Featured
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Status
            </th>
            <th
              className="px-6 py-3 text-right text-xs font-medium tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody
          className="divide-y"
          style={{ borderColor: "var(--border-primary)" }}
        >
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500">
                Loading products...
              </td>
            </tr>
          ) : displayedProducts.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-8 text-gray-500">
                No products found matching your filters.
              </td>
            </tr>
          ) : (
            displayedProducts.map((product) => (
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
                        src={
                          product.images && product.images.length > 0
                            ? product.images[0]
                            : "https://via.placeholder.com/50"
                        }
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
                        ID: {product.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product.category}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    ₹
                    {(product.discount_price || product.price).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div
                    className="text-sm"
                    style={{
                      color:
                        product.stock === 0
                          ? "var(--error-color)"
                          : product.stock < 10
                          ? "var(--warning-color)"
                          : "var(--text-primary)",
                    }}
                  >
                    {product.stock} {product.stock === 1 ? "unit" : "units"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button
                    onClick={() => openFeaturedModal(product)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200`}
                    style={{
                      backgroundColor: product.featured
                        ? "var(--brand-primary)"
                        : "var(--bg-secondary)",
                      border: "1px solid",
                      borderColor: product.featured
                        ? "var(--brand-primary)"
                        : "var(--border-secondary)",
                      color: product.featured
                        ? "var(--text-on-brand)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {product.featured ? <FiCheck size={12} /> : null}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    style={{
                      backgroundColor:
                        product.stock > 0
                          ? "rgba(16, 185, 129, 0.1)"
                          : "rgba(239, 68, 68, 0.1)",
                      color:
                        product.stock > 0
                          ? "var(--success-color)"
                          : "var(--error-color)",
                    }}
                  >
                    {product.stock > 0 ? "Active" : "Out of Stock"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {" "}
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onViewProduct(product)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      style={{ color: "var(--text-secondary)" }}
                      title="View Product"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => onEditProduct(product)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      style={{ color: "var(--brand-primary)" }}
                      title="Edit Product"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      style={{ color: "var(--error-color)" }}
                      title="Delete Product"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div
        className="px-6 py-4 flex items-center justify-between border-t"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Showing {displayedProducts.length} of {productList.length} products
        </div>
        <div className="flex space-x-2">
          <button
            className="px-4 py-2 text-sm font-medium rounded-md"
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
            className="px-4 py-2 text-sm font-medium rounded-md"
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
      </div>{" "}
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="p-6 rounded-lg shadow-xl max-w-md w-full border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
            }}
          >
            <div className="mb-4 flex items-center">
              <FiAlertCircle
                className="mr-3"
                size={24}
                style={{ color: "var(--error-color)" }}
              />
              <h3
                className="text-lg font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Confirm Deletion
              </h3>
            </div>

            <p
              className="mb-6 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Are you sure you want to delete "{selectedProduct?.name}"? This
              action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              {" "}
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 border"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                  borderRadius: "var(--rounded-md)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                style={{
                  backgroundColor: "var(--error-color)",
                  color: "white",
                  borderRadius: "var(--rounded-md)",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Featured Toggle Confirmation Modal */}
      {showFeaturedModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            backgroundColor: "rgba(0,0,0,0.3)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="p-6 rounded-lg shadow-xl max-w-md w-full border"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
            }}
          >
            <div className="mb-4 flex items-center">
              <FiAlertCircle
                className="mr-3"
                size={24}
                style={{ color: "var(--brand-primary)" }}
              />
              <h3
                className="text-lg font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Confirm Featured Status Change
              </h3>
            </div>

            <p
              className="mb-6 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {selectedProduct?.featured
                ? `Are you sure you want to remove "${selectedProduct?.name}" from featured products?`
                : `Are you sure you want to add "${selectedProduct?.name}" to featured products?`}
            </p>

            <div className="flex justify-end space-x-3">
              {" "}
              <button
                onClick={() => setShowFeaturedModal(false)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 border"
                style={{
                  backgroundColor: "transparent",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-primary)",
                  borderRadius: "var(--rounded-md)",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleToggleFeatured}
                className="px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                  borderRadius: "var(--rounded-md)",
                }}
              >
                {selectedProduct?.featured
                  ? "Remove Featured"
                  : "Make Featured"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTable;
