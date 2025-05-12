import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiShoppingBag } from "react-icons/fi";
import { Badge, Tooltip } from "../ui";

const CartIcon = ({ totalItems = 0 }) => {
  // Animation for cart bounce when item is added
  const bounceAnimation =
    totalItems > 0
      ? {
          y: [0, -8, 0],
          transition: { duration: 0.5, ease: "easeInOut" },
        }
      : {};
  return (
    <motion.div
      className="relative"
      {...bounceAnimation}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Tooltip
        content={`${totalItems} ${totalItems === 1 ? "item" : "items"} in cart`}
        placement="bottom"
      >
        <Link
          to="/cart"
          className="flex items-center px-3 py-1.5 rounded-full bg-primary-50 text-primary-600 hover:bg-primary-100 transition-all duration-300"
        >
          <motion.div
            whileHover={{ rotate: [0, -15, 15, -10, 0], scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <FiShoppingBag size={20} className="mr-1.5" />
          </motion.div>
          <span className="hidden sm:inline font-medium">Cart</span>

          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                className="ml-2 bg-primary-600 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                {totalItems}
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </Tooltip>
    </motion.div>
  );
};

export default CartIcon;
