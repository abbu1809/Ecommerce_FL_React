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
    "flex justify-center items-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ";

  // These variant classes are only used as fallbacks
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

  // Enhanced variants with CSS variables from index.css
  const enhancedVariants = {
    primary: "text-white hover:shadow-lg focus:ring-offset-1",
    secondary: "hover:shadow-md focus:ring-offset-1 border",
    outline: "hover:shadow-md focus:ring-offset-1 border",
    danger: "text-white hover:shadow-md focus:ring-offset-1",
  };

  const sizes = {
    sm: "py-2 px-4 text-xs",
    md: "py-2.5 px-5 text-sm",
    lg: "py-3.5 px-7 text-base",
  };

  const widthClass = fullWidth ? "w-full" : "";

  // Dynamic styling with CSS variables
  const getButtonStyle = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: "var(--brand-primary)",
          color: "var(--text-on-brand)",
          borderRadius: "var(--rounded-md)",
          boxShadow: "var(--shadow-small)",
          transform: disabled || isLoading ? "none" : "translateY(0)",
          transition:
            "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
        };
      case "secondary":
        return {
          backgroundColor: "var(--bg-primary)",
          color: "var(--brand-primary)",
          borderColor: "var(--brand-primary)",
          borderRadius: "var(--rounded-md)",
          boxShadow: "var(--shadow-small)",
          transform: disabled || isLoading ? "none" : "translateY(0)",
          transition:
            "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
        };
      case "outline":
        return {
          backgroundColor: "var(--bg-primary)",
          color: "var(--text-primary)",
          borderColor: "var(--border-primary)",
          borderRadius: "var(--rounded-md)",
          boxShadow: "var(--shadow-small)",
          transform: disabled || isLoading ? "none" : "translateY(0)",
          transition:
            "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
        };
      case "danger":
        return {
          backgroundColor: "var(--error-color)",
          color: "var(--text-on-brand)",
          borderRadius: "var(--rounded-md)",
          boxShadow: "var(--shadow-small)",
          transform: disabled || isLoading ? "none" : "translateY(0)",
          transition:
            "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
        };
      default:
        return {};
    }
  };

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
        enhancedVariants[variant]
      } ${sizes[size]} ${widthClass} ${className} ${
        disabled || isLoading ? "opacity-60 cursor-not-allowed" : ""
      } transform hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group`}
      style={getButtonStyle()}
    >
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 overflow-hidden rounded-md">
        <span className="absolute -inset-[100%] bg-white/20 transform rotate-45 transition-all origin-left scale-0 group-hover:scale-100 duration-500 group-active:duration-100"></span>
      </span>

      {/* Button content */}
      <span className="relative z-10 flex items-center justify-center">
        {isLoading && <LoadingSpinner />}
        {icon && !isLoading && (
          <span className="mr-2 flex items-center justify-center">{icon}</span>
        )}
        {children}
      </span>
    </button>
  );
};

export default Button;
