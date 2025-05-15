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
      <div className="relative">
        <img
          src="/logo.jpg"
          alt="Anand Mobiles"
          className={`${sizes[size]} rounded-md transition-transform duration-300 hover:scale-105`}
          style={{
            borderRadius: "var(--rounded-md)",
            boxShadow: "var(--shadow-small)",
          }}
        />
      </div>
      <span
        className="ml-2.5 text-white text-xl font-bold hidden sm:inline-block transition-colors duration-300"
        
      >
        <span>Anand</span> Mobiles
      </span>
    </>
  );

  if (linkWrapper) {
    return (
      <Link
        to="/"
        className="flex items-center hover:opacity-90 transition-opacity duration-300"
        aria-label="Anand Mobiles Home"
      >
        {content}
      </Link>
    );
  }

  return <div className="flex items-center">{content}</div>;
};

export default Logo;
