import React from "react";
import PropTypes from "prop-types";

const Divider = ({
  orientation = "horizontal",
  variant = "solid",
  color = "gray",
  thickness = "thin",
  className = "",
  withText,
  textPosition = "center",
}) => {
  const orientationClasses = {
    horizontal: "w-full my-2",
    vertical: "h-full mx-2 self-stretch",
  };

  const variantClasses = {
    solid: "",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };

  const colorClasses = {
    gray: "border-gray-200",
    primary: "border-primary-200",
    secondary: "border-secondary-200",
  };

  const thicknessClasses = {
    thin: orientation === "horizontal" ? "border-t" : "border-l",
    medium: orientation === "horizontal" ? "border-t-2" : "border-l-2",
    thick: orientation === "horizontal" ? "border-t-4" : "border-l-4",
  };

  const textPositionClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  if (withText && orientation === "horizontal") {
    return (
      <div className={`flex items-center ${className}`}>
        <div
          className={`flex-grow ${thicknessClasses[thickness]} ${variantClasses[variant]} ${colorClasses[color]}`}
        ></div>
        <span
          className={`px-3 text-sm text-gray-500 ${textPositionClasses[textPosition]}`}
        >
          {withText}
        </span>
        <div
          className={`flex-grow ${thicknessClasses[thickness]} ${variantClasses[variant]} ${colorClasses[color]}`}
        ></div>
      </div>
    );
  }

  return (
    <hr
      className={`${orientationClasses[orientation]} ${variantClasses[variant]} ${colorClasses[color]} ${thicknessClasses[thickness]} ${className}`}
      style={orientation === "vertical" ? { height: "100%" } : {}}
    />
  );
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(["horizontal", "vertical"]),
  variant: PropTypes.oneOf(["solid", "dashed", "dotted"]),
  color: PropTypes.oneOf(["gray", "primary", "secondary"]),
  thickness: PropTypes.oneOf(["thin", "medium", "thick"]),
  className: PropTypes.string,
  withText: PropTypes.node,
  textPosition: PropTypes.oneOf(["left", "center", "right"]),
};

export default Divider;
