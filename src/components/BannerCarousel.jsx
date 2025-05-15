import React, { useState, useEffect } from "react";
import Button from "./UI/Button";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BannerCarousel = ({ banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((current) =>
        current === banners.length - 1 ? 0 : current + 1
      );
    }, 6000);

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
      className="relative overflow-hidden rounded-xl"
      style={{
        boxShadow: "var(--shadow-large)",
        borderRadius: "var(--rounded-xl)",
      }}
    >
      {/* Progress bar - automatic animation */}
      <div className="absolute top-0 left-0 right-0 z-30 h-1.5 bg-white bg-opacity-20">
        <div
          className="h-full"
          style={{
            width: `${((currentSlide + 1) / banners.length) * 100}%`,
            backgroundColor: "var(--brand-primary)",
            transition: "width 6s linear",
          }}
        ></div>
      </div>

      <div
        className="flex transition-transform duration-700 ease-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          width: `${banners.length * 100}%`,
        }}
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative w-full overflow-hidden"
            style={{ flex: `0 0 ${100 / banners.length}%` }}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-[250px] sm:h-[350px] md:h-[400px] object-cover transform transition-all duration-3000"
              style={{
                backgroundColor:
                  banner.backgroundColor || "var(--brand-primary)",
                transformOrigin: "center",
                transform: "scale(1.05)",
              }}
            />
            <div
              className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:px-14"
              style={{
                background:
                  "linear-gradient(45deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)",
                backdropFilter: "blur(2px)",
              }}
            >
              <div className="max-w-lg animate-fadeIn">
                <div
                  className="w-max mb-2 px-3 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: "var(--brand-primary)",
                    color: "var(--text-on-brand)",
                  }}
                >
                  Limited Time Offer
                </div>
                <h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight"
                  style={{
                    color: "var(--text-on-brand)",
                    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {banner.title}
                </h2>
                <p
                  className="text-base md:text-xl mb-6 opacity-95 leading-relaxed max-w-md"
                  style={{
                    color: "var(--text-on-brand-muted)",
                    textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                  }}
                >
                  {banner.subtitle}
                </p>
                <Button
                  variant="primary"
                  fullWidth={false}
                  className="hover:shadow-glow transition-all duration-300"
                  size="lg"
                  icon={
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="mr-1"
                    >
                      <path
                        d="M5 12H19M19 12L12 5M19 12L12 19"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  }
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
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--brand-primary)",
          boxShadow: "var(--shadow-medium)",
        }}
        aria-label="Previous slide"
      >
        <FiChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full shadow-lg opacity-70 hover:opacity-100 transition-all duration-300 hover:scale-110"
        style={{
          backgroundColor: "var(--bg-primary)",
          color: "var(--brand-primary)",
          boxShadow: "var(--shadow-medium)",
        }}
        aria-label="Next slide"
      >
        <FiChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="w-2.5 h-2.5 rounded-full transition-all duration-300"
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
