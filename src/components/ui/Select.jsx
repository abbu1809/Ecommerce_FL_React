import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FiChevronDown } from "react-icons/fi";
import { theme } from "../../theme";

const Select = ({
  id,
  name,
  options,
  value,
  onChange,
  label,
  placeholder = "Select an option",
  error,
  className = "",
  leftIcon,
  isFullWidth = false,
  isDisabled = false,
  isRequired = false,
  ...props
}) => {
  return (
    <div className={`${isFullWidth ? "w-full" : ""} ${className}`}>
      {label && (
        <label
          htmlFor={id || name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {isRequired && <span className="text-rose-600 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-md">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <div className="relative">
          <motion.select
            id={id || name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={isDisabled}
            required={isRequired}
            className={`shadow-sm block rounded-md border focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 ${
              leftIcon ? "pl-10" : "pl-4"
            } pr-10 py-2 ${error ? "border-rose-500" : "border-gray-300"} ${
              isFullWidth ? "w-full" : ""
            } ${
              isDisabled
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white"
            } appearance-none`}
            whileFocus={{
              boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`,
            }}
            style={{ WebkitAppearance: "none" }}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <FiChevronDown size={18} />
          </div>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-rose-600" id={`${id || name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

Select.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  leftIcon: PropTypes.node,
  isFullWidth: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};

export default Select;
