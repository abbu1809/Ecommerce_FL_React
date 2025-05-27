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
  let { category } = useParams();
  category = category
    ? category.charAt(0).toUpperCase() + category.slice(1).replace(/s$/, "")
    : null;
  const [showFilters, setShowFilters] = useState(false);
  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 150000 });
  const [sortBy, setSortBy] = useState("popularity");

  const { products, brands, loading, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  // Transform products from store to match the expected format
  const transformedProducts = (products || []).map((product) => ({
    ...product,
    discountPrice: product.discount_price || product.price,
    image:
      product.images && product.images.length > 0
        ? product.images[0]
        : "https://via.placeholder.com/300x300?text=No+Image",
  }));

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
    let filteredProducts = [...transformedProducts];

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
