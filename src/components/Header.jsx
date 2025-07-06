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
import Logo from "./ui/Logo";
import ThemeToggle from "./ui/ThemeToggle";
import { useAuthStore } from "../store/useAuth";
import { useCartStore } from "../store/useCart";
import { useWishlistStore } from "../store/useWishlist";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/useProduct";
import { useBannerStore } from "../store/Admin/useBannerStore";

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const desktopSuggestionsRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);
  const cartWishlistInitialized = useRef(false);
  const { isAuthenticated } = useAuthStore();
  const { itemCount: cartItemCount, totalAmount, fetchCart } = useCartStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const productsInitialized = useRef(false);
  const { searchProducts, fetchProducts } = useProductStore();
  const { getDropdownBanners } = useBannerStore();
  const [location, setLocation] = useState({
    city: "Bhopal",
    loading: false,
    error: null,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Enhanced mega menu structure based on your product data
  const megaMenuCategories = [
    {
      id: 1,
      name: "Mobiles & Accessories",
      path: "/products/smartphones",
      banners: [
        {
          image: "/mobile1.png",
          title: "Latest iPhones",
          subtitle: "Up to 25% OFF",
          link: "/products/smartphones?brand=Apple"
        },
        {
          image: "/accessories.png",
          title: "Mobile Accessories",
          subtitle: "Starting ₹99",
          link: "/products/accessories"
        }
      ],
      subcategories: [
        {
          title: "Mobiles",
          items: [
            {
              name: "iPhone",
              path: "/products/smartphones?brand=Apple",
              brands: ["Apple"],
            },
            {
              name: "Samsung Galaxy",
              path: "/products/smartphones?brand=Samsung",
              brands: ["Samsung"],
            },
            {
              name: "Xiaomi",
              path: "/products/smartphones?brand=MI",
              brands: ["MI"],
            },
            {
              name: "OnePlus",
              path: "/products/smartphones?brand=Oneplus",
              brands: ["Oneplus"],
            },
            {
              name: "Oppo",
              path: "/products/smartphones?brand=Oppo",
              brands: ["Oppo"],
            },
            {
              name: "Vivo",
              path: "/products/smartphones?brand=Vivo",
              brands: ["Vivo"],
            },
            {
              name: "Nothing",
              path: "/products/smartphones?brand=Nothing",
              brands: ["Nothing"],
            },
            {
              name: "Motorola",
              path: "/products/smartphones?brand=Motorola",
              brands: ["Motorola"],
            },
            {
              name: "Nokia",
              path: "/products/smartphones?brand=Nokia",
              brands: ["Nokia"],
            },
            {
              name: "Lava",
              path: "/products/smartphones?brand=Lava",
              brands: ["Lava"],
            },
            {
              name: "iQOO",
              path: "/products/smartphones?brand=iQOO",
              brands: ["iQOO"],
            },
          ],
        },
        {
          title: "Mobile Accessories",
          items: [
            { name: "Chargers", path: "/products/accessories?type=chargers" },
            {
              name: "Power Banks",
              path: "/products/accessories?type=powerbanks",
            },
            {
              name: "Cases & Covers",
              path: "/products/accessories?type=cases",
            },
            {
              name: "Screen Protectors",
              path: "/products/accessories?type=screen-protectors",
            },
            {
              name: "Mobile Holders",
              path: "/products/accessories?type=holders",
            },
            {
              name: "Cables & Connectors",
              path: "/products/accessories?type=cables",
            },
            {
              name: "Memory Cards",
              path: "/products/accessories?type=memory-cards",
            },
          ],
        },
        {
          title: "Accessories Brands",
          items: [
            { name: "Ambrane", path: "/products/accessories?brand=Ambrane" },
            { name: "HapiPola", path: "/products/accessories?brand=HapiPola" },
            {
              name: "Cool Touch",
              path: "/products/accessories?brand=Cool Touch",
            },
            { name: "Fitfit", path: "/products/accessories?brand=Fitfit" },
            { name: "New Case", path: "/products/accessories?brand=New Case" },
            {
              name: "Smart Touch",
              path: "/products/accessories?brand=Smart Touch",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Computers & Tablets",
      path: "/products/laptops",
      banners: [
        {
          image: "/laptops.png",
          title: "Gaming Laptops",
          subtitle: "Up to 30% OFF",
          link: "/products/laptops?type=gaming"
        },
        {
          image: "/tablets1.png",
          title: "Premium Tablets",
          subtitle: "Starting ₹15,999",
          link: "/products/tablets"
        }
      ],
      subcategories: [
        {
          title: "Laptops",
          items: [
            {
              name: "Samsung Laptops",
              path: "/products/laptops?brand=Samsung",
              brands: ["Samsung"],
            },
            {
              name: "HP Laptops",
              path: "/products/laptops?brand=HP",
              brands: ["HP"],
            },
            { name: "Gaming Laptops", path: "/products/laptops?type=gaming" },
            {
              name: "Business Laptops",
              path: "/products/laptops?type=business",
            },
            { name: "2-in-1 Laptops", path: "/products/laptops?type=2-in-1" },
          ],
        },
        {
          title: "Tablets",
          items: [
            {
              name: "Samsung Galaxy Tab",
              path: "/products/tablets?brand=Samsung",
              brands: ["Samsung"],
            },
            {
              name: "Xiaomi Pad",
              path: "/products/tablets?brand=MI",
              brands: ["MI"],
            },
            {
              name: "OnePlus Pad",
              path: "/products/tablets?brand=Oneplus",
              brands: ["Oneplus"],
            },
            {
              name: "Motorola Tab",
              path: "/products/tablets?brand=Motorola",
              brands: ["Motorola"],
            },
            {
              name: "Redmi Pad",
              path: "/products/tablets?brand=MI",
              brands: ["MI"],
            },
          ],
        },
        {
          title: "Laptop Accessories",
          items: [
            {
              name: "Laptop Bags",
              path: "/products/accessories?type=laptop-bags",
            },
            {
              name: "Laptop Stands",
              path: "/products/accessories?type=laptop-stands",
            },
            {
              name: "Cooling Pads",
              path: "/products/accessories?type=cooling-pads",
            },
            {
              name: "Wireless Mouse",
              path: "/products/accessories?type=mouse",
            },
            { name: "Keyboards", path: "/products/accessories?type=keyboards" },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "TV & Audio",
      path: "/products/televisions",
      banners: [
        {
          image: "/tv1.png",
          title: "Smart TVs",
          subtitle: "Up to 40% OFF",
          link: "/products/televisions"
        },
        {
          image: "/accessories.png",
          title: "Audio Devices",
          subtitle: "Premium Sound",
          link: "/products/audio"
        }
      ],
      subcategories: [
        {
          title: "Smart TVs",
          items: [
            {
              name: "Xiaomi Smart TV",
              path: "/products/televisions?brand=Xiaomi",
              brands: ["Xiaomi"],
            },
            {
              name: "Mi TV",
              path: "/products/televisions?brand=Mi",
              brands: ["Mi"],
            },
            {
              name: "Cellecor TV",
              path: "/products/televisions?brand=Cellecor",
              brands: ["Cellecor"],
            },
            { name: "4K TVs", path: "/products/televisions?resolution=4K" },
            {
              name: "Full HD TVs",
              path: "/products/televisions?resolution=Full HD",
            },
            { name: "Android TVs", path: "/products/televisions?os=Android" },
          ],
        },
        {
          title: "Audio Devices",
          items: [
            {
              name: "Bluetooth Speakers",
              path: "/products/speakers?type=bluetooth",
            },
            {
              name: "Wireless Speakers",
              path: "/products/speakers?type=wireless",
            },
            {
              name: "Portable Speakers",
              path: "/products/speakers?type=portable",
            },
            { name: "Home Audio", path: "/products/speakers?type=home-audio" },
          ],
        },
        {
          title: "Audio Brands",
          items: [
            {
              name: "JBL",
              path: "/products/speakers?brand=JBL",
              brands: ["JBL"],
            },
            {
              name: "boAt",
              path: "/products/speakers?brand=Boat",
              brands: ["Boat"],
            },
            {
              name: "Zebronics",
              path: "/products/speakers?brand=Zebronics",
              brands: ["Zebronics"],
            },
            {
              name: "Digitek",
              path: "/products/speakers?brand=Digiteck",
              brands: ["Digiteck"],
            },
            {
              name: "Edifier",
              path: "/products/speakers?brand=Edifier",
              brands: ["Edifier"],
            },
            {
              name: "Ultra Prolink",
              path: "/products/speakers?brand=Ultra Prolink",
              brands: ["Ultra Prolink"],
            },
          ],
        },
      ],
    },
    {
      id: 4,
      name: "Smart Technology",
      path: "/products/smartwatches",
      banners: [
        {
          image: "/accessories.png",
          title: "Smart Watches",
          subtitle: "Latest Collection",
          link: "/products/smartwatches"
        },
        {
          image: "/mobile1.png",
          title: "Wireless Earbuds",
          subtitle: "Premium Audio",
          link: "/products/earbuds"
        }
      ],
      subcategories: [
        {
          title: "Wearables",
          items: [
            { name: "Smartwatches", path: "/products/smartwatches" },
            { name: "Fitness Bands", path: "/products/fitness-bands" },
            { name: "Wireless Earbuds", path: "/products/earbuds" },
            { name: "Smart Rings", path: "/products/smart-rings" },
          ],
        },
        {
          title: "Smart Home",
          items: [
            { name: "Smart Speakers", path: "/products/smart-speakers" },
            { name: "Smart Lights", path: "/products/smart-lights" },
            { name: "Smart Plugs", path: "/products/smart-plugs" },
            { name: "Security Cameras", path: "/products/security-cameras" },
          ],
        },
      ],
    },
  ];

  // Handle dropdown interactions - Changed from hover to click
  const handleDropdownClick = (categoryId) => {
    if (activeDropdown === categoryId) {
      setActiveDropdown(null); // Close if same dropdown is clicked
    } else {
      setActiveDropdown(categoryId); // Open new dropdown
    }
  };

  // Fetch products to get categories when component mounts
  useEffect(() => {
    if (!productsInitialized.current) {
      productsInitialized.current = true;
      fetchProducts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

      // Close dropdown if clicking outside
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
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
  }, [searchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch cart and wishlist data when component mounts or authentication state changes
  useEffect(() => {
    if (isAuthenticated && !cartWishlistInitialized.current) {
      cartWishlistInitialized.current = true;
      fetchCart();
      fetchWishlist();
    } else if (!isAuthenticated) {
      // Reset the initialization flag when user logs out
      cartWishlistInitialized.current = false;
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps
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
    <header className="sticky top-0 z-50">
      {/* Top header with elevated design */}
      <div
        className="shadow-xl relative"
        style={{
          backgroundColor: "var(--brand-primary)",
          backgroundImage:
            "linear-gradient(to right, var(--brand-primary), var(--brand-primary-hover))",
        }}
      >
        <div className="container mx-auto px-2 sm:px-3">
          <div className="flex items-center justify-between py-4">
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
            {/* Logo with enhanced animation */}
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
                </div>
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
              </Link>
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
              
              {/* Theme Toggle */}
              <div className="flex flex-col items-center justify-center">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile search bar - only visible on small screens */}
      <div
        className="md:hidden px-2 py-3"
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
      {/* Mega Menu Navigation */}
      <nav
        className="bg-white shadow-md relative"
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "var(--shadow-medium)",
          zIndex: 40,
        }}
      >
        <div className="container mx-auto px-2 sm:px-3 relative">
          <ul
            className="hidden lg:flex items-center justify-between py-3.5"
            style={{ overflow: "visible" }}
          >
            {megaMenuCategories?.map((category) => (
              <li
                key={category.id}
                className="whitespace-nowrap px-3 relative dropdown-container"
                style={{ position: "relative" }}
              >
                <button
                  onClick={() => handleDropdownClick(category.id)}
                  className="text-sm font-medium transition-all duration-300 relative group py-1.5 px-2 hover:text-brand-primary flex items-center"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  <span className="relative z-10">{category.name}</span>
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                      activeDropdown === category.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full rounded-full"
                    style={{
                      backgroundColor: "var(--brand-primary)",
                    }}
                  ></span>
                </button>
              </li>
            ))}

            {/* Browse All Categories Link */}
            <li className="whitespace-nowrap px-3">
              <Link
                to="/products"
                className="text-sm font-medium transition-all duration-300 relative group py-1.5 px-2 hover:text-brand-primary"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                <span className="relative z-10">Browse All</span>
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full rounded-full"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                  }}
                ></span>
              </Link>
            </li>
          </ul>
          {/* Shared Mega Dropdown Menu - Always Centered */}
          {activeDropdown && (
            <div
              className="absolute bg-white shadow-2xl border-t-2 dropdown-container"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderTopColor: "var(--brand-primary)",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
                zIndex: 9999,
                top: "100%",
                left: "0",
                right: "0",
                width: "100vw",
                marginLeft: "calc(-50vw + 50%)",
                marginTop: "4px",
              }}
            >
              <div className="px-8 py-8">
                {(() => {
                  const activeCategory = megaMenuCategories.find(
                    (cat) => cat.id === activeDropdown
                  );
                  if (!activeCategory) return null;

                  return (
                    <>
                      <div className="grid grid-cols-4 gap-8 p-8">
                        {/* First 3 columns for subcategories */}
                        {activeCategory.subcategories.slice(0, 3).map(
                          (subcategory, index) => (
                            <div key={index} className="space-y-4">
                              <h3
                                className="font-semibold text-lg pb-2 border-b"
                                style={{
                                  color: "var(--brand-primary)",
                                  borderBottomColor: "var(--border-primary)",
                                }}
                              >
                                {subcategory.title}
                              </h3>
                              <ul className="space-y-2">
                                {subcategory.items.map((item, itemIndex) => (
                                  <li key={itemIndex}>
                                    <Link
                                      to={item.path}
                                      className="text-sm text-gray-600 hover:text-brand-primary transition-colors duration-200 block py-1"
                                      style={{ color: "var(--text-secondary)" }}
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                        
                        {/* 4th column for promotional banners */}
                        <div className="space-y-4">
                          <h3
                            className="font-semibold text-lg pb-2 border-b"
                            style={{
                              color: "var(--brand-primary)",
                              borderBottomColor: "var(--border-primary)",
                            }}
                          >
                            Special Offers
                          </h3>
                          
                          {/* Render category-specific banners */}
                          {(() => {
                            // Get admin-managed banners for this category
                            const adminBanners = getDropdownBanners(activeCategory.name);
                            const banners = adminBanners.length > 0 ? adminBanners : activeCategory.banners;
                            
                            return banners?.map((banner, bannerIndex) => (
                              <Link
                                key={bannerIndex}
                                to={banner.link || banner.buttonLink || activeCategory.path}
                                className="block relative rounded-lg overflow-hidden group cursor-pointer"
                              >
                                <img
                                  src={banner.image || banner.imageUrl}
                                  alt={banner.title}
                                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 text-white">
                                  <p className="text-xs font-medium">{banner.subtitle || banner.description}</p>
                                  <p className="text-sm font-bold">{banner.title}</p>
                                </div>
                              </Link>
                            ));
                          })() || (
                            // Fallback banners if no admin banners and no category banners
                            <>
                              <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                                <img
                                  src="/mobile1.png"
                                  alt="Special Offer"
                                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 text-white">
                                  <p className="text-xs font-medium">Up to 50% OFF</p>
                                  <p className="text-sm font-bold">Best Deals</p>
                                </div>
                              </div>
                              
                              <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                                <img
                                  src="/laptops.png"
                                  alt="Special Offer"
                                  className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 text-white">
                                  <p className="text-xs font-medium">New Arrivals</p>
                                  <p className="text-sm font-bold">Premium Quality</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Featured Products Section */}
                      <div
                        className="border-t p-6"
                        style={{ borderTopColor: "var(--border-primary)" }}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4
                            className="font-semibold text-base"
                            style={{ color: "var(--text-primary)" }}
                          >
                            Featured Products
                          </h4>
                          <Link
                            to={activeCategory.path}
                            className="text-sm font-medium hover:underline"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            View All →
                          </Link>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                          {/* Featured products will be displayed here based on category */}
                          <div className="text-center text-sm text-gray-500">
                            Featured products for {activeCategory.name}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
      </nav>
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
          </div>

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
              {megaMenuCategories?.map((category) => (
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
              <li>
                <Link
                  to="/products"
                  className="block px-4 py-2.5 hover:bg-gray-50 transition-colors font-medium"
                  style={{ color: "var(--brand-primary)" }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Browse All Products
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
