import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiList,
  FiClipboard,
  FiClock,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const DeliverySidebar = ({ collapsed }) => {
  const location = useLocation();

  // Define navigation links
  const navLinks = [
    {
      name: "Dashboard",
      path: "/delivery/dashboard",
      icon: <FiHome className="h-5 w-5" />,
    },
    {
      name: "Assignments",
      path: "/delivery/assignments",
      icon: <FiPackage className="h-5 w-5" />,
    },
    {
      name: "Status Updates",
      path: "/delivery/status-update",
      icon: <FiList className="h-5 w-5" />,
    },
    {
      name: "Delivery History",
      path: "/delivery/history",
      icon: <FiClock className="h-5 w-5" />,
    },
    {
      name: "Settings",
      path: "/delivery/settings",
      icon: <FiSettings className="h-5 w-5" />,
    },
  ];

  return (
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
                }}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {!collapsed && <span className="ml-3">{link.name}</span>}
                {!collapsed && isActive && (
                  <span className="ml-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 animate-pulse"
                      style={{ color: "var(--text-on-brand)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DeliverySidebar;
