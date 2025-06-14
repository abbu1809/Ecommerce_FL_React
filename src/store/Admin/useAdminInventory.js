import { create } from "zustand";
import { useAdminProducts } from "./useAdminProducts";

export const useAdminInventory = create(() => ({
  // Helper function to calculate total stock for a product (considering variants)
  getProductTotalStock: (product) => {
    if (!product) return 0;

    // If product has valid_options (variants), sum up all variant stock
    if (product.valid_options && product.valid_options.length > 0) {
      return product.valid_options.reduce((total, option) => {
        const stock = typeof option.stock === "number" ? option.stock : 0;
        return total + stock;
      }, 0);
    }
    // Fallback to top-level stock
    const stock = product.stock;
    return typeof stock === "number" ? stock : 0;
  },

  // Helper function to get low stock variants for a product
  getLowStockVariants: (product) => {
    if (!product || !product.valid_options) return [];

    return product.valid_options.filter((variant) => {
      const variantStock =
        typeof variant.stock === "number" ? variant.stock : 0;
      return variantStock <= 5 && variantStock > 0;
    });
  },

  // Helper function to get out of stock variants for a product
  getOutOfStockVariants: (product) => {
    if (!product || !product.valid_options) return [];

    return product.valid_options.filter((variant) => {
      const variantStock =
        typeof variant.stock === "number" ? variant.stock : 0;
      return variantStock === 0;
    });
  },

  // Helper function to get stock status details for a product
  getProductStockStatus: (product) => {
    if (!product) return { status: "unknown", details: [] };

    const totalStock = useAdminInventory
      .getState()
      .getProductTotalStock(product);
    const lowStockVariants = useAdminInventory
      .getState()
      .getLowStockVariants(product);
    const outOfStockVariants = useAdminInventory
      .getState()
      .getOutOfStockVariants(product);

    let status = "in-stock";
    const details = [];

    if (totalStock === 0) {
      status = "out-of-stock";
      details.push("All variants out of stock");
    } else if (outOfStockVariants.length > 0) {
      status = "partial-out-of-stock";
      details.push(`${outOfStockVariants.length} variant(s) out of stock`);
    }

    if (totalStock <= 5 && totalStock > 0) {
      status = status === "in-stock" ? "low-stock" : status;
      details.push(`Total stock low (${totalStock} units)`);
    } else if (lowStockVariants.length > 0) {
      status = status === "in-stock" ? "low-stock" : status;
      details.push(`${lowStockVariants.length} variant(s) low on stock`);
    }

    return {
      status,
      details,
      totalStock,
      lowStockVariants,
      outOfStockVariants,
    };
  }, // Inventory filtering and calculations
  getFilteredInventory: (categoryFilter, stockFilter, searchQuery) => {
    const adminProducts = useAdminProducts.getState();
    const allProducts = adminProducts.products.list;
    const inventoryStore = useAdminInventory.getState();

    let filteredProducts = [...allProducts];

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    } // Apply stock filter
    if (stockFilter && stockFilter !== "all") {
      switch (stockFilter) {
        case "in-stock":
          filteredProducts = filteredProducts.filter((product) => {
            const stockStatus = inventoryStore.getProductStockStatus(product);
            return (
              stockStatus.status === "in-stock" && stockStatus.totalStock > 5
            );
          });
          break;
        case "low-stock":
          filteredProducts = filteredProducts.filter((product) => {
            const stockStatus = inventoryStore.getProductStockStatus(product);
            return (
              ["low-stock", "partial-out-of-stock"].includes(
                stockStatus.status
              ) && stockStatus.totalStock > 0
            );
          });
          break;
        case "out-of-stock":
          filteredProducts = filteredProducts.filter((product) => {
            const stockStatus = inventoryStore.getProductStockStatus(product);
            return stockStatus.status === "out-of-stock";
          });
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
  }, // Get low stock products (total stock <= 5 OR any variant stock <= 5)
  getLowStockProducts: () => {
    const adminProducts = useAdminProducts.getState();
    const allProducts = adminProducts.products.list;
    const inventoryStore = useAdminInventory.getState();

    return allProducts.filter((product) => {
      const totalStock = inventoryStore.getProductTotalStock(product);

      // Check if total stock is low (for products without variants or overall low stock)
      if (totalStock <= 5 && totalStock > 0) {
        return true;
      }

      // Check if any individual variant is low on stock (for products with variants)
      if (product.valid_options && product.valid_options.length > 0) {
        return product.valid_options.some((variant) => {
          const variantStock =
            typeof variant.stock === "number" ? variant.stock : 0;
          return variantStock <= 5 && variantStock > 0;
        });
      }

      return false;
    });
  },
  // Get out of stock products (total stock = 0 OR any variant stock = 0)
  getOutOfStockProducts: () => {
    const adminProducts = useAdminProducts.getState();
    const allProducts = adminProducts.products.list;
    const inventoryStore = useAdminInventory.getState();

    return allProducts.filter((product) => {
      const totalStock = inventoryStore.getProductTotalStock(product);

      // Check if total stock is zero (for products without variants or completely out of stock)
      if (totalStock === 0) {
        return true;
      }

      // Check if any individual variant is out of stock (for products with variants)
      if (product.valid_options && product.valid_options.length > 0) {
        return product.valid_options.some((variant) => {
          const variantStock =
            typeof variant.stock === "number" ? variant.stock : 0;
          return variantStock === 0;
        });
      }

      return false;
    });
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
  }, // Get inventory statistics
  getInventoryStats: () => {
    const adminProducts = useAdminProducts.getState();
    const allProducts = adminProducts.products.list;
    const inventoryStore = useAdminInventory.getState();

    const totalProducts = allProducts.length;

    // Count products with adequate stock (no variants low/out AND total stock > 5)
    const inStock = allProducts.filter((product) => {
      const stockStatus = inventoryStore.getProductStockStatus(product);
      return stockStatus.status === "in-stock" && stockStatus.totalStock > 5;
    }).length;

    // Count products with low stock issues (total low OR any variant low/out)
    const lowStock = allProducts.filter((product) => {
      const stockStatus = inventoryStore.getProductStockStatus(product);
      return (
        ["low-stock", "partial-out-of-stock"].includes(stockStatus.status) &&
        stockStatus.totalStock > 0
      );
    }).length;

    // Count products completely out of stock
    const outOfStock = allProducts.filter((product) => {
      const stockStatus = inventoryStore.getProductStockStatus(product);
      return stockStatus.status === "out-of-stock";
    }).length;

    const totalStockValue = allProducts.reduce((total, product) => {
      const totalStock = inventoryStore.getProductTotalStock(product);
      const price = product.price || 0;
      return total + totalStock * parseFloat(price);
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
