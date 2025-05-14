import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useAuthStore } from "./store/useAuth";

const App = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />

        {/* Protected Routes will be added here */}
        <Route
          path="/"
          element={
            <div className="text-center p-8">
              <h1 className="text-3xl font-bold">Welcome to Anand Mobiles</h1>
              <p className="mt-4">Your Trusted Mobile Partner</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
