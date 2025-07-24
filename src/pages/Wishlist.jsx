import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiTrash2, FiHeart } from "react-icons/fi";
import Button from "../components/ui/Button";
import { ROUTES } from "../utils/constants";
import { useWishlistStore } from "../store/useWishlist";
import { useCartStore } from "../store/useCart";
import { useUnifiedAuthStoreImproved } from "../store/unifiedAuthStoreImproved";
import {
  showAddToCartToast,
  showRemoveFromWishlistToast,
} from "../utils/toast";

const Wishlist = () => {
  const {
    items: wishlistItems,
    fetchWishlist,
    removeItem,
  } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { isAuthenticated } = useUnifiedAuthStoreImproved();

  useEffect(() => {
    // Load wishlist data when component mounts
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps
  const handleRemoveFromWishlist = async (itemId) => {
    const success = await removeItem(itemId);
    if (success) {
      showRemoveFromWishlistToast();
    }
  };

  const handleAddToCart = async (item) => {
    const success = await addToCart(item, 1);
    if (success) {
      showAddToCartToast(item.name);
    }
  };

  return (
    <div
      className="min-h-screen py-8"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm mb-6">
          <Link
            to={ROUTES.HOME}
            className="hover:underline transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
          >
            Home
          </Link>
          <span className="mx-2" style={{ color: "var(--text-secondary)" }}>
            /
          </span>
          <span style={{ color: "var(--text-primary)" }}>My Wishlist</span>
        </nav>

        <h1
          className="text-2xl font-bold mb-6"
          style={{ color: "var(--text-primary)" }}
        >
          My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div
            className="rounded-lg p-8 text-center transition-shadow duration-300"
            style={{
              backgroundColor: "var(--bg-primary)",
              boxShadow: "var(--shadow-medium)",
            }}
          >
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
              style={{ backgroundColor: "var(--bg-accent-light)" }}
            >
              <FiHeart
                className="h-10 w-10"
                style={{ color: "var(--brand-primary)" }}
              />
            </div>
            <h2
              className="text-xl font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Your wishlist is empty
            </h2>
            <p className="mb-8" style={{ color: "var(--text-secondary)" }}>
              Save items you like to your wishlist and they'll appear here
            </p>
            <Link to={ROUTES.PRODUCTS}>
              <Button
                variant="primary"
                fullWidth={false}
                className="px-6"
                style={{
                  backgroundColor: "var(--brand-primary)",
                  color: "var(--text-on-brand)",
                  "&:hover": { backgroundColor: "var(--brand-primary-hover)" },
                }}
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
                className="rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  backgroundColor: "var(--bg-primary)",
                  boxShadow: "var(--shadow-medium)",
                }}
              >
                <div className="p-5">
                  <div className="flex items-start space-x-4">
                    <div
                      className="bg-white p-2 rounded-md flex items-center justify-center"
                      style={{ boxShadow: "var(--shadow-small)" }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-24 w-24 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <p
                            className="text-xs mb-1"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {item.category}
                          </p>
                          <Link
                            to={`/products/${item.id}`}
                            className="font-medium hover:underline line-clamp-2"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {item.name}
                          </Link>
                          <p
                            className="font-bold mt-1 text-lg"
                            style={{ color: "var(--brand-primary)" }}
                          >
                            ₹{item.price ? item.price.toLocaleString() : "N/A"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.item_id)}
                          className="p-2 rounded-full transition-colors hover:bg-gray-100"
                          style={{ color: "var(--text-secondary)" }}
                          aria-label="Remove from wishlist"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-4">
                        {item.stock !== 0 ? (
                          <p
                            className="text-sm mb-3 flex items-center"
                            style={{ color: "var(--success-color)" }}
                          >
                            <span
                              className="inline-block w-2 h-2 rounded-full mr-2"
                              style={{
                                backgroundColor: "var(--success-color)",
                              }}
                            ></span>
                            In Stock
                          </p>
                        ) : (
                          <p
                            className="text-sm mb-3 flex items-center"
                            style={{ color: "var(--error-color)" }}
                          >
                            <span
                              className="inline-block w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: "var(--error-color)" }}
                            ></span>
                            Out of Stock
                          </p>
                        )}
                        <Button
                          fullWidth={true}
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock === 0}
                          icon={<FiShoppingCart />}
                          style={{
                            backgroundColor:
                              item.stock !== 0
                                ? "var(--brand-primary)"
                                : "var(--bg-secondary)",
                            color:
                              item.stock !== 0
                                ? "var(--text-on-brand)"
                                : "var(--text-secondary)",
                            cursor:
                              item.stock !== 0 ? "pointer" : "not-allowed",
                          }}
                        >
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
