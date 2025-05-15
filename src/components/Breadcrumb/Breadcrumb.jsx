import React from "react";
import { Link } from "react-router-dom";
import { FiHome, FiChevronRight } from "react-icons/fi";

const Breadcrumb = ({ items }) => {
  return (
    <nav
      className="flex items-center text-sm mb-6 font-medium py-2 px-3 rounded-lg overflow-x-auto no-scrollbar"
      style={{
        backgroundColor: "var(--bg-accent-light)",
        boxShadow: "var(--shadow-small)",
      }}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && (
            <FiHome
              className="mr-1.5"
              size={14}
              style={{ color: "var(--brand-primary)" }}
            />
          )}
          {index > 0 && (
            <FiChevronRight
              className="mx-2"
              size={14}
              style={{ color: "var(--text-secondary)" }}
            />
          )}
          {item.link ? (
            <Link
              to={item.link}
              className="transition-colors duration-200 hover:underline flex items-center"
              style={{
                color: "var(--text-secondary)",
              }}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className="font-semibold flex items-center truncate max-w-[200px]"
              style={{ color: "var(--brand-primary)" }}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
