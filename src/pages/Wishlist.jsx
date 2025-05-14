import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiHeart } from "react-icons/fi";
import Button from "../components/UI/Button";
import { ROUTES } from "../utils/constants";

const Wishlist = () => {
  // In a real app, this would come from a context or store
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 2,
      name: "Apple iPhone 15 Pro",
      price: 109999,
      image: "https://via.placeholder.com/150x150?text=iPhone+15+Pro",
      category: "Mobiles",
      stock: true,
    },
    {
      id: 6,
      name: "Dell XPS 13",
      price: 124999,
      image: "https://via.placeholder.com/150x150?text=Dell+XPS",
      category: "Laptops",
      stock: true,
    },
    {
      id: 8,
      name: "MacBook Air M3",
      price: 109999,
      image: "https://via.placeholder.com/150x150?text=MacBook+Air",
      category: "Laptops",
      stock: false,
    },
  ]);

  const removeFromWishlist = (id) => {
    setWishlistItems(wishlistItems.filter((item) => item.id !== id));
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
          <span className="text-gray-800">My Wishlist</span>
        </nav>

        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FiHeart className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Save items you like to your wishlist and they'll appear here
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button
                variant="primary"
                fullWidth={false}
                className="bg-orange-500 hover:bg-orange-600"
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 object-contain rounded"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">
                            {item.category}
                          </p>
                          <Link
                            to={`/products/${item.id}`}
                            className="text-gray-800 font-medium hover:text-orange-500"
                          >
                            {item.name}
                          </Link>
                          <p className="font-bold mt-1">
                            ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className="mt-4">
                        {item.stock ? (
                          <p className="text-green-600 text-sm mb-2">
                            ✓ In Stock
                          </p>
                        ) : (
                          <p className="text-red-600 text-sm mb-2">
                            ✕ Out of Stock
                          </p>
                        )}

                        <Button
                          className="bg-orange-500 hover:bg-orange-600"
                          disabled={!item.stock}
                        >
                          <FiShoppingCart className="mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
