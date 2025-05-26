import { create } from "zustand";
import { useAdminProducts } from "./useAdminProducts";

export const useAdminInventory = create(() => ({
  // Inventory filtering and calculations
  getFilteredInventory: (categoryFilter, stockFilter, searchQuery) => {
    const adminProducts = useAdminProducts.getState();
    const allProducts = adminProducts.products.list;

    let filteredProducts = [...allProducts];

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    // Apply stock filter
    if (stockFilter && stockFilter !== "all") {
      switch (stockFilter) {
        case "in-stock":
          filteredProducts = filteredProducts.filter(
            (product) => product.stock > 5
          );
          break;
        case "low-stock":
          filteredProducts = filteredProducts.filter(
            (product) => product.stock <= 5 && product.stock > 0
          );
          break;
        case "out-of-stock":
          filteredProducts = filteredProducts.filter(
            (product) => product.stock === 0
          );
          break;
        default:
          break;
      }
    }

    // Apply search filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }

    return filteredProducts;
  },

  // Get low stock products (stock <= 5)
  getLowStockProducts: () => {
    const adminProducts = useAdminProducts.getState();
    const allProducts = adminProducts.products.list;

    return allProducts.filter((product) => product.stock <= 5);
  },

  // Get out of stock products
  getOutOfStockProducts: () => {
    const adminProducts = useAdminProducts.getState();
    const allProducts = adminProducts.products.list;

    return allProducts.filter((product) => product.stock === 0);
  },

  // Update stock for a single product
  updateProductStock: async (productId, newStock) => {
    const adminProducts = useAdminProducts.getState();

    try {
      const result = await adminProducts.updateProduct(productId, {
        stock: newStock,
      });
      return result;
    } catch (error) {
      console.error("Error updating product stock:", error);
      return { success: false, message: "Failed to update stock" };
    }
  },

  // Bulk update stock for multiple products
  bulkUpdateStock: async (updates) => {
    const adminProducts = useAdminProducts.getState();
    const results = [];

    for (const update of updates) {
      try {
        const result = await adminProducts.updateProduct(update.productId, {
          stock: update.newStock,
        });
        results.push({
          ...update,
          success: result.success,
          message: result.message,
        });
      } catch {
        results.push({
          ...update,
          success: false,
          message: "Failed to update stock",
        });
      }
    }

    return results;
  },

  // Get inventory statistics
  getInventoryStats: () => {
    const adminProducts = useAdminProducts.getState();
    const allProducts = adminProducts.products.list;

    const totalProducts = allProducts.length;
    const inStock = allProducts.filter((product) => product.stock > 5).length;
    const lowStock = allProducts.filter(
      (product) => product.stock <= 5 && product.stock > 0
    ).length;
    const outOfStock = allProducts.filter(
      (product) => product.stock === 0
    ).length;
    const totalStockValue = allProducts.reduce((total, product) => {
      return total + product.stock * parseFloat(product.price || 0);
    }, 0);

    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalStockValue,
    };
  },

  // Generate SKU for a product if it doesn't exist
  generateSKU: (product) => {
    if (product.sku) return product.sku;

    const brandCode = product.brand.substring(0, 3).toUpperCase();
    const nameCode = product.name.substring(0, 3).toUpperCase();
    const categoryCode = product.category.substring(0, 2).toUpperCase();

    return `${brandCode}-${nameCode}-${categoryCode}-${product.id}`;
  },
}));

export default useAdminInventory;
