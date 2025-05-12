import React from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { Card, Button, Badge, Tooltip } from "./ui";

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    toast.success(`Added ${product?.name || "Product"} to cart!`);
  };

  const handleAddToWishlist = () => {
    toast.success(`${product?.name || "Product"} added to wishlist!`);
  };
  return (
    <Card
      variant="default"
      shadow="lg"
      padding="none"
      radius="xl"
      isHoverable={true}
      isInteractive={true}
      className="overflow-hidden bg-white h-full flex flex-col transition-all duration-300 border border-gray-100"
    >
      <div className="relative overflow-hidden group">
        <img
          src={product?.image || "https://via.placeholder.com/300x200"}
          alt={product?.name || "Product"}
          className="w-full h-56 object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {product?.isNew && (
          <div className="absolute top-3 left-3">
            <Badge variant="primary" size="sm" rounded="full" subtle={false}>
              New
            </Badge>
          </div>
        )}
        {product?.discount && (
          <div className="absolute top-3 left-3 ml-16">
            <Badge variant="danger" size="sm" rounded="full">
              -{product.discount}%
            </Badge>
          </div>
        )}

        <motion.div
          className="absolute top-3 right-3"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <motion.button
            className="bg-white p-2.5 rounded-full shadow-md text-gray-600 hover:text-rose-500 transition-all hover:bg-rose-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToWishlist}
          >
            <FiHeart />
          </motion.button>
        </motion.div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        {" "}
        <div className="flex items-center mb-2">
          <div className="flex text-amber-400 gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                className={i < (product?.rating || 4) ? "fill-current" : ""}
                size={14}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1.5">
            ({product?.reviewCount || 121})
          </span>
        </div>
        <Link to={`/products/${product?.id || 1}`} className="block group">
          <h2 className="text-lg font-semibold group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
            {product?.name || "Product Name"}
          </h2>
        </Link>
        <p className="text-gray-600 mt-1 text-sm line-clamp-2 h-10 flex-grow">
          {product?.description ||
            "Product description here - modern design with great features."}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="font-semibold text-lg text-gray-900">
              ${product?.price || "0.00"}
            </span>
            {product?.oldPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.oldPrice}
              </span>
            )}
          </div>

          <Button
            variant="primary"
            size="sm"
            rounded="full"
            leftIcon={<FiShoppingCart size={16} />}
            onClick={handleAddToCart}
          >
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
