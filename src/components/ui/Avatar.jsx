import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Avatar = ({
  src,
  alt = "Avatar",
  size = "md",
  variant = "circle",
  status,
  className = "",
  fallback,
  onClick,
}) => {
  // Calculate size dimensions
  const sizeClasses = {
    xs: "h-6 w-6 text-xs",
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
    xl: "h-16 w-16 text-xl",
    "2xl": "h-20 w-20 text-2xl",
  };

  // Shape variants
  const variantClasses = {
    circle: "rounded-full",
    square: "rounded-md",
    rounded: "rounded-lg",
  };

  // Status indicator colors
  const statusColors = {
    online: "bg-emerald-500",
    offline: "bg-gray-400",
    busy: "bg-rose-500",
    away: "bg-amber-500",
  };

  // Generate initials from text if no image and fallback is provided
  const getInitials = (text) => {
    if (!text) return "";
    return text
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = fallback ? getInitials(fallback) : "";

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${sizeClasses[size]} ${variantClasses[variant]} bg-primary-100 text-primary-800 font-medium ${className}`}
      whileHover={onClick ? { scale: 1.05 } : {}}
      whileTap={onClick ? { scale: 0.95 } : {}}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : {}}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${variantClasses[variant]}`}
        />
      ) : (
        <span>{initials}</span>
      )}

      {status && (
        <span
          className={`absolute ${
            size === "xs" || size === "sm"
              ? "h-2 w-2 right-0 bottom-0"
              : "h-3 w-3 right-0 bottom-0"
          } ${statusColors[status]} border-2 border-white rounded-full`}
        />
      )}
    </motion.div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "2xl"]),
  variant: PropTypes.oneOf(["circle", "square", "rounded"]),
  status: PropTypes.oneOf(["online", "offline", "busy", "away"]),
  className: PropTypes.string,
  fallback: PropTypes.string,
  onClick: PropTypes.func,
};

export default Avatar;
