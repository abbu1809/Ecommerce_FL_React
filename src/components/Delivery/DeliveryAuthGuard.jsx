import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useDeliveryPartnerStore } from "../../store/Delivery/useDeliveryPartnerStore";

const DeliveryAuthGuard = ({ children }) => {
  const { isAuthenticated, partner } = useDeliveryPartnerStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated || !partner) {
    // Redirect to login page, but save the current location they were trying to access
    return <Navigate to="/delivery/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default DeliveryAuthGuard;
