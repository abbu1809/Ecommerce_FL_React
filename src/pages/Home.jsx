import BannerCarousel from "../components/BannerCarousel";
import CategoryList from "../components/CategoryList";
import FeaturedProductList from "../components/FeaturedProductList";
import HeroBanner from "../components/HeroBanner";
import { useEffect, useState, useCallback } from "react";
import { useProductStore } from "../store/useProduct";
import { useBannerStore } from "../store/Admin/useBannerStore";
import { useInView } from "react-intersection-observer";
import ProductCard from "../components/ProductList/ProductCard";
import { FiArrowDown } from "react-icons/fi";

const Home = () => {
  const { products, featuredProducts, fetchProducts } = useProductStore();
  const { fetchPublicBanners } = useBannerStore();
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const PRODUCTS_PER_PAGE = 8;

  // Reference for infinite scroll trigger
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchPublicBanners(); // Fetch banners for the page
  }, [fetchProducts, fetchPublicBanners]);

  // Load initial products
  useEffect(() => {
    if (products && products.length > 0) {
      setDisplayedProducts(products.slice(0, PRODUCTS_PER_PAGE));
      setHasMore(products.length > PRODUCTS_PER_PAGE);
    }
  }, [products]);

  // Load more products when scroll trigger is in view
  const loadMoreProducts = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate loading delay for better user experience
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = page * PRODUCTS_PER_PAGE;
      const endIndex = startIndex + PRODUCTS_PER_PAGE;

      const newProducts = products.slice(startIndex, endIndex);

      if (newProducts.length > 0) {
        setDisplayedProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(endIndex < products.length);
      } else {
        setHasMore(false);
      }

      setIsLoading(false);
    }, 800);
  }, [page, products, isLoading, hasMore]);

  // Trigger load more when scroll reference is in view
  useEffect(() => {
    if (inView) {
      loadMoreProducts();
    }
  }, [inView, loadMoreProducts]);
  // Mock data for categories - focused on electronics product catalog
  const categories = [
    { id: 1, name: "Smartphones", path: "/category/smartphones" },
    { id: 2, name: "Laptops", path: "/category/laptops" },
    { id: 3, name: "Tablets", path: "/category/tablets" },
    { id: 4, name: "Mobile Accessories", path: "/category/mobile-accessories" },
    { id: 5, name: "Laptop Accessories", path: "/category/laptop-accessories" },
    { id: 6, name: "Audio Devices", path: "/category/audio" },
  ];

  return (
    <div
      style={{ backgroundColor: "var(--bg-secondary)" }}
      className="min-h-screen"
    >
      {" "}
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
        <div className="container mx-auto px-4">
          {" "}
          <h2
            style={{ color: "var(--text-primary)" }}
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            Special Offers
          </h2>
          <BannerCarousel />
        </div>
      </section>
      {/* Our Products Section with Infinite Scroll */}
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
            {displayedProducts.map((product) => (
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

          {/* Loading indicator and scroll trigger */}
          <div className="mt-10 text-center" ref={ref}>
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-3"
                  style={{ borderColor: "var(--brand-primary)" }}
                ></div>
                <p
                  className="text-sm font-medium mt-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Loading more products...
                </p>
              </div>
            )}

            {!isLoading && hasMore && (
              <div className="flex flex-col items-center justify-center py-4">
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-full animate-bounce mb-2"
                  style={{
                    backgroundColor: "var(--bg-accent-light)",
                    color: "var(--brand-primary)",
                  }}
                >
                  <FiArrowDown className="text-lg" />
                </div>
                <p style={{ color: "var(--text-secondary)" }}>
                  Scroll for more products
                </p>
              </div>
            )}

            {!isLoading && !hasMore && products.length > 0 && (
              <div className="py-8">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  You've reached the end of our product catalog
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
