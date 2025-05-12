import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter, FiGrid, FiList, FiChevronDown, FiChevronUp, FiX, FiSliders, FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";

const Products = () => {
  // Sample products data (in a real app, this would come from an API)
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "iPhone 14 Pro",
      price: 999.99,
      description: "Apple's latest flagship with powerful features",
      image: "https://images.unsplash.com/photo-1663761879666-f7c755a6d8ed?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: 2,
      name: "Samsung Galaxy S23",
      price: 899.99,
      description: "Premium Android smartphone with exceptional camera",
      image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: 3,
      name: "Google Pixel 7",
      price: 699.99,
      description: "Pure Android experience with amazing photography",
      image: "https://images.unsplash.com/photo-1667438262689-6828383d9f93?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: 4,
      name: "OnePlus 11",
      price: 799.99,
      description: "Flagship killer with incredible performance",
      image: "https://images.unsplash.com/photo-1680413870561-c6f0afbd8d73?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: 5,
      name: "Xiaomi 13",
      price: 649.99,
      description: "Feature-rich smartphone at a competitive price",
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=300&h=300"
    },
    {
      id: 6,
      name: "Nothing Phone (2)",
      price: 599.99,
      description: "Unique design with innovative Glyph interface",
      image: "https://images.unsplash.com/photo-1687203673140-ea1f9227ee7c?auto=format&fit=crop&w=300&h=300"
    },
  ]);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilters, setActiveFilters] = useState({
    priceRange: [0, 2000],
    categories: [],
    brands: [],
  });
  const [sortOption, setSortOption] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filter categories (example data)
  const categories = ["Smartphones", "Tablets", "Accessories", "Wearables"];
  const brands = ["Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Nothing"];

  // Apply filters and sorting
  useEffect(() => {
    setLoading(true);
    
    // Simulate API loading delay
    const timeoutId = setTimeout(() => {
      // Apply price filter
      let result = products.filter(
        product => 
          product.price >= activeFilters.priceRange[0] && 
          product.price <= activeFilters.priceRange[1]
      );
      
      // Apply category filters if any are selected
      if (activeFilters.categories.length > 0) {
        result = result.filter(product => 
          activeFilters.categories.includes(product.category)
        );
      }
      
      // Apply brand filters if any are selected
      if (activeFilters.brands.length > 0) {
        result = result.filter(product => 
          activeFilters.brands.includes(product.brand)
        );
      }
      
      // Apply sorting
      switch (sortOption) {
        case "priceAsc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "priceDesc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "nameAsc":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "nameDesc":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          // Default 'featured' sorting - using ID as a proxy for featured order
          result.sort((a, b) => a.id - b.id);
      }
      
      setFilteredProducts(result);
      setLoading(false);
      
      // Show toast when filters are applied
      if (
        activeFilters.categories.length > 0 ||
        activeFilters.brands.length > 0 ||
        activeFilters.priceRange[0] > 0 ||
        activeFilters.priceRange[1] < 2000
      ) {
        toast.success("Filters applied successfully!");
      }
    }, 500); // Simulating API delay
    
    return () => clearTimeout(timeoutId);
  }, [products, activeFilters, sortOption]);

  // Initialize filteredProducts on component mount
  useEffect(() => {
    setFilteredProducts(products);
    setTimeout(() => {
      setLoading(false);
      toast("Products loaded! Browse our collection", {
        icon: "🛍️"
      });
    }, 1000);
  }, []);

  const handleCategoryFilter = (category) => {
    setActiveFilters(prev => {
      const newCategories = prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category];
      
      return { ...prev, categories: newCategories };
    });
  };

  const handleBrandFilter = (brand) => {
    setActiveFilters(prev => {
      const newBrands = prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand];
      
      return { ...prev, brands: newBrands };
    });
  };

  const handlePriceChange = (range) => {
    setActiveFilters(prev => ({
      ...prev,
      priceRange: range
    }));
  };

  const clearFilters = () => {
    setActiveFilters({
      priceRange: [0, 2000],
      categories: [],
      brands: [],
    });
    setSortOption("featured");
    toast.success("All filters cleared!");
  };
  
  const handleSortChange = (option) => {
    setSortOption(option);
    toast(`Sorted by ${option.replace(/([A-Z])/g, ' $1').toLowerCase()}`, {
      icon: "↕️",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  };
  
  const filterVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header and controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <motion.h1 
          className="text-3xl font-bold mb-4 md:mb-0"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Our Products
        </motion.h1>
        
        <div className="flex items-center space-x-4">
          {/* Sort dropdown */}
          <div className="relative">
            <motion.select
              whileTap={{ scale: 0.98 }}
              className="bg-white border rounded-md p-2 pr-10 appearance-none cursor-pointer"
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="nameAsc">Name: A-Z</option>
              <option value="nameDesc">Name: Z-A</option>
            </motion.select>
            <FiChevronDown className="absolute top-3 right-3 pointer-events-none" />
          </div>
          
          {/* View mode toggle */}
          <div className="flex border rounded-md overflow-hidden">
            <motion.button
              whileHover={{ backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <FiGrid />
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "#f3f4f6" }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <FiList />
            </motion.button>
          </div>
          
          {/* Filter toggle (visible on mobile) */}
          <motion.button
            whileHover={{ backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden bg-white border rounded-md p-2"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-label="Toggle filters"
          >
            <FiFilter />
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Filters sidebar */}
        <AnimatePresence>
          {(isFilterOpen || window.innerWidth >= 768) && (
            <motion.div
              className="md:w-1/4 bg-white p-4 rounded-lg shadow-md mb-4 md:mb-0 md:mr-4 md:sticky md:top-4 md:self-start"
              variants={filterVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="filters"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filters</h2>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={clearFilters}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    title="Clear filters"
                  >
                    <FiRefreshCw size={18} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="md:hidden text-gray-500 hover:text-gray-700"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    <FiX size={20} />
                  </motion.button>
                </div>
              </div>
              
              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="px-2">
                  <div className="flex justify-between mb-2">
                    <span>${activeFilters.priceRange[0]}</span>
                    <span>${activeFilters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={activeFilters.priceRange[0]}
                    onChange={(e) => handlePriceChange([parseInt(e.target.value), activeFilters.priceRange[1]])}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={activeFilters.priceRange[1]}
                    onChange={(e) => handlePriceChange([activeFilters.priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <motion.div 
                      key={category}
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={activeFilters.categories.includes(category)}
                        onChange={() => handleCategoryFilter(category)}
                        className="mr-2"
                      />
                      <label htmlFor={`category-${category}`}>{category}</label>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Brands */}
              <div>
                <h3 className="font-medium mb-2">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <motion.div 
                      key={brand}
                      className="flex items-center"
                      whileHover={{ x: 5 }}
                    >
                      <input
                        type="checkbox"
                        id={`brand-${brand}`}
                        checked={activeFilters.brands.includes(brand)}
                        onChange={() => handleBrandFilter(brand)}
                        className="mr-2"
                      />
                      <label htmlFor={`brand-${brand}`}>{brand}</label>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="md:w-3/4"
          layout
        >
          {loading ? (
            // Loading state
            <motion.div 
              className="flex justify-center items-center h-64"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            // No results state
            <motion.div 
              className="bg-white rounded-lg shadow p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <FiSliders className="text-4xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to find what you're looking for.</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={clearFilters}
              >
                Clear Filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  : 'space-y-4'
              }
            >
              <AnimatePresence>
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    layout
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Products;
