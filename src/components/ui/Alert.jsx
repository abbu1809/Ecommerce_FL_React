import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
  FiX,
} from "react-icons/fi";

const Alert = ({
  children,
  title,
  variant = "info",
  status = "subtle",
  showIcon = true,
  isDismissable = false,
  onDismiss,
  className = "",
  ...props
}) => {
  const icons = {
    info: <FiInfo className="h-5 w-5" />,
    success: <FiCheckCircle className="h-5 w-5" />,
    warning: <FiAlertCircle className="h-5 w-5" />,
    error: <FiXCircle className="h-5 w-5" />,
  };

  const variantStyles = {
    info: {
      solid: "bg-blue-500 text-white",
      subtle: "bg-blue-50 text-blue-800",
      outline: "border border-blue-500 text-blue-800 bg-white",
      left: "border-l-4 border-blue-500 bg-blue-50 text-blue-800",
    },
    success: {
      solid: "bg-emerald-500 text-white",
      subtle: "bg-emerald-50 text-emerald-800",
      outline: "border border-emerald-500 text-emerald-800 bg-white",
      left: "border-l-4 border-emerald-500 bg-emerald-50 text-emerald-800",
    },
    warning: {
      solid: "bg-amber-500 text-white",
      subtle: "bg-amber-50 text-amber-800",
      outline: "border border-amber-500 text-amber-800 bg-white",
      left: "border-l-4 border-amber-500 bg-amber-50 text-amber-800",
    },
    error: {
      solid: "bg-rose-500 text-white",
      subtle: "bg-rose-50 text-rose-800",
      outline: "border border-rose-500 text-rose-800 bg-white",
      left: "border-l-4 border-rose-500 bg-rose-50 text-rose-800",
    },
  };

  // Icon color depends on the variant and status
  const iconColorClasses = {
    info: {
      solid: "text-white",
      subtle: "text-blue-500",
      outline: "text-blue-500",
      left: "text-blue-500",
    },
    success: {
      solid: "text-white",
      subtle: "text-emerald-500",
      outline: "text-emerald-500",
      left: "text-emerald-500",
    },
    warning: {
      solid: "text-white",
      subtle: "text-amber-500",
      outline: "text-amber-500",
      left: "text-amber-500",
    },
    error: {
      solid: "text-white",
      subtle: "text-rose-500",
      outline: "text-rose-500",
      left: "text-rose-500",
    },
  };

  return (
    <motion.div
      className={`rounded-md p-4 flex ${variantStyles[variant][status]} ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      {...props}
    >
      {showIcon && (
        <div
          className={`flex-shrink-0 mr-3 ${iconColorClasses[variant][status]}`}
        >
          {icons[variant]}
        </div>
      )}

      <div className="flex-grow">
        {title && (
          <h3
            className={`text-sm font-medium ${
              status === "solid" ? "text-white" : ""
            }`}
          >
            {title}
          </h3>
        )}
        <div className={`${title ? "mt-1" : ""} text-sm`}>{children}</div>
      </div>

      {isDismissable && (
        <div className="pl-3 ml-auto">
          <button
            type="button"
            className={`inline-flex rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              status === "solid"
                ? "text-white focus:ring-white"
                : `text-${variant}-500 focus:ring-${variant}-500`
            }`}
            onClick={onDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <FiX className="h-4 w-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf(["info", "success", "warning", "error"]),
  status: PropTypes.oneOf(["solid", "subtle", "outline", "left"]),
  showIcon: PropTypes.bool,
  isDismissable: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};

export default Alert;
