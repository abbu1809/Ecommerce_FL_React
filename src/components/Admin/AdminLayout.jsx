import { Link, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import useAdminStore from "../../store/Admin/useAdminStore";

const AdminLayout = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { orders, returns, fetchOrders, fetchReturns } = useAdminStore();

  // Fetch orders and returns data on component mount
  useEffect(() => {
    fetchOrders();
    fetchReturns();
  }, [fetchOrders, fetchReturns]);

  // Count pending items for badges
  const pendingOrdersCount =
    orders.list?.filter((order) => order.status === "pending")?.length || 0;
  const pendingReturnsCount =
    returns.list?.filter((ret) => ret.status === "pending")?.length || 0;
  const navLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Inventory",
      path: "/admin/inventory",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
    },
    {
      name: "Returns",
      path: "/admin/returns",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Content",
      path: "/admin/content",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: "Reviews",
      path: "/admin/reviews",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex h-screen bg-bg-secondary overflow-hidden">
      {/* Sidebar */}
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
                Admin Panel
              </span>
            )}
            {collapsed && (
              <span
                className="text-xl font-bold"
                style={{ color: "var(--brand-primary)" }}
              >
                AP
              </span>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-1 rounded-md hover:bg-gray-700 transition-colors duration-150 ${
              collapsed ? "mx-auto mt-2" : ""
            }`}
          >
            {collapsed ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <ul className="px-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className={`flex items-center px-4 py-3 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-opacity-20 font-medium animate-fadeIn"
                        : "hover:bg-gray-700 hover:bg-opacity-30"
                    }`}
                    style={{
                      backgroundColor: isActive
                        ? "var(--brand-primary)"
                        : "transparent",
                      color: isActive
                        ? "var(--text-on-brand)"
                        : "var(--text-on-dark-bg)",
                      boxShadow: isActive ? "var(--shadow-small)" : "none",
                      borderRadius: "var(--rounded-md)",
                    }}
                  >
                    <span className="flex items-center justify-center">
                      {link.icon}
                    </span>
                    {!collapsed && <span className="ml-3">{link.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className="p-4 border-t border-opacity-20"
          style={{ borderColor: "var(--border-dark)" }}
        >
          <Link
            to="/"
            className="flex items-center px-4 py-2 rounded-md hover:bg-gray-700 hover:bg-opacity-30 transition-all duration-150 text-sm"
            style={{ borderRadius: "var(--rounded-md)" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            {!collapsed && <span className="ml-3">Back to Site</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className="flex-1 overflow-y-auto p-6 bg-bg-secondary animate-fadeIn"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <div
          className="bg-bg-primary p-6 rounded-lg shadow-md mb-6"
          style={{
            backgroundColor: "var(--bg-primary)",
            boxShadow: "var(--shadow-medium)",
            borderRadius: "var(--rounded-lg)",
          }}
        >
          <Outlet /> {/* Nested routes will render here */}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
