import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import ProductFilter from "../components/ProductList/ProductFilter";
import ProductSorting from "../components/ProductList/ProductSorting";
import ProductGrid from "../components/ProductList/ProductGrid";
import NoResultsFound from "../components/ProductList/NoResultsFound";
import { useProductStore } from "../store/useProduct";

const ProductList = () => {
  const { category } = useParams();
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 150000 });
  const [sortBy, setSortBy] = useState("popularity");

  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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

    // Apply category filter from URL if present
    if (category) {
      // This would use a more sophisticated matching in a real app
      // (e.g. converting URL-friendly format to display format)
      const formattedCategory = category.replace("-", " ");
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.category.toLowerCase() === formattedCategory.toLowerCase()
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
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);
  const filteredProducts = applyFilters();
  // Add resetFilters function
  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 150000 });
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Home", link: ROUTES.HOME },
    {
      label: category
        ? category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")
        : "Products",
    },
  ];

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {category
              ? category.charAt(0).toUpperCase() +
                category.slice(1).replace("-", " ")
              : "All Products"}
          </h1>
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <ProductFilter
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            brands={brands}
            selectedBrands={selectedBrands}
            toggleBrandFilter={toggleBrandFilter}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            handlePriceChange={handlePriceChange}
          />

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            {/* Results Header */}
            <ProductSorting sortBy={sortBy} setSortBy={setSortBy} />

            {/* Products Grid */}
            <ProductGrid products={filteredProducts} loading={loading} />

            {/* No Results */}
            {!loading && filteredProducts.length === 0 && (
              <NoResultsFound resetFilters={resetFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
