import React, { useState, useEffect } from "react";
import Button from "./UI/Button";

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
    <div className="relative overflow-hidden rounded-lg">
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
            <div className="absolute inset-0 flex flex-col justify-center px-12 bg-gradient-to-r from-black/60 to-transparent">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
                {banner.title}
              </h2>
              <p className="text-xl md:text-2xl text-white mb-6">
                {banner.subtitle}
              </p>
              <Button
                variant="primary"
                fullWidth={false}
                className="bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                {banner.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-200"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-colors duration-200 ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerCarousel;
