import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  variant = "primary",
  isLoading = false,
  fullWidth = true,
  size = "md",
  icon = null,
}) => {
  const baseClasses =
    "flex justify-center items-center font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ";

  const variants = {
    primary:
      "text-white bg-teal-600 hover:bg-teal-700 focus:ring-teal-500 border-transparent",
    secondary:
      "text-teal-700 bg-white hover:bg-gray-50 focus:ring-teal-500 border border-teal-600",
    outline:
      "text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 focus:ring-teal-500",
    danger:
      "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 border-transparent",
  };

  const sizes = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-2.5 px-5 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
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

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${
        sizes[size]
      } ${widthClass} ${className} ${
        disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {isLoading && <LoadingSpinner />}
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
