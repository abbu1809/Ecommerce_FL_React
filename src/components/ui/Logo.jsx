import React from "react";
import { Link } from "react-router-dom";

const Logo = ({ size = "medium" }) => {
  const sizes = {
    small: "h-8 w-auto",
    medium: "h-12 w-auto",
    large: "h-16 w-auto",
  };

  return (
    <Link to="/" className="flex items-center">
      <img
        src="/logo.jpg"
        alt="Anand Mobiles"
        className={`${sizes[size]} rounded-md`}
      />
      <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:inline-block">
        Anand Mobiles
      </span>
    </Link>
  );
};

export default Logo;
