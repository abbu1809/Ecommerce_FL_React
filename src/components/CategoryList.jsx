import React from "react";
import { Link } from "react-router-dom";
import { RiSmartphoneLine } from "react-icons/ri";
import { MdLaptopMac } from "react-icons/md";
import { MdTablet } from "react-icons/md";
import { BiHeadphone } from "react-icons/bi";
import { FiPackage } from "react-icons/fi";
import { BsHddStack } from "react-icons/bs";

const CategoryList = ({ categories }) => {
  // Map of category-specific icons
  const categoryIcons = {
    Smartphones: <RiSmartphoneLine className="w-full h-full" />,
    Laptops: <MdLaptopMac className="w-full h-full" />,
    Tablets: <MdTablet className="w-full h-full" />,
    "Mobile Accessories": <FiPackage className="w-full h-full" />,
    "Laptop Accessories": <BsHddStack className="w-full h-full" />,
    "Audio Devices": <BiHeadphone className="w-full h-full" />,
  };

  return (
    <div className="py-14">
      <div className="relative mb-14 flex flex-col items-center">
        <span
          className="text-sm font-medium tracking-wide uppercase mb-2"
          style={{ color: "var(--brand-primary)" }}
        >
          Find What You Need
        </span>
        <h2
          style={{ color: "var(--text-primary)" }}
          className="text-3xl font-bold text-center mb-3 relative z-10"
        >
          Shop by Category
        </h2>
        <div
          className="h-1.5 w-28 rounded-full mb-4"
          style={{
            background:
              "linear-gradient(to right, var(--brand-primary), var(--brand-primary-hover))",
          }}
        />
        <p
          className="text-center max-w-md text-base"
          style={{ color: "var(--text-secondary)" }}
        >
          Discover our wide range of products by browsing through popular
          categories
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5 px-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className="group relative p-5 sm:p-6 flex flex-col items-center justify-center rounded-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-medium)",
              minHeight: "180px",
              border: "1px solid var(--border-primary)",
            }}
          >
            {/* Animated background gradient */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(135deg, var(--bg-accent-light) 0%, rgba(255,255,255,0.9) 100%)",
                borderRadius: "var(--rounded-lg)",
              }}
            />

            {/* Bottom animated border */}
            <div
              className="absolute bottom-0 left-0 right-0 h-1.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
              style={{
                backgroundColor: "var(--brand-primary)",
                transformOrigin: "left",
              }}
            />

            {/* Decorative elements */}
            <div
              className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{ backgroundColor: "var(--brand-primary)" }}
            />

            <div
              className="absolute bottom-0 left-0 w-16 h-16 -ml-8 -mb-8 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-500"
              style={{ backgroundColor: "var(--brand-primary)" }}
            />

            {/* Icon container */}
            <div
              className="w-20 h-20 mb-5 rounded-full flex items-center justify-center transition-all duration-500 relative z-10 group-hover:scale-110 p-5"
              style={{
                backgroundColor: "var(--bg-accent-light)",
                boxShadow: "0 4px 20px rgba(245, 158, 11, 0.15)",
              }}
            >
              <div
                className="w-12 h-12 transform group-hover:rotate-6 transition-transform duration-500"
                style={{ color: "var(--brand-primary)" }}
              >
                {categoryIcons[category.name] || (
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </div>
            </div>

            <h3
              className="text-lg sm:text-xl font-semibold transition-all duration-300 relative z-10 text-center mb-1 group-hover:text-brand-primary"
              style={{
                color: "var(--text-primary)",
              }}
            >
              {category.name}
            </h3>

            <span
              className="text-sm flex items-center gap-1 font-medium relative z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
              style={{
                color: "var(--brand-primary)",
              }}
            >
              <span>Browse Now</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
