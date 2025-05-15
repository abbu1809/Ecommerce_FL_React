import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiEye, FiCheck, FiX } from "react-icons/fi";

const ProductTable = () => {
  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "iPhone 13 Pro Max",
      image: "https://via.placeholder.com/50",
      category: "Smartphones",
      price: 129900,
      stock: 24,
      featured: true,
      status: "active",
    },
    {
      id: 2,
      name: "Samsung Galaxy S22 Ultra",
      image: "https://via.placeholder.com/50",
      category: "Smartphones",
      price: 109999,
      stock: 18,
      featured: true,
      status: "active",
    },
    {
      id: 3,
      name: "Apple MacBook Pro M1",
      image: "https://via.placeholder.com/50",
      category: "Laptops",
      price: 122900,
      stock: 9,
      featured: false,
      status: "active",
    },
    {
      id: 4,
      name: "Dell XPS 13",
      image: "https://via.placeholder.com/50",
      category: "Laptops",
      price: 89990,
      stock: 12,
      featured: false,
      status: "active",
    },
    {
      id: 5,
      name: "Samsung Galaxy Tab S8",
      image: "https://via.placeholder.com/50",
      category: "Tablets",
      price: 58990,
      stock: 0,
      featured: false,
      status: "out_of_stock",
    },
    {
      id: 6,
      name: "Apple AirPods Pro",
      image: "https://via.placeholder.com/50",
      category: "Accessories",
      price: 24999,
      stock: 42,
      featured: true,
      status: "active",
    },
    {
      id: 7,
      name: "Logitech MX Master 3",
      image: "https://via.placeholder.com/50",
      category: "Accessories",
      price: 9999,
      stock: 31,
      featured: false,
      status: "active",
    },
  ]);

  // Function to handle delete product (would be API call in real app)
  const handleDeleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  // Function to toggle featured status
  const toggleFeatured = (id) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? { ...product, featured: !product.featured }
          : product
      )
    );
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
          {products.map((product) => (
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
                  ₹{product.price.toLocaleString()}
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
                  onClick={() => toggleFeatured(product.id)}
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
                      product.status === "active"
                        ? "rgba(16, 185, 129, 0.1)"
                        : "rgba(239, 68, 68, 0.1)",
                    color:
                      product.status === "active"
                        ? "var(--success-color)"
                        : "var(--error-color)",
                  }}
                >
                  {product.status === "active" ? "Active" : "Out of Stock"}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    style={{ color: "var(--text-secondary)" }}
                    title="View Product"
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    style={{ color: "var(--brand-primary)" }}
                    title="Edit Product"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    style={{ color: "var(--error-color)" }}
                    title="Delete Product"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className="px-6 py-4 flex items-center justify-between border-t"
        style={{ borderColor: "var(--border-primary)" }}
      >
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Showing {products.length} of {products.length} products
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
      </div>
    </div>
  );
};

export default ProductTable;
