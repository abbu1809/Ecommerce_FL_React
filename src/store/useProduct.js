import { create } from "zustand";
import { API_URL } from "../utils/constants";
import api from "../services/api";

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  brands: [],
  featuredProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  reviewLoading: false,
  reviewError: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ loading: true });

    try {
      const response = await api.get(`${API_URL}/products/products`);

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
      const response = await api.get(`${API_URL}/products/categories`);
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

  // Fetch single product from API
  fetchProduct: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `${API_URL}/products/products/${productId}/`
      );
      set({
        currentProduct: response.data.product,
        loading: false,
      });
      return response.data.product;
    } catch (error) {
      console.error("Error fetching product:", error);
      set({
        error: "Failed to fetch product. Please try again later.",
        loading: false,
      });
      return null;
    }
  },

  // Clear current product
  clearCurrentProduct: () => {
    set({ currentProduct: null });
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

  // Add review for a product
  addReview: async (productId, reviewData) => {
    set({ reviewLoading: true, reviewError: null });

    try {
      const response = await api.post(
        `/users/add-review/${productId}/`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update current product if it's the same product being reviewed
      const { currentProduct } = get();
      if (currentProduct && currentProduct.id === productId) {
        set({
          currentProduct: {
            ...currentProduct,
            rating: response.data.updated_rating,
            reviews_count: response.data.total_reviews,
          },
        });
      }

      set({ reviewLoading: false });
      return {
        success: true,
        data: response.data,
        message: response.data.message || "Review added successfully",
      };
    } catch (error) {
      console.error("Error adding review:", error);

      let errorMessage = "Failed to add review. Please try again later.";

      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid review data. Please check your input.";
      } else if (error.response?.status === 404) {
        errorMessage = "Product not found.";
      } else if (error.response?.status === 401) {
        errorMessage = "Please log in to add a review.";
      }

      set({
        reviewError: errorMessage,
        reviewLoading: false,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Clear review error
  clearReviewError: () => {
    set({ reviewError: null });
  },
}));
