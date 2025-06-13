import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogoStore } from "../../store/Admin/useLogoStore";

const Logo = ({ size = "medium", linkWrapper = true, titleColor }) => {
  const { logo, fetchLogo } = useLogoStore();

  useEffect(() => {
    fetchLogo();
  }, [fetchLogo]);

  const sizes = {
    small: "h-8 w-auto",
    medium: "h-12 w-auto",
    large: "h-16 w-auto",
  };

  // Use provided titleColor or default to brand primary color
  const textColor = titleColor || "var(--brand-primary)";

  const content = (
    <>
      <div className="relative">
        <img
          src={logo || "/logo.jpg"}
          alt="Anand Mobiles"
          className={`${sizes[size]} rounded-md transition-transform duration-300 hover:scale-105`}
          style={{
            borderRadius: "var(--rounded-md)",
            boxShadow: "var(--shadow-small)",
          }}
        />
      </div>
      <span
        className="ml-2.5 text-xl font-bold hidden sm:inline-block transition-colors duration-300"
        style={{ color: textColor }}
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
