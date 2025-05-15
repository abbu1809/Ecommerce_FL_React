import React, { useState } from "react";
import { FiPlus, FiFilter, FiSearch } from "react-icons/fi";
import ProductTable from "../../components/Admin/Products/ProductTable";
import AddProductForm from "../../components/Admin/Products/AddProductForm";
import ProductCategoryManager from "../../components/Admin/Products/ProductCategoryManager";

const AdminProducts = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Product Management
        </h1>

        <div className="flex mt-4 sm:mt-0 space-x-3">
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <FiPlus className="mr-2" size={16} />
            Add New Product
          </button>
          <button
            onClick={() => setShowCategoryManager(true)}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium border"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <FiFilter className="mr-2" size={16} />
            Categories
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch
                className="h-5 w-5"
                style={{ color: "var(--text-secondary)" }}
              />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border rounded-md text-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-primary)",
                borderRadius: "var(--rounded-md)",
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-md py-2 px-3 text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <option value="all">All Categories</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="tablets">Tablets</option>
            <option value="accessories">Accessories</option>
          </select>

          <select
            className="border rounded-md py-2 px-3 text-sm"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Sort: Price (Low to High)</option>
            <option value="price-desc">Sort: Price (High to Low)</option>
            <option value="name-asc">Sort: Name (A-Z)</option>
            <option value="stock-asc">Sort: Stock (Low to High)</option>
          </select>
        </div>
      </div>

      <ProductTable />

      {/* Modal forms rendered conditionally */}
      {showAddProduct && (
        <AddProductForm onClose={() => setShowAddProduct(false)} />
      )}

      {showCategoryManager && (
        <ProductCategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
    </div>
  );
};

export default AdminProducts;
