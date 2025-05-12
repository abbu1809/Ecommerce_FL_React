import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { FiCheck } from "react-icons/fi";
import { theme } from "../../theme";

const Checkbox = ({
  id,
  name,
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
          id={id || name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={isDisabled}
          required={isRequired}
          className="sr-only"
          {...props}
        />
        <motion.div
          className={`h-5 w-5 flex items-center justify-center rounded border ${
            checked
              ? `bg-primary-600 border-primary-600 ${
                  !isDisabled && "hover:bg-primary-700 hover:border-primary-700"
                }`
              : `bg-white border-gray-300 ${
                  !isDisabled && "hover:border-primary-500"
                }`
          } ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          whileHover={
            !isDisabled && !checked
              ? { boxShadow: `0 0 0 3px ${theme.colors.primary[100]}` }
              : {}
          }
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
        >
          {checked && (
            <FiCheck
              size={14}
              className="text-white"
              style={{ strokeWidth: 3 }}
            />
          )}
        </motion.div>
      </div>
      {label && (
        <label
          htmlFor={id || name}
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

Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};

export default Checkbox;
