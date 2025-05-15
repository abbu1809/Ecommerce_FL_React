import React, { useState } from "react";
import { FiSearch, FiDownload, FiFilter } from "react-icons/fi";
import StockTable from "../../components/Admin/Inventory/StockTable";
import BulkUpdateForm from "../../components/Admin/Inventory/BulkUpdateForm";
import LowStockNotification from "../../components/Admin/Inventory/LowStockNotification";

const AdminInventory = () => {
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock low stock products data
  const lowStockProducts = [
    {
      id: 1,
      name: "Samsung Galaxy Tab S8",
      stock: 0,
      minStock: 5,
    },
    {
      id: 2,
      name: "Apple MacBook Pro M1",
      stock: 3,
      minStock: 5,
    },
    {
      id: 3,
      name: "Dell XPS 13",
      stock: 2,
      minStock: 5,
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h1
            className="text-2xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Inventory Management
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Track, update and manage product stock levels
          </p>
        </div>

        <div className="flex mt-4 sm:mt-0 space-x-3">
          <button
            onClick={() => setShowBulkUpdate(true)}
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium"
            style={{
              backgroundColor: "var(--brand-primary)",
              color: "var(--text-on-brand)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            Bulk Update Stock
          </button>

          <button
            className="flex items-center px-4 py-2 rounded-md text-sm font-medium border"
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
              borderColor: "var(--border-primary)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            <FiDownload className="mr-2" size={16} />
            Export CSV
          </button>
        </div>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="mb-6">
          <LowStockNotification products={lowStockProducts} />
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2">
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div>
          <div className="flex items-center h-full">
            <FiFilter
              className="mr-2"
              style={{ color: "var(--text-secondary)" }}
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full py-2 px-3 border rounded-md text-sm"
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
          </div>
        </div>

        <div>
          <div className="flex items-center h-full">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="block w-full py-2 px-3 border rounded-md text-sm"
              style={{
                backgroundColor: "var(--bg-primary)",
                color: "var(--text-primary)",
                borderColor: "var(--border-primary)",
                borderRadius: "var(--rounded-md)",
              }}
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      <StockTable
        categoryFilter={categoryFilter}
        stockFilter={stockFilter}
        searchQuery={searchQuery}
      />

      {showBulkUpdate && (
        <BulkUpdateForm onClose={() => setShowBulkUpdate(false)} />
      )}
    </div>
  );
};

export default AdminInventory;
