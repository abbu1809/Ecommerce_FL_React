import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const Tooltip = ({
  children,
  content,
  placement = "top",
  delay = 0.2,
  dark = false,
  arrow = true,
  className = "",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  // Define placement styles
  const placementStyles = {
    top: {
      tooltip: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      arrow: "top-full left-1/2 transform -translate-x-1/2 -mt-[1px]",
      arrowInner: "border-t-gray-800 dark:border-t-gray-100",
    },
    bottom: {
      tooltip: "top-full left-1/2 transform -translate-x-1/2 mt-2",
      arrow: "bottom-full left-1/2 transform -translate-x-1/2 mb-[1px]",
      arrowInner: "border-b-gray-800 dark:border-b-gray-100",
    },
    left: {
      tooltip: "right-full top-1/2 transform -translate-y-1/2 mr-2",
      arrow: "left-full top-1/2 transform -translate-y-1/2 -ml-[1px]",
      arrowInner: "border-l-gray-800 dark:border-l-gray-100",
    },
    right: {
      tooltip: "left-full top-1/2 transform -translate-y-1/2 ml-2",
      arrow: "right-full top-1/2 transform -translate-y-1/2 mr-0",
      arrowInner: "border-r-gray-800 dark:border-r-gray-100",
    },
  };

  const tooltipVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            className={`absolute z-50 whitespace-nowrap ${placementStyles[placement].tooltip}`}
            variants={tooltipVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div
              className={`px-2 py-1 text-sm rounded shadow-md ${
                dark
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900 border border-gray-200"
              } ${className}`}
            >
              {content}
            </div>
            {arrow && (
              <div className={`absolute ${placementStyles[placement].arrow}`}>
                <div
                  className={`w-2 h-2 transform rotate-45 ${
                    dark ? "bg-gray-800" : "bg-white border border-gray-200"
                  }`}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  placement: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  delay: PropTypes.number,
  dark: PropTypes.bool,
  arrow: PropTypes.bool,
  className: PropTypes.string,
};

export default Tooltip;
