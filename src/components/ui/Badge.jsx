import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  rounded = "md",
  subtle = false,
  bordered = false,
  dot = false,
  icon,
}) => {
  const variantColors = {
    primary: {
      solid: "bg-primary-500 text-white",
      subtle: "bg-primary-50 text-primary-700",
      bordered: "bg-white text-primary-700 border border-primary-500",
    },
    secondary: {
      solid: "bg-secondary-500 text-white",
      subtle: "bg-secondary-50 text-secondary-700",
      bordered: "bg-white text-secondary-700 border border-secondary-500",
    },
    success: {
      solid: "bg-emerald-500 text-white",
      subtle: "bg-emerald-50 text-emerald-700",
      bordered: "bg-white text-emerald-700 border border-emerald-500",
    },
    danger: {
      solid: "bg-rose-500 text-white",
      subtle: "bg-rose-50 text-rose-700",
      bordered: "bg-white text-rose-700 border border-rose-500",
    },
    warning: {
      solid: "bg-amber-500 text-white",
      subtle: "bg-amber-50 text-amber-700",
      bordered: "bg-white text-amber-700 border border-amber-500",
    },
    info: {
      solid: "bg-sky-500 text-white",
      subtle: "bg-sky-50 text-sky-700",
      bordered: "bg-white text-sky-700 border border-sky-500",
    },
    gray: {
      solid: "bg-gray-600 text-white",
      subtle: "bg-gray-100 text-gray-700",
      bordered: "bg-white text-gray-700 border border-gray-400",
    },
  };

  const sizes = {
    xs: "px-1.5 py-0.5 text-xs",
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-sm",
  };

  const roundedOptions = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded",
    lg: "rounded-md",
    full: "rounded-full",
  };

  let style = bordered ? "bordered" : subtle ? "subtle" : "solid";

  const baseClasses =
    "inline-flex items-center font-medium transition-all duration-200 shadow-sm";
  const badgeClasses = `${baseClasses} ${variantColors[variant][style]} ${sizes[size]} ${roundedOptions[rounded]} ${className}`;
  return (
    <motion.span
      className={badgeClasses}
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {dot && (
        <span
          className={`inline-block w-2 h-2 rounded-full mr-1.5 ${
            subtle
              ? `bg-${variant}-600`
              : bordered
              ? `bg-${variant}-600`
              : "bg-white"
          }`}
        />
      )}
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </motion.span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "gray",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg"]),
  className: PropTypes.string,
  rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "full"]),
  subtle: PropTypes.bool,
  bordered: PropTypes.bool,
  dot: PropTypes.bool,
  icon: PropTypes.node,
};

export default Badge;
