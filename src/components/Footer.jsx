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
  FiArrowRight,
  FiChevronRight,
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

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Decorative elements */}
      <div
        className="absolute top-0 left-0 w-64 h-64 rounded-full opacity-5"
        style={{
          backgroundColor: "var(--brand-primary)",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full opacity-5"
        style={{
          backgroundColor: "var(--brand-primary)",
          transform: "translate(30%, 30%)",
        }}
      />

      {/* Main footer */}
      <div
        className="pt-16 pb-8"
        style={{
          backgroundColor: "var(--bg-dark)",
          color: "var(--text-on-dark-bg)",
        }}
      >
        <div className="container mx-auto px-4">
          {/* Top footer section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Company info */}
            <div className="space-y-5">
              <Logo linkWrapper={false} />
              <p
                className="text-sm max-w-xs"
                style={{ color: "var(--text-on-dark-bg)", lineHeight: "1.6" }}
              >
                Your trusted electronics partner offering the latest mobiles,
                laptops, and accessories at competitive prices with excellent
                customer service.
              </p>
              <div
                className="flex space-x-4 pt-2"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                {[
                  {
                    icon: <FiFacebook />,
                    label: "Facebook",
                    url: "https://facebook.com",
                  },
                  {
                    icon: <FiInstagram />,
                    label: "Instagram",
                    url: "https://instagram.com",
                  },
                  {
                    icon: <FiTwitter />,
                    label: "Twitter",
                    url: "https://twitter.com",
                  },
                  {
                    icon: <FiYoutube />,
                    label: "YouTube",
                    url: "https://youtube.com",
                  },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      color: "var(--text-on-dark-bg)",
                    }}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3
                className="font-semibold text-lg relative inline-block pb-2"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Quick Links
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-3/4"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name} className="group">
                    <Link
                      to={link.path}
                      className="text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300"
                      style={{ color: "var(--text-on-dark-bg)" }}
                    >
                      <FiChevronRight
                        style={{ color: "var(--brand-primary)" }}
                        className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div className="space-y-4">
              <h3
                className="font-semibold text-lg relative inline-block pb-2"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Customer Service
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-3/4"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
              </h3>
              <ul className="space-y-3">
                {customerServiceLinks.map((link) => (
                  <li key={link.name} className="group">
                    <Link
                      to={link.path}
                      className="text-sm flex items-center group-hover:translate-x-1 transition-transform duration-300"
                      style={{ color: "var(--text-on-dark-bg)" }}
                    >
                      <FiChevronRight
                        style={{ color: "var(--brand-primary)" }}
                        className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Us */}
            <div className="space-y-4">
              <h3
                className="font-semibold text-lg relative inline-block pb-2"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Contact Us
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-3/4"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="tel:1800-123-4567"
                    className="text-sm flex items-center transition-colors duration-300 hover:text-white"
                    style={{ color: "var(--text-on-dark-bg)" }}
                  >
                    <div
                      className="p-2 mr-3 rounded-full"
                      style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    >
                      <FiPhone
                        className="w-4 h-4"
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>
                    <span>1800-123-4567</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:info@anandmobiles.com"
                    className="text-sm flex items-center transition-colors duration-300 hover:text-white"
                    style={{ color: "var(--text-on-dark-bg)" }}
                  >
                    <div
                      className="p-2 mr-3 rounded-full"
                      style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    >
                      <FiMail
                        className="w-4 h-4"
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>
                    <span>info@anandmobiles.com</span>
                  </a>
                </li>
                <li>
                  <div className="text-sm flex transition-colors duration-300">
                    <div
                      className="p-2 mr-3 rounded-full flex-shrink-0 self-start mt-1"
                      style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    >
                      <FiMapPin
                        className="w-4 h-4"
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>
                    <span style={{ color: "var(--text-on-dark-bg)" }}>
                      123 Retail Park, Main Street,
                      <br /> Bhopal, MP - 462001
                    </span>
                  </div>
                </li>
                <li>
                  <div className="text-sm flex items-center transition-colors duration-300">
                    <div
                      className="p-2 mr-3 rounded-full"
                      style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
                    >
                      <FiClock
                        className="w-4 h-4"
                        style={{ color: "var(--brand-primary)" }}
                      />
                    </div>
                    <span style={{ color: "var(--text-on-dark-bg)" }}>
                      Mon-Sat: 10:00 AM - 8:00 PM
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Middle section - Payment methods */}
          <div
            className="rounded-2xl p-6 mb-8 relative overflow-hidden"
            style={{
              backgroundColor: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex flex-col items-center">
              <h4
                className="text-base font-medium mb-5 relative inline-block"
                style={{ color: "var(--brand-primary)" }}
              >
                Payment Methods We Accept
                <span
                  className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 h-0.5 w-1/2"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                ></span>
              </h4>
              <div className="flex flex-wrap justify-center gap-3">
                {paymentMethods.map((payment) => (
                  <span
                    key={payment}
                    className="px-4 py-2 text-sm rounded-md transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "var(--text-on-dark-bg)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {payment}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Policies section */}
          <div
            className="mb-8 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(245, 158, 11, 0.15)",
            }}
          >
            <h4
              className="font-medium text-center py-3"
              style={{
                color: "var(--text-on-brand)",
                backgroundColor: "var(--brand-primary)",
              }}
            >
              Our Store Policies
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4">
              {specialPolicies.map((policy) => (
                <div
                  key={policy}
                  className="text-sm flex items-center p-2 rounded-md"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    color: "var(--text-on-dark-bg)",
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  ></span>
                  {policy}
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div
            className="pt-6 border-t text-center"
            style={{
              borderColor: "rgba(255,255,255,0.08)",
              color: "var(--text-on-dark-bg)",
            }}
          >
            <p className="text-xs mb-3">
              &copy; {currentYear} Anand Mobiles. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <Link
                to="/privacy-policy"
                className="hover:text-white transition-colors duration-300"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-conditions"
                className="hover:text-white transition-colors duration-300"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Terms & Conditions
              </Link>
              <Link
                to="/return-policy"
                className="hover:text-white transition-colors duration-300"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Return Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
