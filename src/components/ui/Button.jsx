import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const variants = {
  primary:
    "bg-primary-600  hover:bg-primary-700 focus:ring-primary-500 shadow-sm",
  secondary:
    "bg-secondary-500  hover:bg-secondary-600 focus:ring-secondary-400 shadow-sm",
  outline:
    "bg-white text-primary-600 border border-primary-600 hover:bg-primary-50 focus:ring-primary-500",
  subtle:
    "bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-500",
  gray: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500",
  success:
    "bg-emerald-600  hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm",
  danger:
    "bg-rose-600  hover:bg-rose-700 focus:ring-rose-500 shadow-sm",
  warning:
    "bg-amber-500  hover:bg-amber-600 focus:ring-amber-400 shadow-sm",
  ghost:
    "bg-transparent text-primary-600 hover:bg-primary-50 hover:text-primary-700 focus:ring-primary-500",
  link: "bg-transparent text-primary-600 hover:text-primary-700 underline focus:ring-primary-500 shadow-none p-0",
};

const sizes = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-2.5 text-lg",
  xl: "px-6 py-3 text-xl",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  leftIcon,
  rightIcon,
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  rounded = "md",
  href,
  type = "button",
  animateScale = true,
  onClick,
  ...props
}) => {
  const roundedOptions = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1";
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${
    roundedOptions[rounded]
  } ${isFullWidth ? "w-full" : ""} ${
    isDisabled || isLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
  } ${className}`;

  const motionProps =
    animateScale && !isDisabled && !isLoading
      ? {
          whileHover: { scale: 1.02, transition: { duration: 0.2 } },
          whileTap: { scale: 0.98, transition: { duration: 0.1 } },
        }
      : {};
  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Button content
  const ButtonContent = () => (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </>
  );

  if (href && !isDisabled && !isLoading) {
    return (
      <motion.a
        href={href}
        className={buttonClasses}
        {...motionProps}
        {...props}
      >
        <ButtonContent />
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={isDisabled || isLoading}
      onClick={isDisabled || isLoading ? undefined : onClick}
      {...motionProps}
      {...props}
    >
      <ButtonContent />
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "outline",
    "subtle",
    "gray",
    "success",
    "danger",
    "warning",
    "ghost",
    "link",
  ]),
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  isFullWidth: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "full"]),
  href: PropTypes.string,
  type: PropTypes.string,
  animateScale: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
