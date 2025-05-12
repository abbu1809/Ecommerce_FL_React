import React, { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "../ui";

const SearchBar = ({ searchQuery, setSearchQuery, isMobile = false }) => {
  const [isFocused, setIsFocused] = useState(false);

  const searchBarClass = isMobile
    ? "relative w-full"
    : "hidden md:flex flex-1 mx-8 relative";

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className={`${searchBarClass} group`}>
      <Input
        type="text"
        placeholder="Search for products, brands and more..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        isFullWidth={true}
        rounded="lg"
        size="md"
        className={`transition-all duration-300 ${
          isFocused ? "shadow-md" : ""
        }`}
        leftIcon={
          <motion.div className="text-gray-400 group-hover:text-primary-500 transition-colors">
            <FiSearch size={18} />
          </motion.div>
        }
        rightIcon={
          <AnimatePresence>
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClearSearch}
                className="cursor-pointer text-gray-400 hover:text-primary-600 transition-colors"
              >
                <FiX size={18} />
              </motion.div>
            )}
          </AnimatePresence>
        }
      />
    </div>
  );
};

export default SearchBar;
