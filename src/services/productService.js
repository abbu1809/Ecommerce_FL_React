import api from './api';
import { API_URL } from '../utils/constants';

// Product API Service
export class ProductService {
  
  // Get all products
  static async getAllProducts() {
    try {
      const response = await api.get('/api/products/');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(productId) {
    try {
      const response = await api.get(`/api/products/${productId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  }

  // Get products by category
  static async getProductsByCategory(category) {
    try {
      const response = await api.get(`/api/products/category/${category}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }

  // Get filter options (brands, categories, price range, etc.)
  static async getFilterOptions(category = '') {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/api/filter-options/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching filter options:', error);
      throw error;
    }
  }

  // Get brands by category
  static async getBrandsByCategory(category) {
    try {
      const response = await api.get('/api/brands-by-category/', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching brands by category:', error);
      throw error;
    }
  }

  // Enhanced search and filter products
  static async searchAndFilterProducts(filters = {}) {
    try {
      const {
        query = '',
        category = '',
        brands = [],
        minPrice = 0,
        maxPrice = 1000000,
        storage = [],
        ram = [],
        colors = [],
        minRating = 0,
        inStockOnly = false,
        //sortBy = 'popularity',
        page = 1,
        limit = 10
      } = filters;

      const params = {
        query,
        category,
        min_price: minPrice,
        max_price: maxPrice,
        min_rating: minRating,
        in_stock_only: inStockOnly,
        page,
        limit
      };

      // Add array parameters
      if (brands.length > 0) {
        brands.forEach((brand, index) => {
          params[`brands[${index}]`] = brand;
        });
      }

      if (storage.length > 0) {
        storage.forEach((item, index) => {
          params[`storage[${index}]`] = item;
        });
      }

      if (ram.length > 0) {
        ram.forEach((item, index) => {
          params[`ram[${index}]`] = item;
        });
      }

      if (colors.length > 0) {
        colors.forEach((color, index) => {
          params[`colors[${index}]`] = color;
        });
      }

      const response = await api.get('/api/enhanced-search/', { params });
      return response.data;
    } catch (error) {
      console.error('Error searching and filtering products:', error);
      throw error;
    }
  }

  // Basic search (legacy support)
  static async searchProducts(query, brand = '', minPrice = 0, maxPrice = 1000000) {
    try {
      const response = await api.get('/api/search/', {
        params: {
          query,
          brand,
          min_price: minPrice,
          max_price: maxPrice
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  // Get categories
  static async getCategories() {
    try {
      const response = await api.get('/api/categories/');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Helper function to build query params for complex filters
  static buildFilterParams(filters) {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item !== null && item !== undefined && item !== '') {
            params.append(`${key}[${index}]`, item);
          }
        });
      } else if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    
    return params;
  }

  // Advanced filter with custom attributes
  static async getProductsWithFilters(filters) {
    try {
      const queryParams = this.buildFilterParams(filters);
      const response = await api.get(`/api/enhanced-search/?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching filtered products:', error);
      throw error;
    }
  }
}

export default ProductService;
