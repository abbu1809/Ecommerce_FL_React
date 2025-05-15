import React, { useState, useEffect } from "react";
import Button from "./UI/Button";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // Add this import

const BannerCarousel = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) =>
        current === banners.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((current) =>
      current === banners.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((current) =>
      current === 0 ? banners.length - 1 : current - 1
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded-lg shadow-md"
      style={{ boxShadow: "var(--shadow-medium)" }}
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${banners.length * 100}%`,
        }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative w-full"
            style={{ flex: `0 0 ${100 / banners.length}%` }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-[400px] object-cover"
              style={{ backgroundColor: banner.backgroundColor }}
            />
            <div
              className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 bg-gradient-to-r from-black/70 to-transparent"
              style={{
                background:
                  "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
              }}
            >
              <div className="max-w-lg">
                <h2
                  className="text-3xl md:text-5xl font-bold mb-2"
                  style={{ color: "var(--text-on-brand)" }}
                >
                  {banner.title}
                </h2>
                <p
                  className="text-lg md:text-2xl mb-8"
                  style={{ color: "var(--text-on-brand-muted)" }}
                >
                  {banner.subtitle}
                </p>
                <Button
                  variant="primary"
                  fullWidth={false}
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "var(--text-on-brand)",
                    borderRadius: "var(--rounded-md)",
                  }}
                  className="hover:opacity-90 transition-opacity shadow-lg"
                  size="lg"
                >
                  {banner.cta}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 shadow-lg"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--brand-primary)",
          boxShadow: "var(--shadow-medium)",
        }}
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full transition-all duration-200 shadow-lg"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--brand-primary)",
          boxShadow: "var(--shadow-medium)",
        }}
        aria-label="Next slide"
      >
        <FiChevronRight className="w-6 h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300`}
            style={{
              backgroundColor:
                currentSlide === index
                  ? "var(--brand-primary)"
                  : "var(--bg-primary)",
              opacity: currentSlide === index ? 1 : 0.6,
              transform: currentSlide === index ? "scale(1.2)" : "scale(1)",
              boxShadow: "var(--shadow-small)",
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
