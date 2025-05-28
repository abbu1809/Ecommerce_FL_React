import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Button from "../../components/UI/Button";
import { useCartStore } from "../../store/useCart";
import { useWishlistStore } from "../../store/useWishlist";

const ProductCard = ({ product }) => {
  const { addItem: addToCart } = useCartStore();
  const {
    addItem: addToWishlist,
    isInWishlist,
    removeItem: removeFromWishlist,
  } = useWishlistStore();
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist!`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist!`);
    }
  };
  // Function to render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  return (
    <div
      className="rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{
        backgroundColor: "var(--bg-primary)",
        boxShadow: "var(--shadow-small)",
      }}
    >
      <Link to={`/products/${product.id}`} className="block relative group">
        <div className="bg-white p-4 flex items-center justify-center h-56">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-48 w-auto object-contain transform transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        {product.discount && (
          <span
            className="absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-md"
            style={{
              backgroundColor: "var(--error-color)",
              color: "white",
            }}
          >
            {product.discount} OFF
          </span>
        )}
      </Link>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-3">
            <p
              className="text-xs mb-1.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {product.brand} • {product.category}
            </p>
            <h3
              className="font-medium mb-1.5 line-clamp-2 min-h-[2.5rem]"
              style={{ color: "var(--text-primary)" }}
            >
              <Link to={`/products/${product.id}`}>{product.name}</Link>
            </h3>
            <div className="flex items-center mb-2.5">
              <div className="flex items-center">
                {renderStarRating(product.rating)}
              </div>
              <span
                className="text-xs ml-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {product.rating}
              </span>
            </div>
            <div className="flex items-center mb-3">
              <p
                className="font-bold text-lg"
                style={{ color: "var(--text-accent)" }}
              >
                ₹{product.discountPrice.toLocaleString()}
              </p>
              {product.discount && (
                <p
                  className="text-sm line-through ml-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  ₹{product.price.toLocaleString()}
                </p>
              )}
            </div>
          </div>{" "}
          <button
            onClick={handleWishlistToggle}
            className="flex items-center justify-center h-8 w-8 rounded-full transition-colors"
            style={{
              backgroundColor: isWishlisted
                ? "var(--brand-primary)"
                : "var(--bg-accent-light)",
              color: isWishlisted ? "white" : "var(--brand-primary)",
            }}
          >
            <FiHeart
              className={`text-lg ${isWishlisted ? "fill-current" : ""}`}
            />
          </button>
        </div>{" "}
        <div className="mt-3">
          <Button
            onClick={handleAddToCart}
            fullWidth={true}
            className="flex items-center justify-center"
            icon={<FiShoppingCart className="mr-1.5" />}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
