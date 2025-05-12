import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { theme } from "../../theme";

const Radio = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className = "",
  isDisabled = false,
  isRequired = false,
  ...props
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="relative flex items-center">
        <input
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          className="sr-only"
          {...props}
        />
        <motion.div
          className={`h-5 w-5 flex items-center justify-center rounded-full border ${
            checked
              ? `border-primary-600 ${
                  !isDisabled && "hover:border-primary-700"
                }`
              : `border-gray-300 ${!isDisabled && "hover:border-primary-500"}`
          } ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          whileHover={
            !isDisabled
              ? { boxShadow: `0 0 0 3px ${theme.colors.primary[100]}` }
              : {}
          }
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
        >
          {checked && (
            <div
              className={`h-3 w-3 rounded-full ${
                isDisabled ? "bg-primary-400" : "bg-primary-600"
              }`}
            ></div>
          )}
        </motion.div>
      </div>
      {label && (
        <label
          htmlFor={id}
          className={`ml-2 text-sm ${
            isDisabled ? "text-gray-400" : "text-gray-700"
          } ${!isDisabled && "cursor-pointer"}`}
        >
          {label}
          {isRequired && <span className="text-rose-600 ml-1">*</span>}
        </label>
      )}
    </div>
  );
};

Radio.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};

export default Radio;
