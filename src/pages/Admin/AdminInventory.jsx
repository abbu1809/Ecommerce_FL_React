import { useState, useEffect } from "react";
import { FiSearch, FiDownload, FiFilter } from "react-icons/fi";
import StockTable from "../../components/Admin/Inventory/StockTable";
import BulkUpdateForm from "../../components/Admin/Inventory/BulkUpdateForm";
import LowStockNotification from "../../components/Admin/Inventory/LowStockNotification";
import Pagination from "../../components/common/Pagination";
import useAdminProducts from "../../store/Admin/useAdminProducts";
import useAdminInventory from "../../store/Admin/useAdminInventory";

const AdminInventory = () => {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { products, fetchProducts } = useAdminProducts();
  const { getLowStockProducts, getInventoryStats } = useAdminInventory();

  // Fetch products on component mount
  useEffect(() => {
    if (products.list.length === 0) {
      fetchProducts();
    }
  }, [fetchProducts, products.list.length]);
  // Get low stock products and inventory stats
  const lowStockProducts = getLowStockProducts();
  const inventoryStats = getInventoryStats();

  // Filter products based on search and filters
  const filteredProducts = products.list.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    let matchesStock = true;
    if (stockFilter === "in-stock") {
      matchesStock = product.stock > 10;
    } else if (stockFilter === "low-stock") {
      matchesStock = product.stock <= 10 && product.stock > 0;
    } else if (stockFilter === "out-of-stock") {
      matchesStock = product.stock === 0;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, stockFilter, searchQuery]);

  // Export to CSV function
  const exportToCSV = () => {
    const headers = [
      "Product Name",
      "Brand",
      "Category",
      "Stock",
      "Price",
      "SKU",
    ];
    const csvData = products.list.map((product) => [
      product.name,
      product.brand,
      product.category,
      product.stock,
      product.price,
      `${product.brand.substring(0, 3).toUpperCase()}-${product.name
        .substring(0, 3)
        .toUpperCase()}-${product.category.substring(0, 2).toUpperCase()}-${
        product.id
      }`,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `inventory_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            onClick={exportToCSV}
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
          </button>{" "}
        </div>
      </div>
      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Total Products
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {inventoryStats.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                In Stock
              </p>
              <p className="text-2xl font-bold" style={{ color: "#16A34A" }}>
                {inventoryStats.inStock}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Low Stock
              </p>
              <p className="text-2xl font-bold" style={{ color: "#D97706" }}>
                {inventoryStats.lowStock}
              </p>
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-primary)",
          }}
        >
          <div className="flex items-center">
            <div className="flex-1">
              <p
                className="text-sm font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Out of Stock
              </p>
              <p className="text-2xl font-bold" style={{ color: "#DC2626" }}>
                {inventoryStats.outOfStock}
              </p>
            </div>
          </div>
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
              <option value="Smartphone">Smartphones</option>
              <option value="Laptop">Laptops</option>
              <option value="Tablet">Tablets</option>
              <option value="Accessory">Accessories</option>
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
      </div>{" "}
      <StockTable
        products={paginatedProducts}
        categoryFilter={categoryFilter}
        stockFilter={stockFilter}
        searchQuery={searchQuery}
      />
      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
};

export default AdminInventory;
