import BannerCarousel from "../components/BannerCarousel";
import CategoryList from "../components/CategoryList";
import FeaturedProductList from "../components/FeaturedProductList";
import HeroBanner from "../components/HeroBanner";
import { useEffect } from "react";
import { useProductStore } from "../store/useProduct";

const Home = () => {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Mock data for categories - focused on electronics product catalog
  const categories = [
    { id: 1, name: "Smartphones", path: "/category/smartphones" },
    { id: 2, name: "Laptops", path: "/category/laptops" },
    { id: 3, name: "Tablets", path: "/category/tablets" },
    { id: 4, name: "Mobile Accessories", path: "/category/mobile-accessories" },
    { id: 5, name: "Laptop Accessories", path: "/category/laptop-accessories" },
    { id: 6, name: "Audio Devices", path: "/category/audio" },
  ];

  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Samsung Galaxy S25 Edge",
      price: 89999,
      image: "https://via.placeholder.com/300x300?text=Samsung+S25",
      category: "Mobiles",
    },
    {
      id: 2,
      name: "Apple iPhone 15 Pro",
      price: 119999,
      image: "https://via.placeholder.com/300x300?text=iPhone+15+Pro",
      category: "Mobiles",
    },
    {
      id: 3,
      name: "Dell XPS 13",
      price: 129999,
      image: "https://via.placeholder.com/300x300?text=Dell+XPS",
      category: "Laptops",
    },
    {
      id: 4,
      name: 'Sony 55" 4K Smart TV',
      price: 69999,
      image: "https://via.placeholder.com/300x300?text=Sony+TV",
      category: "TV",
    },
  ];

  // Mock promotional banners
  const banners = [
    {
      id: 1,
      title: "Samsung Galaxy S25 Edge",
      subtitle: "Beyond slim",
      cta: "Pre-Order now",
      image: "https://via.placeholder.com/1200x400?text=Samsung+S25+Banner",
      backgroundColor: "#1e5799",
    },
    {
      id: 2,
      title: "Summer Deals",
      subtitle: "Easy Exchange EMI Offer",
      cta: "Shop Now",
      image: "https://via.placeholder.com/1200x400?text=Summer+Deals",
      backgroundColor: "#ffd700",
    },
  ];
  return (
    <div
      style={{ backgroundColor: "var(--bg-secondary)" }}
      className="min-h-screen"
    >
      {/* Hero Banner */}
      <HeroBanner banner={banners[0]} />

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
          <h2
            style={{ color: "var(--text-primary)" }}
            className="text-2xl md:text-3xl font-bold mb-6"
          >
            Special Offers
          </h2>
          <BannerCarousel banners={banners} />
        </div>
      </section>

      {/* Fetched Products Section - Example of rendering fetched products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border p-4 rounded-lg">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-700 mb-2">{product.category}</p>
                <p className="text-xl font-bold text-primary">
                  ${product.price / 100}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
