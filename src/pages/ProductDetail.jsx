import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { motion, useScroll, useTransform } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiArrowLeft,
  FiShoppingCart,
  FiStar,
  FiPlus,
  FiMinus,
  FiCheck,
  FiHeart,
  FiShare2,
  FiShield,
  FiTruck,
  FiRotateCw,
} from "react-icons/fi";

// Example product data (in a real app, this would come from an API)
const sampleProducts = [
  {
    id: 1,
    name: "Premium Headphones",
    price: 199.99,
    description:
      "High-quality wireless headphones with noise cancellation and superior sound quality. Experience immersive audio with deep bass and crystal-clear highs. Perfect for music enthusiasts and professionals alike.",
    specs: [
      { name: "Battery Life", value: "Up to 30 hours" },
      { name: "Bluetooth", value: "5.0" },
      { name: "Noise Cancellation", value: "Active" },
      { name: "Driver Size", value: "40mm" },
      { name: "Weight", value: "250g" },
    ],
    images: [
      "https://via.placeholder.com/600x600?text=Headphones+Main",
      "https://via.placeholder.com/600x600?text=Headphones+Side",
      "https://via.placeholder.com/600x600?text=Headphones+Back",
    ],
    colors: ["Black", "Silver", "Blue"],
    rating: 4.8,
    reviews: 124,
    inStock: true,
    relatedProducts: [2],
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 299.99,
    description:
      "Feature-rich smartwatch with health monitoring, notifications, and long battery life. Track your fitness goals, receive notifications, and stay connected with this elegant smartwatch.",
    specs: [
      { name: "Battery Life", value: "Up to 7 days" },
      { name: "Water Resistance", value: "5 ATM" },
      { name: "Display", value: "1.4 inch AMOLED" },
      { name: "Sensors", value: "Heart rate, SpO2, Accelerometer" },
      { name: "Weight", value: "48g" },
    ],
    images: [
      "https://via.placeholder.com/600x600?text=Smartwatch+Main",
      "https://via.placeholder.com/600x600?text=Smartwatch+Side",
      "https://via.placeholder.com/600x600?text=Smartwatch+Back",
    ],
    colors: ["Black", "Silver", "Rose Gold"],
    rating: 4.6,
    reviews: 89,
    inStock: true,
    relatedProducts: [1],
  },
];

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [activeTab, setActiveTab] = useState("description");
  const { addItem } = useCartStore();

  // Scroll-based animation setup
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const translateY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      const foundProduct = sampleProducts.find(
        (p) => p.id === parseInt(productId)
      );
      setProduct(foundProduct || null);
      if (foundProduct) {
        setSelectedColor(foundProduct.colors ? foundProduct.colors[0] : null);
        setMainImage(0);
      }
      setLoading(false);
    }, 500);
  }, [productId]);
  const handleAddToCart = () => {
    if (product) {
      addItem({
        ...product,
        selectedColor,
        quantity,
      });
      // Show toast notification
      toast.success(
        <div className="flex items-center">
          <FiCheck className="mr-2" />
          <span>
            Added {quantity} {product.name}
            {selectedColor ? ` (${selectedColor})` : ""} to cart
          </span>
        </div>,
        {
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }
      );
    }
  };

  const handleWishlist = () => {
    toast("Added to wishlist!", {
      icon: <FiHeart style={{ color: "red" }} />,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        toast("Link copied to clipboard!", {
          icon: <FiShare2 />,
        });
      },
      () => {
        toast.error("Failed to copy link");
      }
    );
  };

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[50vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ ease: "linear", duration: 2, repeat: Infinity }}
          className="border-t-2 border-b-2 border-blue-600 rounded-full h-12 w-12"
        />
      </div>
    );
  }

  // Error state
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto"
        >
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center text-blue-600 hover:underline"
          >
            <FiArrowLeft className="mr-2" />
            Back to Products
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <motion.nav
          className="flex text-sm mb-8"
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ol className="flex items-center space-x-2">
            <li>
              <Link
                to="/"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <FiArrowLeft className="h-4 w-4 text-gray-400 mx-1" />
            </li>
            <li>
              <Link
                to="/products"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600"
              >
                Products
              </Link>
            </li>
            <li className="flex items-center">
              <FiArrowLeft className="h-4 w-4 text-gray-400 mx-1 transform rotate-180" />
            </li>
            <li className="text-gray-900 dark:text-white font-medium truncate max-w-[150px]">
              {product.name}
            </li>
          </ol>
        </motion.nav>

        <div className="flex flex-col lg:flex-row -mx-4">
          {/* Product Images */}
          <motion.div
            className="lg:w-1/2 px-4 mb-8 lg:mb-0"
            style={{ opacity, scale, y: translateY }}
          >
            <motion.div
              className="bg-white rounded-lg overflow-hidden shadow-md mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={
                  product.images?.[mainImage] ||
                  product.image ||
                  "https://via.placeholder.com/600x600?text=Product+Image"
                }
                alt={product.name}
                className="w-full h-auto object-cover aspect-square"
              />
            </motion.div>

            {/* Thumbnail images */}
            {product.images && product.images.length > 1 && (
              <motion.div
                className="grid grid-cols-5 gap-2"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {product.images.map((image, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                      mainImage === index
                        ? "border-blue-600"
                        : "border-transparent"
                    }`}
                    onClick={() => setMainImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-auto object-cover aspect-square"
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Product Info */}
          <div className="lg:w-1/2 px-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`${
                        i < Math.floor(product.rating)
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      } w-5 h-5`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="text-2xl font-bold text-blue-600 mb-6">
                ${product.price.toFixed(2)}
              </div>

              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-semibold mb-3">Color</h2>
                  <div className="flex space-x-3">
                    {product.colors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-10 h-10 rounded-full border-2 ${
                          selectedColor === color
                            ? "border-blue-600 ring-2 ring-blue-200"
                            : "border-gray-300"
                        } focus:outline-none`}
                        style={{
                          backgroundColor: color.toLowerCase(),
                          boxShadow:
                            selectedColor === color
                              ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                              : "none",
                        }}
                        onClick={() => {
                          setSelectedColor(color);
                          toast.success(`${color} selected`);
                        }}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-6">
                <h2 className="font-semibold mb-3">Quantity</h2>
                <div className="flex items-center border rounded-md w-32">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-1 border-r"
                    onClick={() => {
                      if (quantity > 1) setQuantity(quantity - 1);
                    }}
                    aria-label="Decrease quantity"
                  >
                    <FiMinus />
                  </motion.button>
                  <span className="flex-grow text-center py-1">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    className="px-3 py-1 border-l"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <FiPlus />
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white py-3 px-6 rounded-md flex items-center justify-center flex-1"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <FiShoppingCart className="mr-2" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-gray-300 py-3 px-4 rounded-md flex items-center justify-center"
                  onClick={handleWishlist}
                >
                  <FiHeart />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-gray-300 py-3 px-4 rounded-md flex items-center justify-center"
                  onClick={handleShare}
                >
                  <FiShare2 />
                </motion.button>
              </div>

              {/* Product Info Tabs */}
              <div className="border-t pt-6">
                <div className="flex border-b">
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "description"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("description")}
                  >
                    Description
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "specs"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("specs")}
                  >
                    Specifications
                  </button>
                  <button
                    className={`py-2 px-4 font-medium ${
                      activeTab === "reviews"
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    Reviews
                  </button>
                </div>

                <div className="py-4">
                  {activeTab === "description" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-gray-700"
                    >
                      <p>{product.description}</p>
                    </motion.div>
                  )}

                  {activeTab === "specs" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <ul className="divide-y">
                        {product.specs?.map((spec, index) => (
                          <li key={index} className="py-2 flex justify-between">
                            <span className="font-medium">{spec.name}</span>
                            <span className="text-gray-600">{spec.value}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <p className="text-gray-600">Reviews coming soon!</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Shipping & Returns */}
              <motion.div
                className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, staggerChildren: 0.1 }}
              >
                <motion.div
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <FiTruck className="text-blue-600 text-2xl mb-2" />
                  <h3 className="font-medium">Free Shipping</h3>
                  <p className="text-xs text-gray-500 text-center">
                    On orders over $50
                  </p>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <FiRotateCw className="text-blue-600 text-2xl mb-2" />
                  <h3 className="font-medium">Easy Returns</h3>
                  <p className="text-xs text-gray-500 text-center">
                    30 day return policy
                  </p>
                </motion.div>

                <motion.div
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <FiShield className="text-blue-600 text-2xl mb-2" />
                  <h3 className="font-medium">Secure Checkout</h3>
                  <p className="text-xs text-gray-500 text-center">
                    Protected by encryption
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
