import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiUser,
  FiShoppingBag,
  FiHeart,
  FiMapPin,
  FiCreditCard,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { useUnifiedAuthStoreImproved } from "../../store/unifiedAuthStoreImproved";

const AccountSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useUnifiedAuthStoreImproved();

  const menuItems = [
    {
      id: "profile",
      name: "Profile Information",
      path: "/profile",
      icon: <FiUser className="w-5 h-5" />,
    },
    {
      id: "orders",
      name: "My Orders",
      path: "/orders",
      icon: <FiShoppingBag className="w-5 h-5" />,
    },
    {
      id: "wishlist",
      name: "My Wishlist",
      path: "/wishlist",
      icon: <FiHeart className="w-5 h-5" />,
    },
    {
      id: "addresses",
      name: "My Addresses",
      path: "/profile/addresses",
      icon: <FiMapPin className="w-5 h-5" />,
    },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login"); // Redirect to login page after logout
    // Redirect will be handled by auth state change
  };

  return (
    <div
      className="rounded-lg overflow-hidden shadow-md"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="p-4" style={{ backgroundColor: "var(--brand-primary)" }}>
        <h2
          className="text-lg font-bold"
          style={{ color: "var(--text-on-brand)" }}
        >
          My Account
        </h2>
      </div>

      <div className="p-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${
                  location.pathname === item.path
                    ? "bg-opacity-10 font-medium"
                    : "hover:bg-opacity-5"
                }`}
                style={{
                  backgroundColor:
                    location.pathname === item.path
                      ? "var(--bg-accent-light)"
                      : "transparent",
                  color:
                    location.pathname === item.path
                      ? "var(--brand-primary)"
                      : "var(--text-primary)",
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-left hover:bg-opacity-5"
              style={{
                color: "var(--error-color)",
              }}
            >
              <FiLogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AccountSidebar;
