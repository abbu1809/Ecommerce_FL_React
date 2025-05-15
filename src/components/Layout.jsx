import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  // Mock data for categories - focused on product catalog
  const categories = [
    { id: 1, name: "Smartphones", path: "/category/smartphones" },
    { id: 2, name: "Laptops", path: "/category/laptops" },
    { id: 3, name: "Tablets", path: "/category/tablets" },
    { id: 4, name: "Mobile Accessories", path: "/category/mobile-accessories" },
    { id: 5, name: "Laptop Accessories", path: "/category/laptop-accessories" },
    { id: 6, name: "Audio Devices", path: "/category/audio" },
  ];

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      {/* Header Component */}
      <Header categories={categories} />

      {/* Main Content Area */}
      <main className="flex-grow py-6">
        <div className="container mx-auto px-4">{children}</div>
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default Layout;
