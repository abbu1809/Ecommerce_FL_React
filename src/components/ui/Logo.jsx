import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLogoStore } from "../../store/Admin/useLogoStore";

const Logo = ({ size = "medium", linkWrapper = true }) => {
  const { logo, loading, fetchLogo } = useLogoStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only fetch logo if it hasn't been loaded yet and we're not already loading
    if (!logo && !loading && !hasInitialized.current) {
      hasInitialized.current = true;
      fetchLogo();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Expanded horizontal logo sizes for better header presence
  const logoSizes = {
    small: "h-8 w-24",
    medium: "h-12 w-36", 
    large: "h-16 w-48",
  };

  const content = (
    <>
      <div className="relative">
        <img
          src={logo || "/logo.jpg"}
          alt="Anand Mobiles"
          className={`${logoSizes[size]} object-contain rounded-md transition-transform duration-300 hover:scale-105`}
          style={{
            borderRadius: "var(--rounded-md)",
            boxShadow: "var(--shadow-small)",
          }}
        />
      </div>
      {/* Removed text, keeping only logo image */}
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
