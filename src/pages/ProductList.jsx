import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FiSearch, FiSliders, FiX, FiHeart, FiFilter } from "react-icons/fi";
import Button from "../components/UI/Button";
import { ROUTES } from "../utils/constants";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 150000 });
  const [sortBy, setSortBy] = useState("popularity");

  // Mock data
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
    },
  ];

  const brands = Array.from(
    new Set(mockProducts.map((product) => product.brand))
  );
  const categories = Array.from(
    new Set(mockProducts.map((product) => product.category))
  );

  const toggleBrandFilter = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const handlePriceChange = (e, bound) => {
    const value = parseInt(e.target.value);
    setPriceRange({ ...priceRange, [bound]: value });
  };

  const applyFilters = () => {
    let filteredProducts = [...mockProducts];

    // Apply brand filter
    if (selectedBrands.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Apply price range filter
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.discountPrice >= priceRange.min &&
        product.discountPrice <= priceRange.max
    );

    // Apply sorting
    if (sortBy === "price-low") {
      filteredProducts.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sortBy === "price-high") {
      filteredProducts.sort((a, b) => b.discountPrice - a.discountPrice);
    } else if (sortBy === "rating") {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    return filteredProducts;
  };

  // Simulate loading data
  useEffect(() => {
    // In a real application, you would fetch data from an API here
    setTimeout(() => {
      setProducts(mockProducts);
      setLoading(false);
    }, 800);
  }, []);

  const filteredProducts = applyFilters();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          {/* Mobile Filter Button */}
          <div className="w-full md:hidden mb-4">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white border border-gray-300 text-gray-700"
              variant="outline"
            >
              <FiFilter className="mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Filter Sidebar */}
          <div
            className={`
              ${showFilters ? "block" : "hidden md:block"}
              w-full md:w-1/4 bg-white rounded-lg shadow-sm p-4 sticky top-4
            `}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setPriceRange({ min: 0, max: 150000 });
                }}
                className="text-sm text-orange-500 hover:text-orange-600"
              >
                Clear All
              </button>
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <h3 className="text-gray-800 font-medium mb-3">Brand</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`brand-${brand}`}
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrandFilter(brand)}
                      className="h-4 w-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                    />
                    <label
                      htmlFor={`brand-${brand}`}
                      className="ml-2 text-gray-700"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-gray-800 font-medium mb-3">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  ₹{priceRange.min.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600">
                  ₹{priceRange.max.toLocaleString()}
                </span>
              </div>
              <div className="mb-4">
                <input
                  type="range"
                  min="0"
                  max="150000"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange(e, "min")}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div>
                <input
                  type="range"
                  min="0"
                  max="150000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(e, "max")}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="min-price"
                    className="block text-sm text-gray-600"
                  >
                    Min
                  </label>
                  <input
                    type="number"
                    id="min-price"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange(e, "min")}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="max-price"
                    className="block text-sm text-gray-600"
                  >
                    Max
                  </label>
                  <input
                    type="number"
                    id="max-price"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange(e, "max")}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Apply Filters Button (Mobile Only) */}
            <div className="md:hidden">
              <Button
                onClick={() => setShowFilters(false)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Apply Filters
              </Button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="mb-4 md:mb-0">
                  <h1 className="text-xl font-bold text-gray-800">
                    {filteredProducts.length} Products Found
                  </h1>
                </div>
                <div className="flex items-center">
                  <label
                    htmlFor="sort-by"
                    className="text-sm text-gray-600 mr-2 whitespace-nowrap"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sort-by"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden transition-transform hover:transform hover:scale-[1.02]"
                  >
                    <Link
                      to={`/products/${product.id}`}
                      className="block relative"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-contain p-4"
                      />
                      {product.discount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                          {product.discount} OFF
                        </span>
                      )}
                    </Link>
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {product.brand} • {product.category}
                          </p>
                          <h3 className="font-medium text-gray-900 mb-1 truncate">
                            <Link to={`/products/${product.id}`}>
                              {product.name}
                            </Link>
                          </h3>
                          <div className="flex items-center mb-2">
                            <div className="flex items-center text-yellow-500 text-sm">
                              {[...Array(5)].map((_, i) => (
                                <span key={i}>★</span>
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-1">
                              {product.rating}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <p className="font-bold">
                              ₹{product.discountPrice.toLocaleString()}
                            </p>
                            {product.discount && (
                              <p className="text-sm text-gray-500 line-through ml-2">
                                ₹{product.price.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500">
                          <FiHeart className="text-xl" />
                        </button>
                      </div>
                      <div className="mt-4">
                        <Button
                          fullWidth={true}
                          className="bg-orange-500 hover:bg-orange-600"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredProducts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <p className="text-xl font-medium text-gray-800 mb-2">
                  No products found
                </p>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search term
                </p>
                <Button
                  onClick={() => {
                    setSelectedBrands([]);
                    setPriceRange({ min: 0, max: 150000 });
                  }}
                  variant="outline"
                  fullWidth={false}
                  className="mx-auto"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
