import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-10 mt-12">
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-4">
            {" "}
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text">
              Anand Mobiles
            </h3>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Your premier destination for cutting-edge mobile devices and
              accessories. Discover the perfect tech to match your lifestyle
              with our curated selection of products.
            </p>
            <div className="flex space-x-5">
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiFacebook size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiTwitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiInstagram size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                whileHover={{ scale: 1.15, y: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiYoutube size={20} />
              </motion.a>
            </div>
          </div>{" "}
          {/* Column 2: Quick Links */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-5 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300 flex items-center"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary-500 mr-2.5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Home
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/products"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  Products
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  About Us
                </Link>
              </motion.li>
              <motion.li whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-primary-400 transition-colors duration-300"
                >
                  Contact
                </Link>
              </motion.li>
            </ul>
          </div>{" "}
          {/* Column 3: Contact Info */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <div className="bg-gray-800 p-2 rounded-md mr-3 group-hover:bg-primary-900 transition-colors duration-300">
                  <FiMapPin className="text-primary-400" size={18} />
                </div>
                <span className="text-gray-300 text-sm">
                  123 Mobile Street, Tech City, 12345
                </span>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-md mr-3 group-hover:bg-primary-900 transition-colors duration-300">
                  <FiPhone className="text-primary-400" size={18} />
                </div>
                <span className="text-gray-300 text-sm">+123 456 7890</span>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-md mr-3 group-hover:bg-primary-900 transition-colors duration-300">
                  <FiMail className="text-primary-400" size={18} />
                </div>{" "}
                <span className="text-gray-300 text-sm">
                  info@anandmobiles.com
                </span>
              </li>
              <li className="flex items-center group">
                <div className="bg-gray-800 p-2 rounded-md mr-3 group-hover:bg-primary-900 transition-colors duration-300">
                  <FiClock className="text-primary-400" size={18} />
                </div>
                <span className="text-gray-300 text-sm">
                  Mon-Sat: 9AM - 9PM
                </span>
              </li>
            </ul>
          </div>{" "}
          {/* Column 4: Newsletter */}
          <div className="md:col-span-3">
            <h3 className="text-lg font-semibold mb-5 text-white">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Subscribe to our newsletter to receive updates on new arrivals,
              special offers, and tech news.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 text-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white/90"
              />
              <motion.button
                type="submit"
                className="bg-primary-600 px-5 py-3 rounded-r-lg flex items-center justify-center hover:bg-primary-700 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSend />
              </motion.button>
            </form>
            <p className="mt-3 text-gray-400 text-xs">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          {" "}
          <p className="text-gray-400 text-center md:text-left text-sm">
            &copy; {new Date().getFullYear()} Anand Mobiles. All rights
            reserved.
          </p>
          <div className="flex justify-center md:justify-end space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300"
            >
              Terms of Service
            </Link>
            <Link
              to="/faq"
              className="text-gray-400 hover:text-primary-400 text-sm transition-colors duration-300"
            >
              FAQ
            </Link>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
