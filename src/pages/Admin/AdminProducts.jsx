import { useState, useEffect } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import ProductTable from "../../components/Admin/Products/ProductTable";
import AddProductForm from "../../components/Admin/Products/AddProductForm";
import ProductCategoryManager from "../../components/Admin/Products/ProductCategoryManager";
import ViewProductModal from "../../components/Admin/Products/ViewProductModal";
import EditProductModal from "../../components/Admin/Products/EditProductModal";
import Pagination from "../../components/common/Pagination";
import useAdminProducts from "../../store/Admin/useAdminProducts";

const AdminProducts = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  // State for product detail and edit modals
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewProduct, setShowViewProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;

  const {
    updateProduct,
    addProduct,
    filterAndSortProducts,
    fetchProducts,
    filteredProducts,
  } = useAdminProducts();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply filters and sorting whenever the filter criteria change
  useEffect(() => {
    filterAndSortProducts(filterCategory, searchQuery, sortOption);
  }, [filterCategory, searchQuery, sortOption, filterAndSortProducts]);

  // Handle sorting change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  // Handle clear filters
  const handleClearFilters = () => {
    setFilterCategory("all");
    setSearchQuery("");
    setSortOption("newest");
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Pagination calculations
  const totalProducts = filteredProducts?.length || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts?.slice(startIndex, endIndex) || [];
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchQuery, sortOption]);

  // Handle view product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewProduct(true);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setShowViewProduct(false);
    setSelectedProduct(product);
    setShowEditProduct(true);
  }; // Handle save product changes
  const handleSaveProduct = async (updatedProduct) => {
    try {
      const productId = selectedProduct.id;

      // Ensure we're not sending undefined or empty values for required fields
      const requiredFields = ["name", "brand", "category", "description"];

      const missingFields = requiredFields.filter(
        (field) => !updatedProduct[field]
      );

      if (missingFields.length > 0) {
        console.error(`Missing required fields: ${missingFields.join(", ")}`);
        // You could add a toast notification here for missing fields
        return;
      }

      const result = await updateProduct(productId, updatedProduct);

      if (result.success) {
        setShowEditProduct(false);
        // You could add a toast notification here for success
        console.log(`Product updated successfully: ${productId}`);
      } else {
        // Show error message but don't close modal so user can fix issues
        console.error(`Failed to update product: ${result.message}`);
        // You could add a toast notification here for the specific error
      }
    } catch (error) {
      console.error("Error in update product handler:", error);
      // You could add a toast notification here for unexpected errors
    }
  };
  // Handle add product
  const handleAddProduct = async (productData) => {
    try {
      // Ensure all required fields are present before submitting
      const requiredFields = [
        "name",
        "brand",
        "category",
        "price",
        "stock",
        "description",
        "images",
      ];
      const missingFields = requiredFields.filter(
        (field) => !productData[field]
      );

      if (missingFields.length > 0) {
        console.error(`Missing required fields: ${missingFields.join(", ")}`);
        // You could add a toast notification here for missing fields
        return;
      }

      const result = await addProduct(productData);

      if (result.success) {
        setShowAddProduct(false);
        // You could add a toast notification here for success
        console.log(`Product added successfully with ID: ${result.product_id}`);
      } else {
        // Show error message but don't close modal so user can fix issues
        console.error(`Failed to add product: ${result.message}`);
        // You could add a toast notification here for the specific error
      }
    } catch (error) {
      console.error("Error in add product handler:", error);
      // You could add a toast notification here for unexpected errors
    }
  };

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <option value="Smartphone">Smartphones</option>
            <option value="Laptop">Laptops</option>
            <option value="Tablet">Tablets</option>
            <option value="Accessory">Accessories</option>
          </select>

          <select
            value={sortOption}
            onChange={handleSortChange}
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

          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-md text-sm font-medium"
            style={{
              backgroundColor: "var(--brand-secondary)",
              color: "var(--text-on-brand)",
              borderRadius: "var(--rounded-md)",
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>{" "}
      <ProductTable
        products={paginatedProducts}
        onViewProduct={handleViewProduct}
        onEditProduct={handleEditProduct}
      />
      {/* Pagination */}
      {totalProducts > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalProducts}
          itemsPerPage={PRODUCTS_PER_PAGE}
        />
      )}
      {/* Modal forms rendered conditionally */}
      {showAddProduct && (
        <AddProductForm
          onClose={() => setShowAddProduct(false)}
          onSave={handleAddProduct}
        />
      )}
      {showCategoryManager && (
        <ProductCategoryManager onClose={() => setShowCategoryManager(false)} />
      )}
      {/* View Product Modal */}
      {showViewProduct && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          onClose={() => setShowViewProduct(false)}
          onEdit={handleEditProduct}
        />
      )}
      {/* Edit Product Modal */}
      {showEditProduct && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setShowEditProduct(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default AdminProducts;
