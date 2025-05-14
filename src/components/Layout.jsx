import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiMapPin,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { ROUTES } from "../utils/constants";
import Logo from "../components/UI/Logo";
import { useAuthStore } from "../store/useAuth";

const Layout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

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

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, this would navigate to search results with the query
      console.log(`Searching for: ${searchQuery}`);
      window.location.href = `/products?search=${encodeURIComponent(
        searchQuery
      )}`;
    }
  };

  // Get cart item count - in real app would come from the cart store
  const cartItemCount = 0;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-orange-500 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                className="mr-4 text-2xl md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
              </button>
              <Logo />
            </div>

            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-2xl mx-6">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for Products, Brands, Offers"
                    className="w-full py-2 px-4 pr-10 rounded-full text-gray-800 focus:outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center"
                  >
                    <FiSearch className="text-gray-500 text-xl" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Header Menu */}
            <div className="flex items-center gap-5">
              <div className="hidden md:flex flex-col items-center">
                <FiMapPin className="text-xl" />
                <div className="text-xs">
                  <p className="text-white/80">Delivery to</p>
                  <p className="font-semibold">BHOPAL</p>
                </div>
              </div>

              <Link
                to={ROUTES.WISHLIST}
                className="hidden md:flex flex-col items-center"
              >
                <FiHeart className="text-xl" />
                <p className="text-xs font-semibold">Wishlist</p>
              </Link>

              <Link to={ROUTES.CART} className="flex flex-col items-center">
                <div className="relative">
                  <FiShoppingCart className="text-2xl" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold">Cart</p>
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

        {/* Mobile search - shown only on mobile */}
        <div className="md:hidden px-4 pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for Products, Brands, Offers"
                className="w-full py-2 px-4 pr-10 rounded-full text-gray-800 focus:outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center"
              >
                <FiSearch className="text-gray-500 text-xl" />
              </button>
            </div>
          </form>
        </div>

        {/* Category Navigation */}
        <nav className="bg-white text-gray-800 shadow-md">
          <div className="container mx-auto px-4">
            <ul className="hidden md:flex items-center justify-between overflow-x-auto py-2 no-scrollbar">
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

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
            <div className="h-full w-4/5 max-w-xs bg-white text-gray-800 p-4 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <Logo size="small" />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-600 text-2xl"
                >
                  <FiX />
                </button>
              </div>

              {!isAuthenticated && (
                <div className="mb-6">
                  <Link
                    to={ROUTES.LOGIN}
                    className="block w-full py-2 px-4 mb-2 bg-orange-500 text-white text-center rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to={ROUTES.SIGNUP}
                    className="block w-full py-2 px-4 bg-white border border-orange-500 text-orange-500 text-center rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={category.path}
                        className="block py-2 border-b border-gray-100 hover:text-orange-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      to={ROUTES.HOME}
                      className="block py-2 border-b border-gray-100 hover:text-orange-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.CART}
                      className="block py-2 border-b border-gray-100 hover:text-orange-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Cart
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.WISHLIST}
                      className="block py-2 border-b border-gray-100 hover:text-orange-500"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Wishlist
                    </Link>
                  </li>
                  {isAuthenticated && (
                    <li>
                      <Link
                        to={ROUTES.PROFILE}
                        className="block py-2 border-b border-gray-100 hover:text-orange-500"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        My Account
                      </Link>
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <p className="text-sm text-gray-600">
                  <strong>Need Help?</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Call:{" "}
                  <a href="tel:1800-123-4567" className="text-orange-500">
                    1800-123-4567
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  Email:{" "}
                  <a
                    href="mailto:support@anandmobiles.com"
                    className="text-orange-500"
                  >
                    support@anandmobiles.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

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

export default Layout;
