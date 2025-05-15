import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMapPin,
  FiHeart,
} from "react-icons/fi";
import { ROUTES } from "../utils/constants";
import Logo from "./UI/Logo";
import { useAuthStore } from "../store/useAuth";
import { Link } from "react-router-dom";

const Header = ({ categories }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAuthenticated } = useAuthStore();
  const [location, setLocation] = useState({
    city: "Bhopal", // Changed from uppercase to normal case
    loading: false,
    error: null,
  });

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
                city: city, // Removed toUpperCase()
                loading: false,
                error: null,
              });
            } catch (error) {
              setLocation({
                city: "Bhopal", // Changed from uppercase to normal case
                loading: false,
                error: error || "Failed to fetch location",
              });
            }
          },
          (error) => {
            setLocation({
              city: "Bhopal", // Changed from uppercase to normal case
              loading: false,
              error: error || "Location access denied",
            });
          }
        );
      } else {
        setLocation({
          city: "Bhopal", // Changed from uppercase to normal case
          loading: false,
          error: "Geolocation not supported",
        });
      }
    };

    getUserLocation();
  }, []);

  return (
    <header
      className="bg-orange-500 shadow-md"
      style={{ backgroundColor: "var(--brand-primary)" }}
    >
      {" "}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <Link to={ROUTES.HOME} className="flex items-center">
            <Logo linkWrapper={false} />
          </Link>{" "}
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search for Products, Brands, Offers"
                className="w-full py-2 px-4 pr-10 rounded-full focus:outline-none border border-transparent focus:border-orange-600 focus:border-opacity-50 transition-all"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  color: "var(--text-primary)",
                  borderColor: "transparent",
                  boxShadow: "var(--shadow-small)",
                  "--tw-ring-color": "var(--brand-primary-hover)",
                }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center hover:text-orange-600 transition-colors"
                style={{ color: "var(--brand-primary-hover)" }}
              >
                <FiSearch className="text-xl" />
              </button>
            </div>
          </div>
          {/* Right Header Menu */}
          <div className="flex items-center gap-4 md:gap-5">
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
              <FiMapPin
                className="text-xl"
                style={{ color: "var(--text-on-brand)" }}
              />
              <div className="text-xs">
                <p
                  className="text-white/80"
                  style={{ color: "var(--text-on-brand-muted)" }}
                >
                  Delivery to
                </p>
                <p
                  className="font-semibold"
                  style={{ color: "var(--text-on-brand)" }}
                >
                  {location.loading
                    ? "Locating..."
                    : location.error
                    ? "Error fetching location"
                    : location.city}
                </p>
              </div>
            </div>

            <Link
              to={ROUTES.WISHLIST}
              className="hidden sm:flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <FiHeart
                  className="text-xl"
                  style={{ color: "var(--text-on-brand)" }}
                />
                <span
                  className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--brand-primary)",
                  }}
                >
                  0
                </span>
              </div>
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--text-on-brand)" }}
              >
                Wishlist
              </p>
            </Link>

            <Link
              to={ROUTES.CART}
              className="flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              <div className="relative">
                <FiShoppingCart
                  className="text-xl"
                  style={{ color: "var(--text-on-brand)" }}
                />
                <span
                  className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: "var(--bg-primary)",
                    color: "var(--brand-primary)",
                  }}
                >
                  0
                </span>
              </div>
              <p
                className="text-xs font-semibold"
                style={{ color: "var(--text-on-brand)" }}
              >
                ₹ 0
              </p>
            </Link>

            <Link
              to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN}
              className="flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              <FiUser
                className="text-xl"
                style={{ color: "var(--text-on-brand)" }}
              />
              <div className="text-xs">
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
      {/* Category Navigation */}
      <nav
        className="bg-white shadow-md"
        style={{ backgroundColor: "var(--bg-primary)" }}
      >
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-between overflow-x-auto py-3 no-scrollbar">
            {categories?.map((category) => (
              <li key={category.id} className="whitespace-nowrap px-3">
                <Link
                  to={category.path}
                  className="text-sm font-medium hover:text-orange-500 transition-colors"
                  style={{
                    color: "var(--text-primary)",
                    "&:hover": { color: "var(--brand-primary)" },
                  }}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
