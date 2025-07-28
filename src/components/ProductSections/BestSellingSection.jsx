import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import ProductCard from '../ProductList/ProductCard';

const BestSellingSection = ({ products, title = "Best Selling Smartphones", description = "Discover our top-selling devices" }) => {
  const carousel = useRef();

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

  // Sample data if no products provided
 /* const sampleProducts = [
    {
      id: 1,
      name: "Apple iPhone 15 Pro Max",
      image: "/mobile1.png",
      discountPrice: 134999,
      price: 159999,
      discount: "16%",
      rating: 4.8,
      reviews: 1234,
      brand: "Apple",
      category: "Smartphones"
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 Ultra",
      image: "/mobile1.png",
      discountPrice: 124999,
      price: 139999,
      discount: "11%",
      rating: 4.7,
      reviews: 892,
      brand: "Samsung",
      category: "Smartphones"
    },
    {
      id: 3,
      name: "Google Pixel 8 Pro",
      image: "/mobile1.png",
      discountPrice: 84999,
      price: 99999,
      discount: "15%",
      rating: 4.6,
      reviews: 567,
      brand: "Google",
      category: "Smartphones"
    },
    {
      id: 4,
      name: "OnePlus 12",
      image: "/mobile1.png",
      discountPrice: 64999,
      price: 69999,
      discount: "7%",
      rating: 4.5,
      reviews: 423,
      brand: "OnePlus",
      category: "Smartphones"
    },
    {
      id: 5,
      name: "Xiaomi 14 Ultra",
      image: "/mobile1.png",
      discountPrice: 89999,
      price: 99999,
      discount: "10%",
      rating: 4.4,
      reviews: 345,
      brand: "Xiaomi",
      category: "Smartphones"
    },
    {
      id: 6,
      name: "Nothing Phone (2a)",
      image: "/mobile1.png",
      discountPrice: 23999,
      price: 25999,
      discount: "8%",
      rating: 4.3,
      reviews: 289,
      brand: "Nothing",
      category: "Smartphones"
    }
  ]; */

  const displayProducts = products && products.length > 0 ? products : [];

  // If no products to display, show a message instead of hardcoded data
  if (displayProducts.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2
                className="text-3xl font-bold mb-3"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h2>
              <div
                className="h-1 w-24 rounded-full mb-2"
                style={{ backgroundColor: "var(--brand-primary)" }}
              ></div>
              <p
                className="text-lg"
                style={{ color: "var(--text-secondary)" }}
              >
                {description}
              </p>
            </div>
          </div>
          <div className="text-center py-12">
            <p style={{ color: "var(--text-secondary)" }}>
              No best selling products available at the moment. Please check back later!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2
              className="text-3xl font-bold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h2>
            <div
              className="h-1 w-24 rounded-full mb-2"
              style={{ backgroundColor: "var(--brand-primary)" }}
            ></div>
            <p
              className="text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              {description}
            </p>
          </div>
          <Link
            to="/category/smartphones"
            className="text-lg font-semibold hover:underline transition-all duration-300"
            style={{ color: "var(--brand-primary)" }}
          >
            View All →
          </Link>
        </div>

        {/* Product Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transform: "translateY(-50%) translateX(-20px)",
            }}
            aria-label="Scroll left"
            type="button"
          >
            <MdKeyboardArrowLeft
              className="w-7 h-7"
              style={{ color: "var(--brand-primary)" }}
            />
          </button>
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors focus:outline-none"
            style={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              transform: "translateY(-50%) translateX(20px)",
            }}
            aria-label="Scroll right"
            type="button"
          >
            <MdKeyboardArrowRight
              className="w-7 h-7"
              style={{ color: "var(--brand-primary)" }}
            />
          </button>

          {/* Carousel container */}
          <div
            ref={carousel}
            className="overflow-x-auto scrollbar-hide"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="flex gap-6 py-4 px-4">
              {displayProducts.map((product, index) => (
                <div key={product.id || index} className="flex-shrink-0" style={{ width: "280px" }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellingSection;
