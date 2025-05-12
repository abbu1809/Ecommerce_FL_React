import React from "react";
import PropTypes from "prop-types";

const Skeleton = ({
  variant = "rectangular",
  width,
  height,
  borderRadius = "md",
  animation = "pulse",
  className = "",
  children,
}) => {
  const radiusClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    full: "rounded-full",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "before:absolute before:inset-0 before:-translate-x-full before:animate-[wave_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent relative overflow-hidden",
    none: "",
  };

  const variants = {
    text: "h-4 bg-gray-200",
    rectangular: "bg-gray-200",
    circular: `${radiusClasses.full} bg-gray-200`,
  };

  const classes = `${variants[variant]} ${
    radiusClasses[variant === "circular" ? "full" : borderRadius]
  } ${animationClasses[animation]} ${className}`;

  const inlineStyle = {
    width: width,
    height: height,
  };

  return (
    <div className={classes} style={inlineStyle}>
      {children}
    </div>
  );
};

// For creating a skeleton group with specific layout
export const SkeletonGroup = ({ className = "", children }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(["text", "rectangular", "circular"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  borderRadius: PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "full"]),
  animation: PropTypes.oneOf(["pulse", "wave", "none"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

SkeletonGroup.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default Skeleton;
