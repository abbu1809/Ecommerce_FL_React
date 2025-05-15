import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ size = "medium", linkWrapper = true }) => {
  const sizes = {
    small: "h-8 w-auto",
    medium: "h-12 w-auto",
    large: "h-16 w-auto",
  };

  const content = (
    <>
      <img
        src="/logo.jpg"
        alt="Anand Mobiles"
        className={`${sizes[size]} rounded-md`}
      />
      <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:inline-block">
        Anand Mobiles
      </span>
    </>
  );

  if (linkWrapper) {
    return (
      <Link to="/" className="flex items-center">
        {content}
      </Link>
    );
  }

  return <div className="flex items-center">{content}</div>;
};

export default Logo;
