import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Toaster } from "react-hot-toast";
import useCartStore from "../store/cartStore";

// Import new layout components
import TopBar from "../components/layout/TopBar";
import HeaderComponent from "../components/layout/HeaderComponent";
import MobileMenu from "../components/layout/MobileMenu";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { items } = useCartStore();
  const location = useLocation();
  const { scrollY } = useScroll(); // Direct usage from framer-motion

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  // Handle scroll events to hide/show header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // Hide after scrolling down 200px
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {" "}
      {/* Consistent background */}
      <Toaster position="top-right" />
      <TopBar />
      <HeaderComponent
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalItems={totalItems}
        location={location}
        isHeaderVisible={isHeaderVisible}
        scrollY={scrollY.get()} // Pass current scrollY value
      />
      <MobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        location={location}
      />
      <motion.main
        className="flex-1 container mx-auto px-4 py-6" // Added padding to main content
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      <Footer />
    </div>
  );
};

export default MainLayout;
