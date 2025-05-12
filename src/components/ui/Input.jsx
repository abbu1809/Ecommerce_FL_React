import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Input = ({
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  error,
  className = "",
  leftIcon,
  rightIcon,
  isFullWidth = false,
  isDisabled = false,
  isRequired = false,
  ...props
}) => {
  const sizeClasses = {
    sm: `${leftIcon ? "pl-8" : "pl-3"} ${
      rightIcon ? "pr-8" : "pr-3"
    } py-1.5 text-sm`,
    md: `${leftIcon ? "pl-10" : "pl-4"} ${
      rightIcon ? "pr-10" : "pr-4"
    } py-2 text-base`,
    lg: `${leftIcon ? "pl-12" : "pl-5"} ${
      rightIcon ? "pr-12" : "pr-5"
    } py-2.5 text-lg`,
  };

  const size = props.size || "md";
  const rounded = props.rounded || "md";

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  return (
    <div className={`${isFullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {isRequired && <span className="text-rose-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div
            className={`absolute inset-y-0 left-0 ${
              size === "sm" ? "pl-2.5" : size === "lg" ? "pl-3.5" : "pl-3"
            } flex items-center pointer-events-none text-gray-400`}
          >
            {leftIcon}
          </div>
        )}
        <motion.input
          id={id || name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          className={`shadow-sm block ${
            roundedClasses[rounded]
          } border focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 ${
            sizeClasses[size]
          } ${error ? "border-rose-500" : "border-gray-300"} ${
            isFullWidth ? "w-full" : ""
          } ${
            isDisabled
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-white"
          } transition-all duration-200`}
          whileFocus={{
            boxShadow: "0 0 0 3px rgba(124, 58, 237, 0.15)",
          }}
          {...props}
        />
        {rightIcon && (
          <div
            className={`absolute inset-y-0 right-0 ${
              size === "sm" ? "pr-2.5" : size === "lg" ? "pr-3.5" : "pr-3"
            } flex items-center pointer-events-none text-gray-400`}
          >
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p
          className="mt-1.5 text-sm text-rose-600 flex items-center"
          id={`${id || name}-error`}
        >
          <svg
            className="w-3.5 h-3.5 mr-1.5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            ></path>
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  isFullWidth: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  rounded: PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "full"]),
};

export default Input;
