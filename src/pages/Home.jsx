import BannerCarousel from "../components/BannerCarousel";
import CategoryList from "../components/CategoryList";
import FeaturedProductList from "../components/FeaturedProductList";
import HeroBanner from "../components/HeroBanner";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/useProduct";
import { useBannerStore } from "../store/Admin/useBannerStore";
import ProductCard from "../components/ProductList/ProductCard";
import Pagination from "../components/common/Pagination";

const Home = () => {
  const { products, featuredProducts, fetchProducts } = useProductStore();
  const { fetchPublicBanners } = useBannerStore();
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 10;
  useEffect(() => {
    // Only fetch if we don't have products already
    if (products.length === 0) {
      fetchProducts();
    }
    fetchPublicBanners(); // Fetch banners for the page
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Pagination calculations
  const totalProducts = products?.length || 0;
  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = products?.slice(startIndex, endIndex) || [];
  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  }; // We don't need mock data anymore as CategoryList will fetch from backend
  // Keeping as fallback in case backend is not available
  const categories = [];

  return (
    <div
      style={{ backgroundColor: "var(--bg-secondary)" }}
      className="min-h-screen"
    >
      {/* Hero Banner */}
      <HeroBanner />
      {/* Categories Section */}
      <section
        style={{ backgroundColor: "var(--bg-primary)" }}
        className="py-12"
      >
        <div className="container mx-auto px-4">
          <CategoryList categories={categories} />
        </div>
      </section>
      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <FeaturedProductList products={featuredProducts} />
        </div>
      </section>
      {/* Promotional Banners */}
      <section
        style={{ backgroundColor: "var(--bg-primary)" }}
        className="py-12"
      >
        <div className="container">
          <h2
            style={{ color: "var(--text-primary)" }}
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            Special Offers
          </h2>
          <BannerCarousel />
        </div>
      </section>
      {/* Our Products Section with Pagination */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Our Products
            </h2>
            <div
              className="h-1 w-24 mx-auto rounded-full"
              style={{
                backgroundColor: "var(--brand-primary)",
              }}
            ></div>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              Explore our complete collection
            </p>
          </div>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  id: product.id || product._id,
                  name:
                    product.name ||
                    `${product.brand} ${product.model || ""}`.trim(),
                  image:
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : product.image ||
                        "https://via.placeholder.com/300x300?text=No+Image",
                  discountPrice:
                    product.discount_price ||
                    product.offer_price ||
                    product.price,
                  price: product.price,
                  discount:
                    product.discount ||
                    (product.price && product.discount_price
                      ? `${Math.round(
                          ((product.price -
                            (product.discount_price || product.offer_price)) /
                            product.price) *
                            100
                        )}%`
                      : null),
                  rating: product.rating || 4.0,
                  reviews: product.reviews || product.reviews_count || 0,
                  brand: product.brand || "Unknown",
                  category: product.category || "General",
                  stock: product.stock || 0,
                }}
              />
            ))}
          </div>
          {/* Pagination */}
          {totalProducts > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalProducts}
              itemsPerPage={PRODUCTS_PER_PAGE}
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
