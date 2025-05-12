import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiHome,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiPhone,
} from "react-icons/fi";

const Home = () => {
  useEffect(() => {
    toast.success("Welcome to our store!");
  }, []);

  // Sample data for hero carousel
  const heroSlides = [
    {
      id: 1,
      title: "Grand Opening Sale",
      subtitle: "Get up to 20% off on selected smartphones",
      buttonText: "Shop Now",
      image:
        "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?auto=format&fit=crop&w=1200&h=600",
      link: "/products",
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "Check out the latest flagship phones",
      buttonText: "Explore",
      image:
        "https://images.unsplash.com/photo-1616410011236-7a42121dd981?auto=format&fit=crop&w=1200&h=600",
      link: "/products",
    },
    {
      id: 3,
      title: "Accessories Collection",
      subtitle: "Complete your mobile experience",
      buttonText: "View All",
      image:
        "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?auto=format&fit=crop&w=1200&h=600",
      link: "/products",
    },
  ];

  // Sample categories
  const categories = [
    {
      id: 1,
      name: "Smartphones",
      icon: <FiPhone className="text-2xl" />,
      link: "/products",
    },
    {
      id: 2,
      name: "Feature Phones",
      icon: <FiPhone className="text-2xl" />,
      link: "/products",
    },
    {
      id: 3,
      name: "Tablets",
      icon: <FiShoppingBag className="text-2xl" />,
      link: "/products",
    },
    {
      id: 4,
      name: "Accessories",
      icon: <FiStar className="text-2xl" />,
      link: "/products",
    },
  ];

  // Featured products
  const featuredProducts = [
    {
      id: 101,
      name: "iPhone 14 Pro Max",
      price: 1099.99,
      image:
        "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?auto=format&fit=crop&w=400&h=400",
      category: "Smartphones",
    },
    {
      id: 102,
      name: "Samsung Galaxy S23 Ultra",
      price: 999.99,
      image:
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=400&h=400",
      category: "Smartphones",
    },
    {
      id: 103,
      name: "Wireless Earbuds",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&h=400",
      category: "Accessories",
    },
    {
      id: 104,
      name: "Phone Case",
      price: 24.99,
      image:
        "https://images.unsplash.com/photo-1604054923518-71c6857f3b5c?auto=format&fit=crop&w=400&h=400",
      category: "Accessories",
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero Section */}
      <motion.div
        className="relative h-[500px] overflow-hidden mb-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="h-full">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${heroSlides[0].image})`,
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-lg text-white"
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">
                    {heroSlides[0].title}
                  </h1>
                  <p className="text-xl mb-6">{heroSlides[0].subtitle}</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={heroSlides[0].link}
                      className="bg-blue-600 text-white px-6 py-3 rounded-full inline-block font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {heroSlides[0].buttonText}
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Categories Section */}
      <motion.div
        className="container mx-auto px-4 mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-6 text-center"
          variants={itemVariants}
        >
          Browse Categories
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <Link to={category.link} className="flex flex-col items-center">
                <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
                  {category.icon}
                </div>
                <h3 className="font-semibold">{category.name}</h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Featured Products */}
      <motion.div
        className="container mx-auto px-4 mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className="flex items-center justify-between mb-6"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/products"
              className="text-blue-600 font-semibold flex items-center hover:underline"
              onClick={() => toast.success("Exploring all products!")}
            >
              View All <FiTrendingUp className="ml-1" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <motion.div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="text-xs text-blue-600 font-semibold mb-1">
                  {product.category}
                </div>
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <motion.button
                    className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      toast.success(`${product.name} added to cart!`)
                    }
                  >
                    Add to Cart
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Promotional Banner */}
      <motion.div
        className="bg-gray-100 py-16 mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              className="md:w-1/2 mb-8 md:mb-0"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-gray-600 mb-6">
                Stay updated with the latest products and deals. Get exclusive
                offers!
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                />
                <motion.button
                  className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toast.success("Thanks for subscribing!")}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
            <motion.div
              className="md:w-1/3"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=500&h=300"
                alt="Newsletter"
                className="rounded-lg shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Why Choose Us Section */}
      <motion.div
        className="container mx-auto px-4 mb-16"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2
          className="text-3xl font-bold mb-10 text-center"
          variants={itemVariants}
        >
          Why Choose Us
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md text-center"
            variants={itemVariants}
          >
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiStar size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
            <p className="text-gray-600">
              We offer only the highest quality products that meet our strict
              standards.
            </p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md text-center"
            variants={itemVariants}
          >
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fast Shipping</h3>
            <p className="text-gray-600">
              Quick and reliable delivery to get your products to you as soon as
              possible.
            </p>
          </motion.div>
          <motion.div
            className="bg-white p-6 rounded-lg shadow-md text-center"
            variants={itemVariants}
          >
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <FiHome size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
            <p className="text-gray-600">
              Our customer service team is always ready to help you with any
              questions.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Home;
