import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiHeart,
  FiMenu,
  FiX,
  FiCalendar,
} from "react-icons/fi";
import { ROUTES } from "../utils/constants";
import Logo from "./UI/Logo";
import { useAuthStore } from "../store/useAuth";
import { useCartStore } from "../store/useCart";
import { useWishlistStore } from "../store/useWishlist";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProduct";

const Header = ({ categories }) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopSuggestionsRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);
  const { isAuthenticated } = useAuthStore();
  const { itemCount: cartItemCount, totalAmount, fetchCart } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { searchProducts } = useProductStore();
  const [location, setLocation] = useState({
    city: "Bhopal",
    loading: false,
    error: null,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickOutsideDesktop =
        desktopSuggestionsRef.current &&
        !desktopSuggestionsRef.current.contains(event.target);

      const isClickOutsideMobile =
        mobileSuggestionsRef.current &&
        !mobileSuggestionsRef.current.contains(event.target);

      if (isClickOutsideDesktop && isClickOutsideMobile) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update search suggestions when query changes
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const results = searchProducts(searchQuery);
    // Limit to 5 suggestions
    setSearchSuggestions(results.slice(0, 5));
    setShowSuggestions(true);
  }, [searchQuery, searchProducts]);

  // Fetch cart and wishlist data when component mounts or authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist]);
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        setLocation((prev) => ({ ...prev, loading: true }));
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              // Using OpenStreetMap's Nominatim service for reverse geocoding
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
              );
              const data = await response.json();
              const city =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                "Unknown";

              // Ensure city name is in English
              setLocation({
                city: city, // This should already be in English from the OpenStreetMap API
                loading: false,
                error: null,
              });
            } catch (error) {
              setLocation({
                city: "Bhopal",
                loading: false,
                error: error || "Failed to fetch location",
              });
            }
          },
          (error) => {
            setLocation({
              city: "Jabalpur", // Changed default from "Bhopal" to "Jabalpur" to match the image
              loading: false,
              error: error || "Location access denied",
            });
          }
        );
      } else {
        setLocation({
          city: "Jabalpur", // Changed default from "Bhopal" to "Jabalpur" to match the image
          loading: false,
          error: "Geolocation not supported",
        });
      }
    };

    getUserLocation();
  }, []);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Use searchProducts from product store to find matching products
      const searchResults = searchProducts(searchQuery);
      console.log("Search results:", searchResults);
      // Navigate to search results page with query parameter
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      // Clear the suggestions
      setShowSuggestions(false);
    }
  };

  // Handle search in mobile view
  const handleMobileSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const searchResults = searchProducts(searchQuery);
      console.log("Mobile search results:", searchResults);
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  // Handle selecting a product from suggestions
  const handleSelectProduct = (productId) => {
    navigate(`/products/${productId}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  return (
    <header className="relative z-20">
      {/* Top header with elevated design */}
      <div
        className="shadow-xl relative"
        style={{
          backgroundColor: "var(--brand-primary)",
          backgroundImage:
            "linear-gradient(to right, var(--brand-primary), var(--brand-primary-hover))",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <FiX
                  className="w-6 h-6"
                  style={{ color: "var(--text-on-brand)" }}
                />
              ) : (
                <FiMenu
                  className="w-6 h-6"
                  style={{ color: "var(--text-on-brand)" }}
                />
              )}
            </button>
            {/* Logo with enhanced animation */}{" "}
            <Link
              to={ROUTES.HOME}
              className="flex items-center transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <Logo linkWrapper={false} titleColor="white" />
            </Link>
            {/* Enhanced Search Bar with animated focus state */}
            <div className="hidden md:block flex-1 max-w-2xl mx-6">
              <div
                className={`relative group ${
                  isSearchFocused ? "ring-4 ring-white/20 rounded-full" : ""
                }`}
              >
                <form onSubmit={handleSearch} className="w-full">
                  <input
                    type="text"
                    placeholder="Search for Products, Brands, Offers"
                    className="w-full py-3 px-5 pr-12 rounded-full focus:outline-none transition-all duration-300"
                    style={{
                      backgroundColor: isSearchFocused
                        ? "rgba(255, 255, 255, 0.9)"
                        : "rgba(255, 255, 255, 0.8)",
                      color: "#333",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      boxShadow: isSearchFocused
                        ? "0 0 20px rgba(255, 255, 255, 0.3)"
                        : "var(--shadow-small)",
                      caretColor: "#333",
                    }}
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (e.target.value.trim() === "") {
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => {
                      if (
                        searchQuery.trim() !== "" &&
                        searchSuggestions.length > 0
                      ) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
                    style={{
                      color: "#333",
                    }}
                    aria-label="Search"
                  >
                    <FiSearch className="text-xl filter drop-shadow-lg" />
                  </button>
                </form>
                {/* Search suggestions dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div
                    ref={desktopSuggestionsRef}
                    className="absolute left-0 right-0 z-10 mt-1 bg-white rounded-md shadow-lg overflow-hidden"
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                    }}
                  >
                    <ul className="py-1">
                      {searchSuggestions.map((product) => (
                        <li key={product.id}>
                          <div
                            className="px-4 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                            onClick={() => handleSelectProduct(product.id)}
                          >
                            <div className="w-10 h-10 flex-shrink-0 mr-3 bg-gray-200 rounded overflow-hidden">
                              <img
                                src={
                                  product.images && product.images.length > 0
                                    ? product.images[0]
                                    : "https://via.placeholder.com/40"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.brand} • {product.category}
                              </p>
                            </div>
                            <div className="ml-3 text-sm font-medium text-gray-900">
                              ₹{product.discount_price || product.price}
                            </div>
                          </div>
                        </li>
                      ))}
                      <li>
                        <div
                          className="px-4 py-2 text-center text-sm text-brand-primary hover:bg-gray-50 cursor-pointer font-medium"
                          onClick={() => {
                            handleSearch({ preventDefault: () => {} });
                            setShowSuggestions(false);
                          }}
                        >
                          View all results
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            {/* Right Header Menu with enhanced animations */}
            <div className="flex items-center gap-4 md:gap-6">
              <div className="group flex flex-col items-center cursor-pointer transition-all duration-300 hover:translate-y-[-2px] relative">
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-white/10 rounded-full blur-md group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <FiMapPin
                    className="text-xl relative z-10"
                    style={{ color: "var(--text-on-brand)" }}
                  />
                </div>{" "}
                <div className="text-xs mt-1">
                  <p
                    className="text-white/80 text-center"
                    style={{ color: "var(--text-on-brand-muted)" }}
                  >
                    Delivery to
                  </p>
                  <p
                    className="font-semibold"
                    style={{ color: "var(--text-on-brand)" }}
                  >
                    {location.loading ? (
                      <span className="inline-block w-16 h-3 bg-white/20 rounded-full animate-pulse"></span>
                    ) : location.error ? (
                      "Error fetching location"
                    ) : (
                      location.city
                    )}
                  </p>
                </div>
              </div>
              <Link
                to={ROUTES.WISHLIST}
                className="hidden sm:flex flex-col items-center transition-all duration-300 hover:translate-y-[-2px] group"
              >
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-white/10 rounded-full blur-md group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <FiHeart
                    className="text-xl relative z-10"
                    style={{ color: "var(--text-on-brand)" }}
                  />
                  <span
                    className="absolute -top-2 -right-2 z-20 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--brand-primary)",
                      boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                    }}
                  >
                    {wishlistItems.length}
                  </span>
                </div>
                <p
                  className="text-xs font-semibold mt-1"
                  style={{ color: "var(--text-on-brand)" }}
                >
                  Wishlist
                </p>
              </Link>
              <Link
                to={ROUTES.ORDERS}
                className="hidden sm:flex flex-col items-center transition-all duration-300 hover:translate-y-[-2px] group"
              >
                {" "}
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-white/10 rounded-full blur-md group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <FiCalendar
                    className="text-xl relative z-10"
                    style={{ color: "var(--text-on-brand)" }}
                  />
                  {/* Orders don't need a count badge */}
                </div>
                <p
                  className="text-xs font-semibold mt-1"
                  style={{ color: "var(--text-on-brand)" }}
                >
                  Orders
                </p>
              </Link>
              <Link
                to={ROUTES.CART}
                className="flex flex-col items-center transition-all duration-300 hover:translate-y-[-2px] group"
              >
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-white/10 rounded-full blur-md group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <FiShoppingCart
                    className="text-xl relative z-10"
                    style={{ color: "var(--text-on-brand)" }}
                  />
                  <span
                    className="absolute -top-2 -right-2 z-20 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse"
                    style={{
                      backgroundColor: "var(--bg-primary)",
                      color: "var(--brand-primary)",
                      boxShadow: "0 0 10px rgba(255,255,255,0.3)",
                    }}
                  >
                    {cartItemCount}
                  </span>
                </div>
                <p
                  className="text-xs font-semibold mt-1"
                  style={{ color: "var(--text-on-brand)" }}
                >
                  ₹ {totalAmount.toFixed(2)}
                </p>
              </Link>{" "}
              <Link
                to={isAuthenticated ? "/profile" : ROUTES.LOGIN}
                className="flex flex-col items-center transition-all duration-300 hover:translate-y-[-2px] group"
              >
                <div className="relative">
                  <div className="absolute -inset-1.5 bg-white/10 rounded-full blur-md group-hover:bg-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                  <FiUser
                    className="text-xl relative z-10"
                    style={{ color: "var(--text-on-brand)" }}
                  />
                </div>
                <div className="text-xs mt-1">
                  <p
                    className="font-semibold"
                    style={{ color: "var(--text-on-brand)" }}
                  >
                    {isAuthenticated ? "My Account" : "Sign In"}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search bar - only visible on small screens */}
      <div
        className="md:hidden px-4 py-3"
        style={{ backgroundColor: "var(--brand-primary-hover)" }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full py-2 px-4 pr-10 rounded-full text-sm focus:outline-none"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              color: "#333",
              borderColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "var(--shadow-small)",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleMobileSearch} // Handle search on Enter key
            onFocus={() => {
              if (searchQuery.trim() !== "" && searchSuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
          />
          <button
            onClick={() => {
              if (searchQuery.trim()) {
                const searchResults = searchProducts(searchQuery);
                console.log("Mobile search results:", searchResults);
                navigate(
                  `/search?query=${encodeURIComponent(searchQuery.trim())}`
                );
              }
            }}
            className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center"
            style={{ color: "#333" }}
          >
            <FiSearch className="text-lg" />
          </button>

          {/* Mobile search suggestions dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div
              ref={mobileSuggestionsRef}
              className="absolute left-0 right-0 z-50 mt-1 bg-white rounded-md shadow-lg overflow-hidden"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
              }}
            >
              <ul className="py-1">
                {searchSuggestions.map((product) => (
                  <li key={product.id}>
                    <div
                      className="px-3 py-2 hover:bg-gray-100 flex items-center cursor-pointer"
                      onClick={() => handleSelectProduct(product.id)}
                    >
                      <div className="w-8 h-8 flex-shrink-0 mr-2 bg-gray-200 rounded overflow-hidden">
                        <img
                          src={
                            product.images && product.images.length > 0
                              ? product.images[0]
                              : "https://via.placeholder.com/32"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">{product.brand}</p>
                      </div>
                      <div className="ml-2 text-xs font-medium text-gray-900">
                        ₹{product.discount_price || product.price}
                      </div>
                    </div>
                  </li>
                ))}
                <li>
                  <div
                    className="px-3 py-2 text-center text-xs text-brand-primary hover:bg-gray-50 cursor-pointer font-medium"
                    onClick={() => {
                      if (searchQuery.trim()) {
                        navigate(
                          `/search?query=${encodeURIComponent(
                            searchQuery.trim()
                          )}`
                        );
                        setShowSuggestions(false);
                      }
                    }}
                  >
                    View all results
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Category Navigation with floating effect and improved hover states */}
      <nav
        className="bg-white shadow-md relative z-0"
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "var(--shadow-medium)",
        }}
      >
        <div className="container mx-auto px-4">
          <ul className="hidden lg:flex items-center justify-between overflow-x-auto py-3.5 no-scrollbar">
            {categories?.map((category) => (
              <li key={category.id} className="whitespace-nowrap px-3">
                <Link
                  to={category.path}
                  className="text-sm font-medium transition-all duration-300 relative group py-1.5 px-2 hover:text-brand-primary"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  <span className="relative z-10">{category.name}</span>
                  <span
                    className="absolute left-0 right-0 bottom-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  ></span>
                  <span
                    className="absolute inset-0 bg-gray-50 rounded-md scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 -z-10"
                    style={{ backgroundColor: "var(--bg-accent-light)" }}
                  ></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile menu drawer */}
          <div
            className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
              isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              className={`absolute top-0 left-0 h-full w-3/4 max-w-xs bg-white shadow-2xl transition-transform duration-300 transform ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
              style={{ backgroundColor: "var(--bg-primary)" }}
            >
              <div
                className="p-4 border-b"
                style={{ borderColor: "var(--border-primary)" }}
              >
                <Logo
                  size="small"
                  linkWrapper={false}
                  titleColor="var(--text-primary)"
                />
                <button
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <FiX
                    className="w-5 h-5"
                    style={{ color: "var(--text-primary)" }}
                  />
                </button>
              </div>{" "}
              <div className="py-4">
                {/* Account section in mobile menu */}
                {isAuthenticated && (
                  <div className="mb-4">
                    <h3
                      className="px-4 text-xs uppercase font-semibold mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      My Account
                    </h3>
                    <ul>
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile/addresses"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Addresses
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wishlist"
                          className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                          style={{ color: "var(--text-primary)" }}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Wishlist
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}

                <h3
                  className="px-4 text-xs uppercase font-semibold mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Categories
                </h3>
                <ul>
                  {categories?.map((category) => (
                    <li key={category.id}>
                      <Link
                        to={category.path}
                        className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                        style={{ color: "var(--text-primary)" }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
