import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiStar,
  FiTruck,
} from "react-icons/fi";
import Button from "../components/UI/Button";
import { ROUTES } from "../utils/constants";

const Product = () => {
  const { id } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Mock product data based on ID
  // In a real application, this would be fetched from an API
  const product = {
    id,
    name: "Samsung Galaxy S25 Edge",
    price: 89999,
    discountPrice: 84999,
    discount: "5%",
    rating: 4.5,
    reviews: 128,
    stock: 10,
    category: "Smartphones",
    brand: "Samsung",
    description:
      "Experience the next generation of Samsung Galaxy with the new S25 Edge. Featuring a stunning edge display, powerful performance, and incredible camera capabilities.",
    images: [
      "https://via.placeholder.com/600x600?text=Samsung+S25+Front",
      "https://via.placeholder.com/600x600?text=Samsung+S25+Back",
      "https://via.placeholder.com/600x600?text=Samsung+S25+Side",
      "https://via.placeholder.com/600x600?text=Samsung+S25+Detail",
    ],
    features: [
      "6.7-inch Dynamic AMOLED 2X display",
      "Qualcomm Snapdragon 8 Gen 3 processor",
      "8GB RAM, 256GB storage",
      "50MP + 12MP + 10MP triple rear camera system",
      "4,500mAh battery with fast charging",
      "Android 16 with One UI 6.0",
      "IP68 water and dust resistance",
    ],
    specifications: {
      Display: "6.7-inch Dynamic AMOLED 2X, 3200 x 1440 pixels",
      Processor: "Qualcomm Snapdragon 8 Gen 3",
      RAM: "8GB LPDDR5X",
      Storage: "256GB UFS 4.0",
      "Rear Camera": "50MP (main) + 12MP (ultrawide) + 10MP (telephoto)",
      "Front Camera": "12MP",
      Battery: "4,500mAh",
      Charging: "45W wired, 15W wireless",
      "Operating System": "Android 16 with One UI 6.0",
      Dimensions: "157.4 x 75.8 x 7.6 mm",
      Weight: "195g",
      Connectivity: "5G, Wi-Fi 7, Bluetooth 5.3, NFC",
    },
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    // Add to cart functionality would be implemented here
    console.log(`Added ${quantity} of ${product.name} to cart`);
    // You could dispatch an action to a global store here
  };

  const addToWishlist = () => {
    // Add to wishlist functionality would be implemented here
    console.log(`Added ${product.name} to wishlist`);
    // You could dispatch an action to a global store here
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link to={ROUTES.HOME} className="hover:text-orange-500">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to={ROUTES.PRODUCTS} className="hover:text-orange-500">
            {product.category}
          </Link>
          <span className="mx-2">/</span>
          <Link
            to={`/brand/${product.brand}`}
            className="hover:text-orange-500"
          >
            {product.brand}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </nav>

        <Link
          to={ROUTES.PRODUCTS}
          className="inline-flex items-center text-orange-500 mb-6"
        >
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 p-6">
            {/* Product Images - Left Column on Desktop */}
            <div className="lg:col-span-2">
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={product.images[activeImage]}
                  alt={`${product.name} view ${activeImage + 1}`}
                  className="w-full h-auto object-contain aspect-square"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`border-2 rounded p-1 ${
                      activeImage === index
                        ? "border-orange-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-auto object-cover aspect-square"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details - Right Column on Desktop */}
            <div className="lg:col-span-3 flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>

              <div className="flex items-center mb-3">
                <div className="flex items-center text-yellow-500">
                  {[...Array(5)].map((_, index) => (
                    <FiStar
                      key={index}
                      className={`${
                        index < Math.floor(product.rating) ? "fill-current" : ""
                      } ${
                        index === Math.floor(product.rating) &&
                        product.rating % 1 > 0
                          ? "fill-current text-yellow-500/50"
                          : ""
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{product.discountPrice.toLocaleString()}
                  </span>
                  {product.discount && (
                    <>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="ml-2 text-green-600 font-medium">
                        {product.discount} off
                      </span>
                    </>
                  )}
                </div>
                <p className="text-green-600 text-sm mt-1">
                  ✓ In Stock ({product.stock} available)
                </p>
              </div>

              <div className="border-t border-gray-200 py-4">
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={decrementQuantity}
                      className="px-3 py-1 text-lg"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-12 text-center border-x border-gray-300"
                    />
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-1 text-lg"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Button
                    onClick={addToCart}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <FiShoppingCart className="mr-2" />
                    Add to Cart
                  </Button>

                  <Button
                    onClick={addToWishlist}
                    variant="outline"
                    className="border border-orange-500 text-orange-500 hover:bg-orange-50"
                  >
                    <FiHeart className="mr-2" />
                    Add to Wishlist
                  </Button>
                </div>

                <div className="flex items-center justify-end">
                  <button className="inline-flex items-center text-gray-600 hover:text-orange-500">
                    <FiShare2 className="mr-1" />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <FiTruck className="mr-2" />
                  <span>Free delivery available</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 4H4c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6v-2zm0 4h8v2H6v-2zm10 0h2v2h-2v-2zm-6-4h8v2h-8v-2z"></path>
                  </svg>
                  <span>EMI options available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="border-t border-gray-200 mt-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("description")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "description"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "specifications"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "reviews"
                    ? "text-orange-500 border-b-2 border-orange-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews ({product.reviews})
              </button>
            </div>

            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  <h3 className="font-semibold text-lg mb-2">Key Features:</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-gray-700">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "specifications" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="border-b border-gray-200 pb-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800">
                            {key}
                          </span>
                          <span className="text-gray-600">{value}</span>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="flex items-center text-yellow-500">
                      {[...Array(5)].map((_, index) => (
                        <FiStar
                          key={index}
                          className={`${
                            index < Math.floor(product.rating)
                              ? "fill-current"
                              : ""
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-700 ml-2">
                      {product.rating} out of 5
                    </span>
                  </div>

                  <p className="text-gray-600">
                    Based on {product.reviews} reviews
                  </p>

                  <Button variant="outline" fullWidth={false}>
                    Write a Review
                  </Button>

                  <div className="mt-6">
                    <p>
                      This is a placeholder for customer reviews. In a real
                      application, this would display actual customer reviews
                      fetched from a database.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
