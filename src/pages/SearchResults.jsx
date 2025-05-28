import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import ProductFilter from "../components/ProductList/ProductFilter";
import ProductSorting from "../components/ProductList/ProductSorting";
import ProductGrid from "../components/ProductList/ProductGrid";
import NoResultsFound from "../components/ProductList/NoResultsFound";
import { useProductStore } from "../store/useProduct";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 150000 });
  const [sortBy, setSortBy] = useState("popularity");

  const { brands, loading, searchProducts } = useProductStore();

  // Transform products from store to match the expected format
  const transformedProducts = searchProducts(query).map((product) => ({
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
      filteredProducts.sort((a, b) => {
        const ratingA =
          a.rating !== undefined && a.rating !== null ? a.rating : 0;
        const ratingB =
          b.rating !== undefined && b.rating !== null ? b.rating : 0;
        return ratingB - ratingA;
      });
    }

    return filteredProducts;
  };

  const filteredProducts = applyFilters();

  const resetFilters = () => {
    setSelectedBrands([]);
    setPriceRange({ min: 0, max: 150000 });
    setSortBy("popularity");
  };
  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: "Home", link: ROUTES.HOME },
    { label: `Search Results: "${query}"` },
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
            Search Results for "{query}"
          </h1>
          <Breadcrumb items={breadcrumbItems} />
          <p className="text-gray-600 mt-2">
            {filteredProducts.length} results found
          </p>
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
            setSelectedBrands={setSelectedBrands}
          />

          {/* Product Grid */}
          <div className="w-full md:w-3/4">
            {/* Results Header */}
            <ProductSorting sortBy={sortBy} setSortBy={setSortBy} />

            {/* Products Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="spinner"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <NoResultsFound searchQuery={query} resetFilters={resetFilters} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
