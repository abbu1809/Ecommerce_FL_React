import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiChevronDown,
  FiUser,
  FiHeart,
  FiHome,
  FiShoppingBag,
  FiInfo,
  FiMessageSquare,
} from "react-icons/fi";
import SearchBar from "./SearchBar"; // Reusing SearchBar

const MobileMenu = ({
  isMenuOpen,
  setIsMenuOpen,
  searchQuery,
  setSearchQuery,
  location,
}) => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeMenu}
        >
          <motion.div
            className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text">
                Menu
              </span>
              <motion.button
                onClick={closeMenu}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FiX size={20} />
              </motion.button>
            </div>
            <div className="p-4 mb-3">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isMobile={true}
              />
            </div>
            <nav className="px-4">
              <ul className="space-y-1">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Link
                    to="/"
                    className={`flex items-center py-2.5 px-4 rounded-lg font-medium transition-colors ${
                      location.pathname === "/"
                        ? "bg-primary-50 text-primary-600"
                        : "hover:bg-gray-50 text-gray-700 hover:text-primary-600"
                    }`}
                    onClick={closeMenu}
                  >
                    <FiHome className="mr-3 text-primary-500" size={18} />
                    Home
                  </Link>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    to="/products"
                    className={`flex items-center py-2.5 px-4 rounded-lg font-medium transition-colors ${
                      location.pathname === "/products"
                        ? "bg-primary-50 text-primary-600"
                        : "hover:bg-gray-50 text-gray-700 hover:text-primary-600"
                    }`}
                    onClick={closeMenu}
                  >
                    <FiShoppingBag
                      className="mr-3 text-primary-500"
                      size={18}
                    />
                    Products
                  </Link>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    className="flex justify-between items-center w-full py-2.5 px-4 rounded-lg font-medium hover:bg-gray-50 text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={toggleCategories}
                  >
                    <div className="flex items-center">
                      <FiChevronDown
                        className="mr-3 text-primary-500"
                        size={18}
                      />
                      Categories
                    </div>
                    <FiChevronDown
                      className={`transform transition-transform duration-300 ${
                        isCategoriesOpen ? "rotate-180" : ""
                      }`}
                      size={16}
                    />
                  </button>

                  <AnimatePresence>
                    {isCategoriesOpen && (
                      <motion.div
                        className="pl-8 mt-1 space-y-1 border-l border-gray-100 ml-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Link
                            to="/products?category=smartphones"
                            className="block py-2 px-3 rounded-md hover:bg-gray-50 text-gray-600 hover:text-primary-600 transition-colors"
                            onClick={closeMenu}
                          >
                            Smartphones
                          </Link>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Link
                            to="/products?category=tablets"
                            className="block py-2 px-3 rounded-md hover:bg-gray-50 text-gray-600 hover:text-primary-600 transition-colors"
                            onClick={closeMenu}
                          >
                            Tablets
                          </Link>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Link
                            to="/products?category=accessories"
                            className="block py-2 px-3 rounded-md hover:bg-gray-50 text-gray-600 hover:text-primary-600 transition-colors"
                            onClick={closeMenu}
                          >
                            Accessories
                          </Link>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Link
                            to="/products?category=wearables"
                            className="block py-2 px-3 rounded-md hover:bg-gray-50 text-gray-600 hover:text-primary-600 transition-colors"
                            onClick={closeMenu}
                          >
                            Wearables
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link
                    to="/about"
                    className={`flex items-center py-2.5 px-4 rounded-lg font-medium transition-colors ${
                      location.pathname === "/about"
                        ? "bg-primary-50 text-primary-600"
                        : "hover:bg-gray-50 text-gray-700 hover:text-primary-600"
                    }`}
                    onClick={closeMenu}
                  >
                    <FiInfo className="mr-3 text-primary-500" size={18} />
                    About
                  </Link>
                </motion.li>

                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    to="/contact"
                    className={`flex items-center py-2.5 px-4 rounded-lg font-medium transition-colors ${
                      location.pathname === "/contact"
                        ? "bg-primary-50 text-primary-600"
                        : "hover:bg-gray-50 text-gray-700 hover:text-primary-600"
                    }`}
                    onClick={closeMenu}
                  >
                    <FiMessageSquare
                      className="mr-3 text-primary-500"
                      size={18}
                    />
                    Contact
                  </Link>
                </motion.li>
              </ul>
            </nav>
            <div className="border-t border-gray-100 mt-6 pt-4 p-4">
              <div className="flex items-center space-x-5">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/account"
                    className="flex items-center px-4 py-2 bg-primary-50 rounded-lg text-primary-700 hover:bg-primary-100 transition-colors"
                    onClick={closeMenu}
                  >
                    <FiUser className="mr-2" size={16} /> Account
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/wishlist"
                    className="flex items-center px-4 py-2 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={closeMenu}
                  >
                    <FiHeart className="mr-2" size={16} /> Wishlist
                  </Link>
                </motion.div>
              </div>
            </div>{" "}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
