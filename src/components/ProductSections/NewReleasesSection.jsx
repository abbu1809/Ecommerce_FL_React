import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import ProductCard from '../ProductList/ProductCard';

const NewReleasesSection = ({ products, title = "New Releases", description = "Latest products just arrived" }) => {
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
  const sampleProducts = [
    {
      id: 1,
      name: "Samsung Galaxy Z Flip6",
      image: "/mobile1.png",
      discountPrice: 112999,
      price: 119999,
      discount: "6%",
      rating: 4.9,
      reviews: 156,
      brand: "Samsung",
      category: "Smartphones",
      isNew: true
    },
    {
      id: 2,
      name: "iPhone 16 Pro",
      image: "/mobile1.png",
      discountPrice: 119900,
      price: 119900,
      discount: null,
      rating: 5.0,
      reviews: 89,
      brand: "Apple",
      category: "Smartphones",
      isNew: true
    },
    {
      id: 3,
      name: "Pixel 9 Pro XL",
      image: "/mobile1.png",
      discountPrice: 124999,
      price: 129999,
      discount: "4%",
      rating: 4.8,
      reviews: 67,
      brand: "Google",
      category: "Smartphones",
      isNew: true
    },
    {
      id: 4,
      name: "OnePlus 13",
      image: "/mobile1.png",
      discountPrice: 69999,
      price: 74999,
      discount: "7%",
      rating: 4.7,
      reviews: 234,
      brand: "OnePlus",
      category: "Smartphones",
      isNew: true
    },
    {
      id: 5,
      name: "Xiaomi 15 Pro",
      image: "/mobile1.png",
      discountPrice: 79999,
      price: 84999,
      discount: "6%",
      rating: 4.6,
      reviews: 123,
      brand: "Xiaomi",
      category: "Smartphones",
      isNew: true
    },
    {
      id: 6,
      name: "Vivo X200 Pro",
      image: "/mobile1.png",
      discountPrice: 84999,
      price: 89999,
      discount: "6%",
      rating: 4.5,
      reviews: 98,
      brand: "Vivo",
      category: "Smartphones",
      isNew: true
    }
  ];

  const displayProducts = products && products.length > 0 ? products : sampleProducts;

  return (
    <section className="py-12" style={{ backgroundColor: "var(--bg-primary)" }}>
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
            to="/products"
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

export default NewReleasesSection;
