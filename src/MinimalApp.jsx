import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// Simple test components
const TestHome = () => (
  <div style={{ padding: "20px" }}>
    <h1>Home Page - App is Working!</h1>
    <p>The main application structure is loading correctly.</p>
  </div>
);

const TestAdmin = () => (
  <div style={{ padding: "20px" }}>
    <h1>Admin Section</h1>
    <p>Admin routes are working.</p>
  </div>
);

const MinimalApp = () => {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <header style={{ padding: "20px", backgroundColor: "#f0f0f0", marginBottom: "20px" }}>
          <h1>Ecommerce App - Debug Mode</h1>
        </header>
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/admin" element={<TestAdmin />} />
          <Route path="/admin/*" element={<TestAdmin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default MinimalApp;
