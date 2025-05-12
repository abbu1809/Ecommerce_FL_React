import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiSmartphone } from "react-icons/fi";
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import Navbar from "./Navbar";
import Button from "../ui/Button";

const HeaderComponent = ({
  isMenuOpen,
  setIsMenuOpen,
  searchQuery,
  setSearchQuery,
  totalItems,
  location,
  isHeaderVisible,
  scrollY,
}) => {
  return (
    <motion.header
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isHeaderVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      animate={{
        boxShadow:
          scrollY > 50 ? "0px 4px 20px rgba(124, 58, 237, 0.08)" : "none",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3.5">
          <div className="flex items-center">
            <Button
              variant="ghost"
              rounded="full"
              size="sm"
              className="md:hidden mr-2 p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              animateScale={true}
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </Button>

            <Link to="/" className="flex items-center">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="mr-2.5 text-primary-600"
              >
                <FiSmartphone size={28} />
              </motion.div>{" "}
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text ">
                Anand Mobiles
              </span>
            </Link>
          </div>

          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <CartIcon totalItems={totalItems} />
        </div>

        <Navbar location={location} />
      </div>
    </motion.header>
  );
};

export default HeaderComponent;
