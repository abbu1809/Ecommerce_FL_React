import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiUser, FiHeart } from "react-icons/fi";
import { animations } from "../../theme";

const TopBar = () => {
  return (
    <motion.div
      className="bg-gray-900 text-gray-200 py-2 text-sm"
      variants={animations.fadeIn}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-6 mb-2 md:mb-0">
          <motion.a
            href="tel:+1234567890"
            className="hover:text-indigo-400 flex items-center transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <FiPhone className="mr-1.5" /> +123 456 7890
          </motion.a>
          <motion.a
            href="mailto:info@example.com"
            className="hover:text-indigo-400 flex items-center transition-colors"
            whileHover={{ scale: 1.05 }}
          >
            <FiMail className="mr-1.5" /> info@example.com
          </motion.a>
        </div>
        <div className="flex items-center space-x-6">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/account"
              className="hover:text-indigo-400 flex items-center transition-colors"
            >
              <FiUser className="mr-1.5" /> Account
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              to="/wishlist"
              className="hover:text-indigo-400 flex items-center transition-colors"
            >
              <FiHeart className="mr-1.5" /> Wishlist
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopBar;
