import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiHeart,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { ROUTES } from "../utils/constants";
import Logo from "./UI/Logo";
import { useAuthStore } from "../store/useAuth";
import { Link } from "react-router-dom";

const Header = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuthStore();
  const [location, setLocation] = useState({
    city: "Bhopal",
    loading: false,
    error: null,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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

              setLocation({
                city: city,
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
              city: "Bhopal",
              loading: false,
              error: error || "Location access denied",
            });
          }
        );
      } else {
        setLocation({
          city: "Bhopal",
          loading: false,
          error: "Geolocation not supported",
        });
      }
    };

    getUserLocation();
  }, []);
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

            {/* Logo with enhanced animation */}
            <Link
              to={ROUTES.HOME}
              className="flex items-center transform hover:scale-105 transition duration-300 ease-in-out"
            >
              <Logo linkWrapper={false} />
            </Link>

            {/* Enhanced Search Bar with animated focus state */}
            <div className="hidden md:block flex-1 max-w-2xl mx-6">
              <div
                className={`relative group ${
                  isSearchFocused ? "ring-4 ring-white/20 rounded-full" : ""
                }`}
              >
                <input
                  type="text"
                  placeholder="Search for Products, Brands, Offers"
                  className="w-full py-3 px-5 pr-12 rounded-full focus:outline-none transition-all duration-300"
                  style={{
                    backgroundColor: isSearchFocused
                      ? "rgba(255, 255, 255, 0.2)"
                      : "rgba(255, 255, 255, 0.15)",
                    color: "var(--text-on-brand)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    boxShadow: isSearchFocused
                      ? "0 0 20px rgba(255, 255, 255, 0.15)"
                      : "var(--shadow-small)",
                    caretColor: "var(--text-on-brand)",
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <button
                  className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
                  style={{
                    color: "var(--text-on-brand)",
                  }}
                  aria-label="Search"
                >
                  <FiSearch className="text-xl filter drop-shadow-lg" />
                </button>
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
                    0
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
                    0
                  </span>
                </div>
                <p
                  className="text-xs font-semibold mt-1"
                  style={{ color: "var(--text-on-brand)" }}
                >
                  ₹ 0
                </p>
              </Link>

              <Link
                to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
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
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "var(--text-on-brand)",
              borderColor: "rgba(255, 255, 255, 0.2)",
              boxShadow: "var(--shadow-small)",
            }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center"
            style={{ color: "var(--text-on-brand)" }}
          >
            <FiSearch className="text-lg" />
          </button>
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
                <Logo size="small" linkWrapper={false} />
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
