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
import OrderStatus from "./pages/OrderStatus";
import OrderTracking from "./pages/OrderTracking";
import OrderTrackingDetail from "./pages/OrderTrackingDetail";
import Account from "./pages/Account";
import { useAuthStore } from "./store/useAuth";
import { useAdminAuthStore } from "./store/Admin/useAdminAuth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLayout from "./components/Admin/AdminLayout";
import {
  PartnerLogin,
  PartnerRegister,
  DeliveryDashboard,
  DeliveryAssignmentList,
  DeliveryStatusUpdate,
  DeliveryHistory,
  DeliverySettings,
  AdminVerify,
} from "./pages/Delivery";
import {
  AdminLogin,
  AdminRegister,
  AdminDashboard,
  AdminProducts,
  AdminInventory,
  AdminOrders,
  AdminUsers,
  AdminReturns,
  AdminReviews,
  AdminContent,
} from "./pages/Admin";

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
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  const { isAuthenticated: isAdminAuthenticated, checkAdminAuthStatus } =
    useAdminAuthStore();

  // Initialize products and authentication
  React.useEffect(() => {
    const initializeStore = async () => {
      // Initialize authentication state from localStorage
      checkAuthStatus();

      // Initialize admin authentication state from localStorage
      checkAdminAuthStatus();

      // Import dynamically to avoid circular dependencies
      const { useProductStore } = await import("./store/useProduct");
      useProductStore.getState().fetchProducts();
    };

    initializeStore();
  }, [checkAuthStatus, checkAdminAuthStatus]);

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
        {/* Delivery Partner Routes - keeping these outside the main Layout */}
        <Route path="/delivery">
          <Route path="login" element={<PartnerLogin />} />
          <Route path="register" element={<PartnerRegister />} />
          {/* Protected Delivery Partner Routes 
              TODO: Implement a useDeliveryAuth hook for partner authentication
              and protect these routes similar to admin routes */}
          <Route path="dashboard" element={<DeliveryDashboard />} />
          <Route path="assignments" element={<DeliveryAssignmentList />} />
          <Route path="update/:id" element={<DeliveryStatusUpdate />} />
          <Route path="status-update" element={<DeliveryStatusUpdate />} />
          <Route path="history" element={<DeliveryHistory />} />
          <Route path="settings" element={<DeliverySettings />} />{" "}
          {/* This route is for admin verification of delivery partners */}
          <Route
            path="verification"
            element={
              isAdminAuthenticated ? (
                <AdminVerify />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
        </Route>
        {/* Public Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/category/:category" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<OrderStatus />} />
          <Route path="/order-tracking" element={<OrderTracking />} />
          <Route path="/order-tracking/:id" element={<OrderTrackingDetail />} />

          {/* Account Routes */}
          <Route path="/profile" element={<Account />} />
          <Route path="/profile/:section" element={<Account />} />
        </Route>{" "}
        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            !isAdminAuthenticated ? (
              <AdminLogin />
            ) : (
              <Navigate to="/admin/dashboard" />
            )
          }
        />
        <Route
          path="/admin/register"
          element={
            !isAdminAuthenticated ? (
              <AdminRegister />
            ) : (
              <Navigate to="/admin/dashboard" />
            )
          }
        />{" "}
        <Route element={<AdminLayout />}>
          {" "}
          <Route
            path="/admin/dashboard"
            element={
              isAdminAuthenticated ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/products"
            element={
              isAdminAuthenticated ? (
                <AdminProducts />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/inventory"
            element={
              isAdminAuthenticated ? (
                <AdminInventory />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/orders"
            element={
              isAdminAuthenticated ? (
                <AdminOrders />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/users"
            element={
              isAdminAuthenticated ? (
                <AdminUsers />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/returns"
            element={
              isAdminAuthenticated ? (
                <AdminReturns />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />{" "}
          <Route
            path="/admin/content"
            element={
              isAdminAuthenticated ? (
                <AdminContent />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
          <Route
            path="/admin/reviews"
            element={
              isAdminAuthenticated ? (
                <AdminReviews />
              ) : (
                <Navigate to="/admin/login" />
              )
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
