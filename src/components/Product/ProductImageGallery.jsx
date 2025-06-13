import React, { useState } from "react";
import {
  FiZoomIn,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
} from "react-icons/fi";
import MediaModal from "./MediaModal";

const ProductImageGallery = ({
  images = [],
  videos = [],
  activeImage = 0,
  setActiveImage,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Combine images and videos into a single media array
  const allMedia = [...images, ...videos];

  const isVideo = (url) => {
    return (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("vimeo.com")
    );
  };

  const getYouTubeThumbnail = (url) => {
    let videoId = "";
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };
  const handleNext = () => {
    setActiveImage((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setActiveImage((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1));
  };

  const openModal = () => {
    setIsModalOpen(true);
  };
  return (
    <div className="relative">
      {/* Main image/video container */}
      <div
        className="mb-4 rounded-lg overflow-hidden relative group cursor-pointer"
        style={{ boxShadow: "var(--shadow-medium)" }}
        onClick={openModal}
      >
        <div className="relative overflow-hidden">
          {isVideo(allMedia[activeImage]) ? (
            <div className="relative w-full aspect-square bg-gray-100 flex items-center justify-center">
              <img
                src={getYouTubeThumbnail(allMedia[activeImage])}
                alt={`Video thumbnail ${activeImage + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transition-colors">
                  <FiPlay size={24} />
                </div>
              </div>
            </div>
          ) : (
            <img
              src={allMedia[activeImage]}
              alt={`Product view ${activeImage + 1}`}
              className="w-full h-auto object-contain aspect-square"
            />
          )}
        </div>
        {/* Zoom/Play indicator */}
        <button
          className="absolute bottom-3 right-3 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={(e) => {
            e.stopPropagation();
            openModal();
          }}
          style={{
            color: "var(--brand-primary)",
            boxShadow: "var(--shadow-small)",
          }}
        >
          {isVideo(allMedia[activeImage]) ? <FiPlay /> : <FiZoomIn />}
        </button>{" "}
        {/* Navigation buttons */}
        {allMedia.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                color: "var(--brand-primary)",
                boxShadow: "var(--shadow-small)",
              }}
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
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
      </div>{" "}
      {/* Thumbnail grid */}
      <div className="grid grid-cols-5 gap-2">
        {allMedia.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`rounded-md overflow-hidden transition-all duration-300 relative ${
              activeImage === index
                ? "ring-2 ring-offset-1 transform scale-105"
                : "opacity-80 hover:opacity-100"
            }`}
            style={{
              ringColor: "var(--brand-primary)",
              transform: activeImage === index ? "scale(1.05)" : "scale(1)",
            }}
          >
            {isVideo(item) ? (
              <div className="relative w-full aspect-square bg-gray-100">
                <img
                  src={getYouTubeThumbnail(item)}
                  alt={`Video thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <FiPlay className="text-white" size={16} />
                </div>
              </div>
            ) : (
              <img
                src={item}
                alt={`Product thumbnail ${index + 1}`}
                className="w-full h-auto object-cover aspect-square"
              />
            )}
          </button>
        ))}
      </div>
      {/* Media Modal */}
      <MediaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        media={allMedia}
        currentIndex={activeImage}
        setCurrentIndex={setActiveImage}
      />
    </div>
  );
};

export default ProductImageGallery;
