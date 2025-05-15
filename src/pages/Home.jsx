import BannerCarousel from "../components/BannerCarousel";
import CategoryList from "../components/CategoryList";
import FeaturedProductList from "../components/FeaturedProductList";
import HeroBanner from "../components/HeroBanner";
import Header from "../components/Header";

const Home = () => {
  // Mock data for categories
  const categories = [
    { id: 1, name: "Mobiles & Accessories", path: "/category/mobiles" },
    { id: 2, name: "Computers & Tablets", path: "/category/computers" },
    { id: 3, name: "TV & Audio", path: "/category/tv" },
    { id: 4, name: "Kitchen Appliances", path: "/category/kitchen" },
    { id: 5, name: "Home Appliances", path: "/category/home" },
    { id: 6, name: "Smart Technology", path: "/category/smart" },
    { id: 7, name: "Personal & Health Care", path: "/category/health" },
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Banner */}
      <HeroBanner banner={banners[0]} />

      {/* Categories Section */}
      <section className="py-12 bg-white">
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
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <BannerCarousel banners={banners} />
        </div>
      </section>
    </div>
  );
};

export default Home;
