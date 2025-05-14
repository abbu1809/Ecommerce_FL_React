import { create } from "zustand";

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
      // In a real app, this would be an API call
      // For now, we're using mock data
      const mockProducts = [
        {
          id: 1,
          name: "Samsung Galaxy S25 Edge",
          price: 89999,
          discountPrice: 84999,
          discount: "5%",
          rating: 4.5,
          image: "https://via.placeholder.com/300x300?text=Samsung+S25",
          brand: "Samsung",
          category: "Mobiles",
          description:
            "Experience the next generation of Samsung Galaxy with edge display and powerful performance.",
          stock: 10,
          specifications: {
            Display: "6.7-inch Dynamic AMOLED 2X",
            Processor: "Snapdragon 8 Gen 3",
            Camera: "50MP + 12MP + 10MP",
          },
        },
        {
          id: 2,
          name: "Apple iPhone 15 Pro",
          price: 119999,
          discountPrice: 109999,
          discount: "8%",
          rating: 4.8,
          image: "https://via.placeholder.com/300x300?text=iPhone+15+Pro",
          brand: "Apple",
          category: "Mobiles",
          description:
            "The ultimate iPhone with A17 Pro chip, titanium design, and incredible camera system.",
          stock: 5,
          specifications: {
            Display: "6.1-inch Super Retina XDR",
            Processor: "A17 Pro",
            Camera: "48MP + 12MP + 12MP",
          },
        },
        {
          id: 3,
          name: "Xiaomi Redmi Note 13 Pro",
          price: 29999,
          discountPrice: 26999,
          discount: "10%",
          rating: 4.2,
          image: "https://via.placeholder.com/300x300?text=Redmi+Note+13",
          brand: "Xiaomi",
          category: "Mobiles",
          description:
            "Powerful mid-range smartphone with excellent camera and battery life.",
          stock: 15,
          specifications: {
            Display: "6.67-inch AMOLED",
            Processor: "Snapdragon 7s Gen 2",
            Camera: "200MP + 8MP + 2MP",
          },
        },
        {
          id: 4,
          name: "OnePlus 12",
          price: 64999,
          discountPrice: 62999,
          discount: "3%",
          rating: 4.4,
          image: "https://via.placeholder.com/300x300?text=OnePlus+12",
          brand: "OnePlus",
          category: "Mobiles",
          description:
            "Flagship killer with Hasselblad cameras and super fast charging.",
          stock: 8,
          specifications: {
            Display: "6.7-inch AMOLED LTPO",
            Processor: "Snapdragon 8 Gen 3",
            Camera: "50MP + 48MP + 64MP",
          },
        },
        {
          id: 5,
          name: "Google Pixel 9",
          price: 74999,
          discountPrice: 71999,
          discount: "4%",
          rating: 4.6,
          image: "https://via.placeholder.com/300x300?text=Pixel+9",
          brand: "Google",
          category: "Mobiles",
          description:
            "The smartest Pixel yet with advanced AI capabilities and exceptional camera.",
          stock: 6,
          specifications: {
            Display: "6.3-inch OLED",
            Processor: "Tensor G4",
            Camera: "50MP + 12MP",
          },
        },
        {
          id: 6,
          name: "Dell XPS 13",
          price: 129999,
          discountPrice: 124999,
          discount: "4%",
          rating: 4.7,
          image: "https://via.placeholder.com/300x300?text=Dell+XPS",
          brand: "Dell",
          category: "Laptops",
          description:
            "Premium ultrabook with InfinityEdge display and powerful performance.",
          stock: 4,
          specifications: {
            Processor: "Intel Core i7-1365U",
            Memory: "16GB LPDDR5",
            Storage: "512GB SSD",
          },
        },
        {
          id: 7,
          name: "HP Spectre x360",
          price: 134999,
          discountPrice: 129999,
          discount: "4%",
          rating: 4.5,
          image: "https://via.placeholder.com/300x300?text=HP+Spectre",
          brand: "HP",
          category: "Laptops",
          description:
            "Convertible laptop with stunning design and excellent battery life.",
          stock: 3,
          specifications: {
            Processor: "Intel Core i7-1355U",
            Memory: "16GB DDR5",
            Storage: "1TB SSD",
          },
        },
        {
          id: 8,
          name: "MacBook Air M3",
          price: 114999,
          discountPrice: 109999,
          discount: "4%",
          rating: 4.8,
          image: "https://via.placeholder.com/300x300?text=MacBook+Air",
          brand: "Apple",
          category: "Laptops",
          description:
            "Ultra-thin and lightweight with incredible M3 performance and battery life.",
          stock: 7,
          specifications: {
            Processor: "Apple M3",
            Memory: "16GB unified memory",
            Storage: "512GB SSD",
          },
        },
        {
          id: 9,
          name: 'Sony 65" 4K OLED TV',
          price: 249999,
          discountPrice: 229999,
          discount: "8%",
          rating: 4.9,
          image: "https://via.placeholder.com/300x300?text=Sony+OLED",
          brand: "Sony",
          category: "TV & Audio",
          description:
            "Premium OLED TV with incredible contrast and smart features.",
          stock: 2,
          specifications: {
            Display: "65-inch 4K OLED",
            HDR: "Dolby Vision",
            Audio: "3D Surround Upscaling",
          },
        },
        {
          id: 10,
          name: 'Samsung 55" Neo QLED TV',
          price: 179999,
          discountPrice: 159999,
          discount: "11%",
          rating: 4.7,
          image: "https://via.placeholder.com/300x300?text=Samsung+QLED",
          brand: "Samsung",
          category: "TV & Audio",
          description:
            "Stunning Quantum Mini LED display with amazing brightness and color.",
          stock: 5,
          specifications: {
            Display: "55-inch 4K Neo QLED",
            HDR: "HDR10+",
            Audio: "Dolby Atmos",
          },
        },
      ];

      // Extract unique categories and brands
      const categories = Array.from(
        new Set(mockProducts.map((p) => p.category))
      );
      const brands = Array.from(new Set(mockProducts.map((p) => p.brand)));

      // Select featured products (could be based on ratings or other factors)
      const featuredProducts = mockProducts
        .filter((p) => p.rating >= 4.5)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);

      set({
        products: mockProducts,
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
