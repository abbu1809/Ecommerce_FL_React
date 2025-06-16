import React from "react";
import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiChevronRight,
} from "react-icons/fi";
import {
  FaAndroid,
  FaGlobe,
  FaApple,
  FaWhatsapp,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
  FaCommentAlt,
} from "react-icons/fa";
import { ROUTES } from "../utils/constants";
import Logo from "./ui/Logo";

const Footer = () => {
  // Quick Links data
  const quickLinks = [
    { name: "Home", path: ROUTES.HOME },
    { name: "About", path: ROUTES.ABOUT },
    { name: "Contact", path: ROUTES.CONTACT },
  ];

  // Customer Service links data
  const customerServiceLinks = [
    { name: "Track Your Order", path: ROUTES.TRACK_ORDER },
    { name: "Bulk Orders", path: ROUTES.BULK_ORDER },
  ];

  // Policies links data
  const policyLinks = [
    { name: "Terms & Conditions", path: "/terms-conditions" },
    {
      name: "Cancellation & Refund Policy",
      path: "/cancellation-refund-policy",
    },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Shipping & Delivery Policy", path: "/shipping-delivery-policy" },
  ];

  // Know More links data
  const knowMoreLinks = [
    { name: "Our Stores", path: "/our-stores" },
    { name: "Service Center", url: "https://www.poorvika.com/service-center" },
  ];

  // Social media links
  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://facebook.com", label: "Facebook" },
    { icon: <FaTwitter />, url: "https://twitter.com", label: "Twitter" },
    { icon: <FaInstagram />, url: "https://instagram.com", label: "Instagram" },
    { icon: <FaYoutube />, url: "https://youtube.com", label: "YouTube" },
    { icon: <FaLinkedinIn />, url: "https://linkedin.com", label: "LinkedIn" },
  ];

  // Footer policy links
  const footerPolicyLinks = [
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Use", path: "/terms-conditions" },
    { name: "Warranty Policy", path: "/warranty-policy" },
  ];

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
        className="pt-16 pb-1"
        style={{
          backgroundColor: "var(--bg-dark)",
          color: "var(--text-on-dark-bg)",
        }}
      >
        <div className="container mx-auto px-4">
          {/* Top footer section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
            {/* Company info */}
            <div className="space-y-5 lg:col-span-2">
              <Logo linkWrapper={false} />
              <p
                className="text-sm max-w-xs"
                style={{ color: "var(--text-on-dark-bg)", lineHeight: "1.6" }}
              >
                Your trusted electronics partner offering the latest mobiles,
                laptops, and accessories at competitive prices with excellent
                customer service.
              </p>{" "}
              <div
                className="flex space-x-4 pt-2"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                {[
                  {
                    icon: <FaAndroid />,
                    label: "Android",
                    url: "https://android.com",
                  },
                  {
                    icon: <FaGlobe />,
                    label: "Web",
                    url: "https://web.dev",
                  },
                  {
                    icon: <FaApple />,
                    label: "iOS",
                    url: "https://apple.com/ios",
                  },
                ].map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      color: "var(--text-on-dark-bg)",
                    }}
                    aria-label={platform.label}
                  >
                    {platform.icon}
                  </a>
                ))}
              </div>
              {/* WhatsApp Channel Section */}
              <div className="mt-4 pt-3 border-t border-gray-700">
                <a
                  href="https://whatsapp.com/channel/YOUR_CHANNEL_ID_HERE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  <FaWhatsapp className="text-lg" />
                  <span className="text-sm font-medium">
                    Join WhatsApp channel for offers & updates
                  </span>
                </a>
              </div>
            </div>
            {/* Quick Links */}
            <div className="space-y-4">
              <h3
                className="font-semibold text-lg relative inline-block pb-2"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Store
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-3/4"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm transition-colors duration-300 hover:text-white"
                      style={{ color: "var(--text-on-dark-bg)" }}
                    >
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
                Help
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-3/4"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
              </h3>
              <ul className="space-y-3">
                {customerServiceLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm transition-colors duration-300 hover:text-white"
                      style={{ color: "var(--text-on-dark-bg)" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Policies */}
            <div className="space-y-4">
              <h3
                className="font-semibold text-lg relative inline-block pb-2"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Policies
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-3/4"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
              </h3>
              <ul className="space-y-3">
                {policyLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-sm transition-colors duration-300 hover:text-white"
                      style={{ color: "var(--text-on-dark-bg)" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Know More */}
            <div className="space-y-4">
              <h3
                className="font-semibold text-lg relative inline-block pb-2"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Know More
                <span
                  className="absolute bottom-0 left-0 h-0.5 w-3/4"
                  style={{ backgroundColor: "var(--brand-primary)" }}
                />
              </h3>
              <ul className="space-y-3">
                {knowMoreLinks.map((link) => (
                  <li key={link.name}>
                    {link.path ? (
                      <Link
                        to={link.path}
                        className="text-sm transition-colors duration-300 hover:text-white"
                        style={{ color: "var(--text-on-dark-bg)" }}
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors duration-300 hover:text-white"
                        style={{ color: "var(--text-on-dark-bg)" }}
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact Us */}
            {/* <div className="space-y-4">
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
            </div> */}{" "}
          </div>
        </div>
      </div>{" "}
      {/* New bottom footer - based on image */}
      <div className="py-6 bg-blue-50 text-gray-700 w-full relative">
        {/* WhatsApp and Chat icons - positioned at right side */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
            aria-label="Contact us on WhatsApp"
          >
            <FaWhatsapp size={20} />
          </a>
          <a
            href="#chat"
            className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
            aria-label="Open chat"
          >
            <FaCommentAlt size={18} />
          </a>
        </div>

        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-6">
            {/* Social section - centered */}
            <div className="flex flex-col items-center gap-4">
              <h4 className="text-sm font-medium">Let's get social</h4>
              <div className="flex items-center gap-6">
                {socialLinks.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xl hover:text-blue-600 transition-colors duration-300"
                    aria-label={item.label}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>{" "}
            {/* Policy links - centered below social */}
            <div className="flex flex-wrap justify-center gap-4">
              {footerPolicyLinks.map((link, index) => (
                <React.Fragment key={link.name}>
                  <Link to={link.path} className="text-xs hover:underline">
                    {link.name}
                  </Link>
                  {index < footerPolicyLinks.length - 1 && (
                    <span className="text-xs">•</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Copyright section */}
            <div className="text-center pt-4 border-t border-gray-300">
              <p className="text-xs text-gray-600">
                Copyright © Anand mobiles | All Rights Reserved | Developed By :
                <Link to="https://byteversal.in/">Byteversal.in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
