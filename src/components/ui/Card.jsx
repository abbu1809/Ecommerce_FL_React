import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Card = ({
  children,
  variant = "default",
  className = "",
  padding = "md",
  shadow = "md",
  radius = "md",
  isHoverable = false,
  isInteractive = false,
  onClick,
}) => {
  const variants = {
    default: "bg-white",
    outline: "bg-white border border-gray-200",
    filled: "bg-gray-50",
    colored: "bg-primary-50",
    accent: "bg-gradient-to-br from-primary-50 to-secondary-50",
  };

  const shadows = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    color: "shadow-color",
  };

  const paddings = {
    none: "p-0",
    xs: "p-2",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
  };

  const radiusOptions = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    "3xl": "rounded-3xl",
    full: "rounded-full",
  };
  const baseClasses = "overflow-hidden transition-all duration-300";
  const cardClasses = `${baseClasses} ${radiusOptions[radius]} ${
    variants[variant]
  } ${shadows[shadow]} ${paddings[padding]} ${className} ${
    isInteractive ? "cursor-pointer" : ""
  }`;

  return (
    <motion.div
      className={cardClasses}
      whileHover={
        isHoverable
          ? {
              y: -5,
              boxShadow:
                "0 15px 30px -8px rgba(0, 0, 0, 0.1), 0 10px 15px -5px rgba(0, 0, 0, 0.05)",
            }
          : isInteractive
          ? {
              y: -2,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
            }
          : {}
      }
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={isInteractive || onClick ? onClick : undefined}
    >
      {children}
    </motion.div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "default",
    "outline",
    "filled",
    "colored",
    "accent",
  ]),
  className: PropTypes.string,
  padding: PropTypes.oneOf(["none", "xs", "sm", "md", "lg", "xl"]),
  shadow: PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "color"]),
  radius: PropTypes.oneOf([
    "none",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl",
    "full",
  ]),
  isHoverable: PropTypes.bool,
  isInteractive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Card;
