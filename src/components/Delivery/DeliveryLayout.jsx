import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiTruck,
  FiClock,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import DeliverySidebar from "./DeliverySidebar";
import useDeliveryPartnerStore from "../../store/Delivery/useDeliveryPartnerStore"; // Updated import

const DeliveryLayout = ({ children, hideMenu }) => {
  // We might use location later for active route highlighting
  const [collapsed, setCollapsed] = React.useState(false);
  const { logoutPartner } = useDeliveryPartnerStore(); // Updated to use logoutPartner

  const handleLogout = async () => {
    // Implement your logout logic here
    // e.g., call an API, clear local storage, redirect, etc.
    await logoutPartner(); // Updated to call logoutPartner
    // You might want to redirect to the login page or home page after logout
    // navigate('/login'); // Example using react-router-dom navigate
    console.log("User logged out");
  };

  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden">
      {/* Sidebar */}
      {!hideMenu && (
        <aside
          className={`${
            collapsed ? "w-20" : "w-64"
          } bg-bg-dark text-text-on-dark-bg flex flex-col transition-all duration-300 ease-in-out shadow-lg`}
          style={{
            backgroundColor: "var(--bg-dark)",
            color: "var(--text-on-dark-bg)",
          }}
        >
          {/* Sidebar Header */}
          <div
            className="flex items-center justify-between p-4 border-b border-opacity-20"
            style={{ borderColor: "var(--border-dark)" }}
          >
            <div
              className={`flex items-center ${
                collapsed ? "justify-center w-full" : ""
              }`}
            >
              {!collapsed && (
                <span
                  className="text-xl font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Delivery Partner
                </span>
              )}
              {collapsed && (
                <span
                  className="text-xl font-bold"
                  style={{ color: "var(--brand-primary)" }}
                >
                  DP
                </span>
              )}
            </div>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-full hover:bg-gray-700 hover:bg-opacity-30 focus:outline-none"
            >
              {collapsed ? (
                <FiChevronRight className="h-5 w-5" />
              ) : (
                <FiChevronLeft className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <DeliverySidebar collapsed={collapsed} />

          {/* Logout Button */}
          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full py-3 px-4 rounded-md transition-all duration-200 hover:bg-gray-700 hover:bg-opacity-30 text-left`}
              style={{ color: "var(--text-on-dark-bg)" }}
            >
              <FiLogOut className="h-5 w-5 mr-3" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main
        className={`flex-1 overflow-y-auto p-6 bg-bg-secondary animate-fadeIn ${
          hideMenu ? "flex justify-center items-center" : ""
        }`}
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div
          className="bg-bg-primary p-6 rounded-lg shadow-md mb-6 w-full"
          style={{
            backgroundColor: "var(--bg-primary)",
            boxShadow: "var(--shadow-medium)",
            borderRadius: "var(--rounded-lg)",
          }}
        >
          {children || <Outlet />}{" "}
          {/* Use children if provided, otherwise use Outlet for nested routes */}
        </div>
      </main>
    </div>
  );
};

export default DeliveryLayout;
