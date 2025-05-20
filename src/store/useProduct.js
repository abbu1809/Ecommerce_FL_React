import axios from "axios";
import { create } from "zustand";
import { API_URL } from "../utils/constants";

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  brands: [],
  featuredProducts: [],
  loading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true });

    try {
      const response = await axios.get(`${API_URL}/products/products`);

      // Extract unique categories and brands
      const categories = Array.from(
        new Set(response.data.products.map((p) => p.category))
      );
      const brands = Array.from(
        new Set(response.data.products.map((p) => p.brand))
      );

      // Select featured products (could be based on ratings or other factors)
      const featuredProducts = response.data.products
        .filter((p) => p.rating >= 4.5)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      set({
        products: response.data.products,
        categories,
        brands,
        featuredProducts,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({
        error: "Failed to fetch products. Please try again later.",
        loading: false,
      });
    }
  },

  // Fetch product categories
  fetchCategories: async () => {
    set({ loading: true });
    try {
      const response = await axios.get(`${API_URL}/products/categories`);
      set({ categories: response.data.categories, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Get a single product by ID
  getProduct: (id) => {
    const { products } = get();
    return products.find((product) => product.id === parseInt(id, 10));
  },

  // Get products by category
  getProductsByCategory: (category) => {
    const { products } = get();
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  },

  // Get products by brand
  getProductsByBrand: (brand) => {
    const { products } = get();
    return products.filter(
      (product) => product.brand.toLowerCase() === brand.toLowerCase()
    );
  },

  // Search products
  searchProducts: (query) => {
    const { products } = get();
    const searchTerm = query.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  },
}));
