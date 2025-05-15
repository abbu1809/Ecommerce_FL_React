import React from "react";
import { Link } from "react-router-dom";

const CategoryList = ({ categories }) => {
  return (
    <div className="py-10">
      <h2
        style={{ color: "var(--text-primary)" }}
        className="text-3xl font-bold mb-10 text-center"
      >
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={category.path}
            className="group p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderRadius: "var(--rounded-lg)",
              boxShadow: "var(--shadow-small)",
            }}
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="w-16 h-16 mb-4 rounded-full flex items-center justify-center transition-colors duration-200"
                style={{
                  backgroundColor: "var(--bg-accent-light)",
                  color: "var(--brand-primary)",
                }}
              >
                {/* Category icon container */}
                <svg
                  className="w-8 h-8"
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
              </div>
              <h3
                className="text-lg font-semibold transition-colors duration-200"
                style={{
                  color: "var(--text-primary)",
                }}
              >
                {category.name}
              </h3>
              <span
                className="mt-2 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                style={{
                  color: "var(--brand-primary)",
                }}
              >
                Browse Now
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
