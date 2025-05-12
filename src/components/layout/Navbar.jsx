import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { animations } from "../../theme";

const NavLink = ({ to, currentPath, children }) => (
  <motion.div
    className="relative group"
    whileHover={{ y: -2 }}
    whileTap={{ y: 0 }}
  >
    <Link
      to={to}
      className={`font-medium transition-all duration-300 block py-2 ${
        currentPath === to
          ? "text-primary-600"
          : "text-gray-700 hover:text-primary-600"
      }`}
    >
      {children}
    </Link>
    <span
      className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full ${
        currentPath === to ? "w-full" : ""
      }`}
    ></span>
  </motion.div>
);

const Navbar = ({ location }) => {
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -5,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
  };
  return (
    <nav className="hidden md:block py-3.5 border-t border-gray-100">
      <motion.ul
        className="flex space-x-12 justify-center items-center"
        variants={animations.staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.li variants={animations.staggerItem}>
          <NavLink to="/" currentPath={location.pathname}>
            Home
          </NavLink>
        </motion.li>
        <motion.li variants={animations.staggerItem}>
          <NavLink to="/products" currentPath={location.pathname}>
            Products
          </NavLink>
        </motion.li>
        <motion.li className="relative group" variants={animations.staggerItem}>
          <motion.div
            className="flex items-center font-medium text-gray-700 hover:text-primary-600 cursor-pointer transition-all duration-300 py-2"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            Categories{" "}
            <FiChevronDown className="ml-1.5 group-hover:rotate-180 transition-transform duration-300" />
          </motion.div>
          <motion.div
            className="absolute left-0 top-full mt-1 w-60 bg-white shadow-xl rounded-xl overflow-hidden z-50 border border-gray-100"
            initial="hidden"
            variants={dropdownVariants}
            animate="hidden"
            whileHover="visible"
          >
            <motion.div className="py-1">
              <Link
                to="/products?category=smartphones"
                className="flex items-center px-5 py-3 hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-primary-500 mr-2.5"></span>
                Smartphones
              </Link>
              <Link
                to="/products?category=tablets"
                className="flex items-center px-5 py-3 hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-secondary-500 mr-2.5"></span>
                Tablets
              </Link>
              <Link
                to="/products?category=accessories"
                className="flex items-center px-5 py-3 hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2.5"></span>
                Accessories
              </Link>
              <Link
                to="/products?category=wearables"
                className="flex items-center px-5 py-3 hover:bg-primary-50 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-2.5"></span>
                Wearables
              </Link>
            </motion.div>
          </motion.div>
        </motion.li>
        <motion.li variants={animations.staggerItem}>
          <NavLink to="/about" currentPath={location.pathname}>
            About
          </NavLink>
        </motion.li>
        <motion.li variants={animations.staggerItem}>
          <NavLink to="/contact" currentPath={location.pathname}>
            Contact
          </NavLink>
        </motion.li>
      </motion.ul>
    </nav>
  );
};

export default Navbar;
