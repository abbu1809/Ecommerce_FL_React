import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "./ui/Button";
import { useBannerStore } from "../store/Admin/useBannerStore";

// Fallback images from public folder (used if no banners from database)
const fallbackImages = [
  {
    image: "/mobile1.png",
    title: "Latest Smartphones",
    subtitle: "Discover the newest technology at unbeatable prices",
    tag: "New Arrivals",
    cta: "Shop Phones",
    backgroundColor: "#f8fafc",
  },
  {
    image: "/laptops.png",
    title: "Premium Laptops",
    subtitle: "Powerful devices for work and play",
    tag: "Best Sellers",
    cta: "Shop Laptops",
    backgroundColor: "#f1f5f9",
  },
  {
    image: "/tv1.png",
    title: "Smart TVs",
    subtitle: "Immersive entertainment for your home",
    tag: "Featured",
    cta: "Shop TVs",
    backgroundColor: "#e2e8f0",
  },
];

const HeroBanner = () => {
  const { getHeroBanners } = useBannerStore();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);

  // Get hero banners from store or use fallback
  const heroBanners = getHeroBanners();
  console.log("Hero Banners:", heroBanners);
  const images = heroBanners.length > 0 ? heroBanners : fallbackImages;
  // Auto-advance the slider
  useEffect(() => {
    if (images.length === 0) return; // Don't auto-advance if no images

    const timer = setTimeout(() => {
      const newIndex = (currentIndex + 1) % images.length;
      setPage([newIndex, 1]); // 1 for forward direction
      setCurrentIndex(newIndex);
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentIndex, images.length]);

  // Handle manual navigation
  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setPage([newIndex, -1]); // -1 for backward direction
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setPage([newIndex, 1]); // 1 for forward direction
    setCurrentIndex(newIndex);
  };

  // Handle button click navigation
  const handleButtonClick = (link) => {
    if (link) {
      // Navigate to the category page or specific route
      navigate(`/category/${link}`);
    }
  };

  // Variants for Framer Motion
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Transition for animation
  const slideTransition = {
    duration: 0.6,
    ease: "easeInOut",
  };

  return (
    <section className="relative overflow-hidden">
      <div className="container">
        <div
          className="relative overflow-hidden transform hover:scale-[1.01] transition-all duration-700 ease-in-out animate-fadeIn"
          style={{
            boxShadow:
              "var(--shadow-large), 0 15px 30px -10px rgba(245, 158, 11, 0.2)",
            height: "500px",
          }}
        >
          {/* Slider with Framer Motion */}
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              className="absolute inset-0"
            >
              {/* High-quality image with subtle zoom effect */}
              <img
                src={images[currentIndex].image}
                alt={images[currentIndex].title}
                className="w-full h-full object-cover object-center"
                style={{
                  backgroundColor: images[currentIndex].backgroundColor,
                }}
                loading="eager"
              />
              {/* Content overlay without dark background */}
              <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
                <div className="max-w-lg relative">
                  {/* Animated badge */}
                  {images[currentIndex].tag && (
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="inline-block px-5 py-2 mb-5 rounded-full text-sm font-medium shadow-lg"
                      style={{
                        backgroundColor: "var(--brand-primary)",
                        color: "var(--text-on-brand)",
                        boxShadow: "0 8px 25px rgba(245, 158, 11, 0.5)",
                      }}
                    >
                      {images[currentIndex].tag}
                    </motion.span>
                  )}
                  {/* Animated headline with text reveal effect */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-3xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-lg"
                    style={{
                      color: "var(--text-on-brand)",
                      textShadow: "0 2px 10px rgba(0,0,0,0.4)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {images[currentIndex].title}
                  </motion.h1>
                  {/* Animated subtitle */}
                  {images[currentIndex].subtitle && (
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                      className="text-lg sm:text-xl md:text-2xl mb-8 leading-relaxed max-w-xl"
                      style={{
                        color: "var(--text-on-brand-muted)",
                        textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      }}
                    >
                      {images[currentIndex].subtitle}
                    </motion.p>
                  )}
                  {/* Description if available */}
                  {images[currentIndex].description && (
                    <motion.p
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.6 }}
                      className="text-base mb-8 leading-relaxed max-w-xl"
                      style={{
                        color: "var(--text-on-brand-muted)",
                        textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                      }}
                    >
                      {images[currentIndex].description}
                    </motion.p>
                  )}
                  {/* Animated buttons with improved effects */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button
                      variant="primary"
                      fullWidth={false}
                      size="lg"
                      onClick={() =>
                        handleButtonClick(images[currentIndex].link)
                      }
                      className="transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden group"
                      style={{
                        backgroundColor: "var(--brand-primary)",
                        color: "var(--text-on-brand)",
                        boxShadow: "0 10px 25px -5px rgba(245, 158, 11, 0.5)",
                        borderRadius: "var(--rounded-md)",
                        padding: "0.85rem 2rem",
                      }}
                    >
                      <span className="relative z-10 text-base font-semibold flex items-center gap-2">
                        {images[currentIndex].cta || "Shop Now"}
                        <svg
                          className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 transform -skew-x-30 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
                    </Button>
                    {images[currentIndex].link && (
                      <Button
                        variant="outline"
                        fullWidth={false}
                        size="lg"
                        onClick={() =>
                          handleButtonClick(images[currentIndex].link)
                        }
                        className="transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl relative overflow-hidden group"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.12)",
                          borderColor: "rgba(255, 255, 255, 0.4)",
                          color: "var(--text-on-brand)",
                          borderRadius: "var(--rounded-md)",
                          padding: "0.85rem 2rem",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
                        }}
                      >
                        <span className="relative z-10 text-base font-semibold">
                          Learn More
                        </span>
                        <span className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                      </Button>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Slider navigation buttons */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <motion.button
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePrevious}
              className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-r-lg ml-2"
              aria-label="Previous slide"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center">
            <motion.button
              initial={{ opacity: 0.6 }}
              whileHover={{ opacity: 1, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-l-lg mr-2"
              aria-label="Next slide"
            >
              <svg
                className="w-6 h-6"
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
            </motion.button>
          </div>
          {/* Slide indicators */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  const direction = index > currentIndex ? 1 : -1;
                  setPage([index, direction]);
                  setCurrentIndex(index);
                }}
                className={`h-2.5 rounded-full ${
                  index === currentIndex ? "w-8 bg-white" : "w-2.5 bg-white/50"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          {/* Keep the decorative elements */}
          <div
            className="absolute top-0 right-0 w-64 h-64 opacity-20 rotate-45 translate-x-20 -translate-y-20 animate-pulse"
            style={{ animationDuration: "5s" }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            ></div>
          </div>
          <div
            className="absolute top-1/2 right-1/3 w-40 h-40 opacity-15 rotate-12 animate-pulse"
            style={{ animationDuration: "8s" }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--brand-secondary) 0%, transparent 70%)",
                filter: "blur(30px)",
              }}
            ></div>
          </div>
          <div
            className="absolute bottom-10 right-1/4 w-32 h-32 opacity-10 animate-pulse"
            style={{ animationDuration: "12s" }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--text-on-brand) 0%, transparent 70%)",
                filter: "blur(25px)",
              }}
            ></div>
          </div>
          <div
            className="absolute bottom-0 left-1/4 w-20 h-20 opacity-10 rotate-90 animate-pulse"
            style={{ animationDuration: "10s" }}
          >
            <div
              className="w-full h-full rounded-full"
              style={{
                background:
                  "radial-gradient(circle, var(--brand-primary) 0%, transparent 70%)",
                filter: "blur(15px)",
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
