import React, { useState } from "react";
import { FiZoomIn, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ProductImageGallery = ({
  images = [],
  activeImage = 0,
  setActiveImage,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleNext = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handle zoom toggle
  const toggleZoom = () => setIsZoomed(!isZoomed);

  return (
    <div className="relative">
      {/* Main image container with zoom effect */}
      <div
        className="mb-4 rounded-lg overflow-hidden relative group"
        style={{ boxShadow: "var(--shadow-medium)" }}
      >
        <div
          className={`relative overflow-hidden ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
          onClick={toggleZoom}
        >
          <img
            src={images[activeImage]}
            alt={`Product view ${activeImage + 1}`}
            className={`w-full h-auto object-contain aspect-square transition-transform duration-500 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
          />
        </div>

        {/* Zoom indicator */}
        <button
          className="absolute bottom-3 right-3 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={toggleZoom}
          style={{
            color: "var(--brand-primary)",
            boxShadow: "var(--shadow-small)",
          }}
        >
          <FiZoomIn />
        </button>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                color: "var(--brand-primary)",
                boxShadow: "var(--shadow-small)",
              }}
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                color: "var(--brand-primary)",
                boxShadow: "var(--shadow-small)",
              }}
            >
              <FiChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail grid */}
      <div className="grid grid-cols-5 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`rounded-md overflow-hidden transition-all duration-300 ${
              activeImage === index
                ? "ring-2 ring-offset-1 transform scale-105"
                : "opacity-80 hover:opacity-100"
            }`}
            style={{
              ringColor: "var(--brand-primary)",
              transform: activeImage === index ? "scale(1.05)" : "scale(1)",
            }}
          >
            <img
              src={image}
              alt={`Product thumbnail ${index + 1}`}
              className="w-full h-auto object-cover aspect-square"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
