import React from "react";
import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";
import { ROUTES } from "../utils/constants";

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
      <span
        style={{ color: "var(--brand-primary)" }}
        className="ml-2 text-xl font-bold text-gray-900 hidden sm:inline-block"
      >
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

const Footer = () => {
  // Quick Links data
  const quickLinks = [
    { name: "Home", path: ROUTES.HOME },
    { name: "Products", path: ROUTES.PRODUCTS },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQs", path: "/faqs" },
  ];

  // Customer Service links data
  const customerServiceLinks = [
    { name: "My Account", path: ROUTES.PROFILE },
    { name: "Orders & Returns", path: ROUTES.ORDERS },
    { name: "Shopping Cart", path: ROUTES.CART },
    { name: "Wishlist", path: "/wishlist" },
    { name: "Support Center", path: "/support" },
  ];

  // Payment methods
  const paymentMethods = [
    "Visa",
    "Mastercard",
    "UPI",
    "PayTM",
    "PhonePe",
    "Cash On Delivery",
  ];

  // Special policies
  const specialPolicies = [
    "No return policy",
    "OTP verification before delivery",
    "Product unboxing in front of customer",
    "Extended warranty options available",
  ];

  return (
    <footer
      className="py-10 shadow-inner"
      style={{
        backgroundColor: "var(--bg-dark)",
        color: "var(--text-on-dark-bg)",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo linkWrapper={false} className="mb-4" />
            <p
              className="text-sm max-w-xs mb-4"
              style={{ color: "var(--text-on-dark-bg)" }}
            >
              Your trusted electronics partner offering the latest mobiles,
              laptops, and accessories at competitive prices with excellent
              customer service.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-on-dark-bg)" }}
                aria-label="Facebook"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-on-dark-bg)" }}
                aria-label="Instagram"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-on-dark-bg)" }}
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                style={{ color: "var(--text-on-dark-bg)" }}
                aria-label="YouTube"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3
              className="font-semibold text-lg mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-orange-400 transition-colors flex items-center"
                    style={{ color: "var(--text-on-dark-bg)" }}
                  >
                    <span
                      className="mr-2 text-orange-500"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      ›
                    </span>{" "}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="font-semibold text-lg mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Customer Service
            </h3>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-orange-400 transition-colors flex items-center"
                    style={{ color: "var(--text-on-dark-bg)" }}
                  >
                    <span
                      className="mr-2 text-orange-500"
                      style={{ color: "var(--brand-primary)" }}
                    >
                      ›
                    </span>{" "}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              className="font-semibold text-lg mb-4"
              style={{ color: "var(--brand-primary)" }}
            >
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li>
                <div className="flex items-center group">
                  <FiPhone
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  <a
                    href="tel:1800-123-4567"
                    className="text-sm hover:text-orange-400 transition-colors"
                    style={{ color: "var(--text-on-dark-bg)" }}
                  >
                    1800-123-4567
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center group">
                  <FiMail
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  <a
                    href="mailto:info@anandmobiles.com"
                    className="text-sm hover:text-orange-400 transition-colors"
                    style={{ color: "var(--text-on-dark-bg)" }}
                  >
                    info@anandmobiles.com
                  </a>
                </div>
              </li>
              <li>
                <div className="flex group">
                  <FiMapPin
                    className="w-4 h-4 mr-2 flex-shrink-0 mt-1"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-on-dark-bg)" }}
                  >
                    123 Retail Park, Main Street,
                    <br /> Bhopal, MP - 462001
                  </p>
                </div>
              </li>
              <li>
                <div className="flex items-center group">
                  <FiClock
                    className="w-4 h-4 mr-2 flex-shrink-0"
                    style={{ color: "var(--brand-primary)" }}
                  />
                  <p
                    className="text-sm"
                    style={{ color: "var(--text-on-dark-bg)" }}
                  >
                    Mon-Sat: 10:00 AM - 8:00 PM
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="border-t border-b py-6 mb-6 transition-all"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="flex flex-col items-center">
            <p
              className="text-sm mb-4 text-center font-medium"
              style={{ color: "var(--brand-primary)" }}
            >
              Payment Methods Accepted
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {paymentMethods.map((payment) => (
                <span
                  key={payment}
                  className="px-3 py-1.5 text-xs rounded-md transition-transform hover:scale-105"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    color: "var(--text-on-dark-bg)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {payment}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mb-6 p-4 rounded-lg transition-all hover:shadow-md"
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.2)",
          }}
        >
          <h4
            className="font-medium text-center mb-3"
            style={{ color: "var(--brand-primary)" }}
          >
            Special Policies
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {specialPolicies.map((policy) => (
              <li
                key={policy}
                className="text-xs flex items-center justify-center text-center px-2 py-1 rounded-md"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  color: "var(--text-on-dark-bg)",
                }}
              >
                <span
                  className="mr-1 text-sm"
                  style={{ color: "var(--brand-primary)" }}
                >
                  •
                </span>
                {policy}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="text-center text-xs"
          style={{ color: "var(--text-on-dark-bg)" }}
        >
          <p
            className="hover:text-orange-400 transition-colors mb-2"
            style={{ color: "var(--text-on-dark-bg)" }}
          >
            &copy; {new Date().getFullYear()} Anand Mobiles. All rights
            reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            <Link
              to="/privacy-policy"
              className="hover:text-orange-400 transition-colors"
              style={{ color: "var(--text-on-dark-bg)" }}
            >
              Privacy Policy
            </Link>
            <span style={{ color: "var(--text-on-dark-bg)" }}>•</span>
            <Link
              to="/terms-conditions"
              className="hover:text-orange-400 transition-colors"
              style={{ color: "var(--text-on-dark-bg)" }}
            >
              Terms & Conditions
            </Link>
            <span style={{ color: "var(--text-on-dark-bg)" }}>•</span>
            <Link
              to="/return-policy"
              className="hover:text-orange-400 transition-colors"
              style={{ color: "var(--text-on-dark-bg)" }}
            >
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
