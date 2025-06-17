import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { RiSmartphoneLine, RiArrowRightSLine } from "react-icons/ri";
import {
  MdLaptopMac,
  MdTablet,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import { BiHeadphone } from "react-icons/bi";
import { FiPackage } from "react-icons/fi";
import { BsHddStack } from "react-icons/bs";
import useCategory from "../store/useCategory";

// Custom CSS for scrollbar hiding
const scrollbarHideStyles = {
  scrollbarWidth: "none", // Firefox
  msOverflowStyle: "none", // IE/Edge
};

const CategoryList = () => {
  const { categories, fetchCategories } = useCategory();
  const [displayCategories, setDisplayCategories] = useState([]);

  const carousel = useRef();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  useEffect(() => {
    // Use backend categories or prop categories and sort them by order
    if (categories && categories.length > 0) {
      const sortedCategories = [...categories].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      setDisplayCategories(sortedCategories);
    } else if (categories.list && categories.list.length > 0) {
      const sortedCategories = [...categories.list].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      );
      setDisplayCategories(sortedCategories);
    }
  }, [categories.list, categories]);

  // Fallback icons if images fail to load
  const categoryIcons = {
    Smartphones: <RiSmartphoneLine className="w-full h-full" />,
    Laptops: <MdLaptopMac className="w-full h-full" />,
    Tablets: <MdTablet className="w-full h-full" />,
    "Mobile Accessories": <FiPackage className="w-full h-full" />,
    "Laptop Accessories": <BsHddStack className="w-full h-full" />,
    "Audio Devices": <BiHeadphone className="w-full h-full" />,
  }; // Handlers for slider controls
  const scrollLeft = (e) => {
    e.preventDefault();
    if (carousel.current) {
      carousel.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (e) => {
    e.preventDefault();
    if (carousel.current) {
      carousel.current.scrollBy({ left: 300, behavior: "smooth" });
    }
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
      {/* Slider container with navigation */}
      <div
        className="relative px-2"
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") scrollLeft(e);
          if (e.key === "ArrowRight") scrollRight(e);
        }}
      >
        {/* Navigation buttons */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
          style={{
            boxShadow: "var(--shadow-medium)",
            transform: "translateY(-50%) translateX(-5px)",
            cursor: "pointer",
          }}
          aria-label="Scroll left"
          type="button"
        >
          <MdKeyboardArrowLeft
            className="w-6 h-6"
            style={{ color: "var(--brand-primary)" }}
          />
        </button>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
          style={{
            boxShadow: "var(--shadow-medium)",
            transform: "translateY(-50%) translateX(5px)",
            cursor: "pointer",
          }}
          aria-label="Scroll right"
          type="button"
        >
          <MdKeyboardArrowRight
            className="w-6 h-6"
            style={{ color: "var(--brand-primary)" }}
          />
        </button>
        {/* Carousel container */}
        <div
          ref={carousel}
          className="overflow-x-auto relative z-10 scrollbar-hide"
          style={scrollbarHideStyles}
          tabIndex="0"
        >
          <div className="flex gap-6 py-4 px-8">
            {/* Display loading state */}
            {categories.loading && (
              <div className="flex justify-center w-full py-8">
                <div
                  className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2"
                  style={{ borderColor: "var(--brand-primary)" }}
                ></div>
              </div>
            )}

            {/* Display error state */}
            {categories.error && (
              <div className="flex justify-center w-full py-8 text-red-500">
                Error loading categories: {categories.error}
              </div>
            )}

            {/* Display categories */}
            {displayCategories.map((category) => (
              <Link
                key={category.id}
                to={`${category.redirect_url}`}
                className="flex-shrink-0 flex flex-col items-center transition-transform duration-300 hover:-translate-y-1"
                style={{
                  width: "280px",
                }}
              >
                {/* Image container */}
                <div
                  className="flex items-center justify-center mb-3 relative overflow-hidden transition-all duration-300 hover:shadow-lg"
                  style={{
                    width: "110px",
                    height: "110px",
                    borderRadius: "8px",
                    padding: "5px",
                    backgroundColor: "transparent",
                  }}
                >
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      className="w-full h-full object-contain transition-transform duration-300 hover:scale-110"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        backgroundColor: "transparent",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = "none";
                        if (e.target.nextSibling) {
                          e.target.nextSibling.style.display = "block";
                        }
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      {categoryIcons[category.name] || (
                        <RiArrowRightSLine className="w-14 h-14" />
                      )}
                    </div>
                  )}
                </div>
                {/* Category name */}
                <h3
                  className="text-sm font-medium text-center transition-colors duration-300 hover:text-brand-primary"
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
