import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import { useAuthStore } from "./store/useAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Layout component that will be used across all pages
const Layout = () => {
  // Mock data for categories
  const categories = [
    { id: 1, name: "Smartphones", path: "/category/smartphones" },
    { id: 2, name: "Laptops", path: "/category/laptops" },
    { id: 3, name: "Tablets", path: "/category/tablets" },
    { id: 4, name: "Mobile Accessories", path: "/category/mobile-accessories" },
    { id: 5, name: "Laptop Accessories", path: "/category/laptop-accessories" },
    { id: 6, name: "Audio Devices", path: "/category/audio" },
  ];

  return (
    <>
      <Header categories={categories} />
      <Outlet />
      <Footer />
    </>
  );
};

const App = () => {
  const { isAuthenticated } = useAuthStore();

  // Initialize products
  React.useEffect(() => {
    const initializeStore = async () => {
      // Import dynamically to avoid circular dependencies
      const { useProductStore } = await import("./store/useProduct");
      useProductStore.getState().fetchProducts();
    };

    initializeStore();
  }, []);

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

        {/* Public Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/category/:category" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
