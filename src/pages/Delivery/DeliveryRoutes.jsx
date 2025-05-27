import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { DeliveryAuthGuard } from "../../components/Delivery";

// Import delivery pages
import DeliveryDashboard from "./DeliveryDashboard";
import DeliveryAssignmentList from "./DeliveryAssignmentList";
import DeliveryStatusUpdate from "./DeliveryStatusUpdate";
import DeliveryHistory from "./DeliveryHistory";
import DeliverySettings from "./DeliverySettings";
import PartnerLogin from "./PartnerLogin";
import PartnerRegister from "./PartnerRegister";
import AdminVerify from "./AdminVerify";

const DeliveryRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PartnerLogin />} />
      <Route path="/register" element={<PartnerRegister />} />
      <Route path="/admin-verify" element={<AdminVerify />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <DeliveryAuthGuard>
            <DeliveryDashboard />
          </DeliveryAuthGuard>
        }
      />

      <Route
        path="/assignments"
        element={
          <DeliveryAuthGuard>
            <DeliveryAssignmentList />
          </DeliveryAuthGuard>
        }
      />

      <Route
        path="/status-update"
        element={
          <DeliveryAuthGuard>
            <DeliveryStatusUpdate />
          </DeliveryAuthGuard>
        }
      />

      <Route
        path="/status-update/:id"
        element={
          <DeliveryAuthGuard>
            <DeliveryStatusUpdate />
          </DeliveryAuthGuard>
        }
      />

      <Route
        path="/history"
        element={
          <DeliveryAuthGuard>
            <DeliveryHistory />
          </DeliveryAuthGuard>
        }
      />

      <Route
        path="/settings"
        element={
          <DeliveryAuthGuard>
            <DeliverySettings />
          </DeliveryAuthGuard>
        }
      />

      {/* Redirect to dashboard as default */}
      <Route path="/" element={<Navigate to="/delivery/dashboard" replace />} />
    </Routes>
  );
};

export default DeliveryRoutes;
