//import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Simple test component
const TestHome = () => <div style={{ padding: "20px" }}>Home Page Works!</div>;
const TestLogin = () => <div style={{ padding: "20px" }}>Login Page Works!</div>;

const App = () => {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "Arial, sans-serif" }}>
        <header style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
          <h1>Test Header</h1>
        </header>
        <Routes>
          <Route path="/" element={<TestHome />} />
          <Route path="/login" element={<TestLogin />} />
          <Route path="/admin" element={<Navigate to="/login" />} />
        </Routes>
        <footer style={{ padding: "20px", backgroundColor: "#f0f0f0", marginTop: "20px" }}>
          <p>Test Footer</p>
        </footer>
      </div>
    </BrowserRouter>
  );
};

export default App;
