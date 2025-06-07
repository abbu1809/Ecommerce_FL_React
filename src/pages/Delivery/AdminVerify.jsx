import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiAlertTriangle,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import FormWrapper from "../../components/ui/FormWrapper";
import Button from "../../components/ui/Button";

const AdminVerify = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState("pending"); // pending, approved, rejected

  // In a real app, this would fetch the status from an API
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // For demo purposes, randomly choose a status
        const statuses = ["pending", "approved", "rejected"];
        const randomStatus =
          statuses[Math.floor(Math.random() * statuses.length)];

        setVerificationStatus(randomStatus);
      } catch (error) {
        console.error("Error fetching verification status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerificationStatus();
  }, []);

  const handleBackToLogin = () => {
    navigate("/delivery/login");
  };

  const handleReapply = () => {
    navigate("/delivery/register");
  };

  const handleContactSupport = () => {
    // In a real app, this would open a support form or chat
    window.open("mailto:support@example.com", "_blank");
  };

  // Content based on verification status
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center py-8">
          <div
            className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 mb-4"
            style={{ borderColor: "var(--brand-primary)" }}
          ></div>
          <p
            className="text-center text-sm mt-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Checking your verification status...
          </p>
        </div>
      );
    }

    if (verificationStatus === "approved") {
      return (
        <div className="text-center py-6">
          <div className="flex justify-center mb-6">
            <div
              className="h-24 w-24 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--success-color)20",
                color: "var(--success-color)",
              }}
            >
              <FiCheckCircle size={64} />
            </div>
          </div>

          <h2
            className="text-xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Verification Approved!
          </h2>

          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Your account has been verified by our admin team. You can now log in
            to access your delivery dashboard.
          </p>

          <Button
            variant="primary"
            icon={<FiUserCheck className="mr-2" />}
            onClick={handleBackToLogin}
            fullWidth={true}
          >
            Log In to Your Account
          </Button>
        </div>
      );
    }

    if (verificationStatus === "rejected") {
      return (
        <div className="text-center py-6">
          <div className="flex justify-center mb-6">
            <div
              className="h-24 w-24 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: "var(--error-color)20",
                color: "var(--error-color)",
              }}
            >
              <FiAlertTriangle size={64} />
            </div>
          </div>

          <h2
            className="text-xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Verification Rejected
          </h2>

          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            Unfortunately, your account verification was not approved. This
            could be due to incomplete or incorrect information provided during
            registration.
          </p>

          <div className="space-y-3">
            <Button
              variant="primary"
              icon={<FiUserCheck className="mr-2" />}
              onClick={handleReapply}
              fullWidth={true}
            >
              Reapply with Correct Information
            </Button>

            <Button
              variant="secondary"
              onClick={handleContactSupport}
              fullWidth={true}
            >
              Contact Support
            </Button>
          </div>
        </div>
      );
    }

    // Default: Pending verification
    return (
      <div className="text-center py-6">
        <div className="flex justify-center mb-6">
          <div
            className="h-24 w-24 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "var(--warning-color)20",
              color: "var(--warning-color)",
            }}
          >
            <FiUserX size={64} />
          </div>
        </div>

        <h2
          className="text-xl font-bold mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Verification Pending
        </h2>

        <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
          Your account is currently under review by our admin team. This process
          usually takes 1-2 business days. We'll notify you by email once your
          account is verified.
        </p>

        <div className="space-y-3">
          <Button
            variant="secondary"
            onClick={handleBackToLogin}
            fullWidth={true}
          >
            Back to Login
          </Button>

          <Button
            variant="outline"
            onClick={handleContactSupport}
            fullWidth={true}
          >
            Contact Support
          </Button>
        </div>

        <div
          className="text-xs mt-6 p-4 rounded-md"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-secondary)",
          }}
        >
          <strong>Note:</strong> You will receive an email notification when
          your account is verified. If you don't see the email, please check
          your spam folder.
        </div>
      </div>
    );
  };

  return (
    <FormWrapper title="Account Verification Status">
      <div
        className="mt-4 text-center text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        Delivery partner account verification
      </div>

      {renderContent()}
    </FormWrapper>
  );
};

export default AdminVerify;
