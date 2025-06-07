import React, { useState } from "react";
import {
  FiHeart,
  FiShoppingCart,
  FiShare2,
  FiTruck,
  FiCreditCard,
  FiShield,
  FiGift,
} from "react-icons/fi";
import Button from "../ui/Button";
import { useCartStore } from "../../store/useCart";
import { useWishlistStore } from "../../store/useWishlist";
import { useAuthStore } from "../../store/useAuth";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import {
  showAddToCartToast,
  showAddToWishlistToast,
  showCartErrorToast,
  showWishlistErrorToast,
  toast,
} from "../../utils/toast";

const ProductActionsIntegrated = ({ product, quantity = 1 }) => {
  const { addItem: addToCart, error: cartError } = useCartStore();
  const {
    addItem: addToWishlist,
    isInWishlist,
    error: wishlistError,
  } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if product is in wishlist
  const productInWishlist = isInWishlist(product.id);

  const handleAddToCart = async () => {
    setIsProcessing(true);

    // If not logged in, redirect to login
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      const success = await addToCart(product, quantity);
      if (success) {
        showAddToCartToast(product.name);
      } else if (cartError) {
        showCartErrorToast(cartError);
      }
    } catch (error) {
      showCartErrorToast(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddToWishlist = async () => {
    setIsProcessing(true);

    // If not logged in, redirect to login
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }

    try {
      const success = await addToWishlist(product);
      if (success && !productInWishlist) {
        showAddToWishlistToast(product.name);
      } else if (wishlistError) {
        showWishlistErrorToast(wishlistError);
      }
    } catch (error) {
      showWishlistErrorToast(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!");
    }
  };

  return (
    <div
      className="rounded-lg p-4 space-y-6"
      style={{
        backgroundColor: "var(--bg-secondary)",
        boxShadow: "var(--shadow-small)",
      }}
    >
      {/* Primary action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={handleAddToCart}
          disabled={isProcessing}
          className="transition-transform hover:scale-105 duration-300"
          style={{
            backgroundColor: "var(--brand-primary)",
            color: "var(--text-on-brand)",
          }}
          icon={<FiShoppingCart />}
          fullWidth={true}
        >
          {isProcessing ? "Adding..." : "Add to Cart"}
        </Button>

        <Button
          onClick={handleAddToWishlist}
          disabled={isProcessing}
          className="transition-transform hover:scale-105 duration-300"
          style={{
            backgroundColor: productInWishlist
              ? "var(--bg-accent)"
              : "var(--bg-accent-light)",
            color: productInWishlist
              ? "var(--brand-primary)"
              : "var(--text-primary)",
            borderColor: "var(--brand-primary)",
            borderWidth: "1px",
          }}
          icon={<FiHeart />}
          fullWidth={true}
        >
          {productInWishlist ? "In Wishlist" : "Add to Wishlist"}
        </Button>
      </div>

      {/* Share button */}
      <div
        className="flex items-center p-3 rounded-lg cursor-pointer transition-colors group"
        onClick={handleShareProduct}
        style={{
          backgroundColor: "var(--bg-primary)",
          borderWidth: "1px",
          borderColor: "var(--border-color)",
        }}
      >
        <div
          className="p-2 rounded-full mr-3"
          style={{
            backgroundColor: "var(--bg-accent-light)",
            color: "var(--brand-primary)",
          }}
        >
          <FiShare2 className="text-lg" />
        </div>
        <span
          className="font-medium group-hover:underline"
          style={{ color: "var(--text-primary)" }}
        >
          Share this product
        </span>
      </div>

      {/* Delivery and services information */}
      <div className="space-y-3 pt-2">
        <div className="flex items-start">
          <div
            className="p-1 rounded-full mr-3 mt-1"
            style={{
              backgroundColor: "var(--bg-accent-light)",
              color: "var(--brand-primary)",
            }}
          >
            <FiTruck className="text-sm" />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Free Delivery
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Delivery within 2-4 business days
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div
            className="p-1 rounded-full mr-3 mt-1"
            style={{
              backgroundColor: "var(--bg-accent-light)",
              color: "var(--brand-primary)",
            }}
          >
            <FiCreditCard className="text-sm" />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Secure Payment
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              All major credit cards accepted
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div
            className="p-1 rounded-full mr-3 mt-1"
            style={{
              backgroundColor: "var(--bg-accent-light)",
              color: "var(--brand-primary)",
            }}
          >
            <FiShield className="text-sm" />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              2 Year Warranty
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Manufacturer warranty included
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div
            className="p-1 rounded-full mr-3 mt-1"
            style={{
              backgroundColor: "var(--bg-accent-light)",
              color: "var(--brand-primary)",
            }}
          >
            <FiGift className="text-sm" />
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Gift Packaging
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Available for ₹99 extra
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductActionsIntegrated;
