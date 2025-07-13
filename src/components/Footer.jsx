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
import useFooter from "../hooks/useFooter";

const Footer = () => {
  const { footerData, loading, customPages } = useFooter();

  // Show simplified footer while loading
  if (loading) {
    return (
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="animate-pulse flex flex-col items-center justify-center">
            <div className="h-8 w-40 bg-gray-700 rounded mb-6"></div>
            <div className="h-4 w-3/4 md:w-1/2 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-2/3 md:w-1/3 bg-gray-700 rounded"></div>
          </div>
        </div>
      </footer>
    );
  }

  // Social media icons mapping
  const socialIconMapping = {
    FaFacebookF: <FaFacebookF />,
    FaTwitter: <FaTwitter />,
    FaInstagram: <FaInstagram />,
    FaYoutube: <FaYoutube />,
    FaLinkedinIn: <FaLinkedinIn />,
    FaWhatsapp: <FaWhatsapp />,
  };
  // Convert custom pages to link format with safety check
  const customPageLinks = (Array.isArray(customPages) && customPages.length > 0) 
    ? customPages.map((page) => ({
        name: page.title,
        path: `/${page.path}`,
        isCustom: true,
      })) 
    : [];

  // Fallback data in case API data is loading or unavailable with safety checks
  const quickLinks = (footerData && Array.isArray(footerData.quick_links)
    ? footerData.quick_links.filter((link) => link && link.enabled)
    : [
        { name: "Home", path: ROUTES.HOME },
        { name: "About", path: ROUTES.ABOUT },
        { name: "Contact", path: ROUTES.CONTACT },
      ]);

  const customerServiceLinks = (footerData && Array.isArray(footerData.customer_service_links)
    ? footerData.customer_service_links.filter((link) => link && link.enabled)
    : [
        { name: "Track Your Order", path: ROUTES.TRACK_ORDER },
        { name: "Bulk Orders", path: ROUTES.BULK_ORDER },
      ]);

  // Include both standard policy links and any custom pages that might be policies
  const policyLinks = [
    ...(footerData && Array.isArray(footerData.policy_links)
      ? footerData.policy_links.filter((link) => link && link.enabled)
      : [
          { name: "Terms & Conditions", path: "/terms-conditions" },
          {
            name: "Cancellation & Refund Policy",
            path: "/cancellation-refund-policy",
          },
          { name: "Privacy Policy", path: "/privacy-policy" },
          { name: "Shipping & Delivery Policy", path: "/shipping-delivery-policy" },
        ]),
    ...customPageLinks.filter(
      (page) =>
        page && page.name && (
          page.name.toLowerCase().includes("policy") ||
          page.name.toLowerCase().includes("terms")
        )
    ),
  ];

  // Include additional custom pages in the know more section
  const knowMoreLinks = [
    ...(footerData && Array.isArray(footerData.know_more_links)
      ? footerData.know_more_links.filter((link) => link && link.enabled)
      : [
          { name: "Our Stores", path: "/our-stores" },
          {
            name: "Service Center",
            url: "https://www.poorvika.com/service-center",
          },
        ]),
    ...customPageLinks.filter(
      (page) =>
        page && page.name && (
          !page.name.toLowerCase().includes("policy") &&
          !page.name.toLowerCase().includes("terms")
        )
    ),
  ];

  const socialLinks = (footerData && Array.isArray(footerData.social_links) 
    ? footerData.social_links
        .filter((link) => link && link.enabled)
        .map((link) => ({
          icon: socialIconMapping[link.icon] || <FaFacebookF />,
          url: link.url,
          label: link.name,
        }))
    : [
        { icon: <FaFacebookF />, url: "https://facebook.com", label: "Facebook" },
        { icon: <FaTwitter />, url: "https://twitter.com", label: "Twitter" },
        { icon: <FaInstagram />, url: "https://instagram.com", label: "Instagram" },
        { icon: <FaYoutube />, url: "https://youtube.com", label: "YouTube" },
        { icon: <FaLinkedinIn />, url: "https://linkedin.com", label: "LinkedIn" },
      ]);
      
  // Include both standard footer policy links and any custom pages that might be legal documents
  const footerPolicyLinks = [
    ...(footerData && Array.isArray(footerData.footer_policy_links)
      ? footerData.footer_policy_links.filter((link) => link && link.enabled)
      : [
          { name: "Privacy Policy", path: "/privacy-policy" },
          { name: "Terms of Use", path: "/terms-conditions" },
          { name: "Warranty Policy", path: "/warranty-policy" },
        ]),
    ...customPageLinks
      .filter(
        (page) =>
          page && page.name && (
            page.name.toLowerCase().includes("policy") ||
            page.name.toLowerCase().includes("terms") ||
            page.name.toLowerCase().includes("privacy") ||
            page.name.toLowerCase().includes("legal")
          )
        )
      .slice(0, 3), // Limit to 3 additional policy links to avoid making the footer too large
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
      
      {/* Newsletter Subscription Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">
                Stay Updated with Latest Offers!
              </h3>
              <p className="text-orange-100">
                Get exclusive deals and new product updates delivered to your inbox
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 md:w-80 px-4 py-3 rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-orange-500 font-semibold rounded-r-lg hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

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
            {footerData?.company_info?.enabled !== false && (
              <div className="space-y-5 lg:col-span-2">
                <Logo linkWrapper={false} />
                <p
                  className="text-sm max-w-xs"
                  style={{ color: "var(--text-on-dark-bg)", lineHeight: "1.6" }}
                >
                  {footerData?.company_info?.description ||
                    "Your trusted electronics partner offering the latest mobiles, laptops, and accessories at competitive prices with excellent customer service."}
                </p>
                
                {/* App Download Buttons */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-white">Download Our App</p>
                  <div className="flex space-x-3">
                    <a
                      href="https://play.google.com/store"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <FaAndroid className="text-green-400" />
                      <div className="text-xs">
                        <div>Get it on</div>
                        <div className="font-semibold">Google Play</div>
                      </div>
                    </a>
                    <a
                      href="https://apps.apple.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <FaApple className="text-white" />
                      <div className="text-xs">
                        <div>Download on the</div>
                        <div className="font-semibold">App Store</div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Store Links */}
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Store
              </h3>
              <ul className="space-y-2">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-sm transition-colors block py-1"
                      style={{ 
                        color: "var(--text-on-dark-bg)",
                        textDecoration: "none"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--brand-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-on-dark-bg)';
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="/our-stores"
                    className="text-sm transition-colors block py-1"
                    style={{ 
                      color: "var(--text-on-dark-bg)",
                      textDecoration: "none"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--brand-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-on-dark-bg)';
                    }}
                  >
                    Our Stores
                  </a>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Help
              </h3>
              <ul className="space-y-2">
                {customerServiceLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path}
                      className="text-sm transition-colors block py-1"
                      style={{ 
                        color: "var(--text-on-dark-bg)",
                        textDecoration: "none"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--brand-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-on-dark-bg)';
                      }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <a
                    href="/bulk-orders"
                    className="text-sm transition-colors block py-1"
                    style={{ 
                      color: "var(--text-on-dark-bg)",
                      textDecoration: "none"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--brand-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-on-dark-bg)';
                    }}
                  >
                    Bulk Orders
                  </a>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Policies
              </h3>
              <ul className="space-y-2">
                {policyLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.path || link.url || "#"}
                      className="text-sm transition-colors block py-1"
                      style={{ 
                        color: "var(--text-on-dark-bg)",
                        textDecoration: "none"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--brand-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-on-dark-bg)';
                      }}
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
                className="text-lg font-semibold"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Know More
              </h3>
              <ul className="space-y-2">
                {knowMoreLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url || link.path || "#"}
                      target={link.url ? "_blank" : "_self"}
                      rel={link.url ? "noopener noreferrer" : ""}
                      className="text-sm transition-colors block py-1"
                      style={{ 
                        color: "var(--text-on-dark-bg)",
                        textDecoration: "none"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--brand-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-on-dark-bg)';
                      }}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="https://www.poorvika.com/service-center"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm transition-colors block py-1"
                    style={{ 
                      color: "var(--text-on-dark-bg)",
                      textDecoration: "none"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = 'var(--brand-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = 'var(--text-on-dark-bg)';
                    }}
                  >
                    Service Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: "var(--text-on-dark-bg)" }}
              >
                Contact Us
              </h3>
              <div className="space-y-3">
                {footerData?.contact_info?.phone && (
                  <div className="flex items-center space-x-3">
                    <FiPhone
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <a
                      href={`tel:${footerData.contact_info.phone}`}
                      className="text-sm transition-colors"
                      style={{ color: "var(--text-on-dark-bg)" }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--brand-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-on-dark-bg)';
                      }}
                    >
                      {footerData.contact_info.phone}
                    </a>
                  </div>
                )}
                {footerData?.contact_info?.email && (
                  <div className="flex items-center space-x-3">
                    <FiMail
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <a
                      href={`mailto:${footerData.contact_info.email}`}
                      className="text-sm transition-colors"
                      style={{ color: "var(--text-on-dark-bg)" }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'var(--brand-primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-on-dark-bg)';
                      }}
                    >
                      {footerData.contact_info.email}
                    </a>
                  </div>
                )}
                {footerData?.contact_info?.address && (
                  <div className="flex items-start space-x-3">
                    <FiMapPin
                      className="w-5 h-5 flex-shrink-0 mt-0.5"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-on-dark-bg)" }}
                    >
                      {footerData.contact_info.address}
                    </span>
                  </div>
                )}
                {footerData?.contact_info?.hours && (
                  <div className="flex items-center space-x-3">
                    <FiClock
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: "var(--brand-primary)" }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: "var(--text-on-dark-bg)" }}
                    >
                      {footerData.contact_info.hours}
                    </span>
                  </div>
                )}

                {/* Social Media & Communication */}
                <div className="pt-4">
                  <h4 className="text-sm font-semibold mb-3 text-white">Follow Us</h4>
                  <div className="flex space-x-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110"
                        style={{
                          backgroundColor: "var(--brand-primary)",
                          color: "white",
                        }}
                        title={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                  
                  {/* WhatsApp Button */}
                  <div className="mt-4">
                    <a
                      href="https://wa.me/919876543210"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FaWhatsapp />
                      <span className="text-sm">WhatsApp Business</span>
                    </a>
                  </div>
                  
                  {/* Live Chat */}
                  <div className="mt-3">
                    <button className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                      <FaCommentAlt />
                      <span className="text-sm">Live Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div
        className="py-12"
        style={{
          backgroundColor: "var(--footer-bg)",
          color: "var(--text-on-dark-bg)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* WhatsApp Channel Section */}
            {footerData?.whatsapp?.enabled !== false && (
              <div className="space-y-4">
                <h3
                  className="font-semibold text-lg relative inline-block pb-2"
                  style={{ color: "var(--text-on-dark-bg)" }}
                >
                  Connect With Us
                  <span
                    className="absolute bottom-0 left-0 h-0.5 w-3/4"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  />
                </h3>
                <div className="mt-4 pt-3">
                  <a
                    href={
                      footerData?.whatsapp?.channel_url ||
                      "https://whatsapp.com/channel/YOUR_CHANNEL_ID_HERE"
                    }
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
            )}
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
              </h3>{" "}
              <ul className="space-y-3">
                {policyLinks.map((link) => (
                  <li key={link.name || link.path}>
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
                  <li key={link.name || link.path}>
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
            {/* Custom Pages - Only show if there are custom pages available */}
            {/* {customPages && customPages.length > 0 && (
              <div className="space-y-4">
                <h3
                  className="font-semibold text-lg relative inline-block pb-2"
                  style={{ color: "var(--text-on-dark-bg)" }}
                >
                  Pages
                  <span
                    className="absolute bottom-0 left-0 h-0.5 w-3/4"
                    style={{ backgroundColor: "var(--brand-primary)" }}
                  />
                </h3>
                <ul className="space-y-3">
                  {customPages.slice(0, 5).map((page) => (
                    <li key={page.path}>
                      <Link
                        to={`/${page.path}`}
                        className="text-sm transition-colors duration-300 hover:text-white"
                        style={{ color: "var(--text-on-dark-bg)" }}
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )} */}
            {/* Contact Us */}
            {footerData?.contact_info?.enabled && (
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
                  {footerData.contact_info.phone && (
                    <li>
                      <a
                        href={`tel:${footerData.contact_info.phone}`}
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
                        <span>{footerData.contact_info.phone}</span>
                      </a>
                    </li>
                  )}
                  {footerData.contact_info.email && (
                    <li>
                      <a
                        href={`mailto:${footerData.contact_info.email}`}
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
                        <span>{footerData.contact_info.email}</span>
                      </a>
                    </li>
                  )}
                  {footerData.contact_info.address && (
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
                          {footerData.contact_info.address}
                        </span>
                      </div>
                    </li>
                  )}

                  {footerData.contact_info.hours && (
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
                          {footerData.contact_info.hours}
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* New bottom footer - based on image */}
      <div className="py-6 bg-blue-50 text-gray-700 w-full relative">
        {/* WhatsApp and Chat icons - positioned at right side */}
        {footerData?.whatsapp?.enabled !== false && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
            <a
              href={`https://wa.me/${
                footerData?.whatsapp?.number || "1234567890"
              }`}
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
        )}
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
                <React.Fragment key={link.name || link.path}>
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
            {footerData?.copyright?.enabled !== false && (
              <div className="text-center pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600">
                  {footerData?.copyright?.text ||
                    "Copyright © Anand mobiles | All Rights Reserved"}
                  {footerData?.copyright?.developer_name && (
                    <>
                      {" | Developed By :"}
                      <Link to={footerData?.copyright?.developer_url || "#"}>
                        {footerData?.copyright?.developer_name}
                      </Link>
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
