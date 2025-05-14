import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiMapPin,
} from "react-icons/fi";
import { ROUTES, THEME } from "../utils/constants";
import Logo from "../components/UI/Logo";
import Button from "../components/UI/Button";
import { useAuthStore } from "../store/useAuth";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuthStore();

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
      {/* Header */}
      <header className="bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <Logo />

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for Products, Brands, Offers"
                  className="w-full py-2 px-4 pr-10 rounded-full text-gray-800 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center">
                  <FiSearch className="text-gray-500 text-xl" />
                </button>
              </div>
            </div>

            {/* Right Header Menu */}
            <div className="flex items-center gap-5">
              <div className="flex flex-col items-center">
                <FiMapPin className="text-xl" />
                <div className="text-xs">
                  <p className="text-white/80">Delivery to</p>
                  <p className="font-semibold">BHOPAL</p>
                </div>
              </div>

              <div className="hidden md:flex flex-col items-center">
                <div className="text-xs">
                  <p className="text-white/80">Locate</p>
                  <p className="font-semibold">Stores</p>
                </div>
              </div>

              <Link to={ROUTES.CART} className="flex flex-col items-center">
                <div className="relative">
                  <FiShoppingCart className="text-2xl" />
                  <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    0
                  </span>
                </div>
                <p className="text-xs font-semibold">₹ 0</p>
              </Link>

              <Link
                to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
                className="flex flex-col items-center"
              >
                <FiUser className="text-xl" />
                <div className="text-xs">
                  <p className="font-semibold">
                    {isAuthenticated ? "My Account" : "Sign In"}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <nav className="bg-white text-gray-800 shadow-md">
          <div className="container mx-auto px-4">
            <ul className="flex items-center justify-between overflow-x-auto py-2 no-scrollbar">
              {categories.map((category) => (
                <li key={category.id} className="whitespace-nowrap px-3">
                  <Link
                    to={category.path}
                    className="text-sm font-medium hover:text-orange-500 transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Banner */}
        <section className="relative">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-lg shadow-lg my-4">
              <img
                src={banners[0].image}
                alt={banners[0].title}
                className="w-full h-[400px] object-cover"
                style={{ backgroundColor: banners[0].backgroundColor }}
              />
              <div className="absolute inset-0 flex flex-col justify-center px-12 bg-gradient-to-r from-black/60 to-transparent">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {banners[0].title}
                </h1>
                <p className="text-xl md:text-2xl text-white mb-6">
                  {banners[0].subtitle}
                </p>
                <Button
                  variant="primary"
                  fullWidth={false}
                  className="bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  {banners[0].cta}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:transform hover:scale-[1.02]"
                >
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain"
                    />
                  </Link>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          {product.category}
                        </p>
                        <h3 className="font-medium text-gray-900 mb-1 truncate">
                          <Link to={`/products/${product.id}`}>
                            {product.name}
                          </Link>
                        </h3>
                        <p className="font-bold text-lg">
                          ₹{product.price.toLocaleString()}
                        </p>
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
          </div>
        </section>

        {/* Promotional Banner */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={banners[1].image}
                alt={banners[1].title}
                className="w-full h-64 object-cover"
                style={{ backgroundColor: banners[1].backgroundColor }}
              />
              <div className="absolute inset-0 flex flex-col justify-center px-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {banners[1].title}
                </h2>
                <p className="text-xl text-gray-800 mb-6">
                  {banners[1].subtitle}
                </p>
                <Button
                  variant="primary"
                  fullWidth={false}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {banners[1].cta}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={category.path}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md p-4 text-center transition-all"
                >
                  <div className="h-16 w-16 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-500 text-xl">
                      {category.id}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-800">
                    {category.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-300 text-sm">
                Your trusted electronics partner offering the latest mobiles,
                laptops, and accessories at competitive prices with excellent
                customer service.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/shipping" className="hover:text-white">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link to="/returns" className="hover:text-white">
                    Returns & Refunds
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link to="/products" className="hover:text-white">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link to="/offers" className="hover:text-white">
                    Offers
                  </Link>
                </li>
                <li>
                  <Link to="/stores" className="hover:text-white">
                    Store Locator
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4 mb-4">
                <a
                  href="#"
                  className="bg-white text-gray-800 h-8 w-8 rounded-full flex items-center justify-center"
                >
                  FB
                </a>
                <a
                  href="#"
                  className="bg-white text-gray-800 h-8 w-8 rounded-full flex items-center justify-center"
                >
                  TW
                </a>
                <a
                  href="#"
                  className="bg-white text-gray-800 h-8 w-8 rounded-full flex items-center justify-center"
                >
                  IG
                </a>
                <a
                  href="#"
                  className="bg-white text-gray-800 h-8 w-8 rounded-full flex items-center justify-center"
                >
                  YT
                </a>
              </div>
              <p className="text-sm text-gray-300">
                Subscribe to our newsletter for updates
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-300">
            <p>
              © {new Date().getFullYear()} Anand Mobiles. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
